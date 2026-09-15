export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="22" cy="12" r="10.5" stroke="currentColor" strokeWidth="2.2" />
        <path
          d="M17 2.6a10.5 10.5 0 0 1 0 18.8 10.5 10.5 0 0 1 0-18.8Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
      <span className="text-[1.45rem] font-bold tracking-[-0.04em]">fanbasd</span>
    </span>
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
