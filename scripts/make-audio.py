"""
Generate proper narration MP3s for the app with a neural Indian voice (Microsoft Edge TTS, free, no key).

  py -3 scripts/make-audio.py --sample          # one shloka + one story, to judge the voice
  py -3 scripts/make-audio.py                   # everything that is missing in audio/
  py -3 scripts/make-audio.py --kind gita       # only shlokas

Output layout (served from a GitHub Release, see scripts/publish-audio.sh):
  audio/gita/2.47.mp3            Sanskrit (slow, low) + Hindi meaning
  audio/gita-ch/2.mp3            chapter title + summary + lesson
  audio/katha/<parva>--<story>.mp3   story title + body + lesson
"""
import argparse, asyncio, json, os, re, sys, subprocess, shutil
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.exit("pip install edge-tts")

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
OUT = ROOT / "audio"
VOICE = "hi-IN-MadhurNeural"          # male narrator; hi-IN-SwaraNeural for female
HINDI = dict(rate="-8%", pitch="-6Hz")   # calm katha pace
SANSKRIT = dict(rate="-28%", pitch="-10Hz")  # slow, weighty chant-like reading
FFMPEG = shutil.which("ffmpeg") or next((p for p in [r"D:\video-tools\ffmpeg\bin\ffmpeg.exe", r"D:\video-tools\ffmpeg.exe"] if os.path.exists(p)), None)

def clean(text: str) -> str:
    t = text.replace("\u2014", ", ").replace("\u2013", ", ").replace("\u2018", "").replace("\u2019", "").replace("\u201c", "").replace("\u201d", "")
    t = re.sub(r"[\U0001F300-\U0001FAFF\u2600-\u27BF]", "", t)
    t = t.replace("\n\n", ". ").replace("\n", ", ")
    return re.sub(r"\s+", " ", t).strip()

def clean_sanskrit(text: str) -> str:
    # Danda marks are not read by the voice; turn them into sentence pauses.
    t = text.replace("\u0965", ".").replace("\u0964", ".").replace("\n", ". ")
    t = t.replace("उवाच", "उवाच.")
    return re.sub(r"\s+", " ", t).strip()

async def tts(text: str, path: Path, style: dict):
    com = edge_tts.Communicate(text, VOICE, rate=style["rate"], pitch=style["pitch"])
    await com.save(str(path))

def join(parts: list[Path], out: Path, gap_s: float = 0.9):
    """Concatenate MP3 parts with a short silence between them. Uses ffmpeg when present, else raw concat."""
    if FFMPEG:
        inputs = []
        filt = []
        for i, p in enumerate(parts):
            inputs += ["-i", str(p)]
        n = len(parts)
        # silence between parts via aevalsrc
        inputs += ["-f", "lavfi", "-t", str(gap_s), "-i", "anullsrc=r=24000:cl=mono"]
        chain = []
        for i in range(n):
            chain.append(f"[{i}:a]")
            if i < n - 1:
                chain.append(f"[{n}:a]")
        filt = "".join(chain) + f"concat=n={2*n-1}:v=0:a=1[a]"
        cmd = [FFMPEG, "-y", "-loglevel", "error", *inputs, "-filter_complex", filt, "-map", "[a]", "-c:a", "libmp3lame", "-b:a", "64k", "-ar", "24000", str(out)]
        subprocess.run(cmd, check=True)
    else:
        with open(out, "wb") as f:
            for p in parts:
                f.write(p.read_bytes())

async def make(segments: list[tuple[str, dict]], out: Path, sem: asyncio.Semaphore):
    if out.exists():
        return False
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = []
    async with sem:
        for i, (text, style) in enumerate(segments):
            if not text.strip():
                continue
            p = out.with_suffix(f".part{i}.mp3")
            for attempt in range(3):
                try:
                    await tts(text, p, style)
                    break
                except Exception as e:  # network hiccup
                    if attempt == 2:
                        raise
                    await asyncio.sleep(2)
            tmp.append(p)
    join(tmp, out)
    for p in tmp:
        p.unlink(missing_ok=True)
    return True

def load(name):
    return json.loads((CONTENT / name).read_text("utf-8"))

def jobs(kind: str, sample: bool):
    g = load("gita.json")["chapters"]
    parvas = []
    for f in sorted(CONTENT.glob("mahabharat*.json")):
        parvas += json.loads(f.read_text("utf-8"))["parvas"]
    out = []
    if kind in ("all", "gita"):
        for ch in g:
            for s in ch["shlokas"]:
                out.append(([(clean_sanskrit(s["sanskrit"]), SANSKRIT), ("अर्थ. " + clean(s["meaning"]["hi"]), HINDI)], OUT / "gita" / f"{s['verse']}.mp3"))
    if kind in ("all", "gita-ch"):
        for ch in g:
            text = f"श्रीमद्भगवद्गीता, अध्याय {ch['number']}, {ch['title']['hi']}. {clean(ch['summary']['hi'])}. सीख. {clean(ch['lesson']['hi'])}"
            out.append(([(text, HINDI)], OUT / "gita-ch" / f"{ch['number']}.mp3"))
    if kind in ("all", "katha"):
        for p in parvas:
            for s in p["stories"]:
                text = f"{p['title']['hi']}. {s['title']['hi']}. {clean(s['body']['hi'])}. इस कथा की सीख. {clean(s['lesson']['hi'])}"
                out.append(([(text, HINDI)], OUT / "katha" / f"{p['slug']}--{s['slug']}.mp3"))
    if sample:
        pick = [j for j in out if j[1].name in ("2.47.mp3",)] + [j for j in out if j[1].parent.name == "katha"][:1]
        return pick
    return out

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--kind", default="all", choices=["all", "gita", "gita-ch", "katha"])
    ap.add_argument("--sample", action="store_true")
    ap.add_argument("--voice", default=VOICE)
    a = ap.parse_args()
    globals()["VOICE"] = a.voice
    js = jobs(a.kind, a.sample)
    sem = asyncio.Semaphore(3)
    done = 0
    results = await asyncio.gather(*(make(seg, out, sem) for seg, out in js), return_exceptions=True)
    errs = [r for r in results if isinstance(r, Exception)]
    done = sum(1 for r in results if r is True)
    print(f"jobs {len(js)}, generated {done}, skipped {len(js)-done-len(errs)}, errors {len(errs)}; ffmpeg={'yes' if FFMPEG else 'no'}")
    for e in errs[:5]:
        print("ERR", e)

if __name__ == "__main__":
    asyncio.run(main())
