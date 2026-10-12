import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { HeartIcon } from './Icons'

export default function BookmarkButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { isBookmarked, toggleBookmark, t } = useStore()
  const on = isBookmarked(id)
  return (
    <button onClick={() => toggleBookmark(id)} aria-pressed={on} aria-label={t(UI.bookmark)}
      className={`${compact ? 'p-2' : 'btn-ghost'} ${on ? 'text-maroon dark:text-saffron-2' : ''}`}>
      <HeartIcon className="w-5 h-5" filled={on} />
      {!compact && (on ? t(UI.bookmarked) : t(UI.bookmark))}
    </button>
  )
}
