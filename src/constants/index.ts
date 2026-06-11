// ============================================================
// Constantes do Basketball Hub
// ============================================================

/** IDs das ligas na API-Sports Basketball */
export const SUPPORTED_LEAGUES = {
  NBA:        12,
  WNBA:       27,
  NBB:        36,
  EUROLEAGUE: 120,
  ACB:        119,
} as const

/**
 * Ligas prioritárias exibidas no filtro (em ordem de exibição)
 * Jogos dessas ligas aparecem primeiro na listagem
 */
export const PRIORITY_LEAGUES: { id: number; label: string }[] = [
  { id: 12,  label: 'NBA' },
  { id: 27,  label: 'WNBA' },
  { id: 36,  label: 'NBB' },
  { id: 120, label: 'EuroLeague' },
  { id: 119, label: 'ACB' },
]

/** Canais de transmissão por liga no Brasil */
export const LEAGUE_CHANNELS: Partial<Record<number, string[]>> = {
  12:  ['NBA League Pass', 'ESPN', 'Disney+'], // NBA
  27:  ['ESPN', 'Disney+'],                    // WNBA
  36:  ['SporTV', 'Basquete Brasil'],           // NBB
  34:  ['SporTV'],                              // LBF
  120: ['Space', 'TNT Sports'],                // EuroLeague
  119: ['ESPN', 'Disney+'],                    // ACB
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
 * IDs confirmados via API-Sports Basketball v1.
 */
export const FEATURED_LEAGUES: LeagueEntry[] = [
  { id: 12,  name: 'NBA',        shortName: 'NBA',        country: 'EUA',     flag: '🇺🇸' },
  { id: 27,  name: 'WNBA',       shortName: 'WNBA',       country: 'EUA',     flag: '🇺🇸' },
  { id: 36,  name: 'NBB',        shortName: 'NBB',        country: 'Brasil',  flag: '🇧🇷' },
  { id: 34,  name: 'LBF',        shortName: 'LBF',        country: 'Brasil',  flag: '🇧🇷' },
  { id: 120, name: 'EuroLeague', shortName: 'EuroLeague', country: 'Europa',  flag: '🇪🇺' },
  { id: 119, name: 'Liga ACB',   shortName: 'ACB',        country: 'Espanha', flag: '🇪🇸' },
]

export interface LeagueRegion {
  region: string
  leagues: LeagueEntry[]
}

/**
 * Ligas agrupadas por região para o painel "Todas as Ligas".
 * IDs marcados com (*) são aproximações — verifique no endpoint
 * GET /leagues da API-Sports se não retornarem jogos.
 */
export const LEAGUES_BY_REGION: LeagueRegion[] = [
  {
    region: 'Américas',
    leagues: [
      { id: 12,  name: 'NBA',             shortName: 'NBA',      country: 'EUA',       flag: '🇺🇸' },
      { id: 27,  name: 'WNBA',            shortName: 'WNBA',     country: 'EUA',       flag: '🇺🇸' },
      { id: 13,  name: 'NBA G-League',    shortName: 'G-League', country: 'EUA',       flag: '🇺🇸' },
      { id: 36,  name: 'NBB',             shortName: 'NBB',      country: 'Brasil',    flag: '🇧🇷' },
      { id: 34,  name: 'LBF',             shortName: 'LBF',      country: 'Brasil',    flag: '🇧🇷' },
      { id: 116, name: 'Liga Nacional',   shortName: 'LNB',      country: 'Argentina', flag: '🇦🇷' },
      { id: 122, name: 'LNBP',            shortName: 'LNBP',     country: 'México',    flag: '🇲🇽' },
    ],
  },
  {
    region: 'Europa',
    leagues: [
      { id: 120, name: 'EuroLeague',              shortName: 'EuroLeague', country: 'Europa',   flag: '🇪🇺' },
      { id: 121, name: 'EuroCup',                 shortName: 'EuroCup',    country: 'Europa',   flag: '🇪🇺' },
      { id: 119, name: 'Liga ACB',                shortName: 'ACB',        country: 'Espanha',  flag: '🇪🇸' },
      { id: 117, name: 'BSL',                     shortName: 'BSL',        country: 'Turquia',  flag: '🇹🇷' },
      { id: 115, name: 'Lega Basket',             shortName: 'Lega',       country: 'Itália',   flag: '🇮🇹' },
      { id: 118, name: 'Basketball Bundesliga',   shortName: 'BBL',        country: 'Alemanha', flag: '🇩🇪' },
      { id: 112, name: 'Betclic Élite',           shortName: 'Pro A',      country: 'França',   flag: '🇫🇷' },
      { id: 113, name: 'VTB United League',       shortName: 'VTB',        country: 'Europa',   flag: '🌍' },
    ],
  },
  {
    region: 'Ásia & Oceania',
    leagues: [
      { id: 154, name: 'NBL',  shortName: 'NBL', country: 'Austrália', flag: '🇦🇺' },
      { id: 155, name: 'KBL',  shortName: 'KBL', country: 'Coreia',    flag: '🇰🇷' },
      { id: 156, name: 'CBA',  shortName: 'CBA', country: 'China',     flag: '🇨🇳' },
      { id: 157, name: 'B.League', shortName: 'B.L', country: 'Japão', flag: '🇯🇵' },
    ],
  },
]
