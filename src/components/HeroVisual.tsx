import Image from 'next/image';
import { LiveMatchPanel } from '@/components/LiveMatchPanel';
import type { PanelLabels } from '@/components/LiveMatchPanel';
import type { SectionItem } from '@/types/content';

const DEFAULT_DISCLAIMER =
  'Illustrative examples only. The partnerships shown are hypothetical demonstrations of how the ' +
  'Fanbased matching engine scores audience alignment. They are not live, proposed, or completed ' +
  'partnerships, and Fanbased has no commercial relationship with, or endorsement from, any brand ' +
  'or artist shown. All names, trademarks and footage remain the property of their respective ' +
  'owners. Scores and signals are generated from sample data for demonstration purposes.';

/**
 * The still alternative to the rotating panel.
 *
 * Rendered through next/image so the source file can stay a full-quality PNG
 * while visitors are served a resized WebP or AVIF. It sits above the fold, so
 * it loads with priority rather than lazily.
 */
function ImageFrame({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="border-muted/50 rounded-card flex aspect-[4/3] w-full flex-col items-center justify-center border-2 border-dashed p-8 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted mb-3 h-8 w-8"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m4 17 4.5-4.5L12 16l3-3 5 5" />
        </svg>
        <p className="text-muted text-[0.9rem] font-bold">Image goes here</p>
        <p className="text-muted mt-1 text-[0.8rem]">
          Add the file to <code>public/</code>, then put its path in the Image file box.
        </p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1581}
      height={995}
      priority
      sizes="(max-width: 1024px) 100vw, 600px"
      className="rounded-card h-auto w-full"
    />
  );
}

export function HeroVisual({
  variant,
  image,
  imageAlt,
  disclaimer,
  labels,
  items,
}: {
  variant: string;
  image: string;
  imageAlt: string;
  disclaimer: string;
  labels: PanelLabels;
  items: SectionItem[];
}) {
  if (variant === 'image') return <ImageFrame src={image} alt={imageAlt} />;
  return (
    <LiveMatchPanel disclaimer={disclaimer || DEFAULT_DISCLAIMER} labels={labels} items={items} />
  );
}
