import { useStore } from '../lib/store'
import { UI, toDevanagariDigits } from '../lib/i18n'
import { chapters } from '../lib/content'
import { Empty, ListRow } from '../components/Bits'

export default function GitaList() {
  const { t, lang, readChapters } = useStore()
  return (
    <div>
      <h2 className="text-xl font-bold text-maroon dark:text-saffron-2">{t(UI.bhagavadGita)}</h2>
      <p className="text-sm text-ink-2 dark:text-cream/60 mb-4">{t(UI.gitaSub)}</p>
      {chapters.length === 0 && <Empty text={t(UI.comingSoon)} />}
      <div className="grid gap-2">
        {chapters.map((c) => (
          <ListRow key={c.number} to={`/gita/${c.number}`} badge={lang === 'hi' ? toDevanagariDigits(c.number) : c.number}
            title={t(c.title)} subtitle={`${t(c.subtitle)} • ${c.verseCount} ${t(UI.verses)}`} done={readChapters.includes(c.number)} />
        ))}
      </div>
    </div>
  )
}
