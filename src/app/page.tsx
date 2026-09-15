import { Footer } from '@/components/Chrome';
import { Sections } from '@/components/sections';
import { StickyCta } from '@/components/StickyCta';
import { loadContent } from '@/lib/store';

export default function HomePage() {
  const content = loadContent();
  return (
    <>
      <main>
        <Sections sections={content.sections} />
      </main>
      <Footer footer={content.footer} />
      <StickyCta label={content.nav.ctaLabel} href={content.nav.ctaHref} />
    </>
  );
}
