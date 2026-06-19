import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { isCorrect, calculatePoints } from '@/lib/scoring'
import { getTodayDate } from '@/lib/utils'

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const supabase = createAdminClient()
  const today = getTodayDate()

  // Récupère la question du jour
  const { data: question, error: qErr } = await supabase
    .from('questions')
    .select('*')
    .eq('date', today)
    .single()

  if (qErr || !question) {
    return NextResponse.json({ error: 'Aucune question pour aujourd\'hui' }, { status: 404 })
  }

  if (question.validated_at) {
    return NextResponse.json({ error: 'Déjà validé aujourd\'hui' }, { status: 409 })
  }

  // Récupère toutes les soumissions du jour
  const { data: submissions, error: sErr } = await supabase
    .from('submissions')
    .select('*')
    .eq('question_id', question.id)
    .order('submitted_at', { ascending: true })

  if (sErr) {
    return NextResponse.json({ error: 'Erreur lecture soumissions' }, { status: 500 })
  }

  // Calcule les résultats pour chaque soumission
  let firstCorrectFound = false

  const updates = submissions.map((sub) => {
    const titreCorrect = isCorrect(sub.titre_soumis, question.titre)
    const artisteCorrect = isCorrect(sub.artiste_soumis, question.artiste)

    // Le bonus "premier" va au 1er qui a les deux corrects (submissions triées par submitted_at)
    const isFirstCorrect = !firstCorrectFound && titreCorrect && artisteCorrect
    if (isFirstCorrect) firstCorrectFound = true

    const points = calculatePoints({ titreCorrect, artisteCorrect, isFirstCorrect })

    return {
      id: sub.id,
      titre_correct: titreCorrect,
      artiste_correct: artisteCorrect,
      is_first_correct: isFirstCorrect,
      points,
    }
  })

  // Met à jour toutes les soumissions en batch
  const updatePromises = updates.map((u) =>
    supabase
      .from('submissions')
      .update({
        titre_correct: u.titre_correct,
        artiste_correct: u.artiste_correct,
        is_first_correct: u.is_first_correct,
        points: u.points,
      })
      .eq('id', u.id)
  )

  await Promise.all(updatePromises)

  // Marque la question comme validée
  await supabase
    .from('questions')
    .update({ validated_at: new Date().toISOString() })
    .eq('id', question.id)

  // Stats récap
  const nbBonneReponse = updates.filter((u) => u.titre_correct && u.artiste_correct).length
  const nbTitreSeul = updates.filter((u) => u.titre_correct && !u.artiste_correct).length
  const nbArtisteSeul = updates.filter((u) => !u.titre_correct && u.artiste_correct).length
  const firstCorrect = updates.find((u) => u.is_first_correct)
  const firstPseudo = firstCorrect
    ? submissions.find((s) => s.id === firstCorrect.id)?.pseudo
    : null

  return NextResponse.json({
    success: true,
    stats: {
      total: submissions.length,
      bonneReponse: nbBonneReponse,
      titreSeul: nbTitreSeul,
      artisteSeul: nbArtisteSeul,
      firstCorrect: firstPseudo,
    },
  })
}
