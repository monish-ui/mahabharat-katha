import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { UI, toDevanagariDigits } from '../lib/i18n'
import { chapterByNumber, chapters } from '../lib/content'
import ShlokaCard from '../components/ShlokaCard'
import AudioButton from '../components/AudioButton'
import { Empty, Lesson, Paragraphs, SectionTitle } from '../components/Bits'
import { ChevronLeft, ChevronRight } from '../components/Icons'

export default function GitaChapter() {
  const { number } = useParams()
  const n = Number(number)
  const chapter = chapterByNumber.get(n)
  const { t, lang, setLastRead, markChapterRead } = useStore()

  useEffect(() => {
    if (!chapter) return
    setLastRead({ path: `/gita/${chapter.number}`, title: { hi: `गीता अध्याय ${toDevanagariDigits(chapter.number)}: ${chapter.title.hi}`, en: `Gita Chapter ${chapter.number}: ${chapter.title.en}` }, kind: 'gita' })
    const timer = setTimeout(() => markChapterRead(chapter.number), 20000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.number])

  if (!chapter) return <Empty text={t(UI.comingSoon)} />
  const prev = chapters.find((c) => c.number === n - 1)
  const next = chapters.find((c) => c.number === n + 1)
  const num = lang === 'hi' ? toDevanagariDigits(n) : n

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-2 dark:text-cream/60">{t(UI.chapter)} {num} • {chapter.verseCount} {t(UI.verses)}</p>
      <h2 className="text-2xl font-bold text-maroon dark:text-saffron-2 shloka">{t(chapter.title)}</h2>
      <p className="text-ink-2 dark:text-cream/70">{t(chapter.subtitle)}</p>

      <SectionTitle action={<AudioButton size="sm" text={`${t(chapter.title)}. ${t(chapter.summary)}. ${t(chapter.lesson)}`} />}>{t(UI.summary)}</SectionTitle>
      <div className="card p-4"><Paragraphs text={t(chapter.summary)} /></div>
      <Lesson label={t(UI.lesson)} text={t(chapter.lesson)} />

      <SectionTitle>{t(UI.keyShlokas)}</SectionTitle>
      <div className="grid gap-3">
        {chapter.shlokas.map((s) => <ShlokaCard key={s.verse} shloka={s} />)}
      </div>

      <div className="mt-6 flex justify-between gap-3">
        {prev ? <Link to={`/gita/${prev.number}`} className="btn-ghost"><ChevronLeft className="w-4 h-4" />{t(UI.previous)}</Link> : <span />}
        {next ? <Link to={`/gita/${next.number}`} className="btn-primary">{t(UI.next)}<ChevronRight className="w-4 h-4" /></Link> : <span />}
      </div>
    </div>
  )
}
