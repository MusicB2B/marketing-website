import { SECTION_SCHEMA, SECTION_TYPES } from '@/lib/schema';
import type { FieldSpec } from '@/lib/schema';
import type { Section, SectionItem, SectionStyle, SiteContent } from '@/types/content';

/**
 * Server-side validation for anything arriving from the authoring UI.
 *
 * The editor is password-protected, but a valid session must still not be able
 * to write arbitrary JSON into the repo — we rebuild the document from the
 * schema and drop anything that isn't declared there.
 */

export class ValidationError extends Error {}

const ALIGN = ['left', 'center'] as const;
const SCALE = ['sm', 'md', 'lg'] as const;
const THEME = ['light', 'tint', 'dark'] as const;

const MAX_FIELD_LENGTH = 2000;
const MAX_SECTIONS = 24;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function str(value: unknown, label: string): string {
  if (typeof value !== 'string') throw new ValidationError(`${label} must be a string`);
  if (value.length > MAX_FIELD_LENGTH) {
    throw new ValidationError(`${label} is longer than ${MAX_FIELD_LENGTH} characters`);
  }
  return value;
}

function oneOf<T extends readonly string[]>(value: unknown, allowed: T, label: string): T[number] {
  if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) {
    return value as T[number];
  }
  throw new ValidationError(`${label} must be one of: ${allowed.join(', ')}`);
}

function parseStyle(value: unknown, label: string): SectionStyle {
  if (!isRecord(value)) throw new ValidationError(`${label} is missing`);
  return {
    align: oneOf(value.align, ALIGN, `${label}.align`),
    scale: oneOf(value.scale, SCALE, `${label}.scale`),
    theme: oneOf(value.theme, THEME, `${label}.theme`),
  };
}

/** A `select` field may only hold one of its declared option values. */
function fieldValue(raw: unknown, field: FieldSpec, label: string): string {
  const parsed = str(raw ?? '', label);
  if (field.input !== 'select') return parsed;
  const allowed = field.options?.map((option) => option.value) ?? [];
  if (parsed === '') return allowed[0] ?? '';
  if (!allowed.includes(parsed)) {
    throw new ValidationError(`${label} must be one of: ${allowed.join(', ')}`);
  }
  return parsed;
}

function parseSection(value: unknown, index: number): Section {
  const label = `sections[${index}]`;
  if (!isRecord(value)) throw new ValidationError(`${label} must be an object`);

  const type = oneOf(value.type, SECTION_TYPES, `${label}.type`);
  const spec = SECTION_SCHEMA[type];

  const rawFields = isRecord(value.fields) ? value.fields : {};
  const fields: Record<string, string> = {};
  for (const field of spec.fields) {
    fields[field.key] = fieldValue(rawFields[field.key], field, `${label}.fields.${field.key}`);
  }

  const items: SectionItem[] = [];
  if (spec.item) {
    const rawItems = Array.isArray(value.items) ? value.items : [];
    if (rawItems.length > spec.item.max) {
      throw new ValidationError(`${label} allows at most ${spec.item.max} ${spec.item.noun}s`);
    }
    rawItems.forEach((rawItem, itemIndex) => {
      if (!isRecord(rawItem)) throw new ValidationError(`${label}.items[${itemIndex}] is invalid`);
      const item: SectionItem = { id: str(rawItem.id ?? '', `${label}.items[${itemIndex}].id`) };
      for (const field of spec.item!.fields) {
        item[field.key] = str(
          rawItem[field.key] ?? '',
          `${label}.items[${itemIndex}].${field.key}`,
        );
      }
      items.push(item);
    });
  }

  return {
    id: str(value.id ?? '', `${label}.id`) || `section-${index}`,
    type,
    visible: value.visible !== false,
    style: parseStyle(value.style, `${label}.style`),
    fields,
    items,
  };
}

export function parseSiteContent(input: unknown): SiteContent {
  if (!isRecord(input)) throw new ValidationError('Content must be an object');

  const meta = isRecord(input.meta) ? input.meta : {};
  const nav = isRecord(input.nav) ? input.nav : {};
  const footer = isRecord(input.footer) ? input.footer : {};

  if (!Array.isArray(input.sections)) throw new ValidationError('sections must be an array');
  if (input.sections.length > MAX_SECTIONS) {
    throw new ValidationError(`No more than ${MAX_SECTIONS} sections`);
  }

  return {
    version: 1,
    meta: {
      title: str(meta.title ?? '', 'meta.title'),
      description: str(meta.description ?? '', 'meta.description'),
      ogImage: str(meta.ogImage ?? '', 'meta.ogImage'),
    },
    nav: {
      signInLabel: str(nav.signInLabel ?? '', 'nav.signInLabel'),
      signInHref: str(nav.signInHref ?? '', 'nav.signInHref'),
      ctaLabel: str(nav.ctaLabel ?? '', 'nav.ctaLabel'),
      ctaHref: str(nav.ctaHref ?? '', 'nav.ctaHref'),
    },
    footer: {
      tagline: str(footer.tagline ?? '', 'footer.tagline'),
      copyright: str(footer.copyright ?? '', 'footer.copyright'),
    },
    sections: input.sections.map(parseSection),
  };
}
