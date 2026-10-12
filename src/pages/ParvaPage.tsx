import { useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { UI, toDevanagariDigits } from '../lib/i18n'
import { parvaBySlug } from '../lib/content'
import AudioButton from '../components/AudioButton'
import { Empty, ListRow, Paragraphs, SectionTitle } from '../components/Bits'

export default function ParvaPage() {
  const { parva: slug } = useParams()
  const parva = slug ? parvaBySlug.get(slug) : undefined
  const { t, lang, readStories } = useStore()
  if (!parva) return <Empty text={t(UI.comingSoon)} />
  const num = lang === 'hi' ? toDevanagariDigits(parva.number) : parva.number
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-2 dark:text-cream/60">{t(UI.parva)} {num}</p>
      <h2 className="text-2xl font-bold text-maroon dark:text-saffron-2 shloka">{t(parva.title)}</h2>
      <p className="text-ink-2 dark:text-cream/70">{t(parva.subtitle)}</p>

      <SectionTitle action={<AudioButton size="sm" text={`${t(parva.title)}. ${t(parva.summary)}`} />}>{t(UI.summary)}</SectionTitle>
      <div className="card p-4"><Paragraphs text={t(parva.summary)} /></div>

      <SectionTitle>{t(UI.stories)}</SectionTitle>
      <div className="grid gap-2">
        {parva.stories.map((s, i) => (
          <ListRow key={s.slug} to={`/katha/${parva.slug}/${s.slug}`} badge={lang === 'hi' ? toDevanagariDigits(i + 1) : i + 1}
            title={t(s.title)} subtitle={t(s.lesson)} done={readStories.includes(`${parva.slug}/${s.slug}`)} />
        ))}
      </div>
    </div>
  )
}
