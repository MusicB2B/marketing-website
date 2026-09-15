# Fanbased — marketing website

The single-page marketing site for [Fanbased](https://fanbasedhq.com).

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Node 22

---

## Quick start

```bash
nvm use            # Node 22
npm install
cp .env.example .env.local
npm run dev
```

The site runs at http://localhost:3000.

---

## The page

Sections render in the order set in
[`content/site.json`](content/site.json). Each is a type in
[`src/lib/schema.ts`](src/lib/schema.ts) with a renderer in
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

All page copy lives in `content/site.json`, so wording changes are a content
edit rather than a code change. The page is statically generated from it.

### The hero panel

By default the hero shows a rotating example partnership: three brand/artist
pairings with autoplaying video, an animated compatibility score, and signal
pills. It pauses when off-screen or in a background tab, honours
`prefers-reduced-motion`, and only mounts the active pair of videos. An info
button opens a disclaimer making clear the examples are illustrative. The
alternative is a fixed image.

Videos live in `public/matches/`. They are compressed copies of the platform
repo's originals, which are 720p and up to three minutes long — 66MB for the
six — for a card that renders about 200px wide and loops for seven seconds.
[`scripts/compress-videos.sh`](scripts/compress-videos.sh) rebuilds them at
roughly 600KB each using `avconvert`, which ships with macOS. (ffmpeg is not
practical on macOS 12: Homebrew no longer has bottles for it and falls back to
compiling from source.)

### The request access form

Submissions are emailed to `CONTACT_EMAIL` through
[Resend](https://resend.com)'s REST API — one `fetch` call, no mail dependency,
and no raw SMTP from a serverless function. Swapping to SMTP later touches only
[`src/lib/mail.ts`](src/lib/mail.ts).

With no `RESEND_API_KEY` set the form still renders and validates, and returns
a plain "not connected yet" message rather than failing silently. It caps
submissions at five per IP per hour and carries a honeypot field.

---

## Deploying

Built for **Vercel**. Import the repo, add the environment variables, deploy.

| Variable               | Required | Notes                                                          |
| ---------------------- | -------- | -------------------------------------------------------------- |
| `RESEND_API_KEY`       | for mail | From <https://resend.com/api-keys>.                            |
| `CONTACT_EMAIL`        | for mail | Where enquiries land.                                          |
| `CONTACT_FROM_EMAIL`   | no       | Falls back to Resend's test sender until a domain is verified. |
| `NEXT_PUBLIC_SITE_URL` | no       | Canonical URL for metadata and `robots.txt`.                   |

See [`.env.example`](.env.example) for the full list, including the variables
the deployment needs to write content changes back to this repository.

The app builds with none of them set, so a first deploy will not fail on a
missing variable.

### Using a domain registered elsewhere

No need to move the domain. Point two DNS records at Vercel:

- `A` on `@` → `76.76.21.21`
- `CNAME` on `www` → `cname.vercel-dns.com`

Email on that domain keeps working, because MX records are untouched.

> This app cannot be deployed by FTP to shared hosting: parts of it need a
> server at request time. If the site must be served from shared hosting, the
> fallback is to static-export the public page and host the rest on Vercel.

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
content/site.json            all page copy
public/matches/              the hero panel's video clips
public/images/               page artwork
scripts/compress-videos.sh   rebuilds the clips from the platform repo's originals

src/
  app/
    page.tsx                 the page
    layout.tsx               fonts and metadata
    robots.ts                sitemap pointer and crawler rules
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
    schema.ts                the shape of every section — the source of truth
    store.ts                 reads and writes content
    validate.ts              server-side validation
    rateLimit.ts             shared per-IP throttle
    mail.ts                  sends enquiries
    exampleMatches.ts        shapes the hero panel's rows
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
