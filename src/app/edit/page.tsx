import type { Metadata } from 'next';
import { isEditor } from '@/lib/auth';
import { loadContent } from '@/lib/store';
import { Editor } from './Editor';
import { Login } from './Login';

/** Keep the editor out of search results even if the URL leaks. */
export const metadata: Metadata = {
  title: 'Edit — fanbased',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function EditPage() {
  if (!(await isEditor())) return <Login />;
  return <Editor initial={loadContent()} />;
}
