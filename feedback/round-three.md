# Round three — theme alignment

26 September 2026. Not external feedback: a request from the team to bring the
marketing site's colours in line with the platform's **executive** theme in
`proto-full/frontend/design/theme.ts`.

## What was asked

Move the marketing site from the `fanbasdClassic` palette it was built on to
`executive`.

## What was actually changed

Only the two colours that could move safely:

| Token              | Before    | After     | Source                            |
| ------------------ | --------- | --------- | --------------------------------- |
| `--color-campaign` | `#7a7ce0` | `#5e5ce6` | executive `colors.artist.primary` |
| `--color-artist`   | `#d94674` | `#5e5ce6` | executive `colors.artist.primary` |

`--color-campaign` drives the purple series in the Brand vs Artist Vibes chart
and the alternating avatar chips in the campaign brief. Its old value was
invented during the build to match a screenshot, so this replaces a guess with
the real thing. The two are close neighbours, so the visible difference is
small.

`--color-artist` has no usages yet. It was updated so the file stays honest
against the theme; Tailwind strips it from the build until something uses it.

## What was deliberately not changed, and why

A full switch to `executive` is not a find-and-replace, because two slots change
meaning rather than value.

| Token             | Classic         | Executive            |
| ----------------- | --------------- | -------------------- |
| `brand.primary`   | `#16A34A`       | `#00C26E`            |
| `brand.secondary` | `#DCFCE7` pale  | `#5E5CE6` indigo     |
| `brand.accent`    | `#22C55E` green | `#0F172A` near-black |
| Font              | Roboto          | Inter                |

`brand.secondary` is the blocker. It maps to `--color-brand-tint`, which the
site uses **twelve times as a pale background wash** — behind step numbers,
feature icons, the top-match row in the campaign brief, and the form's success
panel. In Classic that slot holds a pale mint; in Executive it holds a
saturated indigo. Mapping it literally turns twelve soft backgrounds into solid
indigo with green icons on top. That reads as a bug, not a theme.

`brand.accent` has the same problem at smaller scale: it appears once, in the
compatibility bar gradient, which would run pale → near-black → green.

The root cause is that **executive has no pale-tint colour**. Classic happened
to keep one in the `secondary` slot; executive repurposes that slot as a second
brand colour. The marketing site needs a pale wash because of how it is built,
and the theme has no slot for it.

## If the full switch is wanted later

Three routes, in order of preference:

1. **Adopt executive, derive the tint.** Take `#00C26E`, Inter and the indigo,
   and generate the pale wash from the new green (roughly `#E6F9F0`). Nothing
   breaks; one colour is not literally from the theme file and should be
   commented as such.
2. **Adopt executive literally and rework the twelve usages.** Faithful, but a
   real design pass — every icon chip, badge and highlighted row needs
   rethinking against indigo. Needs a designer's eye, not just an
   implementation.
3. **Check what was actually meant.** "Use the executive theme" may just mean
   "make the green that green", which is route 1 without the argument.
