import { useStore } from '../lib/store'
import { UI, toDevanagariDigits } from '../lib/i18n'
import { parvas } from '../lib/content'
import { Empty, ListRow } from '../components/Bits'

export default function ParvaList() {
  const { t, lang, readStories } = useStore()
  return (
    <div>
      <h2 className="text-xl font-bold text-maroon dark:text-saffron-2">{t(UI.mahabharat)}</h2>
      <p className="text-sm text-ink-2 dark:text-cream/60 mb-4">{t(UI.mahabharatSub)}</p>
      {parvas.length === 0 && <Empty text={t(UI.comingSoon)} />}
      <div className="grid gap-2">
        {parvas.map((p) => {
          const done = p.stories.length > 0 && p.stories.every((s) => readStories.includes(`${p.slug}/${s.slug}`))
          return (
            <ListRow key={p.slug} to={`/katha/${p.slug}`} badge={lang === 'hi' ? toDevanagariDigits(p.number) : p.number}
              title={t(p.title)} subtitle={`${t(p.subtitle)} • ${p.stories.length} ${t(UI.stories)}`} done={done} />
          )
        })}
      </div>
    </div>
  )
}
