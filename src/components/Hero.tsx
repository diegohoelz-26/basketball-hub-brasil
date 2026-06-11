// Server Component — hero estático com linhas de quadra em SVG
export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-border">

      {/* Linhas de quadra: arco de 3 pontos + garrafão, em giz sutil */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        stroke="#EDE6D6"
        strokeWidth="2"
      >
        {/* Arco de 3 pontos */}
        <path d="M 100 400 A 300 300 0 0 1 700 400" />
        {/* Garrafão */}
        <rect x="300" y="240" width="200" height="160" />
        {/* Círculo do lance livre */}
        <circle cx="400" cy="240" r="60" />
        {/* Aro */}
        <circle cx="400" cy="380" r="12" stroke="#FF6B1A" strokeWidth="3" />
      </svg>

      <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-12 sm:pt-20 sm:pb-16">

        {/* Eyebrow: as ligas */}
        <p className="text-brand-orange text-xs font-semibold tracking-[0.25em] uppercase mb-4">
          NBA · WNBA · NBB · EuroLeague · ACB
        </p>

        {/* Título estilo placar de ginásio */}
        <h1 className="font-display text-brand-chalk leading-[0.9] text-5xl sm:text-7xl md:text-8xl tracking-wide">
          TODOS OS JOGOS.
          <br />
          <span className="text-brand-orange">UM SÓ LUGAR.</span>
        </h1>

        <p className="mt-5 max-w-xl text-brand-muted text-base sm:text-lg leading-relaxed">
          Placares ao vivo, calendário completo e onde assistir —
          das arenas da NBA aos ginásios do NBB.
        </p>

        {/* CTA por âncora — zero JavaScript */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#jogos"
            className="inline-flex items-center gap-2 bg-brand-orange text-brand-dark font-bold text-sm px-6 py-3 rounded-full hover:brightness-110 transition-all"
          >
            Ver jogos de hoje
          </a>
          <a
            href="#ligas"
            className="inline-flex items-center gap-2 border border-brand-border text-brand-chalk font-semibold text-sm px-6 py-3 rounded-full hover:border-brand-orange/50 transition-colors"
          >
            Conhecer as ligas
          </a>
        </div>

      </div>
    </section>
  )
}
