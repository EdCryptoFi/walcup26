import { Match, Prediction } from '@/types';

export const POINTS = {
  GROUP_CORRECT_WINNER: 3,
  GROUP_EXACT_SCORE: 2,      // bonus on top of correct winner
  KNOCKOUT_CORRECT_WINNER: 4,
  KNOCKOUT_EXACT_SCORE: 3,   // bonus
  QF_CORRECT_WINNER: 5,
  SF_CORRECT_WINNER: 6,
  FINAL_CORRECT_WINNER: 8,
  TOURNAMENT_CHAMPION: 10,
  TOURNAMENT_RUNNER_UP: 5,
  TOURNAMENT_TOP_SCORER: 5,
};

/**
 * Returns winner team id, 'draw', or null if match not finished.
 */
export function getMatchWinner(match: Match): string | 'draw' | null {
  if (!match.result || match.result.status !== 'finished') return null;
  if (match.result.homeScore > match.result.awayScore) return match.homeTeamId;
  if (match.result.homeScore < match.result.awayScore) return match.awayTeamId;
  return 'draw';
}

export function scorePrediction(prediction: Prediction, match: Match): number {
  const actualWinner = getMatchWinner(match);
  if (actualWinner === null) return 0;

  const stageMultiplier = getStageMultiplier(match.stage);
  let points = 0;

  const correctWinner = prediction.predictedWinner === actualWinner;
  if (correctWinner) {
    points += stageMultiplier;

    const hasScore =
      prediction.predictedHomeScore !== undefined &&
      prediction.predictedAwayScore !== undefined;
    const exactScore =
      hasScore &&
      prediction.predictedHomeScore === match.result!.homeScore &&
      prediction.predictedAwayScore === match.result!.awayScore;

    if (exactScore) {
      points += match.stage === 'group' ? POINTS.GROUP_EXACT_SCORE : POINTS.KNOCKOUT_EXACT_SCORE;
    }
  }

  return points;
}

function getStageMultiplier(stage: string): number {
  switch (stage) {
    case 'group': return POINTS.GROUP_CORRECT_WINNER;
    case 'r32':   return POINTS.KNOCKOUT_CORRECT_WINNER;
    case 'r16':   return POINTS.KNOCKOUT_CORRECT_WINNER;
    case 'qf':    return POINTS.QF_CORRECT_WINNER;
    case 'sf':    return POINTS.SF_CORRECT_WINNER;
    case 'final': return POINTS.FINAL_CORRECT_WINNER;
    default:      return POINTS.GROUP_CORRECT_WINNER;
  }
}

export function scoreAllPredictions(
  predictions: Prediction[],
  matchMap: Map<string, Match>
): { predictions: Prediction[]; totalPoints: number; correctWinners: number; exactScores: number } {
  let totalPoints = 0;
  let correctWinners = 0;
  let exactScores = 0;

  const scored = predictions.map((p) => {
    const match = matchMap.get(p.matchId);
    if (!match) return p;

    const pts = scorePrediction(p, match);
    const winner = getMatchWinner(match);
    const correct = winner !== null && p.predictedWinner === winner;
    const exact =
      correct &&
      p.predictedHomeScore !== undefined &&
      p.predictedHomeScore === match.result?.homeScore &&
      p.predictedAwayScore === match.result?.awayScore;

    if (correct) correctWinners++;
    if (exact) exactScores++;
    totalPoints += pts;

    return { ...p, pointsEarned: pts };
  });

  return { predictions: scored, totalPoints, correctWinners, exactScores };
}

export function detectBiases(predictions: Prediction[], matchMap: Map<string, Match>): string[] {
  const biases: string[] = [];
  const totalPredicted = predictions.filter((p) => {
    const m = matchMap.get(p.matchId);
    return m && m.result?.status === 'finished';
  });

  if (totalPredicted.length < 3) return biases;

  // Count draws predicted
  const drawPredictions = predictions.filter((p) => p.predictedWinner === 'draw').length;
  if (drawPredictions / predictions.length > 0.4) biases.push('Loves predicting draws');

  // High-confidence wrong predictions
  const highConfWrong = totalPredicted.filter((p) => {
    const m = matchMap.get(p.matchId);
    if (!m) return false;
    const winner = getMatchWinner(m);
    return p.confidence >= 4 && winner !== null && p.predictedWinner !== winner;
  });
  if (highConfWrong.length >= 2) biases.push('Overconfident — often wrong on high-confidence picks');

  // Underdog bias: predicted teams with lower FIFA rank
  // (simplified: predict teams ranked 30+ over top-10)
  const underdogWins = predictions.filter((p) => {
    const m = matchMap.get(p.matchId);
    if (!m || p.predictedWinner === 'draw') return false;
    return p.predictedWinner === m.awayTeamId; // away team as proxy for underdog
  });
  if (underdogWins.length / predictions.length > 0.6) biases.push('Underdog bias');

  // Favorite team homer bias — check if they always predict same team
  const winCounts = new Map<string, number>();
  predictions.forEach((p) => {
    if (p.predictedWinner !== 'draw') {
      winCounts.set(p.predictedWinner, (winCounts.get(p.predictedWinner) ?? 0) + 1);
    }
  });
  for (const [team, count] of winCounts.entries()) {
    if (count / predictions.length > 0.5) {
      biases.push(`${team} homer — predicted them in ${count}/${predictions.length} matches`);
    }
  }

  return biases;
}
