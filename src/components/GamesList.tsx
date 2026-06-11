// Server Component — agrupa jogos por liga e renderiza
import type { Game, ApiLeague, GamesByLeague } from '@/types'
import GameCard from './GameCard'

interface GamesListProps {
  games: Game[]
  selectedDate: string
  hasLeagueFilter?: boolean
}

/** Agrupa a lista de jogos por liga, preservando a ordem de aparição */
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

  return Array.from(map.values())
}

/** Formata a data selecionada para exibição amigável */
function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date  = new Date(year, month - 1, day)
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  if (dateStr === todayStr) return 'Hoje'

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const ystStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
  if (dateStr === ystStr) return 'Ontem'

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const tmrStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`
  if (dateStr === tmrStr) return 'Amanhã'

  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export default function GamesList({
  games,
  selectedDate,
  hasLeagueFilter = false,
}: GamesListProps) {
  const grouped = groupByLeague(games)

  return (
    <section className="max-w-4xl mx-auto px-4 py-6">

      {/* Cabeçalho com data e total de jogos */}
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-white font-bold text-lg capitalize">
          {formatDateLabel(selectedDate)}
        </h2>
        {games.length > 0 && (
          <span className="text-brand-muted text-sm">
            {games.length} {games.length === 1 ? 'jogo' : 'jogos'}
          </span>
        )}
      </div>

      {/* Estado vazio */}
      {games.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏀</p>
          <p className="text-white/70 font-medium">
            {hasLeagueFilter
              ? 'Nenhum jogo desta liga na data selecionada'
              : 'Nenhum jogo encontrado'}
          </p>
          <p className="text-brand-muted text-sm mt-1">
            {hasLeagueFilter
              ? 'Tente outra liga ou escolha uma data diferente'
              : 'Tente selecionar outra data'}
          </p>
        </div>
      )}

      {/* Grupos por liga */}
      <div className="flex flex-col gap-8">
        {grouped.map(({ league, games: leagueGames }) => (
          <LeagueGroup key={league.id} league={league} games={leagueGames} />
        ))}
      </div>

    </section>
  )
}

// ---- Sub-componente de grupo de liga ----
interface LeagueGroupProps {
  league: ApiLeague
  games: Game[]
}

function LeagueGroup({ league, games }: LeagueGroupProps) {
  return (
    <div>
      {/* Cabeçalho da liga */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-brand-border">
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
          {league.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={league.logo}
              alt={league.name}
              width={32}
              height={32}
              loading="lazy"
              className="w-8 h-8 object-contain"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{league.name}</p>
          {league.season && (
            <p className="text-brand-muted text-[11px]">{league.season}</p>
          )}
        </div>
        <span className="text-brand-muted text-xs flex-shrink-0">
          {games.length} {games.length === 1 ? 'jogo' : 'jogos'}
        </span>
      </div>

      {/* Cards dos jogos */}
      <div className="flex flex-col gap-2">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
