'use client';

import { useCallback, useMemo, useState } from 'react';
import { Footer } from '@/components/Chrome';
import { SectionRenderer } from '@/components/sections';
import { SECTION_SCHEMA } from '@/lib/schema';
import type { FieldSpec, SectionSpec } from '@/lib/schema';
import type { Section, SiteContent } from '@/types/content';

type Status = { tone: 'idle' | 'saving' | 'ok' | 'error'; message: string };

const ALIGNS = ['left', 'center'] as const;
const SCALES = ['sm', 'md', 'lg'] as const;
const THEMES = ['light', 'tint', 'dark'] as const;

const SCALE_LABEL = { sm: 'Small', md: 'Medium', lg: 'Large' } as const;
const THEME_LABEL = { light: 'Grey', tint: 'White', dark: 'Dark' } as const;
const ALIGN_LABEL = { left: 'Left', center: 'Centre' } as const;

function newId() {
  return `i${Math.random().toString(36).slice(2, 9)}`;
}

/* ---------------------------------------------------------------- controls */

function Field({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: string;
  onChange: (next: string) => void;
}) {
  const shared =
    'w-full rounded-lg border border-line-strong bg-white px-3 py-2 text-[0.92rem] text-ink outline-none focus:border-brand';
  return (
    <label className="block">
      <span className="text-ink mb-1.5 block text-[0.82rem] font-semibold">{spec.label}</span>
      {spec.input === 'textarea' ? (
        <textarea
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${shared} resize-y`}
        />
      ) : spec.input === 'select' ? (
        <select
          value={value || spec.options?.[0]?.value || ''}
          onChange={(event) => onChange(event.target.value)}
          className={shared}
        >
          {spec.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={shared}
        />
      )}
      {spec.hint && <span className="text-muted mt-1 block text-[0.78rem]">{spec.hint}</span>}
    </label>
  );
}

function Choice<T extends string>({
  label,
  options,
  labels,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  labels: Record<T, string>;
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div>
      <span className="text-muted mb-1.5 block text-[0.75rem] font-bold tracking-[0.08em] uppercase">
        {label}
      </span>
      <div className="border-line-strong inline-flex overflow-hidden rounded-lg border bg-white">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`px-3 py-1.5 text-[0.82rem] font-semibold transition-colors ${
              value === option ? 'bg-brand text-white' : 'text-body hover:bg-brand-tint'
            }`}
          >
            {labels[option]}
          </button>
        ))}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="border-line-strong text-body hover:border-brand hover:text-brand flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-[0.9rem] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------- section panel */

function SectionPanel({
  section,
  spec,
  index,
  total,
  open,
  onToggleOpen,
  onChange,
  onMove,
}: {
  section: Section;
  spec: SectionSpec;
  index: number;
  total: number;
  open: boolean;
  onToggleOpen: () => void;
  onChange: (next: Section) => void;
  onMove: (delta: number) => void;
}) {
  const setField = (key: string, value: string) =>
    onChange({ ...section, fields: { ...section.fields, [key]: value } });

  const setItem = (itemId: string, key: string, value: string) =>
    onChange({
      ...section,
      items: section.items.map((item) => (item.id === itemId ? { ...item, [key]: value } : item)),
    });

  const addItem = () => {
    if (!spec.item) return;
    const blank = Object.fromEntries(spec.item.fields.map((field) => [field.key, '']));
    onChange({ ...section, items: [...section.items, { id: newId(), ...blank }] });
  };

  const removeItem = (itemId: string) =>
    onChange({ ...section, items: section.items.filter((item) => item.id !== itemId) });

  const moveItem = (itemIndex: number, delta: number) => {
    const next = [...section.items];
    const target = itemIndex + delta;
    const a = next[itemIndex];
    const b = next[target];
    if (!a || !b) return;
    next[itemIndex] = b;
    next[target] = a;
    onChange({ ...section, items: next });
  };

  return (
    <div
      className={`border-line rounded-card border bg-white ${section.visible ? '' : 'opacity-60'}`}
    >
      <div className="flex items-center gap-2 p-3.5">
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex flex-1 items-center gap-2.5 text-left"
          aria-expanded={open}
        >
          <span className="text-muted text-[0.8rem]">{open ? '▾' : '▸'}</span>
          <span className="text-ink text-[0.98rem] font-bold">{spec.label}</span>
          {!section.visible && (
            <span className="text-muted rounded-full bg-black/5 px-2 py-0.5 text-[0.7rem] font-bold tracking-wide uppercase">
              Hidden
            </span>
          )}
        </button>

        <IconButton label="Move up" onClick={() => onMove(-1)} disabled={index === 0}>
          ↑
        </IconButton>
        <IconButton label="Move down" onClick={() => onMove(1)} disabled={index === total - 1}>
          ↓
        </IconButton>
        <button
          type="button"
          onClick={() => onChange({ ...section, visible: !section.visible })}
          className={`rounded-lg border px-3 py-1.5 text-[0.8rem] font-semibold transition-colors ${
            section.visible
              ? 'border-line-strong text-body hover:border-brand'
              : 'border-brand bg-brand-tint text-brand'
          }`}
        >
          {section.visible ? 'Hide' : 'Show'}
        </button>
      </div>

      {open && (
        <div className="border-line space-y-4 border-t p-4">
          <p className="text-muted text-[0.85rem]">{spec.description}</p>

          {spec.fields.map((field) => (
            <Field
              key={field.key}
              spec={field}
              value={section.fields[field.key] ?? ''}
              onChange={(value) => setField(field.key, value)}
            />
          ))}

          {spec.item && (
            <div className="space-y-3">
              <span className="text-muted block text-[0.75rem] font-bold tracking-[0.08em] uppercase">
                {spec.item.noun}s
              </span>
              {section.items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className="bg-surface-alt border-line space-y-3 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted text-[0.8rem] font-bold">#{itemIndex + 1}</span>
                    <div className="flex gap-1.5">
                      <IconButton
                        label={`Move ${spec.item!.noun} up`}
                        onClick={() => moveItem(itemIndex, -1)}
                        disabled={itemIndex === 0}
                      >
                        ↑
                      </IconButton>
                      <IconButton
                        label={`Move ${spec.item!.noun} down`}
                        onClick={() => moveItem(itemIndex, 1)}
                        disabled={itemIndex === section.items.length - 1}
                      >
                        ↓
                      </IconButton>
                      <IconButton
                        label={`Delete ${spec.item!.noun}`}
                        onClick={() => removeItem(item.id)}
                      >
                        ×
                      </IconButton>
                    </div>
                  </div>
                  {spec.item!.fields.map((field) => (
                    <Field
                      key={field.key}
                      spec={field}
                      value={item[field.key] ?? ''}
                      onChange={(value) => setItem(item.id, field.key, value)}
                    />
                  ))}
                </div>
              ))}
              {section.items.length < spec.item.max && (
                <button
                  type="button"
                  onClick={addItem}
                  className="border-line-strong text-body hover:border-brand hover:text-brand w-full rounded-lg border border-dashed py-2.5 text-[0.88rem] font-semibold transition-colors"
                >
                  + Add {spec.item.noun}
                </button>
              )}
            </div>
          )}

          <div className="border-line flex flex-wrap gap-5 border-t pt-4">
            <Choice
              label="Text size"
              options={SCALES}
              labels={SCALE_LABEL}
              value={section.style.scale}
              onChange={(scale) => onChange({ ...section, style: { ...section.style, scale } })}
            />
            <Choice
              label="Alignment"
              options={ALIGNS}
              labels={ALIGN_LABEL}
              value={section.style.align}
              onChange={(align) => onChange({ ...section, style: { ...section.style, align } })}
            />
            <Choice
              label="Background"
              options={THEMES}
              labels={THEME_LABEL}
              value={section.style.theme}
              onChange={(theme) => onChange({ ...section, style: { ...section.style, theme } })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- editor */

export function Editor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [saved, setSaved] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<Status>({ tone: 'idle', message: '' });
  const [openId, setOpenId] = useState<string | null>(initial.sections[0]?.id ?? null);

  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);

  const updateSection = useCallback((next: Section) => {
    setContent((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === next.id ? next : section)),
    }));
  }, []);

  const moveSection = useCallback((index: number, delta: number) => {
    setContent((current) => {
      const sections = [...current.sections];
      const target = index + delta;
      const a = sections[index];
      const b = sections[target];
      if (!a || !b) return current;
      sections[index] = b;
      sections[target] = a;
      return { ...current, sections };
    });
  }, []);

  async function save() {
    setStatus({ tone: 'saving', message: 'Saving…' });
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus({ tone: 'error', message: data.error ?? 'Could not save.' });
        return;
      }
      setSaved(content);
      setStatus({ tone: 'ok', message: data.message ?? 'Saved.' });
    } catch {
      setStatus({ tone: 'error', message: 'Could not reach the server. Your changes are safe.' });
    }
  }

  async function signOut() {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.reload();
  }

  const statusColour = {
    idle: 'text-muted',
    saving: 'text-muted',
    ok: 'text-brand',
    error: 'text-red-600',
  }[status.tone];

  return (
    <div className="flex h-dvh flex-col">
      <header className="border-line flex items-center gap-4 border-b bg-white px-5 py-3">
        <span className="text-ink text-[1.05rem] font-bold">Site editor</span>
        <span className={`flex-1 text-[0.88rem] font-medium ${statusColour}`}>
          {status.message || (dirty ? 'Unsaved changes' : 'Everything is saved')}
        </span>
        <button
          type="button"
          onClick={signOut}
          className="text-body hover:text-ink text-[0.88rem] font-semibold"
        >
          Sign out
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || status.tone === 'saving'}
          className="bg-brand hover:bg-brand-dark rounded-lg px-5 py-2 text-[0.92rem] font-semibold text-white transition-colors disabled:opacity-40"
        >
          {status.tone === 'saving' ? 'Saving…' : 'Save & publish'}
        </button>
      </header>

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,26rem)_1fr]">
        <div className="border-line space-y-3 overflow-y-auto border-r p-4">
          <p className="text-muted text-[0.85rem]">
            Changes preview instantly on the right. Nothing goes live until you press{' '}
            <strong className="text-ink">Save &amp; publish</strong>.
          </p>

          {content.sections.map((section, index) => (
            <SectionPanel
              key={section.id}
              section={section}
              spec={SECTION_SCHEMA[section.type]}
              index={index}
              total={content.sections.length}
              open={openId === section.id}
              onToggleOpen={() => setOpenId(openId === section.id ? null : section.id)}
              onChange={updateSection}
              onMove={(delta) => moveSection(index, delta)}
            />
          ))}
        </div>

        <div className="bg-canvas overflow-y-auto">
          <div className="pointer-events-none">
            <main>
              {content.sections
                .filter((section) => section.visible)
                .map((section) => (
                  <SectionRenderer key={section.id} section={section} />
                ))}
            </main>
            <Footer footer={content.footer} />
          </div>
        </div>
      </div>
    </div>
  );
}
