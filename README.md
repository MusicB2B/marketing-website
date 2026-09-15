# Fanbased — marketing website

The single-page marketing site for [Fanbased](https://fanbasedhq.com), plus a
password-protected editor so product, marketing and sales can change the copy
without going through a developer.

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

The site runs at http://localhost:3000. The editor is a separate route; its
path is defined under `src/app/` and is not published here or in `robots.txt`,
so it stays out of search results and casual scanning.

With no `GITHUB_TOKEN` set, saving in the editor writes straight to
`content/site.json` on disk. Commit that file like any other change.

---

## How the editing works

Every word on the page lives in **one file**: [`content/site.json`](content/site.json).

```
editor  →  edit + live preview  →  Save  →  commit to content/site.json
        →  Vercel redeploys  →  live
```

The public page is statically generated from that file, so it costs nothing to
serve and is as fast as plain HTML. The trade-off is that publishing is not
instant: a save takes roughly **30 to 60 seconds** to reach the live site while
Vercel rebuilds. The editor says so after each save. Its own preview updates
immediately, so only the public page lags.

Because every save is a real git commit, there is a full history of copy
changes for free — who changed what, when, and one-click revert in GitHub.

### What the team can change

| They can                                                            | They cannot                            |
| ------------------------------------------------------------------- | -------------------------------------- |
| Edit any heading, paragraph, button, label or link                  | Change fonts, brand colours or spacing |
| Reorder sections, and hide or show them                             | Add brand-new section types            |
| Add, reorder and delete repeatable items (features, steps, artists) | Break the layout                       |
| Swap the hero between the live match panel and a fixed image        | Write HTML or CSS                      |
| Set per-section text size, alignment and background                 |                                        |
| Edit the page title and description, footer, and floating button    |                                        |

Style controls are a fixed set of tokens (Small/Medium/Large, Left/Centre,
Grey/White/Dark) rather than free-form CSS. That answers almost every "can you
make this bigger" request while keeping the page on-brand.

Two things are deliberately **not** editable: the logotype, which is artwork
rather than copy, and the five bar values in the vibe chart, which are plot
data.

---

## The page

Sections, in order. Each is a type in
[`src/lib/schema.ts`](src/lib/schema.ts) and a renderer in
[`src/components/sections.tsx`](src/components/sections.tsx).

| Section          | What it does                                                |
| ---------------- | ----------------------------------------------------------- |
| `hero`           | Logo, headline, call to action, and the panel beside it     |
| `audienceSplit`  | Brands / Artists — who the product is for                   |
| `howItWorks`     | The three steps                                             |
| `campaignDemo`   | A worked example: a brief, and the artists it ranked        |
| `differentiator` | The argument for matching on meaning, beside the vibe chart |
| `features`       | Up to six matching-engine cards                             |
| `dataSources`    | The platforms the engine draws from                         |
| `requestAccess`  | The enquiry form                                            |

### The hero panel

By default the hero shows a rotating example partnership: three brand/artist
pairings with autoplaying video, an animated compatibility score, and signal
pills. It pauses when off-screen or in a background tab, honours
`prefers-reduced-motion`, and only mounts the active pair of videos. An info
button opens a disclaimer making clear the examples are illustrative.

The alternative is a fixed image — switch between them in the editor.

Videos live in `public/matches/`. They are compressed copies of the platform
repo's originals, which are 720p and up to three minutes long (66MB for the
six) for a card that renders about 200px wide and loops for seven seconds.
[`scripts/compress-videos.sh`](scripts/compress-videos.sh) rebuilds them at
roughly 600KB each using `avconvert`, which ships with macOS. (ffmpeg is not
practical on macOS 12 — Homebrew no longer has bottles for it and falls back to
compiling from source.)

### The request access form

Submissions are emailed to `CONTACT_EMAIL` through
[Resend](https://resend.com)'s REST API — one `fetch` call, no mail dependency,
and no raw SMTP from a serverless function. Swapping to SMTP later touches only
[`src/lib/mail.ts`](src/lib/mail.ts).

With no `RESEND_API_KEY` set the form still renders and validates, and returns
a plain "not connected yet" message rather than failing silently.

---

## Adding a field or a section

The editor has no per-section UI code. It renders itself from
[`src/lib/schema.ts`](src/lib/schema.ts).

**To add a field** to an existing section, add one entry to that section's
`fields` array in `schema.ts`, then read it in the matching component in
`src/components/sections.tsx`. It appears in the editor automatically, and
server-side validation picks it up for free.

**To add a whole section type:**

1. Add the name to `SectionType` in [`src/types/content.ts`](src/types/content.ts).
2. Add its spec to `SECTION_SCHEMA` in `src/lib/schema.ts`.
3. Write the component and register it in `RENDERERS` in `src/components/sections.tsx`.
4. Add an instance to the `sections` array in `content/site.json`.

A section can declare one repeatable list (`item`). Where a value is really a
short list — tone words, signal pills, match tags — it is a single
comma-separated text field instead, which is far easier for a non-technical
editor than nested rows.

---

## Deploying

Built for **Vercel**. Import the repo, add the environment variables, deploy.

### Environment variables

| Variable                | Required | Notes                                                                     |
| ----------------------- | -------- | ------------------------------------------------------------------------- |
| `EDITOR_PASSWORD`       | yes      | Shared password for the editor. Change here and redeploy, no code change. |
| `EDITOR_SESSION_SECRET` | yes      | `openssl rand -hex 32`. Signs the session cookie.                         |
| `EDITOR_SESSION_HOURS`  | no       | How long a sign-in lasts. Defaults to 12.                                 |
| `GITHUB_TOKEN`          | to save  | Fine-grained PAT, this repo only, Contents: Read and write.               |
| `GITHUB_OWNER`          | to save  | `MusicB2B`                                                                |
| `GITHUB_REPO`           | to save  | `marketing-website`                                                       |
| `GITHUB_BRANCH`         | to save  | `main`                                                                    |
| `CONTENT_PATH`          | no       | Defaults to `content/site.json`.                                          |
| `RESEND_API_KEY`        | for mail | From <https://resend.com/api-keys>.                                       |
| `CONTACT_EMAIL`         | for mail | Where enquiries land.                                                     |
| `CONTACT_FROM_EMAIL`    | no       | Falls back to Resend's test sender until a domain is verified.            |
| `NEXT_PUBLIC_SITE_URL`  | no       | Canonical URL for metadata and `robots.txt`.                              |

Without `GITHUB_TOKEN`, everything works except saving from the editor in
production. Create it at
<https://github.com/settings/personal-access-tokens/new>, scoped to this
repository only, with nothing beyond Contents: Read and write.

The app builds with none of these set, so a first deploy will not fail on a
missing variable. The editor shows its login screen and explains that it is not
configured yet.

### Using a domain registered elsewhere

No need to move the domain. Point two DNS records at Vercel:

- `A` on `@` → `76.76.21.21`
- `CNAME` on `www` → `cname.vercel-dns.com`

Email on that domain keeps working, because MX records are untouched.

> This app **cannot** be deployed by FTP to shared hosting. The editor needs a
> server to check the password and commit the save; on static hosting the
> password would have to sit in client-side JavaScript where anyone can read
> it. If the site must be served from shared hosting, the fallback is to
> static-export the public page and host only the editor on Vercel.

---

## Security

- The editor is behind a shared password and carries a `noindex` tag. Its path
  is deliberately not listed in `robots.txt`: a `Disallow` line publishes the
  very path it is meant to protect, to every scanner that reads it. `noindex`
  keeps the page out of search results without advertising it.
- Obscurity is not the defence. Anyone reading this repository can find the
  route in `src/app/`. **The password is the lock.**
- Sign-in allows eight attempts per IP per fifteen minutes, then locks that IP
  out for the same window. The limiter
  ([`src/lib/rateLimit.ts`](src/lib/rateLimit.ts)) is in memory, so serverless
  instances do not share it: it raises the cost of grinding rather than making
  it impossible. Shared storage is the next step if this ever guards anything
  valuable.
- The session is an HMAC-signed, httpOnly cookie, expiring after
  `EDITOR_SESSION_HOURS`.
- Everything saved is re-validated server-side against the schema
  ([`src/lib/validate.ts`](src/lib/validate.ts)), so a signed-in editor still
  cannot write arbitrary JSON into the repo.
- The contact form caps submissions at five per IP per hour and carries a
  honeypot field.
- `GITHUB_TOKEN` and `RESEND_API_KEY` are server-only and never reach the browser.
- **Rotate `EDITOR_PASSWORD` when someone leaves the team.** To force everyone
  to sign in again, rotate `EDITOR_SESSION_SECRET` too.

---

## Scripts

```bash
npm run dev          # dev server on :3000
npm run build        # production build
npm run build:check  # production build into .next-verify, then clean up
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
npm run format       # prettier --write .
```

Use `build:check` rather than `build` while a dev server is running. A plain
build writes to `.next`, which is also the dev server's working directory, and
clearing it afterwards breaks that server with "missing required error
components".

---

## Project layout

```
content/site.json            every editable word — the only file the editor writes
public/matches/              the hero panel's video clips
public/images/               page artwork
scripts/compress-videos.sh   rebuilds the clips from the platform repo's originals

src/
  app/
    page.tsx                 the public page
    layout.tsx               fonts and metadata
    robots.ts                sitemap pointer; keeps /api out of crawlers
    edit/                    login gate, and the editor itself
    api/auth/                password check, sets the session cookie
    api/content/             validates a save and commits it
    api/contact/             validates an enquiry and emails it
    globals.css              design tokens, mirrored from the platform repo

  components/
    sections.tsx             one renderer per section type
    HeroVisual.tsx           picks the live panel or a fixed image
    LiveMatchPanel.tsx       the rotating example partnership
    CampaignDemo.tsx         the brief, and the artists it ranked
    VibeChart.tsx            campaign tone against artist tone
    RequestAccessForm.tsx    the enquiry form
    Brand.tsx, Chrome.tsx    logo, buttons, footer
    StickyCta.tsx            the call to action that follows you down the page
    Icon.tsx, PlatformIcon.tsx  inline icon sets

  lib/
    schema.ts                what the editor can change — the source of truth
    store.ts                 reads content, writes it back via the GitHub API
    auth.ts                  password and signed session cookie
    validate.ts              server-side validation of anything saved
    rateLimit.ts             shared per-IP throttle
    mail.ts                  sends enquiries
    exampleMatches.ts        shapes the hero panel's editable rows
```

### Design tokens

Colours and radii in `src/app/globals.css` are copied from
`frontend/design/theme.ts` in the platform repo (`activeTheme =
fanbasdClassicTheme`): brand `#16A34A`, accent `#22C55E`, tint `#DCFCE7`,
artist `#D94674`, on `#F6F5F3`. The font is Roboto, as in the platform.
**If the platform theme changes, update `globals.css` to match.**

---

## A note on this repository

It is public so it can deploy on Vercel's free tier, not as an invitation to
reuse it. No licence is granted: all rights reserved.

No credentials live here. Every secret is an environment variable set in
Vercel, and `.env.local` is gitignored.
