'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MemWalQueryResponse } from '@/types';
import { TeamSticker } from '@/components/team-sticker';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'real' | 'seeded'>('all');
  const [queryUserId, setQueryUserId] = useState('');
  const [queryText, setQueryText] = useState('');
  const [queryResult, setQueryResult] = useState<MemWalQueryResponse | null>(null);
  const [querying, setQuerying] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((d) => { setUsers(d.users ?? []); setLoading(false); });
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'real' ? u.isReal : !u.isReal);
    return matchSearch && matchFilter;
  });

  async function handleQuery() {
    if (!queryUserId || !queryText) return;
    setQuerying(true);
    const res = await fetch(`/api/recall?userId=${encodeURIComponent(queryUserId)}&query=${encodeURIComponent(queryText)}&limit=5`);
    setQueryResult(await res.json());
    setQuerying(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-white">All Players</h1>
          <p className="text-gray-500 text-sm">{users.length} participants in the prediction pool</p>
        </div>
        <Link href="/predict" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
          + Join the pool
        </Link>
      </div>

      {/* MemWal Query Panel */}
      <div className="card p-5 bg-gradient-to-br from-blue-950/30 to-purple-950/20 border-blue-800/30">
        <h2 className="font-bold text-white mb-1 flex items-center gap-2">
          <span>🦭</span> Query Any Player's Walrus Memory
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          All predictions are stored encrypted on Walrus. Run semantic search against any player's history.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={queryUserId}
            onChange={(e) => setQueryUserId(e.target.value)}
            className="bg-wc-dark border border-wc-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 sm:w-52"
          >
            <option value="">Select player…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.avatar} {u.username}{u.isReal ? ' ⚡' : ''}
              </option>
            ))}
          </select>
          <input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder='e.g. "Brazil predictions", "high confidence", "Group C"'
            className="flex-1 bg-wc-dark border border-wc-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          />
          <button
            onClick={handleQuery}
            disabled={querying || !queryUserId || !queryText}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-40 transition-colors"
          >
            {querying ? '…' : 'Recall'}
          </button>
        </div>

        {queryResult && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-600">
              {queryResult.total} memories · <strong className="text-white">{queryResult.username}</strong> · "{queryResult.query}"
            </p>
            {queryResult.results.length === 0 ? (
              <p className="text-sm text-gray-600 italic py-2">No matching memories found.</p>
            ) : (
              queryResult.results.map((r, i) => (
                <div key={i} className="rounded-xl bg-wc-dark border border-wc-border/50 p-3 text-sm text-gray-300">
                  <p className="leading-relaxed">{r.text}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-600">
                    <span>Relevance {((1 - r.distance) * 100).toFixed(0)}%</span>
                    <span className="font-mono truncate">blob: {r.blobId.slice(0, 20)}…</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search player…"
          className="bg-wc-card border border-wc-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 w-44"
        />
        <div className="flex gap-1">
          {(['all', 'real', 'seeded'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors capitalize ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-wc-card border border-wc-border text-gray-400 hover:text-white'
              }`}
            >
              {f === 'real' ? '⚡ Live' : f === 'seeded' ? '🤖 Simulated' : 'All'}
            </button>
          ))}
        </div>
        <p className="ml-auto text-xs text-gray-600">{filtered.length} shown</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-28 shimmer" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((user) => (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="card p-4 hover:border-blue-700/50 transition-all group hover:scale-[1.01]"
            >
              <div className="flex items-start gap-3">
                {user.favoriteTeam ? (
                  <TeamSticker teamId={user.favoriteTeam} size="md" tilt />
                ) : (
                  <span className="text-3xl">{user.avatar}</span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {user.username}
                    </p>
                    {user.isReal && (
                      <span className="pill bg-green-900/50 text-green-400 border border-green-700/30 text-[10px]">LIVE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-lg font-black text-wc-gold">{user.stats.points} pts</span>
                    <span className="text-xs text-gray-600">{user.stats.correctWinners}/{user.stats.totalPredictions} correct</span>
                  </div>
                  {user.detectedBiases && user.detectedBiases.length > 0 && (
                    <p className="text-xs text-amber-500/60 mt-1 truncate">⚠ {user.detectedBiases[0]}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
