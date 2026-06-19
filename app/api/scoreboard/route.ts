import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('scoreboard_view')
    .select('*')
    .order('rank', { ascending: true })
    .limit(100)

  if (error) {
    console.error('Scoreboard error:', error)
    return NextResponse.json({ error: 'Erreur scoreboard' }, { status: 500 })
  }

  return NextResponse.json({ scores: data })
}
