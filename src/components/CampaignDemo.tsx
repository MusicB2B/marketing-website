import type { Section } from '@/types/content';

/** Split "a, b, c" into pills. Commas keep the editor simple for non-technical users. */
function splitList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-body rounded-full bg-black/[0.045] px-2.5 py-1 text-[0.74rem] font-semibold">
      {children}
    </span>
  );
}

export function CampaignDemo({ section }: { section: Section }) {
  const f = section.fields;
  const rows = [1, 2, 3, 4]
    .map((n) => ({ label: f[`row${n}Label`] ?? '', value: f[`row${n}Value`] ?? '' }))
    .filter((row) => row.label || row.value);

  return (
    <div className="border-line rounded-card overflow-hidden border bg-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.3)]">
      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-6 lg:p-6">
        <div className="bg-surface-alt border-line flex flex-col rounded-xl border p-5">
          <p className="text-muted mb-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase">
            {f.briefLabel}
          </p>
          <p className="text-ink mb-6 text-[1.15rem] font-bold">{f.campaignName}</p>

          <dl className="mb-8 grid grid-cols-2 gap-x-4 gap-y-4">
            {rows.map((row) => (
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
              {f.toneLabel}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {splitList(f.tones ?? '').map((tone) => (
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

        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="text-ink text-[1.02rem] font-bold">{f.matchesHeading}</p>
            <p className="text-muted text-[0.82rem]">{f.matchesCount}</p>
          </div>

          <ol className="space-y-2.5">
            {section.items.map((item, index) => {
              const top = index === 0;
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-3.5 rounded-xl border p-3.5 ${
                    top ? 'border-brand/30 bg-brand-tint/40' : 'border-line bg-white'
                  }`}
                >
                  <span className="text-muted w-3 text-[0.85rem] font-semibold">{index + 1}</span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.76rem] font-bold ${
                      index % 2 === 0 ? 'bg-brand-tint text-brand' : 'bg-campaign/15 text-campaign'
                    }`}
                  >
                    {item.initials}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-ink text-[1rem] leading-tight font-bold">{item.name}</p>
                    {top && f.topLabel && (
                      <p className="text-brand text-[0.78rem] font-semibold">{f.topLabel}</p>
                    )}
                    {item.note && <p className="text-body mt-0.5 text-[0.88rem]">{item.note}</p>}
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {splitList(item.tags ?? '').map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-[1.3rem] leading-none font-bold tracking-tight ${
                        top ? 'text-brand' : 'text-ink'
                      }`}
                    >
                      {item.score}
                    </p>
                    <p className="text-muted mt-1 text-[0.62rem] font-bold tracking-[0.1em] uppercase">
                      {f.scoreLabel}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
