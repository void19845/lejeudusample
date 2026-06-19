'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    href: '/',
    label: 'Jouer',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className={`w-[22px] h-[22px] ${active ? 'stroke-gold' : 'stroke-muted'}`} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    href: '/scoreboard',
    label: 'Scores',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className={`w-[22px] h-[22px] ${active ? 'stroke-gold' : 'stroke-muted'}`} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: '/historique',
    label: 'Historique',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className={`w-[22px] h-[22px] ${active ? 'stroke-gold' : 'stroke-muted'}`} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/90 backdrop-blur-xl border-t border-border px-5 pt-3 pb-7 flex justify-around z-50">
      {items.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${active ? '' : 'hover:bg-surface'}`}
          >
            {item.icon(active)}
            <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${active ? 'text-gold' : 'text-muted'}`}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
