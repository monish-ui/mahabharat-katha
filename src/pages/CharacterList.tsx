import { useState } from 'react'
import { useStore } from '../lib/store'
import { SIDE_LABEL, UI } from '../lib/i18n'
import { characters } from '../lib/content'
import { Empty, ListRow } from '../components/Bits'
import type { Side } from '../lib/types'

const sides: (Side | 'all')[] = ['all', 'pandava', 'kaurava', 'divine', 'neutral']

export default function CharacterList() {
  const { t } = useStore()
  const [side, setSide] = useState<Side | 'all'>('all')
  const list = side === 'all' ? characters : characters.filter((c) => c.side === side)
  return (
    <div>
      <h2 className="text-xl font-bold text-maroon dark:text-saffron-2">{t(UI.characters)}</h2>
      <p className="text-sm text-ink-2 dark:text-cream/60 mb-3">{t(UI.charactersSub)}</p>
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
        {sides.map((s) => (
          <button key={s} onClick={() => setSide(s)} className={`chip whitespace-nowrap border ${side === s ? 'bg-maroon text-cream border-maroon' : 'bg-paper dark:bg-night-2 border-saffron/30'}`}>
            {s === 'all' ? t(UI.all) : t(SIDE_LABEL[s])}
          </button>
        ))}
      </div>
      {list.length === 0 && <Empty text={t(UI.comingSoon)} />}
      <div className="grid gap-2">
        {list.map((c) => (
          <ListRow key={c.slug} to={`/characters/${c.slug}`} badge={t(c.name).slice(0, 1)} title={t(c.name)} subtitle={t(c.role)} />
        ))}
      </div>
    </div>
  )
}
