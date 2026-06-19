import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

function checkAuth(req: NextRequest): boolean {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

// GET : récupère la période actuelle du scoreboard
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('config')
    .select('key, value')
    .in('key', ['scoreboard_start', 'scoreboard_end'])

  if (error) {
    return NextResponse.json({ error: 'Erreur lecture config' }, { status: 500 })
  }

  const config = Object.fromEntries(data.map((row) => [row.key, row.value]))
  return NextResponse.json({
    start: config.scoreboard_start,
    end: config.scoreboard_end,
  })
}

// POST : met à jour la période du scoreboard
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const supabase = createAdminClient()
  const { start, end } = await req.json()

  if (!start || !end) {
    return NextResponse.json({ error: 'start et end requis (format YYYY-MM-DD)' }, { status: 400 })
  }

  if (new Date(start) > new Date(end)) {
    return NextResponse.json({ error: 'La date de début doit précéder la date de fin' }, { status: 400 })
  }

  const updates = [
    supabase.from('config').upsert({ key: 'scoreboard_start', value: start }),
    supabase.from('config').upsert({ key: 'scoreboard_end', value: end }),
  ]

  const results = await Promise.all(updates)
  const hasError = results.some((r) => r.error)

  if (hasError) {
    return NextResponse.json({ error: 'Erreur mise à jour config' }, { status: 500 })
  }

  return NextResponse.json({ success: true, start, end })
}
