// Server Component — ticker de resultados no topo (animação CSS pura, sem JS)
import type { Game } from '@/types'
import { isLive } from '@/lib/apiSports'

interface ScoreTickerProps {
  games: Game[]
}

export default function ScoreTicker({ games }: ScoreTickerProps) {
  // Exibe jogos com score disponível ou ao vivo
  const tickerGames = games.filter(
    (g) => g.scores.home.total !== null && g.scores.away.total !== null
  )

  if (tickerGames.length === 0) return null

  // Duplicar para loop CSS contínuo sem salto
  const items = [...tickerGames, ...tickerGames]
  const duration = Math.max(20, tickerGames.length * 5)

  return (
    <div
      className="bg-brand-card border-b border-brand-border overflow-hidden h-8"
      aria-hidden="true"
    >
      <div
        className="animate-ticker flex w-max items-center h-full"
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((game, i) => (
          <TickerItem key={`${game.id}-${i}`} game={game} />
        ))}
      </div>
    </div>
  )
}

function TickerItem({ game }: { game: Game }) {
  const live = isLive(game.status.short)
  const homeTotal = game.scores.home.total
  const awayTotal = game.scores.away.total

  return (
    <span className="flex items-center gap-2 px-5 text-xs whitespace-nowrap">
      {live && (
        <span className="w-1.5 h-1.5 rounded-full bg-brand-live animate-pulse flex-shrink-0" />
      )}
      <span className="text-brand-muted">{game.teams.home.name}</span>
      <span className={`font-bold tabular-nums ${live ? 'text-brand-live' : 'text-brand-chalk'}`}>
        {homeTotal}–{awayTotal}
      </span>
      <span className="text-brand-muted">{game.teams.away.name}</span>
      {live && (
        <span className="text-brand-live text-[10px] font-semibold uppercase">
          {game.status.short === 'HT' ? 'INT' : game.status.short}
        </span>
      )}
      <span className="text-brand-border mx-1 select-none">·</span>
    </span>
  )
}
