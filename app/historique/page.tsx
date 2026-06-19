'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import { BottomNav } from '@/components/ui/BottomNav'
import type { Question } from '@/types'

export default function HistoriquePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/historique')
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions ?? []))
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
          Historique des <span className="text-gold">samples</span>
        </div>
        <div className="text-xs text-muted mt-1">Les épisodes passés</div>
      </div>

      <div className="px-5 flex flex-col gap-2.5 mt-3 mb-[100px]">
        {loading ? (
          <div className="text-center text-sm text-muted py-8">Chargement...</div>
        ) : questions.length === 0 ? (
          <div className="text-center text-sm text-muted py-8">
            Aucun épisode validé pour le moment
          </div>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className="bg-surface border border-border rounded-xl px-4 py-3.5 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-surface-2 border border-border-2 flex items-center justify-center text-gold font-display italic text-sm shrink-0">
                {q.episode_number ?? '–'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text truncate">{q.titre}</div>
                <div className="text-xs text-muted truncate">{q.artiste}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-muted-2">{formatDate(q.date)}</div>
                {q.genre && <div className="text-[11px] text-gold mt-0.5">{q.genre}</div>}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </>
  )
}
