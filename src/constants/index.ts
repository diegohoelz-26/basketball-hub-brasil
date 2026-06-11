// ============================================================
// Constantes do Basketball Hub
// ============================================================

/** IDs das ligas na API-Sports Basketball */
export const SUPPORTED_LEAGUES = {
  NBA:        12,
  WNBA:       27,
  NBB:        36,
  EUROLEAGUE: 120,
  ACB:        119, // Liga ACB (Espanha)
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
