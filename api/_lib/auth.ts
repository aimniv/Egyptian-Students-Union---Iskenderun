import { getStore } from './store.js';
import { randomCode, randomToken, safeEqual, sha256 } from './crypto.js';
import { codeMail, inviteMail, sendMail } from './mail.js';

export interface AdminUser {
  email: string;
  name: string;
  passwordHash: string | null;
  createdAt: string;
  createdBy: string;
}

export type OtpPurpose = 'login' | 'setup';

const OTP_TTL = 10 * 60;
const OTP_MAX_ATTEMPTS = 5;
const SESSION_TTL = 12 * 60 * 60;

const ADMINS_SET = 'admins';
const userKey = (email: string) => `admin:${email}`;
const otpKey = (purpose: OtpPurpose, email: string) => `otp:${purpose}:${email}`;
const sessKey = (id: string) => `sess:${sha256(id)}`;
const userSessKey = (email: string) => `usess:${email}`;

// ---------- http helpers ----------

export function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}

export const clientIp = (req: Request) =>
  req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

export function normalizeEmail(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const e = v.trim().toLowerCase();
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

/** Rejects cross-site state-changing requests (cookies are also SameSite=Strict). */
export function sameOriginOk(req: Request): boolean {
  if (req.method === 'GET' || req.method === 'HEAD') return true;
  if (!req.headers.get('content-type')?.includes('application/json')) return false;
  const origin = req.headers.get('origin');
  if (!origin) return true;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const b = await req.json();
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

// ---------- cookies / sessions ----------

const secureCookies = () => !!process.env.VERCEL;
const cookieName = () => (secureCookies() ? '__Host-mob_session' : 'mob_session');

function cookieString(value: string, maxAge: number) {
  return [
    `${cookieName()}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
    ...(secureCookies() ? ['Secure'] : []),
  ].join('; ');
}

export async function createSession(email: string): Promise<string> {
  const store = getStore();
  const id = randomToken();
  await store.set(sessKey(id), { email }, SESSION_TTL);
  await store.sadd(userSessKey(email), sha256(id));
  return cookieString(id, SESSION_TTL);
}

export const clearCookie = () => cookieString('', 0);

function readCookie(req: Request): string | null {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === cookieName()) return v.join('=') || null;
  }
  return null;
}

export async function getSessionUser(req: Request): Promise<AdminUser | null> {
  const id = readCookie(req);
  if (!id) return null;
  const store = getStore();
  const sess = await store.get<{ email: string }>(sessKey(id));
  if (!sess) return null;
  const user = await getUser(sess.email);
  if (!user) {
    await store.del(sessKey(id));
    return null;
  }
  return user;
}

export async function destroySession(req: Request) {
  const id = readCookie(req);
  if (!id) return;
  const store = getStore();
  const sess = await store.get<{ email: string }>(sessKey(id));
  await store.del(sessKey(id));
  if (sess) await store.srem(userSessKey(sess.email), sha256(id));
}

export async function destroyAllSessions(email: string) {
  const store = getStore();
  const hashes = await store.smembers(userSessKey(email));
  await store.del(...hashes.map((h) => `sess:${h}`), userSessKey(email));
}

// ---------- users ----------

export const getUser = (email: string) => getStore().get<AdminUser>(userKey(email));

export async function saveUser(user: AdminUser) {
  const store = getStore();
  await store.set(userKey(user.email), user);
  await store.sadd(ADMINS_SET, user.email);
}

export async function removeUser(email: string) {
  const store = getStore();
  await destroyAllSessions(email);
  await store.del(userKey(email), otpKey('login', email), otpKey('setup', email));
  await store.srem(ADMINS_SET, email);
}

export async function listUsers(): Promise<AdminUser[]> {
  const store = getStore();
  const emails = await store.smembers(ADMINS_SET);
  const users = await Promise.all(emails.map(getUser));
  return users.filter((u): u is AdminUser => !!u).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * While no administrator exists, ADMIN_BOOTSTRAP_EMAIL may claim the first account
 * (it still has to prove mailbox ownership through the setup code).
 */
export async function ensureBootstrapUser(email: string) {
  const boot = normalizeEmail(process.env.ADMIN_BOOTSTRAP_EMAIL);
  if (!boot || boot !== email) return;
  const store = getStore();
  if ((await store.smembers(ADMINS_SET)).length > 0) return;
  await saveUser({
    email,
    name: email,
    passwordHash: null,
    createdAt: new Date().toISOString(),
    createdBy: 'bootstrap',
  });
}

// ---------- rate limit ----------

/** Returns true when the action is still allowed. */
export async function allow(key: string, limit: number, windowSec: number): Promise<boolean> {
  return (await getStore().incr(`rl:${key}`, windowSec)) <= limit;
}

// ---------- one-time codes ----------

interface OtpRecord {
  hash: string;
  salt: string;
  attempts: number;
  expiresAt: number;
}

export async function issueOtp(purpose: OtpPurpose, email: string) {
  const store = getStore();
  const code = randomCode();
  const salt = randomToken();
  const rec: OtpRecord = { hash: sha256(code + salt), salt, attempts: 0, expiresAt: Date.now() + OTP_TTL * 1000 };
  await store.set(otpKey(purpose, email), rec, OTP_TTL);
  const mail = codeMail(code, purpose);
  await sendMail(email, mail.subject, mail.text);
}

export async function checkOtp(purpose: OtpPurpose, email: string, code: unknown): Promise<boolean> {
  const store = getStore();
  const key = otpKey(purpose, email);
  const rec = await store.get<OtpRecord>(key);
  if (!rec || typeof code !== 'string') return false;
  const ttl = Math.ceil((rec.expiresAt - Date.now()) / 1000);
  if (ttl <= 0 || rec.attempts >= OTP_MAX_ATTEMPTS) {
    await store.del(key);
    return false;
  }
  if (safeEqual(sha256(code.trim() + rec.salt), rec.hash)) {
    await store.del(key);
    return true;
  }
  rec.attempts += 1;
  await store.set(key, rec, ttl);
  return false;
}

export const PASSWORD_MIN = 10;

/** Sends the invitation mail; a delivery problem must not undo the account creation. */
export async function inviteMailFor(req: Request, email: string, invitedBy: string): Promise<boolean> {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const proto = req.headers.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http');
  const mail = inviteMail(`${proto}://${host}/admin`, invitedBy);
  try {
    await sendMail(email, mail.subject, mail.text);
    return true;
  } catch {
    return false;
  }
}
