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
/**
 * Mail is reported on configuration alone, deliberately.
 *
 * There is no Resend endpoint that a sending-only key can read: probing
 * /domains with one returns 401, exactly as a revoked key does, so a liveness
 * probe cannot tell a healthy key from a dead one. An earlier version did
 * exactly that and reported a working form as broken. A check that cries wolf
 * every half hour is worse than no check, because it trains everyone to ignore
 * the alerts.
 *
 * Do not re-add an API probe here without first confirming Resend has an
 * endpoint a sending-only key can read. The form's liveness is covered
 * separately: the monitor posts an invalid submission and asserts a 400, which
 * proves the route is up and validating without sending anything.
 */
function checkMail(): Check {
  return process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL ? 'ok' : 'misconfigured';
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
    mail: checkMail(),
    publishing: checkPublishing(),
    editor: checkEditor(),
  };

  const ok = Object.values(checks).every((check) => check === 'ok');

  return NextResponse.json(
    { ok, checks, checkedAt: new Date().toISOString() },
    { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
