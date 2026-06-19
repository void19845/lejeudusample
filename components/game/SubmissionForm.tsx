'use client'

import { useState } from 'react'

type Props = {
  pseudo: string
  onSubmitted: (titre: string, artiste: string) => void
}

export function SubmissionForm({ pseudo, onSubmitted }: Props) {
  const [titre, setTitre] = useState('')
  const [artiste, setArtiste] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!titre.trim() && !artiste.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudo,
          titre_soumis: titre,
          artiste_soumis: artiste,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Erreur lors de la soumission')
        return
      }

      onSubmitted(titre, artiste)
    } catch {
      setError('Erreur réseau, réessaie')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted pl-0.5">
          Titre de la chanson samplée
        </label>
        <input
          className="bg-surface border border-border rounded-xl px-4 py-3.5 text-[15px] text-text outline-none transition-all focus:border-gold-dim focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] placeholder:text-muted-2"
          type="text"
          placeholder="Ex : Superstar"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted pl-0.5">
          Artiste
        </label>
        <input
          className="bg-surface border border-border rounded-xl px-4 py-3.5 text-[15px] text-text outline-none transition-all focus:border-gold-dim focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] placeholder:text-muted-2"
          type="text"
          placeholder="Ex : The Carpenters"
          value={artiste}
          onChange={(e) => setArtiste(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="text-[12px] text-red px-0.5">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || (!titre.trim() && !artiste.trim())}
        className="mt-1 w-full py-4 bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-semibold uppercase tracking-wider rounded-xl transition-colors active:scale-[0.98]"
      >
        {loading ? 'Envoi...' : 'Soumettre ma réponse'}
      </button>
      <div className="text-center text-[11px] text-muted-2">
        Tu peux modifier ta réponse avant minuit
      </div>
    </div>
  )
}
