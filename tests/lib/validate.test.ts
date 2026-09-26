import { describe, it, expect } from 'vitest';
import { parseSiteContent, ValidationError } from '@/lib/validate';
import content from '../../content/site.json';

const valid = () => JSON.parse(JSON.stringify(content));

describe('parseSiteContent', () => {
  it('accepts the content the site actually ships with', () => {
    expect(() => parseSiteContent(valid())).not.toThrow();
  });

  it('rejects anything that is not an object', () => {
    for (const bad of [null, 'a string', 42, []]) {
      expect(() => parseSiteContent(bad)).toThrow(ValidationError);
    }
  });

  it('rejects a document with no sections array', () => {
    const doc = valid();
    delete doc.sections;
    expect(() => parseSiteContent(doc)).toThrow(/sections must be an array/);
  });

  it('rejects an unknown section type', () => {
    const doc = valid();
    doc.sections[0].type = 'somethingInvented';
    expect(() => parseSiteContent(doc)).toThrow(ValidationError);
  });

  // The whole point of this module: a signed-in editor must not be able to
  // write arbitrary JSON into the repository.
  it('drops fields the schema does not declare', () => {
    const doc = valid();
    doc.sections[0].fields.smuggledIn = 'should not survive';
    const parsed = parseSiteContent(doc);
    expect(parsed.sections[0]!.fields).not.toHaveProperty('smuggledIn');
  });

  it('drops item fields the schema does not declare', () => {
    const doc = valid();
    const withItems = doc.sections.find((s: { items: unknown[] }) => s.items.length > 0);
    withItems.items[0].smuggledIn = 'should not survive';
    const parsed = parseSiteContent(doc);
    const section = parsed.sections.find((s) => s.id === withItems.id)!;
    expect(section.items[0]).not.toHaveProperty('smuggledIn');
  });

  it('rejects a field longer than the cap', () => {
    const doc = valid();
    doc.sections[0].fields.heading = 'x'.repeat(2001);
    expect(() => parseSiteContent(doc)).toThrow(/longer than/);
  });

  it('rejects more items than the section allows', () => {
    const doc = valid();
    const features = doc.sections.find((s: { type: string }) => s.type === 'features');
    features.items = Array.from({ length: 20 }, (_, i) => ({ id: `x${i}`, title: '', body: '' }));
    expect(() => parseSiteContent(doc)).toThrow(/at most/);
  });

  it('rejects a style token that is not in the allowed set', () => {
    const doc = valid();
    doc.sections[0].style.align = 'justified';
    expect(() => parseSiteContent(doc)).toThrow(/must be one of/);
  });

  it('rejects a select field set to an undeclared option', () => {
    const doc = valid();
    const features = doc.sections.find((s: { type: string }) => s.type === 'features');
    features.items[0].icon = 'not-a-real-icon';
    expect(() => parseSiteContent(doc)).toThrow(/must be one of/);
  });

  it('falls back to the first option when a select field is empty', () => {
    const doc = valid();
    const features = doc.sections.find((s: { type: string }) => s.type === 'features');
    features.items[0].icon = '';
    const parsed = parseSiteContent(doc);
    const section = parsed.sections.find((s) => s.type === 'features')!;
    expect(section.items[0]!.icon).toBeTruthy();
  });

  it('treats a missing visible flag as visible', () => {
    const doc = valid();
    delete doc.sections[0].visible;
    expect(parseSiteContent(doc).sections[0]!.visible).toBe(true);
  });

  it('rejects more sections than the cap', () => {
    const doc = valid();
    doc.sections = Array.from({ length: 30 }, () => valid().sections[0]);
    expect(() => parseSiteContent(doc)).toThrow(/No more than/);
  });
});
