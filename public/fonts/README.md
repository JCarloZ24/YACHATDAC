# Fonts — placeholder

**Nothing here yet.** Drop the licensed font files in this folder using the exact
filenames below and the site picks them up with no code change. The `@font-face`
declarations already exist in [`src/app/fonts.css`](../../src/app/fonts.css).

| Role | Family | Expected filename | Status |
| --- | --- | --- | --- |
| Headline | Block Berthold | `BlockBerthold.woff2` | ⏳ awaiting upload |
| Subheadline / eyebrow | Bantayog Sans | `BantayogSans.woff2` | ⏳ awaiting upload |
| Body | Work Sans | `WorkSans-Variable.woff2` | ⏳ awaiting upload |
| Body (italic) | Work Sans | `WorkSans-Italic-Variable.woff2` | optional |
| Callouts | Good Dog Cool | `GoodDogCool.woff2` | not supplied — slot reserved |

## Until they arrive

Each family falls back to a stack declared in `src/app/fonts.css`. The site
builds and runs; it just doesn't look right yet. Do not judge spacing or
hierarchy from the fallback rendering.

## Format

`.woff2` only. If you have `.otf`/`.ttf`, convert first — e.g.

```bash
npx --yes woff2 <input.ttf>          # or use fonttools / a web converter
```

Static (non-variable) files are fine too — if a family ships as separate
weights, add one `@font-face` block per weight in `src/app/fonts.css` rather
than a single `font-weight: 400 900` range.

## Licensing — read before production

Per build documentation §17 decision 9, **none of Block Berthold, Bantayog Sans
or Good Dog Cool are confirmed as freely licensed**. Get the licence files from
the brand team before the production build, and do not substitute a lookalike
silently. Work Sans is available under the SIL Open Font License via Google
Fonts.

Block Berthold in particular is not publicly available online — it comes from
the brand team's own asset set.
