import { Button, Eyebrow } from '@/components/Brand';
import { MatchCard } from '@/components/MatchCard';
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
      className={`${THEME[section.style.theme]} px-6 py-20 sm:py-28 ${className}`}
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
    <section id={section.id} className="dot-field relative px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className={section.style.align === 'center' ? 'text-center' : ''}>
          <Eyebrow>{f.eyebrow}</Eyebrow>
          <h1
            className={`${HEADING_SCALE[section.style.scale]} leading-[0.98] font-bold text-balance`}
          >
            {f.heading}
          </h1>
          {f.subheading && (
            <p className="text-body mt-6 max-w-xl text-[1.15rem] leading-relaxed font-medium sm:text-[1.3rem]">
              {f.subheading}
            </p>
          )}
          <div
            className={`mt-9 flex flex-wrap gap-3 ${section.style.align === 'center' ? 'justify-center' : ''}`}
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
          {f.footnote && <p className="text-muted mt-8 text-[0.95rem]">{f.footnote}</p>}
        </div>
        <div className="lg:pl-4">
          <MatchCard />
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
      <ol className="mt-14 grid gap-8 sm:grid-cols-3">
        {section.items.map((item, index) => (
          <li key={item.id}>
            <span className="bg-brand-tint text-brand mb-5 flex h-11 w-11 items-center justify-center rounded-full text-[1.05rem] font-bold">
              {index + 1}
            </span>
            <h3 className="mb-2.5 text-[1.22rem] font-bold">{item.title}</h3>
            <p className="text-[1.02rem] leading-relaxed">{item.body}</p>
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
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <article
            key={item.id}
            className="border-line rounded-card border bg-white p-7 transition-shadow duration-200 hover:shadow-[0_18px_44px_-24px_rgba(16,19,26,0.25)]"
          >
            <h3 className="mb-2.5 text-[1.18rem] font-bold">{item.title}</h3>
            <p className="text-[1rem] leading-relaxed">{item.body}</p>
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
      {f.footnote && <p className="text-muted mt-6 text-[0.95rem]">{f.footnote}</p>}
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
