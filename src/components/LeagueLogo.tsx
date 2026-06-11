'use client'

import { useState } from 'react'

interface LeagueLogoProps {
  src: string
  name: string
  size?: number
  className?: string
}

const LEAGUE_COLORS: Record<string, string> = {
  'NBA':                    '#C9082A',
  'WNBA':                   '#FF6900',
  'NBB':                    '#009B3A',
  'Liga Basquete Feminino': '#009B3A',
  'EuroLeague':             '#0066CC',
  'Liga ACB':               '#E63329',
  'NBA W':                  '#FF6900',
}

function leagueColor(name: string): string {
  return LEAGUE_COLORS[name] ?? '#FF6B1A'
}

function getAbbr(name: string): string {
  if (name === 'Liga Basquete Feminino') return 'LBF'
  if (name === 'Liga ACB') return 'ACB'
  if (name === 'EuroLeague') return 'EL'
  if (name === 'NBA W') return 'WNBA'
  const words = name.split(' ')
  if (words.length === 1) return name.slice(0, 3).toUpperCase()
  return words.map((w) => w[0]).join('').toUpperCase().slice(0, 3)
}

function LeagueBadge({ name, size }: { name: string; size: number }) {
  const color  = leagueColor(name)
  const abbr   = getAbbr(name)
  const radius = Math.round(size * 0.18)
  const fontSize = Math.max(7, Math.floor(size * 0.28))

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: color,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          color: '#fff',
          fontSize,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}
      >
        {abbr}
      </span>
    </div>
  )
}

export default function LeagueLogo({ src, name, size = 32, className = '' }: LeagueLogoProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return <LeagueBadge name={name} size={size} />
  }

  return (
    <div style={{ width: size, height: size, flexShrink: 0 }} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setError(true)}
        className="object-contain w-full h-full"
      />
    </div>
  )
}
