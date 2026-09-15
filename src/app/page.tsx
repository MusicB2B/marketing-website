import { Footer, Header } from '@/components/Chrome';
import { Sections } from '@/components/sections';
import { loadContent } from '@/lib/store';

export default function HomePage() {
  const content = loadContent();
  return (
    <>
      <Header nav={content.nav} />
      <main>
        <Sections sections={content.sections} />
      </main>
      <Footer footer={content.footer} />
    </>
  );
}
