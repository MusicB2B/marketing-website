import type { SectionType } from '@/types/content';

export interface FieldSpec {
  key: string;
  label: string;
  /** `text` renders a single-line input, `textarea` a multi-line one. */
  input: 'text' | 'textarea';
  hint?: string;
}

export interface ItemSpec {
  /** Singular noun shown on the "Add …" button, e.g. "feature". */
  noun: string;
  fields: FieldSpec[];
  max: number;
}

export interface SectionSpec {
  label: string;
  description: string;
  fields: FieldSpec[];
  item?: ItemSpec;
}

/**
 * The single source of truth for what the editor can change.
 *
 * Adding a field here makes it appear in /edit automatically — the editor
 * renders from this, it has no per-section code.
 */
export const SECTION_SCHEMA: Record<SectionType, SectionSpec> = {
  hero: {
    label: 'Hero',
    description: 'The first thing a visitor sees.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', input: 'text', hint: 'Small line above the headline.' },
      { key: 'heading', label: 'Headline', input: 'text' },
      { key: 'subheading', label: 'Sub-headline', input: 'textarea' },
      { key: 'primaryLabel', label: 'Primary button', input: 'text' },
      { key: 'primaryHref', label: 'Primary button link', input: 'text' },
      { key: 'secondaryLabel', label: 'Secondary button', input: 'text' },
      { key: 'secondaryHref', label: 'Secondary button link', input: 'text' },
      { key: 'footnote', label: 'Footnote', input: 'text' },
    ],
  },
  logos: {
    label: 'Logo strip',
    description: 'Names of brands, labels or partners.',
    fields: [{ key: 'heading', label: 'Heading', input: 'text' }],
    item: { noun: 'logo', max: 12, fields: [{ key: 'name', label: 'Name', input: 'text' }] },
  },
  howItWorks: {
    label: 'How it works',
    description: 'The numbered steps explaining the product.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', input: 'text' },
      { key: 'heading', label: 'Heading', input: 'text' },
      { key: 'subheading', label: 'Intro', input: 'textarea' },
    ],
    item: {
      noun: 'step',
      max: 6,
      fields: [
        { key: 'title', label: 'Step title', input: 'text' },
        { key: 'body', label: 'Step description', input: 'textarea' },
      ],
    },
  },
  features: {
    label: 'Features',
    description: 'Cards describing what the platform does.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', input: 'text' },
      { key: 'heading', label: 'Heading', input: 'text' },
      { key: 'subheading', label: 'Intro', input: 'textarea' },
    ],
    item: {
      noun: 'feature',
      max: 9,
      fields: [
        { key: 'title', label: 'Title', input: 'text' },
        { key: 'body', label: 'Description', input: 'textarea' },
      ],
    },
  },
  stats: {
    label: 'Stats',
    description: 'Big numbers with a short label under each.',
    fields: [{ key: 'heading', label: 'Heading', input: 'text' }],
    item: {
      noun: 'stat',
      max: 4,
      fields: [
        { key: 'value', label: 'Number', input: 'text' },
        { key: 'label', label: 'Label', input: 'text' },
      ],
    },
  },
  cta: {
    label: 'Closing call to action',
    description: 'The final prompt before the footer.',
    fields: [
      { key: 'heading', label: 'Heading', input: 'text' },
      { key: 'subheading', label: 'Sub-heading', input: 'textarea' },
      { key: 'primaryLabel', label: 'Button', input: 'text' },
      { key: 'primaryHref', label: 'Button link', input: 'text' },
      { key: 'footnote', label: 'Footnote', input: 'text' },
    ],
  },
};

export const SECTION_TYPES = Object.keys(SECTION_SCHEMA) as SectionType[];
