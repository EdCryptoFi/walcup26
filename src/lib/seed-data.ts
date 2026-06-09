import { User, Prediction, UserStats } from '@/types';
import { MATCHES, DEMO_RESULTS } from './world-cup-data';
import { scorePrediction } from './scoring';

// ── Profiles ──────────────────────────────────────────────────────────────────
// Each profile has: favoriteTeam, bias type, accuracy tier
const PROFILES = [
  { id: 'fabio99',    username: 'fabio99',     avatar: '⚽', fav: 'BRA', tier: 'god',   bias: 'BRA homer' },
  { id: 'messi_fan', username: 'messi_fan',    avatar: '🐐', fav: 'ARG', tier: 'god',   bias: 'ARG homer' },
  { id: 'tiki_taka', username: 'tiki_taka',    avatar: '🇪🇸', fav: 'ESP', tier: 'high',  bias: null },
  { id: 'socceriq',  username: 'SoccerIQ',     avatar: '🧠', fav: 'NED', tier: 'high',  bias: null },
  { id: 'worldie',   username: 'worldie',      avatar: '🌍', fav: 'FRA', tier: 'high',  bias: 'FRA homer' },
  { id: 'betmaster', username: 'BetMaster',    avatar: '💸', fav: 'GER', tier: 'high',  bias: null },
  { id: 'haaland9',  username: 'haaland9',     avatar: '🇳🇴', fav: 'NOR', tier: 'mid',   bias: 'NOR homer' },
  { id: 'pkronaldo', username: 'pkronaldo',    avatar: '🇵🇹', fav: 'POR', tier: 'high',  bias: 'POR homer' },
  { id: 'ultras_eng',username: 'ultras_eng',   avatar: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fav: 'ENG', tier: 'mid',   bias: 'ENG homer' },
  { id: 'cafpower',  username: 'caf_power',    avatar: '🌍', fav: 'MAR', tier: 'mid',   bias: null },
  { id: 'joga_bonito',username:'joga_bonito',  avatar: '🇧🇷', fav: 'BRA', tier: 'high',  bias: null },
  { id: 'samurai_x', username: 'samurai_x',    avatar: '🇯🇵', fav: 'JPN', tier: 'mid',   bias: 'JPN homer' },
  { id: 'striker10', username: 'striker10',    avatar: '🎯', fav: 'BEL', tier: 'mid',   bias: null },
  { id: 'goatkeeper',username: 'GoatKeeper',   avatar: '🥅', fav: 'ARG', tier: 'high',  bias: null },
  { id: 'copa_loca', username: 'copa_loca',    avatar: '🏆', fav: 'COL', tier: 'mid',   bias: 'underdog' },
  { id: 'underdawg', username: 'UnderdawgFC',  avatar: '🐶', fav: 'GHA', tier: 'low',   bias: 'underdog' },
  { id: 'drawkingx', username: 'DrawKingX',    avatar: '🤝', fav: 'CRO', tier: 'low',   bias: 'draw lover' },
  { id: 'penalty_k', username: 'penalty_k',    avatar: '🟡', fav: 'MEX', tier: 'mid',   bias: 'MEX homer' },
  { id: 'laliga_god',username: 'laliga_god',   avatar: '⭐', fav: 'ESP', tier: 'high',  bias: null },
  { id: 'bundesbro', username: 'bundesbro',    avatar: '🦅', fav: 'GER', tier: 'mid',   bias: 'GER homer' },
  { id: 'selecao77', username: 'selecao77',    avatar: '🌿', fav: 'BRA', tier: 'low',   bias: 'BRA homer' },
  { id: 'albiceleste',username:'albiceleste',  avatar: '🔵', fav: 'ARG', tier: 'mid',   bias: null },
  { id: 'samba_sol', username: 'samba_sol',    avatar: '☀️', fav: 'BRA', tier: 'low',   bias: 'draw lover' },
  { id: 'lion_heart',username: 'lion_heart',   avatar: '🦁', fav: 'ENG', tier: 'low',   bias: 'ENG homer' },
  { id: 'foxtrotter',username: 'foxtrotter',   avatar: '🦊', fav: 'NED', tier: 'mid',   bias: null },
  { id: 'canarinho', username: 'canarinho',    avatar: '🐦', fav: 'BRA', tier: 'high',  bias: null },
  { id: 'asiantiger',username: 'asiantiger',   avatar: '🐯', fav: 'KOR', tier: 'low',   bias: 'KOR homer' },
  { id: 'latam_king',username: 'latam_king',   avatar: '👑', fav: 'COL', tier: 'mid',   bias: null },
  { id: 'freekick_f',username: 'freekick_f',   avatar: '🥋', fav: 'FRA', tier: 'high',  bias: null },
  { id: 'newbie_wc', username: 'newbie_wc',    avatar: '🔰', fav: undefined, tier: 'low', bias: null },
];

type Tier = 'god' | 'high' | 'mid' | 'low';

// Accuracy thresholds per tier (probability of picking the right winner)
const ACCURACY: Record<Tier, number> = {
  god:  0.78,
  high: 0.62,
  mid:  0.48,
  low:  0.30,
};

// Seeded random for reproducible results
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Ground-truth winners for the demo matches (derived from DEMO_RESULTS)
function getActualWinner(matchId: string): string | 'draw' | null {
  const res = DEMO_RESULTS[matchId];
  const match = MATCHES.find((m) => m.id === matchId);
  if (!res || !match) return null;
  if (res.homeScore > res.awayScore) return match.homeTeamId;
  if (res.homeScore < res.awayScore) return match.awayTeamId;
  return 'draw';
}

function makePrediction(
  userId: string,
  match: (typeof MATCHES)[0],
  rand: () => number,
  tier: Tier,
  favoriteTeam: string | undefined,
  bias: string | null
): Prediction {
  const accuracy = ACCURACY[tier];
  const actualWinner = getActualWinner(match.id);
  const isPlayed = !!DEMO_RESULTS[match.id];

  let predictedWinner: string | 'draw';

  // Apply bias overrides
  if (bias === 'draw lover' && rand() < 0.35) {
    predictedWinner = 'draw';
  } else if (
    favoriteTeam &&
    bias?.includes('homer') &&
    (match.homeTeamId === favoriteTeam || match.awayTeamId === favoriteTeam) &&
    rand() < 0.85
  ) {
    predictedWinner = favoriteTeam;
  } else if (bias === 'underdog' && rand() < 0.55) {
    // Prefer away team as "underdog" proxy
    predictedWinner = match.awayTeamId;
  } else if (isPlayed && actualWinner !== null) {
    // For played matches: pick correct winner with tier accuracy
    if (rand() < accuracy) {
      predictedWinner = actualWinner;
    } else {
      // Wrong pick — choose one of the other options
      const opts = [match.homeTeamId, match.awayTeamId, 'draw' as const].filter(
        (o) => o !== actualWinner
      );
      predictedWinner = opts[Math.floor(rand() * opts.length)];
    }
  } else {
    // Unplayed match — random plausible pick
    const opts: (string | 'draw')[] = [match.homeTeamId, match.awayTeamId, 'draw'];
    predictedWinner = opts[Math.floor(rand() * opts.length)];
  }

  const confidence = Math.max(1, Math.min(5, Math.round(1 + rand() * 4))) as 1|2|3|4|5;

  // Maybe add a predicted score
  const homeScore = rand() < 0.6 ? Math.floor(rand() * 4) : undefined;
  const awayScore = homeScore !== undefined ? Math.floor(rand() * 4) : undefined;

  return {
    id: `${userId}-${match.id}`,
    userId,
    matchId: match.id,
    predictedWinner,
    predictedHomeScore: homeScore,
    predictedAwayScore: awayScore,
    confidence,
    timestamp: new Date(Date.parse(match.date) - 3600_000 * 24).toISOString(), // 1 day before match
    sessionId: `seed-session-${userId}`,
    pointsEarned: undefined,
  };
}

function buildStats(predictions: Prediction[]): UserStats {
  let points = 0;
  let correctWinners = 0;
  let exactScores = 0;

  for (const p of predictions) {
    const actual = getActualWinner(p.matchId);
    const match = MATCHES.find((m) => m.id === p.matchId);
    if (!match || actual === null) continue;

    const correct = p.predictedWinner === actual;
    if (correct) {
      correctWinners++;
      const res = DEMO_RESULTS[p.matchId];
      if (
        res &&
        p.predictedHomeScore === res.homeScore &&
        p.predictedAwayScore === res.awayScore
      ) {
        exactScores++;
        points += match.stage === 'group' ? 5 : 7;
      } else {
        points += 3;
      }
    }
  }

  const playedPredictions = predictions.filter((p) => !!DEMO_RESULTS[p.matchId]);

  return {
    totalPredictions: predictions.length,
    correctWinners,
    exactScores,
    points,
    winnerAccuracy: playedPredictions.length > 0 ? correctWinners / playedPredictions.length : 0,
    streak: 0,
    bestStreak: 0,
  };
}

// Build 30 seeded users with predictions for ALL group stage matches
export function buildSeedUsers(): User[] {
  return PROFILES.map((profile, i) => {
    const rand = seededRand(i * 31337 + 7);
    const predictions = MATCHES.map((match) =>
      makePrediction(profile.id, match, rand, profile.tier as Tier, profile.fav, profile.bias)
    );
    const stats = buildStats(predictions);

    return {
      id: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      favoriteTeam: profile.fav,
      joinedAt: '2026-06-09T12:00:00Z',
      stats,
      predictions,
      isReal: false,
      memwalNamespace: `wc2026-${profile.id}`,
      detectedBiases: profile.bias ? [profile.bias] : [],
    };
  });
}

export const SEED_USERS = buildSeedUsers();
