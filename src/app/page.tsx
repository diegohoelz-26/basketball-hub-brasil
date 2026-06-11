// Server Component — composição da página
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import GamesView from '@/components/GamesView'
import ScoreTicker from '@/components/ScoreTicker'
import LeaguesInfo from '@/components/LeaguesInfo'
import AdBanner from '@/components/AdBanner'
import { getGamesByDate, getTodayDate } from '@/lib/apiSports'
import { FEATURED_LEAGUES } from '@/constants'

interface HomeProps {
  searchParams: Promise<{ date?: string; league?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params        = await searchParams
  const date          = params.date ?? getTodayDate()
  const leagueParam   = params.league ? parseInt(params.league, 10) : null
  const initialLeague =
    leagueParam !== null && !Number.isNaN(leagueParam) ? leagueParam : null

  const allGames = await getGamesByDate(date)

  // Exibe apenas jogos das 6 ligas em destaque — sem scroll infinito
  const featuredIds = new Set(FEATURED_LEAGUES.map((l) => l.id))
  const games = allGames.filter((g) => featuredIds.has(g.league.id))

  return (
    <main className="min-h-screen bg-brand-dark">
      <Header />
      <ScoreTicker games={games} />
      <Hero />

      <div id="jogos" className="scroll-mt-14">
        <GamesView
          games={games}
          selectedDate={date}
          initialLeague={initialLeague}
        />
      </div>

      <LeaguesInfo />
      <AdBanner />

      <footer className="border-t border-brand-border">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-brand-muted">
          <p>© 2026 Basketball Hub Brasil</p>
          <p>Dados: API-Sports · Horários no fuso de Brasília</p>
        </div>
      </footer>
    </main>
  )
}
