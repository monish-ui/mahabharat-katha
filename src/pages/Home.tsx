import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { chapters, characters, findShloka, parvas, todaysItem } from '../lib/content'
import ShlokaCard from '../components/ShlokaCard'
import { SectionTitle } from '../components/Bits'
import { BookIcon, ChevronRight, PeopleIcon, ScrollIcon } from '../components/Icons'
import AudioButton from '../components/AudioButton'

export default function Home() {
  const { t, lastRead, readChapters, readStories } = useStore()
  const daily = todaysItem()
  const dailyShloka = daily?.type === 'shloka' ? findShloka(daily.ref) : undefined
  const totalStories = parvas.reduce((a, p) => a + p.stories.length, 0)

  return (
    <div>
      <div className="text-center mb-4">
        <p className="text-sm text-ink-2 dark:text-cream/60">{t(UI.tagline)}</p>
      </div>

      {daily && (
        <>
          <SectionTitle>{daily.type === 'shloka' ? t(UI.todaysShloka) : t(UI.todaysLesson)}</SectionTitle>
          {daily.type === 'shloka' && dailyShloka && <ShlokaCard shloka={dailyShloka.shloka} />}
          {daily.type === 'lesson' && (
            <div className="card p-5 ornament text-center">
              <p className="shloka text-lg leading-relaxed">“{t(daily.text)}”</p>
              <p className="mt-3 text-sm text-ink-2 dark:text-cream/60">— {t(daily.source)}</p>
              <div className="mt-3 flex justify-center"><AudioButton size="sm" text={t(daily.text)} /></div>
            </div>
          )}
        </>
      )}

      {lastRead && (
        <Link to={lastRead.path} className="card mt-4 p-4 flex items-center gap-3 bg-maroon! text-cream">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide opacity-80">{t(UI.continueReading)}</p>
            <p className="font-semibold truncate">{t(lastRead.title)}</p>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}

      <SectionTitle>{t(UI.startReading)}</SectionTitle>
      <div className="grid gap-3">
        <Tile to="/gita" Icon={BookIcon} title={t(UI.bhagavadGita)} sub={t(UI.gitaSub)} progress={chapters.length ? readChapters.length / chapters.length : 0} />
        <Tile to="/katha" Icon={ScrollIcon} title={t(UI.mahabharat)} sub={t(UI.mahabharatSub)} progress={totalStories ? readStories.length / totalStories : 0} />
        <Tile to="/characters" Icon={PeopleIcon} title={t(UI.characters)} sub={`${characters.length} • ${t(UI.charactersSub)}`} />
      </div>
    </div>
  )
}

function Tile({ to, Icon, title, sub, progress }: { to: string; Icon: (p: { className?: string }) => JSX.Element; title: string; sub: string; progress?: number }) {
  return (
    <Link to={to} className="card p-4 flex items-center gap-4 active:bg-cream-2 dark:active:bg-night-3">
      <div className="w-12 h-12 rounded-2xl bg-maroon text-saffron-2 grid place-items-center shrink-0"><Icon className="w-6 h-6" /></div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-maroon dark:text-saffron-2">{title}</p>
        <p className="text-sm text-ink-2 dark:text-cream/60">{sub}</p>
        {progress !== undefined && progress > 0 && (
          <div className="mt-2 h-1.5 rounded-full bg-saffron/20 overflow-hidden"><div className="h-full bg-saffron" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-ink-2/60" />
    </Link>
  )
}
