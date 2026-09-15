import { NextResponse } from 'next/server';
import { isEditor } from '@/lib/auth';
import { saveContent } from '@/lib/store';
import { ValidationError, parseSiteContent } from '@/lib/validate';

export const runtime = 'nodejs';

export async function PUT(request: Request) {
  if (!(await isEditor())) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  let content;
  try {
    content = parseSiteContent(await request.json());
  } catch (error) {
    const message =
      error instanceof ValidationError ? error.message : 'That content could not be read.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const result = await saveContent(content, 'site editor');
    return NextResponse.json({
      ok: true,
      backend: result.backend,
      url: result.url,
      message:
        result.backend === 'github'
          ? 'Saved. The live site updates in about a minute.'
          : 'Saved to your local file.',
    });
  } catch (error) {
    console.error('Failed to save content:', error);
    return NextResponse.json(
      { error: 'Could not save. Your changes are still here — try again in a moment.' },
      { status: 502 },
    );
  }
}
