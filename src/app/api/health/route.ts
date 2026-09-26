import { NextResponse } from 'next/server';
import { loadContent } from '@/lib/store';
import { clientIp, rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LIMIT = { max: 60, windowMs: 60 * 60 * 1000 };

type Check = 'ok' | 'misconfigured' | 'failing';

/**
 * A shallow health check for the uptime monitor.
 *
 * It deliberately verifies the contact form's *plumbing* rather than sending a
 * message: a monitor that submits the real form would put a test enquiry in
 * the team's inbox every few minutes. Checking that the Resend key still
 * authenticates catches the failure that actually matters — a key that expired
 * or an account that hit its limit — without the noise.
 *
 * Nothing here reveals a secret: every check reports only ok / misconfigured /
 * failing.
 */
async function checkMail(): Promise<Check> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !process.env.CONTACT_EMAIL) return 'misconfigured';
  try {
    // Read-only, sends nothing, and 401s on a dead key.
    const response = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
    });
    return response.ok ? 'ok' : 'failing';
  } catch {
    return 'failing';
  }
}

function checkContent(): Check {
  try {
    const content = loadContent();
    const visible = content.sections.filter((section) => section.visible);
    // An empty page is a valid save but never an intended one.
    return visible.length > 0 ? 'ok' : 'failing';
  } catch {
    return 'failing';
  }
}

function checkPublishing(): Check {
  const configured =
    process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO;
  return configured ? 'ok' : 'misconfigured';
}

function checkEditor(): Check {
  return process.env.EDITOR_PASSWORD && process.env.EDITOR_SESSION_SECRET ? 'ok' : 'misconfigured';
}

export async function GET(request: Request) {
  if (rateLimit('health', clientIp(request), LIMIT).limited) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const checks = {
    content: checkContent(),
    mail: await checkMail(),
    publishing: checkPublishing(),
    editor: checkEditor(),
  };

  const ok = Object.values(checks).every((check) => check === 'ok');

  return NextResponse.json(
    { ok, checks, checkedAt: new Date().toISOString() },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
