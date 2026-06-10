import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all real users
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("realUsers").collect();
    return docs.map((d) => ({ odId: d.odId, data: d.data }));
  },
});

// Get a single real user by app-level id
export const getById = query({
  args: { odId: v.string() },
  handler: async (ctx, { odId }) => {
    const doc = await ctx.db
      .query("realUsers")
      .withIndex("by_odId", (q) => q.eq("odId", odId))
      .first();
    return doc ? { odId: doc.odId, data: doc.data } : null;
  },
});

// Upsert a single user (create or update)
export const upsert = mutation({
  args: { odId: v.string(), data: v.string() },
  handler: async (ctx, { odId, data }) => {
    const existing = await ctx.db
      .query("realUsers")
      .withIndex("by_odId", (q) => q.eq("odId", odId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { data });
    } else {
      await ctx.db.insert("realUsers", { odId, data });
    }
  },
});

// Save multiple users at once (bulk upsert)
export const saveAll = mutation({
  args: { users: v.array(v.object({ odId: v.string(), data: v.string() })) },
  handler: async (ctx, { users }) => {
    for (const { odId, data } of users) {
      const existing = await ctx.db
        .query("realUsers")
        .withIndex("by_odId", (q) => q.eq("odId", odId))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { data });
      } else {
        await ctx.db.insert("realUsers", { odId, data });
      }
    }
  },
});
