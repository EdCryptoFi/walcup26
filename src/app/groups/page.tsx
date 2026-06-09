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
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-transparent border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-black text-wc-gold text-xl">Group {group}</h3>
        <span className="text-xs text-slate-400">{playedMatches.length}/{matches.length} played</span>
      </div>

      {/* Sticker row — larger with 2-col layout */}
      <div className="flex items-end justify-around px-4 pt-5 pb-3 gap-2">
        {teams.map((t) => (
          <TeamSticker key={t.id} teamId={t.id} size="lg" tilt showName />
        ))}
      </div>

      {/* Standings */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-[1fr_24px_24px_24px_24px_32px] gap-1 text-[11px] text-slate-400 px-1 mb-1.5 font-bold uppercase">
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
              className={`grid grid-cols-[1fr_24px_24px_24px_24px_32px] gap-1 items-center text-sm px-1 py-2 rounded-lg ${advancing ? 'bg-green-50' : ''}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {advancing && <span className="w-1 h-4 bg-green-500 rounded-full flex-shrink-0" />}
                <span className="text-base">{team?.flag}</span>
                <span className={`truncate font-semibold ${advancing ? 'text-slate-900' : 'text-slate-500'}`}>{team?.code}</span>
              </div>
              <span className="text-center text-slate-400">{s.played}</span>
              <span className="text-center text-slate-700">{s.won}</span>
              <span className="text-center text-slate-500">{s.drawn}</span>
              <span className="text-center text-slate-500">{s.lost}</span>
              <span className="text-center font-black text-wc-gold text-base">{s.pts}</span>
            </div>
          );
        })}
      </div>

      {/* Results */}
      {playedMatches.length > 0 && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-1.5">
          {playedMatches.map((m) => {
            const home = TEAM_MAP.get(m.homeTeamId);
            const away = TEAM_MAP.get(m.awayTeamId);
            const res = DEMO_RESULTS[m.id];
            return (
              <div key={m.id} className="flex items-center text-sm gap-2 bg-slate-50 rounded-lg px-2 py-1.5">
                <span className="flex-1 text-slate-500 truncate">{home?.flag} {home?.code}</span>
                <span className="font-black text-slate-900 tabular-nums px-2">{res.homeScore}–{res.awayScore}</span>
                <span className="flex-1 text-right text-slate-500 truncate">{away?.code} {away?.flag}</span>
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
          <h1 className="text-3xl font-black text-slate-900">Group Stage</h1>
          <p className="text-slate-500 text-sm mt-0.5">48 teams · 12 groups · June 11–27, 2026</p>
        </div>
        <div className="flex gap-3 text-xs text-slate-500 items-center">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Advances to Round of 32
          </span>
          <Link href="/predict" className="rounded-lg bg-blue-700 px-4 py-2 text-white font-semibold text-xs hover:bg-blue-800 transition-colors">
            Make Predictions →
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {ALL_GROUPS.map((g) => <GroupCard key={g} group={g} />)}
      </div>

      <div className="card p-4 text-sm text-slate-500 bg-blue-50 border-blue-200">
        <strong className="text-slate-900">Format:</strong> Top 2 from each group + 8 best 3rd-place teams → Round of 32 (40 teams total). 72 group stage matches across USA, Canada, and Mexico.
      </div>
    </div>
  );
}
