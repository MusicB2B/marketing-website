/**
 * Ported from components/Brand/FanbasdLogo.tsx in the platform repo so the
 * marketing site and the product use the identical mark.
 *
 * `id` must be unique per instance on a page — the clip path is referenced by
 * id, and duplicate ids make the overlap render blank in some browsers.
 */
export function Logo({
  width = 180,
  height = 50,
  id = 'fanbased-logo',
  className,
  title = 'Fanbased',
}: {
  width?: number;
  height?: number;
  id?: string;
  className?: string;
  title?: string;
}) {
  const clipId = `${id}-overlap`;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 460 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>

      <defs>
        <clipPath id={clipId}>
          <path d="M63 27C72 35 77 45 77 55C77 65 72 75 63 83C54 75 49 65 49 55C49 45 54 35 63 27Z" />
        </clipPath>
      </defs>

      <circle cx="45" cy="55" r="32" stroke="currentColor" strokeWidth="6" />
      <circle cx="78" cy="55" r="32" stroke="currentColor" strokeWidth="6" />

      <g clipPath={`url(#${clipId})`}>
        <line
          x1="50"
          y1="34"
          x2="76"
          y2="41"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="49"
          y1="45"
          x2="78"
          y2="52"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="49"
          y1="56"
          x2="78"
          y2="63"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="67"
          x2="76"
          y2="74"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <text
        x="124"
        y="77"
        fill="currentColor"
        fontFamily="Roboto, Inter, Arial, sans-serif"
        fontSize="68"
        fontWeight="800"
        letterSpacing="4"
      >
        fanbased
      </text>
    </svg>
  );
}

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-150';
  const sizes = { md: 'px-5 py-2.5 text-[0.95rem]', lg: 'px-7 py-3.5 text-[1.05rem]' };
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'border border-brand/40 bg-white text-ink hover:border-brand hover:bg-brand-tint',
    ghost: 'border border-white/25 text-white hover:bg-white/10',
  };
  return (
    <a href={href} className={`${base} ${sizes[size]} ${variants[variant]}`}>
      {children}
    </a>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="text-brand mb-4 text-[0.78rem] font-bold tracking-[0.16em] uppercase">
      {children}
    </p>
  );
}
