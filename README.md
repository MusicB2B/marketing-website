# fanbased — marketing website

The public marketing page for [fanbased](https://fanbased.com), plus a small
password-protected editor at `/edit` so product, marketing and sales can change
the copy without a developer.

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Node 22

---

## Quick start

```bash
nvm use            # Node 22
npm install
cp .env.example .env.local
```

Open `.env.local` and set two values:

```bash
EDITOR_PASSWORD=pick-something
EDITOR_SESSION_SECRET=$(openssl rand -hex 32)
```

Then:

```bash
npm run dev
```

- Site — http://localhost:3000
- Editor — http://localhost:3000/edit

Locally, with no `GITHUB_TOKEN` set, saving writes straight to
`content/site.json` on disk. Commit that file like any other change.

---

## How the editing works

All editable copy lives in **one file**: [`content/site.json`](content/site.json).

```
/edit  →  edit + preview  →  Save  →  commit to content/site.json  →  Vercel redeploys  →  live
```

The public page is statically generated from that file, so it costs nothing to
serve and is as fast as a plain HTML page. The trade-off is that publishing is
not instant — a save takes roughly **30–60 seconds** to appear on the live site
while Vercel rebuilds. The editor's own preview updates immediately, so only
the public site lags.

Because every save is a real git commit, you get a full history of copy
changes for free: who changed what, when, and a one-click revert in GitHub.

### What the team can change

| They can                                                      | They cannot                                |
| ------------------------------------------------------------- | ------------------------------------------ |
| Edit any headline, paragraph, button label or link            | Change the fonts, brand colours or spacing |
| Reorder sections (↑ / ↓)                                      | Add brand-new section types                |
| Hide or show any section                                      | Break the layout                           |
| Add, reorder and delete items (features, steps, logos, stats) | Write HTML or CSS                          |
| Set per-section text size, alignment and background           |                                            |

The style controls are deliberately a fixed set of tokens (Small/Medium/Large,
Left/Centre, Grey/White/Dark) rather than free-form CSS. That covers almost
every "can you make this bigger" request while keeping the page on-brand.

---

## Adding a field or a section

The editor has no per-section UI code — it renders itself from
[`src/lib/schema.ts`](src/lib/schema.ts).

**To add a field** to an existing section, add one entry to that section's
`fields` array in `schema.ts`, then read it in the matching component in
[`src/components/sections.tsx`](src/components/sections.tsx). It appears in
`/edit` automatically.

**To add a whole new section type:**

1. Add the name to `SectionType` in [`src/types/content.ts`](src/types/content.ts).
2. Add its spec to `SECTION_SCHEMA` in `src/lib/schema.ts`.
3. Write the component and register it in `RENDERERS` in `src/components/sections.tsx`.
4. Add an instance to the `sections` array in `content/site.json`.

---

## Deploying

The site is built for **Vercel**. Import the repo, set the environment
variables below, and point the domain at it.

### Environment variables (Vercel → Settings → Environment Variables)

| Variable                | Notes                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| `EDITOR_PASSWORD`       | Shared password for `/edit`. Change it here and redeploy — no code change. |
| `EDITOR_SESSION_SECRET` | `openssl rand -hex 32`. Signs the session cookie.                          |
| `GITHUB_TOKEN`          | Fine-grained PAT, **this repo only**, Contents: Read and write.            |
| `GITHUB_OWNER`          | `MusicB2B`                                                                 |
| `GITHUB_REPO`           | `marketing-website`                                                        |
| `GITHUB_BRANCH`         | `main`                                                                     |
| `NEXT_PUBLIC_SITE_URL`  | e.g. `https://fanbased.com`                                                 |

Create the token at
<https://github.com/settings/personal-access-tokens/new> — scope it to this
repository only and give it nothing beyond Contents: Read and write. Without
it, saving in production will fail.

### Using a domain registered elsewhere (e.g. Hostinger)

You do not need to move the domain. Keep it where it is, and point two DNS
records at Vercel:

- `A` record on `@` → `76.76.21.21`
- `CNAME` on `www` → `cname.vercel-dns.com`

Any email on that domain keeps working, because MX records are untouched.

> This app **cannot** be deployed by FTP to shared hosting. `/edit` needs a
> server to check the password and commit the save; on static hosting the
> password would have to sit in client-side JavaScript, where anyone can read
> it. If the site must be served from shared hosting, the fallback is to
> static-export the public page and host only `/edit` on Vercel.

---

## Security

- `/edit` is behind a shared password and is `noindex`, and `robots.txt`
  disallows it — but **the URL is not a secret**. The password is the lock.
- The session is an HMAC-signed, httpOnly cookie. It expires after
  `EDITOR_SESSION_HOURS` (default 12).
- Everything saved is re-validated server-side against the schema in
  `src/lib/validate.ts`, so a signed-in editor still cannot write arbitrary
  JSON into the repo.
- `GITHUB_TOKEN` is server-only and never reaches the browser.
- **Rotate `EDITOR_PASSWORD` when someone leaves the team.**

---

## Scripts

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
npm run format     # prettier --write .
```

---

## Project layout

```
content/site.json          all editable copy — the only file the editor writes
src/
  app/
    page.tsx               the public marketing page
    edit/                  the editor (login gate + editor UI)
    api/auth/              password check, sets the session cookie
    api/content/           validates and saves
    globals.css            design tokens, mirrored from the platform repo
  components/
    sections.tsx           one component per section type
    MatchCard.tsx          the product illustration in the hero
    Brand.tsx, Chrome.tsx  logo, buttons, header, footer
  lib/
    schema.ts              what the editor can change — the source of truth
    store.ts               reads content, writes it back via GitHub
    auth.ts                password + signed session cookie
    validate.ts            server-side validation of anything saved
```

### Design tokens

The colours and radii in `src/app/globals.css` are copied from
`frontend/design/theme.ts` in the platform repo (`activeTheme =
fanbasdClassicTheme`): brand `#16A34A`, accent `#22C55E`, tint `#DCFCE7`,
artist `#D94674`, on `#F6F5F3`. Font is Roboto, as in the platform.
**If the platform theme changes, update `globals.css` to match.**
