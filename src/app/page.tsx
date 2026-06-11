// Server Component — composição da landing page
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CalendarStrip from '@/components/CalendarStrip'
import GamesList from '@/components/GamesList'
import LiveGamesSection from '@/components/LiveGamesSection'
import LiveRefresher from '@/components/LiveRefresher'
import ScoreTicker from '@/components/ScoreTicker'
import LeagueFilterBar from '@/components/LeagueFilterBar'
import LeaguesInfo from '@/components/LeaguesInfo'
import AdBanner from '@/components/AdBanner'
import { getGamesByDate, getTodayDate, isLive } from '@/lib/apiSports'

interface HomeProps {
  searchParams: Promise<{ date?: string; league?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params        = await searchParams
  const date          = params.date ?? getTodayDate()
  const leagueParam   = params.league ? parseInt(params.league, 10) : null
  const selectedLeague = leagueParam !== null && !Number.isNaN(leagueParam)
    ? leagueParam
    : null

  const games = await getGamesByDate(date)

  // Filtra por liga se houver seleção
  const filteredGames = selectedLeague !== null
    ? games.filter((g) => g.league.id === selectedLeague)
    : games

  const liveGames    = filteredGames.filter((g) => isLive(g.status.short))
  const hasLiveGames = liveGames.length > 0

  return (
    <main className="min-h-screen bg-brand-dark">
      <Header />
      <ScoreTicker games={games} />
      <Hero />

      {/* Barra sticky: filtro de liga + calendário ficam grudados abaixo do header */}
      <div id="jogos" className="sticky top-14 z-40 scroll-mt-14">
        <LeagueFilterBar selectedLeague={selectedLeague} selectedDate={date} />
        <CalendarStrip selectedDate={date} />
      </div>

      {/* Conteúdo dos jogos */}
      <div>
        {/* Auto-refresh silencioso enquanto houver jogos ao vivo */}
        <LiveRefresher isActive={hasLiveGames} />

        {/* Jogos ao vivo em destaque */}
        <LiveGamesSection games={liveGames} />

        {/* Lista completa por liga */}
        <GamesList
          games={filteredGames}
          selectedDate={date}
          hasLeagueFilter={selectedLeague !== null}
        />
      </div>

      <LeaguesInfo />
      <AdBanner />

      {/* Footer */}
      <footer className="border-t border-brand-border">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-brand-muted">
          <p>© 2026 Basketball Hub Brasil</p>
          <p>Dados: API-Sports · Horários no fuso de Brasília</p>
        </div>
      </footer>
    </main>
  )
}
