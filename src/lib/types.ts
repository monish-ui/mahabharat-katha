export type Lang = 'hi' | 'en'
export type Bi = { hi: string; en: string }

export type Shloka = {
  verse: string
  sanskrit: string
  transliteration: string
  meaning: Bi
}

export type Chapter = {
  number: number
  slug: string
  title: Bi
  subtitle: Bi
  verseCount: number
  summary: Bi
  lesson: Bi
  shlokas: Shloka[]
}

export type Story = {
  slug: string
  title: Bi
  body: Bi
  lesson: Bi
  characters: string[]
}

export type Parva = {
  number: number
  slug: string
  title: Bi
  subtitle: Bi
  summary: Bi
  stories: Story[]
}

export type Side = 'pandava' | 'kaurava' | 'neutral' | 'divine'

export type Character = {
  slug: string
  name: Bi
  role: Bi
  side: Side
  bio: Bi
  relations: { slug: string; relation: Bi }[]
}

export type DailyItem =
  | { type: 'shloka'; ref: string }
  | { type: 'lesson'; text: Bi; source: Bi }
