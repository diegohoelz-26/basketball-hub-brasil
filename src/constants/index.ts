// ============================================================
// Constantes do Basketball Hub
// ============================================================

/** IDs das ligas na API-Sports Basketball (verificados via GET /leagues) */
export const SUPPORTED_LEAGUES = {
  NBA:        12,
  WNBA:       13,  // "NBA W" na API-Sports
  NBB:        26,  // "NBB" na API-Sports
  EUROLEAGUE: 120,
  ACB:        117, // "ACB" na API-Sports
} as const

/**
 * Ligas prioritárias exibidas no filtro (em ordem de exibição)
 * Jogos dessas ligas aparecem primeiro na listagem
 */
export const PRIORITY_LEAGUES: { id: number; label: string }[] = [
  { id: 12,  label: 'NBA' },
  { id: 13,  label: 'WNBA' },
  { id: 26,  label: 'NBB' },
  { id: 27,  label: 'LBF' },
  { id: 120, label: 'EuroLeague' },
  { id: 117, label: 'ACB' },
]

/** Canais de transmissão por liga no Brasil */
export const LEAGUE_CHANNELS: Partial<Record<number, string[]>> = {
  12:  ['NBA League Pass', 'ESPN', 'Disney+'], // NBA
  13:  ['ESPN', 'Disney+'],                    // WNBA (NBA W)
  26:  ['SporTV', 'Basquete Brasil'],           // NBB
  27:  ['SporTV'],                              // LBF W
  120: ['Space', 'TNT Sports'],                // EuroLeague
  117: ['ESPN', 'Disney+'],                    // ACB
}

/**
 * Códigos de status da API-Sports Basketball
 */
export const GAME_STATUS_CODES = {
  NOT_STARTED:  'NS',
  LIVE:         ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT', 'HT'] as string[],
  FINISHED:     ['FT', 'AOT'] as string[],
  INTERRUPTED:  ['CANC', 'SUSP', 'PST', 'WO', 'ABD'] as string[],
} as const

/** Intervalo de atualização dos jogos ao vivo (ms) */
export const LIVE_REFRESH_INTERVAL = 30_000

/** Cache das requisições à API (segundos) */
export const API_CACHE_SECONDS = 300

/** URL base da API-Sports Basketball */
export const API_BASE_URL = 'https://v1.basketball.api-sports.io'

/** Nomes de exibição para ligas cujo nome na API difere do nome popular */
export const LEAGUE_NAME_OVERRIDES: Partial<Record<number, string>> = {
  13: 'WNBA', // API retorna "NBA W"
}

/** Temporada atual de cada liga (formato exigido pela API-Sports) */
export const LEAGUE_CURRENT_SEASON: Partial<Record<number, string>> = {
  12:  '2025-2026', // NBA
  13:  '2026',      // WNBA (NBA W)
  26:  '2025-2026', // NBB
  27:  '2026',      // LBF W
  120: '2025',      // EuroLeague
  117: '2025-2026', // ACB
}

// ============================================================
// Ligas — tipos e dados para o browser de ligas
// ============================================================

export interface LeagueEntry {
  id: number
  name: string
  shortName: string
  country: string
  flag: string
}

/** Retorna a URL do logo de uma liga hospedada na API-Sports */
export function getLeagueLogoUrl(leagueId: number): string {
  return `https://media.api-sports.io/basketball/leagues/${leagueId}.png`
}

/**
 * Ligas em destaque — aparecem na barra de filtro rápido.
 * IDs verificados via GET /leagues da API-Sports Basketball v1.
 */
export const FEATURED_LEAGUES: LeagueEntry[] = [
  { id: 12,  name: 'NBA',                    shortName: 'NBA',        country: 'EUA',     flag: '🇺🇸' },
  { id: 13,  name: 'WNBA',                   shortName: 'WNBA',       country: 'EUA',     flag: '🇺🇸' },
  { id: 26,  name: 'NBB',                    shortName: 'NBB',        country: 'Brasil',  flag: '🇧🇷' },
  { id: 27,  name: 'Liga Basquete Feminino', shortName: 'LBF',        country: 'Brasil',  flag: '🇧🇷' },
  { id: 120, name: 'EuroLeague',             shortName: 'EuroLeague', country: 'Europa',  flag: '🇪🇺' },
  { id: 117, name: 'Liga ACB',               shortName: 'ACB',        country: 'Espanha', flag: '🇪🇸' },
]


export interface LeagueRegion {
  region: string
  leagues: LeagueEntry[]
}

/**
 * Ligas agrupadas por região para o painel "Todas as Ligas".
 * IDs verificados via GET /leagues da API-Sports Basketball v1.
 */
export const LEAGUES_BY_REGION: LeagueRegion[] = [
  {
    region: 'Américas',
    leagues: [
      { id: 12,  name: 'NBA',                    shortName: 'NBA',      country: 'EUA',       flag: '🇺🇸' },
      { id: 13,  name: 'WNBA',                   shortName: 'WNBA',     country: 'EUA',       flag: '🇺🇸' },
      { id: 26,  name: 'NBB',                    shortName: 'NBB',      country: 'Brasil',    flag: '🇧🇷' },
      { id: 27,  name: 'Liga Basquete Feminino', shortName: 'LBF',      country: 'Brasil',    flag: '🇧🇷' },
      { id: 116, name: 'Liga Nacional',          shortName: 'LNB',      country: 'Argentina', flag: '🇦🇷' },
      { id: 122, name: 'LNBP',                   shortName: 'LNBP',     country: 'México',    flag: '🇲🇽' },
    ],
  },
  {
    region: 'Europa',
    leagues: [
      { id: 120, name: 'EuroLeague',           shortName: 'EuroLeague', country: 'Europa',   flag: '🇪🇺' },
      { id: 121, name: 'EuroCup',              shortName: 'EuroCup',    country: 'Europa',   flag: '🇪🇺' },
      { id: 117, name: 'Liga ACB',             shortName: 'ACB',        country: 'Espanha',  flag: '🇪🇸' },
      { id: 115, name: 'Lega Basket',          shortName: 'Lega',       country: 'Itália',   flag: '🇮🇹' },
      { id: 118, name: 'Basketball Bundesliga',shortName: 'BBL',        country: 'Alemanha', flag: '🇩🇪' },
      { id: 112, name: 'Betclic Élite',        shortName: 'Pro A',      country: 'França',   flag: '🇫🇷' },
      { id: 113, name: 'VTB United League',    shortName: 'VTB',        country: 'Europa',   flag: '🌍' },
    ],
  },
  {
    region: 'Ásia & Oceania',
    leagues: [
      { id: 154, name: 'NBL',      shortName: 'NBL', country: 'Austrália', flag: '🇦🇺' },
      { id: 155, name: 'KBL',      shortName: 'KBL', country: 'Coreia',    flag: '🇰🇷' },
      { id: 156, name: 'CBA',      shortName: 'CBA', country: 'China',     flag: '🇨🇳' },
      { id: 157, name: 'B.League', shortName: 'B.L', country: 'Japão',     flag: '🇯🇵' },
    ],
  },
]
