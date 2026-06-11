// Componente compartilhado (sem 'use client' — funciona no contexto Client de GamesView)
import type { Game } from '@/types'
import { isLive, isFinals, formatGameTime, getDisplayStatus } from '@/lib/apiSports'
import { LEAGUE_CHANNELS } from '@/constants'
import { Tv } from 'lucide-react'
import TeamLogo from './TeamLogo'
import LeagueLogo from './LeagueLogo'

interface FeaturedGameCardProps {
  game: Game
}

export default function FeaturedGameCard({ game }: FeaturedGameCardProps) {
  const live          = isLive(game.status.short)
  const finals        = isFinals(game)
  const displayStatus = getDisplayStatus(game.status.short)
  const finished      = displayStatus === 'FINALIZADO'
  const homeScore     = game.scores.home.total
  const awayScore     = game.scores.away.total
  const hasScore      = homeScore !== null && awayScore !== null
  const gameTime      = formatGameTime(game.timestamp)
  const channels      = LEAGUE_CHANNELS[game.league.id] ?? []

  const label = finals
    ? '🏆 Finais'
    : live
    ? 'Ao Vivo'
    : 'Jogo do Dia'

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
      {/* Label acima do card */}
      <p className={`text-[10px] font-bold tracking-[0.25em] uppercase mb-2 flex items-center gap-1.5 ${
        live ? 'text-brand-live' : 'text-brand-orange'
      }`}>
        <span className={`w-1 h-1 rounded-full inline-block ${live ? 'bg-brand-live animate-pulse' : 'bg-brand-orange'}`} />
        {label}
      </p>

      <article
        className={`bg-brand-card rounded-2xl overflow-hidden border ${
          live
            ? 'border-brand-live/50 shadow-[0_0_40px_rgba(255,59,59,0.15)]'
            : finals
            ? 'border-brand-orange/40 shadow-[0_0_40px_rgba(255,107,26,0.15)]'
            : 'border-brand-border shadow-[0_0_20px_rgba(255,107,26,0.05)]'
        }`}
      >
        {/* ── Cabeçalho da liga ── */}
        <div className="flex items-center justify-between px-5 py-3 bg-brand-dark/60 border-b border-brand-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <LeagueLogo src={game.league.logo} name={game.league.name} size={20} />
            <span className="text-white text-xs font-bold truncate">
              {game.league.name}
            </span>
            {game.stage && (
              <>
                <span className="text-brand-border flex-shrink-0">·</span>
                <span className="text-brand-muted text-xs truncate">{game.stage}</span>
              </>
            )}
          </div>

          {/* Badge de status */}
          {live ? (
            <span className="flex items-center gap-1.5 text-brand-live text-xs font-bold uppercase flex-shrink-0 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-live animate-pulse" />
              {game.status.short === 'HT'
                ? 'Intervalo'
                : `${game.status.short}${game.status.timer ? ` ${game.status.timer}'` : ''}`}
            </span>
          ) : finished ? (
            <span className="text-brand-muted text-xs font-semibold uppercase flex-shrink-0 ml-2">
              Finalizado
            </span>
          ) : null}
        </div>

        {/* ── Times e placar ── */}
        <div className="px-5 py-7">
          <div className="flex items-center justify-between gap-4">

            {/* Time da casa */}
            <TeamColumn
              logo={game.teams.home.logo}
              name={game.teams.home.name}
              score={homeScore}
              winning={hasScore && homeScore! > awayScore!}
              hasScore={hasScore}
            />

            {/* Centro */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0 min-w-[60px]">
              {!hasScore ? (
                <>
                  <span className="text-brand-chalk text-2xl font-bold tabular-nums leading-none">
                    {gameTime}
                  </span>
                  <span className="text-brand-muted text-[10px] uppercase tracking-wider">
                    BRT
                  </span>
                </>
              ) : (
                <span className="text-brand-border text-xl font-light">–</span>
              )}
            </div>

            {/* Time visitante */}
            <TeamColumn
              logo={game.teams.away.logo}
              name={game.teams.away.name}
              score={awayScore}
              winning={hasScore && awayScore! > homeScore!}
              hasScore={hasScore}
            />

          </div>
        </div>

        {/* ── Canais ── */}
        {channels.length > 0 && (
          <div className="px-5 pb-4 flex items-center gap-1.5 border-t border-brand-border pt-3">
            <Tv size={11} className="text-brand-muted flex-shrink-0" />
            <span className="text-[11px] text-brand-muted truncate">
              {channels.join(' · ')}
            </span>
          </div>
        )}
      </article>
    </div>
  )
}

interface TeamColumnProps {
  logo: string
  name: string
  score: number | null
  winning: boolean
  hasScore: boolean
}

function TeamColumn({ logo, name, score, winning, hasScore }: TeamColumnProps) {
  return (
    <div className="flex flex-col items-center gap-2.5 flex-1 min-w-0">
      <TeamLogo src={logo} name={name} size={56} />
      <span
        className="text-sm font-semibold text-center leading-tight line-clamp-2 px-1"
        style={{ color: winning ? '#EDE6D6' : 'rgba(237,230,214,0.7)' }}
      >
        {name}
      </span>
      {hasScore && (
        <span
          className="text-4xl font-bold tabular-nums leading-none"
          style={{ color: winning ? '#EDE6D6' : 'rgba(237,230,214,0.3)' }}
        >
          {score}
        </span>
      )}
    </div>
  )
}
