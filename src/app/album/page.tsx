'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { TeamSticker } from '@/components/team-sticker';
import { TEAM_MAP, ALL_GROUPS, getGroupTeams } from '@/lib/world-cup-data';
import type { Team } from '@/types';
import { getCollection } from '@/lib/sticker-collection';

const ALL_TEAM_IDS = [
  'ARG','ALG','AUS','AUT','BEL','BIH','BRA','CAN','CIV','COD','COL','CPV',
  'CRO','CUW','CZE','ECU','EGY','ENG','ESP','FRA','GER','GHA','HAI','IRN',
  'IRQ','JOR','JPN','KOR','KSA','MAR','MEX','NED','NOR','NZL','PAN','PAR',
  'POR','QAT','RSA','SCO','SEN','SUI','SWE','TUN','TUR','URU','USA','UZB',
];

export default function AlbumPage() {
  const account = useCurrentAccount();
  const userId = account ? `sui-${account.address.slice(2, 10)}` : null;
  const [collection, setCollection] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'collected' | 'missing'>('all');

  useEffect(() => {
    if (userId) {
      setCollection(getCollection(userId));
    }
  }, [userId]);

  const collected = new Set(collection);
  const filtered = ALL_TEAM_IDS.filter((id) =>
    filter === 'all' ? true : filter === 'collected' ? collected.has(id) : !collected.has(id)
  );

  const pct = Math.round((collected.size / ALL_TEAM_IDS.length) * 100);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="sticker-card sticker-tilt-1 peel-corner rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-secondary-container via-primary to-tertiary" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-on-surface">🎴 Sticker Album</h1>
              <p className="text-on-surface-variant mt-1">
                Earn stickers by making predictions. Collect all 48!
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-primary">{collected.size}<span className="text-xl text-on-surface-variant font-semibold"> / 48</span></p>
              <p className="text-xs text-on-surface-variant mt-0.5">{pct}% complete</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-3 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>

          {collected.size === 0 && (
            <div className="mt-4 p-3 rounded-xl bg-secondary-container/20 border border-secondary-container text-sm text-on-secondary-container text-center">
              No stickers yet! Go to <Link href="/predict" className="font-bold underline">Make a Prediction</Link> and start collecting.
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'collected', 'missing'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-primary text-white scale-105 shadow-sm'
                : 'bg-white border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
            }`}
          >
            {f === 'all' ? `All (${ALL_TEAM_IDS.length})` : f === 'collected' ? `✓ Collected (${collected.size})` : `Missing (${ALL_TEAM_IDS.length - collected.size})`}
          </button>
        ))}
      </div>

      {/* Sticker grid by group — Panini album style */}
      {ALL_GROUPS.map((group) => {
        const teams: Team[] = getGroupTeams(group);
        const groupFiltered = teams.filter((t) =>
          filter === 'all' ? true : filter === 'collected' ? collected.has(t.id) : !collected.has(t.id)
        );
        if (groupFiltered.length === 0) return null;
        return (
          <div key={group} className="album-page-bg p-6">
            <h2 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-black shadow-sm">{group}</span>
              Group {group}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
              {teams.map((team) => {
                const isOwned = collected.has(team.id);
                if (filter !== 'all' && (filter === 'collected' ? !isOwned : isOwned)) return null;
                return (
                  <div
                    key={team.id}
                    className={`album-slot ${isOwned ? 'filled' : ''} flex flex-col items-center p-3 transition-all`}
                  >
                    <div className={`${isOwned ? 'sticker-foil sticker-owned' : ''} relative`}>
                      <TeamSticker
                        teamId={team.id}
                        size="lg"
                        className={isOwned ? '' : 'opacity-25 grayscale'}
                      />
                    </div>
                    <p className="sticker-label mt-2">
                      {team.name}
                    </p>
                    {isOwned && (
                      <span className="text-[9px] font-black text-tertiary uppercase tracking-wide mt-0.5">Collected</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* CTA */}
      <div className="text-center py-6">
        <Link
          href="/predict"
          className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-8 py-4 font-bold hover:scale-105 shadow-lg transition-all"
        >
          ⚽ Make Predictions to Earn More
        </Link>
        <p className="text-xs text-on-surface-variant mt-3">
          Each prediction unlocks both team stickers from that match
        </p>
      </div>
    </div>
  );
}
