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

        {/* Slogan */}
        <p className="hidden sm:block text-brand-muted text-xs tracking-widest uppercase">
          Basquete em tempo real
        </p>

      </div>
    </header>
  )
}
