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

export const EXAMPLE_MATCHES: ExampleMatch[] = [
  {
    id: 'adidas-fred-again',
    status: 'High Resonance',
    score: 89,
    brand: {
      label: 'Brand Campaign',
      name: 'Adidas Originals',
      subtitle: 'Streetwear / Sportswear',
      video: '/matches/adidas-campaign.mp4',
      tint: 'linear-gradient(135deg,#3f4550,#1b1f27)',
    },
    artist: {
      label: 'Artist Audience',
      name: 'Fred Again',
      subtitle: 'Electronic / Live Culture',
      video: '/matches/fred-again-live.mp4',
      tint: 'linear-gradient(135deg,#4a3f6b,#1d1a2b)',
    },
    brandSignals: ['Streetwear', 'Wellness', 'Global youth culture'],
    artistSignals: ['Gen Z urban', 'Live music culture', 'High engagement'],
    fit: 'Strong',
    regions: 'UK, US, EU',
  },
  {
    id: 'spindrift-men-i-trust',
    status: 'Lifestyle Fit',
    score: 78,
    brand: {
      label: 'Beverage Campaign',
      name: 'Spindrift',
      subtitle: 'Sparkling Water',
      video: '/matches/spindrift-campaign.mp4',
      tint: 'linear-gradient(135deg,#e8c93f,#c9a227)',
    },
    artist: {
      label: 'Artist Audience',
      name: 'Men I Trust',
      subtitle: 'Indie / Alternative',
      video: '/matches/men-i-trust-live.mp4',
      tint: 'linear-gradient(135deg,#2b2f3a,#11141b)',
    },
    brandSignals: ['Wellness culture', 'Soft premium', 'Low-sugar beverage'],
    artistSignals: ['Indie lifestyle', 'Taste-led audience', 'Outdoor moments'],
    fit: 'Promising',
    regions: 'US, Canada, EU',
  },
  {
    id: 'bulleit-carter-faith',
    status: 'Audience Fit',
    score: 74,
    brand: {
      label: 'Whiskey Campaign',
      name: 'Bulleit Bourbon',
      subtitle: 'American Whiskey',
      video: '/matches/bulleit-campaign.mp4',
      tint: 'linear-gradient(135deg,#a8642a,#5d3416)',
    },
    artist: {
      label: 'Artist Audience',
      name: 'Carter Faith',
      subtitle: 'Country / Americana',
      video: '/matches/carter-faith.mp4',
      tint: 'linear-gradient(135deg,#8a6b4f,#3a2a1d)',
    },
    brandSignals: ['Bar occasions', 'Premium whiskey', 'Authentic storytelling'],
    artistSignals: ['Country audience', 'Americana culture', 'Live music fans'],
    fit: 'Emerging',
    regions: 'US',
  },
];

export const ROTATE_MS = 7000;
