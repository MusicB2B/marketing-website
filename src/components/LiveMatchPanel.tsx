'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ROTATE_MS, toExampleMatches } from '@/lib/exampleMatches';
import type { Entity as EntityData } from '@/lib/exampleMatches';
import type { SectionItem } from '@/types/content';

/**
 * The rotating example partnership from the platform, rebuilt for the
 * marketing page.
 *
 * Differences from the platform's ExampleMatchPanel, all because this one runs
 * on a public page rather than behind a login:
 *  - rotation pauses when the panel is off-screen or the tab is hidden, so an
 *    idle tab is not decoding video forever;
 *  - honours prefers-reduced-motion by holding on one example and not
 *    animating the score;
 *  - only the active pair of videos is mounted.
 */

const EASE_MS = 2200;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);
  return reduced;
}

function Entity({ entity, paused }: { entity: EntityData; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (paused) {
      video.pause();
    } else {
      // Autoplay can reject (low power mode, some mobile browsers). The poster
      // frame stays visible in that case, which is an acceptable fallback.
      void video.play().catch(() => {});
    }
  }, [paused]);

  return (
    <div
      className="border-line relative isolate flex min-h-[9.3rem] flex-col justify-end overflow-hidden rounded-xl border p-4"
      style={{ background: entity.tint }}
    >
      <video
        ref={ref}
        src={entity.video}
        muted
        loop
        playsInline
        autoPlay={!paused}
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full scale-[1.03] object-cover"
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,.52) 0%, rgba(0,0,0,.24) 48%, rgba(0,0,0,.05) 100%)',
        }}
      />
      <div className="relative z-[2] flex min-h-[6.9rem] w-full flex-col justify-between">
        <p className="text-[0.58rem] font-black tracking-[0.13em] text-white/80 uppercase">
          {entity.label}
        </p>
        <div>
          <p className="text-[0.98rem] leading-[1.16] font-black tracking-[-0.02em] text-white">
            {entity.name}
          </p>
          <p className="mt-1 text-[0.68rem] leading-[1.25] font-bold text-white/75">
            {entity.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function Signals({ label, signals }: { label: string; signals: string[] }) {
  return (
    <div>
      <p className="text-muted mb-2.5 text-[0.62rem] font-black tracking-[0.14em] uppercase">
        {label}
      </p>
      <div className="flex min-h-[4rem] flex-wrap content-start gap-1.5">
        {signals.map((signal) => (
          <span
            key={signal}
            className="border-line text-ink rounded-full border bg-white px-2.5 py-1 text-[0.74rem] font-bold"
          >
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface PanelLabels {
  eyebrow: string;
  score: string;
  brandSignals: string;
  artistSignals: string;
  strength: string;
  regions: string;
}

export function LiveMatchPanel({
  disclaimer,
  labels,
  items,
}: {
  disclaimer: string;
  labels: PanelLabels;
  items: SectionItem[];
}) {
  const matches = toExampleMatches(items);
  const [index, setIndex] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [tabActive, setTabActive] = useState(true);
  const panelRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const match = matches[index % matches.length]!;

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % matches.length);
  }, [matches.length]);

  // Only run while the panel is actually on screen and the tab is focused.
  useEffect(() => {
    const element = panelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(Boolean(entry?.isIntersecting)),
    );
    observer.observe(element);

    const onVisibility = () => setTabActive(!document.hidden);
    onVisibility(); // the page may have loaded in a background tab
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const visible = onScreen && tabActive;
  const running = visible && !reducedMotion && !infoOpen;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(next, ROTATE_MS);
    return () => clearTimeout(id);
  }, [running, next, index]);

  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setInfoOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [infoOpen]);

  // Count the score up, matching the bar fill.
  useEffect(() => {
    if (reducedMotion) {
      setScore(match.score);
      return;
    }
    if (!visible) {
      setScore(0);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / EASE_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScore(Math.round(match.score * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [match.score, reducedMotion, visible]);

  return (
    <aside
      ref={panelRef}
      className="border-line rounded-card flex min-h-[33.5rem] flex-col border bg-white p-5 shadow-[0_28px_80px_-40px_rgba(0,0,0,0.3)] sm:p-6"
      aria-label="Example partnership"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-muted text-[0.66rem] font-black tracking-[0.16em] uppercase">
            {labels.eyebrow}
          </p>
          <button
            type="button"
            onClick={() => setInfoOpen((open) => !open)}
            aria-expanded={infoOpen}
            aria-label="About these examples"
            className={`flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-full border text-[0.62rem] font-black transition-colors ${
              infoOpen
                ? 'border-brand bg-brand text-white'
                : 'border-muted text-muted hover:border-brand hover:text-brand'
            }`}
          >
            i
          </button>
        </div>

        <span className="border-brand text-brand bg-canvas shrink-0 rounded-full border px-2.5 py-1.5 text-[0.64rem] font-black tracking-[0.04em] uppercase">
          {match.status}
        </span>
      </div>

      {infoOpen && (
        <div
          ref={infoRef}
          role="note"
          className="border-line bg-surface-alt mb-5 rounded-xl border p-4"
        >
          <p className="text-body text-[0.8rem] leading-relaxed">{disclaimer}</p>
          <button
            type="button"
            onClick={() => setInfoOpen(false)}
            className="text-brand mt-2.5 text-[0.78rem] font-bold"
          >
            Close
          </button>
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-3.5 min-[480px]:grid-cols-2">
        <Entity key={`${match.id}-brand`} entity={match.brand} paused={!visible} />
        <Entity key={`${match.id}-artist`} entity={match.artist} paused={!visible} />
      </div>

      <div className="mb-4">
        <div className="mb-2.5 flex items-baseline justify-between gap-4">
          <span className="text-ink text-[0.8rem] font-black">{labels.score}</span>
          <span className="text-brand text-[2.25rem] leading-none font-black tracking-[-0.04em] tabular-nums">
            {score}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-black/[0.1]">
          <div
            key={match.id}
            className="from-brand-tint via-brand-accent to-brand h-full rounded-full bg-gradient-to-r"
            style={{
              width: `${match.score}%`,
              transformOrigin: 'left center',
              animation: reducedMotion
                ? undefined
                : 'fillAlignment 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-5">
        <Signals label={labels.brandSignals} signals={match.brandSignals} />
        <Signals label={labels.artistSignals} signals={match.artistSignals} />
      </div>

      <div className="border-line mt-auto space-y-2 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-muted text-[0.66rem] font-black tracking-[0.14em] uppercase">
            {labels.strength}
          </span>
          <span className="text-ink text-[0.9rem] font-black">{match.fit}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted text-[0.66rem] font-black tracking-[0.14em] uppercase">
            {labels.regions}
          </span>
          <span className="text-ink text-[0.9rem] font-black">{match.regions}</span>
        </div>
      </div>
    </aside>
  );
}
