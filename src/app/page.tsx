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
      <section className="relative bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant">
        <div className="relative grid lg:grid-cols-2 items-center gap-0 min-h-[480px]">
          {/* Text side */}
          <div className="px-8 py-12 lg:px-14 space-y-6 z-10">
            <div className="flex items-center gap-2">
              <span className="pill bg-secondary-container text-on-secondary-container border border-secondary-container rotate-[-2deg] font-bold text-xs px-4 py-1.5">
                🔴 LIVE
              </span>
              <span className="pill bg-surface-container text-on-surface-variant border border-outline-variant">
                Sui Testnet
              </span>
            </div>

            <div>
              <h1 className="text-5xl lg:text-6xl font-black leading-none tracking-tight text-on-surface">
                Predict.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-blue">
                  Collect.
                </span><br />
                Get Roasted.
                <span className="block text-base font-semibold text-on-surface-variant mt-1 tracking-normal">
                  powered by Walrus Memory
                </span>
              </h1>
              <p className="mt-4 text-on-surface-variant text-lg leading-relaxed max-w-md">
                FIFA World Cup 2026 prediction arena with an AI agent that <strong className="text-on-surface">remembers everything</strong>. Your picks, opinions, and biases — stored on-chain via <strong className="text-on-surface">Walrus Memory</strong>. Collect stickers. Build your album. The agent evolves with you.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                href="/predict"
                className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-8 py-4 font-bold hover:scale-105 shadow-lg rotate-1 transition-all active:scale-95"
              >
                ⚽ Make Predictions
              </Link>
              <Link
                href="/groups"
                className="inline-flex items-center gap-2 bg-cyan-500 text-white border-2 border-cyan-500 rounded-xl px-8 py-4 font-bold hover:bg-cyan-600 hover:border-cyan-600 rotate-[-1deg] transition-all shadow-md"
              >
                View Groups →
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex gap-4 pt-2 flex-wrap">
              {[
                { n: leaderboard.length, label: 'Players', primary: true },
                { n: 48, label: 'Teams' },
                { n: playedCount, label: 'Played' },
                { n: MATCHES.length, label: 'Matches' },
              ].map(({ n, label, primary }) => (
                <div key={label} className="sticker-card sticker-tilt-1 peel-corner rounded-2xl p-6 text-center min-w-[80px]">
                  <p className={`text-2xl font-black ${primary ? 'text-primary' : 'text-on-surface-variant'}`}>{n}</p>
                  <p className="text-xs text-on-surface-variant">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WalCup logo */}
          <div className="relative flex items-center justify-center lg:justify-end px-4 py-8 lg:py-0 overflow-hidden">
            <Image
              src="/imgs/walcup-wal-logo.png"
              alt="WalCup 26"
              width={600}
              height={480}
              className="float object-contain select-none drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="bg-surface-container rounded-3xl p-12 space-y-6">
        <h2 className="text-2xl font-black text-on-surface text-center">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: 1,
              icon: '🔗',
              title: 'Connect & Collect',
              desc: 'Link your Sui wallet. Every prediction earns you team stickers for your on-chain album — like Panini, but permanent.',
              tilt: 'sticker-tilt-1',
              stepBg: 'bg-primary text-white',
            },
            {
              step: 2,
              icon: '⚽',
              title: 'Predict & Store',
              desc: 'Pick winners, predict scores, share hot takes. Each prediction is saved to Walrus Memory — on-chain, forever.',
              tilt: 'sticker-tilt-2',
              stepBg: 'bg-secondary-container text-on-secondary-container',
            },
            {
              step: 3,
              icon: '🦭',
              title: 'Agent Evolves',
              desc: 'The AI recalls your history across sessions, detects your biases, and roasts your patterns. Day 1 ≠ Day 5.',
              tilt: 'sticker-tilt-3',
              stepBg: 'bg-tertiary text-white',
            },
          ].map(({ step, icon, title, desc, tilt, stepBg }) => (
            <div key={step} className={`sticker-card ${tilt} peel-corner rounded-2xl p-6 space-y-3 relative overflow-hidden group`}>
              <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${stepBg}`}>{step}</div>
              <div className="text-3xl">{icon}</div>
              <h3 className="text-lg font-bold text-on-surface">{title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN GRID: Leaderboard + Recent Results ──────────────── */}
      <section className="grid lg:grid-cols-3 gap-8">

        {/* Leaderboard */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-on-surface">🏆 Leaderboard</h2>
            <Link href="/users" className="text-sm text-primary hover:underline">
              All {leaderboard.length} players →
            </Link>
          </div>

          <div className="card overflow-hidden">
            <div className="grid grid-cols-[44px_1fr_72px_64px_64px] gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">
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
                  className="grid grid-cols-[44px_1fr_72px_64px_64px] gap-2 items-center px-4 py-3 border-b border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  <RankBadge rank={entry.rank} />

                  <div className="flex items-center gap-2.5 min-w-0">
                    {fav ? (
                      <Image
                        src={`/imgs/Stickers/${require('@/lib/stickers').STICKER_MAP[fav] ?? ''}`}
                        alt={fav}
                        width={22}
                        height={27}
                        className="rounded-sm border border-outline-variant object-cover flex-shrink-0"
                        onError={() => {}}
                      />
                    ) : (
                      <span className="text-lg w-6 text-center">{entry.avatar}</span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface text-sm truncate">{entry.username}</p>
                      {entry.isReal && <span className="text-[10px] text-tertiary font-bold">LIVE</span>}
                    </div>
                  </div>

                  <p className="text-right font-black text-primary text-sm">{entry.points}</p>
                  <p className="text-right text-on-surface-variant text-sm">{entry.correctWinners}</p>
                  <p className="text-right text-on-surface-variant text-sm">{entry.accuracy}%</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Trophy mascot */}
          <div className="sticker-card sticker-tilt-2 rounded-2xl overflow-hidden p-0">
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
            <h3 className="text-lg font-bold text-on-surface mb-3">📋 Latest Results</h3>
            <div className="space-y-1.5">
              {Object.entries(DEMO_RESULTS).slice(0, 6).map(([id, res]) => {
                const m = MATCHES.find((x) => x.id === id)!;
                const home = TEAM_MAP.get(m.homeTeamId);
                const away = TEAM_MAP.get(m.awayTeamId);
                return (
                  <div key={id} className="sticker-card sticker-tilt-3 rounded-lg flex items-center gap-2 px-3 py-2">
                    <span className="text-sm">{home?.flag}</span>
                    <span className="text-xs text-on-surface-variant flex-1 truncate">{home?.code}</span>
                    <span className="font-black text-on-surface text-sm tabular-nums">{res.homeScore}–{res.awayScore}</span>
                    <span className="text-xs text-on-surface-variant flex-1 text-right truncate">{away?.code}</span>
                    <span className="text-sm">{away?.flag}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Walrus CTA */}
          <div className="sticker-card sticker-tilt-1 rounded-xl p-4" style={{ background: 'rgba(0,74,198,0.05)' }}>
            <p className="font-bold text-on-surface text-sm mb-1">🦭 Walrus Memory Integration</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Predictions stored on Walrus Mainnet. The agent uses semantic search to recall past sessions — your picks shape how it responds over time.
            </p>
            <Link href="/users" className="mt-3 inline-block text-xs text-primary hover:underline font-semibold">
              Query memories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── GROUPS PREVIEW ───────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-on-surface">Group Stage — 48 Teams</h2>
          <Link href="/groups" className="text-sm text-primary hover:underline">View all groups →</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {ALL_GROUPS.slice(0, 6).map((g, idx) => {
            const teams = getGroupTeams(g);
            const tilts = ['sticker-tilt-1', 'sticker-tilt-2', 'sticker-tilt-3', 'sticker-tilt-4', 'sticker-tilt-1', 'sticker-tilt-2'];
            return (
              <Link key={g} href="/groups" className={`album-page-bg ${tilts[idx % tilts.length]} p-4 hover:scale-105 transition-all group`}>
                <p className="text-xs font-black text-secondary mb-3 text-center">Group {g}</p>
                <div className="grid grid-cols-2 gap-2 justify-items-center">
                  {teams.map((t) => (
                    <TeamSticker key={t.id} teamId={t.id} size="md" tilt />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link href="/groups" className="sticker-card rounded-xl px-6 py-3 text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:shadow-md transition-all">
            See all 12 groups with standings →
          </Link>
        </div>
      </section>

      {/* ── RUNNING WALRUSES BANNER ───────────────────────────────── */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-700 to-blue-900 border border-blue-600">
        <div className="grid lg:grid-cols-2 items-center">
          <div className="px-8 py-10 space-y-4">
            <h2 className="text-3xl font-black text-white">Persistent memory. On‑chain. Forever.</h2>
            <p className="text-blue-100 leading-relaxed">
              Every prediction stored on Walrus. The agent builds a genuine profile of your football brain across sessions — your biases, your streaks, your worst takes. Come back tomorrow and it remembers.
            </p>
            <Link href="/predict" className="inline-flex items-center gap-2 rounded-xl bg-secondary-container text-on-secondary-container px-6 py-3 font-bold hover:opacity-90 transition-opacity">
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
