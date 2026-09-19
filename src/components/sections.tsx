import { Button, Eyebrow, Logo } from '@/components/Brand';
import { Icon } from '@/components/Icon';
import { RequestAccessForm } from '@/components/RequestAccessForm';
import { CampaignDemo } from '@/components/CampaignDemo';
import { VibeChart } from '@/components/VibeChart';
import { HeroVisual } from '@/components/HeroVisual';
import type { Section } from '@/types/content';

/** Maps the constrained style tokens onto real classes. */
const HEADING_SCALE = {
  sm: 'text-[1.9rem] sm:text-[2.2rem]',
  md: 'text-[2.3rem] sm:text-[2.9rem]',
  lg: 'text-[2.9rem] sm:text-[4rem] lg:text-[4.6rem]',
} as const;

const THEME = {
  light: 'bg-canvas text-body',
  tint: 'bg-white text-body border-y border-line',
  dark: 'bg-night text-white/70',
} as const;

function Shell({
  section,
  children,
  className = '',
}: {
  section: Section;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={`${THEME[section.style.theme]} px-6 py-14 sm:py-20 ${className}`}
    >
      <div
        className={`mx-auto w-full max-w-6xl ${section.style.align === 'center' ? 'text-center' : ''}`}
      >
        {children}
      </div>
    </section>
  );
}

function Heading({ section, children }: { section: Section; children: React.ReactNode }) {
  const dark = section.style.theme === 'dark';
  return (
    <h2
      className={`${HEADING_SCALE[section.style.scale]} leading-[1.05] font-bold ${dark ? 'text-white' : ''}`}
    >
      {children}
    </h2>
  );
}

function Hero({ section }: { section: Section }) {
  const f = section.fields;
  return (
    <section id={section.id} className="dot-field relative px-6 pt-10 pb-12 sm:pt-14 sm:pb-16">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.18fr] lg:gap-12">
        <div className={section.style.align === 'center' ? 'text-center' : ''}>
          <span
            className={`text-brand mb-8 inline-block sm:mb-10 ${
              section.style.align === 'center' ? '' : '-ml-1'
            }`}
          >
            <Logo id="logo-hero" width={300} height={82} />
          </span>
          <Eyebrow>{f.eyebrow}</Eyebrow>
          <h1
            className={`${HEADING_SCALE[section.style.scale]} leading-[0.98] font-bold text-balance`}
          >
            {f.heading}
          </h1>
          {f.subheading && (
            <p className="text-body mt-5 max-w-xl text-[1.15rem] leading-relaxed font-medium sm:text-[1.3rem]">
              {f.subheading}
            </p>
          )}
          <div
            className={`mt-7 flex flex-wrap gap-3 ${section.style.align === 'center' ? 'justify-center' : ''}`}
          >
            {f.primaryLabel && (
              <Button href={f.primaryHref || '#'} size="lg">
                {f.primaryLabel}
              </Button>
            )}
            {f.secondaryLabel && (
              <Button href={f.secondaryHref || '#'} variant="secondary" size="lg">
                {f.secondaryLabel}
              </Button>
            )}
          </div>
          {f.footnote && <p className="text-muted mt-7 text-[0.95rem]">{f.footnote}</p>}
        </div>
        <div className="lg:pl-4">
          <HeroVisual
            variant={f.visual || 'livePanel'}
            image={f.visualImage || ''}
            imageAlt={f.visualImageAlt || ''}
            disclaimer={f.disclaimer || ''}
            items={section.items}
            labels={{
              eyebrow: f.panelEyebrow || 'Example Partnership',
              score: f.panelScoreLabel || 'Audience Compatibility',
              brandSignals: f.panelBrandLabel || 'Brand Signals',
              artistSignals: f.panelArtistLabel || 'Artist Signals',
              strength: f.panelStrengthLabel || 'Partnership Strength',
              regions: f.panelRegionsLabel || 'Primary Regions',
            }}
          />
        </div>
      </div>
    </section>
  );
}

function Logos({ section }: { section: Section }) {
  return (
    <Shell section={section} className="!py-14">
      {section.fields.heading && (
        <p className="text-muted mb-7 text-center text-[0.78rem] font-bold tracking-[0.16em] uppercase">
          {section.fields.heading}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
        {section.items.map((item) => (
          <span key={item.id} className="text-muted text-[1.2rem] font-bold tracking-tight">
            {item.name}
          </span>
        ))}
      </div>
    </Shell>
  );
}

function HowItWorks({ section }: { section: Section }) {
  return (
    <Shell section={section}>
      <Eyebrow>{section.fields.eyebrow}</Eyebrow>
      <Heading section={section}>{section.fields.heading}</Heading>
      {section.fields.subheading && (
        <p className="mt-5 max-w-2xl text-[1.12rem] leading-relaxed">{section.fields.subheading}</p>
      )}
      <ol className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-3">
        {section.items.map((item, index) => (
          <li key={item.id} className="flex gap-3">
            <span className="bg-brand-tint text-brand mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.85rem] font-bold">
              {index + 1}
            </span>
            <div>
              <h3 className="mb-1 text-[1.05rem] leading-snug font-bold">{item.title}</h3>
              <p className="text-[0.95rem] leading-relaxed">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Shell>
  );
}

function Features({ section }: { section: Section }) {
  return (
    <Shell section={section}>
      <Eyebrow>{section.fields.eyebrow}</Eyebrow>
      <Heading section={section}>{section.fields.heading}</Heading>
      {section.fields.subheading && (
        <p className="mt-5 max-w-2xl text-[1.12rem] leading-relaxed">{section.fields.subheading}</p>
      )}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <article
            key={item.id}
            className="border-line rounded-card border bg-white p-4 transition-shadow duration-200 hover:shadow-[0_18px_44px_-24px_rgba(16,19,26,0.25)]"
          >
            <div className="flex items-center gap-2.5">
              {item.icon && (
                <span className="bg-brand-tint text-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                  <Icon name={item.icon} className="h-[1rem] w-[1rem]" />
                </span>
              )}
              <h3 className="text-[0.98rem] leading-tight font-bold">{item.title}</h3>
            </div>
            <p className="mt-2 text-[0.88rem] leading-snug">{item.body}</p>
          </article>
        ))}
      </div>
    </Shell>
  );
}

function Stats({ section }: { section: Section }) {
  return (
    <Shell section={section}>
      {section.fields.heading && <Heading section={section}>{section.fields.heading}</Heading>}
      <div className="mt-10 grid gap-10 sm:grid-cols-3">
        {section.items.map((item) => (
          <div key={item.id}>
            <p className="text-brand text-[3.2rem] leading-none font-bold tracking-tight">
              {item.value}
            </p>
            <p className="mx-auto mt-3 max-w-[16rem] text-[1rem] leading-relaxed">{item.label}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Cta({ section }: { section: Section }) {
  const f = section.fields;
  return (
    <Shell section={section}>
      <Heading section={section}>{f.heading}</Heading>
      {f.subheading && (
        <p className="mx-auto mt-5 max-w-xl text-[1.12rem] leading-relaxed">{f.subheading}</p>
      )}
      {f.primaryLabel && (
        <div className="mt-9 flex justify-center">
          <Button href={f.primaryHref || '#'} size="lg">
            {f.primaryLabel}
          </Button>
        </div>
      )}
      {f.footnote && <p className="mt-6 text-[0.95rem] text-white/45">{f.footnote}</p>}
    </Shell>
  );
}

function AudienceSplit({ section }: { section: Section }) {
  return (
    <Shell section={section} className="!py-8 sm:!py-10">
      {section.fields.heading && <h2 className="sr-only">{section.fields.heading}</h2>}
      <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {section.items.map((item) => (
          <div key={item.id} className="flex items-start gap-3.5">
            {item.icon && (
              <span className="bg-brand-tint text-brand mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Icon name={item.icon} className="h-[1.2rem] w-[1.2rem]" />
              </span>
            )}
            <div>
              <p className="text-brand text-[0.72rem] font-bold tracking-[0.16em] uppercase">
                {item.label}
              </p>
              <p className="text-ink mt-1 text-[1.05rem] leading-snug font-bold">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function CampaignDemoSection({ section }: { section: Section }) {
  return (
    <Shell section={section} className="!border-t-0 !pt-0">
      <CampaignDemo section={section} />
    </Shell>
  );
}

function Differentiator({ section }: { section: Section }) {
  const f = section.fields;
  return (
    <Shell section={section}>
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>{f.eyebrow}</Eyebrow>
          <Heading section={section}>{f.heading}</Heading>
          {f.bodyOne && <p className="mt-6 text-[1.08rem] leading-relaxed">{f.bodyOne}</p>}
          {f.bodyTwo && <p className="mt-4 text-[1.08rem] leading-relaxed">{f.bodyTwo}</p>}

          <ul className="mt-8 space-y-3.5">
            {section.items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <span className="bg-brand-tint text-brand mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5L19 8" />
                  </svg>
                </span>
                <span className="text-[1.02rem] leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <VibeChart
          title={f.chartTitle || 'Brand vs Artist Vibes'}
          subtitle={f.chartSubtitle || ''}
          legendCampaign={f.chartLegendCampaign || 'Campaign'}
          legendArtist={f.chartLegendArtist || 'Artist'}
        />
      </div>
    </Shell>
  );
}

function DataSources({ section }: { section: Section }) {
  return (
    <Shell section={section} className="!py-10 sm:!py-12">
      <div className="text-center">
        <Eyebrow>{section.fields.eyebrow}</Eyebrow>
        <h2 className="text-ink text-[1.5rem] leading-snug font-bold sm:text-[1.8rem]">
          {section.fields.heading}
        </h2>
        {section.fields.subheading && (
          <p className="mx-auto mt-2.5 max-w-xl text-[1rem] leading-relaxed">
            {section.fields.subheading}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {section.items.map((item) => (
            <span
              key={item.id}
              className="border-line text-ink rounded-full border bg-white px-3.5 py-1.5 text-[0.88rem] font-semibold"
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function RequestAccess({ section }: { section: Section }) {
  const f = section.fields;
  return (
    <Shell section={section} className="!py-12 sm:!py-16">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>{f.eyebrow}</Eyebrow>
        <h2 className="text-ink text-[1.6rem] leading-tight font-bold sm:text-[2.1rem]">
          {f.heading}
        </h2>
        {f.subheading && (
          <p className="mx-auto mt-3 max-w-xl text-[1.02rem] leading-relaxed">{f.subheading}</p>
        )}
        <div className="mt-7">
          <RequestAccessForm
            submitLabel={f.submitLabel || 'Request access'}
            successMessage={f.successMessage || 'Thanks, we will be in touch shortly.'}
            labels={{ name: f.nameLabel || 'Name', email: f.emailLabel || 'Email' }}
          />
        </div>
        {f.footnote && <p className="text-muted mt-4 text-[0.88rem]">{f.footnote}</p>}
      </div>
    </Shell>
  );
}

const RENDERERS = {
  hero: Hero,
  logos: Logos,
  howItWorks: HowItWorks,
  features: Features,
  stats: Stats,
  cta: Cta,
  requestAccess: RequestAccess,
  audienceSplit: AudienceSplit,
  differentiator: Differentiator,
  dataSources: DataSources,
  campaignDemo: CampaignDemoSection,
} as const;

export function SectionRenderer({ section }: { section: Section }) {
  const Component = RENDERERS[section.type];
  return <Component section={section} />;
}

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections
        .filter((section) => section.visible)
        .map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
    </>
  );
}
