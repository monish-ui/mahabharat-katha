import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { characterBySlug, parvaBySlug, parvas } from '../lib/content'
import AudioButton from '../components/AudioButton'
import BookmarkButton from '../components/BookmarkButton'
import ShareButton from '../components/ShareButton'
import ReportLink from '../components/ReportLink'
import { audioUrl, videoUrl } from '../lib/audio'
import VideoButton from '../components/VideoButton'
import { Empty, Lesson, Paragraphs, SectionTitle } from '../components/Bits'
import { ChevronLeft, ChevronRight } from '../components/Icons'

export default function StoryPage() {
  const { parva: pslug, story: sslug } = useParams()
  const parva = pslug ? parvaBySlug.get(pslug) : undefined
  const idx = parva?.stories.findIndex((s) => s.slug === sslug) ?? -1
  const story = idx >= 0 ? parva!.stories[idx] : undefined
  const { t, lang, setLastRead, markStoryRead } = useStore()

  useEffect(() => {
    if (!parva || !story) return
    setLastRead({ path: `/katha/${parva.slug}/${story.slug}`, title: story.title, kind: 'story' })
    const timer = setTimeout(() => markStoryRead(`${parva.slug}/${story.slug}`), 20000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parva?.slug, story?.slug])

  if (!parva || !story) return <Empty text={t(UI.comingSoon)} />

  // previous/next across parva boundaries
  const flat = parvas.flatMap((p) => p.stories.map((s) => ({ p, s })))
  const fi = flat.findIndex((x) => x.p.slug === parva.slug && x.s.slug === story.slug)
  const prev = fi > 0 ? flat[fi - 1] : undefined
  const next = fi < flat.length - 1 ? flat[fi + 1] : undefined
  const id = `story:${parva.slug}/${story.slug}`
  const people = (story.characters ?? []).map((c) => characterBySlug.get(c)).filter(Boolean)

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-2 dark:text-cream/60">{t(parva.title)}</p>
      <h2 className="text-2xl font-bold text-maroon dark:text-saffron-2 shloka">{t(story.title)}</h2>

      <div className="mt-3 flex items-center gap-2">
        <AudioButton text={`${t(story.title)}. ${t(story.body)}. ${t(UI.lesson)}: ${t(story.lesson)}`} audioUrl={lang === 'hi' ? audioUrl.story(parva.slug, story.slug) : undefined} />
        <VideoButton url={videoUrl.story(parva.slug, story.slug)} />
        <BookmarkButton id={id} compact />
        <ShareButton text={`${t(story.title)}\n\n${t(story.lesson)}`} title={t(story.title)} />
      </div>

      <div className="card p-4 mt-4 text-[1.05em]"><Paragraphs text={t(story.body)} /></div>
      <div className="mt-2 flex items-center justify-between px-1 text-xs text-ink-2 dark:text-cream/60">
        <span>{t(UI.basedOn)}, {t(parva.title)}</span>
        <ReportLink reference={`${t(parva.title)} / ${t(story.title)} (${parva.slug}/${story.slug})`} />
      </div>
      <Lesson label={t(UI.lesson)} text={t(story.lesson)} />

      {people.length > 0 && (
        <>
          <SectionTitle>{t(UI.inThisStory)}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {people.map((c) => (
              <Link key={c!.slug} to={`/characters/${c!.slug}`} className="chip bg-saffron/15 text-maroon dark:text-saffron-2 text-sm py-1.5">{t(c!.name)}</Link>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 flex justify-between gap-3">
        {prev ? <Link to={`/katha/${prev.p.slug}/${prev.s.slug}`} className="btn-ghost"><ChevronLeft className="w-4 h-4" />{t(UI.previous)}</Link> : <span />}
        {next ? <Link to={`/katha/${next.p.slug}/${next.s.slug}`} className="btn-primary">{t(UI.next)}<ChevronRight className="w-4 h-4" /></Link> : <span />}
      </div>
    </div>
  )
}
