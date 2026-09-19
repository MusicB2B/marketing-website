import { NextResponse } from 'next/server';
import { MailNotConfigured, sendEnquiry } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const LIMITS = { name: 100, email: 200, subject: 150, message: 4000 };

const SUBMIT_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };

function field(raw: unknown, key: keyof typeof LIMITS): string | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (!value || value.length > LIMITS[key]) return null;
  return value;
}

// Deliberately permissive — the aim is to catch typos, not to police addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const limited = rateLimit('contact', clientIp(request), SUBMIT_LIMIT);
  if (limited.limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
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
  // The form asks for name and email only; the rest stays supported so an
  // older client, or a future longer form, still works.
  const subject = field(body.subject, 'subject') ?? 'Early access request';
  const message = field(body.message, 'message') ?? '(no message)';

  if (!name || !email) {
    return NextResponse.json({ error: 'Please fill in both fields.' }, { status: 400 });
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
