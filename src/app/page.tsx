import Image from 'next/image';
import Link from 'next/link';
import { LeaderboardEntry } from '@/types';
import { MATCHES, DEMO_RESULTS, TEAM_MAP, ALL_GROUPS, getGroupTeams } from '@/lib/world-cup-data';
import { TeamSticker } from '@/components/team-sticker';

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/leaderboard`, { cache: 'no-store' });
    const data = await res.json();
    return data.leaderboard ?? [];
  } catch {
    return [];
  }
}

function RankBadge({ rank }: { rank: number }) {
  const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-n';
  const medal = ['🥇', '🥈', '🥉'][rank - 1];
  return (
    <span className={`${cls} inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white flex-shrink-0`}>
      {rank <= 3 ? medal : rank}
    </span>
  );
}

export default async function HomePage() {
  const leaderboard = await getLeaderboard();
  const top8 = leaderboard.slice(0, 8);
  const playedCount = Object.keys(DEMO_RESULTS).length;

  return (
    <div className="space-y-16">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative hero-bg rounded-3xl overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative grid lg:grid-cols-2 items-center gap-0 min-h-[480px]">
          {/* Text side */}
          <div className="px-8 py-12 lg:px-14 space-y-6 z-10">
            <div className="flex items-center gap-2">
              <span className="pill bg-blue-900/60 text-blue-300 border border-blue-700/40">
                🦭 Walrus Memory
              </span>
              <span className="pill bg-green-900/50 text-green-300 border border-green-700/40">
                Sui Testnet
              </span>
            </div>

            <div>
              <h1 className="text-5xl lg:text-6xl font-black leading-none tracking-tight text-white">
                Predict.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-wc-gold">
                  Remember.
                </span><br />
                Get Roasted.
              </h1>
              <p className="mt-4 text-gray-300 text-lg leading-relaxed max-w-md">
                Your FIFA World Cup 2026 predictions stored permanently on the <strong className="text-white">Walrus</strong> decentralized network. The AI agent never forgets.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                href="/predict"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-bold hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
              >
                ⚽ Make Predictions
              </Link>
              <Link
                href="/groups"
                className="inline-flex items-center gap-2 rounded-xl bg-wc-card border border-wc-border px-6 py-3 text-white font-semibold hover:border-blue-500 transition-colors"
              >
                View Groups →
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex gap-6 pt-2">
              {[
                { n: leaderboard.length, label: 'Players' },
                { n: 48, label: 'Teams' },
                { n: playedCount, label: 'Played' },
                { n: MATCHES.length, label: 'Matches' },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-wc-gold">{n}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Walrus mascots */}
          <div className="relative flex items-end justify-center lg:justify-end px-4 pb-0 lg:pb-0 overflow-hidden">
            <Image
              src="/imgs/Hero1.png"
              alt="WalCup mascots"
              width={560}
              height={420}
              className="float object-contain select-none"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-white text-center">How WalCup 26 Works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              icon: '🔗',
              title: 'Connect Wallet',
              desc: 'Connect your Sui testnet wallet to create your persistent prediction identity on-chain.',
            },
            {
              step: '02',
              icon: '⚽',
              title: 'Make Predictions',
              desc: 'Pick winners, predict scores, and share your hot takes. Every opinion is stored encrypted on Walrus.',
            },
            {
              step: '03',
              icon: '🦭',
              title: 'Agent Remembers',
              desc: 'The AI agent recalls your past predictions across sessions — and roasts you based on your patterns.',
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="card p-6 space-y-3 relative overflow-hidden group hover:border-blue-700/50 transition-colors">
              <div className="absolute top-3 right-4 text-5xl font-black text-wc-border/40">{step}</div>
              <div className="text-3xl">{icon}</div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN GRID: Leaderboard + Recent Results ──────────────── */}
      <section className="grid lg:grid-cols-3 gap-8">

        {/* Leaderboard */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">🏆 Leaderboard</h2>
            <Link href="/users" className="text-sm text-blue-400 hover:underline">
              All {leaderboard.length} players →
            </Link>
          </div>

          <div className="card overflow-hidden">
            <div className="grid grid-cols-[44px_1fr_72px_64px_64px] gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 border-b border-wc-border">
              <span>#</span><span>Player</span>
              <span className="text-right">Pts</span>
              <span className="text-right">Correct</span>
              <span className="text-right">Acc%</span>
            </div>

            {top8.map((entry) => {
              const fav = entry.favoriteTeam;
              return (
                <Link
                  key={entry.userId}
                  href={`/users/${entry.userId}`}
                  className="grid grid-cols-[44px_1fr_72px_64px_64px] gap-2 items-center px-4 py-3 border-b border-wc-border/40 hover:bg-white/[0.03] transition-colors"
                >
                  <RankBadge rank={entry.rank} />

                  <div className="flex items-center gap-2.5 min-w-0">
                    {fav ? (
                      <Image
                        src={`/imgs/Stickers/${require('@/lib/stickers').STICKER_MAP[fav] ?? ''}`}
                        alt={fav}
                        width={22}
                        height={27}
                        className="rounded-sm border border-white/20 object-cover flex-shrink-0"
                        onError={() => {}}
                      />
                    ) : (
                      <span className="text-lg w-6 text-center">{entry.avatar}</span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{entry.username}</p>
                      {entry.isReal && <span className="text-[10px] text-green-400 font-bold">LIVE</span>}
                    </div>
                  </div>

                  <p className="text-right font-black text-wc-gold text-sm">{entry.points}</p>
                  <p className="text-right text-gray-300 text-sm">{entry.correctWinners}</p>
                  <p className="text-right text-gray-300 text-sm">{entry.accuracy}%</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Trophy mascot */}
          <div className="card overflow-hidden bg-gradient-to-b from-blue-950/40 to-wc-card border-blue-800/30 p-0">
            <Image
              src="/imgs/image2.png"
              alt="WalCup mascots with trophy"
              width={400}
              height={320}
              className="w-full object-cover"
            />
          </div>

          {/* Recent results */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">📋 Latest Results</h3>
            <div className="space-y-1.5">
              {Object.entries(DEMO_RESULTS).slice(0, 6).map(([id, res]) => {
                const m = MATCHES.find((x) => x.id === id)!;
                const home = TEAM_MAP.get(m.homeTeamId);
                const away = TEAM_MAP.get(m.awayTeamId);
                return (
                  <div key={id} className="card flex items-center gap-2 px-3 py-2">
                    <span className="text-sm">{home?.flag}</span>
                    <span className="text-xs text-gray-400 flex-1 truncate">{home?.code}</span>
                    <span className="font-black text-white text-sm tabular-nums">{res.homeScore}–{res.awayScore}</span>
                    <span className="text-xs text-gray-400 flex-1 text-right truncate">{away?.code}</span>
                    <span className="text-sm">{away?.flag}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Walrus CTA */}
          <div className="card p-4 bg-gradient-to-br from-purple-950/40 to-wc-card border-purple-800/20">
            <p className="font-bold text-white text-sm mb-1">🦭 Walrus Memory</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every prediction is encrypted and stored on the Walrus decentralized network. Query any user's history with semantic search.
            </p>
            <Link href="/users" className="mt-3 inline-block text-xs text-blue-400 hover:underline font-semibold">
              Query memories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── GROUPS PREVIEW ───────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">Group Stage — 48 Teams</h2>
          <Link href="/groups" className="text-sm text-blue-400 hover:underline">View all groups →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ALL_GROUPS.slice(0, 6).map((g) => {
            const teams = getGroupTeams(g);
            return (
              <Link key={g} href="/groups" className="card p-3 hover:border-blue-700/40 transition-colors group">
                <p className="text-xs font-black text-wc-gold mb-2">Group {g}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {teams.map((t) => (
                    <TeamSticker key={t.id} teamId={t.id} size="sm" tilt />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link href="/groups" className="card px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:border-blue-600 transition-colors">
            See all 12 groups with standings →
          </Link>
        </div>
      </section>

      {/* ── RUNNING WALRUSES BANNER ───────────────────────────────── */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-950 to-wc-dark border border-wc-border">
        <div className="grid lg:grid-cols-2 items-center">
          <div className="px-8 py-10 space-y-4">
            <h2 className="text-3xl font-black text-white">Your memory, on‑chain. Forever.</h2>
            <p className="text-gray-400 leading-relaxed">
              Connect your Sui wallet and join the prediction arena. The agent tracks every pick you make and builds a profile of your biases — then roasts you accordingly.
            </p>
            <Link href="/predict" className="inline-flex items-center gap-2 rounded-xl bg-wc-gold text-black px-6 py-3 font-bold hover:opacity-90 transition-opacity">
              Start Predicting →
            </Link>
          </div>
          <div className="hidden lg:flex justify-end overflow-hidden">
            <Image
              src="/imgs/image1.png"
              alt="WalCup players"
              width={500}
              height={340}
              className="float-delay object-contain"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
