import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getTodayDate } from '@/lib/utils'

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('x-admin-password')
  return auth === process.env.ADMIN_PASSWORD
}

// GET : récupère la question du jour (et les soumissions count)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const supabase = createAdminClient()
  const today = getTodayDate()

  const { data: question } = await supabase
    .from('questions')
    .select('*')
    .eq('date', today)
    .single()

  let submissionsCount = 0
  if (question) {
    const { count } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('question_id', question.id)
    submissionsCount = count ?? 0
  }

  return NextResponse.json({ question, submissionsCount })
}

// POST : crée ou met à jour la question du jour
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const supabase = createAdminClient()
  const { titre, artiste, genre, episode_number } = await req.json()

  if (!titre?.trim() || !artiste?.trim()) {
    return NextResponse.json({ error: 'Titre et artiste requis' }, { status: 400 })
  }

  const today = getTodayDate()

  const { data, error } = await supabase
    .from('questions')
    .upsert(
      {
        date: today,
        titre: titre.trim(),
        artiste: artiste.trim(),
        genre: genre?.trim() ?? null,
        episode_number: episode_number ?? null,
      },
      { onConflict: 'date' }
    )
    .select()
    .single()

  if (error) {
    console.error('Question upsert error:', error)
    return NextResponse.json({ error: 'Erreur création question' }, { status: 500 })
  }

  return NextResponse.json({ success: true, question: data })
}
