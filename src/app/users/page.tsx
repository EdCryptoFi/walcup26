'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MemWalQueryResponse } from '@/types';
import { TeamSticker } from '@/components/team-sticker';

const CARD_TILTS = ['sticker-tilt-1', 'sticker-tilt-2', 'sticker-tilt-3'];

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
    try {
      const res = await fetch(`/api/recall?userId=${encodeURIComponent(queryUserId)}&query=${encodeURIComponent(queryText)}&limit=5`);
      const data = await res.json();
      if (!res.ok || !data.results) {
        setQueryResult({ userId: queryUserId, username: '', query: queryText, results: [], total: 0 });
      } else {
        setQueryResult(data);
      }
    } catch {
      setQueryResult({ userId: queryUserId, username: '', query: queryText, results: [], total: 0 });
    }
    setQuerying(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-on-surface">All Players</h1>
          <p className="text-on-surface-variant text-sm">{users.length} participants in the prediction pool</p>
        </div>
        <Link href="/predict" className="bg-primary text-white rounded-full px-4 py-2 text-sm font-bold hover:scale-105 transition-all">
          + Join the pool
        </Link>
      </div>

      {/* MemWal Query Panel */}
      <div className="sticker-card sticker-tilt-1 peel-corner rounded-2xl p-5">
        <h2 className="font-bold text-on-surface mb-1 flex items-center gap-2">
          <span>🦭</span> Query Any Player's Walrus Memory
        </h2>
        <p className="text-xs text-on-surface-variant mb-4">
          All predictions are stored encrypted on Walrus. Run semantic search against any player's history.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={queryUserId}
            onChange={(e) => setQueryUserId(e.target.value)}
            className="bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary sm:w-52"
          >
            <option value="">Select player…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.avatar} {u.username}{u.isReal ? ' ⚡' : ' 🤖'}
              </option>
            ))}
          </select>
          <input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder='e.g. "Brazil predictions", "high confidence", "Group C"'
            className="flex-1 bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          />
          <button
            onClick={handleQuery}
            disabled={querying || !queryUserId || !queryText}
            className="bg-primary text-white rounded-full px-5 py-2 text-sm font-bold hover:scale-105 transition-all disabled:opacity-40"
          >
            {querying ? '…' : 'Recall'}
          </button>
        </div>

        {queryResult && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-on-surface-variant">
              {queryResult.total} memories · <strong className="text-on-surface">{queryResult.username}</strong> · "{queryResult.query}"
            </p>
            {queryResult.results.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic py-2">No matching memories found.</p>
            ) : (
              queryResult.results.map((r, i) => {
                const isRealBlob = !r.blobId.startsWith('synthetic-');
                return (
                  <div key={i} className="rounded-xl bg-white border border-outline-variant p-3 text-sm text-on-surface shadow-sm">
                    <p className="leading-relaxed">{r.text}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-on-surface-variant">
                      <span>Relevance {((1 - r.distance) * 100).toFixed(0)}%</span>
                      {isRealBlob ? (
                        <a
                          href={`https://walruscan.com/blob/${r.blobId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-semibold text-primary hover:bg-primary/20 transition-colors font-mono"
                        >
                          🦭 {r.blobId.slice(0, 20)}… ↗
                        </a>
                      ) : (
                        <span className="font-mono truncate">blob: {r.blobId.slice(0, 20)}…</span>
                      )}
                    </div>
                  </div>
                );
              })
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
          className="bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary w-44"
        />
        <div className="flex gap-1">
          {(['all', 'real', 'seeded'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all capitalize ${
                filter === f ? 'bg-primary text-white scale-105' : 'bg-white border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary'
              }`}
            >
              {f === 'real' ? '⚡ Live' : f === 'seeded' ? '🤖 Test Bots' : 'All'}
            </button>
          ))}
        </div>
        <p className="ml-auto text-xs text-on-surface-variant">{filtered.length} shown</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-28 shimmer" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((user, idx) => {
            const tilt = CARD_TILTS[idx % CARD_TILTS.length];
            return (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className={`sticker-card ${tilt} peel-corner rounded-xl p-4 hover:shadow-md transition-all group`}
              >
                <div className="flex items-start gap-3">
                  {user.favoriteTeam ? (
                    <TeamSticker teamId={user.favoriteTeam} size="md" tilt />
                  ) : (
                    <span className="text-3xl">{user.avatar}</span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {user.username}
                      </p>
                      {user.isReal ? (
                        <span className="pill bg-tertiary text-on-tertiary text-[10px]">LIVE</span>
                      ) : (
                        <span className="pill bg-surface-container text-on-surface-variant text-[10px]">🤖 Bot · MemWal Test</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-lg font-black text-primary">{user.stats.points} pts</span>
                      <span className="text-xs text-on-surface-variant">{user.stats.correctWinners}/{user.stats.totalPredictions} correct</span>
                    </div>
                    {user.detectedBiases && user.detectedBiases.length > 0 && (
                      <p className="text-xs text-secondary mt-1 truncate">⚠ {user.detectedBiases[0]}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
