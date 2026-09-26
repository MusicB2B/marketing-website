import { describe, it, expect } from 'vitest';
import { rateLimit, resetLimit, clientIp } from '@/lib/rateLimit';

const LIMIT = { max: 3, windowMs: 60_000 };
// Each test uses its own bucket name; the store is module-level state.
let n = 0;
const bucket = () => `test-${n++}`;

describe('rateLimit', () => {
  it('allows up to the limit then blocks', () => {
    const name = bucket();
    for (let i = 0; i < LIMIT.max; i++) {
      expect(rateLimit(name, '1.1.1.1', LIMIT).limited).toBe(false);
    }
    expect(rateLimit(name, '1.1.1.1', LIMIT).limited).toBe(true);
  });

  it('reports how long to wait once blocked', () => {
    const name = bucket();
    for (let i = 0; i <= LIMIT.max; i++) rateLimit(name, '2.2.2.2', LIMIT);
    const result = rateLimit(name, '2.2.2.2', LIMIT);
    expect(result.limited).toBe(true);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('keeps each IP separate', () => {
    const name = bucket();
    for (let i = 0; i <= LIMIT.max; i++) rateLimit(name, '3.3.3.3', LIMIT);
    expect(rateLimit(name, '3.3.3.3', LIMIT).limited).toBe(true);
    expect(rateLimit(name, '4.4.4.4', LIMIT).limited).toBe(false);
  });

  it('keeps each endpoint separate', () => {
    const a = bucket();
    const b = bucket();
    for (let i = 0; i <= LIMIT.max; i++) rateLimit(a, '5.5.5.5', LIMIT);
    expect(rateLimit(a, '5.5.5.5', LIMIT).limited).toBe(true);
    expect(rateLimit(b, '5.5.5.5', LIMIT).limited).toBe(false);
  });

  // A successful sign-in clears the count, so a legitimate fumble costs nothing.
  it('resetLimit clears a blocked IP', () => {
    const name = bucket();
    for (let i = 0; i <= LIMIT.max; i++) rateLimit(name, '6.6.6.6', LIMIT);
    expect(rateLimit(name, '6.6.6.6', LIMIT).limited).toBe(true);
    resetLimit(name, '6.6.6.6');
    expect(rateLimit(name, '6.6.6.6', LIMIT).limited).toBe(false);
  });

  // Once tripped, the window must not slide away while attempts continue.
  it('stays blocked for the whole window even under continued attempts', () => {
    const name = bucket();
    for (let i = 0; i <= LIMIT.max; i++) rateLimit(name, '7.7.7.7', LIMIT);
    for (let i = 0; i < 10; i++) {
      expect(rateLimit(name, '7.7.7.7', LIMIT).limited).toBe(true);
    }
  });
});

describe('clientIp', () => {
  it('takes the first address from x-forwarded-for', () => {
    const request = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '9.9.9.9, 10.0.0.1, 172.16.0.1' },
    });
    expect(clientIp(request)).toBe('9.9.9.9');
  });

  it('falls back to x-real-ip', () => {
    const request = new Request('https://example.com', {
      headers: { 'x-real-ip': '8.8.8.8' },
    });
    expect(clientIp(request)).toBe('8.8.8.8');
  });

  it('returns a placeholder rather than throwing when neither header is present', () => {
    expect(clientIp(new Request('https://example.com'))).toBe('unknown');
  });
});
