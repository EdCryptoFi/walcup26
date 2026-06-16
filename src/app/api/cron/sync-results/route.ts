import { NextRequest, NextResponse } from 'next/server';
import { MATCH_MAP } from '@/lib/world-cup-data';
import { logError } from '@/lib/error-logger';

// ESPN public scoreboard API for FIFA World Cup
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

// Maps ESPN team abbreviations → our team IDs (add more as needed)
const ESPN_TEAM_MAP: Record<string, string> = {
  MEX: 'MEX', RSA: 'RSA', KOR: 'KOR', CZE: 'CZE', CAN: 'CAN', BIH: 'BIH',
  QAT: 'QAT', SUI: 'SUI', BRA: 'BRA', MAR: 'MAR', HAI: 'HAI', SCO: 'SCO',
  USA: 'USA', PAR: 'PAR', AUS: 'AUS', TUR: 'TUR', GER: 'GER', CUW: 'CUW',
  CIV: 'CIV', ECU: 'ECU', NED: 'NED', TUN: 'TUN', JPN: 'JPN', SWE: 'SWE',
  BEL: 'BEL', EGY: 'EGY', IRN: 'IRN', NZL: 'NZL', ESP: 'ESP', CPV: 'CPV',
  KSA: 'KSA', URU: 'URU', FRA: 'FRA', SEN: 'SEN', ARG: 'ARG', ALG: 'ALG',
  POR: 'POR', COD: 'COD', ENG: 'ENG', CRO: 'CRO',
  // ESPN may use different codes
  SA: 'RSA', CZ: 'CZE', BA: 'BIH', QA: 'QAT', CH: 'SUI', CI: 'CIV',
  NL: 'NED', TN: 'TUN', BE: 'BEL', IR: 'IRN', NZ: 'NZL', CV: 'CPV',
  SA2: 'KSA', UY: 'URU', SN: 'SEN', DZ: 'ALG', PT: 'POR', CD: 'COD',
  HR: 'CRO', GHA: 'GHA',
};

interface ESPNEvent {
  id: string;
  competitions: Array<{
    competitors: Array<{
      team: { abbreviation: string };
      score: string;
      homeAway: 'home' | 'away';
    }>;
    status: { type: { completed: boolean; name: string } };
  }>;
}

async function fetchESPNResults(dateStr: string): Promise<Map<string, { home: string; away: string; homeScore: number; awayScore: number }>> {
  const url = `${ESPN_BASE}/scoreboard?dates=${dateStr}&limit=50`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`ESPN ${res.status}`);
  const data = await res.json();
  const results = new Map<string, { home: string; away: string; homeScore: number; awayScore: number }>();

  for (const event of (data.events ?? []) as ESPNEvent[]) {
    const comp = event.competitions?.[0];
    if (!comp?.status?.type?.completed) continue;

    const homeComp = comp.competitors.find((c) => c.homeAway === 'home');
    const awayComp = comp.competitors.find((c) => c.homeAway === 'away');
    if (!homeComp || !awayComp) continue;

    const homeAbbr = homeComp.team.abbreviation.toUpperCase();
    const awayAbbr = awayComp.team.abbreviation.toUpperCase();
    const homeId = ESPN_TEAM_MAP[homeAbbr] ?? homeAbbr;
    const awayId = ESPN_TEAM_MAP[awayAbbr] ?? awayAbbr;
    const homeScore = parseInt(homeComp.score ?? '0', 10);
    const awayScore = parseInt(awayComp.score ?? '0', 10);

    results.set(`${homeId}-${awayId}`, { home: homeId, away: awayId, homeScore, awayScore });
  }
  return results;
}

function matchKey(homeTeamId: string, awayTeamId: string) {
  return `${homeTeamId}-${awayTeamId}`;
}

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET /api/cron/sync-results — fetch ESPN results and post any new ones
// Called by Vercel Cron (Authorization: Bearer CRON_SECRET) or manually (x-admin-secret)
export async function GET(req: NextRequest) {
  const cronHeader = req.headers.get('authorization');
  const adminHeader = req.headers.get('x-admin-secret');
  const fromCron = process.env.CRON_SECRET && cronHeader === `Bearer ${process.env.CRON_SECRET}`;
  const fromAdmin = process.env.ADMIN_SECRET && adminHeader === process.env.ADMIN_SECRET;
  if (!fromCron && !fromAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://walcup26.vercel.app';
  const now = new Date();
  const synced: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  // Build set of match dates to fetch (all past match dates up to today)
  const datesToFetch = new Set<string>();
  for (const match of MATCH_MAP.values()) {
    const matchDate = new Date(match.date);
    if (matchDate <= now) {
      // Format as YYYYMMDD for ESPN API
      const d = matchDate.toISOString().slice(0, 10).replace(/-/g, '');
      datesToFetch.add(d);
    }
  }

  // Fetch ESPN results for each past date
  const espnResults = new Map<string, { home: string; away: string; homeScore: number; awayScore: number }>();
  for (const dateStr of datesToFetch) {
    try {
      const dayResults = await fetchESPNResults(dateStr);
      for (const [key, val] of dayResults) {
        espnResults.set(key, val);
      }
    } catch (err) {
      logError('sync-results:espn', `ESPN fetch failed for ${dateStr}`, err instanceof Error ? err.message : String(err));
      errors.push(`espn-${dateStr}`);
    }
  }

  // Match ESPN results to our MATCH_MAP and POST any new ones
  for (const [matchId, match] of MATCH_MAP.entries()) {
    const matchDate = new Date(match.date);
    if (matchDate > now) continue; // future match

    const key = matchKey(match.homeTeamId, match.awayTeamId);
    const result = espnResults.get(key);
    if (!result) {
      // Not found in ESPN — skip silently
      continue;
    }

    try {
      const res = await fetch(`${appUrl}/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': process.env.ADMIN_SECRET!,
        },
        body: JSON.stringify({ matchId, homeScore: result.homeScore, awayScore: result.awayScore }),
      });
      const data = await res.json();
      if (data.skipped) {
        skipped.push(matchId);
      } else {
        synced.push(`${matchId}: ${result.homeScore}-${result.awayScore} (${data.usersScored} users scored)`);
      }
    } catch (err) {
      logError('sync-results:post', `Failed to post result for ${matchId}`, err instanceof Error ? err.message : String(err));
      errors.push(matchId);
    }
  }

  return NextResponse.json({
    synced,
    skipped,
    errors,
    espnMatchesFound: espnResults.size,
    datesChecked: [...datesToFetch],
  });
}
