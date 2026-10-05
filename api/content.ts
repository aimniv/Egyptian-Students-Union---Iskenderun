import { getStore } from './_lib/store.js';
import { json, readJson } from './_lib/auth.js';
import { byteSize, isPublicKey, MAX_BYTES, publicKey, PUBLIC_KEYS, requireAdmin } from './_lib/content.js';

async function handle(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const values = await getStore().mget<unknown>(...PUBLIC_KEYS.map(publicKey));
    const content: Record<string, unknown> = {};
    PUBLIC_KEYS.forEach((k, i) => {
      if (values[i] !== null && values[i] !== undefined) content[k] = values[i];
    });
    // Visitors may be served from the edge cache for a few seconds; administrators ask for a fresh copy.
    const cache = url.searchParams.has('fresh') ? 'no-store' : 'public, s-maxage=15, stale-while-revalidate=60';
    return json(200, { content }, { 'Cache-Control': cache });
  }

  if (req.method === 'PUT') {
    const admin = await requireAdmin(req);
    if (admin instanceof Response) return admin;
    const key = url.searchParams.get('key');
    if (!isPublicKey(key)) return json(400, { error: 'invalid_key' });
    const { value } = await readJson(req);
    if (value === null || typeof value !== 'object') return json(400, { error: 'invalid_value' });
    if (byteSize(value) > MAX_BYTES) return json(413, { error: 'too_large' });
    await getStore().set(publicKey(key), value);
    return json(200, { ok: true });
  }

  return json(405, { error: 'method_not_allowed' });
}

export default {
  async fetch(req: Request): Promise<Response> {
    try {
      return await handle(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      console.error('content error', msg);
      return json(msg === 'STORE_NOT_CONFIGURED' ? 503 : 500, { error: msg === 'STORE_NOT_CONFIGURED' ? 'not_configured' : 'server_error' });
    }
  },
};
