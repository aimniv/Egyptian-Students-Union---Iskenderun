import { getStore } from './store.js';
import { getSessionUser, json, sameOriginOk, type AdminUser } from './auth.js';

/** Collections every visitor may read; only administrators may write them. */
export const PUBLIC_KEYS = [
  'board', 'guides', 'events', 'activities', 'announcements', 'media', 'sponsors', 'settings', 'translations',
] as const;

/** Collections only administrators may read or change (visitors can only append through /api/submit). */
export const PRIVATE_KEYS = ['memberships', 'messages', 'complaints', 'registrations', 'volunteers', 'activityLogs'] as const;

export type PublicKey = (typeof PUBLIC_KEYS)[number];
export type PrivateKey = (typeof PRIVATE_KEYS)[number];

// Upstash rejects request bodies above 1 MB.
export const MAX_BYTES = 900_000;
export const MAX_ITEMS = 5000;

export const publicKey = (k: PublicKey) => `content:${k}`;
export const privateKey = (k: PrivateKey) => `priv:${k}`;

export const isPublicKey = (k: unknown): k is PublicKey => (PUBLIC_KEYS as readonly string[]).includes(k as string);
export const isPrivateKey = (k: unknown): k is PrivateKey => (PRIVATE_KEYS as readonly string[]).includes(k as string);

export const byteSize = (v: unknown) => Buffer.byteLength(JSON.stringify(v));

/** Returns the signed-in administrator, or a ready-made error response. */
export async function requireAdmin(req: Request): Promise<AdminUser | Response> {
  if (!sameOriginOk(req)) return json(403, { error: 'forbidden' });
  const user = await getSessionUser(req);
  return user ?? json(401, { error: 'unauthenticated' });
}

export async function readList<T = Record<string, unknown>>(key: PrivateKey): Promise<T[]> {
  const v = await getStore().get<T[]>(privateKey(key));
  return Array.isArray(v) ? v : [];
}

export async function writeList(key: PrivateKey, list: unknown[]) {
  await getStore().set(privateKey(key), list);
}
