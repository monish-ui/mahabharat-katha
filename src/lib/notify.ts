// Daily shloka as a local notification. No server: the phone schedules it itself.
// Chronological, not random: the item shown is the same one the Home page shows for that date.
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { dailyItems, dayIndex, findShloka } from './content'
import type { Lang } from './types'

const HOUR = 7
const DAYS_AHEAD = 14 // schedule a two-week window; rescheduled on every app open

export function notificationsAvailable(): boolean {
  return Capacitor.isNativePlatform()
}

function bodyFor(date: Date, lang: Lang): { title: string; body: string } {
  const item = dailyItems[dayIndex(date) % dailyItems.length]
  if (!item) return { title: 'Mahabharat Katha', body: '' }
  if (item.type === 'shloka') {
    const hit = findShloka(item.ref)
    const line = hit ? hit.shloka.sanskrit.split('\n')[0] : item.ref
    return { title: lang === 'hi' ? `आज का श्लोक • गीता ${item.ref}` : `Today's shloka • Gita ${item.ref}`, body: line }
  }
  return { title: lang === 'hi' ? 'आज की सीख' : "Today's lesson", body: item.text[lang] }
}

export async function enableDaily(lang: Lang): Promise<boolean> {
  if (!notificationsAvailable()) return false
  const perm = await LocalNotifications.requestPermissions()
  if (perm.display !== 'granted') return false
  await disableDaily()
  const now = new Date()
  const notifications = []
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, HOUR, 0, 0)
    if (at <= now) continue
    const { title, body } = bodyFor(at, lang)
    notifications.push({ id: 1000 + i, title, body, schedule: { at }, extra: { path: '/' } })
  }
  await LocalNotifications.schedule({ notifications })
  return true
}

export async function disableDaily(): Promise<void> {
  if (!notificationsAvailable()) return
  const pending = await LocalNotifications.getPending()
  const ours = pending.notifications.filter((n) => n.id >= 1000 && n.id < 1000 + DAYS_AHEAD)
  if (ours.length) await LocalNotifications.cancel({ notifications: ours.map((n) => ({ id: n.id })) })
}
