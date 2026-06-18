'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useChat } from 'ai/react';
import { useCurrentAccount, useSignPersonalMessage } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { TeamSticker } from '@/components/team-sticker';
import { addToCollection } from '@/lib/sticker-collection';
import { MATCHES as ALL_MATCHES, MATCH_MAP, TEAM_MAP } from '@/lib/world-cup-data';

// Build display list from world-cup-data so it auto-includes MD2/MD3 and never goes stale
const MATCHES = ALL_MATCHES
  .filter((m) => m.stage === 'group')
  .map((m) => {
    const home = TEAM_MAP.get(m.homeTeamId)!;
    const away = TEAM_MAP.get(m.awayTeamId)!;
    const d = new Date(m.date);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    return {
      id: m.id,
      home: m.homeTeamId,
      away: m.awayTeamId,
      homeName: home?.name ?? m.homeTeamId,
      awayName: away?.name ?? m.awayTeamId,
      homeFlag: home?.flag ?? '🏳️',
      awayFlag: away?.flag ?? '🏳️',
      group: m.group,
      date: dateLabel,
    };
  });

function computeOpenMatches() {
  const now = new Date();
  return MATCHES.filter((m) => {
    const fullMatch = MATCH_MAP.get(m.id);
    return fullMatch ? new Date(fullMatch.date) > now : true;
  });
}

function PredictContent() {
  const searchParams = useSearchParams();
  const account = useCurrentAccount();

  const walletUserId = account ? `sui-${account.address.slice(2, 10)}` : null;
  const walletUsername = account ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}` : null;

  const [manualUsername, setManualUsername] = useState(searchParams.get('username') ?? '');
  const [manualUserId, setManualUserId] = useState(searchParams.get('userId') ?? '');
  const [loggedIn, setLoggedIn] = useState(!!(searchParams.get('userId') || account));

  const userId = walletUserId ?? manualUserId;
  const username = walletUsername ?? manualUsername;

  const [openMatches, setOpenMatches] = useState(computeOpenMatches);
  const closedCount = MATCHES.length - openMatches.length;

  useEffect(() => {
    const timer = setInterval(() => setOpenMatches(computeOpenMatches()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const [selectedMatch, setSelectedMatch] = useState(() => {
    const open = computeOpenMatches();
    return open[0] ?? MATCHES[0];
  });
  const [winner, setWinner] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [opinion, setOpinion] = useState('');
  const [saving, setSaving] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [savedCount, setSavedCount] = useState(0);
  const [lastSaved, setLastSaved] = useState('');
  const [newStickers, setNewStickers] = useState<string[]>([]);
  const [agentError, setAgentError] = useState('');
  const [walrusPhase, setWalrusPhase] = useState<'idle' | 'searching' | 'found'>('idle');
  const [savedPredictions, setSavedPredictions] = useState<Array<{
    matchLabel: string; homeFlag: string; awayFlag: string;
    winnerLabel: string; score: string; walrusId?: string; signed: boolean;
  }>>([]);
  const [walrusBadge, setWalrusBadge] = useState<{ blobId: string; matchLabel: string } | null>(null);

  // Keep spinner visible for at least 500ms so users see it even on fast responses
  useEffect(() => {
    clearTimeout(spinnerTimer.current);
    if (saving) {
      setShowSpinner(true);
    } else {
      spinnerTimer.current = setTimeout(() => setShowSpinner(false), 500);
    }
    return () => clearTimeout(spinnerTimer.current);
  }, [saving]);

  const { mutateAsync: signMessage } = useSignPersonalMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/agent',
    body: { userId, username },
    onError: (err) => {
      setAgentError(err.message.includes('503') || err.message.includes('GROQ')
        ? 'Agent offline — GROQ_API_KEY not configured in Vercel env vars.'
        : `Agent error: ${err.message}`);
    },
    onResponse: () => {
      setWalrusPhase('found');
      setTimeout(() => setWalrusPhase('idle'), 3000);
    },
  });

  useEffect(() => {
    if (isLoading) {
      setWalrusPhase('searching');
    }
  }, [isLoading]);

  useEffect(() => {
    if (account) setLoggedIn(true);
  }, [account]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleManualLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!manualUsername.trim()) return;
    const id = manualUsername.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || `user${Date.now()}`;
    setManualUserId(id);
    setLoggedIn(true);
  }

  async function handleSavePrediction(e: React.FormEvent) {
    e.preventDefault();
    if (!winner || !userId) return;
    setSaving(true);

    const winnerLabel = winner === 'draw'
      ? 'Draw'
      : winner === selectedMatch.home
        ? `${selectedMatch.homeFlag} ${selectedMatch.homeName}`
        : `${selectedMatch.awayFlag} ${selectedMatch.awayName}`;

    let signature: string | undefined;

    // Wallet signature — proves ownership on-chain
    if (account) {
      try {
        const predText = `WalCup26 Prediction\nMatch: ${selectedMatch.homeName} vs ${selectedMatch.awayName}\nPick: ${winnerLabel}${homeScore !== '' ? `\nScore: ${homeScore}-${awayScore}` : ''}\nConfidence: ${confidence}/5\nUser: ${userId}`;
        const encoded = new TextEncoder().encode(predText);
        const result = await signMessage({ message: encoded });
        signature = result.signature;
      } catch {
        setLastSaved('⚠ Wallet signing rejected — prediction not saved');
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          username,
          matchId: selectedMatch.id,
          predictedWinner: winner,
          predictedHomeScore: homeScore !== '' ? parseInt(homeScore) : undefined,
          predictedAwayScore: awayScore !== '' ? parseInt(awayScore) : undefined,
          confidence,
          opinion: opinion || undefined,
          signature,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setLastSaved(`⚠ Error: ${err.error ?? 'Save failed — try again'}`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setSavedCount((c) => c + 1);
      setLastSaved(
        data.memwalBlobId
          ? `Stored on Walrus: ${data.memwalBlobId.slice(0, 10)}…`
          : signature
            ? '✓ Signed & saved'
            : '✓ Prediction saved'
      );

      if (data.memwalBlobId) {
        setWalrusBadge({ blobId: data.memwalBlobId, matchLabel: `${selectedMatch.homeName} vs ${selectedMatch.awayName}` });
      }

      setSavedPredictions((prev) => [{
        matchLabel: `${selectedMatch.homeName} vs ${selectedMatch.awayName}`,
        homeFlag: selectedMatch.homeFlag,
        awayFlag: selectedMatch.awayFlag,
        winnerLabel,
        score: homeScore !== '' ? `${homeScore}–${awayScore}` : '',
        walrusId: data.memwalBlobId,
        signed: !!signature,
      }, ...prev]);

      if (userId) {
        addToCollection(userId, [selectedMatch.home, selectedMatch.away]);
        setNewStickers([selectedMatch.home, selectedMatch.away]);
        setTimeout(() => setNewStickers([]), 3000);
      }
      setWinner('');
      setHomeScore('');
      setAwayScore('');
      setOpinion('');
    } finally {
      setSaving(false);
    }
  }

  if (!loggedIn && !account) {
    return (
      <div className="max-w-md mx-auto mt-16 space-y-6">
        <div className="text-center space-y-4">
          <Image src="/imgs/Hero1.png" alt="WalCup" width={340} height={260} className="mx-auto" />
          <h1 className="text-3xl font-black text-on-surface">Enter the Arena</h1>
          <p className="text-on-surface-variant">Connect your Sui wallet or choose a username to start predicting.</p>
        </div>

        <div className="sticker-card sticker-tilt-1 peel-corner rounded-2xl p-6 space-y-4">
          <div className="wc-connect-btn">
            <ConnectButton connectText="Connect Sui Wallet (Recommended)" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-xs text-on-surface-variant">or</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>
          <form onSubmit={handleManualLogin} className="flex gap-2">
            <input
              value={manualUsername}
              onChange={(e) => setManualUsername(e.target.value)}
              placeholder="Choose a username"
              maxLength={30}
              className="flex-1 bg-white border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm placeholder-on-surface-variant focus:outline-none focus:border-primary"
            />
            <button type="submit" className="rounded-full bg-cyan-500 border-2 border-cyan-500 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-600 hover:border-cyan-600 transition-colors shadow-sm">
              Go
            </button>
          </form>
        </div>
        <p className="text-xs text-on-surface-variant text-center">Sui Testnet · No real funds needed</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">

      {/* LEFT: Prediction Form */}
      <div className="lg:col-span-2 space-y-4">
        <div className="relative rounded-2xl overflow-hidden" style={{
          background: 'linear-gradient(135deg, #004ac6 0%, #0053db 40%, #1a6aff 100%)',
          boxShadow: '0 8px 32px rgba(0,74,198,0.3)',
        }}>
          {/* Ticket top stub */}
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Prediction Ticket</span>
              {savedCount > 0 && <span className="pill bg-white/20 text-white border border-white/30 text-[10px]">{savedCount} saved 🦭</span>}
            </div>
            <h2 className="font-black text-white text-lg">Make a Prediction</h2>
          </div>

          {/* Dashed separator */}
          <div className="relative mx-5 border-t-2 border-dashed border-white/20 my-1">
            <span className="absolute -left-7 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface" />
            <span className="absolute -right-7 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface" />
          </div>

          {/* Ticket body */}
          <form onSubmit={handleSavePrediction} className="px-5 pb-5 pt-3">
            {/* Match selector */}
            <label className="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wide">Select Match</label>
            {closedCount > 0 && (
              <p className="text-white/50 text-[10px] mb-1.5">
                🔒 {closedCount} match{closedCount > 1 ? 'es' : ''} already started — predictions closed
              </p>
            )}
            {openMatches.length === 0 ? (
              <p className="text-white/60 text-xs text-center py-3">No upcoming matches available for predictions.</p>
            ) : (
              <select
                value={selectedMatch.id}
                onChange={(e) => {
                  const m = openMatches.find((x) => x.id === e.target.value) ?? openMatches[0];
                  setSelectedMatch(m);
                  setWinner('');
                }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/60 mb-5 backdrop-blur-sm"
                style={{ colorScheme: 'dark' }}
              >
                {openMatches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.homeFlag} {m.homeName} vs {m.awayName} {m.awayFlag} — Grp {m.group} · {m.date}
                  </option>
                ))}
              </select>
            )}

            {/* Team picker */}
            <label className="block text-xs text-white/60 mb-3 font-bold uppercase tracking-wide">Who wins?</label>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {/* Home team button */}
              <button
                type="button"
                onClick={() => setWinner(selectedMatch.home)}
                className={`flex flex-col items-center gap-0 p-2 rounded-xl transition-all ${
                  winner === selectedMatch.home
                    ? 'bg-white/20 scale-105 ring-2 ring-white'
                    : 'hover:bg-white/10'
                }`}
              >
                <TeamSticker teamId={selectedMatch.home} size="xl" tilt />
                <span className="text-xs font-bold text-white mt-1 truncate w-full text-center">{selectedMatch.homeName}</span>
                <input
                  type="number" min="0" max="20" value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  placeholder="0"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 w-12 bg-white/20 border border-white/30 rounded-lg px-1 py-1.5 text-center text-white font-bold text-sm focus:outline-none focus:border-white placeholder-white/40"
                />
              </button>

              {/* Draw */}
              <button
                type="button"
                onClick={() => setWinner('draw')}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all ${
                  winner === 'draw'
                    ? 'bg-white/20 scale-105 ring-2 ring-white'
                    : 'hover:bg-white/10'
                }`}
              >
                <span className="text-4xl">🤝</span>
                <span className="text-xs font-bold text-white">Draw</span>
              </button>

              {/* Away team button */}
              <button
                type="button"
                onClick={() => setWinner(selectedMatch.away)}
                className={`flex flex-col items-center gap-0 p-2 rounded-xl transition-all ${
                  winner === selectedMatch.away
                    ? 'bg-white/20 scale-105 ring-2 ring-white'
                    : 'hover:bg-white/10'
                }`}
              >
                <TeamSticker teamId={selectedMatch.away} size="xl" tilt />
                <span className="text-xs font-bold text-white mt-1 truncate w-full text-center">{selectedMatch.awayName}</span>
                <input
                  type="number" min="0" max="20" value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  placeholder="0"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 w-12 bg-white/20 border border-white/30 rounded-lg px-1 py-1.5 text-center text-white font-bold text-sm focus:outline-none focus:border-white placeholder-white/40"
                />
              </button>
            </div>

            {/* Confidence slider */}
            <div className="mb-4">
              <label className="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wide">
                Confidence: <span className="text-white">{['', '😐', '🤔', '🙂', '😎', '🔥'][confidence]}</span> {confidence}/5
              </label>
              <input
                type="range" min="1" max="5" value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            {/* Opinion */}
            <div className="mb-4">
              <label className="block text-xs text-white/60 mb-1.5 font-bold uppercase tracking-wide">
                Your Take <span className="text-white/40">(stored on Walrus forever)</span>
              </label>
              <textarea
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                placeholder="Why? The agent will remember your reasoning..."
                rows={2}
                maxLength={300}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/60 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!winner || saving || showSpinner}
              className="relative w-full bg-white text-primary rounded-xl px-4 py-3 font-black hover:scale-105 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
            >
              {showSpinner && (
                <span className="absolute inset-0 flex items-center justify-center bg-white rounded-xl gap-2">
                  <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span className="text-primary text-sm font-bold">
                    {account ? 'Signing & saving to Walrus…' : 'Saving to Walrus…'}
                  </span>
                </span>
              )}
              {account ? 'Sign & Save to Walrus' : 'Save to Walrus Memory'}
            </button>

            {!account && (
              <p className="text-[10px] text-white/50 text-center mt-1">
                Connect a Sui wallet to store predictions on-chain
              </p>
            )}

            {lastSaved && (
              <p className={`text-xs text-center font-mono mt-2 ${lastSaved.startsWith('⚠') ? 'text-red-300' : 'text-white/60'}`}>
                {lastSaved}
              </p>
            )}
            {newStickers.length > 0 && (
              <div className="flex items-center gap-2 justify-center animate-bounce p-2 rounded-xl bg-white/10 border border-white/20 mt-2">
                <span className="text-xs font-bold text-white">🎉 New stickers earned!</span>
                {newStickers.map((id) => (
                  <TeamSticker key={id} teamId={id} size="sm" />
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Walrus stored badge — appears after first prediction, stays permanently */}
        {walrusBadge && (
          <div className="sticker-card sticker-tilt-2 peel-corner rounded-2xl overflow-hidden animate-[float_0.4s_ease-out]">
            <div className="bg-gradient-to-r from-primary to-sky-500 px-4 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦭</span>
                <div>
                  <p className="text-white font-black text-sm">Stored on Walrus</p>
                  <p className="text-white/70 text-[10px]">{walrusBadge.matchLabel}</p>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-2.5 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-on-surface-variant truncate">{walrusBadge.blobId.slice(0, 20)}…</span>
              <a
                href={`https://walruscan.com/blob/${walrusBadge.blobId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-primary/90 transition-colors"
              >
                Ver blob ↗
              </a>
            </div>
          </div>
        )}

        {/* Points guide */}
        <div className="sticker-card sticker-tilt-2 rounded-xl p-4 text-xs space-y-2" style={{ background: 'rgba(255,195,41,0.1)' }}>
          <p className="font-bold text-on-surface mb-1">Points System</p>
          {[
            ['Correct winner (group)', '3 pts'],
            ['Exact score bonus', '+2 pts'],
            ['Knockout rounds', '4–8 pts'],
            ['Tournament champion', '10 pts'],
          ].map(([label, pts]) => (
            <div key={label} className="flex justify-between">
              <span className="text-on-surface-variant">{label}</span>
              <span className="text-secondary font-bold">{pts}</span>
            </div>
          ))}
        </div>

        {/* My Predictions this session */}
        {savedPredictions.length > 0 && (
          <div className="sticker-card sticker-tilt-1 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-on-surface text-sm">My Predictions</p>
              <span className="pill bg-primary/10 text-primary text-[10px] border border-primary/20">{savedPredictions.length}</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {savedPredictions.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-xs bg-surface-container rounded-lg px-2.5 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface-variant truncate">{p.homeFlag} {p.matchLabel} {p.awayFlag}</p>
                    <p className="font-bold text-on-surface">
                      {p.winnerLabel}{p.score ? ` · ${p.score}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    {p.signed && <span className="text-tertiary font-bold text-[9px]">✓ signed</span>}
                    {p.walrusId && (
                      <a
                        href={`https://walruscan.com/blob/${p.walrusId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[9px] text-primary hover:underline"
                        title="View on Walrus"
                      >
                        {p.walrusId.slice(0, 8)}… ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: AI Agent Chat */}
      <div className="lg:col-span-3 sticker-card rounded-2xl flex flex-col min-h-[640px]">
        <div className="px-4 py-3 border-b border-outline-variant flex items-center gap-3 flex-shrink-0 bg-surface-container-low rounded-t-2xl">
          <span className="text-2xl">🎙️</span>
          <div className="flex-1">
            <p className="font-bold text-on-surface text-sm">THE COMMENTATOR — WalCup 26 Agent</p>
            <p className="text-xs text-on-surface-variant">
              Remembers across sessions · Walrus Memory · Groq Llama 3.3
            </p>
          </div>
          <span className="pill bg-primary text-on-primary font-mono text-[10px]">
            {username}
          </span>
        </div>

        {agentError && (
          <div className="mx-4 mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
            ⚠ {agentError}
          </div>
        )}

        {/* Main body: judge left + chat right */}
        <div className="flex flex-1 min-h-0">
          {/* Judge image — large, fixed left column */}
          <div className="hidden sm:flex w-36 lg:w-44 flex-shrink-0 flex-col items-center justify-start pt-6 pb-4 px-2 border-r border-outline-variant/40 bg-surface-container-low/50">
            <Image
              src="/imgs/judge.png"
              alt="The Commentator"
              width={160}
              height={220}
              className="object-contain w-full drop-shadow-lg"
            />
            <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest mt-3 text-center leading-tight">
              The<br />Commentator
            </p>
          </div>

          {/* Chat messages + suggestions */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="pt-2 space-y-3">
              {/* Mobile-only judge image */}
              <div className="flex sm:hidden justify-center mb-2">
                <Image src="/imgs/judge.png" alt="The Commentator" width={80} height={110} className="object-contain drop-shadow" />
              </div>
              <p className="text-on-surface-variant text-xs text-center max-w-xs mx-auto">
                Ask <strong className="text-primary">THE COMMENTATOR</strong> — it remembers everything via Walrus!
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {[
                  'Roast my predictions!',
                  'Who wins Group C?',
                  'What are my biases?',
                  'How am I ranked?',
                  'Who will be top scorer?',
                  'Give me a betting tip',
                  'Dark horses of the tournament?',
                  'Rate my last prediction',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      const ev = { target: { value: s } } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(ev);
                    }}
                    className="bg-white border border-outline-variant rounded-full px-3 py-1.5 text-xs text-on-surface-variant hover:text-primary hover:border-primary transition-colors shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, idx) => (
            <div key={m.id}>
              <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && <span className="text-lg mr-2 flex-shrink-0 self-end">🦭</span>}
                <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bubble-user' : 'bubble-agent'}`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
              {/* Suggestions reappear after each assistant reply */}
              {m.role === 'assistant' && idx === messages.length - 1 && !isLoading && (
                <div className="flex flex-wrap gap-1.5 mt-3 ml-8">
                  {[
                    'Roast my predictions!',
                    'Who wins Group C?',
                    'What are my biases?',
                    'How am I ranked?',
                    'Who will be top scorer?',
                    'Give me a betting tip',
                    'Dark horses of the tournament?',
                    'Rate my last prediction',
                  ].slice(0, 5).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        const ev = { target: { value: s } } as React.ChangeEvent<HTMLInputElement>;
                        handleInputChange(ev);
                      }}
                      className="bg-white border border-outline-variant rounded-full px-2.5 py-1 text-[11px] text-on-surface-variant hover:text-primary hover:border-primary transition-colors shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-2">
              <span className="text-lg">🦭</span>
              <div className="bubble-agent px-4 py-3 text-sm">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="animate-pulse text-xs font-mono">Searching Walrus memory…</span>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1 font-mono opacity-60">
                  blob storage · decentralized recall
                </p>
              </div>
            </div>
          )}
          {walrusPhase === 'found' && !isLoading && messages.length > 0 && (
            <div className="flex justify-start gap-2 opacity-60">
              <span className="text-sm">🦭</span>
              <div className="text-[10px] font-mono text-tertiary px-2 py-1">
                ✓ Walrus memories retrieved
              </div>
            </div>
          )}
          <div ref={bottomRef} />
          </div>{/* end chat messages column */}
        </div>{/* end flex body */}

        <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-outline-variant flex gap-2 flex-shrink-0">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask THE COMMENTATOR about picks, results, biases…"
            className="flex-1 bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary text-white rounded-full px-4 py-2 text-sm font-bold hover:scale-105 transition-all disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PredictPage() {
  return (
    <Suspense fallback={<div className="text-on-surface-variant text-center py-20">Loading…</div>}>
      <PredictContent />
    </Suspense>
  );
}
