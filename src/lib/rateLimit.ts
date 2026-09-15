/**
 * A small in-memory, per-IP limiter.
 *
 * Deliberately modest: serverless instances do not share memory and are
 * recycled, so this raises the cost of grinding at an endpoint rather than
 * making it impossible. Anything stronger needs shared storage (Vercel KV,
 * Upstash) — worth adding if these endpoints ever guard something valuable.
 */
export interface Limit {
  /** Attempts allowed inside the window. */
  max: number;
  windowMs: number;
}

interface Bucket {
  hits: number[];
  /** Set when the limit trips, so the window does not slide away early. */
  blockedUntil?: number;
}

const stores = new Map<string, Map<string, Bucket>>();

function storeFor(name: string): Map<string, Bucket> {
  let store = stores.get(name);
  if (!store) {
    store = new Map();
    stores.set(name, store);
  }
  // Crude ceiling so a flood of unique IPs cannot grow this without bound.
  if (store.size > 5000) store.clear();
  return store;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

export interface LimitResult {
  limited: boolean;
  /** Seconds until the caller may try again. */
  retryAfter: number;
}

export function rateLimit(name: string, ip: string, limit: Limit): LimitResult {
  const store = storeFor(name);
  const now = Date.now();
  const bucket = store.get(ip) ?? { hits: [] };

  if (bucket.blockedUntil && bucket.blockedUntil > now) {
    return { limited: true, retryAfter: Math.ceil((bucket.blockedUntil - now) / 1000) };
  }

  bucket.hits = bucket.hits.filter((at) => now - at < limit.windowMs);
  bucket.hits.push(now);

  if (bucket.hits.length > limit.max) {
    bucket.blockedUntil = now + limit.windowMs;
    store.set(ip, bucket);
    return { limited: true, retryAfter: Math.ceil(limit.windowMs / 1000) };
  }

  store.set(ip, bucket);
  return { limited: false, retryAfter: 0 };
}

/** Called after a success, so a legitimate sign-in clears earlier fumbles. */
export function resetLimit(name: string, ip: string): void {
  storeFor(name).delete(ip);
}
