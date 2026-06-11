// FASE 1 — Estrutura base (sem funcionalidades)
// Conteúdo real será implementado nas próximas fases

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brand-dark border-b border-brand-border">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏀</span>
          <span className="font-bold text-white text-lg tracking-tight">
            Basketball <span className="text-brand-orange">Hub</span>
          </span>
        </div>

        {/* Placeholder: futuras ações (busca, favoritos, etc.) */}
        <div className="w-8 h-8 rounded-full bg-brand-card border border-brand-border" />
      </div>
    </header>
  )
}
