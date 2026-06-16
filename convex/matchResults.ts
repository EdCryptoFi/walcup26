import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query('matchResults').collect();
    const out: Record<string, { homeScore: number; awayScore: number; scoredAt: string; usersScored: number }> = {};
    for (const r of rows) {
      out[r.matchId] = { homeScore: r.homeScore, awayScore: r.awayScore, scoredAt: r.scoredAt, usersScored: r.usersScored };
    }
    return out;
  },
});

export const getById = query({
  args: { matchId: v.string() },
  handler: async (ctx, { matchId }) => {
    return ctx.db.query('matchResults').withIndex('by_matchId', (q) => q.eq('matchId', matchId)).first();
  },
});

export const upsert = mutation({
  args: {
    matchId: v.string(),
    homeScore: v.number(),
    awayScore: v.number(),
    scoredAt: v.string(),
    usersScored: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('matchResults').withIndex('by_matchId', (q) => q.eq('matchId', args.matchId)).first();
    if (existing) {
      await ctx.db.patch(existing._id, { homeScore: args.homeScore, awayScore: args.awayScore, scoredAt: args.scoredAt, usersScored: args.usersScored });
    } else {
      await ctx.db.insert('matchResults', args);
    }
  },
});
