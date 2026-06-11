import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse, ApiStanding, StandingGroup } from '@/types'
import { API_BASE_URL, LEAGUE_CURRENT_SEASON } from '@/constants'

export async function GET(request: NextRequest) {
  const leagueId = Number(request.nextUrl.searchParams.get('league'))

  if (!leagueId) {
    return NextResponse.json({ error: 'league param required' }, { status: 400 })
  }

  const season = LEAGUE_CURRENT_SEASON[leagueId]
  if (!season) {
    return NextResponse.json({ error: 'league not supported' }, { status: 400 })
  }

  const key = process.env.API_SPORTS_KEY
  if (!key) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/standings?league=${leagueId}&season=${season}`,
      {
        headers: { 'x-apisports-key': key },
        next: { revalidate: 3600 }, // standings mudam pouco — cache de 1h
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: `API error ${res.status}` }, { status: 502 })
    }

    const data: ApiResponse<ApiStanding[]> = await res.json()

    if (!Array.isArray(data.response)) {
      return NextResponse.json({ groups: [] })
    }

    // response é array de arrays — cada sub-array é uma conferência/grupo
    const groups: StandingGroup[] = data.response.map((rows) => ({
      name: rows[0]?.group?.name ?? null,
      rows,
    }))

    return NextResponse.json({ groups })
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 })
  }
}
