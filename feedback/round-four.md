# Round four — testing and monitoring

26 September 2026. Not external feedback: hardening the site before traffic
arrives.

## Where it started

The site had **no tests, no test tooling and no CI**. What it did have was a
typecheck, a linter, and a build that verifies every content field against the
schema — so malformed content fails the build rather than reaching production,
and a failed build leaves the last good deploy in place. Useful, but it says
nothing about whether the logic is correct or whether the live site is up.

## 1. Monitoring

A GitHub Action (`.github/workflows/monitor.yml`) runs every 30 minutes, from
GitHub rather than from the site, so it still reports when the site itself is
the thing that is down. It checks:

- the home page returns 200 and renders a real page
- `/api/health` reports content, mail, publishing and editor config all ok
- the authoring route still presents its login
- the contact endpoint validates a bad submission

On failure it emails `contact@fanbasedhq.com`, with GitHub's own notification as
the backstop for when the mail path is itself the broken thing.

`/api/health` deliberately checks the contact form's _plumbing_ rather than
sending a message: a monitor that submitted the real form would drop a test
enquiry in the inbox every half hour. No check reveals a secret.

### Two false alarms found by building it

**Probing Resend to prove the key was alive.** The check read `/domains` to
confirm the key authenticates. The site's key is sending-only, and Resend
returns **401** there — the same status a revoked key gives. Production
reported mail as failing while the form was accepting submissions normally.
Mail is now reported on configuration alone, with a comment explaining why, so
nobody re-adds the probe thinking it is an improvement.

**Grepping for copy.** The first run failed because it looked for the words
"Request access", and that button now reads "Join the waitlist" — Jules edited
it, which is the entire point of the editor. Correcting the string would only
have deferred the same failure to the next edit. The page check is now
structural: a `<main>`, at least five sections, and the email capture field.

Both are the same mistake: asserting on something designed to change. A check
that cries wolf is worse than no check, because it teaches everyone to ignore
the alerts.

## 2. Unit tests

Vitest with Testing Library. **59 tests across 6 files**, about 5 seconds.

| Area                    | What it covers                                                            |
| ----------------------- | ------------------------------------------------------------------------- |
| `validate.ts`           | Every way a save can be malformed, and that undeclared fields are dropped |
| `auth.ts`               | Password comparison, token signing, expiry, tampering, misconfiguration   |
| `rateLimit.ts`          | Limits, per-IP and per-endpoint isolation, reset, window behaviour        |
| `exampleMatches.ts`     | Editable rows mapped to the panel, score clamping, fallback tints         |
| `RequestAccessForm.tsx` | Fields, honeypot, submit, error handling, double-submit                   |
| `sections.tsx`          | Visibility, ids, content-driven copy, empty sections                      |

### A real bug the tests found

`validate.ts` validated **section fields** against the schema but ran
**repeatable item fields** through `str()` directly, skipping the check that a
`select` holds one of its declared options. An earlier edit to that loop had
silently not applied.

The practical effect: the editor could have written any value into a select
field — an icon name that does not exist, for instance — and it would have been
committed to the repository. The page degrades rather than crashing, so nothing
looked wrong, which is exactly why it survived. Fixed, and covered by a test.

Two other failures were my tests being wrong rather than the code: the default
fallback tint happens to equal the Adidas entry's, and the matching-engine
section is currently hidden in the content, so it renders nothing through the
visibility filter.

## 3. CI

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests:
typecheck, lint, unit tests, production build.

## What is still not covered

- **No end-to-end test of the save loop.** Editing, saving, and the commit
  reaching production is verified by hand. Testing it properly means writing to
  the real repository or standing up a fake GitHub, and neither is worth it yet.
- **No visual regression testing.** Layout changes are still judged by eye.
- **The monitor cannot prove mail is actually delivered**, only that the route
  is up and the key is present. Proving delivery means sending, and sending
  means noise.
