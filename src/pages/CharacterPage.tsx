import { Link, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { SIDE_LABEL, UI } from '../lib/i18n'
import { characterBySlug, storiesFor } from '../lib/content'
import AudioButton from '../components/AudioButton'
import { Empty, ListRow, Paragraphs, SectionTitle } from '../components/Bits'

export default function CharacterPage() {
  const { slug } = useParams()
  const c = slug ? characterBySlug.get(slug) : undefined
  const { t } = useStore()
  if (!c) return <Empty text={t(UI.comingSoon)} />
  const stories = storiesFor(c.slug)
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-maroon text-saffron-2 grid place-items-center text-3xl font-bold shloka shrink-0">{t(c.name).slice(0, 1)}</div>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-maroon dark:text-saffron-2 shloka">{t(c.name)}</h2>
          <p className="text-ink-2 dark:text-cream/70">{t(c.role)}</p>
          <span className="chip mt-1 bg-saffron/15 text-maroon dark:text-saffron-2">{t(SIDE_LABEL[c.side])}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2"><AudioButton size="sm" text={`${t(c.name)}. ${t(c.role)}. ${t(c.bio)}`} /></div>
      <div className="card p-4 mt-3"><Paragraphs text={t(c.bio)} /></div>

      {c.relations?.length > 0 && (
        <>
          <SectionTitle>{t(UI.relations)}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {c.relations.map((r) => {
              const other = characterBySlug.get(r.slug)
              const label = `${t(r.relation)}: ${other ? t(other.name) : r.slug}`
              return other
                ? <Link key={r.slug} to={`/characters/${r.slug}`} className="chip bg-saffron/15 text-maroon dark:text-saffron-2 text-sm py-1.5">{label}</Link>
                : <span key={r.slug} className="chip bg-saffron/10 text-sm py-1.5">{label}</span>
            })}
          </div>
        </>
      )}

      {stories.length > 0 && (
        <>
          <SectionTitle>{t(UI.appearsIn)}</SectionTitle>
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
