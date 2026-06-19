'use client'

import { useEffect, useState } from 'react'
import { getPseudo } from '@/lib/utils'
import { ScoreboardRow } from '@/components/game/ScoreboardRow'
import { BottomNav } from '@/components/ui/BottomNav'
import type { ScoreRow } from '@/types'

export default function ScoreboardPage() {
  const [scores, setScores] = useState<ScoreRow[]>([])
  const [pseudo, setPseudo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPseudo(getPseudo())
    fetch('/api/scoreboard')
      .then((r) => r.json())
      .then((data) => setScores(data.scores ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="font-display italic text-lg text-gold tracking-wide">
          le jeu du sample
        </div>
      </header>

      <div className="px-5 pt-4 pb-2">
        <div className="font-display italic text-[26px] text-text">
          Classement <span className="text-gold">général</span>
        </div>
        <div className="text-xs text-muted mt-1">Sur la période en cours</div>
      </div>

      <div className="px-5 flex flex-col gap-2 mt-3 mb-[100px]">
        {loading ? (
          <div className="text-center text-sm text-muted py-8">Chargement...</div>
        ) : scores.length === 0 ? (
          <div className="text-center text-sm text-muted py-8">
            Aucun score pour le moment
          </div>
        ) : (
          scores.map((s) => (
            <ScoreboardRow key={s.pseudo} score={s} isMe={s.pseudo === pseudo} />
          ))
        )}
      </div>

      <BottomNav />
    </>
  )
}
