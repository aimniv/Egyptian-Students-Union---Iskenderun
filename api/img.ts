import { createHash } from 'node:crypto';
import { getStore } from './_lib/store.js';
import { json, readJson } from './_lib/auth.js';
import { MAX_BYTES, requireAdmin } from './_lib/content.js';

/**
 * Images are stored apart from the site content so a few photos can never push the content over the
 * database size limit. The id is a hash of the data, so the same picture always gets the same URL
 * and can be cached forever.
 */
const DATA_URL = /^data:(image\/(?:png|jpeg|webp|gif|svg\+xml));base64,([A-Za-z0-9+/=]+)$/;
const imgKey = (id: string) => `img:${id}`;

async function handle(req: Request): Promise<Response> {
  const store = getStore();

  if (req.method === 'GET') {
    const id = new URL(req.url).searchParams.get('id') ?? '';
    if (!/^[a-f0-9]{24}$/.test(id)) return json(404, { error: 'not_found' });
    const img = await store.get<{ type: string; b64: string }>(imgKey(id));
    if (!img) return json(404, { error: 'not_found' });
    return new Response(Buffer.from(img.b64, 'base64'), {
      headers: {
        'Content-Type': img.type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        // an uploaded SVG must never be able to run scripts on this origin
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  }

  if (req.method === 'PUT') {
    const admin = await requireAdmin(req);
    if (admin instanceof Response) return admin;
    const body = await readJson(req);
    const dataUrl = typeof body.dataUrl === 'string' ? body.dataUrl : '';
    const match = DATA_URL.exec(dataUrl);
    if (!match) return json(400, { error: 'invalid_image' });
    if (dataUrl.length > MAX_BYTES) return json(413, { error: 'too_large' });
    const id = createHash('sha256').update(dataUrl).digest('hex').slice(0, 24);
    await store.set(imgKey(id), { type: match[1], b64: match[2] });
    return json(200, { url: `/api/img?id=${id}` });
  }

  return json(405, { error: 'method_not_allowed' });
}

export default {
  async fetch(req: Request): Promise<Response> {
    try {
      return await handle(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      console.error('img error', msg);
      return json(msg === 'STORE_NOT_CONFIGURED' ? 503 : 500, { error: msg === 'STORE_NOT_CONFIGURED' ? 'not_configured' : 'server_error' });
    }
  },
};
