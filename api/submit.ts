import { randomInt } from 'node:crypto';
import { getStore } from './_lib/store.js';
import { allow, clientIp, json, normalizeEmail, readJson, sameOriginOk } from './_lib/auth.js';
import { byteSize, MAX_BYTES, MAX_ITEMS, publicKey, readList, writeList } from './_lib/content.js';
import { photoKey } from './photo.js';

// A 480x600 JPEG is roughly 40-80 KB; anything bigger than this is not a card photo.
const PHOTO = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/;
const MAX_PHOTO_CHARS = 250_000;

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code = (n: number) => Array.from({ length: n }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  (allowed as readonly string[]).includes(v as string) ? (v as T) : fallback;

async function append(key: 'memberships' | 'messages' | 'complaints' | 'registrations', record: { id: string } & Record<string, unknown>) {
  const list = await readList(key);
  if (list.length >= MAX_ITEMS || byteSize(list) + byteSize(record) > MAX_BYTES) throw new Error('FULL');
  list.push(record);
  await writeList(key, list);
}

async function handle(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!sameOriginOk(req)) return json(403, { error: 'forbidden' });
  if (!(await allow(`submit:ip:${clientIp(req)}`, 30, 3600))) return json(429, { error: 'too_many_attempts' });

  const body = await readJson(req);
  const d = (body.data && typeof body.data === 'object' ? body.data : {}) as Record<string, unknown>;
  const now = new Date().toISOString();

  if (body.kind === 'membership') {
    const email = normalizeEmail(d.email);
    const nameAr = str(d.nameAr, 120);
    const nameEn = str(d.nameEn, 120);
    const passportOrId = str(d.passportOrId, 60);
    const phone = str(d.phone, 40);
    if (!email || !(nameAr || nameEn) || !passportOrId || !phone) return json(400, { error: 'invalid_input' });
    const id = 'MEMB-' + code(8);
    const photoData = typeof d.photo === 'string' ? d.photo : '';
    const photoMatch = photoData ? PHOTO.exec(photoData) : null;
    if (photoData && (!photoMatch || photoData.length > MAX_PHOTO_CHARS)) return json(400, { error: 'invalid_photo' });
    if (photoMatch) await getStore().set(photoKey(id), { b64: photoMatch[1] });
    await append('memberships', {
      id, studentNumber: 'MOB-ST-' + (260000 + randomInt(0, 1000)), nameAr, nameEn, passportOrId, email, phone,
      whatsapp: str(d.whatsapp, 40) || phone, university: str(d.university, 160), faculty: str(d.faculty, 160),
      major: str(d.major, 160), academicYear: str(d.academicYear, 40), residenceAddress: str(d.residenceAddress, 300),
      status: 'pending', appliedDate: now.slice(0, 10), type: pick(d.type, ['new', 'renewal'] as const, 'new'),
      ...(photoMatch ? { photoUrl: `/api/photo?id=${id}` } : {}),
    });
    return json(201, { code: id });
  }

  if (body.kind === 'message') {
    const email = normalizeEmail(d.email);
    const name = str(d.name, 120);
    const message = str(d.message, 5000);
    if (!email || !name || !message) return json(400, { error: 'invalid_input' });
    const id = 'MSG-' + Date.now() + '-' + code(4);
    await append('messages', {
      id, name, email, phone: str(d.phone, 40), subject: str(d.subject, 200) || 'General Inquiry', message,
      date: now, language: pick(d.language, ['ar', 'tr', 'en'] as const, 'ar'), status: 'new',
    });
    return json(201, { code: id });
  }

  if (body.kind === 'complaint') {
    const email = normalizeEmail(d.email);
    const name = str(d.name, 120);
    const subject = str(d.subject, 200);
    const details = str(d.details, 5000);
    if (!email || !name || !subject || !details) return json(400, { error: 'invalid_input' });
    const ticketNumber = 'MOB-REQ-2026-' + code(6);
    await append('complaints', {
      id: 'COMP-' + Date.now() + '-' + code(4), ticketNumber, name, email, phone: str(d.phone, 40),
      category: pick(d.category, ['academic', 'services', 'logistics', 'harassment_safety', 'union_activities', 'other'] as const, 'other'),
      subject, details, date: now, status: 'new',
      priority: pick(d.priority, ['low', 'medium', 'high', 'urgent'] as const, 'medium'),
    });
    return json(201, { code: ticketNumber });
  }

  if (body.kind === 'registration') {
    const email = normalizeEmail(d.email);
    const name = str(d.name, 120);
    const phone = str(d.phone, 40);
    const eventId = str(d.eventId, 100);
    if (!email || !name || !phone || !eventId) return json(400, { error: 'invalid_input' });

    // When the events live on the server, enforce capacity and keep the counter accurate.
    const store = getStore();
    const events = await store.get<{ id: string; capacity?: number; registeredCount?: number }[]>(publicKey('events'));
    if (Array.isArray(events)) {
      const ev = events.find((e) => e.id === eventId);
      if (!ev) return json(404, { error: 'event_not_found' });
      if (typeof ev.capacity === 'number' && ev.capacity > 0 && (ev.registeredCount ?? 0) >= ev.capacity) {
        return json(409, { error: 'event_full' });
      }
      ev.registeredCount = (ev.registeredCount ?? 0) + 1;
      await store.set(publicKey('events'), events);
    }
    const id = 'TKT-' + code(6);
    await append('registrations', {
      id, eventId, name, email, phone, whatsapp: str(d.whatsapp, 40) || phone, registeredDate: now, attended: false,
    });
    return json(201, { code: id });
  }

  return json(400, { error: 'invalid_kind' });
}

export default {
  async fetch(req: Request): Promise<Response> {
    try {
      return await handle(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      console.error('submit error', msg);
      if (msg === 'FULL') return json(507, { error: 'storage_full' });
      return json(msg === 'STORE_NOT_CONFIGURED' ? 503 : 500, { error: msg === 'STORE_NOT_CONFIGURED' ? 'not_configured' : 'server_error' });
    }
  },
};
