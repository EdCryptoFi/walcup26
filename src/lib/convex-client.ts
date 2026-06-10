/**
 * Lightweight Convex HTTP client using raw fetch.
 * Avoids dependency on convex/_generated so the main app compiles
 * without running `npx convex dev` first.
 */

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL; // e.g. https://happy-animal-123.convex.cloud

export function isConvexConfigured(): boolean {
  return !!CONVEX_URL;
}

export async function convexQuery<T = unknown>(
  path: string,
  args: Record<string, unknown> = {}
): Promise<T | null> {
  if (!CONVEX_URL) return null;
  try {
    const res = await fetch(`${CONVEX_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, args, format: 'json' }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`Convex query ${path} failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data.value as T;
  } catch (err) {
    console.error(`Convex query ${path} error:`, err);
    return null;
  }
}

export async function convexMutation<T = unknown>(
  path: string,
  args: Record<string, unknown> = {}
): Promise<T | null> {
  if (!CONVEX_URL) return null;
  try {
    const res = await fetch(`${CONVEX_URL}/api/mutation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, args, format: 'json' }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`Convex mutation ${path} failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data.value as T;
  } catch (err) {
    console.error(`Convex mutation ${path} error:`, err);
    return null;
  }
}
