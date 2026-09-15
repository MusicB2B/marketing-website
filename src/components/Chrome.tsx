import { Logo } from '@/components/Brand';
import type { SiteContent } from '@/types/content';

export function Footer({ footer }: { footer: SiteContent['footer'] }) {
  return (
    <footer className="bg-night px-6 pt-4 pb-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 text-center">
        <span className="text-brand">
          <Logo id="logo-footer" width={150} height={42} />
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
