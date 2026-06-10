import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MATCH_MAP, TEAM_MAP, DEMO_RESULTS } from '@/lib/world-cup-data';
import { getUserById } from '@/lib/users-data';
import { MemoryDepth } from '@/components/memory-depth';

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="sticker-card sticker-tilt-1 rounded-xl px-4 py-3 text-center">
      <p className="text-2xl font-black text-secondary">{value}</p>
      <p className="text-xs text-on-surface-variant mt-0.5">{label}</p>
      {sub && <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>}
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(id);
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
  const walrusMemories = user.predictions.filter((p) => !!p.memwalBlobId);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="sticker-card sticker-tilt-1 peel-corner rounded-2xl p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <span className="text-6xl">{user.avatar}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black text-on-surface">{user.username}</h1>
              {user.isReal ? (
                <span className="pill bg-tertiary text-on-tertiary">LIVE — Walrus Memory</span>
              ) : (
                <span className="pill bg-surface-container text-on-surface-variant">🤖 Bot · MemWal Test</span>
              )}
            </div>
            {user.favoriteTeam && (
              <p className="text-on-surface-variant mt-1">
                {TEAM_MAP.get(user.favoriteTeam)?.flag} Supports {TEAM_MAP.get(user.favoriteTeam)?.name ?? user.favoriteTeam}
              </p>
            )}
            <p className="text-xs text-on-surface-variant mt-1">
              Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {' · '}Namespace: <code className="text-primary">{user.memwalNamespace}</code>
            </p>
            {user.detectedBiases && user.detectedBiases.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {user.detectedBiases.map((b) => (
                  <span key={b} className="pill bg-secondary-container text-on-secondary-container">⚠ {b}</span>
                ))}
              </div>
            )}
          </div>
          <Link
            href={`/predict?userId=${user.id}&username=${encodeURIComponent(user.username)}`}
            className="self-start bg-primary text-white rounded-full px-4 py-2 text-sm font-bold hover:scale-105 transition-all"
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

      {/* MemWal Info */}
      <div className="sticker-card sticker-tilt-3 rounded-2xl p-5">
        <h3 className="font-bold text-on-surface mb-2 flex items-center gap-2">
          <span>🦭</span> {user.username}&apos;s Walrus Memory
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="rounded-lg bg-white border border-outline-variant px-3 py-2">
            <p className="text-on-surface-variant mb-0.5">Namespace</p>
            <code className="text-primary">{user.memwalNamespace}</code>
          </div>
          <div className="rounded-lg bg-white border border-outline-variant px-3 py-2">
            <p className="text-on-surface-variant mb-0.5">Memory Depth</p>
            <MemoryDepth userId={user.id} isReal={user.isReal} localCount={walrusMemories.length} />
          </div>
        </div>
        {walrusMemories.length > 0 && (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">Walrus Blobs</p>
            {walrusMemories.map((p) => {
              const match = MATCH_MAP.get(p.matchId);
              const homeName = match ? TEAM_MAP.get(match.homeTeamId)?.code : '?';
              const awayName = match ? TEAM_MAP.get(match.awayTeamId)?.code : '?';
              return (
                <a
                  key={p.id}
                  href={`https://walruscan.com/blob/${p.memwalBlobId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] font-mono text-primary hover:underline"
                >
                  <span className="text-on-surface-variant">{homeName} vs {awayName}</span>
                  <span className="truncate">{p.memwalBlobId!.slice(0, 16)}…</span>
                  <span>↗</span>
                </a>
              );
            })}
          </div>
        )}
        <p className="text-xs text-on-surface-variant mt-3">
          Use the <Link href="/users" className="text-primary hover:underline">Users page</Link> to run semantic queries against this profile.
        </p>
      </div>

      {/* Predictions list */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-on-surface">
          Predictions <span className="text-on-surface-variant font-normal text-base">({user.predictions.length})</span>
        </h2>

        {user.predictions.length === 0 && (
          <div className="sticker-card sticker-tilt-1 rounded-2xl p-10 text-center space-y-3">
            <p className="text-4xl">🎯</p>
            <p className="text-on-surface-variant">No predictions yet.</p>
          </div>
        )}

        {/* Played matches */}
        {played.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Results in</p>
            {played.map((item) => {
              const { p, match, home, away, result, correct } = item!;
              const predictedTeam = p.predictedWinner === 'draw' ? null : TEAM_MAP.get(p.predictedWinner);
              return (
                <div
                  key={p.id}
                  className={`sticker-card rounded-xl flex items-center gap-3 px-4 py-3 border-l-4 ${correct === true ? 'border-l-tertiary' : correct === false ? 'border-l-error' : 'border-l-outline-variant'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface">
                      {home?.flag} {home?.name} vs {away?.name} {away?.flag}
                      <span className="ml-2 text-xs text-on-surface-variant">Group {match.group} MD{match.matchday}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs flex-wrap">
                      <span className="text-on-surface-variant">
                        Predicted: <strong className="text-on-surface">
                          {p.predictedWinner === 'draw' ? '🤝 Draw' : `${predictedTeam?.flag} ${predictedTeam?.name ?? p.predictedWinner}`}
                        </strong>
                        {p.predictedHomeScore !== undefined && p.predictedAwayScore !== undefined && ` (${p.predictedHomeScore}–${p.predictedAwayScore})`}
                      </span>
                      <span className="text-on-surface-variant">Conf: {p.confidence}/5</span>
                    </div>
                    {p.opinion && <p className="text-xs text-on-surface-variant mt-1 italic">&quot;{p.opinion}&quot;</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {result && (
                      <p className="font-black text-on-surface text-sm">{result.homeScore}–{result.awayScore}</p>
                    )}
                    <p className={`text-xs mt-0.5 font-semibold ${correct ? 'text-tertiary' : 'text-error'}`}>
                      {correct ? `+${p.pointsEarned ?? 3} pts ✓` : '✗'}
                    </p>
                    {p.memwalBlobId && (
                      <a
                        href={`https://walruscan.com/blob/${p.memwalBlobId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-semibold text-primary hover:bg-primary/20 transition-colors"
                        title={p.memwalBlobId}
                      >
                        🦭 WalrusScan ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upcoming predictions */}
        {notYetPlayed.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Upcoming</p>
            {notYetPlayed.slice(0, 12).map((item) => {
              const { p, match, home, away } = item!;
              const predictedTeam = p.predictedWinner === 'draw' ? null : TEAM_MAP.get(p.predictedWinner);
              return (
                <div key={p.id} className="sticker-card rounded-xl flex items-center gap-3 px-4 py-3 opacity-65">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface-variant">
                      {home?.flag} {home?.name} vs {away?.name} {away?.flag}
                      <span className="ml-2 text-xs text-on-surface-variant">
                        {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · Group {match.group}
                      </span>
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Pick: <strong className="text-on-surface">
                        {p.predictedWinner === 'draw' ? '🤝 Draw' : `${predictedTeam?.flag} ${predictedTeam?.name ?? p.predictedWinner}`}
                      </strong>
                      {p.predictedHomeScore !== undefined && p.predictedAwayScore !== undefined && ` (${p.predictedHomeScore}–${p.predictedAwayScore})`}
                      {' · '}Conf: {p.confidence}/5
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-on-surface-variant">Pending</span>
                    {p.memwalBlobId && (
                      <a
                        href={`https://walruscan.com/blob/${p.memwalBlobId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-semibold text-primary hover:bg-primary/20 transition-colors"
                        title={p.memwalBlobId}
                      >
                        🦭 WalrusScan ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            {notYetPlayed.length > 12 && (
              <p className="text-xs text-on-surface-variant text-center py-2">
                + {notYetPlayed.length - 12} more upcoming predictions
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
