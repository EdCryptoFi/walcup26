export type Confederation = 'UEFA' | 'CONMEBOL' | 'AFC' | 'CAF' | 'CONCACAF' | 'OFC';
export type Group = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
export type Stage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'final';
export type MatchStatus = 'scheduled' | 'live' | 'finished';
export type MatchDay = 1 | 2 | 3;

export interface Team {
  id: string;          // e.g. "BRA"
  name: string;        // e.g. "Brazil"
  code: string;        // 3-letter FIFA code
  flag: string;        // emoji
  confederation: Confederation;
  group: Group;
  fifaRank?: number;
}

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;        // ISO 8601
  venue: string;
  city: string;
  stage: Stage;
  group?: Group;
  matchday?: MatchDay;
  result?: MatchResult;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  predictedWinner: string | 'draw'; // team id or 'draw'
  predictedHomeScore?: number;
  predictedAwayScore?: number;
  confidence: 1 | 2 | 3 | 4 | 5;
  opinion?: string;    // free-text reasoning stored in MemWal
  timestamp: string;
  sessionId: string;
  pointsEarned?: number;
  memwalBlobId?: string; // Walrus blob id for this memory
}

export interface TournamentPrediction {
  userId: string;
  champion?: string;         // team id
  runnerUp?: string;
  thirdPlace?: string;
  topScorer?: string;        // player name
  timestamp: string;
  memwalBlobId?: string;
}

export interface UserStats {
  totalPredictions: number;
  correctWinners: number;
  exactScores: number;
  points: number;
  winnerAccuracy: number;    // 0–1
  streak: number;            // current correct streak
  bestStreak: number;
}

export interface User {
  id: string;
  username: string;
  avatar: string;            // emoji
  favoriteTeam?: string;     // team id
  favoriteTeamName?: string;
  joinedAt: string;
  stats: UserStats;
  predictions: Prediction[];
  tournamentPrediction?: TournamentPrediction;
  detectedBiases?: string[]; // e.g. ["underdog bias", "home nation homer"]
  isReal: boolean;           // false = seeded/simulated
  memwalNamespace: string;   // e.g. "wc2026-fabio99"
}

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  favoriteTeam?: string;
  favoriteTeamName?: string;
  points: number;
  correctWinners: number;
  exactScores: number;
  totalPredictions: number;
  accuracy: number;
  isReal: boolean;
  streak: number;
}

export interface RecallResult {
  blobId: string;
  text: string;
  distance: number;
}

export interface MemWalQueryResponse {
  userId: string;
  username: string;
  query: string;
  results: RecallResult[];
  total: number;
}
