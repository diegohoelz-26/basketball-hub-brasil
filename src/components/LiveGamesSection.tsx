// Server Component — seção de jogos ao vivo em destaque visual
import type { Game } from '@/types'
import GameCard from './GameCard'

interface LiveGamesSectionProps {
  games: Game[]
}

export default function LiveGamesSection({ games }: LiveGamesSectionProps) {
  if (games.length === 0) return null

  return (
    <section className="max-w-4xl mx-auto px-4 pt-6 pb-2">
      {/* Cabeçalho AO VIVO */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center gap-2 text-brand-live text-xs font-bold uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full bg-brand-live animate-pulse" />
          Ao Vivo Agora
        </span>
        <span className="text-brand-muted text-xs">
          {games.length} {games.length === 1 ? 'jogo' : 'jogos'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} highlight />
        ))}
      </div>

      {/* Separador visual */}
      <div className="mt-6 border-t border-brand-border" />
    </section>
  )
}
