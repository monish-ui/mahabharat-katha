// Play Store phone screenshots via Chrome DevTools Protocol (no extra deps; Node 22+ has fetch + WebSocket).
//   node scripts/screenshots.mjs [baseUrl]      default http://127.0.0.1:5173
// Emulates a 360x720 phone at 3x density -> 1080x2160 PNGs in store/.
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'

const BASE = process.argv[2] || 'http://127.0.0.1:5173'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9333
const ROUTES = ['/', '/gita/2', '/katha', '/katha/adi-parva/bhishma-pratigya', '/characters/krishna', '/more']

const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${PORT}`, '--user-data-dir=D:/mahabharat-app/builds/chrome-cdp', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let wsUrl
for (let i = 0; i < 40 && !wsUrl; i++) {
  await sleep(250)
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
    wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl
  } catch { /* not up yet */ }
}
if (!wsUrl) { proc.kill(); throw new Error('Chrome did not start') }

const ws = new WebSocket(wsUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const mid = ++id
  pending.set(mid, (m) => (m.error ? reject(new Error(method + ': ' + m.error.message)) : resolve(m.result)))
  ws.send(JSON.stringify({ id: mid, method, params }))
})

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 360, height: 720, deviceScaleFactor: 3, mobile: true })
await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36' })
mkdirSync('store', { recursive: true })

for (const [i, route] of ROUTES.entries()) {
  await send('Page.navigate', { url: `${BASE}/#${route}` })
  await sleep(2500)
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0); speechSynthesis && speechSynthesis.cancel()' })
  await sleep(300)
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  const file = `store/screenshot-${i + 1}.png`
  writeFileSync(file, Buffer.from(data, 'base64'))
  console.log(file, route)
}
ws.close()
proc.kill()
