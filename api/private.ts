import { getStore } from './_lib/store.js';
import { json, readJson } from './_lib/auth.js';
import {
  byteSize, isPrivateKey, MAX_BYTES, MAX_ITEMS, privateKey, PRIVATE_KEYS, readList, requireAdmin, writeList,
} from './_lib/content.js';

const isItem = (v: unknown): v is { id: string } =>
  !!v && typeof v === 'object' && typeof (v as { id?: unknown }).id === 'string' && (v as { id: string }).id.length <= 100;

async function handle(req: Request): Promise<Response> {
  const admin = await requireAdmin(req);
  if (admin instanceof Response) return admin;
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const values = await getStore().mget<unknown[]>(...PRIVATE_KEYS.map(privateKey));
    const data: Record<string, unknown[]> = {};
    PRIVATE_KEYS.forEach((k, i) => {
      data[k] = Array.isArray(values[i]) ? (values[i] as unknown[]) : [];
    });
    return json(200, { data });
  }

  // PATCH applies only the items this administrator changed, so entries that arrived
  // from visitors in the meantime are never overwritten by a stale copy of the list.
  if (req.method === 'PATCH') {
    const key = url.searchParams.get('key');
    if (!isPrivateKey(key)) return json(400, { error: 'invalid_key' });
    const body = await readJson(req);
    const upsert = Array.isArray(body.upsert) ? body.upsert : [];
    const remove = Array.isArray(body.remove) ? body.remove : [];
    if (!upsert.every(isItem) || !remove.every((id) => typeof id === 'string')) return json(400, { error: 'invalid_value' });

    const removed = new Set<string>(remove as string[]);
    const list = (await readList<{ id: string }>(key)).filter((item) => !removed.has(item.id));
    const index = new Map(list.map((item, i) => [item.id, i]));
    for (const item of upsert) {
      const at = index.get(item.id);
      if (at === undefined) {
        index.set(item.id, list.length);
        list.push(item);
      } else {
        list[at] = item;
      }
    }
    if (list.length > MAX_ITEMS || byteSize(list) > MAX_BYTES) return json(413, { error: 'too_large' });
    await writeList(key, list);
    return json(200, { ok: true, count: list.length });
  }

  return json(405, { error: 'method_not_allowed' });
}

export default {
  async fetch(req: Request): Promise<Response> {
    try {
      return await handle(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      console.error('private error', msg);
      return json(msg === 'STORE_NOT_CONFIGURED' ? 503 : 500, { error: msg === 'STORE_NOT_CONFIGURED' ? 'not_configured' : 'server_error' });
    }
  },
};
