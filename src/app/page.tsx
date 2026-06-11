// Server Component — busca os dados e passa para os componentes
import { Suspense } from 'react'
import Header from '@/components/Header'
import CalendarStrip from '@/components/CalendarStrip'
import GamesList from '@/components/GamesList'
import { getGamesByDate, getTodayDate } from '@/lib/apiSports'

interface HomeProps {
  searchParams: Promise<{ date?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const date = params.date ?? getTodayDate()

  // Busca os jogos no servidor — cache de 5min via next.revalidate
  const games = await getGamesByDate(date)

  return (
    <main className="min-h-screen bg-brand-dark">
      <Header />
      <CalendarStrip selectedDate={date} />
      <Suspense fallback={<GamesLoading />}>
        <GamesList games={games} selectedDate={date} />
      </Suspense>
    </main>
  )
}

function GamesLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center text-brand-muted">
      <p className="text-4xl mb-3 animate-bounce">🏀</p>
      <p className="text-sm">Carregando jogos...</p>
    </div>
  )
}
