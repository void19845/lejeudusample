'use client'

import { useEffect, useState } from 'react'
import type { Question } from '@/types'

function getAdminPassword(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('admin_pwd')
}

function AdminLogin({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)

  async function handleLogin() {
    const res = await fetch('/api/admin/question', {
      headers: { 'x-admin-password': pwd },
    })
    if (res.status === 401) {
      setError(true)
      return
    }
    sessionStorage.setItem('admin_pwd', pwd)
    onLogin(pwd)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="font-display italic text-2xl text-gold mb-1">Admin</div>
      <div className="text-xs text-muted mb-6">le jeu du sample</div>
      <input
        type="password"
        autoFocus
        className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-[15px] text-text outline-none focus:border-gold-dim"
        placeholder="Mot de passe"
        value={pwd}
        onChange={(e) => { setPwd(e.target.value); setError(false) }}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
      />
      {error && <div className="text-xs text-red mt-2">Mot de passe incorrect</div>}
      <button
        onClick={handleLogin}
        className="mt-4 w-full py-3.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold uppercase tracking-wider rounded-xl transition-colors"
      >
        Connexion
      </button>
    </div>
  )
}

function QuestionForm({ pwd, onSaved }: { pwd: string; onSaved: (q: Question) => void }) {
  const [titre, setTitre] = useState('')
  const [artiste, setArtiste] = useState('')
  const [genre, setGenre] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    const res = await fetch('/api/admin/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pwd },
      body: JSON.stringify({
        titre,
        artiste,
        genre,
        episode_number: episodeNumber ? Number(episodeNumber) : null,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setMessage('Question enregistrée ✓')
      onSaved(data.question)
    } else {
      setMessage(data.error ?? 'Erreur')
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3">
      <div className="text-sm font-semibold text-text mb-1">Sample du jour</div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted">N° épisode</label>
        <input
          className="bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-gold-dim"
          value={episodeNumber}
          onChange={(e) => setEpisodeNumber(e.target.value)}
          placeholder="Ex : 54"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted">Titre (bonne réponse)</label>
        <input
          className="bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-gold-dim"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex : Superstar"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted">Artiste (bonne réponse)</label>
        <input
          className="bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-gold-dim"
          value={artiste}
          onChange={(e) => setArtiste(e.target.value)}
          placeholder="Ex : The Carpenters"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted">Genre musical</label>
        <input
          className="bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-gold-dim"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Ex : Hip hop français"
        />
      </div>

      {message && <div className="text-xs text-gold">{message}</div>}

      <button
        onClick={handleSave}
        disabled={saving || !titre.trim() || !artiste.trim()}
        className="mt-2 w-full py-3.5 bg-gold hover:bg-gold-light disabled:opacity-50 text-black text-sm font-semibold uppercase tracking-wider rounded-xl transition-colors"
      >
        {saving ? 'Enregistrement...' : 'Enregistrer la question'}
      </button>
    </div>
  )
}

function ValidationPanel({ pwd, question, submissionsCount }: { pwd: string; question: Question | null; submissionsCount: number }) {
  const [validating, setValidating] = useState(false)
  const [stats, setStats] = useState<{
    total: number; bonneReponse: number; titreSeul: number; artisteSeul: number; firstCorrect: string | null
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleValidate() {
    setValidating(true)
    setError(null)
    const res = await fetch('/api/admin/validate', {
      method: 'POST',
      headers: { 'x-admin-password': pwd },
    })
    const data = await res.json()
    setValidating(false)
    if (res.ok) {
      setStats(data.stats)
    } else {
      setError(data.error)
    }
  }

  if (!question) return null

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3 mt-4">
      <div className="text-sm font-semibold text-text">Validation du jour</div>
      <div className="text-xs text-muted">
        {submissionsCount} réponse{submissionsCount > 1 ? 's' : ''} soumise{submissionsCount > 1 ? 's' : ''}
      </div>

      {question.validated_at ? (
        <div className="text-xs text-green">✓ Déjà validé aujourd&apos;hui</div>
      ) : (
        <button
          onClick={handleValidate}
          disabled={validating}
          className="w-full py-3.5 bg-gold hover:bg-gold-light disabled:opacity-50 text-black text-sm font-semibold uppercase tracking-wider rounded-xl transition-colors"
        >
          {validating ? 'Calcul en cours...' : 'Valider et calculer les scores'}
        </button>
      )}

      {error && <div className="text-xs text-red">{error}</div>}

      {stats && (
        <div className="bg-surface-2 rounded-xl p-4 mt-2 flex flex-col gap-1.5 text-xs">
          <div className="flex justify-between"><span className="text-muted">Total réponses</span><span className="text-text">{stats.total}</span></div>
          <div className="flex justify-between"><span className="text-muted">Titre + Artiste ✓</span><span className="text-text">{stats.bonneReponse}</span></div>
          <div className="flex justify-between"><span className="text-muted">Titre seul ✓</span><span className="text-text">{stats.titreSeul}</span></div>
          <div className="flex justify-between"><span className="text-muted">Artiste seul ✓</span><span className="text-text">{stats.artisteSeul}</span></div>
          {stats.firstCorrect && (
            <div className="flex justify-between"><span className="text-muted">Bonus 1er</span><span className="text-gold">{stats.firstCorrect}</span></div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [pwd, setPwd] = useState<string | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [submissionsCount, setSubmissionsCount] = useState(0)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const saved = getAdminPassword()
    if (saved) loadQuestion(saved)
    else setChecked(true)
  }, [])

  async function loadQuestion(password: string) {
    const res = await fetch('/api/admin/question', {
      headers: { 'x-admin-password': password },
    })
    if (res.ok) {
      const data = await res.json()
      setQuestion(data.question)
      setSubmissionsCount(data.submissionsCount)
      setPwd(password)
    }
    setChecked(true)
  }

  if (!checked) return null

  if (!pwd) {
    return <AdminLogin onLogin={loadQuestion} />
  }

  return (
    <div className="px-5 pt-6 pb-12 flex flex-col">
      <div className="font-display italic text-2xl text-gold mb-1">Admin</div>
      <div className="text-xs text-muted mb-6">le jeu du sample</div>

      <QuestionForm pwd={pwd} onSaved={(q) => setQuestion(q)} />
      <ValidationPanel pwd={pwd} question={question} submissionsCount={submissionsCount} />
    </div>
  )
}
