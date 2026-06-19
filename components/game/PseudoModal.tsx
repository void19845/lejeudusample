'use client'

import { useState } from 'react'

export function PseudoModal({ onSet }: { onSet: (pseudo: string) => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    const trimmed = value.trim()
    if (trimmed.length < 2) {
      setError('Au moins 2 caractères')
      return
    }
    if (trimmed.length > 20) {
      setError('20 caractères maximum')
      return
    }
    onSet(trimmed)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-5">
      <div className="w-full max-w-[380px] bg-surface border border-border-2 rounded-2xl p-6">
        <div className="font-display italic text-2xl text-text mb-1">
          Choisis ton <span className="text-gold">pseudo</span>
        </div>
        <div className="text-[13px] text-muted mb-5">
          Pas de compte, juste un nom pour le classement
        </div>
        <input
          autoFocus
          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3.5 text-[15px] text-text outline-none transition-all focus:border-gold-dim focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] placeholder:text-muted-2"
          placeholder="Ton pseudo"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          maxLength={20}
        />
        {error && <div className="text-[12px] text-red mt-2">{error}</div>}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-3.5 bg-gold hover:bg-gold-light text-black text-sm font-semibold uppercase tracking-wider rounded-xl transition-colors active:scale-[0.98]"
        >
          C&apos;est parti
        </button>
      </div>
    </div>
  )
}
