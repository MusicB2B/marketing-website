import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'fb_editor';

function secret(): string {
  const value = process.env.EDITOR_SESSION_SECRET;
  if (!value) {
    throw new Error('EDITOR_SESSION_SECRET is not set. Generate one with: openssl rand -hex 32');
  }
  return value;
}

function sessionHours(): number {
  const parsed = Number(process.env.EDITOR_SESSION_HOURS ?? 12);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

/** Constant-time compare that won't throw on length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.EDITOR_PASSWORD;
  if (!expected) {
    throw new Error('EDITOR_PASSWORD is not set.');
  }
  return safeEqual(candidate, expected);
}

export function createSessionToken(): { token: string; maxAge: number } {
  const maxAge = sessionHours() * 60 * 60;
  const expiresAt = Date.now() + maxAge * 1000;
  const payload = String(expiresAt);
  return { token: `${payload}.${sign(payload)}`, maxAge };
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const separator = token.lastIndexOf('.');
  if (separator < 1) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!safeEqual(signature, sign(payload))) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

/** Whether the current request carries a valid editor session. */
export async function isEditor(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
