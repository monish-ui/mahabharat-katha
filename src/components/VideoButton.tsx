import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { stop } from '../lib/tts'
import { PlayIcon } from './Icons'

// Opens a full-screen player for a narrated video. Renders nothing when there is no video for the item.
export default function VideoButton({ url, size = 'md' }: { url?: string; size?: 'sm' | 'md' }) {
  const { t } = useStore()
  const [open, setOpen] = useState(false)
  if (!url) return null
  const cls = size === 'sm' ? 'btn-ghost px-3 py-1.5 text-xs' : 'btn-ghost'
  return (
    <>
      <button className={cls} onClick={() => { stop(); setOpen(true) }}>
        <PlayIcon className="w-4 h-4" />
        {t(UI.watchVideo)}
      </button>
      {open && <Player url={url} onClose={() => setOpen(false)} />}
    </>
  )
}

function Player({ url, onClose }: { url: string; onClose: () => void }) {
  const { t } = useStore()
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    // Android back button: close the player instead of leaving the page.
    history.pushState({ video: true }, '')
    const onPop = () => onClose()
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', onPop)
      ref.current?.pause()
    }
  }, [onClose])
  const close = () => { if (history.state?.video) history.back(); else onClose() }
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black flex flex-col safe-top safe-bottom" role="dialog" aria-modal="true">
      <div className="flex justify-end p-2">
        <button onClick={close} className="chip bg-white/15 text-white text-sm py-1.5 px-3">✕ {t(UI.close)}</button>
      </div>
      <video ref={ref} src={url} controls autoPlay playsInline preload="metadata" className="flex-1 w-full h-full object-contain bg-black" />
    </div>,
    document.body
  )
}
