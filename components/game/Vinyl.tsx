export function Vinyl({ spinning = true }: { spinning?: boolean }) {
  return (
    <div className="relative w-[200px] h-[200px]">
      <div
        className={`w-[200px] h-[200px] rounded-full ${spinning ? 'animate-vinyl' : ''}`}
        style={{
          background:
            'repeating-radial-gradient(circle at center, #1a1a1a 0px, #111 2px, #1a1a1a 4px, #0d0d0d 6px)',
          boxShadow: '0 0 0 1px #333, 0 20px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full bg-surface-2 border-2 border-border-2 flex flex-col items-center justify-center gap-0.5 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
        <div className="text-[7px] font-semibold uppercase tracking-wider text-muted mt-0.5">
          Sample
        </div>
      </div>
    </div>
  )
}
