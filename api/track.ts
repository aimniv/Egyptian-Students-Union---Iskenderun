import { allow, clientIp, json, readJson, sameOriginOk } from './_lib/auth.js';
import { readList } from './_lib/content.js';

/** Lets a visitor look up their own application or ticket by its (unguessable) code. */
async function handle(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!sameOriginOk(req)) return json(403, { error: 'forbidden' });
  if (!(await allow(`track:ip:${clientIp(req)}`, 30, 900))) return json(429, { error: 'too_many_attempts' });

  const body = await readJson(req);
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (code.length < 6 || code.length > 40) return json(404, { error: 'not_found' });

  if (body.kind === 'membership') {
    const found = (await readList<{ id: string }>('memberships')).find((m) => m.id.toUpperCase() === code);
    return found ? json(200, { record: found }) : json(404, { error: 'not_found' });
  }
  if (body.kind === 'complaint') {
    const found = (await readList<{ ticketNumber: string; internalNotes?: string; assignedAdmin?: string }>('complaints'))
      .find((c) => c.ticketNumber.toUpperCase() === code);
    if (!found) return json(404, { error: 'not_found' });
    const { internalNotes: _n, assignedAdmin: _a, ...visible } = found;
    return json(200, { record: visible });
  }
  return json(400, { error: 'invalid_kind' });
}

export default {
  async fetch(req: Request): Promise<Response> {
    try {
      return await handle(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      console.error('track error', msg);
      return json(msg === 'STORE_NOT_CONFIGURED' ? 503 : 500, { error: msg === 'STORE_NOT_CONFIGURED' ? 'not_configured' : 'server_error' });
    }
  },
};
