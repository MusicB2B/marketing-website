'use client';

import { useEffect, useState } from 'react';

/**
 * Replaces the old sticky nav bar.
 *
 * A one-page lead-gen site does not need navigation, but it does need the
 * call to action to stay reachable once the hero button has scrolled away —
 * otherwise a visitor who reads to the bottom has to scroll back up to act.
 * This appears only after the hero is out of view.
 */
export function StickyCta({ label, href }: { label: string; href: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => setShown(!entry?.isIntersecting), {
      rootMargin: '-80px 0px 0px 0px',
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!label) return null;

  return (
    <a
      href={href || '#'}
      className={`bg-brand hover:bg-brand-dark fixed top-5 right-5 z-50 rounded-xl px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-lg transition-all duration-300 ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
      }`}
    >
      {label}
    </a>
  );
}
