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
  { id: 'A3', homeTeamId: 'MEX', awayTeamId: 'KOR', date: '2026-06-18T22:00:00Z', venue: 'Estadio Azteca',    city: 'Mexico City', stage: 'group', group: 'A', matchday: 2 },
  { id: 'A4', homeTeamId: 'CZE', awayTeamId: 'RSA', date: '2026-06-19T01:00:00Z', venue: 'Estadio Akron',     city: 'Zapopan',     stage: 'group', group: 'A', matchday: 2 },
  { id: 'A5', homeTeamId: 'CZE', awayTeamId: 'MEX', date: '2026-06-24T22:00:00Z', venue: 'Estadio Akron',     city: 'Zapopan',     stage: 'group', group: 'A', matchday: 3 },
  { id: 'A6', homeTeamId: 'RSA', awayTeamId: 'KOR', date: '2026-06-24T22:00:00Z', venue: 'Estadio Azteca',    city: 'Mexico City', stage: 'group', group: 'A', matchday: 3 },
  // ── Group B ──────────────────────────────────
  { id: 'B1', homeTeamId: 'CAN', awayTeamId: 'BIH', date: '2026-06-12T23:00:00Z', venue: 'BMO Field',          city: 'Toronto',      stage: 'group', group: 'B', matchday: 1 },
  { id: 'B2', homeTeamId: 'QAT', awayTeamId: 'SUI', date: '2026-06-13T20:00:00Z', venue: 'Levi\'s Stadium',   city: 'Santa Clara',  stage: 'group', group: 'B', matchday: 1 },
  { id: 'B3', homeTeamId: 'SUI', awayTeamId: 'BIH', date: '2026-06-18T20:00:00Z', venue: 'BMO Field',          city: 'Toronto',      stage: 'group', group: 'B', matchday: 2 },
  { id: 'B4', homeTeamId: 'CAN', awayTeamId: 'QAT', date: '2026-06-18T23:00:00Z', venue: 'Levi\'s Stadium',   city: 'Santa Clara',  stage: 'group', group: 'B', matchday: 2 },
  { id: 'B5', homeTeamId: 'BIH', awayTeamId: 'QAT', date: '2026-06-24T20:00:00Z', venue: 'BMO Field',          city: 'Toronto',      stage: 'group', group: 'B', matchday: 3 },
  { id: 'B6', homeTeamId: 'SUI', awayTeamId: 'CAN', date: '2026-06-24T23:00:00Z', venue: 'Levi\'s Stadium',   city: 'Santa Clara',  stage: 'group', group: 'B', matchday: 3 },
  // ── Group C ──────────────────────────────────
  { id: 'C1', homeTeamId: 'BRA', awayTeamId: 'MAR', date: '2026-06-13T22:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'C', matchday: 1 },
  { id: 'C2', homeTeamId: 'HAI', awayTeamId: 'SCO', date: '2026-06-14T01:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'C', matchday: 1 },
  { id: 'C3', homeTeamId: 'SCO', awayTeamId: 'MAR', date: '2026-06-19T22:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'C', matchday: 2 },
  { id: 'C4', homeTeamId: 'BRA', awayTeamId: 'HAI', date: '2026-06-20T01:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'C', matchday: 2 },
  { id: 'C5', homeTeamId: 'MAR', awayTeamId: 'HAI', date: '2026-06-24T20:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'C', matchday: 3 },
  { id: 'C6', homeTeamId: 'SCO', awayTeamId: 'BRA', date: '2026-06-24T23:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'C', matchday: 3 },
  // ── Group D ──────────────────────────────────
  { id: 'D1', homeTeamId: 'USA', awayTeamId: 'PAR', date: '2026-06-12T22:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'D', matchday: 1 },
  { id: 'D2', homeTeamId: 'AUS', awayTeamId: 'TUR', date: '2026-06-14T04:00:00Z', venue: 'BC Place',           city: 'Vancouver',    stage: 'group', group: 'D', matchday: 1 },
  { id: 'D3', homeTeamId: 'USA', awayTeamId: 'AUS', date: '2026-06-19T20:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'D', matchday: 2 },
  { id: 'D4', homeTeamId: 'TUR', awayTeamId: 'PAR', date: '2026-06-20T00:00:00Z', venue: 'BC Place',           city: 'Vancouver',    stage: 'group', group: 'D', matchday: 2 },
  { id: 'D5', homeTeamId: 'PAR', awayTeamId: 'AUS', date: '2026-06-26T02:00:00Z', venue: 'BC Place',           city: 'Vancouver',    stage: 'group', group: 'D', matchday: 3 },
  { id: 'D6', homeTeamId: 'TUR', awayTeamId: 'USA', date: '2026-06-26T02:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'D', matchday: 3 },
  // ── Group E ──────────────────────────────────
  { id: 'E1', homeTeamId: 'GER', awayTeamId: 'CUW', date: '2026-06-14T22:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'E', matchday: 1 },
  { id: 'E2', homeTeamId: 'CIV', awayTeamId: 'ECU', date: '2026-06-15T01:00:00Z', venue: 'NRG Stadium',        city: 'Houston',      stage: 'group', group: 'E', matchday: 1 },
  { id: 'E3', homeTeamId: 'GER', awayTeamId: 'CIV', date: '2026-06-20T20:00:00Z', venue: 'NRG Stadium',        city: 'Houston',      stage: 'group', group: 'E', matchday: 2 },
  { id: 'E4', homeTeamId: 'ECU', awayTeamId: 'CUW', date: '2026-06-21T23:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'E', matchday: 2 },
  { id: 'E5', homeTeamId: 'CUW', awayTeamId: 'CIV', date: '2026-06-25T20:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'E', matchday: 3 },
  { id: 'E6', homeTeamId: 'ECU', awayTeamId: 'GER', date: '2026-06-25T20:00:00Z', venue: 'NRG Stadium',        city: 'Houston',      stage: 'group', group: 'E', matchday: 3 },
  // ── Group F ──────────────────────────────────
  { id: 'F1', homeTeamId: 'TUN', awayTeamId: 'NED', date: '2026-06-25T23:00:00Z', venue: 'Arrowhead Stadium',  city: 'Kansas City',  stage: 'group', group: 'F', matchday: 3 },
  { id: 'F2', homeTeamId: 'JPN', awayTeamId: 'SWE', date: '2026-06-25T23:00:00Z', venue: 'Lumen Field',        city: 'Seattle',      stage: 'group', group: 'F', matchday: 3 },
  { id: 'F3', homeTeamId: 'NED', awayTeamId: 'JPN', date: '2026-06-14T18:00:00Z', venue: 'Lumen Field',        city: 'Seattle',      stage: 'group', group: 'F', matchday: 1 },
  { id: 'F4', homeTeamId: 'SWE', awayTeamId: 'TUN', date: '2026-06-14T21:00:00Z', venue: 'Arrowhead Stadium',  city: 'Kansas City',  stage: 'group', group: 'F', matchday: 1 },
  { id: 'F5', homeTeamId: 'NED', awayTeamId: 'SWE', date: '2026-06-20T23:00:00Z', venue: 'Arrowhead Stadium',  city: 'Kansas City',  stage: 'group', group: 'F', matchday: 2 },
  { id: 'F6', homeTeamId: 'TUN', awayTeamId: 'JPN', date: '2026-06-21T23:00:00Z', venue: 'Lumen Field',        city: 'Seattle',      stage: 'group', group: 'F', matchday: 2 },
  // ── Group G ──────────────────────────────────
  { id: 'G1', homeTeamId: 'BEL', awayTeamId: 'EGY', date: '2026-06-15T22:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'group', group: 'G', matchday: 1 },
  { id: 'G2', homeTeamId: 'IRN', awayTeamId: 'NZL', date: '2026-06-16T01:00:00Z', venue: 'Levi\'s Stadium',         city: 'Santa Clara',  stage: 'group', group: 'G', matchday: 1 },
  { id: 'G3', homeTeamId: 'BEL', awayTeamId: 'IRN', date: '2026-06-21T22:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'group', group: 'G', matchday: 2 },
  { id: 'G4', homeTeamId: 'NZL', awayTeamId: 'EGY', date: '2026-06-22T01:00:00Z', venue: 'Levi\'s Stadium',         city: 'Santa Clara',  stage: 'group', group: 'G', matchday: 2 },
  { id: 'G5', homeTeamId: 'EGY', awayTeamId: 'IRN', date: '2026-06-26T22:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', stage: 'group', group: 'G', matchday: 3 },
  { id: 'G6', homeTeamId: 'NZL', awayTeamId: 'BEL', date: '2026-06-26T22:00:00Z', venue: 'Levi\'s Stadium',         city: 'Santa Clara',  stage: 'group', group: 'G', matchday: 3 },
  // ── Group H ──────────────────────────────────
  { id: 'H1', homeTeamId: 'ESP', awayTeamId: 'CPV', date: '2026-06-15T18:00:00Z', venue: 'Rose Bowl',          city: 'Pasadena',     stage: 'group', group: 'H', matchday: 1 },
  { id: 'H2', homeTeamId: 'KSA', awayTeamId: 'URU', date: '2026-06-16T00:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami',        stage: 'group', group: 'H', matchday: 1 },
  { id: 'H3', homeTeamId: 'ESP', awayTeamId: 'KSA', date: '2026-06-21T20:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami',        stage: 'group', group: 'H', matchday: 2 },
  { id: 'H4', homeTeamId: 'URU', awayTeamId: 'CPV', date: '2026-06-22T00:00:00Z', venue: 'Rose Bowl',          city: 'Pasadena',     stage: 'group', group: 'H', matchday: 2 },
  { id: 'H5', homeTeamId: 'CPV', awayTeamId: 'KSA', date: '2026-06-26T20:00:00Z', venue: 'Rose Bowl',          city: 'Pasadena',     stage: 'group', group: 'H', matchday: 3 },
  { id: 'H6', homeTeamId: 'URU', awayTeamId: 'ESP', date: '2026-06-26T23:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami',        stage: 'group', group: 'H', matchday: 3 },
  // ── Group I ──────────────────────────────────
  { id: 'I1', homeTeamId: 'FRA', awayTeamId: 'SEN', date: '2026-06-16T22:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       stage: 'group', group: 'I', matchday: 1 },
  { id: 'I2', homeTeamId: 'IRQ', awayTeamId: 'NOR', date: '2026-06-17T01:00:00Z', venue: 'Geodis Park',            city: 'Nashville',     stage: 'group', group: 'I', matchday: 1 },
  { id: 'I3', homeTeamId: 'FRA', awayTeamId: 'IRQ', date: '2026-06-22T22:00:00Z', venue: 'Geodis Park',            city: 'Nashville',     stage: 'group', group: 'I', matchday: 2 },
  { id: 'I4', homeTeamId: 'NOR', awayTeamId: 'SEN', date: '2026-06-23T01:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       stage: 'group', group: 'I', matchday: 2 },
  { id: 'I5', homeTeamId: 'NOR', awayTeamId: 'FRA', date: '2026-06-26T20:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta',       stage: 'group', group: 'I', matchday: 3 },
  { id: 'I6', homeTeamId: 'SEN', awayTeamId: 'IRQ', date: '2026-06-26T23:00:00Z', venue: 'Geodis Park',            city: 'Nashville',     stage: 'group', group: 'I', matchday: 3 },
  // ── Group J ──────────────────────────────────
  { id: 'J1', homeTeamId: 'ARG', awayTeamId: 'ALG', date: '2026-06-16T18:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'J', matchday: 1 },
  { id: 'J2', homeTeamId: 'AUT', awayTeamId: 'JOR', date: '2026-06-17T00:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'J', matchday: 1 },
  { id: 'J3', homeTeamId: 'ARG', awayTeamId: 'AUT', date: '2026-06-22T20:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'J', matchday: 2 },
  { id: 'J4', homeTeamId: 'JOR', awayTeamId: 'ALG', date: '2026-06-23T00:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'J', matchday: 2 },
  { id: 'J5', homeTeamId: 'ALG', awayTeamId: 'AUT', date: '2026-06-27T20:00:00Z', venue: 'MetLife Stadium',    city: 'East Rutherford', stage: 'group', group: 'J', matchday: 3 },
  { id: 'J6', homeTeamId: 'JOR', awayTeamId: 'ARG', date: '2026-06-27T23:00:00Z', venue: 'Gillette Stadium',   city: 'Foxborough',      stage: 'group', group: 'J', matchday: 3 },
  // ── Group K ──────────────────────────────────
  { id: 'K1', homeTeamId: 'POR', awayTeamId: 'COD', date: '2026-06-17T22:00:00Z', venue: 'Estadio BBVA',       city: 'Monterrey',    stage: 'group', group: 'K', matchday: 1 },
  { id: 'K2', homeTeamId: 'UZB', awayTeamId: 'COL', date: '2026-06-18T01:00:00Z', venue: 'Estadio Azteca',     city: 'Mexico City',  stage: 'group', group: 'K', matchday: 1 },
  { id: 'K3', homeTeamId: 'POR', awayTeamId: 'UZB', date: '2026-06-23T22:00:00Z', venue: 'Estadio Azteca',     city: 'Mexico City',  stage: 'group', group: 'K', matchday: 2 },
  { id: 'K4', homeTeamId: 'COL', awayTeamId: 'COD', date: '2026-06-24T01:00:00Z', venue: 'Estadio BBVA',       city: 'Monterrey',    stage: 'group', group: 'K', matchday: 2 },
  { id: 'K5', homeTeamId: 'COL', awayTeamId: 'POR', date: '2026-06-27T22:00:00Z', venue: 'Estadio BBVA',       city: 'Monterrey',    stage: 'group', group: 'K', matchday: 3 },
  { id: 'K6', homeTeamId: 'COD', awayTeamId: 'UZB', date: '2026-06-27T22:00:00Z', venue: 'Estadio Azteca',     city: 'Mexico City',  stage: 'group', group: 'K', matchday: 3 },
  // ── Group L ──────────────────────────────────
  { id: 'L1', homeTeamId: 'ENG', awayTeamId: 'CRO', date: '2026-06-17T18:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'L', matchday: 1 },
  { id: 'L2', homeTeamId: 'GHA', awayTeamId: 'PAN', date: '2026-06-18T00:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'L', matchday: 1 },
  { id: 'L3', homeTeamId: 'ENG', awayTeamId: 'GHA', date: '2026-06-23T20:00:00Z', venue: 'AT&T Stadium',       city: 'Arlington',    stage: 'group', group: 'L', matchday: 2 },
  { id: 'L4', homeTeamId: 'PAN', awayTeamId: 'CRO', date: '2026-06-24T00:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'L', matchday: 2 },
  { id: 'L5', homeTeamId: 'PAN', awayTeamId: 'ENG', date: '2026-06-27T21:00:00Z', venue: 'SoFi Stadium',       city: 'Inglewood',    stage: 'group', group: 'L', matchday: 3 },
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

// Real results sourced from ESPN — updated Jun 18 2026
export const DEMO_RESULTS: Record<string, { homeScore: number; awayScore: number }> = {
  A1: { homeScore: 2, awayScore: 0 }, // MEX 2-0 RSA  ✓ ESPN Jun 11
  A2: { homeScore: 2, awayScore: 1 }, // KOR 2-1 CZE  ✓ ESPN Jun 11
  B1: { homeScore: 1, awayScore: 1 }, // CAN 1-1 BIH    ESPN Jun 12
  B2: { homeScore: 1, awayScore: 1 }, // QAT 1-1 SUI    ESPN Jun 13
  C1: { homeScore: 1, awayScore: 1 }, // BRA 1-1 MAR    ESPN Jun 13
  C2: { homeScore: 0, awayScore: 1 }, // HAI 0-1 SCO    ESPN Jun 13
  D1: { homeScore: 4, awayScore: 1 }, // USA 4-1 PAR    ESPN Jun 12
  D2: { homeScore: 2, awayScore: 0 }, // AUS 2-0 TUR    ESPN Jun 14
  E1: { homeScore: 7, awayScore: 1 }, // GER 7-1 CUW    ESPN Jun 14
  E2: { homeScore: 1, awayScore: 0 }, // CIV 1-0 ECU    ESPN Jun 14
  F3: { homeScore: 2, awayScore: 2 }, // NED 2-2 JPN    ESPN Jun 14
  F4: { homeScore: 5, awayScore: 1 }, // SWE 5-1 TUN  ✓ ESPN Jun 14
  G1: { homeScore: 1, awayScore: 1 }, // BEL 1-1 EGY    ESPN Jun 15
  G2: { homeScore: 2, awayScore: 2 }, // IRN 2-2 NZL    ESPN Jun 15
  H1: { homeScore: 0, awayScore: 0 }, // ESP 0-0 CPV    ESPN Jun 15
  H2: { homeScore: 1, awayScore: 1 }, // KSA 1-1 URU    ESPN Jun 15
  I1: { homeScore: 3, awayScore: 1 }, // FRA 3-1 SEN    ESPN Jun 16
  J1: { homeScore: 3, awayScore: 0 }, // ARG 3-0 ALG    ESPN Jun 16
  K1: { homeScore: 1, awayScore: 1 }, // POR 1-1 COD    ESPN Jun 17
  L1: { homeScore: 4, awayScore: 2 }, // ENG 4-2 CRO    ESPN Jun 17
  I2: { homeScore: 1, awayScore: 4 }, // IRQ 1-4 NOR    ESPN Jun 16
  J2: { homeScore: 3, awayScore: 1 }, // AUT 3-1 JOR    ESPN Jun 17
  K2: { homeScore: 1, awayScore: 3 }, // UZB 1-3 COL    ESPN Jun 18
  L2: { homeScore: 1, awayScore: 0 }, // GHA 1-0 PAN    ESPN Jun 18
  // MD2 results (Jun 18-23)
  A3: { homeScore: 1, awayScore: 0 }, // MEX 1-0 KOR    ESPN Jun 18
  A4: { homeScore: 1, awayScore: 1 }, // CZE 1-1 RSA    ESPN Jun 18
  B3: { homeScore: 4, awayScore: 1 }, // SUI 4-1 BIH    ESPN Jun 18
  B4: { homeScore: 6, awayScore: 0 }, // CAN 6-0 QAT    ESPN Jun 18
  C3: { homeScore: 0, awayScore: 1 }, // SCO 0-1 MAR    ESPN Jun 19
  C4: { homeScore: 3, awayScore: 0 }, // BRA 3-0 HAI    ESPN Jun 19
  D3: { homeScore: 2, awayScore: 0 }, // USA 2-0 AUS    ESPN Jun 19
  D4: { homeScore: 0, awayScore: 1 }, // TUR 0-1 PAR    ESPN Jun 19
  E3: { homeScore: 2, awayScore: 1 }, // GER 2-1 CIV    ESPN Jun 20
  E4: { homeScore: 0, awayScore: 0 }, // ECU 0-0 CUW    ESPN Jun 21
  F5: { homeScore: 5, awayScore: 1 }, // NED 5-1 SWE    ESPN Jun 20
  F6: { homeScore: 0, awayScore: 4 }, // TUN 0-4 JPN    ESPN Jun 21
  G3: { homeScore: 0, awayScore: 0 }, // BEL 0-0 IRN    ESPN Jun 21
  G4: { homeScore: 1, awayScore: 3 }, // NZL 1-3 EGY    ESPN Jun 21
  H3: { homeScore: 4, awayScore: 0 }, // ESP 4-0 KSA    ESPN Jun 21
  H4: { homeScore: 2, awayScore: 2 }, // URU 2-2 CPV    ESPN Jun 21
  I3: { homeScore: 3, awayScore: 0 }, // FRA 3-0 IRQ    ESPN Jun 22
  I4: { homeScore: 3, awayScore: 2 }, // NOR 3-2 SEN    ESPN Jun 22
  J3: { homeScore: 2, awayScore: 0 }, // ARG 2-0 AUT    ESPN Jun 22
  J4: { homeScore: 1, awayScore: 2 }, // JOR 1-2 ALG    ESPN Jun 22
  K3: { homeScore: 5, awayScore: 0 }, // POR 5-0 UZB    ESPN Jun 23
  K4: { homeScore: 1, awayScore: 0 }, // COL 1-0 COD    ESPN Jun 23
  L3: { homeScore: 0, awayScore: 0 }, // ENG 0-0 GHA    ESPN Jun 23
  L4: { homeScore: 0, awayScore: 1 }, // PAN 0-1 CRO    ESPN Jun 23
  // MD3 already played (Jun 24)
  A5: { homeScore: 0, awayScore: 3 }, // CZE 0-3 MEX    ESPN Jun 24
  A6: { homeScore: 1, awayScore: 0 }, // RSA 1-0 KOR    ESPN Jun 24
  B5: { homeScore: 3, awayScore: 1 }, // BIH 3-1 QAT    ESPN Jun 24
  B6: { homeScore: 2, awayScore: 1 }, // SUI 2-1 CAN    ESPN Jun 24
  C5: { homeScore: 4, awayScore: 2 }, // MAR 4-2 HAI    ESPN Jun 24
  C6: { homeScore: 0, awayScore: 3 }, // SCO 0-3 BRA    ESPN Jun 24
};
