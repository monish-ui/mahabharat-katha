"""
Narrated videos: public-domain paintings with slow zoom + synced Hindi subtitles + the same neural voice.

  py -3 scripts/make-video.py                 # renders the samples listed in SAMPLES
  py -3 scripts/make-video.py --only katha_adi-parva--bhishma-pratigya

Output: video/<id>.mp4  (720x1280 portrait, H.264 + AAC), id matches the audio asset name.
Needs: edge-tts, ffmpeg (D:\\video-tools\\ffmpeg\\bin), paintings in media/art (see media/credits.json).
"""
import argparse, asyncio, importlib.util, json, math, os, re, shutil, subprocess, sys
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("make_audio", ROOT / "scripts" / "make-audio.py")
ma = importlib.util.module_from_spec(spec); spec.loader.exec_module(ma)

FFMPEG = ma.FFMPEG or sys.exit("ffmpeg not found")
FFPROBE = str(Path(FFMPEG).with_name("ffprobe.exe" if FFMPEG.endswith(".exe") else "ffprobe"))
ART = ROOT / "media" / "art"
OUT = ROOT / "video"
WORK = ROOT / "builds" / "video-work"
W, H, FPS = 720, 1280, 25
GAP = 0.9

SAMPLES = {
    "gita_2.47": {
        "title": "श्रीमद्भगवद्गीता  २.४७",
        "images": ["gita-krishna-arjuna-1830.jpg", "gita-chariot-karna-1820.jpg"],
        "credit": "चित्र: पहाड़ी चित्रकला, लगभग 1820–1830 (सार्वजनिक डोमेन)",
    },
    "gita-ch_2": {
        "title": "गीता अध्याय २ • सांख्य योग",
        "images": ["gita-krishna-arjuna-1830.jpg", "gita-arjuna-chooses-krishna.jpg", "gita-chariot-karna-1820.jpg"],
        "credit": "चित्र: भारतीय लघुचित्र, 18वीं–19वीं सदी (सार्वजनिक डोमेन)",
    },
    "katha_adi-parva--bhishma-pratigya": {
        "title": "आदि पर्व • भीष्म प्रतिज्ञा",
        "images": ["rv-shantanu-satyavati.jpg", "rv-bhishma-resolve.jpg", "rv-bhishma-oath.jpg", "rv-ganga-bhishma.jpg"],
        "credit": "चित्र: राजा रवि वर्मा (सार्वजनिक डोमेन)",
    },
}


def run(cmd, cwd=None):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise RuntimeError(f"{cmd[0]} failed:\n{r.stderr[-2500:]}")
    return r.stdout


def duration(p: Path) -> float:
    return float(run([FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).strip())


def segments_for(vid: str):
    kind, key = vid.split("_", 1)
    want = {"gita": ROOT / "audio" / "gita" / f"{key}.mp3",
            "gita-ch": ROOT / "audio" / "gita-ch" / f"{key}.mp3",
            "katha": ROOT / "audio" / "katha" / f"{key}.mp3"}[kind]
    for segs, out in ma.jobs("all", False):
        if Path(out) == want:
            return segs
    raise KeyError(vid)


async def tts_with_timings(segs, work: Path):
    """Speak each segment, keep sentence boundaries, join with gaps. Returns (audio_path, cues)."""
    parts, cues, t0 = [], [], 0.0
    for i, (text, style) in enumerate(segs):
        for attempt in range(5):
            try:
                com = edge_tts.Communicate(text, ma.VOICE, rate=style["rate"], pitch=style["pitch"], boundary="SentenceBoundary")
                audio, sents = bytearray(), []
                async for ch in com.stream():
                    if ch["type"] == "audio":
                        audio += ch["data"]
                    elif ch["type"] == "SentenceBoundary":
                        sents.append((ch["offset"] / 1e7, ch["duration"] / 1e7, ch["text"]))
                break
            except Exception as e:
                if attempt == 4: raise
                print(f"  tts retry {attempt+1}: {type(e).__name__}")
                await asyncio.sleep(5 * (attempt + 1))
        p = work / f"part{i}.mp3"
        p.write_bytes(audio)
        d = duration(p)
        sanskrit = style is ma.SANSKRIT
        if sanskrit:
            # One cue for the whole verse, shown with its original line breaks.
            cues.append({"start": t0, "end": t0 + d, "text": text, "sanskrit": True})
        else:
            for k, (off, dur, s) in enumerate(sents):
                end = sents[k + 1][0] if k + 1 < len(sents) else d
                cues.append({"start": t0 + off, "end": t0 + max(off + dur, end - 0.05), "text": s, "sanskrit": False})
        parts.append(p)
        t0 += d + GAP
    out = work / "audio.mp3"
    ma.join(parts, out, GAP)
    return out, cues


def split_long(cues, max_chars=95):
    """Break long sentences into readable chunks, timing proportional to characters."""
    out = []
    for c in cues:
        if c["sanskrit"] or len(c["text"]) <= max_chars:
            out.append(c); continue
        words = c["text"].split()
        chunks, cur = [], ""
        for w in words:
            if len(cur) + len(w) + 1 > max_chars and cur:
                chunks.append(cur); cur = w
            else:
                cur = (cur + " " + w).strip()
        if cur: chunks.append(cur)
        total = sum(len(x) for x in chunks)
        t = c["start"]
        for x in chunks:
            d = (c["end"] - c["start"]) * len(x) / total
            out.append({"start": t, "end": t + d, "text": x, "sanskrit": False}); t += d
    return out


def ass_time(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def ass_escape(s):
    return s.replace("\\", "\\\\").replace("{", "(").replace("}", ")")


def write_ass(path: Path, title, credit, cues, total):
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Title,Nirmala UI,40,&H008BD9F8,&H000000FF,&H00101040,&H96000000,1,0,0,0,100,100,0,0,3,14,0,8,40,40,70,1
Style: Sub,Nirmala UI,40,&H00ECF8FF,&H000000FF,&H00000000,&HA0000000,1,0,0,0,100,100,0,0,3,16,0,2,48,48,150,1
Style: Shloka,Nirmala UI,44,&H004CB2F3,&H000000FF,&H00000000,&HA0000000,1,0,0,0,100,100,0,0,3,18,0,2,40,40,170,1
Style: Credit,Nirmala UI,22,&H00C8D8E8,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,3,8,0,2,30,30,40,1
Style: Brand,Nirmala UI,24,&H004CB2F3,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,2,1,7,26,26,24,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = [
        f"Dialogue: 2,{ass_time(0)},{ass_time(total)},Brand,,0,0,0,,ॐ महाभारत कथा",
        f"Dialogue: 2,{ass_time(0)},{ass_time(total)},Title,,0,0,0,,{{\\fad(600,0)}}{ass_escape(title)}",
        f"Dialogue: 1,{ass_time(0.3)},{ass_time(5.5)},Credit,,0,0,0,,{{\\fad(400,400)}}{ass_escape(credit)}",
    ]
    for c in cues:
        style = "Shloka" if c["sanskrit"] else "Sub"
        text = ass_escape(c["text"]).replace("\n", "\\N")
        ev.append(f"Dialogue: 0,{ass_time(c['start'])},{ass_time(c['end'])},{style},,0,0,0,,{{\\fad(150,150)}}{text}")
    path.write_text(head + "\n".join(ev) + "\n", encoding="utf-8")


def render(vid, meta, audio: Path, ass: Path, work: Path, total: float):
    imgs = [ART / x for x in meta["images"]]
    n = len(imgs)
    xf = 1.2                                      # crossfade seconds
    slide = (total + xf * (n - 1)) / n            # each slide length incl. overlap
    frames = math.ceil(slide * FPS) + 2
    zoom_step = 0.10 / frames                     # ~10% zoom over a slide
    inputs, chains = [], []
    for i, img in enumerate(imgs):
        inputs += ["-i", str(img)]
        # alternate zoom-in and gentle drift so consecutive slides feel different
        zexpr = f"min(1+{zoom_step:.7f}*on,1.10)" if i % 2 == 0 else f"max(1.10-{zoom_step:.7f}*on,1.0)"
        chains.append(
            f"[{i}:v]split[b{i}][f{i}];"
            f"[b{i}]scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},gblur=sigma=40,eq=brightness=-0.22:saturation=0.9[bg{i}];"
            f"[f{i}]scale={W*2-80}:{H*2-520}:force_original_aspect_ratio=decrease[fg{i}];"
            f"[bg{i}][fg{i}]overlay=(W-w)/2:(H-h)/2-60,format=yuv420p,"
            f"zoompan=z='{zexpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS},"
            f"trim=duration={slide:.3f},setpts=PTS-STARTPTS[s{i}]"
        )
    # crossfade chain
    last, offset = "s0", 0.0
    for i in range(1, n):
        offset += slide - xf
        chains.append(f"[{last}][s{i}]xfade=transition=fade:duration={xf}:offset={offset:.3f}[x{i}]")
        last = f"x{i}"
    # vignette-ish darkening at the bottom for subtitle legibility, then subtitles
    chains.append(f"[{last}]trim=duration={total:.3f},drawbox=x=0:y=ih*0.62:w=iw:h=ih*0.38:color=black@0.28:t=fill,"
                  f"subtitles=sub.ass:fontsdir='C\\:/Windows/Fonts'[v]")
    out = OUT / f"{vid}.mp4"
    OUT.mkdir(parents=True, exist_ok=True)
    cmd = [FFMPEG, "-y", "-loglevel", "error", *inputs, "-i", str(audio),
           "-filter_complex", ";".join(chains), "-map", "[v]", "-map", f"{n}:a",
           "-c:v", "libx264", "-preset", "medium", "-crf", "26", "-pix_fmt", "yuv420p", "-r", str(FPS),
           "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest", str(out)]
    run(cmd, cwd=str(work))
    return out


def original_shloka(vid):
    """Display the verse exactly as written (with dandas), not the TTS-cleaned text."""
    if not vid.startswith("gita_"): return None
    verse = vid.split("_", 1)[1]
    for ch in json.loads((ROOT / "content" / "gita.json").read_text("utf-8"))["chapters"]:
        for s in ch["shlokas"]:
            if s["verse"] == verse:
                return s["sanskrit"]
    return None


async def build(vid, meta):
    work = WORK / vid
    if work.exists(): shutil.rmtree(work)
    work.mkdir(parents=True)
    segs = segments_for(vid)
    audio, cues = await tts_with_timings(segs, work)
    total = duration(audio)
    orig = original_shloka(vid)
    if orig:
        for c in cues:
            if c["sanskrit"]: c["text"] = orig
    cues = split_long(cues)
    write_ass(work / "sub.ass", meta["title"], meta["credit"], cues, total)
    out = render(vid, meta, audio, work / "sub.ass", work, total)
    print(f"{out.name}: {total:.1f}s, {len(cues)} subtitle cues, {out.stat().st_size/1e6:.1f} MB")


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    a = ap.parse_args()
    for vid, meta in SAMPLES.items():
        if a.only and vid != a.only: continue
        if not a.only and (OUT / f"{vid}.mp4").exists() and vid != "gita_2.47": continue
        await build(vid, meta)

if __name__ == "__main__":
    asyncio.run(main())
