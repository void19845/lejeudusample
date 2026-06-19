export type Question = {
  id: string
  date: string
  titre: string
  artiste: string
  validated_at: string | null
  created_at: string
  episode_number: number
  genre: string | null
}

export type Submission = {
  id: string
  question_id: string
  pseudo: string
  titre_soumis: string
  artiste_soumis: string
  submitted_at: string
  titre_correct: boolean | null
  artiste_correct: boolean | null
  points: number | null
  is_first_correct: boolean | null
}

export type ScoreRow = {
  pseudo: string
  total_points: number
  nb_participations: number
  nb_correct: number
  rank: number
}

export type SubmissionResult = {
  titre_correct: boolean
  artiste_correct: boolean
  points: number
  is_first_correct: boolean
}
