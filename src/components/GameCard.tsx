// Server Component
import type { Game } from '@/types'
import { getDisplayStatus, isLive, formatGameTime } from '@/lib/apiSports'

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  const displayStatus = getDisplayStatus(game.status.short)
  const live          = isLive(game.status.short)
  const homeScore     = game.scores.home.total
  const awayScore     = game.scores.away.total
  const hasScore      = homeScore !== null && awayScore !== null
  const gameTime      = formatGameTime(game.timestamp)
  const homeWinning   = hasScore && homeScore > awayScore
  const awayWinning   = hasScore && awayScore > homeScore

  return (
    <article className="bg-brand-card border border-brand-border rounded-xl px-4 py-3 hover:border-brand-orange/40 transition-colors duration-150">

      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        {live ? (
          <span className="flex items-center gap-1.5 text-brand-live text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-live animate-pulse" />
            {game.status.short === 'HT' ? 'Intervalo' : `${game.status.short}${game.status.timer ? ` ${game.status.timer}'` : ''}`}
          </span>
        ) : (
          <span className={`text-xs font-semibold uppercase tracking-wider ${displayStatus === 'FINALIZADO' ? 'text-brand-muted' : 'text-white/60'}`}>
            {displayStatus === 'AGENDADO' ? gameTime : displayStatus}
          </span>
        )}
        {(live || displayStatus === 'FINALIZADO') && (
          <span className="text-brand-muted text-xs">{gameTime}</span>
        )}
      </div>

      {/* Times */}
      <div className="flex flex-col gap-2">
        <TeamRow name={game.teams.home.name} logo={game.teams.home.logo} score={homeScore} winning={homeWinning} hasScore={hasScore} />
        <TeamRow name={game.teams.away.name} logo={game.teams.away.logo} score={awayScore} winning={awayWinning} hasScore={hasScore} />
      </div>
    </article>
  )
}

interface TeamRowProps {
  name: string
  logo: string
  score: number | null
  winning: boolean
  hasScore: boolean
}

function TeamRow({ name, logo, score, winning, hasScore }: TeamRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
        {logo
          ? <img src={logo} alt={name} width={28} height={28} className="object-contain w-7 h-7" />
          : <div className="w-7 h-7 rounded-full bg-brand-border" />
        }
      </div>
      <span className={`flex-1 text-sm truncate ${winning ? 'text-white font-semibold' : 'text-white/80'}`}>
        {name}
      </span>
      {hasScore && (
        <span className={`text-base font-bold tabular-nums w-8 text-right ${winning ? 'text-white' : 'text-white/50'}`}>
          {score}
        </span>
      )}
    </div>
  )
}
