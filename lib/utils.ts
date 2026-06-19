// Récupère le pseudo stocké en localStorage
export function getPseudo(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('pseudo')
}

// Sauvegarde le pseudo en localStorage
export function setPseudo(pseudo: string): void {
  localStorage.setItem('pseudo', pseudo)
}

// Retourne la date du jour au format YYYY-MM-DD (timezone Paris)
export function getTodayDate(): string {
  return new Date().toLocaleDateString('fr-CA', {
    timeZone: 'Europe/Paris',
  })
}

// Formate une date ISO en "jj/mm/aaaa"
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR')
}

// Calcule le temps restant jusqu'à minuit (Europe/Paris)
export function getTimeUntilMidnight(): { h: number; m: number; s: number; pct: number } {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(23, 59, 59, 999)
  const diff = midnight.getTime() - now.getTime()
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  const pct = (diff / 86_400_000) * 100
  return { h, m, s, pct }
}

// Pad number to 2 digits
export function pad(n: number): string {
  return String(n).padStart(2, '0')
}
