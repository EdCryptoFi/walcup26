'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useChat } from 'ai/react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';
import { TeamSticker } from '@/components/team-sticker';

const MATCHES = [
  { id: 'A1', home: 'MEX', away: 'RSA', homeName: 'Mexico',       awayName: 'South Africa', homeFlag: '🇲🇽', awayFlag: '🇿🇦', group: 'A', date: 'Jun 11' },
  { id: 'A2', home: 'KOR', away: 'CZE', homeName: 'South Korea',  awayName: 'Czechia',      homeFlag: '🇰🇷', awayFlag: '🇨🇿', group: 'A', date: 'Jun 11' },
  { id: 'B1', home: 'CAN', away: 'BIH', homeName: 'Canada',       awayName: 'Bosnia',       homeFlag: '🇨🇦', awayFlag: '🇧🇦', group: 'B', date: 'Jun 12' },
  { id: 'B2', home: 'QAT', away: 'SUI', homeName: 'Qatar',        awayName: 'Switzerland',  homeFlag: '🇶🇦', awayFlag: '🇨🇭', group: 'B', date: 'Jun 13' },
  { id: 'C1', home: 'BRA', away: 'MAR', homeName: 'Brazil',       awayName: 'Morocco',      homeFlag: '🇧🇷', awayFlag: '🇲🇦', group: 'C', date: 'Jun 13' },
  { id: 'C2', home: 'HAI', away: 'SCO', homeName: 'Haiti',        awayName: 'Scotland',     homeFlag: '🇭🇹', awayFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', date: 'Jun 13' },
  { id: 'D1', home: 'USA', away: 'PAR', homeName: 'USA',          awayName: 'Paraguay',     homeFlag: '🇺🇸', awayFlag: '🇵🇾', group: 'D', date: 'Jun 12' },
  { id: 'D2', home: 'AUS', away: 'TUR', homeName: 'Australia',    awayName: 'Türkiye',      homeFlag: '🇦🇺', awayFlag: '🇹🇷', group: 'D', date: 'Jun 13' },
  { id: 'E1', home: 'GER', away: 'CUW', homeName: 'Germany',      awayName: 'Curaçao',      homeFlag: '🇩🇪', awayFlag: '🇨🇼', group: 'E', date: 'Jun 14' },
  { id: 'E2', home: 'CIV', away: 'ECU', homeName: 'Ivory Coast',  awayName: 'Ecuador',      homeFlag: '🇨🇮', awayFlag: '🇪🇨', group: 'E', date: 'Jun 14' },
  { id: 'F1', home: 'NED', away: 'TUN', homeName: 'Netherlands',  awayName: 'Tunisia',      homeFlag: '🇳🇱', awayFlag: '🇹🇳', group: 'F', date: 'Jun 14' },
  { id: 'F2', home: 'JPN', away: 'SWE', homeName: 'Japan',        awayName: 'Sweden',       homeFlag: '🇯🇵', awayFlag: '🇸🇪', group: 'F', date: 'Jun 14' },
  { id: 'G1', home: 'BEL', away: 'EGY', homeName: 'Belgium',      awayName: 'Egypt',        homeFlag: '🇧🇪', awayFlag: '🇪🇬', group: 'G', date: 'Jun 15' },
  { id: 'H1', home: 'ESP', away: 'CPV', homeName: 'Spain',        awayName: 'Cape Verde',   homeFlag: '🇪🇸', awayFlag: '🇨🇻', group: 'H', date: 'Jun 15' },
  { id: 'I1', home: 'FRA', away: 'SEN', homeName: 'France',       awayName: 'Senegal',      homeFlag: '🇫🇷', awayFlag: '🇸🇳', group: 'I', date: 'Jun 16' },
  { id: 'J1', home: 'ARG', away: 'ALG', homeName: 'Argentina',    awayName: 'Algeria',      homeFlag: '🇦🇷', awayFlag: '🇩🇿', group: 'J', date: 'Jun 16' },
  { id: 'K1', home: 'POR', away: 'COD', homeName: 'Portugal',     awayName: 'DR Congo',     homeFlag: '🇵🇹', awayFlag: '🇨🇩', group: 'K', date: 'Jun 17' },
  { id: 'L1', home: 'ENG', away: 'CRO', homeName: 'England',      awayName: 'Croatia',      homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag: '🇭🇷', group: 'L', date: 'Jun 17' },
];

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

  const [selectedMatch, setSelectedMatch] = useState(MATCHES[0]);
  const [winner, setWinner] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [opinion, setOpinion] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [lastSaved, setLastSaved] = useState('');
  const [agentError, setAgentError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/agent',
    body: { userId, username },
    onError: (err) => {
      setAgentError(err.message.includes('503') || err.message.includes('ANTHROPIC')
        ? 'Agent offline — ANTHROPIC_API_KEY not configured in Vercel env vars.'
        : `Agent error: ${err.message}`);
    },
  });

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
        }),
      });
      const data = await res.json();
      setSavedCount((c) => c + 1);
      setLastSaved(data.memwalBlobId ? `🦭 Saved on Walrus: ${data.memwalBlobId.slice(0, 12)}…` : '✓ Prediction saved');
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
          <h1 className="text-3xl font-black text-slate-900">Enter the Arena</h1>
          <p className="text-slate-500">Connect your Sui wallet or choose a username to start predicting.</p>
        </div>

        <div className="card p-6 space-y-4">
          <div className="wc-connect-btn">
            <ConnectButton connectText="Connect Sui Wallet (Recommended)" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <form onSubmit={handleManualLogin} className="flex gap-2">
            <input
              value={manualUsername}
              onChange={(e) => setManualUsername(e.target.value)}
              placeholder="Choose a username"
              maxLength={30}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
            <button type="submit" className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors">
              Go
            </button>
          </form>
        </div>
        <p className="text-xs text-slate-400 text-center">Sui Testnet · No real funds needed</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">

      {/* LEFT: Prediction Form */}
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Make a Prediction</h2>
            {savedCount > 0 && (
              <span className="pill bg-green-100 text-green-700 border border-green-200">
                {savedCount} saved 🦭
              </span>
            )}
          </div>

          {/* Match selector */}
          <label className="block text-xs text-slate-500 mb-1.5">Select match</label>
          <select
            value={selectedMatch.id}
            onChange={(e) => {
              const m = MATCHES.find((x) => x.id === e.target.value) ?? MATCHES[0];
              setSelectedMatch(m);
              setWinner('');
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-400 mb-5"
          >
            {MATCHES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.homeFlag} {m.homeName} vs {m.awayName} {m.awayFlag} — Grp {m.group} · {m.date}
              </option>
            ))}
          </select>

          {/* Team sticker picker */}
          <label className="block text-xs text-slate-500 mb-3">Who wins?</label>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {/* Home team */}
            <button
              type="button"
              onClick={() => setWinner(selectedMatch.home)}
              className={`flex flex-col items-center gap-2 rounded-xl p-3 transition-all border-2 ${
                winner === selectedMatch.home
                  ? 'border-blue-500 bg-blue-50 scale-105 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white'
              }`}
            >
              <TeamSticker teamId={selectedMatch.home} size="md" tilt />
              <span className="text-xs font-semibold text-slate-700 truncate w-full text-center">
                {selectedMatch.homeName}
              </span>
            </button>

            {/* Draw */}
            <button
              type="button"
              onClick={() => setWinner('draw')}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 transition-all border-2 ${
                winner === 'draw'
                  ? 'border-blue-500 bg-blue-50 scale-105 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white'
              }`}
            >
              <span className="text-3xl">🤝</span>
              <span className="text-xs font-semibold text-slate-700">Draw</span>
            </button>

            {/* Away team */}
            <button
              type="button"
              onClick={() => setWinner(selectedMatch.away)}
              className={`flex flex-col items-center gap-2 rounded-xl p-3 transition-all border-2 ${
                winner === selectedMatch.away
                  ? 'border-blue-500 bg-blue-50 scale-105 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white'
              }`}
            >
              <TeamSticker teamId={selectedMatch.away} size="md" tilt />
              <span className="text-xs font-semibold text-slate-700 truncate w-full text-center">
                {selectedMatch.awayName}
              </span>
            </button>
          </div>

          <form onSubmit={handleSavePrediction} className="space-y-4">
            {/* Score */}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Score prediction <span className="text-wc-gold font-bold">+2 pts bonus</span></label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0" max="20" value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  placeholder="0"
                  className="w-14 bg-white border border-slate-200 rounded-lg px-2 py-2 text-center text-slate-900 focus:outline-none focus:border-blue-400"
                />
                <span className="text-slate-400 font-bold text-lg">–</span>
                <input
                  type="number" min="0" max="20" value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  placeholder="0"
                  className="w-14 bg-white border border-slate-200 rounded-lg px-2 py-2 text-center text-slate-900 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Confidence */}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">
                Confidence: <span className="text-slate-900 font-bold">{['', '😐', '🤔', '🙂', '😎', '🔥'][confidence]}</span> {confidence}/5
              </label>
              <input
                type="range" min="1" max="5" value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Opinion */}
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">
                Your take <span className="text-slate-400">(stored on Walrus forever)</span>
              </label>
              <textarea
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                placeholder="Why? The agent will remember your reasoning across sessions..."
                rows={2}
                maxLength={300}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!winner || saving}
              className="w-full rounded-xl bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-98"
            >
              {saving ? '🦭 Saving to Walrus...' : '🦭 Save to Walrus Memory'}
            </button>

            {lastSaved && (
              <p className="text-xs text-green-600 text-center font-mono">{lastSaved}</p>
            )}
          </form>
        </div>

        {/* Points guide */}
        <div className="card p-4 text-xs space-y-2 bg-amber-50 border-amber-200">
          <p className="font-bold text-slate-900 mb-1">🏆 Points System</p>
          {[
            ['Correct winner (group)', '3 pts'],
            ['Exact score bonus', '+2 pts'],
            ['Knockout rounds', '4–8 pts'],
            ['Tournament champion', '10 pts'],
          ].map(([label, pts]) => (
            <div key={label} className="flex justify-between">
              <span className="text-slate-500">{label}</span>
              <span className="text-wc-gold font-bold">{pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: AI Agent Chat */}
      <div className="lg:col-span-3 card flex flex-col" style={{ height: 640 }}>
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 flex-shrink-0 bg-slate-50 rounded-t-xl">
          <span className="text-2xl">🦭</span>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-sm">WalCup Agent</p>
            <p className="text-xs text-slate-500">
              Remembers across sessions · Walrus Memory
            </p>
          </div>
          <span className="pill bg-blue-100 text-blue-700 border border-blue-200 font-mono text-[10px]">
            {username}
          </span>
        </div>

        {agentError && (
          <div className="mx-4 mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
            ⚠ {agentError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center py-8 space-y-4">
              <Image src="/imgs/image1.png" alt="walrus" width={220} height={160} className="opacity-80" />
              <p className="text-slate-500 text-sm max-w-xs">
                Hey <strong className="text-slate-900">{username}</strong>! I'm your WalCup agent.
                I remember <em>everything</em> — across sessions, on Walrus.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Roast my predictions so far',
                  'Who will win Group C?',
                  'What biases do I have?',
                  'How am I doing vs leaderboard?',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      const ev = { target: { value: s } } as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(ev);
                    }}
                    className="rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && <span className="text-lg mr-2 flex-shrink-0 self-end">🦭</span>}
              <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bubble-user' : 'bubble-agent'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-2">
              <span className="text-lg">🦭</span>
              <div className="bubble-agent px-4 py-3 text-sm text-slate-400">
                <span className="animate-pulse">thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-slate-100 flex gap-2 flex-shrink-0">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about picks, results, biases, roasts…"
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-40 transition-colors"
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
    <Suspense fallback={<div className="text-slate-400 text-center py-20">Loading…</div>}>
      <PredictContent />
    </Suspense>
  );
}
