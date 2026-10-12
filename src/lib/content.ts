import type { Chapter, Character, DailyItem, Parva, Shloka, Story } from './types'

// All content JSON lives in /content at the project root and is bundled at build time.
// import.meta.glob tolerates missing files, so the app still boots while content is being written.
const files = import.meta.glob('../../content/*.json', { eager: true }) as Record<string, { default: unknown }>

function pick<T>(name: string): T | undefined {
  const key = Object.keys(files).find((k) => k.endsWith('/' + name))
  return key ? (files[key].default as T) : undefined
}

const gitaFile = pick<{ chapters: Chapter[] }>('gita.json')
const charFile = pick<{ characters: Character[] }>('characters.json')
const dailyFile = pick<{ items: DailyItem[] }>('daily.json')

export const chapters: Chapter[] = (gitaFile?.chapters ?? []).slice().sort((a, b) => a.number - b.number)

export const parvas: Parva[] = Object.keys(files)
  .filter((k) => /\/mahabharat(-\d+)?\.json$/.test(k))
  .flatMap((k) => ((files[k].default as { parvas: Parva[] }).parvas ?? []))
  .sort((a, b) => a.number - b.number)

export const characters: Character[] = charFile?.characters ?? []
export const dailyItems: DailyItem[] = dailyFile?.items ?? []

export const characterBySlug = new Map(characters.map((c) => [c.slug, c]))
export const chapterByNumber = new Map(chapters.map((c) => [c.number, c]))
export const parvaBySlug = new Map(parvas.map((p) => [p.slug, p]))

export function findShloka(ref: string): { chapter: Chapter; shloka: Shloka } | undefined {
  const [ch] = ref.split('.')
  const chapter = chapterByNumber.get(Number(ch))
  if (!chapter) return undefined
  const shloka = chapter.shlokas.find((s) => s.verse === ref)
  return shloka ? { chapter, shloka } : undefined
}

export function dayIndex(date = new Date()): number {
  const start = Date.UTC(date.getFullYear(), 0, 0)
  const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((now - start) / 86400000)
}

export function todaysItem(date = new Date()): DailyItem | undefined {
  if (dailyItems.length === 0) return undefined
  return dailyItems[dayIndex(date) % dailyItems.length]
}

export function storiesFor(characterSlug: string): { parva: Parva; story: Story }[] {
  const out: { parva: Parva; story: Story }[] = []
  for (const parva of parvas) for (const story of parva.stories) if (story.characters?.includes(characterSlug)) out.push({ parva, story })
  return out
}

export type SearchHit =
  | { kind: 'chapter'; chapter: Chapter }
  | { kind: 'shloka'; chapter: Chapter; shloka: Shloka }
  | { kind: 'story'; parva: Parva; story: Story }
  | { kind: 'character'; character: Character }

export function search(q: string, limit = 40): SearchHit[] {
  const needle = q.trim().toLowerCase()
  if (needle.length < 2) return []
  const has = (s?: string) => !!s && s.toLowerCase().includes(needle)
  const hits: SearchHit[] = []
  for (const c of characters) if (has(c.name.hi) || has(c.name.en) || has(c.role.en) || has(c.role.hi)) hits.push({ kind: 'character', character: c })
  for (const ch of chapters) {
    if (has(ch.title.hi) || has(ch.title.en) || has(ch.subtitle.en) || has(ch.subtitle.hi)) hits.push({ kind: 'chapter', chapter: ch })
    for (const s of ch.shlokas) if (has(s.verse) || has(s.sanskrit) || has(s.transliteration) || has(s.meaning.hi) || has(s.meaning.en)) hits.push({ kind: 'shloka', chapter: ch, shloka: s })
  }
  for (const p of parvas) for (const st of p.stories) if (has(st.title.hi) || has(st.title.en) || has(st.body.hi) || has(st.body.en)) hits.push({ kind: 'story', parva: p, story: st })
  return hits.slice(0, limit)
}
