import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useStore, type Theme } from '../lib/store'
import { UI } from '../lib/i18n'
import { chapters, parvas } from '../lib/content'
import { SectionTitle } from '../components/Bits'
import { ChevronRight, HeartIcon } from '../components/Icons'
import ReportLink from '../components/ReportLink'
import { disableDaily, enableDaily, notificationsAvailable } from '../lib/notify'
import type { Lang } from '../lib/types'

const APP_VERSION = '1.0.0'

export default function MorePage() {
  const { t, lang, setLang, fontScale, setFontScale, theme, setTheme, readChapters, readStories, bookmarks, dailyNotify, setDailyNotify } = useStore()
  const totalStories = parvas.reduce((a, p) => a + p.stories.length, 0)
  const [busy, setBusy] = useState(false)

  const toggleDaily = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (dailyNotify) { await disableDaily(); setDailyNotify(false) }
      else { const ok = await enableDaily(lang); setDailyNotify(ok) }
    } finally { setBusy(false) }
  }

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
        {notificationsAvailable() && (
          <Row label={t(UI.dailyNotification)} hint={t(UI.dailyNotificationHint)}>
            <button role="switch" aria-checked={dailyNotify} onClick={toggleDaily} disabled={busy}
              className={`relative w-12 h-7 rounded-full transition ${dailyNotify ? 'bg-maroon' : 'bg-saffron/30'}`}>
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-paper shadow transition ${dailyNotify ? 'left-6' : 'left-1'}`} />
              <span className="sr-only">{dailyNotify ? t(UI.on) : t(UI.off)}</span>
            </button>
          </Row>
        )}
      </div>

      <SectionTitle>{t(UI.about)}</SectionTitle>
      <div className="card p-4 text-sm leading-relaxed">
        <p>{t(UI.aboutText)}</p>
        <p className="mt-3">{t(UI.scopeNote)}</p>
        <p className="mt-3 text-ink-2 dark:text-cream/60">{t(UI.mediaCredits)}</p>
        <div className="mt-3 flex items-center justify-between text-ink-2 dark:text-cream/60">
          <span>{t(UI.version)} {APP_VERSION} • {t(UI.noAds)} • <a className="underline underline-offset-2" href="https://mahabharat-katha.vercel.app/privacy.html" target="_blank" rel="noreferrer">Privacy</a></span>
          <ReportLink reference={`App v${APP_VERSION}`} />
        </div>
      </div>
    </div>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3">
      <div><p className="font-medium">{label}</p>{hint && <p className="text-xs text-ink-2 dark:text-cream/60">{hint}</p>}</div>
      {children}
    </div>
  )
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
