// Validates every content JSON against the schema basics and prints counts.
import { readFileSync, readdirSync } from 'node:fs'
const dir = new URL('../content/', import.meta.url)
let errors = 0
const bi = (o, path) => { if (!o || typeof o.hi !== 'string' || typeof o.en !== 'string' || !o.hi.trim() || !o.en.trim()) { console.error('bad bilingual at', path); errors++ } }
const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
const slugs = new Set()
for (const f of files) {
  let d
  try { d = JSON.parse(readFileSync(new URL(f, dir), 'utf8')) } catch (e) { console.error(f, 'INVALID JSON', e.message); errors++; continue }
  if (f === 'gita.json') {
    const n = d.chapters.length, sh = d.chapters.reduce((a, c) => a + c.shlokas.length, 0)
    console.log(`gita.json: ${n} chapters, ${sh} shlokas`)
    for (const c of d.chapters) { bi(c.title, `ch${c.number}.title`); bi(c.summary, `ch${c.number}.summary`); bi(c.lesson, `ch${c.number}.lesson`); for (const s of c.shlokas) { if (!s.sanskrit || !s.verse) { console.error('bad shloka', c.number, s.verse); errors++ } bi(s.meaning, `ch${c.number}.${s.verse}.meaning`) } }
  } else if (f.startsWith('mahabharat')) {
    const n = d.parvas.length, st = d.parvas.reduce((a, p) => a + p.stories.length, 0)
    console.log(`${f}: ${n} parvas, ${st} stories`)
    for (const p of d.parvas) { bi(p.title, `${p.slug}.title`); bi(p.summary, `${p.slug}.summary`); for (const s of p.stories) { bi(s.title, `${p.slug}/${s.slug}.title`); bi(s.body, `${p.slug}/${s.slug}.body`); bi(s.lesson, `${p.slug}/${s.slug}.lesson`) } }
  } else if (f === 'characters.json') {
    console.log(`characters.json: ${d.characters.length} characters`)
    for (const c of d.characters) { slugs.add(c.slug); bi(c.name, `${c.slug}.name`); bi(c.bio, `${c.slug}.bio`) }
  } else if (f === 'daily.json') {
    console.log(`daily.json: ${d.items.length} items`)
  }
}
// cross-check story character slugs
if (slugs.size) {
  for (const f of files.filter((x) => x.startsWith('mahabharat'))) {
    const d = JSON.parse(readFileSync(new URL(f, dir), 'utf8'))
    const missing = new Set()
    for (const p of d.parvas) for (const s of p.stories) for (const c of s.characters ?? []) if (!slugs.has(c)) missing.add(c)
    if (missing.size) console.warn(`${f}: character slugs without a profile:`, [...missing].join(', '))
  }
}
console.log(errors ? `FAILED with ${errors} errors` : 'content OK')
process.exit(errors ? 1 : 0)
