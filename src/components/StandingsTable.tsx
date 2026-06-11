'use client'

import { useEffect, useState } from 'react'
import type { StandingGroup } from '@/types'
import { FEATURED_LEAGUES } from '@/constants'
import TeamLogo from './TeamLogo'

interface StandingsTableProps {
  leagueId: number
}

export default function StandingsTable({ leagueId }: StandingsTableProps) {
  const [groups, setGroups]     = useState<StandingGroup[] | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setGroups(null)

    fetch(`/api/standings?league=${leagueId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { groups: StandingGroup[] }) => setGroups(data.groups))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [leagueId])

  const league = FEATURED_LEAGUES.find((l) => l.id === leagueId)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <div className="inline-block w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="text-brand-muted text-sm mt-3">Carregando classificação…</p>
      </div>
    )
  }

  if (error || !groups || groups.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-white/70 font-medium">Classificação não disponível</p>
        <p className="text-brand-muted text-sm mt-1">
          Tente novamente mais tarde
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {groups.map((group, gi) => (
        <div key={gi}>
          {/* Cabeçalho do grupo (conferência) */}
          {group.name && (
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-4 rounded-full bg-brand-orange flex-shrink-0" />
              <h3 className="text-white font-bold text-sm tracking-wide">
                {group.name}
              </h3>
            </div>
          )}

          {!group.name && league && (
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-4 rounded-full bg-brand-orange flex-shrink-0" />
              <h3 className="text-white font-bold text-sm tracking-wide">
                {league.name}
              </h3>
            </div>
          )}

          <div className="bg-brand-card rounded-2xl overflow-hidden border border-brand-border">
            {/* Header da tabela */}
            <div className="grid grid-cols-[2rem_1fr_2.5rem_2.5rem_2.5rem_4rem] gap-x-2 px-4 py-2 border-b border-brand-border">
              <span className="text-brand-muted text-[10px] font-semibold text-center">#</span>
              <span className="text-brand-muted text-[10px] font-semibold">Time</span>
              <span className="text-brand-muted text-[10px] font-semibold text-center">J</span>
              <span className="text-brand-muted text-[10px] font-semibold text-center">V</span>
              <span className="text-brand-muted text-[10px] font-semibold text-center">D</span>
              <span className="text-brand-muted text-[10px] font-semibold text-right">Aprv.</span>
            </div>

            {/* Linhas */}
            {group.rows.map((row, i) => {
              const pct = parseFloat(row.games.win.percentage)
              const isTop = row.description?.toLowerCase().includes('play') ?? false

              return (
                <div
                  key={`${gi}-${row.team.id}-${i}`}
                  className={`grid grid-cols-[2rem_1fr_2.5rem_2.5rem_2.5rem_4rem] gap-x-2 items-center px-4 py-2.5 ${
                    i < group.rows.length - 1 ? 'border-b border-brand-border/50' : ''
                  } ${isTop ? 'bg-brand-orange/5' : ''}`}
                >
                  {/* Posição */}
                  <span className={`text-xs font-bold text-center ${
                    row.position <= 3 ? 'text-brand-orange' : 'text-brand-muted'
                  }`}>
                    {row.position}
                  </span>

                  {/* Time */}
                  <div className="flex items-center gap-2 min-w-0">
                    <TeamLogo src={row.team.logo} name={row.team.name} size={22} />
                    <span className="text-brand-chalk text-xs font-medium truncate">
                      {row.team.name}
                    </span>
                  </div>

                  {/* J */}
                  <span className="text-brand-muted text-xs text-center tabular-nums">
                    {row.games.played}
                  </span>

                  {/* V */}
                  <span className="text-white text-xs font-semibold text-center tabular-nums">
                    {row.games.win.total}
                  </span>

                  {/* D */}
                  <span className="text-brand-muted text-xs text-center tabular-nums">
                    {row.games.lose.total}
                  </span>

                  {/* Aproveitamento */}
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-10 h-1.5 rounded-full bg-brand-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-orange"
                        style={{ width: `${pct * 100}%` }}
                      />
                    </div>
                    <span className="text-brand-muted text-[10px] tabular-nums w-7 text-right">
                      {(pct * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
