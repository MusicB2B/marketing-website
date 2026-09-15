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
 * Adding a field here makes it appear in the authoring UI automatically — it
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
        key: 'visualImageAlt',
        label: 'Image description',
        input: 'text',
        hint: 'Describes the image for screen readers and search engines. Say what it shows.',
      },
      { key: 'panelEyebrow', label: 'Panel: heading', input: 'text' },
      { key: 'panelScoreLabel', label: 'Panel: score label', input: 'text' },
      { key: 'panelBrandLabel', label: 'Panel: brand signals label', input: 'text' },
      { key: 'panelArtistLabel', label: 'Panel: artist signals label', input: 'text' },
      { key: 'panelStrengthLabel', label: 'Panel: strength label', input: 'text' },
      { key: 'panelRegionsLabel', label: 'Panel: regions label', input: 'text' },
      {
        key: 'disclaimer',
        label: 'Example partnership disclaimer',
        input: 'textarea',
        hint: 'Shown when someone clicks the info button on the live panel. Have legal read this before changing it.',
      },
    ],
    item: {
      noun: 'example partnership',
      max: 6,
      fields: [
        { key: 'status', label: 'Status pill', input: 'text' },
        { key: 'score', label: 'Compatibility score', input: 'text', hint: 'A number, e.g. 78.' },
        { key: 'brandLabel', label: 'Brand: caption', input: 'text' },
        { key: 'brandName', label: 'Brand: name', input: 'text' },
        { key: 'brandSubtitle', label: 'Brand: category', input: 'text' },
        {
          key: 'brandVideo',
          label: 'Brand: video',
          input: 'text',
          hint: 'Add the file to public/matches/, then put its path here.',
        },
        {
          key: 'brandSignals',
          label: 'Brand: signals',
          input: 'text',
          hint: 'Separate with commas.',
        },
        { key: 'artistLabel', label: 'Artist: caption', input: 'text' },
        { key: 'artistName', label: 'Artist: name', input: 'text' },
        { key: 'artistSubtitle', label: 'Artist: category', input: 'text' },
        {
          key: 'artistVideo',
          label: 'Artist: video',
          input: 'text',
          hint: 'Add the file to public/matches/, then put its path here.',
        },
        {
          key: 'artistSignals',
          label: 'Artist: signals',
          input: 'text',
          hint: 'Separate with commas.',
        },
        { key: 'fit', label: 'Partnership strength', input: 'text' },
        { key: 'regions', label: 'Primary regions', input: 'text' },
      ],
    },
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
      { key: 'chartTitle', label: 'Chart: title', input: 'text' },
      { key: 'chartSubtitle', label: 'Chart: subtitle', input: 'text' },
      { key: 'chartLegendCampaign', label: 'Chart: first key', input: 'text' },
      { key: 'chartLegendArtist', label: 'Chart: second key', input: 'text' },
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
  campaignDemo: {
    label: 'Campaign brief example',
    description: 'The worked example: a brief on the left, the artists it ranked on the right.',
    fields: [
      { key: 'briefLabel', label: 'Brief: label', input: 'text' },
      { key: 'campaignName', label: 'Brief: campaign name', input: 'text' },
      { key: 'row1Label', label: 'Brief: row 1 label', input: 'text' },
      { key: 'row1Value', label: 'Brief: row 1 value', input: 'text' },
      { key: 'row2Label', label: 'Brief: row 2 label', input: 'text' },
      { key: 'row2Value', label: 'Brief: row 2 value', input: 'text' },
      { key: 'row3Label', label: 'Brief: row 3 label', input: 'text' },
      { key: 'row3Value', label: 'Brief: row 3 value', input: 'text' },
      { key: 'row4Label', label: 'Brief: row 4 label', input: 'text' },
      { key: 'row4Value', label: 'Brief: row 4 value', input: 'text' },
      { key: 'toneLabel', label: 'Brief: tone label', input: 'text' },
      {
        key: 'tones',
        label: 'Brief: tone words',
        input: 'text',
        hint: 'Separate each one with a comma.',
      },
      { key: 'matchesHeading', label: 'Matches: heading', input: 'text' },
      { key: 'matchesCount', label: 'Matches: count note', input: 'text' },
      { key: 'scoreLabel', label: 'Matches: score label', input: 'text' },
      { key: 'topLabel', label: 'Matches: top match label', input: 'text' },
    ],
    item: {
      noun: 'artist',
      max: 6,
      fields: [
        { key: 'initials', label: 'Initials', input: 'text' },
        { key: 'name', label: 'Artist name', input: 'text' },
        { key: 'note', label: 'Alignment note', input: 'text' },
        { key: 'tags', label: 'Tags', input: 'text', hint: 'Separate each one with a comma.' },
        { key: 'score', label: 'Match score', input: 'text' },
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
      { key: 'nameLabel', label: 'Form: name field', input: 'text' },
      { key: 'emailLabel', label: 'Form: email field', input: 'text' },
      { key: 'subjectLabel', label: 'Form: subject field', input: 'text' },
      { key: 'messageLabel', label: 'Form: message field', input: 'text' },
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

/**
 * Settings that sit outside any one section. The editor renders these in a
 * "Site settings" panel above the section list.
 */
export const SITE_SETTINGS: {
  group: 'meta' | 'nav' | 'footer';
  label: string;
  fields: FieldSpec[];
}[] = [
  {
    group: 'meta',
    label: 'Search engines & social sharing',
    fields: [
      {
        key: 'title',
        label: 'Page title',
        input: 'text',
        hint: 'Shown in the browser tab and as the headline in Google results.',
      },
      {
        key: 'description',
        label: 'Page description',
        input: 'textarea',
        hint: 'The grey summary under the title in Google results.',
      },
    ],
  },
  {
    group: 'nav',
    label: 'Floating button',
    fields: [
      { key: 'ctaLabel', label: 'Button text', input: 'text' },
      { key: 'ctaHref', label: 'Button link', input: 'text' },
    ],
  },
  {
    group: 'footer',
    label: 'Footer',
    fields: [
      { key: 'tagline', label: 'Tagline', input: 'text' },
      { key: 'copyright', label: 'Copyright line', input: 'text' },
    ],
  },
];

export const SECTION_TYPES = Object.keys(SECTION_SCHEMA) as SectionType[];
