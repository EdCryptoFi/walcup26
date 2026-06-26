import { convexQuery } from './convex-client';
import { DEMO_RESULTS } from './world-cup-data';

export type ResultMap = Record<string, { homeScore: number; awayScore: number }>;

// Fetches live results from Convex; falls back to DEMO_RESULTS if unavailable
export async function getResults(): Promise<ResultMap> {
  const data = await convexQuery<Record<string, { homeScore: number; awayScore: number; scoredAt: string; usersScored: number }>>('matchResults:getAll');
  if (data && Object.keys(data).length > 0) {
    const out: ResultMap = {};
    for (const [id, r] of Object.entries(data)) {
      out[id] = { homeScore: r.homeScore, awayScore: r.awayScore };
    }
    return out;
  }
  return DEMO_RESULTS;
}
