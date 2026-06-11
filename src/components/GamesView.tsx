'use client'

import { useState } from 'react'
import type { Game } from '@/types'
import { isLive, getFeaturedGame } from '@/lib/apiSports'
import { FEATURED_LEAGUES } from '@/constants'
import LeagueFilterBar from './LeagueFilterBar'
import CalendarStrip from './CalendarStrip'
import FeaturedGameCard from './FeaturedGameCard'
import LiveGamesSection from './LiveGamesSection'
import LiveRefresher from './LiveRefresher'
import GamesList from './GamesList'
import StandingsTable from './StandingsTable'

interface GamesViewProps {
  games: Game[]
  selectedDate: string
  initialLeague: number | null
}

type View = 'jogos' | 'classificacao'

export default function GamesView({
  games,
  selectedDate,
  initialLeague,
}: GamesViewProps) {
  const [selectedLeague, setSelectedLeague] = useState<number | null>(initialLeague)
  const [view, setView] = useState<View>('jogos')

  function handleSelectLeague(id: number | null) {
    setSelectedLeague(id)
    setView('jogos') // volta para jogos ao trocar de liga
    const url = new URL(window.location.href)
    if (id !== null) {
      url.searchParams.set('league', String(id))
    } else {
      url.searchParams.delete('league')
    }
    window.history.replaceState(null, '', url.pathname + url.search)
  }

  const filteredGames =
    selectedLeague !== null
      ? games.filter((g) => g.league.id === selectedLeague)
      : games

  const liveGames    = filteredGames.filter((g) => isLive(g.status.short))
  const hasLiveGames = liveGames.length > 0

  const featuredGame = selectedLeague === null ? getFeaturedGame(games) : null

  // Liga para a classificação: a selecionada, ou NBA por padrão
  const standingsLeagueId = selectedLeague ?? 12

  // Só mostra a aba classificação para as ligas que suportam
  const supportedLeagueIds = new Set(FEATURED_LEAGUES.map((l) => l.id))
  const canShowStandings   = supportedLeagueIds.has(standingsLeagueId)

  return (
    <>
      {/* Barra sticky: filtro + calendário + toggle de view */}
      <div className="sticky top-14 z-40">
        <LeagueFilterBar
          selectedLeague={selectedLeague}
          onSelectLeague={handleSelectLeague}
        />
        <CalendarStrip selectedDate={selectedDate} />

        {/* Toggle Jogos / Classificação */}
        <div className="bg-brand-dark border-b border-brand-border px-4 py-2 flex gap-1">
          <ViewTab active={view === 'jogos'} onClick={() => setView('jogos')}>
            Jogos
          </ViewTab>
          {canShowStandings && (
            <ViewTab active={view === 'classificacao'} onClick={() => setView('classificacao')}>
              Classificação
            </ViewTab>
          )}
        </div>
      </div>

      {view === 'classificacao' ? (
        <StandingsTable leagueId={standingsLeagueId} />
      ) : (
        <>
          {/* Jogo em destaque — aparece sempre que NBA, WNBA ou NBB têm jogos */}
          {featuredGame && <FeaturedGameCard game={featuredGame} />}

          {/* Auto-refresh silencioso durante jogos ao vivo */}
          <LiveRefresher isActive={hasLiveGames} />

          {/* Jogos ao vivo em destaque */}
          <LiveGamesSection games={liveGames} />

          {/* Lista completa por liga */}
          <GamesList
            games={filteredGames}
            selectedDate={selectedDate}
            hasLeagueFilter={selectedLeague !== null}
          />
        </>
      )}
    </>
  )
}

interface ViewTabProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function ViewTab({ active, onClick, children }: ViewTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
        active
          ? 'bg-brand-orange text-brand-dark'
          : 'text-brand-muted hover:text-white hover:bg-brand-card'
      }`}
    >
      {children}
    </button>
  )
}
