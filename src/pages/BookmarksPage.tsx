import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { findShloka, parvaBySlug } from '../lib/content'
import ShlokaCard from '../components/ShlokaCard'
import { Empty, ListRow } from '../components/Bits'

export default function BookmarksPage() {
  const { t, bookmarks } = useStore()
  if (bookmarks.length === 0) return <Empty text={t(UI.noBookmarks)} />
  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-bold text-maroon dark:text-saffron-2">{t(UI.bookmarks)}</h2>
      {bookmarks.map((id) => {
        if (id.startsWith('gita:')) {
          const hit = findShloka(id.slice(5))
          return hit ? <ShlokaCard key={id} shloka={hit.shloka} /> : null
        }
        if (id.startsWith('story:')) {
          const [pslug, sslug] = id.slice(6).split('/')
          const parva = parvaBySlug.get(pslug)
          const story = parva?.stories.find((s) => s.slug === sslug)
          return parva && story ? <ListRow key={id} to={`/katha/${pslug}/${sslug}`} title={t(story.title)} subtitle={t(parva.title)} /> : null
        }
        return null
      })}
    </div>
  )
}
