// Manages the user's collectible sticker album in localStorage

export const COLLECTION_KEY = (userId: string) => `walcup-collection-${userId}`;

export function getCollection(userId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COLLECTION_KEY(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCollection(userId: string, teamIds: string[]): string[] {
  const current = new Set(getCollection(userId));
  teamIds.forEach((t) => current.add(t));
  const updated = Array.from(current);
  localStorage.setItem(COLLECTION_KEY(userId), JSON.stringify(updated));
  return updated;
}
