// ============================================================
// Tipos do Basketball Hub — alinhados com API-Sports v1
// Estrutura real da resposta: data.response[] de /games
// ============================================================

// ---------- Tipos da API-Sports (resposta bruta) ----------

export interface ApiTeam {
  id: number
  name: string
  logo: string
}

export interface ApiGameStatus {
  long: string    // "Not Started" | "In Play" | "Finished" | "Cancelled" | ...
  short: string   // "NS" | "Q1" | "Q2" | "Q3" | "Q4" | "HT" | "OT" | "BT" | "FT" | "AOT" | "CANC" | ...
  timer: string | null  // minuto atual em jogos ao vivo, ex: "12" ou null
}

export interface ApiLeague {
  id: number
  name: string
  type: string   // "League" | "Cup"
  season: string // "2025-2026"
  logo: string
}

export interface ApiCountry {
  id: number
  name: string
  code: string | null
  flag: string | null
}

export interface ApiScoreSide {
  quarter_1: number | null
  quarter_2: number | null
  quarter_3: number | null
  quarter_4: number | null
  over_time: number | null  // A API retorna "over_time", não "overtime"
  total: number | null
}

export interface ApiScores {
  home: ApiScoreSide
  away: ApiScoreSide
}

/** Jogo exatamente como retornado pela API-Sports */
export interface ApiGame {
  id: number
  date: string      // "2026-06-09T00:00:00+00:00"
  time: string      // "00:00" (hora local do jogo)
  timestamp: number // Unix timestamp
  timezone: string  // "UTC"
  stage: string | null
  week: string | null
  status: ApiGameStatus
  league: ApiLeague
  country: ApiCountry
  teams: {
    home: ApiTeam
    away: ApiTeam
  }
  scores: ApiScores
  periods: {
    first: number | null
    second: number | null
  }
}

/** Envelope da resposta da API-Sports */
export interface ApiResponse<T> {
  get: string
  parameters: Record<string, string>
  errors: unknown[]
  results: number
  response: T[]
}

// ---------- Tipos internos da aplicação ----------

/** Jogo normalizado para uso nos componentes */
export interface Game {
  id: number
  date: string       // "2026-06-09"
  time: string       // "21:30"
  timestamp: number
  status: ApiGameStatus
  stage: string | null  // "NBA Finals", "Conference Finals", null para temporada regular
  league: ApiLeague
  country: ApiCountry
  teams: {
    home: ApiTeam
    away: ApiTeam
  }
  scores: ApiScores
}

/** Status simplificado para exibição */
export type DisplayStatus = 'AO VIVO' | 'FINALIZADO' | 'AGENDADO'

// ---------- Standings ----------

export interface ApiStandingTeam {
  id: number
  name: string
  logo: string
}

export interface ApiStandingGames {
  played: number
  win:  { total: number; percentage: string }
  lose: { total: number; percentage: string }
}

/** Uma linha de classificação, como retornada pela API-Sports */
export interface ApiStanding {
  position: number
  stage: string
  group: { name: string | null; points: number }
  team: ApiStandingTeam
  games: ApiStandingGames
  points: { for: number; against: number }
  form: string | null
  description: string | null
}

/** Grupo de classificação (conferência, chave, etc.) */
export interface StandingGroup {
  name: string | null
  rows: ApiStanding[]
}

/** Jogos agrupados por liga */
export interface GamesByLeague {
  league: ApiLeague
  games: Game[]
}
