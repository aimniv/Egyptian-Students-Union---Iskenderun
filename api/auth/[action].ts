import { hashPassword, verifyPassword } from '../_lib/crypto.js';
import {
  allow, checkOtp, clearCookie, clientIp, createSession, destroyAllSessions, destroySession,
  ensureBootstrapUser, getSessionUser, getUser, issueOtp, json, normalizeEmail, PASSWORD_MIN,
  readJson, saveUser, sameOriginOk,
} from '../_lib/auth.js';

const publicUser = (u: { email: string; name: string }) => ({ email: u.email, name: u.name });

async function handle(req: Request): Promise<Response> {
  const action = new URL(req.url).pathname.split('/').filter(Boolean).pop();

  if (!sameOriginOk(req)) return json(403, { error: 'forbidden' });

  if (action === 'me' && req.method === 'GET') {
    const user = await getSessionUser(req);
    return user ? json(200, publicUser(user)) : json(401, { error: 'unauthenticated' });
  }

  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  if (action === 'logout') {
    await destroySession(req);
    return json(200, { ok: true }, { 'Set-Cookie': clearCookie() });
  }

  const body = await readJson(req);
  const email = normalizeEmail(body.email);
  const ip = clientIp(req);
  if (!email) return json(400, { error: 'invalid_email' });

  if (action === 'login') {
    if (!(await allow(`login:ip:${ip}`, 40, 900)) || !(await allow(`login:email:${email}`, 10, 900))) {
      return json(429, { error: 'too_many_attempts' });
    }
    const user = await getUser(email);
    const ok = await verifyPassword(String(body.password ?? ''), user?.passwordHash);
    if (!user || !ok) return json(401, { error: 'invalid_credentials' });
    await issueOtp('login', email);
    return json(200, { step: 'otp' });
  }

  if (action === 'verify') {
    if (!(await allow(`verify:ip:${ip}`, 40, 900))) return json(429, { error: 'too_many_attempts' });
    const user = await getUser(email);
    if (!user || !(await checkOtp('login', email, body.code))) return json(401, { error: 'invalid_code' });
    const cookie = await createSession(email);
    return json(200, publicUser(user), { 'Set-Cookie': cookie });
  }

  if (action === 'setup-request') {
    // Always answers the same way so the endpoint does not reveal which emails are admins.
    if (!(await allow(`setup:ip:${ip}`, 20, 3600)) || !(await allow(`setup:email:${email}`, 3, 3600))) {
      return json(429, { error: 'too_many_attempts' });
    }
    await ensureBootstrapUser(email);
    if (await getUser(email)) await issueOtp('setup', email);
    return json(200, { ok: true });
  }

  if (action === 'setup-confirm') {
    if (!(await allow(`setupc:ip:${ip}`, 40, 900))) return json(429, { error: 'too_many_attempts' });
    const password = String(body.password ?? '');
    if (password.length < PASSWORD_MIN || password.length > 200) return json(400, { error: 'weak_password' });
    const user = await getUser(email);
    if (!user || !(await checkOtp('setup', email, body.code))) return json(401, { error: 'invalid_code' });
    await saveUser({ ...user, passwordHash: await hashPassword(password) });
    await destroyAllSessions(email);
    return json(200, { ok: true });
  }

  return json(404, { error: 'not_found' });
}

export default {
  async fetch(req: Request): Promise<Response> {
    try {
      return await handle(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      console.error('auth error', msg);
      if (msg === 'STORE_NOT_CONFIGURED' || msg === 'MAIL_NOT_CONFIGURED') return json(503, { error: 'not_configured' });
      if (msg.startsWith('MAIL_FAILED')) return json(502, { error: 'mail_failed' });
      return json(500, { error: 'server_error' });
    }
  },
};
