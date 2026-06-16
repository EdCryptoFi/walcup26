import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  realUsers: defineTable({
    odId: v.string(), // app-level user id e.g. "sui-474bfe30"
    data: v.string(), // JSON-stringified User object (with nested predictions)
  }).index("by_odId", ["odId"]),

  backups: defineTable({
    timestamp: v.string(),   // ISO timestamp
    userCount: v.number(),
    data: v.string(),        // JSON-stringified User[] array
    triggeredBy: v.string(), // "cron" | "manual"
  }).index("by_timestamp", ["timestamp"]),

  errorLogs: defineTable({
    timestamp: v.string(),
    level: v.string(),             // "error" | "warn" | "info"
    context: v.string(),           // e.g. "predict", "results", "memwal"
    message: v.string(),
    details: v.optional(v.string()),
  }).index("by_timestamp", ["timestamp"]),

  matchResults: defineTable({
    matchId: v.string(),           // e.g. "A1", "F4"
    homeScore: v.number(),
    awayScore: v.number(),
    scoredAt: v.string(),          // ISO timestamp when users were scored
    usersScored: v.number(),
  }).index("by_matchId", ["matchId"]),
});
