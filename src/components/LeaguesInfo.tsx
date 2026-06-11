// Server Component — informações das ligas e calendário das competições
import { LEAGUE_CHANNELS, SUPPORTED_LEAGUES, getLeagueLogoUrl } from '@/constants'
import { proxyImg } from '@/lib/apiSports'

interface LeagueInfo {
  id: number
  name: string
  country: string
  flag: string
  season: string
  description: string
}

const LEAGUES_INFO: LeagueInfo[] = [
  {
    id: SUPPORTED_LEAGUES.NBA,
    name: 'NBA',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    season: 'Outubro a Junho',
    description: 'A liga mais competitiva do planeta. 30 franquias, 82 jogos de temporada regular e os playoffs mais assistidos do basquete mundial.',
  },
  {
    id: SUPPORTED_LEAGUES.WNBA,
    name: 'WNBA',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    season: 'Maio a Outubro',
    description: 'A principal liga feminina do mundo, em plena expansão e com audiências recordes a cada temporada.',
  },
  {
    id: SUPPORTED_LEAGUES.NBB,
    name: 'NBB',
    country: 'Brasil',
    flag: '🇧🇷',
    season: 'Outubro a Junho',
    description: 'O Novo Basquete Brasil reúne os principais clubes do país — Flamengo, Franca, Minas e outros gigantes da bola laranja nacional.',
  },
  {
    id: 27,
    name: 'Liga Basquete Feminino',
    country: 'Brasil',
    flag: '🇧🇷',
    season: 'Março a Setembro',
    description: 'A principal liga feminina do Brasil, com clubes como Sesi Araraquara, Avai/Kindermann e Flamengo disputando o título nacional.',
  },
  {
    id: SUPPORTED_LEAGUES.EUROLEAGUE,
    name: 'EuroLeague',
    country: 'Europa',
    flag: '🇪🇺',
    season: 'Outubro a Maio',
    description: 'O topo do basquete europeu. Real Madrid, Panathinaikos, Fenerbahçe e os maiores clubes do continente na disputa pelo título.',
  },
  {
    id: SUPPORTED_LEAGUES.ACB,
    name: 'Liga ACB',
    country: 'Espanha',
    flag: '🇪🇸',
    season: 'Setembro a Junho',
    description: 'A liga nacional mais forte da Europa, casa histórica de Real Madrid e Barcelona — e celeiro de craques para a NBA.',
  },
]

export default function LeaguesInfo() {
  return (
    <section id="ligas" className="border-t border-brand-border bg-brand-dark scroll-mt-14">
      <div className="max-w-5xl mx-auto px-4 py-14">

        {/* Cabeçalho da seção */}
        <p className="text-brand-orange text-xs font-semibold tracking-[0.25em] uppercase mb-2">
          Calendário das competições
        </p>
        <h2 className="font-display text-brand-chalk text-4xl sm:text-5xl tracking-wide mb-8">
          AS LIGAS
        </h2>

        {/* Cards das ligas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEAGUES_INFO.map((league) => {
            const channels = LEAGUE_CHANNELS[league.id] ?? []
            return (
              <a
                key={league.id}
                href={`/?league=${league.id}#jogos`}
                className="group bg-brand-card border border-brand-border rounded-2xl p-5 hover:border-brand-orange/60 transition-colors flex flex-col"
              >
                {/* Logo + nome + país */}
                <div className="flex items-center gap-3 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proxyImg(getLeagueLogoUrl(league.id))}
                    alt={league.name}
                    width={40}
                    height={40}
                    className="object-contain w-10 h-10 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl text-brand-chalk tracking-wide leading-tight group-hover:text-brand-orange transition-colors truncate">
                      {league.name}
                    </h3>
                    <span className="text-brand-muted text-xs">{league.country} {league.flag}</span>
                  </div>
                </div>

                {/* Temporada */}
                <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">
                  {league.season}
                </p>

                {/* Descrição */}
                <p className="text-brand-muted text-sm leading-relaxed flex-1">
                  {league.description}
                </p>

                {/* Onde assistir */}
                {channels.length > 0 && (
                  <p className="mt-4 pt-3 border-t border-brand-border text-[11px] text-brand-muted">
                    📺 {channels.join(' · ')}
                  </p>
                )}
              </a>
            )
          })}
        </div>

      </div>
    </section>
  )
}
