import { getStore } from './_lib/store.js';
import { allow, clientIp, json } from './_lib/auth.js';

/**
 * Membership ID photos. They are kept apart from the application record (which lives in one JSON list
 * with a size limit) and are only reachable with the application code, so they are never listed publicly.
 */
export const photoKey = (id: string) => `mphoto:${id}`;
export const MEMBER_ID = /^MEMB-[A-Z2-9]{8}$/;

async function handle(req: Request): Promise<Response> {
  if (req.method !== 'GET') return json(405, { error: 'method_not_allowed' });
  if (!(await allow(`photo:ip:${clientIp(req)}`, 120, 900))) return json(429, { error: 'too_many_attempts' });

  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!MEMBER_ID.test(id)) return json(404, { error: 'not_found' });
  const photo = await getStore().get<{ b64: string }>(photoKey(id));
  if (!photo) return json(404, { error: 'not_found' });

  return new Response(Buffer.from(photo.b64, 'base64'), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export default {
  async fetch(req: Request): Promise<Response> {
    try {
      return await handle(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      console.error('photo error', msg);
      return json(msg === 'STORE_NOT_CONFIGURED' ? 503 : 500, { error: msg === 'STORE_NOT_CONFIGURED' ? 'not_configured' : 'server_error' });
    }
  },
};
