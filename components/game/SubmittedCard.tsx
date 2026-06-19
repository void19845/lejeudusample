type Props = {
  titre: string
  artiste: string
  submittedAt: string
  validated: boolean
  titreCorrect?: boolean | null
  artisteCorrect?: boolean | null
  points?: number | null
}

export function SubmittedCard({
  titre,
  artiste,
  submittedAt,
  validated,
  titreCorrect,
  artisteCorrect,
  points,
}: Props) {
  return (
    <div className="mx-5 bg-surface border border-border-2 rounded-2xl p-4.5 p-[18px]">
      <div className="flex items-center gap-2.5 mb-3.5">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border ${
            validated
              ? 'bg-green/10 border-green/30 text-green'
              : 'bg-green/10 border-green/30 text-green'
          }`}
        >
          ✓
        </div>
        <div>
          <div className="text-[13px] font-semibold text-green">Réponse envoyée</div>
          <div className="text-[11px] text-muted">{submittedAt}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-muted uppercase tracking-wider">Titre</span>
          <span className="text-[13px] font-medium text-text italic flex items-center gap-1.5">
            {titre || '—'}
            {validated && titreCorrect !== null && (
              <span>{titreCorrect ? '✅' : '❌'}</span>
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-muted uppercase tracking-wider">Artiste</span>
          <span className="text-[13px] font-medium text-text italic flex items-center gap-1.5">
            {artiste || '—'}
            {validated && artisteCorrect !== null && (
              <span>{artisteCorrect ? '✅' : '❌'}</span>
            )}
          </span>
        </div>
      </div>

      {!validated ? (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />
          En attente de validation
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted uppercase tracking-wider">Points gagnés</span>
          <span className="text-base font-semibold text-gold">{points} pts</span>
        </div>
      )}
    </div>
  )
}
