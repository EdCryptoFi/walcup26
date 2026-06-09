# WalCup 26 — Security Review

**Date:** June 9, 2026  
**Reviewer:** Claude (automated)

## Critical

### 1. ~~POST /api/results — No authentication~~ ✅ FIXED
Admin secret header check added. Requires `x-admin-secret` header matching `ADMIN_SECRET` env var.

### 2. ~~POST /api/seed — No authentication~~ ✅ FIXED
Same admin secret header check added.

### 3. POST /api/predict — No wallet signature verification
The `userId` and `username` come from the request body with no proof the caller owns that wallet. An attacker can impersonate any user by sending predictions with someone else's userId.

**Fix:** Require a signed message from the Sui wallet and verify it server-side, or use session-based auth after wallet connection.

## Medium

### 4. No rate limiting on any API endpoint
All POST endpoints accept unlimited requests. An attacker could flood predictions, spam MemWal storage, or overload the Gemini API.

**Fix:** Add rate limiting middleware (e.g., `next-rate-limit` or Vercel Edge middleware).

### 5. File-based storage race conditions
`real-users.json` is read/written with no file locking. Concurrent requests could cause data loss.

**Fix:** Use a database (Supabase is already connected) or add file locking.

### 6. ~~PFP upload — no size validation~~ ✅ FIXED
Added 512KB file size limit check before `FileReader.readAsDataURL`.

## Low

### 7. localStorage for state
Sticker collection and PFP are stored in localStorage, which is trivially editable by users. This is acceptable for a hackathon demo but shouldn't be trusted for actual scoring.

### 8. Env vars properly scoped
Only `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_DEMO_MODE` are exposed to the client. Private keys and API keys are server-only. `.env.local` is gitignored and not tracked.

### 9. Input validation is solid
All API routes use Zod schemas with proper type checking and bounds. No SQL injection risk (no SQL). React auto-escapes user content, preventing XSS.

## Recommendations Priority

1. ~~Add auth to `/api/results` and `/api/seed`~~ ✅ Done
2. Add wallet signature verification to `/api/predict` (critical, moderate effort)
3. Add rate limiting (medium, moderate effort)
4. ~~Add PFP file size check~~ ✅ Done
