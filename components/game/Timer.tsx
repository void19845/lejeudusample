'use client'

import { useEffect, useState } from 'react'
import { getTimeUntilMidnight, pad } from '@/lib/utils'

export function Timer() {
  const [time, setTime] = useState(getTimeUntilMidnight())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeUntilMidnight()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mx-5 mb-5 bg-surface border border-border rounded-xl px-4 py-3.5 flex items-center justify-between">
      <div className="flex-1">
        <div className="text-[11px] text-muted uppercase tracking-wider font-medium">
          Fenêtre de jeu
        </div>
        <div className="h-0.5 bg-border rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${Math.max(0, time.pct)}%` }}
          />
        </div>
      </div>
      <div className="font-mono text-base font-semibold text-gold tracking-wider ml-4">
        {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
      </div>
    </div>
  )
}
