'use client'

import { useState } from 'react'
import { proxyLogo } from '@/lib/logo'

interface TeamLogoProps {
  src: string
  name: string
  size?: number
  className?: string
}

/** Exibe o logo do time com fallback de iniciais quando a imagem falha. */
export default function TeamLogo({ src, name, size = 36, className = '' }: TeamLogoProps) {
  const [error, setError] = useState(false)
  const initials = name
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 3)
    .toUpperCase()

  if (error || !src) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full bg-brand-border flex items-center justify-center flex-shrink-0 ${className}`}
      >
        <span
          className="text-brand-muted font-bold leading-none"
          style={{ fontSize: Math.max(8, Math.floor(size * 0.28)) }}
        >
          {initials}
        </span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={proxyLogo(src)}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setError(true)}
      className={`object-contain flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
