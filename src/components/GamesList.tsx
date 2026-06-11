'use client'

import { useState } from 'react'
import type { Game, ApiLeague, GamesByLeague } from '@/types'
import { PRIORITY_LEAGUES } from '@/constants'
import { proxyImg } from '@/lib/apiSports'
import GameCard from './GameCard'

interface GamesListProps {
  games: Game[]
  selectedDate: string
}

function groupByLeague(games: Game[]): GamesByLeague[] {
  const map = new Map<number, GamesByLeague>()
  for (const game of games) {
    const existing = map.get(game.league.id)
    if (existing) {
      existing.games.push(game)
    } else {
      map.set(game.league.id, { league: game.league, games: [game] })
    }
  }
  // Ordena: ligas prioritárias primeiro, resto depois
  return Array.from(map.values()).sort((a, b) => {
    const ai = PRIORITY_LEAGUES.findIndex(l => l.id === a.league.id)
    const bi = PRIORITY_LEAGUES.findIndex(l => l.id === b.league.id)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d     = new Date(year, month - 1, day)
  const today = new Date()
  const fmt   = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

  if (dateStr === fmt(today)) return 'Hoje'
  const yst = new Date(today); yst.setDate(today.getDate() - 1)
  if (dateStr === fmt(yst)) return 'Ontem'
  const tmr = new Date(today); tmr.setDate(today.getDate() + 1)
  if (dateStr === fmt(tmr)) return 'Amanhã'
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function GamesList({ games, selectedDate }: GamesListProps) {
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null)

  const allGroups     = groupByLeague(games)
  const leaguesInDay  = allGroups.map(g => g.league)

  // Filtro: só ligas prioritárias que têm jogo nesse dia
  const filterOptions = PRIORITY_LEAGUES.filter(pl =>
    leaguesInDay.some(l => l.id === pl.id)
  )

  // Aplica filtro
  const visibleGroups = selectedLeagueId === null
    ? allGroups
    : allGroups.filter(g => g.league.id === selectedLeagueId)

  return (
    <section className="max-w-4xl mx-auto px-4 py-6">

      {/* Cabeçalho */}
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-white font-bold text-lg capitalize">
          {formatDateLabel(selectedDate)}
        </h2>
        {games.length > 0 && (
          <span className="text-brand-muted text-sm">
            {games.length} {games.length === 1 ? 'jogo' : 'jogos'}
          </span>
        )}
      </div>

      {/* Filtro por liga (só aparece se há ligas prioritárias no dia) */}
      {filterOptions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
          <FilterChip
            label="Todas"
            active={selectedLeagueId === null}
            onClick={() => setSelectedLeagueId(null)}
          />
          {filterOptions.map(opt => (
            <FilterChip
              key={opt.id}
              label={opt.label}
              active={selectedLeagueId === opt.id}
              onClick={() => setSelectedLeagueId(
                selectedLeagueId === opt.id ? null : opt.id
              )}
            />
          ))}
        </div>
      )}

      {/* Sem jogos */}
      {games.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏀</p>
          <p className="text-white/70 font-medium">Nenhum jogo encontrado</p>
          <p className="text-brand-muted text-sm mt-1">Tente selecionar outra data</p>
        </div>
      )}

      {/* Lista por liga */}
      <div className="flex flex-col gap-8">
        {visibleGroups.map(({ league, games: leagueGames }) => (
          <LeagueGroup key={league.id} league={league} games={leagueGames} />
        ))}
      </div>

    </section>
  )
}

// ---- Chip de filtro ----
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
        active
          ? 'bg-brand-orange text-white'
          : 'bg-brand-card border border-brand-border text-brand-muted hover:text-white',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

// ---- Grupo de liga ----
interface LeagueGroupProps {
  league: ApiLeague
  games: Game[]
}

function LeagueGroup({ league, games }: LeagueGroupProps) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-brand-border">
        {league.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={proxyImg(league.logo)}
            alt=""
            width={20}
            height={20}
            className="object-contain flex-shrink-0 w-5 h-5"
            loading="lazy"
          />
        )}
        <span className="text-white font-semibold text-sm">{league.name}</span>
        <span className="text-brand-muted text-xs ml-auto">
          {games.length} {games.length === 1 ? 'jogo' : 'jogos'}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
