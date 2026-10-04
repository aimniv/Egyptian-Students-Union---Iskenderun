import { createHash, randomBytes, randomInt, scrypt, timingSafeEqual } from 'node:crypto';

const scryptAsync = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)))
  );

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt);
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

// Used when the account does not exist so response time does not reveal it.
const DUMMY_HASH = 'scrypt$AAAAAAAAAAAAAAAAAAAAAA==$' + Buffer.alloc(64).toString('base64');

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  const parts = (stored || DUMMY_HASH).split('$');
  const salt = Buffer.from(parts[1], 'base64');
  const expected = Buffer.from(parts[2], 'base64');
  const actual = await scryptAsync(password, salt);
  return timingSafeEqual(actual, expected) && !!stored;
}

export const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');

export const randomToken = () => randomBytes(32).toString('base64url');

export const randomCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
