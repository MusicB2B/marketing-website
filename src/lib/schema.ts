import type { SectionType } from '@/types/content';

export interface FieldSpec {
  key: string;
  label: string;
  /** `text` a single-line input, `textarea` multi-line, `select` a fixed list. */
  input: 'text' | 'textarea' | 'select';
  /** Required for `select`. The value stored is `value`. */
  options?: { value: string; label: string }[];
  hint?: string;
}

/** Icons the editor can choose from. Keys must exist in src/components/Icon.tsx. */
export const ICON_OPTIONS = [
  { value: 'overlap', label: 'Overlapping circles' },
  { value: 'tag', label: 'Tag' },
  { value: 'sliders', label: 'Sliders' },
  { value: 'ranked', label: 'Ranked bars' },
  { value: 'globe', label: 'Globe' },
  { value: 'exchange', label: 'Two-way arrows' },
  { value: 'target', label: 'Target' },
  { value: 'users', label: 'People' },
  { value: 'spark', label: 'Spark' },
  { value: 'shield', label: 'Shield' },
] as const;

/** Platform marks for the data sources row. Keys must exist in PlatformIcon.tsx. */
export const PLATFORM_OPTIONS = [
  { value: 'spotify', label: 'Spotify' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'analytics', label: 'Analytics (generic)' },
] as const;

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
      {
        key: 'visual',
        label: 'Panel beside the text',
        input: 'select',
        options: [
          { value: 'livePanel', label: 'Live example partnership' },
          { value: 'image', label: 'A fixed image' },
        ],
      },
      {
        key: 'visualImage',
        label: 'Image file',
        input: 'text',
        hint: 'Only used when the panel above is set to "A fixed image". Leave blank to show a placeholder.',
      },
      {
        key: 'disclaimer',
        label: 'Example partnership disclaimer',
        input: 'textarea',
        hint: 'Shown when someone clicks the info button on the live panel. Have legal read this before changing it.',
      },
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
      max: 6,
      fields: [
        {
          key: 'icon',
          label: 'Icon',
          input: 'select',
          options: [...ICON_OPTIONS],
        },
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
  audienceSplit: {
    label: 'Who it is for',
    description: 'The two-column split explaining the product to each side.',
    fields: [{ key: 'heading', label: 'Heading', input: 'text' }],
    item: {
      noun: 'side',
      max: 2,
      fields: [
        { key: 'label', label: 'Audience', input: 'text' },
        { key: 'body', label: 'What they get', input: 'textarea' },
        { key: 'icon', label: 'Icon', input: 'select', options: [...ICON_OPTIONS] },
      ],
    },
  },
  differentiator: {
    label: 'What makes us different',
    description: 'The argument for matching on meaning, beside the vibe chart.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', input: 'text' },
      { key: 'heading', label: 'Heading', input: 'text' },
      { key: 'bodyOne', label: 'First paragraph', input: 'textarea' },
      { key: 'bodyTwo', label: 'Second paragraph', input: 'textarea' },
    ],
    item: {
      noun: 'point',
      max: 6,
      fields: [{ key: 'text', label: 'Point', input: 'text' }],
    },
  },
  dataSources: {
    label: 'Built on real data',
    description: 'The platforms the engine draws from.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', input: 'text' },
      { key: 'heading', label: 'Heading', input: 'text' },
      { key: 'subheading', label: 'Intro', input: 'textarea' },
    ],
    item: {
      noun: 'source',
      max: 8,
      fields: [
        { key: 'icon', label: 'Logo', input: 'select', options: [...PLATFORM_OPTIONS] },
        { key: 'name', label: 'Platform', input: 'text' },
        { key: 'detail', label: 'What we use', input: 'text' },
      ],
    },
  },
  requestAccess: {
    label: 'Request access form',
    description: 'The enquiry form. Submissions are emailed to the team inbox.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', input: 'text' },
      { key: 'heading', label: 'Heading', input: 'text' },
      { key: 'subheading', label: 'Intro', input: 'textarea' },
      { key: 'submitLabel', label: 'Submit button', input: 'text' },
      {
        key: 'successMessage',
        label: 'Thank-you message',
        input: 'text',
        hint: 'Shown after someone sends the form.',
      },
      { key: 'footnote', label: 'Footnote', input: 'text' },
    ],
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
