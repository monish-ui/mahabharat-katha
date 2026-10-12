import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { search } from '../lib/content'
import { Empty, ListRow } from '../components/Bits'

export default function SearchPage() {
  const { t } = useStore()
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  const hits = useMemo(() => search(q), [q])
  return (
    <div>
      <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(UI.searchHint)} type="search"
        className="w-full rounded-2xl border border-saffron/30 bg-paper dark:bg-night-2 px-4 py-3 outline-none focus:border-maroon" />
      {q.trim().length >= 2 && hits.length === 0 && <Empty text={t(UI.noResults)} />}
      <div className="grid gap-2 mt-3">
        {hits.map((h, i) => {
          if (h.kind === 'character') return <ListRow key={i} to={`/characters/${h.character.slug}`} badge={t(h.character.name).slice(0, 1)} title={t(h.character.name)} subtitle={t(h.character.role)} />
          if (h.kind === 'chapter') return <ListRow key={i} to={`/gita/${h.chapter.number}`} badge={h.chapter.number} title={t(h.chapter.title)} subtitle={t(h.chapter.subtitle)} />
          if (h.kind === 'shloka') return <ListRow key={i} to={`/gita/${h.chapter.number}`} badge={h.shloka.verse} title={h.shloka.sanskrit.split('\n')[0]} subtitle={t(h.shloka.meaning)} />
          return <ListRow key={i} to={`/katha/${h.parva.slug}/${h.story.slug}`} badge={h.parva.number} title={t(h.story.title)} subtitle={t(h.parva.title)} />
        })}
      </div>
    </div>
  )
}
