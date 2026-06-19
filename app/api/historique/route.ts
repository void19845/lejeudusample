import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('questions')
    .select('id, date, titre, artiste, genre, episode_number, validated_at')
    .not('validated_at', 'is', null)
    .order('date', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Erreur historique' }, { status: 500 })
  }

  return NextResponse.json({ questions: data })
}
