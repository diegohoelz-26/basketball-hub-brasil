// Server Component — navegação por âncoras, sem JS
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="text-2xl leading-none">🏀</span>
          <span className="font-display text-2xl tracking-wide text-brand-chalk leading-none pt-0.5">
            BASKETBALL <span className="text-brand-orange">HUB</span>
          </span>
        </a>

        {/* Navegação */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a href="#jogos"     className="text-brand-muted hover:text-brand-chalk transition-colors">Jogos</a>
          <a href="#ligas"     className="text-brand-muted hover:text-brand-chalk transition-colors">Ligas</a>
          <a href="#parceiros" className="text-brand-muted hover:text-brand-chalk transition-colors">Parceiros</a>
        </nav>

      </div>
    </header>
  )
}
