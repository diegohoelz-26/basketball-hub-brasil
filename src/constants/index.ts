// ============================================================
// Constantes do Basketball Hub
// ============================================================

/** IDs das ligas na API-Sports Basketball */
export const SUPPORTED_LEAGUES = {
  NBA:        12,
  WNBA:       27,
  NBB:        36,
  NCAA:       116,
  EUROLEAGUE: 120,
} as const

/**
 * Códigos de status da API-Sports Basketball
 * Referência: https://api-sports.io/documentation/basketball/v1
 */
export const GAME_STATUS_CODES = {
  NOT_STARTED: 'NS',
  // Ao vivo
  LIVE: ['Q1', 'Q2', 'Q3', 'Q4', 'OT', 'BT', 'HT'] as string[],
  // Encerrado
  FINISHED: ['FT', 'AOT'] as string[],
  // Cancelado / suspenso / adiado (tratar como não disponível)
  INTERRUPTED: ['CANC', 'SUSP', 'PST', 'WO', 'ABD'] as string[],
} as const

/** Intervalo de atualização dos jogos ao vivo (ms) */
export const LIVE_REFRESH_INTERVAL = 30_000  // 30 segundos

/** Cache das requisições à API (segundos) — usado no next.revalidate */
export const API_CACHE_SECONDS = 300  // 5 minutos

/** URL base da API-Sports Basketball */
export const API_BASE_URL = 'https://v1.basketball.api-sports.io'
