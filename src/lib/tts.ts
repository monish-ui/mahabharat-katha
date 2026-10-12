// Free, offline-capable narration: uses the device's own text-to-speech engine.
// On Android (Capacitor WebView) this is the Google TTS engine, which ships with Hindi voices.
// If a real MP3 narration exists for an item it is preferred (see playAudio).
import type { Lang } from './types'

let audioEl: HTMLAudioElement | null = null
const listeners = new Set<(playing: boolean) => void>()

function notify(playing: boolean) { listeners.forEach((l) => l(playing)) }
export function onPlayState(l: (p: boolean) => void) { listeners.add(l); return () => { listeners.delete(l) } }

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Prefer an Indian voice. Hindi voices read Devanagari Sanskrit far better than English ones,
// so even in English mode the Sanskrit line is spoken by the Hindi voice (see speak()).
function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const want = lang === 'hi' ? ['hi-IN', 'hi', 'mr-IN', 'en-IN'] : ['en-IN', 'hi-IN', 'en-GB', 'en-US', 'en']
  for (const w of want) {
    // Google's and Microsoft's voices are much more natural than the generic ones.
    const pref = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(w.toLowerCase()))
    const v = pref.find((v) => /google|microsoft|natural|neural/i.test(v.name)) ?? pref[0]
    if (v) return v
  }
  return undefined
}

const DEVANAGARI = /[ऀ-ॿ]/

export function stop() {
  if (ttsSupported()) window.speechSynthesis.cancel()
  if (audioEl) { audioEl.pause(); audioEl = null }
  // reset
  notify(false)
}

export function isPlaying(): boolean {
  return (ttsSupported() && window.speechSynthesis.speaking) || (!!audioEl && !audioEl.paused)
}

// Speak long text in chunks so Android TTS does not cut off mid-paragraph.
export function speak(text: string, lang: Lang, rate = 0.85) {
  if (!ttsSupported()) return
  stop()
  const chunks = text
    .split(/\n+|(?<=[।॥\.!\?])\s+/)
    .map((c) => c.trim())
    .filter(Boolean)
  if (chunks.length === 0) return
  const voice = pickVoice(lang)
  const hindiVoice = lang === 'hi' ? voice : pickVoice('hi')
  let i = 0
  const next = () => {
    if (i >= chunks.length) { notify(false); return }
    const chunk = chunks[i++]
    const u = new SpeechSynthesisUtterance(chunk)
    const sanskrit = DEVANAGARI.test(chunk)
    // Sanskrit/Hindi text always goes to the Hindi voice, read slowly and a little lower, like a katha vachak.
    u.lang = sanskrit ? 'hi-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN'
    const v = sanskrit ? hindiVoice : voice
    if (v) u.voice = v
    u.rate = sanskrit ? Math.min(rate, 0.75) : rate
    u.pitch = 0.9
    u.onend = next
    u.onerror = () => notify(false)

    window.speechSynthesis.speak(u)
  }
  notify(true)
  next()
}

// Play a real narration file when one exists (e.g. /audio/gita/2.mp3 bundled or hosted on a free CDN).
export async function playAudio(url: string): Promise<boolean> {
  stop()
  try {
    const el = new Audio(url)
    el.onended = () => { audioEl = null; notify(false) }
    el.onerror = () => { audioEl = null; notify(false) }
    await el.play()
    audioEl = el
    notify(true)
    return true
  } catch {
    return false
  }
}

if (ttsSupported()) {
  // Chrome loads voices asynchronously.
  window.speechSynthesis.onvoiceschanged = () => { /* voices ready */ }
}
