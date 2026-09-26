import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// jsdom implements neither of these, and components use both: matchMedia for
// prefers-reduced-motion, IntersectionObserver to pause work off-screen.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
}
vi.stubGlobal('IntersectionObserver', NoopObserver);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// Each test starts from a known environment rather than inheriting whatever
// the developer happens to have in .env.local.
const ORIGINAL = { ...process.env };
beforeEach(() => {
  process.env = { ...ORIGINAL };
});
