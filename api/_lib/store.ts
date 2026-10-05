import { Redis } from '@upstash/redis';

export interface Store {
  get<T>(key: string): Promise<T | null>;
  mget<T>(...keys: string[]): Promise<(T | null)[]>;
  set(key: string, value: unknown, ttlSec?: number): Promise<void>;
  del(...keys: string[]): Promise<void>;
  /** Increments a counter; the TTL is set when the counter is created. */
  incr(key: string, ttlSec: number): Promise<number>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
}

class MemoryStore implements Store {
  private data = new Map<string, { value: unknown; exp: number | null }>();
  private sets = new Map<string, Set<string>>();

  private live(key: string) {
    const e = this.data.get(key);
    if (e && e.exp !== null && e.exp <= Date.now()) {
      this.data.delete(key);
      return undefined;
    }
    return e;
  }
  async get<T>(key: string) {
    return (this.live(key)?.value as T) ?? null;
  }
  async mget<T>(...keys: string[]) {
    return keys.map((k) => (this.live(k)?.value as T) ?? null);
  }
  async set(key: string, value: unknown, ttlSec?: number) {
    this.data.set(key, { value, exp: ttlSec ? Date.now() + ttlSec * 1000 : null });
  }
  async del(...keys: string[]) {
    keys.forEach((k) => {
      this.data.delete(k);
      this.sets.delete(k);
    });
  }
  async incr(key: string, ttlSec: number) {
    const cur = this.live(key);
    const n = ((cur?.value as number) ?? 0) + 1;
    this.data.set(key, { value: n, exp: cur ? cur.exp : Date.now() + ttlSec * 1000 });
    return n;
  }
  async sadd(key: string, member: string) {
    if (!this.sets.has(key)) this.sets.set(key, new Set());
    this.sets.get(key)!.add(member);
  }
  async srem(key: string, member: string) {
    this.sets.get(key)?.delete(member);
  }
  async smembers(key: string) {
    return [...(this.sets.get(key) ?? [])];
  }
}

class UpstashStore implements Store {
  constructor(private r: Redis) {}
  get<T>(key: string) {
    return this.r.get<T>(key);
  }
  async mget<T>(...keys: string[]) {
    return keys.length ? ((await this.r.mget<(T | null)[]>(...keys)) as (T | null)[]) : [];
  }
  async set(key: string, value: unknown, ttlSec?: number) {
    if (ttlSec) await this.r.set(key, value, { ex: ttlSec });
    else await this.r.set(key, value);
  }
  async del(...keys: string[]) {
    if (keys.length) await this.r.del(...keys);
  }
  async incr(key: string, ttlSec: number) {
    const n = await this.r.incr(key);
    if (n === 1) await this.r.expire(key, ttlSec);
    return n;
  }
  async sadd(key: string, member: string) {
    await this.r.sadd(key, member);
  }
  async srem(key: string, member: string) {
    await this.r.srem(key, member);
  }
  async smembers(key: string) {
    return this.r.smembers(key);
  }
}

let instance: Store | null = null;

export function getStore(): Store {
  if (instance) return instance;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) {
    instance = new UpstashStore(new Redis({ url, token }));
  } else if (process.env.VERCEL) {
    // In-memory state would be lost between serverless invocations; refuse to run.
    throw new Error('STORE_NOT_CONFIGURED');
  } else {
    instance = new MemoryStore();
  }
  return instance;
}
