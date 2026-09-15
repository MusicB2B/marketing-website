/**
 * Simplified platform marks for the "Built on real data" section.
 *
 * Drawn monochrome and inherited from `currentColor` so the row reads as one
 * set rather than five clashing brand palettes. Chartmetric has no widely
 * recognised mark, so it gets a neutral analytics glyph.
 */
const MARKS: Record<string, React.ReactNode> = {
  spotify: (
    <path
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.59 14.43a.62.62 0 0 1-.86.21c-2.35-1.44-5.31-1.76-8.8-.96a.62.62 0 1 1-.28-1.21c3.82-.88 7.09-.5 9.73 1.1.29.18.39.57.21.86Zm1.23-2.74a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.24 1.33.36.23.48.7.25 1.07Zm.11-2.85c-3.23-1.92-8.55-2.1-11.63-1.16a.93.93 0 1 1-.54-1.79c3.54-1.07 9.42-.87 13.13 1.34a.93.93 0 1 1-.96 1.6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: (
    <path
      d="M16.5 2h-3v13.2a2.8 2.8 0 1 1-2.3-2.76V9.4a5.9 5.9 0 1 0 5.3 5.87V8.9a6.6 6.6 0 0 0 3.5 1V6.8a3.6 3.6 0 0 1-3.5-3.6V2Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4.5" />
      <path d="M10.2 9.3v5.4L15 12l-4.8-2.7Z" fill="currentColor" stroke="none" />
    </>
  ),
  analytics: (
    <>
      <path d="M3 20h18" />
      <path d="M6 20v-5.5M11 20V7M16 20v-9" />
      <circle cx="16" cy="7.6" r="1.6" />
    </>
  ),
};

export const PLATFORM_KEYS = Object.keys(MARKS);

export function PlatformIcon({ name, className = '' }: { name: string; className?: string }) {
  const mark = MARKS[name];
  if (!mark) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {mark}
    </svg>
  );
}
