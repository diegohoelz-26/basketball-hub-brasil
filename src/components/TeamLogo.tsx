'use client'

import { useState } from 'react'

interface TeamLogoProps {
  src: string
  name: string
  size?: number
  className?: string
}

// Paleta de cores vibrantes que destacam no fundo escuro
const PALETTE = [
  '#E63946', '#F4A261', '#2A9D8F', '#6A4C93', '#1982C4',
  '#FF595E', '#FFCA3A', '#6A994E', '#F72585', '#3A86FF',
  '#FB5607', '#8338EC', '#06D6A0', '#FF006E', '#FFBE0B',
  '#3D405B', '#E07A5F', '#81B29A', '#F2CC8F', '#118AB2',
]

function teamColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function getInitials(name: string): string {
  const words = name.replace(/\s+(W|Jr\.?|II|III|IV)$/i, '').trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return words
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

function TeamBadge({ name, size }: { name: string; size: number }) {
  const color    = teamColor(name)
  const initials = getInitials(name)
  const textColor = isDark(color) ? '#ffffff' : '#1a1209'
  const radius   = Math.round(size * 0.22)
  const fontSize = Math.max(9, Math.floor(size * 0.32))

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
          color: textColor,
          fontSize,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-geist-sans), sans-serif',
        }}
      >
        {initials}
      </span>
    </div>
  )
}

/** Exibe o logo do time com fallback de badge colorida quando a imagem falha. */
export default function TeamLogo({ src, name, size = 36, className = '' }: TeamLogoProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return <TeamBadge name={name} size={size} />
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
