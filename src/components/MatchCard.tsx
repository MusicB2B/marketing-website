/**
 * A static illustration of the product's match output, mirroring the real UI.
 * Not editable — it's a picture of the product, not copy.
 */
const BRAND_SIGNALS = ['Wellness culture', 'Soft premium', 'Low-sugar beverage'];
const ARTIST_SIGNALS = ['Indie lifestyle', 'Taste-led audience', 'Outdoor moments'];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-line text-ink rounded-full border bg-white px-3 py-1.5 text-[0.8rem] font-semibold">
      {children}
    </span>
  );
}

export function MatchCard() {
  return (
    <div className="border-line rounded-[1.5rem] border bg-white p-6 shadow-[0_24px_60px_-28px_rgba(16,19,26,0.28)]">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-muted text-[0.72rem] font-bold tracking-[0.16em] uppercase">
          Example partnership
        </span>
        <span className="border-brand text-brand rounded-full border px-3 py-1 text-[0.72rem] font-bold tracking-[0.1em] uppercase">
          Lifestyle fit
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="flex aspect-[4/3] flex-col justify-end rounded-xl bg-gradient-to-br from-[#e8c93f] to-[#c9a227] p-3">
          <span className="text-[0.66rem] font-bold tracking-[0.14em] text-white/85 uppercase">
            Beverage campaign
          </span>
          <span className="text-[1.05rem] leading-tight font-bold text-white">Spindrift</span>
          <span className="text-[0.82rem] text-white/90">Sparkling Water</span>
        </div>
        <div className="flex aspect-[4/3] flex-col justify-end rounded-xl bg-gradient-to-br from-[#2b2f3a] to-[#11141b] p-3">
          <span className="text-[0.66rem] font-bold tracking-[0.14em] text-white/70 uppercase">
            Artist audience
          </span>
          <span className="text-[1.05rem] leading-tight font-bold text-white">Men I Trust</span>
          <span className="text-[0.82rem] text-white/80">Indie / Alternative</span>
        </div>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <span className="text-ink text-[1.02rem] font-bold">Audience Compatibility</span>
        <span className="text-brand text-[2rem] leading-none font-bold tracking-tight">78%</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#eceef1]">
        <div className="bg-brand h-full rounded-full" style={{ width: '78%' }} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-5">
        <div>
          <p className="text-muted mb-2.5 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            Brand signals
          </p>
          <div className="flex flex-wrap gap-2">
            {BRAND_SIGNALS.map((signal) => (
              <Pill key={signal}>{signal}</Pill>
            ))}
          </div>
        </div>
        <div>
          <p className="text-muted mb-2.5 text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            Artist signals
          </p>
          <div className="flex flex-wrap gap-2">
            {ARTIST_SIGNALS.map((signal) => (
              <Pill key={signal}>{signal}</Pill>
            ))}
          </div>
        </div>
      </div>

      <div className="border-line space-y-2 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-muted text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            Partnership strength
          </span>
          <span className="text-ink text-[0.92rem] font-bold">Promising</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted text-[0.7rem] font-bold tracking-[0.14em] uppercase">
            Primary regions
          </span>
          <span className="text-ink text-[0.92rem] font-bold">US, Canada, EU</span>
        </div>
      </div>
    </div>
  );
}
