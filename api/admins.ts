import {
  getSessionUser, getUser, inviteMailFor, json, listUsers, normalizeEmail, readJson, removeUser,
  sameOriginOk, saveUser,
} from './_lib/auth.js';

async function handle(req: Request): Promise<Response> {
  if (!sameOriginOk(req)) return json(403, { error: 'forbidden' });
  const me = await getSessionUser(req);
  if (!me) return json(401, { error: 'unauthenticated' });

  if (req.method === 'GET') {
    const users = await listUsers();
    return json(200, {
      admins: users.map((u) => ({
        email: u.email,
        name: u.name,
        hasPassword: !!u.passwordHash,
        createdAt: u.createdAt,
        createdBy: u.createdBy,
      })),
      me: me.email,
    });
  }

  const body = await readJson(req);
  const email = normalizeEmail(body.email);
  if (!email) return json(400, { error: 'invalid_email' });

  if (req.method === 'POST') {
    if (await getUser(email)) return json(409, { error: 'already_exists' });
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 100) : email;
    await saveUser({ email, name, passwordHash: null, createdAt: new Date().toISOString(), createdBy: me.email });
    const invited = await inviteMailFor(req, email, me.name);
    return json(201, { ok: true, invited });
  }

  if (req.method === 'DELETE') {
    if (email === me.email) return json(400, { error: 'cannot_remove_self' });
    if (!(await getUser(email))) return json(404, { error: 'not_found' });
    await removeUser(email);
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
      console.error('admins error', msg);
      if (msg === 'STORE_NOT_CONFIGURED' || msg === 'MAIL_NOT_CONFIGURED') return json(503, { error: 'not_configured' });
      return json(500, { error: 'server_error' });
    }
  },
};
