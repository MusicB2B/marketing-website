import { promises as fs } from 'fs';
import path from 'path';
import seed from '../../content/site.json';
import { parseSiteContent } from '@/lib/validate';
import type { SiteContent } from '@/types/content';

/**
 * Content storage.
 *
 * Reads come from the committed content/site.json, imported statically so the
 * public page is fully static and costs nothing to serve.
 *
 * Writes go back to that same file:
 *   - in production, as a commit via the GitHub Contents API, which triggers a
 *     Vercel redeploy (and gives a full history of every copy change);
 *   - in local dev with no GITHUB_TOKEN, straight to disk.
 *
 * Swapping to a database later means replacing `saveContent` and `loadContent`
 * only — nothing else imports the backend.
 */

export interface SaveResult {
  backend: 'github' | 'local';
  /** Commit URL, when saved via GitHub. */
  url?: string;
}

export function loadContent(): SiteContent {
  return parseSiteContent(seed);
}

function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return {
    token,
    owner: process.env.GITHUB_OWNER ?? 'MusicB2B',
    repo: process.env.GITHUB_REPO ?? 'marketing-website',
    branch: process.env.GITHUB_BRANCH ?? 'main',
    contentPath: process.env.CONTENT_PATH ?? 'content/site.json',
  };
}

async function githubRequest(url: string, token: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub ${response.status}: ${detail.slice(0, 300)}`);
  }
  return response.json();
}

export async function saveContent(content: SiteContent, author: string): Promise<SaveResult> {
  const serialised = `${JSON.stringify(content, null, 2)}\n`;
  const config = githubConfig();

  if (!config) {
    const target = path.join(process.cwd(), process.env.CONTENT_PATH ?? 'content/site.json');
    await fs.writeFile(target, serialised, 'utf8');
    return { backend: 'local' };
  }

  const { token, owner, repo, branch, contentPath } = config;
  const base = `https://api.github.com/repos/${owner}/${repo}/contents/${contentPath}`;

  // The Contents API needs the blob sha of the file being replaced.
  let sha: string | undefined;
  try {
    const existing = await githubRequest(`${base}?ref=${branch}`, token);
    sha = typeof existing?.sha === 'string' ? existing.sha : undefined;
  } catch {
    // First write — the file does not exist on this branch yet.
  }

  const result = await githubRequest(base, token, {
    method: 'PUT',
    body: JSON.stringify({
      message: `content: update site copy (${author})`,
      content: Buffer.from(serialised, 'utf8').toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  return { backend: 'github', url: result?.commit?.html_url };
}
