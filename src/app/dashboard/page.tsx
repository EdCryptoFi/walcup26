'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { User, MemWalQueryResponse } from '@/types';
import { MATCH_MAP, TEAM_MAP, DEMO_RESULTS } from '@/lib/world-cup-data';
import { TeamSticker, TeamBadge } from '@/components/team-sticker';
import { getCollection } from '@/lib/sticker-collection';

const STAT_TILTS = ['sticker-tilt-1', 'sticker-tilt-2', 'sticker-tilt-3', 'sticker-tilt-4'];

function StatCard({ label, value, sub, color = 'gold', tiltIdx = 0 }: { label: string; value: string | number; sub?: string; color?: 'gold' | 'green' | 'blue'; tiltIdx?: number }) {
  const valueColor = color === 'gold' ? 'text-secondary' : color === 'green' ? 'text-tertiary' : 'text-primary';
  const tilt = STAT_TILTS[tiltIdx % STAT_TILTS.length];
  return (
    <div className={`sticker-card ${tilt} rounded-xl px-4 py-4 text-center`}>
      <p className={`text-3xl font-black ${valueColor}`}>{value}</p>
      <p className="text-xs text-on-surface-variant mt-0.5">{label}</p>
      {sub && <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>}
    </div>
  );
}

function NotConnected() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <Image src="/imgs/image2.png" alt="walcup" width={280} height={220} className="opacity-90" />
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-on-surface">Connect to see your Dashboard</h2>
        <p className="text-on-surface-variant max-w-sm mx-auto">
          Your prediction history and Walrus memories are tied to your Sui wallet address.
        </p>
      </div>
      <div className="wc-connect-btn">
        <ConnectButton connectText="Connect Sui Wallet" />
      </div>
      <p className="text-xs text-on-surface-variant">Sui Testnet · No gas required to view</p>
    </div>
  );
}

export default function DashboardPage() {
  const account = useCurrentAccount();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<MemWalQueryResponse | null>(null);
  const [querying, setQuerying] = useState(false);
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [collection, setCollection] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = account ? `sui-${account.address.slice(2, 10)}` : null;
  const username = account ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}` : null;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    // Load saved PFP from localStorage
    const savedPfp = localStorage.getItem(`walcup-pfp-${userId}`);
    if (savedPfp) setPfpUrl(savedPfp);

    const col = getCollection(userId);
    setCollection(col);

    fetch(`/api/users/${userId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setUser(data); setLoading(false); });

    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((d) => {
        const entry = (d.leaderboard ?? []).find((e: { userId: string }) => e.userId === userId);
        if (entry) setRank(entry.rank);
      });
  }, [userId]);

  function handlePfpUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 512 * 1024) {
      alert('Image must be under 512KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPfpUrl(dataUrl);
      localStorage.setItem(`walcup-pfp-${userId}`, dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function handleQuery() {
    if (!userId || !query) return;
    setQuerying(true);
    const res = await fetch(`/api/recall?userId=${encodeURIComponent(userId)}&query=${encodeURIComponent(query)}&limit=5`);
    const data = await res.json();
    setQueryResult(data);
    setQuerying(false);
  }

  if (!account) return <NotConnected />;

  const addr = account.address;
  const predictions = user?.predictions ?? [];
  const playedPreds = predictions.filter((p) => !!DEMO_RESULTS[p.matchId]);
  const upcomingPreds = predictions.filter((p) => !DEMO_RESULTS[p.matchId]);
  const correctPreds = playedPreds.filter((p) => {
    const res = DEMO_RESULTS[p.matchId];
    const m = MATCH_MAP.get(p.matchId);
    if (!m || !res) return false;
    const actual = res.homeScore > res.awayScore ? m.homeTeamId : res.homeScore < res.awayScore ? m.awayTeamId : 'draw';
    return p.predictedWinner === actual;
  });

  return (
    <div className="space-y-8">

      {/* Profile Header */}
      <div className="sticker-card sticker-tilt-1 peel-corner rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary-container to-primary" />
        <div className="p-6 flex flex-wrap items-start gap-5">
          {/* Avatar — click to upload PFP */}
          <div className="relative">
            <button
              className="relative group focus:outline-none"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile picture"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-3xl overflow-hidden">
                {pfpUrl ? (
                  <img src={pfpUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  '⚽'
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-[10px] font-bold">Edit</span>
              </div>
            </button>
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-tertiary border-2 border-white" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePfpUpload}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-on-surface font-mono">{username}</h1>
              <span className="pill bg-tertiary text-on-tertiary">Connected</span>
              <span className="pill bg-primary text-on-primary">Sui Testnet</span>
            </div>
            <p className="text-xs text-on-surface-variant font-mono mt-1 break-all">{addr}</p>
            <p className="text-xs text-on-surface-variant mt-1">
              MemWal namespace: <code className="text-primary">walcup26-sui-{addr.slice(2, 10)}</code>
            </p>
            {user?.favoriteTeam && (
              <div className="flex items-center gap-2 mt-2">
                <TeamSticker teamId={user.favoriteTeam} size="sm" />
                <span className="text-sm text-on-surface-variant">
                  Supports {TEAM_MAP.get(user.favoriteTeam)?.name}
                </span>
              </div>
            )}
            <p className="text-[10px] text-on-surface-variant mt-2">Tap avatar to upload profile picture</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {rank && (
              <div className="sticker-card sticker-tilt-2 rounded-xl px-4 py-2 text-center">
                <p className="text-2xl font-black text-secondary">#{rank}</p>
                <p className="text-xs text-on-surface-variant">Rank</p>
              </div>
            )}
            <Link
              href="/predict"
              className="self-start bg-primary text-white rounded-full px-4 py-2 text-sm font-bold hover:scale-105 transition-all"
            >
              + New Prediction
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => <div key={i} className="card h-20 shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard label="Total Points" value={user?.stats.points ?? 0} color="gold" tiltIdx={0} />
          <StatCard label="Correct Picks" value={`${user?.stats.correctWinners ?? 0}/${playedPreds.length}`} color="green" tiltIdx={1} />
          <StatCard label="Exact Scores" value={user?.stats.exactScores ?? 0} color="blue" tiltIdx={2} />
          <StatCard label="Accuracy" value={`${((user?.stats.winnerAccuracy ?? 0) * 100).toFixed(0)}%`} sub={`${playedPreds.length} results in`} tiltIdx={3} />
          <StatCard label="Stickers" value={`${collection.length}/48`} sub={`${Math.round((collection.length / 48) * 100)}% album`} color="gold" tiltIdx={0} />
        </div>
      )}

      {/* ── Memory Depth Indicator ── */}
      <div className="sticker-card sticker-tilt-3 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl">🧠</span>
          <div>
            <p className="font-bold text-on-surface text-sm">Agent Memory Depth</p>
            <p className="text-xs text-on-surface-variant">How well the AI knows you across sessions</p>
          </div>
        </div>
        {(() => {
          const memoryCount = predictions.length;
          const level = memoryCount >= 15 ? 'Deep' : memoryCount >= 8 ? 'Growing' : memoryCount >= 3 ? 'Learning' : 'New';
          const pct = Math.min(100, Math.round((memoryCount / 15) * 100));
          const levelColor = level === 'Deep' ? 'from-tertiary to-primary' : level === 'Growing' ? 'from-primary to-sky-blue' : level === 'Learning' ? 'from-secondary-container to-primary' : 'from-outline-variant to-outline';
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface">{level}</span>
                <span className="text-on-surface-variant">{memoryCount} memories on Walrus</span>
              </div>
              <div className="h-3 rounded-full bg-surface-container overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${levelColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[10px] text-on-surface-variant">
                {level === 'Deep' ? 'The agent has a rich profile of your biases and patterns.' :
                 level === 'Growing' ? 'The agent is building a solid prediction profile. Keep going!' :
                 level === 'Learning' ? 'A few more predictions and the agent starts detecting patterns.' :
                 'Make predictions to help the agent learn your style.'}
              </p>
            </div>
          );
        })()}
      </div>

      {/* ── Prediction Streak ── */}
      {playedPreds.length > 0 && (
        <div className="sticker-card sticker-tilt-1 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl">🔥</span>
            <div>
              <p className="font-bold text-on-surface text-sm">Prediction Streak</p>
              <p className="text-xs text-on-surface-variant">Your recent form</p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {playedPreds.slice(-10).map((p) => {
              const match = MATCH_MAP.get(p.matchId);
              if (!match) return null;
              const res = DEMO_RESULTS[p.matchId];
              const actual = res
                ? res.homeScore > res.awayScore ? match.homeTeamId
                : res.homeScore < res.awayScore ? match.awayTeamId : 'draw'
                : null;
              const correct = actual !== null && p.predictedWinner === actual;
              return (
                <div
                  key={p.id}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                    correct ? 'bg-tertiary/15 text-tertiary' : 'bg-error/10 text-error'
                  }`}
                  title={`${TEAM_MAP.get(match.homeTeamId)?.code} vs ${TEAM_MAP.get(match.awayTeamId)?.code}`}
                >
                  {correct ? '✓' : '✗'}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-on-surface-variant mt-2">
            {correctPreds.length} correct out of {playedPreds.length} resolved · Best streak: {user?.stats.bestStreak ?? 0}
          </p>
        </div>
      )}

      {/* ── Sticker Album ── */}
      <div className="album-page-bg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-on-surface text-lg">🎴 My Sticker Album</h3>
            <p className="text-xs text-on-surface-variant">Earn stickers by making predictions — collect all 48!</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-primary">{collection.length}<span className="text-sm text-on-surface-variant font-semibold"> / 48</span></span>
            <div className="mt-1 h-2 w-24 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary transition-all duration-700" style={{ width: `${Math.round((collection.length / 48) * 100)}%` }} />
            </div>
          </div>
        </div>

        {collection.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-6 italic">
            No stickers yet — go make predictions to start collecting!
          </p>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {collection.map((teamId) => (
              <div key={teamId} className="album-slot filled flex flex-col items-center p-2">
                <div className="sticker-foil sticker-owned relative">
                  <TeamSticker teamId={teamId} size="md" />
                </div>
                <span className="sticker-label mt-1">
                  {TEAM_MAP.get(teamId)?.name?.slice(0, 8)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-4">
          <Link href="/album" className="text-xs text-primary hover:underline font-semibold">
            Open full album →
          </Link>
        </div>
      </div>

      {/* Detected biases */}
      {user?.detectedBiases && user.detectedBiases.length > 0 && (
        <div className="sticker-card sticker-tilt-2 rounded-xl p-4" style={{ background: 'rgba(249,189,34,0.2)', borderColor: '#f9bd22' }}>
          <p className="text-sm font-bold text-secondary mb-2">⚠ Detected Biases</p>
          <div className="flex flex-wrap gap-2">
            {user.detectedBiases.map((b) => (
              <span key={b} className="pill bg-secondary-container text-on-secondary-container">{b}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Predictions list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-on-surface">
            My Predictions <span className="text-on-surface-variant font-normal text-base">({predictions.length})</span>
          </h2>

          {predictions.length === 0 ? (
            <div className="sticker-card sticker-tilt-1 rounded-2xl p-10 text-center space-y-3">
              <p className="text-4xl">🎯</p>
              <p className="text-on-surface-variant">No predictions yet.</p>
              <Link href="/predict" className="inline-block bg-primary text-white rounded-full px-4 py-2 text-sm font-bold hover:scale-105 transition-all">
                Make your first prediction →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Played */}
              {playedPreds.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Results in</p>
                  {playedPreds.map((p) => {
                    const match = MATCH_MAP.get(p.matchId);
                    if (!match) return null;
                    const res = DEMO_RESULTS[p.matchId];
                    const actual = res
                      ? res.homeScore > res.awayScore ? match.homeTeamId
                      : res.homeScore < res.awayScore ? match.awayTeamId : 'draw'
                      : null;
                    const correct = actual !== null && p.predictedWinner === actual;

                    return (
                      <div key={p.id} className={`sticker-card rounded-xl flex items-center gap-3 px-3 py-3 border-l-4 ${correct ? 'border-l-tertiary' : 'border-l-error'}`}>
                        <TeamSticker teamId={match.homeTeamId} size="sm" />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="text-on-surface font-medium">
                            {TEAM_MAP.get(match.homeTeamId)?.name} vs {TEAM_MAP.get(match.awayTeamId)?.name}
                            <span className="ml-2 text-on-surface-variant">Group {match.group}</span>
                          </p>
                          <p className="text-on-surface-variant mt-0.5">
                            Pick: <strong className="text-on-surface">
                              {p.predictedWinner === 'draw' ? '🤝 Draw' : TEAM_MAP.get(p.predictedWinner)?.name ?? p.predictedWinner}
                            </strong>
                            {p.predictedHomeScore !== undefined && ` (${p.predictedHomeScore}–${p.predictedAwayScore})`}
                            {' · '}Conf: {p.confidence}/5
                          </p>
                          {p.opinion && <p className="text-on-surface-variant italic mt-0.5">"{p.opinion}"</p>}
                        </div>
                        <div className="text-right text-xs flex-shrink-0">
                          {res && <p className="font-black text-on-surface">{res.homeScore}–{res.awayScore}</p>}
                          <p className={correct ? 'text-tertiary font-bold' : 'text-error font-bold'}>
                            {correct ? `+${p.pointsEarned ?? 3} pts ✓` : '✗'}
                          </p>
                        </div>
                        <TeamSticker teamId={match.awayTeamId} size="sm" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Upcoming */}
              {upcomingPreds.length > 0 && (
                <div className="space-y-1.5 mt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1">Upcoming</p>
                  {upcomingPreds.slice(0, 8).map((p) => {
                    const match = MATCH_MAP.get(p.matchId);
                    if (!match) return null;
                    return (
                      <div key={p.id} className="sticker-card rounded-xl flex items-center gap-3 px-3 py-2.5 opacity-65">
                        <TeamSticker teamId={match.homeTeamId} size="sm" />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="text-on-surface-variant">
                            {TEAM_MAP.get(match.homeTeamId)?.name} vs {TEAM_MAP.get(match.awayTeamId)?.name}
                          </p>
                          <p className="text-on-surface-variant">
                            Pick: <strong className="text-on-surface">
                              {p.predictedWinner === 'draw' ? 'Draw' : TEAM_MAP.get(p.predictedWinner)?.name ?? p.predictedWinner}
                            </strong>
                          </p>
                        </div>
                        <span className="text-xs text-on-surface-variant flex-shrink-0">Pending</span>
                        <TeamSticker teamId={match.awayTeamId} size="sm" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right panel: MemWal query */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-on-surface">🦭 On-Chain Memory</h2>

          <div className="sticker-card sticker-tilt-3 rounded-xl p-4 bg-surface-container-low space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white border border-outline-variant px-3 py-2">
                <p className="text-on-surface-variant mb-0.5">Walrus Namespace</p>
                <p className="text-primary font-mono truncate">wc2026-{userId}</p>
              </div>
              <div className="rounded-lg bg-white border border-outline-variant px-3 py-2">
                <p className="text-on-surface-variant mb-0.5">Stored Memories</p>
                <p className="text-primary font-mono">{predictions.length} on-chain</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant">Semantic search across your Walrus memories:</p>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                placeholder='"Brazil predictions", "high confidence picks"'
                className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleQuery}
                disabled={querying || !query}
                className="w-full bg-primary text-white rounded-full px-3 py-2 text-xs font-bold hover:scale-105 transition-all disabled:opacity-40"
              >
                {querying ? 'Searching...' : 'Recall from Walrus'}
              </button>
            </div>

            {queryResult && (
              <div className="space-y-2">
                <p className="text-xs text-on-surface-variant">{queryResult.total} results</p>
                {queryResult.results.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic">No matching memories.</p>
                ) : (
                  queryResult.results.map((r, i) => (
                    <div key={i} className="rounded-lg bg-white border border-outline-variant p-2.5 text-xs text-on-surface">
                      <p className="leading-relaxed">{r.text}</p>
                      <p className="text-on-surface-variant mt-1 font-mono truncate">{r.blobId.slice(0, 24)}…</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Chat shortcut */}
          <Link
            href={`/predict?userId=${userId}&username=${username}`}
            className="sticker-card sticker-tilt-1 rounded-xl flex items-center gap-3 p-4 hover:shadow-md transition-all group"
          >
            <span className="text-2xl">🤖</span>
            <div>
              <p className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors">
                Chat with Agent
              </p>
              <p className="text-xs text-on-surface-variant">Ask about your history · Get roasted</p>
            </div>
            <span className="ml-auto text-on-surface-variant">→</span>
          </Link>

          {/* Leaderboard position */}
          <div className="sticker-card sticker-tilt-2 rounded-xl p-4 text-center space-y-1">
            {rank ? (
              <>
                <p className="text-4xl font-black text-secondary">#{rank}</p>
                <p className="text-sm text-on-surface-variant">Your leaderboard position</p>
                <Link href="/users" className="text-xs text-primary hover:underline">See full leaderboard →</Link>
              </>
            ) : (
              <>
                <p className="text-on-surface-variant text-sm">Make predictions to appear on the leaderboard</p>
                <Link href="/predict" className="text-xs text-primary hover:underline">Start predicting →</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
