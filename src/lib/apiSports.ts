// ============================================================
// FASE 2 — Integração com API-Sports Basketball
// Docs: https://api-sports.io/documentation/basketball/v1
// ============================================================

import type { ApiGame, ApiResponse, Game, DisplayStatus } from '@/types'
import { API_BASE_URL, API_CACHE_SECONDS, GAME_STATUS_CODES, FEATURED_LEAGUES, LEAGUE_NAME_OVERRIDES } from '@/constants'

// ------------------------------------------------------------
// Helpers internos
// ------------------------------------------------------------

/**
 * Retorna os headers obrigatórios para a API-Sports.
 * Lança erro imediatamente se a chave não estiver configurada.
 */
function getHeaders(): HeadersInit {
  const key = process.env.API_SPORTS_KEY

  if (!key) {
    throw new Error(
      '[Basketball Hub] Variável de ambiente API_SPORTS_KEY não definida. ' +
      'Crie o arquivo .env.local com API_SPORTS_KEY=sua_chave'
    )
  }

  return {
    'x-apisports-key': key,
    'Content-Type': 'application/json',
  }
}

/**
 * Normaliza um ApiGame para o tipo Game (apenas os campos usados pela app).
 * Garante que nenhum campo obrigatório chegue como undefined.
 */

function normalizeGame(raw: ApiGame): Game {
  const leagueName = LEAGUE_NAME_OVERRIDES[raw.league.id] ?? raw.league.name
  return {
    id:        raw.id,
    date:      raw.date.split('T')[0],
    time:      raw.time ?? '--:--',
    timestamp: raw.timestamp,
    status:    {
      long:  raw.status?.long  ?? 'Unknown',
      short: raw.status?.short ?? 'NS',
      timer: raw.status?.timer ?? null,
    },
    stage:   raw.stage ?? null,
    league:  { ...raw.league, name: leagueName },
    country: raw.country,
    teams: {
      home: raw.teams.home,
      away: raw.teams.away,
    },
    scores: raw.scores,
  }
}

// ------------------------------------------------------------
// Funções públicas
// ------------------------------------------------------------

/**
 * Busca jogos de basquete por data.
 *
 * @param date  Data no formato YYYY-MM-DD (ex: "2026-06-09")
 * @returns     Lista de jogos normalizados, ordenados por horário.
 *              Retorna [] em caso de erro (nunca lança para o componente).
 */
export async function getGamesByDate(date: string): Promise<Game[]> {
  // Valida o formato da data para evitar requisições inválidas
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`[apiSports] Data inválida: "${date}". Use o formato YYYY-MM-DD.`)
    return []
  }

  const url = `${API_BASE_URL}/games?date=${date}&timezone=America/Sao_Paulo`

  try {
    // Jogos de hoje revalidam a cada 60s para que o polling ao vivo tenha efeito.
    // Datas passadas/futuras usam o cache padrão de 5 minutos.
    const revalidate = date === getTodayDate() ? 60 : API_CACHE_SECONDS

    const response = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate },
    })

    if (!response.ok) {
      console.error(
        `[apiSports] Erro HTTP ${response.status} ao buscar jogos para ${date}`
      )
      return []
    }

    const data: ApiResponse<ApiGame> = await response.json()

    // A API retorna { errors: { rateLimit: "..." } } quando o limite é atingido
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      console.error('[apiSports] Erros na resposta da API:', data.errors)
      return []
    }

    if (!Array.isArray(data.response)) {
      console.error('[apiSports] Formato inesperado na resposta da API.')
      return []
    }

    // Normaliza e ordena por timestamp (mais cedo primeiro)
    const games = data.response
      .map(normalizeGame)
      .sort((a, b) => a.timestamp - b.timestamp)

    return games

  } catch (error) {
    // Erro de rede, JSON malformado, etc.
    console.error('[apiSports] Falha na requisição:', error)
    return []
  }
}

// ------------------------------------------------------------
// Utilitários exportados (usados pelos componentes)
// ------------------------------------------------------------

/**
 * Converte o status curto da API para o label em português.
 *
 * @example
 *   getDisplayStatus('NS')  → 'AGENDADO'
 *   getDisplayStatus('Q2')  → 'AO VIVO'
 *   getDisplayStatus('FT')  → 'FINALIZADO'
 */
export function getDisplayStatus(shortStatus: string): DisplayStatus {
  if (GAME_STATUS_CODES.LIVE.includes(shortStatus))     return 'AO VIVO'
  if (GAME_STATUS_CODES.FINISHED.includes(shortStatus)) return 'FINALIZADO'
  return 'AGENDADO'
}

/**
 * Retorna true se o jogo está ao vivo agora.
 */
export function isLive(shortStatus: string): boolean {
  return GAME_STATUS_CODES.LIVE.includes(shortStatus)
}

/**
 * Formata a hora do jogo para exibição no fuso horário de Brasília (BRT).
 *
 * A API retorna o timestamp em UTC — convertemos para BRT (UTC-3).
 *
 * @param timestamp  Unix timestamp do jogo
 * @returns          Ex: "21:30" ou "--:--" em caso de erro
 */
export function formatGameTime(timestamp: number): string {
  if (!timestamp) return '--:--'

  try {
    return new Intl.DateTimeFormat('pt-BR', {
      hour:     '2-digit',
      minute:   '2-digit',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(timestamp * 1000))
  } catch {
    return '--:--'
  }
}

const FINALS_KEYWORDS = ['final', 'playoff', 'championship', 'semi-final', 'semifinal']

/** Retorna true se o jogo é de fase eliminatória (finais, playoffs). */
export function isFinals(game: Game): boolean {
  if (!game.stage) return false
  const s = game.stage.toLowerCase()
  return FINALS_KEYWORDS.some((kw) => s.includes(kw))
}

/**
 * Retorna o jogo em destaque do dia.
 *
 * Sempre aparece quando NBA, WNBA ou NBB têm jogos — independente da fase.
 * Finais/playoffs de qualquer liga têm prioridade máxima.
 *
 * Prioridade:
 *  1. Finais/playoffs de qualquer liga em destaque (NBA, WNBA, NBB, EuroLeague, ACB)
 *  2. Jogo ao vivo de NBA, WNBA ou NBB
 *  3. Primeiro jogo agendado de NBA, WNBA ou NBB
 *
 * Retorna null somente quando não há jogos de NBA, WNBA ou NBB no dia.
 */
export function getFeaturedGame(games: Game[]): Game | null {
  const ALL_FEATURED  = FEATURED_LEAGUES.map((l) => l.id)
  const TOP_LEAGUES   = [12, 13, 26] // NBA, WNBA (NBA W), NBB — aparecem todo dia

  // 1. Finais/playoffs de qualquer liga em destaque (mais importante do dia)
  for (const leagueId of ALL_FEATURED) {
    const game = games
      .filter((g) => g.league.id === leagueId)
      .find((g) => isFinals(g))
    if (game) return game
  }

  // 2. Jogo ao vivo das ligas principais
  for (const leagueId of TOP_LEAGUES) {
    const game = games.find(
      (g) => g.league.id === leagueId && isLive(g.status.short)
    )
    if (game) return game
  }

  // 3. Primeiro jogo do dia das ligas principais (temporada regular)
  for (const leagueId of TOP_LEAGUES) {
    const game = games.find((g) => g.league.id === leagueId)
    if (game) return game
  }

  return null
}

/**
 * Retorna a data de hoje no fuso de Brasília (BRT) no formato YYYY-MM-DD.
 * Usa BRT porque a query para a API também usa timezone=America/Sao_Paulo.
 */
export function getTodayDate(): string {
  return new Date().toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).split('/').reverse().join('-') // "09/06/2026" → "2026-06-09"
}
