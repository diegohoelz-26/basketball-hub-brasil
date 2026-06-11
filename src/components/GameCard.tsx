// Server Component
import type { Game } from '@/types'
import { getDisplayStatus, isLive, formatGameTime } from '@/lib/apiSports'
import { LEAGUE_CHANNELS } from '@/constants'
import { Tv } from 'lucide-react'
import TeamLogo from './TeamLogo'

interface GameCardProps {
  game: Game
  highlight?: boolean
}

export default function GameCard({ game, highlight = false }: GameCardProps) {
  const displayStatus = getDisplayStatus(game.status.short)
  const live          = isLive(game.status.short)
  const homeScore     = game.scores.home.total
  const awayScore     = game.scores.away.total
  const hasScore      = homeScore !== null && awayScore !== null
  const gameTime      = formatGameTime(game.timestamp)
  const homeWinning   = hasScore && homeScore > awayScore
  const awayWinning   = hasScore && awayScore > homeScore
  const channels      = LEAGUE_CHANNELS[game.league.id] ?? []

  return (
    <article
      className={`bg-brand-card border rounded-xl px-4 py-3 transition-colors duration-150 ${
        highlight
          ? 'border-brand-live/50 shadow-[0_0_24px_rgba(255,59,59,0.10)] hover:border-brand-live/80'
          : 'border-brand-border hover:border-brand-orange/40'
      }`}
    >
      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        {live ? (
          <span className="flex items-center gap-1.5 text-brand-live text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-live animate-pulse" />
            {game.status.short === 'HT'
              ? 'Intervalo'
              : `${game.status.short}${game.status.timer ? ` ${game.status.timer}'` : ''}`}
          </span>
        ) : (
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              displayStatus === 'FINALIZADO' ? 'text-brand-muted' : 'text-white/60'
            }`}
          >
            {displayStatus === 'AGENDADO' ? gameTime : displayStatus}
          </span>
        )}
        {(live || displayStatus === 'FINALIZADO') && (
          <span className="text-brand-muted text-xs">{gameTime}</span>
        )}
      </div>

      {/* Times */}
      <div className="flex flex-col gap-2.5">
        <TeamRow
          name={game.teams.home.name}
          logo={game.teams.home.logo}
          score={homeScore}
          winning={homeWinning}
          hasScore={hasScore}
        />
        <TeamRow
          name={game.teams.away.name}
          logo={game.teams.away.logo}
          score={awayScore}
          winning={awayWinning}
          hasScore={hasScore}
        />
      </div>

      {/* Canais de transmissão */}
      {channels.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-brand-border flex items-center gap-1.5">
          <Tv size={10} className="text-brand-muted flex-shrink-0" />
          <span className="text-[10px] text-brand-muted truncate">
            {channels.join(' · ')}
          </span>
        </div>
      )}
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
      <TeamLogo src={logo} name={name} size={36} />
      <span
        className={`flex-1 text-sm truncate ${
          winning ? 'text-white font-semibold' : 'text-white/80'
        }`}
      >
        {name}
      </span>
      {hasScore && (
        <span
          className={`text-lg font-bold tabular-nums w-9 text-right ${
            winning ? 'text-white' : 'text-white/50'
          }`}
        >
          {score}
        </span>
      )}
    </div>
  )
}
