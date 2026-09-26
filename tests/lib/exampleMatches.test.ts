import { describe, it, expect } from 'vitest';
import { toExampleMatches } from '@/lib/exampleMatches';

const row = (overrides: Record<string, string> = {}) => ({
  id: 'ex1',
  status: 'High Resonance',
  score: '89',
  brandLabel: 'Brand Campaign',
  brandName: 'Adidas Originals',
  brandSubtitle: 'Streetwear',
  brandVideo: '/matches/adidas-campaign.mp4',
  brandSignals: 'Streetwear, Gen Z culture, Fashion-conscious',
  artistLabel: 'Artist Audience',
  artistName: 'fakemink',
  artistSubtitle: 'UK Rap',
  artistVideo: '/matches/fakemink-live.mp4',
  artistSignals: 'Gen Z audience, Streetwear culture',
  fit: 'Strong',
  regions: 'UK, US, EU',
  ...overrides,
});

describe('toExampleMatches', () => {
  it('maps an editable row onto what the panel renders', () => {
    const [match] = toExampleMatches([row()]);
    expect(match!.brand.name).toBe('Adidas Originals');
    expect(match!.artist.name).toBe('fakemink');
    expect(match!.score).toBe(89);
    expect(match!.fit).toBe('Strong');
  });

  it('splits comma-separated signals and trims them', () => {
    const [match] = toExampleMatches([row({ brandSignals: ' one ,two,  three ' })]);
    expect(match!.brandSignals).toEqual(['one', 'two', 'three']);
  });

  it('drops empty entries from a trailing or doubled comma', () => {
    const [match] = toExampleMatches([row({ brandSignals: 'one,,two,' })]);
    expect(match!.brandSignals).toEqual(['one', 'two']);
  });

  // The score is a free-text field in the editor, so it can be anything.
  it('clamps the score into 0-100 and survives nonsense', () => {
    expect(toExampleMatches([row({ score: '150' })])[0]!.score).toBe(100);
    expect(toExampleMatches([row({ score: '-20' })])[0]!.score).toBe(0);
    expect(toExampleMatches([row({ score: 'abc' })])[0]!.score).toBe(0);
    expect(toExampleMatches([row({ score: '' })])[0]!.score).toBe(0);
  });

  it('gives every entity a fallback tint so a missing video is never a black box', () => {
    const [match] = toExampleMatches([row({ brandVideo: '', artistVideo: '/nope.mp4' })]);
    expect(match!.brand.tint).toMatch(/linear-gradient/);
    expect(match!.artist.tint).toMatch(/linear-gradient/);
  });

  it('uses the clip-specific tint rather than the default', () => {
    // Spindrift's tint is the yellow one; an unrecognised clip gets the
    // neutral default, which happens to match the Adidas entry.
    const spindrift = toExampleMatches([row({ brandVideo: '/matches/spindrift-campaign.mp4' })])[0]!
      .brand.tint;
    const unknown = toExampleMatches([row({ brandVideo: '/matches/mystery.mp4' })])[0]!.brand.tint;
    expect(spindrift).not.toBe(unknown);
    expect(spindrift).toContain('#e8c93f');
  });

  it('tolerates rows missing every optional field', () => {
    const [match] = toExampleMatches([{ id: 'bare' }]);
    expect(match!.brandSignals).toEqual([]);
    expect(match!.score).toBe(0);
    expect(match!.brand.name).toBe('');
  });

  it('returns nothing for no rows', () => {
    expect(toExampleMatches([])).toEqual([]);
  });
});
