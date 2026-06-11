// Server Component — espaço de monetização (parceiros, nunca bets)
export default function AdBanner() {
  return (
    <section id="parceiros" className="border-t border-brand-border scroll-mt-14">
      <div className="max-w-5xl mx-auto px-4 py-14">

        <div className="relative overflow-hidden rounded-2xl border border-dashed border-brand-border bg-brand-card p-8 sm:p-12 text-center">

          <p className="text-brand-orange text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            Espaço para parceiros
          </p>

          <h2 className="font-display text-brand-chalk text-3xl sm:text-4xl tracking-wide mb-3">
            SUA MARCA NO JOGO
          </h2>

          <p className="text-brand-muted text-sm max-w-md mx-auto leading-relaxed">
            Conecte sua marca à comunidade do basquete brasileiro.
            Espaços para lojas de material esportivo, marcas de tênis,
            suplementos e streaming.
          </p>

          <a
            href="mailto:parcerias@basketballhub.com.br"
            className="inline-flex items-center gap-2 mt-6 bg-brand-orange text-brand-dark font-bold text-sm px-6 py-3 rounded-full hover:brightness-110 transition-all"
          >
            Anuncie aqui
          </a>

          {/* Política editorial clara */}
          <p className="mt-6 text-[11px] text-brand-muted/70">
            Não aceitamos publicidade de casas de apostas.
          </p>

        </div>

      </div>
    </section>
  )
}
