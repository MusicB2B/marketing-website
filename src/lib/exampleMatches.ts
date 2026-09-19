/**
 * Mirrors frontend/design/exampleMatches.ts in the platform repo.
 *
 * Videos are compressed copies of the platform's originals — see
 * scripts/compress-videos.sh. The platform can afford 66MB of 720p because
 * it is behind a login; a marketing page cannot.
 */
export interface Entity {
  label: string;
  name: string;
  subtitle: string;
  video: string;
  /** Shown behind the video, so a slow or failed load is never a black box. */
  tint: string;
}

export interface ExampleMatch {
  id: string;
  status: string;
  score: number;
  brand: Entity;
  artist: Entity;
  brandSignals: string[];
  artistSignals: string[];
  fit: string;
  regions: string;
}

/** Fallback tints, keyed by video file, so a slow load is never a black box. */
const TINTS: Record<string, string> = {
  'adidas-campaign': 'linear-gradient(135deg,#3f4550,#1b1f27)',
  'fakemink-live': 'linear-gradient(135deg,#3b2f52,#17131f)',
  'spindrift-campaign': 'linear-gradient(135deg,#e8c93f,#c9a227)',
  'men-i-trust-live': 'linear-gradient(135deg,#2b2f3a,#11141b)',
  'bulleit-campaign': 'linear-gradient(135deg,#a8642a,#5d3416)',
  'carter-faith': 'linear-gradient(135deg,#8a6b4f,#3a2a1d)',
};

function tintFor(video: string): string {
  const stem =
    video
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '') ?? '';
  return TINTS[stem] ?? 'linear-gradient(135deg,#3f4550,#1b1f27)';
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Maps the editable rows from content/site.json onto what the panel renders. */
export function toExampleMatches(items: { id: string; [key: string]: string }[]): ExampleMatch[] {
  return items.map((item) => ({
    id: item.id,
    status: item.status ?? '',
    score: Math.max(0, Math.min(100, Number(item.score) || 0)),
    brand: {
      label: item.brandLabel ?? '',
      name: item.brandName ?? '',
      subtitle: item.brandSubtitle ?? '',
      video: item.brandVideo ?? '',
      tint: tintFor(item.brandVideo ?? ''),
    },
    artist: {
      label: item.artistLabel ?? '',
      name: item.artistName ?? '',
      subtitle: item.artistSubtitle ?? '',
      video: item.artistVideo ?? '',
      tint: tintFor(item.artistVideo ?? ''),
    },
    brandSignals: splitList(item.brandSignals ?? ''),
    artistSignals: splitList(item.artistSignals ?? ''),
    fit: item.fit ?? '',
    regions: item.regions ?? '',
  }));
}

export const ROTATE_MS = 7000;
