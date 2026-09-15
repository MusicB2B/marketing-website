import { NextResponse } from 'next/server';
import { MailNotConfigured, sendEnquiry } from '@/lib/mail';

export const runtime = 'nodejs';

const LIMITS = { name: 100, email: 200, subject: 150, message: 4000 };

/** Per-IP throttle. In-memory, so it resets on redeploy and is per-instance —
 *  enough to blunt casual abuse, not a substitute for a real WAF. */
const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

function field(raw: unknown, key: keyof typeof LIMITS): string | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (!value || value.length > LIMITS[key]) return null;
  return value;
}

// Deliberately permissive — the aim is to catch typos, not to police addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: a field hidden from people but filled in by naive bots.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = field(body.name, 'name');
  const email = field(body.email, 'email');
  const subject = field(body.subject, 'subject');
  const message = field(body.message, 'message');

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: 'That email address looks wrong.' }, { status: 400 });
  }

  try {
    await sendEnquiry({ name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof MailNotConfigured) {
      console.error('Contact form is not configured:', error.message);
      return NextResponse.json(
        { error: 'The form is not connected yet. Please email us directly for now.' },
        { status: 503 },
      );
    }
    console.error('Failed to send enquiry:', error);
    return NextResponse.json(
      { error: 'Could not send that. Please try again in a moment.' },
      { status: 502 },
    );
  }
}
