import { NextResponse } from 'next/server';
import { SESSION_COOKIE, checkPassword, createSessionToken, editorConfigured } from '@/lib/auth';

export const runtime = 'nodejs';

/** Slows down brute-forcing the shared password a little. */
const DELAY_ON_FAILURE_MS = 700;

export async function POST(request: Request) {
  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!editorConfigured()) {
    console.error('Editor auth misconfigured: set EDITOR_PASSWORD and EDITOR_SESSION_SECRET.');
    return NextResponse.json(
      { error: 'The editor is not configured yet. A developer needs to set its password.' },
      { status: 503 },
    );
  }

  let valid = false;
  try {
    valid = checkPassword(password);
  } catch (error) {
    console.error('Editor auth misconfigured:', error);
    return NextResponse.json(
      { error: 'The editor is not configured yet. Ask a developer to set EDITOR_PASSWORD.' },
      { status: 500 },
    );
  }

  if (!valid) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_ON_FAILURE_MS));
    return NextResponse.json({ error: 'That password is not right.' }, { status: 401 });
  }

  const { token, maxAge } = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
