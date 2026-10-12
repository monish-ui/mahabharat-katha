import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { ShareIcon } from './Icons'

export default function ShareButton({ text, title }: { text: string; title?: string }) {
  const { t } = useStore()
  const onClick = async () => {
    const payload = `${text}\n\n${t(UI.appName)}`
    try {
      if (navigator.share) await navigator.share({ title: title ?? t(UI.appName), text: payload })
      else await navigator.clipboard.writeText(payload)
    } catch { /* user cancelled */ }
  }
  return <button onClick={onClick} className="p-2" aria-label={t(UI.share)}><ShareIcon className="w-5 h-5" /></button>
}
