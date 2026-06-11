// Server Component — composição da landing page
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CalendarStrip from '@/components/CalendarStrip'
import GamesList from '@/components/GamesList'
import LeaguesInfo from '@/components/LeaguesInfo'
import AdBanner from '@/components/AdBanner'
import { getGamesByDate, getTodayDate } from '@/lib/apiSports'

interface HomeProps {
  searchParams: Promise<{ date?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const date = params.date ?? getTodayDate()
  const games = await getGamesByDate(date)

  return (
    <main className="min-h-screen bg-brand-dark">
      <Header />
      <Hero />

      {/* Jogos: calendário + lista */}
      <div id="jogos" className="scroll-mt-14">
        <CalendarStrip selectedDate={date} />
        <GamesList games={games} selectedDate={date} />
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
