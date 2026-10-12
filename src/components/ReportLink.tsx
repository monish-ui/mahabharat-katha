import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'

const SUPPORT_EMAIL = 'udit.punjabi@illuminatiai.tech'

// "Report a mistake": the top complaint about competing apps is wrong shlokas and spelling errors
// with no way to tell anyone. One tap opens a prefilled email with the exact reference.
export default function ReportLink({ reference }: { reference: string }) {
  const { t } = useStore()
  const subject = encodeURIComponent(`[Mahabharat Katha] ${t(UI.reportMistake)}: ${reference}`)
  const body = encodeURIComponent(`${reference}\n\n`)
  return (
    <a href={`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`} className="text-xs text-ink-2 dark:text-cream/60 underline underline-offset-2">
      {t(UI.reportMistake)}
    </a>
  )
}
