import { notFound } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types';
import { MATCH_MAP, TEAM_MAP, DEMO_RESULTS } from '@/lib/world-cup-data';

async function getUser(id: string): Promise<User | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/users/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card px-4 py-3 text-center">
      <p className="text-2xl font-black text-wc-gold">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

  const predictionsWithMatch = user.predictions
    .map((p) => {
      const match = MATCH_MAP.get(p.matchId);
      if (!match) return null;
      const home = TEAM_MAP.get(match.homeTeamId);
      const away = TEAM_MAP.get(match.awayTeamId);
      const result = DEMO_RESULTS[p.matchId];
      const actualWinner = result
        ? result.homeScore > result.awayScore
          ? match.homeTeamId
          : result.homeScore < result.awayScore
          ? match.awayTeamId
          : 'draw'
        : null;
      const correct = actualWinner !== null ? p.predictedWinner === actualWinner : null;
      return { p, match, home, away, result, actualWinner, correct };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a!.match.date).getTime() - new Date(b!.match.date).getTime());

  const played = predictionsWithMatch.filter((x) => x!.result);
  const notYetPlayed = predictionsWithMatch.filter((x) => !x!.result);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <span className="text-6xl">{user.avatar}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black text-slate-900">{user.username}</h1>
              {user.isReal ? (
                <span className="pill bg-green-100 text-green-700 border border-green-200">LIVE — Walrus Memory</span>
              ) : (
                <span className="pill bg-slate-100 text-slate-500 border border-slate-200">Simulated</span>
              )}
            </div>
            {user.favoriteTeam && (
              <p className="text-slate-500 mt-1">
                {TEAM_MAP.get(user.favoriteTeam)?.flag} Supports {TEAM_MAP.get(user.favoriteTeam)?.name ?? user.favoriteTeam}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {' · '}Namespace: <code className="text-blue-600">{user.memwalNamespace}</code>
            </p>
            {user.detectedBiases && user.detectedBiases.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {user.detectedBiases.map((b) => (
                  <span key={b} className="pill bg-amber-100 text-amber-700 border border-amber-200">⚠ {b}</span>
                ))}
              </div>
            )}
          </div>
          <Link
            href={`/predict?userId=${user.id}&username=${encodeURIComponent(user.username)}`}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            Chat with agent
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Points" value={user.stats.points} />
        <StatCard label="Correct Winners" value={`${user.stats.correctWinners}/${user.stats.totalPredictions}`} />
        <StatCard label="Exact Scores" value={user.stats.exactScores} />
        <StatCard label="Accuracy" value={`${(user.stats.winnerAccuracy * 100).toFixed(0)}%`} sub={played.length > 0 ? `${played.length} played` : 'no results yet'} />
      </div>

      {/* MemWal Query Box */}
      <div className="card p-4 border-blue-200 bg-blue-50">
        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
          <span>🦭</span> Query {user.username}'s Walrus Memory
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          All predictions and opinions are stored encrypted on Walrus. Use the{' '}
          <Link href="/users" className="text-blue-600 hover:underline">Users page</Link> to run semantic queries against this profile.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
            <p className="font-semibold text-slate-700 mb-1">Namespace</p>
            <code className="text-blue-600">{user.memwalNamespace}</code>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
            <p className="font-semibold text-slate-700 mb-1">Memories</p>
            <code className="text-blue-600">{user.stats.totalPredictions} predictions stored</code>
          </div>
        </div>
      </div>

      {/* Predictions list */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">
          Predictions <span className="text-slate-400 font-normal text-base">({user.predictions.length})</span>
        </h2>

        {/* Played matches */}
        {played.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Results in</p>
            {played.map((item) => {
              const { p, match, home, away, result, correct } = item!;
              const predictedTeam = p.predictedWinner === 'draw' ? null : TEAM_MAP.get(p.predictedWinner);
              return (
                <div
                  key={p.id}
                  className={`card flex items-center gap-3 px-4 py-3 border-l-4 ${correct === true ? 'border-l-green-500' : correct === false ? 'border-l-red-400' : 'border-l-slate-200'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700">
                      {home?.flag} {home?.name} vs {away?.name} {away?.flag}
                      <span className="ml-2 text-xs text-slate-400">Group {match.group} MD{match.matchday}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs flex-wrap">
                      <span className="text-slate-500">
                        Predicted: <strong className="text-slate-800">
                          {p.predictedWinner === 'draw' ? '🤝 Draw' : `${predictedTeam?.flag} ${predictedTeam?.name ?? p.predictedWinner}`}
                        </strong>
                        {p.predictedHomeScore !== undefined && ` (${p.predictedHomeScore}–${p.predictedAwayScore})`}
                      </span>
                      <span className="text-slate-400">Conf: {p.confidence}/5</span>
                    </div>
                    {p.opinion && <p className="text-xs text-slate-400 mt-1 italic">"{p.opinion}"</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {result && (
                      <p className="font-black text-slate-900 text-sm">{result.homeScore}–{result.awayScore}</p>
                    )}
                    <p className={`text-xs mt-0.5 font-semibold ${correct ? 'text-green-600' : 'text-red-500'}`}>
                      {correct ? `+${p.pointsEarned ?? 3} pts ✓` : '✗'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upcoming predictions */}
        {notYetPlayed.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Upcoming</p>
            {notYetPlayed.slice(0, 12).map((item) => {
              const { p, match, home, away } = item!;
              const predictedTeam = p.predictedWinner === 'draw' ? null : TEAM_MAP.get(p.predictedWinner);
              return (
                <div key={p.id} className="card flex items-center gap-3 px-4 py-3 opacity-70">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600">
                      {home?.flag} {home?.name} vs {away?.name} {away?.flag}
                      <span className="ml-2 text-xs text-slate-400">
                        {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · Group {match.group}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Pick: <strong className="text-slate-700">
                        {p.predictedWinner === 'draw' ? '🤝 Draw' : `${predictedTeam?.flag} ${predictedTeam?.name ?? p.predictedWinner}`}
                      </strong>
                      {p.predictedHomeScore !== undefined && ` (${p.predictedHomeScore}–${p.predictedAwayScore})`}
                      {' · '}Conf: {p.confidence}/5
                    </p>
                  </div>
                  <span className="text-xs text-slate-300">Pending</span>
                </div>
              );
            })}
            {notYetPlayed.length > 12 && (
              <p className="text-xs text-slate-400 text-center py-2">
                + {notYetPlayed.length - 12} more upcoming predictions
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
