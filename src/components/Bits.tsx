import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ChevronRight } from './Icons'

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between mt-6 mb-2">
      <h2 className="text-lg font-bold text-maroon dark:text-saffron-2">{children}</h2>
      {action}
    </div>
  )
}

export function ListRow({ to, badge, title, subtitle, done }: { to: string; badge?: ReactNode; title: string; subtitle?: string; done?: boolean }) {
  return (
    <Link to={to} className="card flex items-center gap-3 p-3 active:bg-cream-2 dark:active:bg-night-3">
      {badge !== undefined && (
        <div className={`w-11 h-11 shrink-0 rounded-xl grid place-items-center font-bold ${done ? 'bg-maroon text-cream' : 'bg-saffron/15 text-maroon dark:text-saffron-2'}`}>{badge}</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold truncate">{title}</p>
        {subtitle && <p className="text-sm text-ink-2 dark:text-cream/60 truncate">{subtitle}</p>}
      </div>
      <ChevronRight className="w-5 h-5 text-ink-2/60" />
    </Link>
  )
}

export function Empty({ text }: { text: string }) {
  return <div className="card p-8 text-center text-ink-2 dark:text-cream/60 mt-4">{text}</div>
}

export function Lesson({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-5 rounded-2xl border-l-4 border-saffron bg-saffron/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-maroon dark:text-saffron-2 mb-1">{label}</p>
      <p className="leading-relaxed">{text}</p>
    </div>
  )
}

export function Paragraphs({ text }: { text: string }) {
  return <div className="prose-katha">{text.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
}
