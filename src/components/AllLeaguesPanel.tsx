'use client'

import { X, Star } from 'lucide-react'
import {
  LEAGUES_BY_REGION,
  FEATURED_LEAGUES,
  getLeagueLogoUrl,
  type LeagueEntry,
} from '@/constants'
import { proxyLogo } from '@/lib/logo'

interface AllLeaguesPanelProps {
  selectedLeague: number | null
  favorites: number[]
  onToggleFavorite: (id: number) => void
  onSelectLeague: (id: number | null) => void
  onClose: () => void
}

export default function AllLeaguesPanel({
  selectedLeague,
  favorites,
  onToggleFavorite,
  onSelectLeague,
  onClose,
}: AllLeaguesPanelProps) {
  const allLeagues = LEAGUES_BY_REGION.flatMap((r) => r.leagues)

  const favoriteLeagues = favorites
    .map(
      (id) =>
        allLeagues.find((l) => l.id === id) ??
        FEATURED_LEAGUES.find((l) => l.id === id)
    )
    .filter((l): l is LeagueEntry => l !== undefined)

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-brand-dark">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-brand-border flex-shrink-0">
        <h2 className="font-display text-brand-chalk text-xl tracking-wide">
          TODAS AS LIGAS
        </h2>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-brand-muted hover:text-white hover:bg-brand-card transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-10 space-y-7">

          {/* Meus favoritos */}
          {favoriteLeagues.length > 0 && (
            <section>
              <SectionTitle>⭐ Meus Favoritos</SectionTitle>
              <div className="space-y-1">
                {favoriteLeagues.map((league) => (
                  <LeagueRow
                    key={league.id}
                    league={league}
                    isSelected={selectedLeague === league.id}
                    isFavorite
                    onSelect={() => onSelectLeague(league.id)}
                    onToggleFavorite={() => onToggleFavorite(league.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Por região */}
          {LEAGUES_BY_REGION.map((region) => (
            <section key={region.region}>
              <SectionTitle>{region.region}</SectionTitle>
              <div className="space-y-1">
                {region.leagues.map((league) => (
                  <LeagueRow
                    key={league.id}
                    league={league}
                    isSelected={selectedLeague === league.id}
                    isFavorite={favorites.includes(league.id)}
                    onSelect={() => onSelectLeague(league.id)}
                    onToggleFavorite={() => onToggleFavorite(league.id)}
                  />
                ))}
              </div>
            </section>
          ))}

        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-brand-muted text-[10px] font-semibold tracking-[0.2em] uppercase mb-2 px-1">
      {children}
    </p>
  )
}

interface LeagueRowProps {
  league: LeagueEntry
  isSelected: boolean
  isFavorite: boolean
  onSelect: () => void
  onToggleFavorite: () => void
}

function LeagueRow({
  league,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: LeagueRowProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
        isSelected
          ? 'bg-brand-orange/10 border border-brand-orange/30'
          : 'border border-transparent hover:bg-brand-card'
      }`}
    >
      {/* Logo */}
      <button
        onClick={onSelect}
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center"
        aria-label={`Selecionar ${league.name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proxyLogo(getLeagueLogoUrl(league.id))}
          alt={league.name}
          width={32}
          height={32}
          loading="lazy"
          className="w-8 h-8 object-contain"
        />
      </button>

      {/* Nome + país */}
      <button onClick={onSelect} className="flex-1 text-left min-w-0">
        <p
          className={`text-sm font-semibold truncate ${
            isSelected ? 'text-brand-orange' : 'text-white'
          }`}
        >
          {league.name}
        </p>
        <p className="text-[11px] text-brand-muted">
          {league.flag} {league.country}
        </p>
      </button>

      {/* Botão favorito */}
      <button
        onClick={onToggleFavorite}
        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors flex-shrink-0 ${
          isFavorite
            ? 'text-brand-orange hover:bg-brand-card'
            : 'text-brand-border hover:text-brand-orange hover:bg-brand-card'
        }`}
        aria-label={
          isFavorite
            ? `Remover ${league.name} dos favoritos`
            : `Adicionar ${league.name} aos favoritos`
        }
      >
        <Star size={15} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}
