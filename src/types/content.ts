/**
 * The shape of the editable site document.
 *
 * Everything the marketing team can change lives in a single JSON document
 * (content/site.json). Sections are an ordered array so that reordering in the
 * editor is just moving an element.
 */

export type SectionType =
  | 'hero'
  | 'logos'
  | 'howItWorks'
  | 'features'
  | 'stats'
  | 'cta'
  | 'requestAccess'
  | 'audienceSplit'
  | 'differentiator'
  | 'dataSources';

/** Constrained presentation knobs. Deliberately a small set of tokens rather than
 *  free-form CSS, so the page cannot be made to look broken. */
export interface SectionStyle {
  align: 'left' | 'center';
  scale: 'sm' | 'md' | 'lg';
  theme: 'light' | 'tint' | 'dark';
}

/** A repeatable row within a section — a feature card, a logo, a stat. */
export type SectionItem = Record<string, string> & { id: string };

export interface Section {
  id: string;
  type: SectionType;
  visible: boolean;
  style: SectionStyle;
  /** Single-value copy for this section, keyed by the schema below. */
  fields: Record<string, string>;
  /** Repeatable rows, for sections whose schema declares an `item`. */
  items: SectionItem[];
}

export interface SiteMeta {
  title: string;
  description: string;
  ogImage: string;
}

export interface SiteNav {
  signInLabel: string;
  signInHref: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SiteFooter {
  tagline: string;
  copyright: string;
}

export interface SiteContent {
  /** Bumped when the shape changes, so we can migrate old saved documents. */
  version: number;
  meta: SiteMeta;
  nav: SiteNav;
  footer: SiteFooter;
  sections: Section[];
}
