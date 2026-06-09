import Link from 'next/link';
import { ALL_GROUPS, TEAM_MAP, getGroupTeams, getGroupMatches, DEMO_RESULTS } from '@/lib/world-cup-data';
import { Group } from '@/types';
import { TeamSticker } from '@/components/team-sticker';

function GroupCard({ group }: { group: Group }) {
  const teams = getGroupTeams(group);
  const matches = getGroupMatches(group);

  const standings = new Map(
    teams.map((t) => [t.id, { teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 }])
  );

  for (const m of matches) {
    const res = DEMO_RESULTS[m.id];
    if (!res) continue;
    const h = standings.get(m.homeTeamId);
    const a = standings.get(m.awayTeamId);
    if (!h || !a) continue;
    h.played++; a.played++;
    h.gf += res.homeScore; h.ga += res.awayScore;
    a.gf += res.awayScore; a.ga += res.homeScore;
    if (res.homeScore > res.awayScore)      { h.won++; h.pts += 3; a.lost++; }
    else if (res.homeScore < res.awayScore) { a.won++; a.pts += 3; h.lost++; }
    else                                    { h.drawn++; h.pts++; a.drawn++; a.pts++; }
  }

  const sorted = [...standings.values()].sort(
    (a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
  );

  const playedMatches = matches.filter((m) => DEMO_RESULTS[m.id]);

  return (
    <div className="card overflow-hidden hover:border-blue-800/40 transition-colors">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-950/50 to-transparent border-b border-wc-border flex items-center justify-between">
        <h3 className="font-black text-wc-gold text-lg">Group {group}</h3>
        <span className="text-xs text-gray-600">{playedMatches.length}/{matches.length}</span>
      </div>

      {/* Sticker row */}
      <div className="flex items-center justify-around px-3 pt-3 pb-1">
        {teams.map((t) => (
          <TeamSticker key={t.id} teamId={t.id} size="md" tilt showName />
        ))}
      </div>

      {/* Standings */}
      <div className="px-3 py-2">
        <div className="grid grid-cols-[1fr_20px_20px_20px_20px_28px] gap-1 text-[10px] text-gray-600 px-1 mb-1 font-bold uppercase">
          <span>Team</span>
          <span className="text-center">P</span>
          <span className="text-center">W</span>
          <span className="text-center">D</span>
          <span className="text-center">L</span>
          <span className="text-center">Pts</span>
        </div>
        {sorted.map((s, i) => {
          const team = TEAM_MAP.get(s.teamId);
          const advancing = i < 2;
          return (
            <div
              key={s.teamId}
              className={`grid grid-cols-[1fr_20px_20px_20px_20px_28px] gap-1 items-center text-xs px-1 py-1.5 rounded ${advancing ? 'bg-green-950/30' : ''}`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {advancing && <span className="w-0.5 h-3.5 bg-green-500 rounded-full flex-shrink-0" />}
                <span className="text-sm">{team?.flag}</span>
                <span className={`truncate font-medium ${advancing ? 'text-white' : 'text-gray-400'}`}>{team?.code}</span>
              </div>
              <span className="text-center text-gray-500">{s.played}</span>
              <span className="text-center text-gray-300">{s.won}</span>
              <span className="text-center text-gray-400">{s.drawn}</span>
              <span className="text-center text-gray-400">{s.lost}</span>
              <span className="text-center font-black text-wc-gold">{s.pts}</span>
            </div>
          );
        })}
      </div>

      {/* Results */}
      {playedMatches.length > 0 && (
        <div className="border-t border-wc-border px-3 py-2 space-y-1">
          {playedMatches.map((m) => {
            const home = TEAM_MAP.get(m.homeTeamId);
            const away = TEAM_MAP.get(m.awayTeamId);
            const res = DEMO_RESULTS[m.id];
            return (
              <div key={m.id} className="flex items-center text-xs gap-1">
                <span className="flex-1 text-gray-500 truncate">{home?.flag} {home?.code}</span>
                <span className="font-black text-white tabular-nums px-1">{res.homeScore}–{res.awayScore}</span>
                <span className="flex-1 text-right text-gray-500 truncate">{away?.code} {away?.flag}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-white">Group Stage</h1>
          <p className="text-gray-500 text-sm mt-0.5">48 teams · 12 groups · June 11–27, 2026</p>
        </div>
        <div className="flex gap-3 text-xs text-gray-500 items-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Advances to Round of 32
          </span>
          <Link href="/predict" className="rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold text-xs hover:bg-blue-500 transition-colors">
            Make Predictions →
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ALL_GROUPS.map((g) => <GroupCard key={g} group={g} />)}
      </div>

      <div className="card p-4 text-sm text-gray-400 bg-blue-950/10 border-blue-800/20">
        <strong className="text-white">Format:</strong> Top 2 from each group + 8 best 3rd-place teams → Round of 32 (40 teams total). 72 group stage matches across USA, Canada, and Mexico.
      </div>
    </div>
  );
}
