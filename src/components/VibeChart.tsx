/**
 * Campaign tone against artist tone — the qualitative half of a match score,
 * which is the thing competitors cannot show.
 *
 * Illustration, mirroring the product's own output.
 */
const VIBES = [
  { label: 'Energetic', campaign: 70, artist: 80 },
  { label: 'Elegant', campaign: 80, artist: 75 },
  { label: 'Bold', campaign: 85, artist: 85 },
  { label: 'Urban', campaign: 75, artist: 90 },
  { label: 'Global', campaign: 90, artist: 75 },
];

function Key({ colour, label }: { colour: string; label: string }) {
  return (
    <span className="text-body flex items-center gap-2 text-[0.92rem] font-medium">
      <span className={`h-3 w-3 rounded-[3px] ${colour}`} />
      {label}
    </span>
  );
}

export function VibeChart({
  title,
  subtitle,
  legendCampaign,
  legendArtist,
}: {
  title: string;
  subtitle: string;
  legendCampaign: string;
  legendArtist: string;
}) {
  return (
    <div className="bg-surface-alt border-line rounded-card border p-6 sm:p-8">
      <h3 className="text-ink text-[1.3rem] font-bold">{title}</h3>
      <p className="text-muted mt-1 text-[0.82rem] font-semibold tracking-[0.1em] uppercase">
        {subtitle}
      </p>

      <div className="mt-5 mb-7 flex gap-5">
        <Key colour="bg-campaign" label={legendCampaign} />
        <Key colour="bg-brand" label={legendArtist} />
      </div>

      <div className="space-y-5">
        {VIBES.map((vibe) => (
          <div key={vibe.label}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-ink text-[0.92rem] font-bold tracking-[0.06em] uppercase">
                {vibe.label}
              </span>
              <span className="text-muted text-[0.92rem] font-medium tabular-nums">
                {vibe.campaign} / {vibe.artist}
              </span>
            </div>

            <div className="space-y-1">
              <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="bg-campaign h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${vibe.campaign}%` }}
                />
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="bg-brand h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${vibe.artist}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
