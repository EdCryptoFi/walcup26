import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Insert a new error/warn/info log entry
export const log = mutation({
  args: {
    timestamp: v.string(),
    level: v.string(),
    context: v.string(),
    message: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("errorLogs", args);
  },
});

// Get recent logs (newest first)
export const getLogs = query({
  args: {
    limit: v.optional(v.number()),
    level: v.optional(v.string()),
  },
  handler: async (ctx, { limit, level }) => {
    let docs = await ctx.db.query("errorLogs").withIndex("by_timestamp").order("desc").collect();
    if (level) docs = docs.filter((d) => d.level === level);
    return docs.slice(0, limit ?? 100);
  },
});

// Delete logs older than a given ISO timestamp
export const clearBefore = mutation({
  args: { before: v.string() },
  handler: async (ctx, { before }) => {
    const all = await ctx.db.query("errorLogs").withIndex("by_timestamp").order("asc").collect();
    let deleted = 0;
    for (const doc of all) {
      if (doc.timestamp < before) {
        await ctx.db.delete(doc._id);
        deleted++;
      } else {
        break;
      }
    }
    return { deleted };
  },
});
