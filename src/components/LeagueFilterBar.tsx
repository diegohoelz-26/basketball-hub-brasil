'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Star, LayoutGrid } from 'lucide-react'
import {
  FEATURED_LEAGUES,
  LEAGUES_BY_REGION,
  getLeagueLogoUrl,
  type LeagueEntry,
} from '@/constants'
import AllLeaguesPanel from './AllLeaguesPanel'

const FAVORITES_KEY = 'bhb:favorites'

interface LeagueFilterBarProps {
  selectedLeague: number | null
  selectedDate: string
}

export default function LeagueFilterBar({
  selectedLeague,
  selectedDate,
}: LeagueFilterBarProps) {
  const router = useRouter()
  const [favorites, setFavorites] = useState<number[]>([])
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) setFavorites(JSON.parse(stored) as number[])
    } catch {
      // sem acesso ao localStorage — funciona sem favoritos
    }
  }, [])

  function toggleFavorite(id: number) {
    const next = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id]
    setFavorites(next)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  }

  function selectLeague(id: number | null) {
    const params = new URLSearchParams()
    params.set('date', selectedDate)
    if (id !== null) params.set('league', String(id))
    router.push(`/?${params.toString()}`)
  }

  // Ligas favoritas que não estão nos FEATURED (vindas do painel "Mais ligas")
  const allKnownLeagues = LEAGUES_BY_REGION.flatMap((r) => r.leagues)
  const extraFavorites = favorites
    .filter((id) => !FEATURED_LEAGUES.some((l) => l.id === id))
    .map((id) => allKnownLeagues.find((l) => l.id === id))
    .filter((l): l is LeagueEntry => l !== undefined)

  const tabs: LeagueEntry[] = [...extraFavorites, ...FEATURED_LEAGUES]

  return (
    <>
      <div className="bg-brand-dark border-b border-brand-border">
        <div
          className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide"
          role="tablist"
          aria-label="Filtro por liga"
        >
          {/* Tab "Todas" */}
          <button
            role="tab"
            aria-selected={selectedLeague === null}
            onClick={() => selectLeague(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLeague === null
                ? 'bg-brand-orange text-brand-dark'
                : 'text-brand-muted hover:text-white hover:bg-brand-card'
            }`}
          >
            Todas
          </button>

          {/* Tabs das ligas */}
          {tabs.map((league) => {
            const isSelected = selectedLeague === league.id
            const isFav = favorites.includes(league.id)

            return (
              <div key={league.id} className="flex-shrink-0 flex items-center">
                {/* Botão principal da liga */}
                <button
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => selectLeague(league.id)}
                  className={`flex items-center gap-1.5 pl-2 pr-1 py-1.5 rounded-l-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-brand-orange text-brand-dark'
                      : 'text-brand-muted hover:text-white hover:bg-brand-card'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getLeagueLogoUrl(league.id)}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                    aria-hidden="true"
                    className="w-4 h-4 object-contain flex-shrink-0"
                  />
                  {league.shortName}
                </button>

                {/* Botão estrela de favorito */}
                <button
                  onClick={() => toggleFavorite(league.id)}
                  className={`pl-0.5 pr-2 py-1.5 rounded-r-full transition-all ${
                    isSelected
                      ? 'bg-brand-orange text-brand-dark'
                      : isFav
                      ? 'text-brand-orange hover:bg-brand-card'
                      : 'text-brand-border hover:text-brand-orange hover:bg-brand-card'
                  }`}
                  aria-label={
                    isFav
                      ? `Remover ${league.shortName} dos favoritos`
                      : `Favoritar ${league.shortName}`
                  }
                >
                  <Star
                    size={9}
                    fill={isFav ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            )
          })}

          {/* Botão "Mais ligas" */}
          <button
            onClick={() => setShowPanel(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-brand-muted hover:text-white hover:bg-brand-card transition-colors whitespace-nowrap border border-brand-border ml-1"
          >
            <LayoutGrid size={11} />
            Mais ligas
          </button>
        </div>
      </div>

      {showPanel && (
        <AllLeaguesPanel
          selectedLeague={selectedLeague}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelectLeague={(id) => {
            selectLeague(id)
            setShowPanel(false)
          }}
          onClose={() => setShowPanel(false)}
        />
      )}
    </>
  )
}
