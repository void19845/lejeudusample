'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'
import { getPseudo, setPseudo as savePseudo, getTodayDate } from '@/lib/utils'
import { Vinyl } from '@/components/game/Vinyl'
import { Timer } from '@/components/game/Timer'
import { SubmissionForm } from '@/components/game/SubmissionForm'
import { SubmittedCard } from '@/components/game/SubmittedCard'
import { ScoreboardRow } from '@/components/game/ScoreboardRow'
import { PseudoModal } from '@/components/game/PseudoModal'
import { BottomNav } from '@/components/ui/BottomNav'
import type { Question, Submission, ScoreRow } from '@/types'

export default function HomePage() {
  const [pseudo, setPseudoState] = useState<string | null>(null)
  const [pseudoLoaded, setPseudoLoaded] = useState(false)
  const [question, setQuestion] = useState<Question | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [scores, setScores] = useState<ScoreRow[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async (currentPseudo: string) => {
    const supabase = createClient()
    const today = getTodayDate()

    const { data: q } = await supabase
      .from('questions')
      .select('*')
      .eq('date', today)
      .maybeSingle()

    setQuestion(q)

    if (q) {
      const { data: sub } = await supabase
        .from('submissions')
        .select('*')
        .eq('question_id', q.id)
        .eq('pseudo', currentPseudo)
        .maybeSingle()
      setSubmission(sub)
    }

    const res = await fetch('/api/scoreboard')
    const { scores: scoreData } = await res.json()
    setScores(scoreData ?? [])

    setLoading(false)
  }, [])

  useEffect(() => {
    const p = getPseudo()
    setPseudoState(p)
    setPseudoLoaded(true)
    if (p) loadData(p)
  }, [loadData])

  function handleSetPseudo(p: string) {
    savePseudo(p)
    setPseudoState(p)
    loadData(p)
  }

  function handleSubmitted(titre: string, artiste: string) {
    setSubmission({
      id: 'temp',
      question_id: question?.id ?? '',
      pseudo: pseudo!,
      titre_soumis: titre,
      artiste_soumis: artiste,
      submitted_at: new Date().toISOString(),
      titre_correct: null,
      artiste_correct: null,
      points: null,
      is_first_correct: null,
    })
  }

  if (!pseudoLoaded) return null

  if (!pseudo) {
    return <PseudoModal onSet={handleSetPseudo} />
  }

  const isValidated = !!question?.validated_at

  return (
    <>
      <header className="flex items-center justify-between px-5 pt-5">
        <div className="font-display italic text-lg text-gold tracking-wide">
          le jeu du sample
        </div>
        <div className="w-[38px] h-[38px] rounded-full bg-surface border border-border flex items-center justify-center text-muted text-sm">
          {pseudo.charAt(0).toUpperCase()}
        </div>
      </header>

      <div className="flex flex-col items-center px-5 pt-7 pb-5">
        {question?.episode_number && (
          <div className="text-[11px] font-medium uppercase tracking-wider text-gold border border-gold-dim rounded-full px-3 py-1 mb-5">
            • Un jour un sample {question.episode_number} •
          </div>
        )}

        <Vinyl spinning={!isValidated} />

        <div className="text-center mt-6">
          <div className="font-display italic text-[28px] text-text leading-tight">
            {loading
              ? 'Chargement...'
              : question
                ? <>Aujourd&apos;hui, <span className="text-gold">quel sample ?</span></>
                : <span className="text-muted">Pas de sample aujourd&apos;hui</span>}
          </div>
          <div className="text-xs text-muted mt-1 tracking-wide">
            Posté à 10h • Révélation à 20h
          </div>
        </div>

        {question?.genre && (
          <div className="inline-flex items-center gap-1.5 bg-surface border border-border rounded-full px-3.5 py-1.5 text-xs text-muted mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            {question.genre}
          </div>
        )}
      </div>

      {question && !isValidated && <Timer />}

      {question && (
        submission ? (
          <SubmittedCard
            titre={submission.titre_soumis}
            artiste={submission.artiste_soumis}
            submittedAt={new Date(submission.submitted_at).toLocaleString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            validated={isValidated}
            titreCorrect={submission.titre_correct}
            artisteCorrect={submission.artiste_correct}
            points={submission.points}
          />
        ) : !isValidated ? (
          <SubmissionForm pseudo={pseudo} onSubmitted={handleSubmitted} />
        ) : (
          <div className="mx-5 text-center text-sm text-muted py-4">
            Tu n&apos;as pas participé aujourd&apos;hui
          </div>
        )
      )}

      <div className="flex items-center gap-3 mx-5 mt-7 mb-4">
        <div className="flex-1 h-px bg-border" />
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-2">
          Classement
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="px-5 flex flex-col gap-2 mb-[100px]">
        {scores.length === 0 ? (
          <div className="text-center text-sm text-muted py-4">
            Aucun score pour le moment
          </div>
        ) : (
          scores
            .slice(0, 5)
            .map((s) => <ScoreboardRow key={s.pseudo} score={s} isMe={s.pseudo === pseudo} />)
        )}
      </div>

      <BottomNav />
    </>
  )
}
