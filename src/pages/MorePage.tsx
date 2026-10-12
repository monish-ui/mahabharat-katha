import { Link } from 'react-router-dom'
import { useStore, type Theme } from '../lib/store'
import { UI } from '../lib/i18n'
import { chapters, parvas } from '../lib/content'
import { SectionTitle } from '../components/Bits'
import { ChevronRight, HeartIcon } from '../components/Icons'
import type { Lang } from '../lib/types'

const APP_VERSION = '0.1.0'

export default function MorePage() {
  const { t, lang, setLang, fontScale, setFontScale, theme, setTheme, readChapters, readStories, bookmarks } = useStore()
  const totalStories = parvas.reduce((a, p) => a + p.stories.length, 0)
  return (
    <div>
      <Link to="/bookmarks" className="card p-4 flex items-center gap-3">
        <HeartIcon className="w-6 h-6 text-maroon dark:text-saffron-2" filled />
        <span className="flex-1 font-semibold">{t(UI.bookmarks)}</span>
        <span className="chip bg-saffron/15">{bookmarks.length}</span>
        <ChevronRight className="w-5 h-5 text-ink-2/60" />
      </Link>

      <SectionTitle>{t(UI.progress)}</SectionTitle>
      <div className="card p-4 grid grid-cols-2 gap-4 text-center">
        <div><p className="text-2xl font-bold text-maroon dark:text-saffron-2">{readChapters.length}/{chapters.length}</p><p className="text-xs text-ink-2 dark:text-cream/60">{t(UI.chaptersRead)}</p></div>
        <div><p className="text-2xl font-bold text-maroon dark:text-saffron-2">{readStories.length}/{totalStories}</p><p className="text-xs text-ink-2 dark:text-cream/60">{t(UI.storiesRead)}</p></div>
      </div>

      <SectionTitle>{t(UI.settings)}</SectionTitle>
      <div className="card divide-y divide-saffron/15">
        <Row label={t(UI.language)}>
          <Seg value={lang} onChange={(v) => setLang(v as Lang)} options={[{ v: 'hi', l: 'हिंदी' }, { v: 'en', l: 'English' }]} />
        </Row>
        <Row label={t(UI.fontSize)}>
          <div className="flex items-center gap-2">
            <button className="btn-ghost w-9 h-9 p-0" onClick={() => setFontScale(fontScale - 0.1)}>A-</button>
            <span className="text-sm w-10 text-center">{Math.round(fontScale * 100)}%</span>
            <button className="btn-ghost w-9 h-9 p-0" onClick={() => setFontScale(fontScale + 0.1)}>A+</button>
          </div>
        </Row>
        <Row label={t(UI.theme)}>
          <Seg value={theme} onChange={(v) => setTheme(v as Theme)} options={[{ v: 'light', l: t(UI.light) }, { v: 'dark', l: t(UI.dark) }, { v: 'system', l: t(UI.system) }]} />
        </Row>
      </div>

      <SectionTitle>{t(UI.about)}</SectionTitle>
      <div className="card p-4 text-sm leading-relaxed">
        <p>{t(UI.aboutText)}</p>
        <p className="mt-3 text-ink-2 dark:text-cream/60">{t(UI.version)} {APP_VERSION}</p>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3 p-3"><span className="font-medium">{label}</span>{children}</div>
}

function Seg({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div className="flex rounded-full bg-saffron/15 p-0.5">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} className={`px-3 py-1 rounded-full text-sm ${value === o.v ? 'bg-maroon text-cream' : ''}`}>{o.l}</button>
      ))}
    </div>
  )
}
