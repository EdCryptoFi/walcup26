import { Team, Match, Group } from '@/types';

export const TEAMS: Team[] = [
  // ── Group A ─────────────────────────────────────────────────────────────
  { id: 'MEX', name: 'Mexico',       code: 'MEX', flag: '🇲🇽', confederation: 'CONCACAF', group: 'A', fifaRank: 16 },
  { id: 'RSA', name: 'South Africa', code: 'RSA', flag: '🇿🇦', confederation: 'CAF',      group: 'A', fifaRank: 65 },
  { id: 'KOR', name: 'South Korea',  code: 'KOR', flag: '🇰🇷', confederation: 'AFC',      group: 'A', fifaRank: 23 },
  { id: 'CZE', name: 'Czechia',      code: 'CZE', flag: '🇨🇿', confederation: 'UEFA',     group: 'A', fifaRank: 40 },
  // ── Group B ─────────────────────────────────────────────────────────────
  { id: 'CAN', name: 'Canada',                  code: 'CAN', flag: '🇨🇦', confederation: 'CONCACAF', group: 'B', fifaRank: 42 },
  { id: 'BIH', name: 'Bosnia and Herzegovina',  code: 'BIH', flag: '🇧🇦', confederation: 'UEFA',     group: 'B', fifaRank: 67 },
  { id: 'QAT', name: 'Qatar',                   code: 'QAT', flag: '🇶🇦', confederation: 'AFC',      group: 'B', fifaRank: 37 },
  { id: 'SUI', name: 'Switzerland',             code: 'SUI', flag: '🇨🇭', confederation: 'UEFA',     group: 'B', fifaRank: 19 },
  // ── Group C ─────────────────────────────────────────────────────────────
  { id: 'BRA', name: 'Brazil',   code: 'BRA', flag: '🇧🇷', confederation: 'CONMEBOL', group: 'C', fifaRank: 5  },
  { id: 'MAR', name: 'Morocco',  code: 'MAR', flag: '🇲🇦', confederation: 'CAF',      group: 'C', fifaRank: 14 },
  { id: 'HAI', name: 'Haiti',    code: 'HAI', flag: '🇭🇹', confederation: 'CONCACAF', group: 'C', fifaRank: 83 },
  { id: 'SCO', name: 'Scotland', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA',     group: 'C', fifaRank: 39 },
  // ── Group D ─────────────────────────────────────────────────────────────
  { id: 'USA', name: 'United States', code: 'USA', flag: '🇺🇸', confederation: 'CONCACAF', group: 'D', fifaRank: 13 },
  { id: 'PAR', name: 'Paraguay',      code: 'PAR', flag: '🇵🇾', confederation: 'CONMEBOL', group: 'D', fifaRank: 55 },
  { id: 'AUS', name: 'Australia',     code: 'AUS', flag: '🇦🇺', confederation: 'AFC',      group: 'D', fifaRank: 24 },
  { id: 'TUR', name: 'Türkiye',       code: 'TUR', flag: '🇹🇷', confederation: 'UEFA',     group: 'D', fifaRank: 29 },
  // ── Group E ─────────────────────────────────────────────────────────────
  { id: 'GER', name: 'Germany',      code: 'GER', flag: '🇩🇪', confederation: 'UEFA',     group: 'E', fifaRank: 12 },
  { id: 'CUW', name: 'Curaçao',      code: 'CUW', flag: '🇨🇼', confederation: 'CONCACAF', group: 'E', fifaRank: 77 },
  { id: 'CIV', name: 'Ivory Coast',  code: 'CIV', flag: '🇨🇮', confederation: 'CAF',      group: 'E', fifaRank: 48 },
  { id: 'ECU', name: 'Ecuador',      code: 'ECU', flag: '🇪🇨', confederation: 'CONMEBOL', group: 'E', fifaRank: 44 },
  // ── Group F ─────────────────────────────────────────────────────────────
  { id: 'NED', name: 'Netherlands', code: 'NED', flag: '🇳🇱', confederation: 'UEFA', group: 'F', fifaRank: 7  },
  { id: 'JPN', name: 'Japan',       code: 'JPN', flag: '🇯🇵', confederation: 'AFC',  group: 'F', fifaRank: 17 },
  { id: 'SWE', name: 'Sweden',      code: 'SWE', flag: '🇸🇪', confederation: 'UEFA', group: 'F', fifaRank: 25 },
  { id: 'TUN', name: 'Tunisia',     code: 'TUN', flag: '🇹🇳', confederation: 'CAF',  group: 'F', fifaRank: 30 },
  // ── Group G ─────────────────────────────────────────────────────────────
  { id: 'BEL', name: 'Belgium',     code: 'BEL', flag: '🇧🇪', confederation: 'UEFA', group: 'G', fifaRank: 3  },
  { id: 'EGY', name: 'Egypt',       code: 'EGY', flag: '🇪🇬', confederation: 'CAF',  group: 'G', fifaRank: 34 },
  { id: 'IRN', name: 'Iran',        code: 'IRN', flag: '🇮🇷', confederation: 'AFC',  group: 'G', fifaRank: 21 },
  { id: 'NZL', name: 'New Zealand', code: 'NZL', flag: '🇳🇿', confederation: 'OFC',  group: 'G', fifaRank: 92 },
  // ── Group H ─────────────────────────────────────────────────────────────
  { id: 'ESP', name: 'Spain',        code: 'ESP', flag: '🇪🇸', confederation: 'UEFA',     group: 'H', fifaRank: 8  },
  { id: 'CPV', name: 'Cape Verde',   code: 'CPV', flag: '🇨🇻', confederation: 'CAF',      group: 'H', fifaRank: 58 },
  { id: 'KSA', name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', confederation: 'AFC',      group: 'H', fifaRank: 56 },
  { id: 'URU', name: 'Uruguay',      code: 'URU', flag: '🇺🇾', confederation: 'CONMEBOL', group: 'H', fifaRank: 20 },
  // ── Group I ─────────────────────────────────────────────────────────────
  { id: 'FRA', name: 'France',   code: 'FRA', flag: '🇫🇷', confederation: 'UEFA', group: 'I', fifaRank: 2  },
  { id: 'SEN', name: 'Senegal',  code: 'SEN', flag: '🇸🇳', confederation: 'CAF',  group: 'I', fifaRank: 18 },
  { id: 'IRQ', name: 'Iraq',     code: 'IRQ', flag: '🇮🇶', confederation: 'AFC',  group: 'I', fifaRank: 63 },
  { id: 'NOR', name: 'Norway',   code: 'NOR', flag: '🇳🇴', confederation: 'UEFA', group: 'I', fifaRank: 33 },
  // ── Group J ─────────────────────────────────────────────────────────────
  { id: 'ARG', name: 'Argentina', code: 'ARG', flag: '🇦🇷', confederation: 'CONMEBOL', group: 'J', fifaRank: 1  },
  { id: 'ALG', name: 'Algeria',   code: 'ALG', flag: '🇩🇿', confederation: 'CAF',      group: 'J', fifaRank: 46 },
  { id: 'AUT', name: 'Austria',   code: 'AUT', flag: '🇦🇹', confederation: 'UEFA',     group: 'J', fifaRank: 27 },
  { id: 'JOR', name: 'Jordan',    code: 'JOR', flag: '🇯🇴', confederation: 'AFC',      group: 'J', fifaRank: 71 },
  // ── Group K ─────────────────────────────────────────────────────────────
  { id: 'POR', name: 'Portugal',  code: 'POR', flag: '🇵🇹', confederation: 'UEFA',     group: 'K', fifaRank: 6  },
  { id: 'COD', name: 'DR Congo',  code: 'COD', flag: '🇨🇩', confederation: 'CAF',      group: 'K', fifaRank: 51 },
  { id: 'UZB', name: 'Uzbekistan',code: 'UZB', flag: '🇺🇿', confederation: 'AFC',      group: 'K', fifaRank: 60 },
  { id: 'COL', name: 'Colombia',  code: 'COL', flag: '🇨🇴', confederation: 'CONMEBOL', group: 'K', fifaRank: 11 },
  // ── Group L ─────────────────────────────────────────────────────────────
  { id: 'ENG', name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA',     group: 'L', fifaRank: 4  },
  { id: 'CRO', name: 'Croatia', code: 'CRO', flag: '🇭🇷', confederation: 'UEFA',     group: 'L', fifaRank: 10 },
  { id: 'GHA', name: 'Ghana',   code: 'GHA', flag: '🇬🇭', confederation: 'CAF',      group: 'L', fifaRank: 61 },
  { id: 'PAN', name: 'Panama',  code: 'PAN', flag: '🇵🇦', confederation: 'CONCACAF', group: 'L', fifaRank: 49 },
];

export const TEAM_MAP = new Map<string, Team>(TEAMS.map((t) => [t.id, t]));

export function getTeam(id: string): Team | undefined {
  return TEAM_MAP.get(id);
}

export function getGroupTeams(group: Group): Team[] {
  return TEAMS.filter((t) => t.group === group);
}

// ── Group Stage Matches (72 total, 6 per group) ─────────────────────────────
// Each group: MD1 (day 1-7), MD2 (day 8-14), MD3 (day 15-17 simultaneous)
export const MATCHES: Match[] = [
  // ── Group A ──────────────────────────────────
  { id: 'A1', homeTeamId: 'MEX', awayTeamId: 'RSA', date: '2026-06-11T22:00:00Z', venue: 'Estadio Azteca',    city: 'Mexico City', stage: 'group', group: 'A', matchday: 1 },
  { id: 'A2', homeTeamId: 'KOR', awayTeamId: 'CZE', date: '2026-06-12T03:00:00Z', venue: 'Estadio Akron',     city: 'Zapopan',     stage: 'group', group: 'A', matchday: 1 },
  { id: 'A3', homeTeamId: 'KOR', awayTeamId: 'RSA', date: '2026-06-19T00:00:00Z', venue: 'Estadio Azteca',    city: 'Mexico City', stage: 'group', group: 'A', matchday: 2 },
  { id: 'A4', homeTeamId: 'CZE', awayTeamId: 'MEX', date: '2026-06-19T03:00:00Z', venue: 'Estadio Akron',     city: 'Zapopan',     stage: 'group', group: 'A', matchday: 2 },
  { id: 'A5', homeTeamId: 'MEX', awayTeamId: 'KOR', date: '2026-06-25T23:00:00Z', venue: 'Estadio Akron',     city: 'Zapopan',     stage: 'group', group: 'A', matchday: 3 },
  { id: 'A6', homeTeamId: 'RSA', awayTeamId: 'CZE', date: '2026-06-25T23:00:00Z', venue: 'Estadio Azteca',    city: 'Mexico City', stage: 'group', group: 'A', matchday: 3 },
  // ── Group B ──────────────────────────────────
  { id: 'B1', homeTeamId: 'CAN', awayTeamId: 'BIH', date: '2026-06-12T23:00:00Z', venue: 'BMO Field',          city: 'Toronto',      stage: 'group', group: 'B', matchday: 1 },
  { id: 'B2', homeTeamId: 'QAT', awayTeamId: 'SUI', date: '2026-06-13T20:00:00Z', venue: 'Levi\'s Stadium',   city: 'Santa Clara',  stage: 'group', group: 'B', matchday: 1 },
  { id: 'B3', homeTeamId: 'QAT', awayTeamId: 'BIH', date: '2026-06-19T20:00:00Z', venue: 'BMO Field',          city: 'Toronto',      stage: 'group', group: 'B', matchday: 2 },
  { id: 'B4', homeTeamId: 'SUI', awayTeamId: 'CAN', date: '2026-06-20T00:00:00Z', venue: 'Levi\'s Stadium',   city: 'Santa Clara',  stage: 'group', group: 'B', matchday: 2 },
  { id: 'B5', homeTeamId: 'CAN', awayTeamId: 'QAT', date: '2026-06-26T23:00:00Z', venue: 'BMO Field',          city: 'Toronto',      stage: 'group', group: 'B', matchday: 3 },
  { id: 'B6', homeTeamId: 'SUI', awayTeamId: 'BIH', date: '2026-06-26T23:00:00Z', venue: 'Levi\'s Stadium',   city: 'Santa Clara',  stage: 'group', group: 'B', matchday: 3 },
  // ── Group C ──────────────────────────────────
  { id: 'C1', homeTeamId: 'BRA', awayTeamId: 'MAR', date: '2026-06-13T22:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'C', matchday: 1 },
  { id: 'C2', homeTeamId: 'HAI', awayTeamId: 'SCO', date: '2026-06-14T01:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'C', matchday: 1 },
  { id: 'C3', homeTeamId: 'BRA', awayTeamId: 'HAI', date: '2026-06-20T22:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'C', matchday: 2 },
  { id: 'C4', homeTeamId: 'SCO', awayTeamId: 'MAR', date: '2026-06-21T01:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'C', matchday: 2 },
  { id: 'C5', homeTeamId: 'BRA', awayTeamId: 'SCO', date: '2026-06-26T22:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'C', matchday: 3 },
  { id: 'C6', homeTeamId: 'MAR', awayTeamId: 'HAI', date: '2026-06-26T22:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'C', matchday: 3 },
  // ── Group D ──────────────────────────────────
  { id: 'D1', homeTeamId: 'USA', awayTeamId: 'PAR', date: '2026-06-12T22:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'D', matchday: 1 },
  { id: 'D2', homeTeamId: 'AUS', awayTeamId: 'TUR', date: '2026-06-14T04:00:00Z', venue: 'BC Place',           city: 'Vancouver',    stage: 'group', group: 'D', matchday: 1 },
  { id: 'D3', homeTeamId: 'AUS', awayTeamId: 'PAR', date: '2026-06-20T19:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'D', matchday: 2 },
  { id: 'D4', homeTeamId: 'TUR', awayTeamId: 'USA', date: '2026-06-21T03:00:00Z', venue: 'BC Place',           city: 'Vancouver',    stage: 'group', group: 'D', matchday: 2 },
  { id: 'D5', homeTeamId: 'USA', awayTeamId: 'AUS', date: '2026-06-26T00:00:00Z', venue: 'BC Place',           city: 'Vancouver',    stage: 'group', group: 'D', matchday: 3 },
  { id: 'D6', homeTeamId: 'PAR', awayTeamId: 'TUR', date: '2026-06-26T00:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'D', matchday: 3 },
  // ── Group E ──────────────────────────────────
  { id: 'E1', homeTeamId: 'GER', awayTeamId: 'CUW', date: '2026-06-14T22:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'E', matchday: 1 },
  { id: 'E2', homeTeamId: 'CIV', awayTeamId: 'ECU', date: '2026-06-15T01:00:00Z', venue: 'NRG Stadium',        city: 'Houston',      stage: 'group', group: 'E', matchday: 1 },
  { id: 'E3', homeTeamId: 'GER', awayTeamId: 'ECU', date: '2026-06-21T22:00:00Z', venue: 'NRG Stadium',        city: 'Houston',      stage: 'group', group: 'E', matchday: 2 },
  { id: 'E4', homeTeamId: 'CUW', awayTeamId: 'CIV', date: '2026-06-22T01:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'E', matchday: 2 },
  { id: 'E5', homeTeamId: 'GER', awayTeamId: 'CIV', date: '2026-06-27T00:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'E', matchday: 3 },
  { id: 'E6', homeTeamId: 'ECU', awayTeamId: 'CUW', date: '2026-06-27T00:00:00Z', venue: 'NRG Stadium',        city: 'Houston',      stage: 'group', group: 'E', matchday: 3 },
  // ── Group F ──────────────────────────────────
  { id: 'F1', homeTeamId: 'NED', awayTeamId: 'TUN', date: '2026-06-14T18:00:00Z', venue: 'Arrowhead Stadium',  city: 'Kansas City',  stage: 'group', group: 'F', matchday: 1 },
  { id: 'F2', homeTeamId: 'JPN', awayTeamId: 'SWE', date: '2026-06-15T00:00:00Z', venue: 'Lumen Field',        city: 'Seattle',      stage: 'group', group: 'F', matchday: 1 },
  { id: 'F3', homeTeamId: 'NED', awayTeamId: 'JPN', date: '2026-06-21T18:00:00Z', venue: 'Lumen Field',        city: 'Seattle',      stage: 'group', group: 'F', matchday: 2 },
  { id: 'F4', homeTeamId: 'SWE', awayTeamId: 'TUN', date: '2026-06-22T00:00:00Z', venue: 'Arrowhead Stadium',  city: 'Kansas City',  stage: 'group', group: 'F', matchday: 2 },
  { id: 'F5', homeTeamId: 'NED', awayTeamId: 'SWE', date: '2026-06-27T23:00:00Z', venue: 'Arrowhead Stadium',  city: 'Kansas City',  stage: 'group', group: 'F', matchday: 3 },
  { id: 'F6', homeTeamId: 'TUN', awayTeamId: 'JPN', date: '2026-06-27T23:00:00Z', venue: 'Lumen Field',        city: 'Seattle',      stage: 'group', group: 'F', matchday: 3 },
  // ── Group G ──────────────────────────────────
  { id: 'G1', homeTeamId: 'BEL', awayTeamId: 'EGY', date: '2026-06-15T22:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'group', group: 'G', matchday: 1 },
  { id: 'G2', homeTeamId: 'IRN', awayTeamId: 'NZL', date: '2026-06-16T01:00:00Z', venue: 'Levi\'s Stadium',         city: 'Santa Clara',  stage: 'group', group: 'G', matchday: 1 },
  { id: 'G3', homeTeamId: 'IRN', awayTeamId: 'EGY', date: '2026-06-22T22:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'group', group: 'G', matchday: 2 },
  { id: 'G4', homeTeamId: 'NZL', awayTeamId: 'BEL', date: '2026-06-23T01:00:00Z', venue: 'Levi\'s Stadium',         city: 'Santa Clara',  stage: 'group', group: 'G', matchday: 2 },
  { id: 'G5', homeTeamId: 'BEL', awayTeamId: 'IRN', date: '2026-06-27T22:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'group', group: 'G', matchday: 3 },
  { id: 'G6', homeTeamId: 'EGY', awayTeamId: 'NZL', date: '2026-06-27T22:00:00Z', venue: 'Levi\'s Stadium',         city: 'Santa Clara',  stage: 'group', group: 'G', matchday: 3 },
  // ── Group H ──────────────────────────────────
  { id: 'H1', homeTeamId: 'ESP', awayTeamId: 'CPV', date: '2026-06-15T18:00:00Z', venue: 'Rose Bowl',          city: 'Pasadena',     stage: 'group', group: 'H', matchday: 1 },
  { id: 'H2', homeTeamId: 'KSA', awayTeamId: 'URU', date: '2026-06-16T00:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami',        stage: 'group', group: 'H', matchday: 1 },
  { id: 'H3', homeTeamId: 'ESP', awayTeamId: 'URU', date: '2026-06-22T18:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami',        stage: 'group', group: 'H', matchday: 2 },
  { id: 'H4', homeTeamId: 'CPV', awayTeamId: 'KSA', date: '2026-06-23T00:00:00Z', venue: 'Rose Bowl',          city: 'Pasadena',     stage: 'group', group: 'H', matchday: 2 },
  { id: 'H5', homeTeamId: 'ESP', awayTeamId: 'KSA', date: '2026-06-27T01:00:00Z', venue: 'Rose Bowl',          city: 'Pasadena',     stage: 'group', group: 'H', matchday: 3 },
  { id: 'H6', homeTeamId: 'URU', awayTeamId: 'CPV', date: '2026-06-27T01:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami',        stage: 'group', group: 'H', matchday: 3 },
  // ── Group I ──────────────────────────────────
  { id: 'I1', homeTeamId: 'FRA', awayTeamId: 'SEN', date: '2026-06-16T22:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       stage: 'group', group: 'I', matchday: 1 },
  { id: 'I2', homeTeamId: 'IRQ', awayTeamId: 'NOR', date: '2026-06-17T01:00:00Z', venue: 'Geodis Park',            city: 'Nashville',     stage: 'group', group: 'I', matchday: 1 },
  { id: 'I3', homeTeamId: 'FRA', awayTeamId: 'IRQ', date: '2026-06-23T22:00:00Z', venue: 'Geodis Park',            city: 'Nashville',     stage: 'group', group: 'I', matchday: 2 },
  { id: 'I4', homeTeamId: 'NOR', awayTeamId: 'SEN', date: '2026-06-24T01:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       stage: 'group', group: 'I', matchday: 2 },
  { id: 'I5', homeTeamId: 'FRA', awayTeamId: 'NOR', date: '2026-06-27T19:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       stage: 'group', group: 'I', matchday: 3 },
  { id: 'I6', homeTeamId: 'SEN', awayTeamId: 'IRQ', date: '2026-06-27T19:00:00Z', venue: 'Geodis Park',            city: 'Nashville',     stage: 'group', group: 'I', matchday: 3 },
  // ── Group J ──────────────────────────────────
  { id: 'J1', homeTeamId: 'ARG', awayTeamId: 'ALG', date: '2026-06-16T18:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'J', matchday: 1 },
  { id: 'J2', homeTeamId: 'AUT', awayTeamId: 'JOR', date: '2026-06-17T00:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'J', matchday: 1 },
  { id: 'J3', homeTeamId: 'ARG', awayTeamId: 'JOR', date: '2026-06-23T18:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'J', matchday: 2 },
  { id: 'J4', homeTeamId: 'ALG', awayTeamId: 'AUT', date: '2026-06-24T00:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'J', matchday: 2 },
  { id: 'J5', homeTeamId: 'ARG', awayTeamId: 'AUT', date: '2026-06-27T02:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'J', matchday: 3 },
  { id: 'J6', homeTeamId: 'JOR', awayTeamId: 'ALG', date: '2026-06-27T02:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'J', matchday: 3 },
  // ── Group K ──────────────────────────────────
  { id: 'K1', homeTeamId: 'POR', awayTeamId: 'COD', date: '2026-06-17T22:00:00Z', venue: 'Estadio BBVA',       city: 'Monterrey',    stage: 'group', group: 'K', matchday: 1 },
  { id: 'K2', homeTeamId: 'UZB', awayTeamId: 'COL', date: '2026-06-18T01:00:00Z', venue: 'Estadio Azteca',     city: 'Mexico City',  stage: 'group', group: 'K', matchday: 1 },
  { id: 'K3', homeTeamId: 'POR', awayTeamId: 'UZB', date: '2026-06-24T22:00:00Z', venue: 'Estadio Azteca',     city: 'Mexico City',  stage: 'group', group: 'K', matchday: 2 },
  { id: 'K4', homeTeamId: 'COD', awayTeamId: 'COL', date: '2026-06-25T01:00:00Z', venue: 'Estadio BBVA',       city: 'Monterrey',    stage: 'group', group: 'K', matchday: 2 },
  { id: 'K5', homeTeamId: 'POR', awayTeamId: 'COL', date: '2026-06-27T22:00:00Z', venue: 'Estadio BBVA',       city: 'Monterrey',    stage: 'group', group: 'K', matchday: 3 },
  { id: 'K6', homeTeamId: 'COD', awayTeamId: 'UZB', date: '2026-06-27T22:00:00Z', venue: 'Estadio Azteca',     city: 'Mexico City',  stage: 'group', group: 'K', matchday: 3 },
  // ── Group L ──────────────────────────────────
  { id: 'L1', homeTeamId: 'ENG', awayTeamId: 'CRO', date: '2026-06-17T18:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'L', matchday: 1 },
  { id: 'L2', homeTeamId: 'GHA', awayTeamId: 'PAN', date: '2026-06-18T00:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'L', matchday: 1 },
  { id: 'L3', homeTeamId: 'ENG', awayTeamId: 'GHA', date: '2026-06-24T18:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'L', matchday: 2 },
  { id: 'L4', homeTeamId: 'PAN', awayTeamId: 'CRO', date: '2026-06-25T00:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'L', matchday: 2 },
  { id: 'L5', homeTeamId: 'ENG', awayTeamId: 'PAN', date: '2026-06-27T21:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'L', matchday: 3 },
  { id: 'L6', homeTeamId: 'CRO', awayTeamId: 'GHA', date: '2026-06-27T21:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'L', matchday: 3 },
];

export const MATCH_MAP = new Map<string, Match>(MATCHES.map((m) => [m.id, m]));

export function getMatch(id: string): Match | undefined {
  return MATCH_MAP.get(id);
}

export function getGroupMatches(group: Group): Match[] {
  return MATCHES.filter((m) => m.group === group);
}

export function getMatchdayMatches(matchday: 1 | 2 | 3): Match[] {
  return MATCHES.filter((m) => m.matchday === matchday);
}

export function computeGroupStandings(group: Group, matches: Match[]) {
  const teams = getGroupTeams(group);
  const standings = new Map(
    teams.map((t) => [t.id, { teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }])
  );

  for (const m of matches) {
    if (!m.result || m.result.status !== 'finished') continue;
    const h = standings.get(m.homeTeamId);
    const a = standings.get(m.awayTeamId);
    if (!h || !a) continue;

    h.played++; a.played++;
    h.goalsFor += m.result.homeScore; h.goalsAgainst += m.result.awayScore;
    a.goalsFor += m.result.awayScore; a.goalsAgainst += m.result.homeScore;

    if (m.result.homeScore > m.result.awayScore) {
      h.won++; h.points += 3; a.lost++;
    } else if (m.result.homeScore < m.result.awayScore) {
      a.won++; a.points += 3; h.lost++;
    } else {
      h.drawn++; h.points++; a.drawn++; a.points++;
    }

    h.goalDifference = h.goalsFor - h.goalsAgainst;
    a.goalDifference = a.goalsFor - a.goalsAgainst;
  }

  return [...standings.values()].sort((a, b) =>
    b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor
  );
}

export const ALL_GROUPS: Group[] = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// Demo results — simulates matches played June 11-15 for leaderboard demo
export const DEMO_RESULTS: Record<string, { homeScore: number; awayScore: number }> = {
  A1: { homeScore: 2, awayScore: 0 }, // MEX 2-0 RSA
  A2: { homeScore: 1, awayScore: 1 }, // KOR 1-1 CZE
  B1: { homeScore: 3, awayScore: 1 }, // CAN 3-1 BIH
  B2: { homeScore: 0, awayScore: 2 }, // QAT 0-2 SUI
  C1: { homeScore: 4, awayScore: 0 }, // BRA 4-0 MAR
  C2: { homeScore: 0, awayScore: 2 }, // HAI 0-2 SCO
  D1: { homeScore: 1, awayScore: 0 }, // USA 1-0 PAR
  D2: { homeScore: 0, awayScore: 2 }, // AUS 0-2 TUR
  E1: { homeScore: 3, awayScore: 0 }, // GER 3-0 CUW
  E2: { homeScore: 1, awayScore: 1 }, // CIV 1-1 ECU
  F1: { homeScore: 3, awayScore: 0 }, // NED 3-0 TUN
  F2: { homeScore: 2, awayScore: 1 }, // JPN 2-1 SWE
  G1: { homeScore: 2, awayScore: 0 }, // BEL 2-0 EGY
  G2: { homeScore: 1, awayScore: 0 }, // IRN 1-0 NZL
  H1: { homeScore: 3, awayScore: 0 }, // ESP 3-0 CPV
  H2: { homeScore: 0, awayScore: 2 }, // KSA 0-2 URU
};
