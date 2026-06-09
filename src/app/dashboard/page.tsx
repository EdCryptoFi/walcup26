'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { User, MemWalQueryResponse } from '@/types';
import { MATCH_MAP, TEAM_MAP, DEMO_RESULTS } from '@/lib/world-cup-data';
import { TeamSticker, TeamBadge } from '@/components/team-sticker';

function StatCard({ label, value, sub, color = 'gold' }: { label: string; value: string | number; sub?: string; color?: 'gold' | 'green' | 'blue' }) {
  const valueColor = color === 'gold' ? 'text-wc-gold' : color === 'green' ? 'text-green-600' : 'text-blue-700';
  return (
    <div className="card px-4 py-4 text-center">
      <p className={`text-3xl font-black ${valueColor}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function NotConnected() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <Image src="/imgs/image2.png" alt="walcup" width={280} height={220} className="opacity-90" />
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Connect to see your Dashboard</h2>
        <p className="text-slate-500 max-w-sm mx-auto">
          Your prediction history and Walrus memories are tied to your Sui wallet address.
        </p>
      </div>
      <div className="wc-connect-btn">
        <ConnectButton connectText="Connect Sui Wallet" />
      </div>
      <p className="text-xs text-slate-400">Sui Testnet · No gas required to view</p>
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = account ? `sui-${account.address.slice(2, 10)}` : null;
  const username = account ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}` : null;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    // Load saved PFP from localStorage
    const savedPfp = localStorage.getItem(`walcup-pfp-${userId}`);
    if (savedPfp) setPfpUrl(savedPfp);

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
      <div className="card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600" />
        <div className="p-6 flex flex-wrap items-start gap-5">
          {/* Avatar — click to upload PFP */}
          <div className="relative">
            <button
              className="relative group focus:outline-none"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile picture"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-3xl overflow-hidden">
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
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white" />
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
              <h1 className="text-2xl font-black text-slate-900 font-mono">{username}</h1>
              <span className="pill bg-green-100 text-green-700 border border-green-200">Connected</span>
              <span className="pill bg-blue-100 text-blue-700 border border-blue-200">Sui Testnet</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1 break-all">{addr}</p>
            <p className="text-xs text-slate-400 mt-1">
              MemWal namespace: <code className="text-blue-600">walcup26-sui-{addr.slice(2, 10)}</code>
            </p>
            {user?.favoriteTeam && (
              <div className="flex items-center gap-2 mt-2">
                <TeamSticker teamId={user.favoriteTeam} size="sm" />
                <span className="text-sm text-slate-500">
                  Supports {TEAM_MAP.get(user.favoriteTeam)?.name}
                </span>
              </div>
            )}
            <p className="text-[10px] text-slate-300 mt-2">Tap avatar to upload profile picture</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {rank && (
              <div className="card px-4 py-2 text-center border-amber-200 bg-amber-50">
                <p className="text-2xl font-black text-wc-gold">#{rank}</p>
                <p className="text-xs text-slate-500">Rank</p>
              </div>
            )}
            <Link
              href="/predict"
              className="self-start rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
            >
              + New Prediction
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-20 shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Points" value={user?.stats.points ?? 0} color="gold" />
          <StatCard label="Correct Picks" value={`${user?.stats.correctWinners ?? 0}/${playedPreds.length}`} color="green" />
          <StatCard label="Exact Scores" value={user?.stats.exactScores ?? 0} color="blue" />
          <StatCard label="Accuracy" value={`${((user?.stats.winnerAccuracy ?? 0) * 100).toFixed(0)}%`} sub={`${playedPreds.length} results in`} />
        </div>
      )}

      {/* Detected biases */}
      {user?.detectedBiases && user.detectedBiases.length > 0 && (
        <div className="card p-4 border-amber-200 bg-amber-50">
          <p className="text-sm font-bold text-amber-700 mb-2">⚠ Detected Biases</p>
          <div className="flex flex-wrap gap-2">
            {user.detectedBiases.map((b) => (
              <span key={b} className="pill bg-amber-100 text-amber-700 border border-amber-200">{b}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Predictions list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            My Predictions <span className="text-slate-400 font-normal text-base">({predictions.length})</span>
          </h2>

          {predictions.length === 0 ? (
            <div className="card p-10 text-center space-y-3">
              <p className="text-4xl">🎯</p>
              <p className="text-slate-500">No predictions yet.</p>
              <Link href="/predict" className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">
                Make your first prediction →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Played */}
              {playedPreds.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Results in</p>
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
                      <div key={p.id} className={`card flex items-center gap-3 px-3 py-3 border-l-4 ${correct ? 'border-l-green-500' : 'border-l-red-400'}`}>
                        <TeamSticker teamId={match.homeTeamId} size="sm" />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="text-slate-700 font-medium">
                            {TEAM_MAP.get(match.homeTeamId)?.name} vs {TEAM_MAP.get(match.awayTeamId)?.name}
                            <span className="ml-2 text-slate-400">Group {match.group}</span>
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            Pick: <strong className="text-slate-800">
                              {p.predictedWinner === 'draw' ? '🤝 Draw' : TEAM_MAP.get(p.predictedWinner)?.name ?? p.predictedWinner}
                            </strong>
                            {p.predictedHomeScore !== undefined && ` (${p.predictedHomeScore}–${p.predictedAwayScore})`}
                            {' · '}Conf: {p.confidence}/5
                          </p>
                          {p.opinion && <p className="text-slate-400 italic mt-0.5">"{p.opinion}"</p>}
                        </div>
                        <div className="text-right text-xs flex-shrink-0">
                          {res && <p className="font-black text-slate-900">{res.homeScore}–{res.awayScore}</p>}
                          <p className={correct ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
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
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Upcoming</p>
                  {upcomingPreds.slice(0, 8).map((p) => {
                    const match = MATCH_MAP.get(p.matchId);
                    if (!match) return null;
                    return (
                      <div key={p.id} className="card flex items-center gap-3 px-3 py-2.5 opacity-65">
                        <TeamSticker teamId={match.homeTeamId} size="sm" />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="text-slate-600">
                            {TEAM_MAP.get(match.homeTeamId)?.name} vs {TEAM_MAP.get(match.awayTeamId)?.name}
                          </p>
                          <p className="text-slate-400">
                            Pick: <strong className="text-slate-600">
                              {p.predictedWinner === 'draw' ? 'Draw' : TEAM_MAP.get(p.predictedWinner)?.name ?? p.predictedWinner}
                            </strong>
                          </p>
                        </div>
                        <span className="text-xs text-slate-300 flex-shrink-0">Pending</span>
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
          <h2 className="text-xl font-bold text-slate-900">🦭 Walrus Memory</h2>

          <div className="card p-4 border-blue-200 bg-blue-50 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-slate-400 mb-0.5">Namespace</p>
                <p className="text-blue-600 font-mono truncate">wc2026-{userId}</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                <p className="text-slate-400 mb-0.5">Memories</p>
                <p className="text-blue-600 font-mono">{predictions.length} stored</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">Query your memories semantically:</p>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                placeholder='"Brazil predictions", "high confidence picks"'
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleQuery}
                disabled={querying || !query}
                className="w-full rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-40 transition-colors"
              >
                {querying ? 'Searching...' : 'Recall from Walrus'}
              </button>
            </div>

            {queryResult && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">{queryResult.total} results</p>
                {queryResult.results.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No matching memories.</p>
                ) : (
                  queryResult.results.map((r, i) => (
                    <div key={i} className="rounded-lg bg-white border border-slate-200 p-2.5 text-xs text-slate-700">
                      <p className="leading-relaxed">{r.text}</p>
                      <p className="text-slate-300 mt-1 font-mono truncate">{r.blobId.slice(0, 24)}…</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Chat shortcut */}
          <Link
            href={`/predict?userId=${userId}&username=${username}`}
            className="card flex items-center gap-3 p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <span className="text-2xl">🤖</span>
            <div>
              <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                Chat with Agent
              </p>
              <p className="text-xs text-slate-400">Ask about your history · Get roasted</p>
            </div>
            <span className="ml-auto text-slate-300">→</span>
          </Link>

          {/* Leaderboard position */}
          <div className="card p-4 text-center space-y-1">
            {rank ? (
              <>
                <p className="text-4xl font-black text-wc-gold">#{rank}</p>
                <p className="text-sm text-slate-500">Your leaderboard position</p>
                <Link href="/users" className="text-xs text-blue-600 hover:underline">See full leaderboard →</Link>
              </>
            ) : (
              <>
                <p className="text-slate-500 text-sm">Make predictions to appear on the leaderboard</p>
                <Link href="/predict" className="text-xs text-blue-600 hover:underline">Start predicting →</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
