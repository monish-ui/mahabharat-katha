import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { isPlaying, onPlayState, playAudio, speak, stop, ttsSupported } from '../lib/tts'
import { PlayIcon, StopIcon } from './Icons'
import type { Lang } from '../lib/types'

type Props = { text: string; lang?: Lang; audioUrl?: string; size?: 'sm' | 'md' }

// One button: plays a real narration if `audioUrl` exists, else reads the text aloud with device TTS.
export default function AudioButton({ text, lang, audioUrl, size = 'md' }: Props) {
  const { t, lang: uiLang } = useStore()
  const [playing, setPlaying] = useState(isPlaying())
  const [mine, setMine] = useState(false)
  useEffect(() => onPlayState((p) => { setPlaying(p); if (!p) setMine(false) }), [])
  if (!ttsSupported() && !audioUrl) return null
  const active = playing && mine
  const onClick = async () => {
    if (active) { stop(); return }
    setMine(true)
    if (audioUrl && (await playAudio(audioUrl))) return
    speak(text, lang ?? uiLang)
  }
  const cls = size === 'sm' ? 'btn-ghost px-3 py-1.5 text-xs' : 'btn-primary'
  return (
    <button onClick={onClick} className={cls} aria-pressed={active}>
      {active ? <StopIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
      {active ? t(UI.stopListening) : t(UI.listen)}
    </button>
  )
}
