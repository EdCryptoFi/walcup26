import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new backup snapshot
export const create = mutation({
  args: {
    timestamp: v.string(),
    userCount: v.number(),
    data: v.string(),
    triggeredBy: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("backups", args);

    // Keep only the 10 most recent backups
    const all = await ctx.db.query("backups").withIndex("by_timestamp").order("asc").collect();
    if (all.length > 10) {
      const toDelete = all.slice(0, all.length - 10);
      for (const doc of toDelete) {
        await ctx.db.delete(doc._id);
      }
    }

    return id;
  },
});

// List recent backups (newest first)
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const all = await ctx.db.query("backups").withIndex("by_timestamp").order("desc").collect();
    const n = limit ?? 10;
    return all.slice(0, n).map((b) => ({
      id: b._id,
      timestamp: b.timestamp,
      userCount: b.userCount,
      triggeredBy: b.triggeredBy,
    }));
  },
});

// Get a single backup by Convex ID (for restore)
export const getById = query({
  args: { id: v.id("backups") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
