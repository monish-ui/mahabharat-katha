import { useStore } from '../lib/store'
import { UI, toDevanagariDigits } from '../lib/i18n'
import type { Shloka } from '../lib/types'
import AudioButton from './AudioButton'
import BookmarkButton from './BookmarkButton'
import ShareButton from './ShareButton'
import ReportLink from './ReportLink'

export default function ShlokaCard({ shloka, showMeaningLabel = true }: { shloka: Shloka; showMeaningLabel?: boolean }) {
  const { t, lang } = useStore()
  const id = `gita:${shloka.verse}`
  const ref = lang === 'hi' ? toDevanagariDigits(shloka.verse) : shloka.verse
  const shareText = `${shloka.sanskrit}\n\n${t(shloka.meaning)}\n\n— ${t(UI.bhagavadGita)} ${shloka.verse}`
  return (
    <article className="card p-4 ornament">
      <div className="flex items-center justify-between mb-2">
        <span className="chip bg-saffron/15 text-maroon dark:text-saffron-2">{t(UI.gita)} {ref}</span>
        <div className="flex items-center">
          <ShareButton text={shareText} />
          <BookmarkButton id={id} compact />
        </div>
      </div>
      <p className="shloka text-[1.15em] text-maroon dark:text-saffron-2 whitespace-pre-line text-center font-medium">{shloka.sanskrit}</p>
      <p className="mt-2 text-xs text-ink-2 dark:text-cream/60 italic text-center whitespace-pre-line">{shloka.transliteration}</p>
      <div className="mt-3 border-t border-saffron/20 pt-3">
        {showMeaningLabel && <p className="text-xs font-semibold uppercase tracking-wide text-ink-2 dark:text-cream/60 mb-1">{t(UI.meaning)}</p>}
        <p className="leading-relaxed">{t(shloka.meaning)}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <AudioButton size="sm" text={`${shloka.sanskrit}. ${t(shloka.meaning)}`} />
        <ReportLink reference={`Gita ${shloka.verse}`} />
      </div>
    </article>
  )
}
