'use client'

import { useState } from 'react'
import type { Game } from '@/types'
import { isLive, getFeaturedGame } from '@/lib/apiSports'
import LeagueFilterBar from './LeagueFilterBar'
import CalendarStrip from './CalendarStrip'
import FeaturedGameCard from './FeaturedGameCard'
import LiveGamesSection from './LiveGamesSection'
import LiveRefresher from './LiveRefresher'
import GamesList from './GamesList'

interface GamesViewProps {
  /** Apenas jogos das ligas em destaque, já filtrados pelo servidor */
  games: Game[]
  selectedDate: string
  initialLeague: number | null
}

/**
 * Client Component responsável por toda a área de jogos.
 * O filtro por liga é estado local — sem round-trip ao servidor.
 * Somente mudanças de data causam nova busca (via CalendarStrip → router.push).
 */
export default function GamesView({
  games,
  selectedDate,
  initialLeague,
}: GamesViewProps) {
  const [selectedLeague, setSelectedLeague] = useState<number | null>(
    initialLeague
  )

  function handleSelectLeague(id: number | null) {
    setSelectedLeague(id)
    // Atualiza URL sem triggar navegação Next.js — para links compartilháveis
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

  // Jogo em destaque só aparece quando não há filtro de liga ativo
  const featuredGame = selectedLeague === null ? getFeaturedGame(games) : null

  return (
    <>
      {/* Barra sticky abaixo do header: filtro + calendário */}
      <div className="sticky top-14 z-40">
        <LeagueFilterBar
          selectedLeague={selectedLeague}
          onSelectLeague={handleSelectLeague}
        />
        <CalendarStrip selectedDate={selectedDate} />
      </div>

      {/* Jogo em destaque (finais / playoffs) */}
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
  )
}
