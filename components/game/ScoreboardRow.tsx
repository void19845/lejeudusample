import type { ScoreRow } from '@/types'

export function ScoreboardRow({ score, isMe }: { score: ScoreRow; isMe: boolean }) {
  const isTop3 = score.rank <= 3

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 border transition-colors ${
        isMe
          ? 'bg-gold/5 border-gold-dim'
          : 'bg-surface border-border hover:border-border-2'
      }`}
    >
      <div className={`font-display italic text-lg w-7 text-center shrink-0 ${isTop3 ? 'text-gold' : 'text-muted-2'}`}>
        {score.rank}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-text">
          {score.pseudo}
          {isMe && <span className="text-gold font-normal text-xs"> (toi)</span>}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-sm font-semibold text-gold">{score.total_points.toFixed(2)} pts</div>
        <div className="text-[11px] text-muted-2 mt-0.5">{score.nb_participations} participations</div>
      </div>
    </div>
  )
}
