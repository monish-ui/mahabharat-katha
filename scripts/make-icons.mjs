import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const p = (rel) => fileURLToPath(new URL(rel, import.meta.url))
const svg = readFileSync(p('../public/icons/icon.svg'))
for (const size of [192, 512, 1024]) {
  await sharp(svg, { density: 512 }).resize(size, size).png().toFile(p(`../public/icons/icon-${size}.png`))
  console.log('icon', size)
}
