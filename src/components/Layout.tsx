import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { UI } from '../lib/i18n'
import { BookIcon, ChevronLeft, HomeIcon, MoreIcon, PeopleIcon, ScrollIcon, SearchIcon } from './Icons'

const tabs = [
  { to: '/', key: 'home', Icon: HomeIcon, end: true },
  { to: '/gita', key: 'gita', Icon: BookIcon, end: false },
  { to: '/katha', key: 'katha', Icon: ScrollIcon, end: false },
  { to: '/characters', key: 'characters', Icon: PeopleIcon, end: false },
  { to: '/more', key: 'more', Icon: MoreIcon, end: false }
] as const

export default function Layout() {
  const { t, lang, toggleLang } = useStore()
  const loc = useLocation()
  const nav = useNavigate()
  const isRoot = ['/', '/gita', '/katha', '/characters', '/more'].includes(loc.pathname)

  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto">
      <header className="safe-top sticky top-0 z-20 bg-maroon text-cream shadow-md">
        <div className="flex items-center gap-2 px-3 h-14">
          {isRoot ? (
            <span className="text-2xl leading-none text-saffron-2 select-none">ॐ</span>
          ) : (
            <button aria-label="Back" onClick={() => nav(-1)} className="p-1 -ml-1 rounded-full active:bg-white/10"><ChevronLeft className="w-6 h-6" /></button>
          )}
          <h1 className="flex-1 font-semibold text-lg truncate">{t(UI.appName)}</h1>
          <NavLink to="/search" aria-label={t(UI.search)} className="p-2 rounded-full active:bg-white/10"><SearchIcon className="w-5 h-5" /></NavLink>
          <button onClick={toggleLang} className="chip bg-cream/15 text-cream border border-cream/30 font-bold tracking-wide" aria-label="Toggle language">
            {lang === 'hi' ? 'EN' : 'हिं'}
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-24">
        <Outlet />
      </main>

      <nav className="safe-bottom fixed bottom-0 inset-x-0 z-20 bg-paper/95 dark:bg-night-2/95 backdrop-blur border-t border-saffron/20">
        <div className="max-w-md mx-auto grid grid-cols-5">
          {tabs.map(({ to, key, Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${isActive ? 'text-maroon dark:text-saffron-2' : 'text-ink-2 dark:text-cream/60'}`}>
              <Icon className="w-6 h-6" />
              <span>{t(UI[key])}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
