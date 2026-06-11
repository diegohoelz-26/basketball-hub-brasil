'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Basketball Hub] Erro na página:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-5">🏀</p>
        <h2 className="font-display text-brand-chalk text-3xl sm:text-4xl tracking-wide mb-3">
          ERRO NA QUADRA
        </h2>
        <p className="text-brand-muted text-sm leading-relaxed mb-6">
          Não conseguimos buscar os jogos agora. Pode ser instabilidade na API ou
          na sua conexão.
        </p>
        <button
          onClick={reset}
          className="bg-brand-orange text-brand-dark font-bold text-sm px-6 py-3 rounded-full hover:brightness-110 transition-all"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  )
}
