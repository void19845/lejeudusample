import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getTodayDate } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()

  try {
    const { pseudo, titre_soumis, artiste_soumis } = await req.json()

    if (!pseudo?.trim()) {
      return NextResponse.json({ error: 'Pseudo requis' }, { status: 400 })
    }
    if (!titre_soumis?.trim() && !artiste_soumis?.trim()) {
      return NextResponse.json({ error: 'Au moins un champ requis' }, { status: 400 })
    }

    const today = getTodayDate()

    // Récupère la question du jour
    const { data: question, error: qError } = await supabase
      .from('questions')
      .select('id, validated_at')
      .eq('date', today)
      .single()

    if (qError || !question) {
      return NextResponse.json({ error: 'Aucune question pour aujourd\'hui' }, { status: 404 })
    }

    // Bloque les soumissions après validation
    if (question.validated_at) {
      return NextResponse.json({ error: 'Les réponses sont clôturées pour aujourd\'hui' }, { status: 403 })
    }

    // Upsert : insert ou update si le pseudo existe déjà
    const { data, error } = await supabase
      .from('submissions')
      .upsert(
        {
          question_id: question.id,
          pseudo: pseudo.trim(),
          titre_soumis: titre_soumis?.trim() ?? '',
          artiste_soumis: artiste_soumis?.trim() ?? '',
          submitted_at: new Date().toISOString(),
          // Reset les champs calculés en cas de modification
          titre_correct: null,
          artiste_correct: null,
          points: null,
          is_first_correct: false,
        },
        { onConflict: 'question_id,pseudo' }
      )
      .select()
      .single()

    if (error) {
      console.error('Submission error:', error)
      return NextResponse.json({ error: 'Erreur lors de la soumission' }, { status: 500 })
    }

    return NextResponse.json({ success: true, submission: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
