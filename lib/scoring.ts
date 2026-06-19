import { distance } from 'fastest-levenshtein'

// Normalise une chaîne : lowercase, sans accents, sans ponctuation ni espaces
export function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // accents
    .replace(/[^a-z0-9]/g, '')        // tout sauf lettres et chiffres
}

// Seuil de tolérance proportionnel (~20% de la longueur, plafonné à 3)
function maxDistance(normalizedCorrect: string): number {
  const len = normalizedCorrect.length
  if (len <= 4) return 0
  return Math.min(3, Math.floor(len * 0.2))
}

export function isCorrect(userAnswer: string, correctAnswer: string): boolean {
  const a = normalize(userAnswer)
  const b = normalize(correctAnswer)
  if (!b) return false
  return distance(a, b) <= maxDistance(b)
}

// Calcule les points d'une soumission après validation
export function calculatePoints({
  titreCorrect,
  artisteCorrect,
  isFirstCorrect,
}: {
  titreCorrect: boolean
  artisteCorrect: boolean
  isFirstCorrect: boolean
}): number {
  let pts = 0.25 // bonus participation systématique

  if (titreCorrect && artisteCorrect) {
    pts += 1
    if (isFirstCorrect) pts += 0.5
  } else if (titreCorrect) {
    pts += 1
  } else if (artisteCorrect) {
    pts += 0.5
  }

  return pts
}
