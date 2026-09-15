/**
 * A small inline icon set, stroke-based to match the product UI.
 *
 * Inline rather than a package: six icons on a static page do not justify a
 * dependency, and keeping them here means the editor can offer a fixed list
 * that cannot break the layout.
 *
 * The keys here must match ICON_OPTIONS in src/lib/schema.ts.
 */
const PATHS: Record<string, React.ReactNode> = {
  overlap: (
    <>
      <circle cx="9" cy="12" r="6.5" />
      <circle cx="15" cy="12" r="6.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3 11.5V4.5a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.06.44l7.5 7.5a1.5 1.5 0 0 1 0 2.12l-7 7a1.5 1.5 0 0 1-2.12 0l-7.5-7.5A1.5 1.5 0 0 1 3 11.5Z" />
      <circle cx="7.5" cy="7.5" r="1.25" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </>
  ),
  ranked: (
    <>
      <path d="M4 18h3v3H4zM10.5 12h3v9h-3zM17 7h3v14h-3z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 5.6M17.5 14.2A6.5 6.5 0 0 1 21.5 20" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.2-7.5 9.5-4.4-1.3-7.5-4.9-7.5-9.5V6L12 3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

export const ICON_KEYS = Object.keys(PATHS);

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  const paths = PATHS[name];
  if (!paths) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths}
    </svg>
  );
}
