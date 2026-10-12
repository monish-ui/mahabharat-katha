import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { findShloka, parvaBySlug, parvas } from '../lib/content'
import ShlokaCard from '../components/ShlokaCard'
import { Empty, ListRow, SectionTitle } from '../components/Bits'

// Reviewers of competing apps complained that favourites appear "randomly".
// Here shlokas are listed in chapter/verse order and stories in parva order.
export default function BookmarksPage() {
  const { t, bookmarks } = useStore()
  if (bookmarks.length === 0) return <Empty text={t(UI.noBookmarks)} />

  const shlokas = bookmarks
    .filter((id) => id.startsWith('gita:'))
    .map((id) => findShloka(id.slice(5)))
    .filter((h): h is NonNullable<typeof h> => !!h)
    .sort((a, b) => {
      const [ca, va] = a.shloka.verse.split('.').map(Number)
      const [cb, vb] = b.shloka.verse.split('.').map(Number)
      return ca - cb || va - vb
    })

  const parvaOrder = new Map(parvas.map((p, i) => [p.slug, i]))
  const stories = bookmarks
    .filter((id) => id.startsWith('story:'))
    .map((id) => {
      const [pslug, sslug] = id.slice(6).split('/')
      const parva = parvaBySlug.get(pslug)
      const idx = parva?.stories.findIndex((s) => s.slug === sslug) ?? -1
      return parva && idx >= 0 ? { parva, story: parva.stories[idx], idx } : null
    })
    .filter((x): x is NonNullable<typeof x> => !!x)
    .sort((a, b) => (parvaOrder.get(a.parva.slug)! - parvaOrder.get(b.parva.slug)!) || a.idx - b.idx)

  return (
    <div>
      <h2 className="text-xl font-bold text-maroon dark:text-saffron-2">{t(UI.bookmarks)}</h2>
      {shlokas.length > 0 && (
        <>
          <SectionTitle>{t(UI.gita)}</SectionTitle>
          <div className="grid gap-3">{shlokas.map((h) => <ShlokaCard key={h.shloka.verse} shloka={h.shloka} />)}</div>
        </>
      )}
      {stories.length > 0 && (
        <>
          <SectionTitle>{t(UI.katha)}</SectionTitle>
          <div className="grid gap-2">
            {stories.map(({ parva, story }) => (
              <ListRow key={`${parva.slug}/${story.slug}`} to={`/katha/${parva.slug}/${story.slug}`} title={t(story.title)} subtitle={t(parva.title)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
