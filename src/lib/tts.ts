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

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const want = lang === 'hi' ? ['hi-IN', 'hi'] : ['en-IN', 'en-GB', 'en-US', 'en']
  for (const w of want) {
    const v = voices.find((v) => v.lang.toLowerCase().startsWith(w.toLowerCase()))
    if (v) return v
  }
  return undefined
}

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
export function speak(text: string, lang: Lang, rate = 0.95) {
  if (!ttsSupported()) return
  stop()
  const chunks = text
    .split(/\n+|(?<=[।॥\.!\?])\s+/)
    .map((c) => c.trim())
    .filter(Boolean)
  if (chunks.length === 0) return
  const voice = pickVoice(lang)
  let i = 0
  const next = () => {
    if (i >= chunks.length) { notify(false); return }
    const u = new SpeechSynthesisUtterance(chunks[i++])
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    if (voice) u.voice = voice
    u.rate = rate
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
