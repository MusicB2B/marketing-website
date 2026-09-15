/**
 * A still of real matching-engine output: the campaign brief on the left,
 * the ranked artists it produced on the right.
 *
 * Illustration, not live data — the figures mirror the product's own demo so
 * the page shows what the engine does instead of describing it.
 */
const BRIEF = [
  { label: 'Market position', value: 'Premium' },
  { label: 'Primary age', value: '18–24' },
  { label: 'Gender split', value: '50/50' },
  { label: 'Target markets', value: 'GB, US, FR' },
];

const TONES = ['Confident', 'Refined', 'Creative', 'Understated', 'Culturally relevant'];

const MATCHES = [
  {
    rank: 1,
    initials: 'KR',
    name: 'Kojey Radical',
    top: true,
    note: 'Strong female GB alignment',
    tags: ['Female 29%', 'GB 93%', 'Vibe: Bold'],
    score: '68.4%',
  },
  {
    rank: 2,
    initials: 'O+',
    name: 'Omar+',
    top: false,
    note: 'Strong female GB alignment',
    tags: ['Female 32%', 'GB 94%', 'Vibe: Elegant'],
    score: '68.4%',
  },
  {
    rank: 3,
    initials: 'KN',
    name: 'Knucks',
    top: false,
    note: 'Strong male GB alignment',
    tags: ['Male 39%', 'GB 96%', 'Vibe: Urban'],
    score: '67.9%',
  },
  {
    rank: 4,
    initials: 'RB',
    name: 'RUBII',
    top: false,
    note: 'Strong female GB alignment',
    tags: ['Female 29%', 'GB 73%'],
    score: '66.7%',
  },
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-body rounded-full bg-black/[0.045] px-2.5 py-1 text-[0.74rem] font-semibold">
      {children}
    </span>
  );
}

export function CampaignDemo() {
  return (
    <div className="border-line rounded-card overflow-hidden border bg-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.3)]">
      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-6 lg:p-6">
        {/* Campaign brief */}
        <div className="bg-surface-alt border-line flex flex-col rounded-xl border p-5">
          <p className="text-muted mb-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase">
            Campaign brief
          </p>
          <p className="text-ink mb-6 text-[1.15rem] font-bold">Sunglasses Launch</p>

          <dl className="mb-8 grid grid-cols-2 gap-x-4 gap-y-4">
            {BRIEF.map((row) => (
              <div key={row.label}>
                <dt className="text-muted mb-0.5 text-[0.66rem] font-bold tracking-[0.12em] uppercase">
                  {row.label}
                </dt>
                <dd className="text-ink text-[0.95rem] font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto">
            <p className="text-muted mb-2.5 text-[0.66rem] font-bold tracking-[0.12em] uppercase">
              Brand tone
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((tone) => (
                <span
                  key={tone}
                  className="border-line text-ink rounded-full border bg-white px-2.5 py-1 text-[0.76rem] font-semibold"
                >
                  {tone}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ranked matches */}
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-ink text-[1.02rem] font-bold">Ranked artist matches</p>
            <p className="text-muted text-[0.82rem]">Showing 4 of 10</p>
          </div>

          <ol className="space-y-2.5">
            {MATCHES.map((match) => (
              <li
                key={match.rank}
                className={`flex items-center gap-3.5 rounded-xl border p-3.5 ${
                  match.top ? 'border-brand/30 bg-brand-tint/40' : 'border-line bg-white'
                }`}
              >
                <span className="text-muted w-3 text-[0.85rem] font-semibold">{match.rank}</span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.76rem] font-bold ${
                    match.rank % 2 ? 'bg-brand-tint text-brand' : 'bg-campaign/15 text-campaign'
                  }`}
                >
                  {match.initials}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-ink text-[1rem] leading-tight font-bold">{match.name}</p>
                  {match.top && (
                    <p className="text-brand text-[0.78rem] font-semibold">Top match</p>
                  )}
                  <p className="text-body mt-0.5 text-[0.88rem]">{match.note}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {match.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p
                    className={`text-[1.3rem] leading-none font-bold tracking-tight ${
                      match.top ? 'text-brand' : 'text-ink'
                    }`}
                  >
                    {match.score}
                  </p>
                  <p className="text-muted mt-1 text-[0.62rem] font-bold tracking-[0.1em] uppercase">
                    Match score
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
