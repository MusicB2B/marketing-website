import { LiveMatchPanel } from '@/components/LiveMatchPanel';
import type { PanelLabels } from '@/components/LiveMatchPanel';
import type { SectionItem } from '@/types/content';

const DEFAULT_DISCLAIMER =
  'Illustrative examples only. The partnerships shown are hypothetical demonstrations of how the ' +
  'Fanbased matching engine scores audience alignment. They are not live, proposed, or completed ' +
  'partnerships, and Fanbased has no commercial relationship with, or endorsement from, any brand ' +
  'or artist shown. All names, trademarks and footage remain the property of their respective ' +
  'owners. Scores and signals are generated from sample data for demonstration purposes.';

/** Placeholder for the explainer image, until one exists. */
function ImageFrame({ src }: { src: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="rounded-card border-line w-full border" />;
  }
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

export function HeroVisual({
  variant,
  image,
  disclaimer,
  labels,
  items,
}: {
  variant: string;
  image: string;
  disclaimer: string;
  labels: PanelLabels;
  items: SectionItem[];
}) {
  if (variant === 'image') return <ImageFrame src={image} />;
  return (
    <LiveMatchPanel disclaimer={disclaimer || DEFAULT_DISCLAIMER} labels={labels} items={items} />
  );
}
