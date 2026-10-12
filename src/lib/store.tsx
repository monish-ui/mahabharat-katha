import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Bi, Lang } from './types'

export type Theme = 'light' | 'dark' | 'system'
export type LastRead = { path: string; title: Bi; kind: 'gita' | 'story' } | null

type Settings = {
  lang: Lang
  fontScale: number
  theme: Theme
  bookmarks: string[]
  lastRead: LastRead
  readStories: string[]
  readChapters: number[]
}

const DEFAULTS: Settings = {
  lang: 'hi',
  fontScale: 1,
  theme: 'system',
  bookmarks: [],
  lastRead: null,
  readStories: [],
  readChapters: []
}

const KEY = 'mk.settings.v1'

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

type Store = Settings & {
  t: (b: Bi | undefined) => string
  setLang: (l: Lang) => void
  toggleLang: () => void
  setFontScale: (n: number) => void
  setTheme: (t: Theme) => void
  isBookmarked: (id: string) => boolean
  toggleBookmark: (id: string) => void
  setLastRead: (l: LastRead) => void
  markStoryRead: (id: string) => void
  markChapterRead: (n: number) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ }
  }, [s])

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      const dark = s.theme === 'dark' || (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      root.classList.toggle('dark', dark)
      root.style.setProperty('--font-scale', String(s.fontScale))
      root.lang = s.lang
    }
    apply()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [s.theme, s.fontScale, s.lang])

  const patch = useCallback((p: Partial<Settings> | ((prev: Settings) => Partial<Settings>)) => {
    setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }))
  }, [])

  const value = useMemo<Store>(() => ({
    ...s,
    t: (b) => (b ? (b[s.lang] || b.hi || b.en || '') : ''),
    setLang: (lang) => patch({ lang }),
    toggleLang: () => patch((prev) => ({ lang: prev.lang === 'hi' ? 'en' : 'hi' })),
    setFontScale: (fontScale) => patch({ fontScale: Math.min(1.6, Math.max(0.8, fontScale)) }),
    setTheme: (theme) => patch({ theme }),
    isBookmarked: (id) => s.bookmarks.includes(id),
    toggleBookmark: (id) => patch((prev) => ({ bookmarks: prev.bookmarks.includes(id) ? prev.bookmarks.filter((b) => b !== id) : [id, ...prev.bookmarks] })),
    setLastRead: (lastRead) => patch({ lastRead }),
    markStoryRead: (id) => patch((prev) => (prev.readStories.includes(id) ? {} : { readStories: [...prev.readStories, id] })),
    markChapterRead: (n) => patch((prev) => (prev.readChapters.includes(n) ? {} : { readChapters: [...prev.readChapters, n] }))
  }), [s, patch])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside StoreProvider')
  return v
}
