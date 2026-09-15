import { Button, Logo } from '@/components/Brand';
import type { SiteContent } from '@/types/content';

export function Header({ nav }: { nav: SiteContent['nav'] }) {
  return (
    <header className="border-line/70 sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-brand" aria-label="fanbasd home">
          <Logo />
        </a>
        <nav className="flex items-center gap-2 sm:gap-4">
          {nav.signInLabel && (
            <a
              href={nav.signInHref || '#'}
              className="text-ink hover:text-brand px-3 py-2 text-[0.95rem] font-semibold transition-colors"
            >
              {nav.signInLabel}
            </a>
          )}
          {nav.ctaLabel && <Button href={nav.ctaHref || '#'}>{nav.ctaLabel}</Button>}
        </nav>
      </div>
    </header>
  );
}

export function Footer({ footer }: { footer: SiteContent['footer'] }) {
  return (
    <footer className="bg-night px-6 py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 text-center">
        <span className="text-brand">
          <Logo />
        </span>
        {footer.tagline && <p className="text-[1rem] text-white/60">{footer.tagline}</p>}
        {footer.copyright && (
          <p className="text-[0.82rem] tracking-[0.1em] text-white/35 uppercase">
            {footer.copyright}
          </p>
        )}
      </div>
    </footer>
  );
}
