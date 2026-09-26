import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// cookies() is a Next server API; the pure token functions are what matter here.
vi.mock('next/headers', () => ({ cookies: vi.fn() }));

import {
  checkPassword,
  createSessionToken,
  verifySessionToken,
  editorConfigured,
} from '@/lib/auth';

const SECRET = 'a'.repeat(64);

beforeEach(() => {
  process.env.EDITOR_PASSWORD = 'correct horse battery staple';
  process.env.EDITOR_SESSION_SECRET = SECRET;
  delete process.env.EDITOR_SESSION_HOURS;
});

afterEach(() => vi.useRealTimers());

describe('checkPassword', () => {
  it('accepts the configured password', () => {
    expect(checkPassword('correct horse battery staple')).toBe(true);
  });

  it('rejects a wrong password', () => {
    expect(checkPassword('nope')).toBe(false);
  });

  it('rejects a prefix of the real password', () => {
    expect(checkPassword('correct')).toBe(false);
  });

  it('rejects an empty password even though the comparison is constant-time', () => {
    expect(checkPassword('')).toBe(false);
  });

  it('throws when no password is configured, rather than letting anyone in', () => {
    delete process.env.EDITOR_PASSWORD;
    expect(() => checkPassword('anything')).toThrow();
  });
});

describe('session tokens', () => {
  it('accepts a token it just issued', () => {
    expect(verifySessionToken(createSessionToken().token)).toBe(true);
  });

  it('rejects nothing at all', () => {
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken('')).toBe(false);
  });

  it('rejects a token with a tampered signature', () => {
    const { token } = createSessionToken();
    const [payload] = token.split('.');
    expect(verifySessionToken(`${payload}.${'0'.repeat(64)}`)).toBe(false);
  });

  // The attack this guards: extend your own session by editing the timestamp.
  it('rejects a token whose expiry was moved forward', () => {
    const { token } = createSessionToken();
    const [, signature] = token.split('.');
    const future = Date.now() + 1000 * 60 * 60 * 24 * 365;
    expect(verifySessionToken(`${future}.${signature}`)).toBe(false);
  });

  it('rejects a token signed with a different secret', () => {
    const { token } = createSessionToken();
    process.env.EDITOR_SESSION_SECRET = 'b'.repeat(64);
    expect(verifySessionToken(token)).toBe(false);
  });

  it('rejects a token once it has expired', () => {
    vi.useFakeTimers();
    const { token, maxAge } = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
    vi.advanceTimersByTime((maxAge + 60) * 1000);
    expect(verifySessionToken(token)).toBe(false);
  });

  it('honours EDITOR_SESSION_HOURS', () => {
    process.env.EDITOR_SESSION_HOURS = '2';
    expect(createSessionToken().maxAge).toBe(2 * 60 * 60);
  });

  it('falls back to 12 hours when the setting is nonsense', () => {
    for (const bad of ['0', '-5', 'abc']) {
      process.env.EDITOR_SESSION_HOURS = bad;
      expect(createSessionToken().maxAge).toBe(12 * 60 * 60);
    }
  });

  it('throws when no signing secret is configured', () => {
    delete process.env.EDITOR_SESSION_SECRET;
    expect(() => createSessionToken()).toThrow(/EDITOR_SESSION_SECRET/);
  });
});

describe('editorConfigured', () => {
  it('is true only when both the password and the secret are set', () => {
    expect(editorConfigured()).toBe(true);
    delete process.env.EDITOR_PASSWORD;
    expect(editorConfigured()).toBe(false);
  });
});
