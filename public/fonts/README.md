# Fonts

Self-hosted woff2, wired up in [`src/app/fonts.css`](../../src/app/fonts.css).
The three faces above the fold are preloaded in the root layout.

| Role | Family | Files | Licence |
| --- | --- | --- | --- |
| Headline | Block Berthold | `BlockBerthold.woff2` | ⚠ **commercial — webfont licence not confirmed** |
| Subheadline / eyebrow | Bantayog Sans | `BantayogSans-{Regular,Medium,SemiBold,Bold,Black}.woff2` | ⚠ **unverified — no licence shipped** |
| Body | Work Sans | `WorkSans-Variable.woff2`, `WorkSans-Italic-Variable.woff2` | ✅ SIL OFL 1.1 — `WorkSans-OFL.txt` |
| Callouts | Good Dog Cool | — | not supplied; slot reserved in `fonts.css` |

## ⚠ Licensing — resolve before production

This is a compliance question, not a preference. Build documentation §17
decision 9 already flags it; here is what the supplied files actually say.

**Block Berthold** ships with `BlockBerthold-COPYRIGHT.txt`:

> Copyright (c) 1992 Adobe Systems Incorporated. All Rights Reserved.
> Block Berthold is a registered trademark of H. Berthold AG.

That is a commercial retail typeface. A desktop licence does **not** cover
serving the file over the web — `@font-face` distribution needs a separate
webfont licence, usually priced by pageviews or domain. Someone has to confirm
YACHATDAC (or the brand team) holds one before this goes to a public server.

**Bantayog Sans** arrived with no licence file at all. Terms need confirming
with whoever supplied it.

Neither is a reason to stop building — both are installed and working now. Both
are a reason not to ship without an answer.

## Not in git

Font binaries are gitignored except Work Sans, which is OFL and unambiguous.
Block Berthold and Bantayog Sans stay out of version control until their
licences are confirmed, because a commercial binary is far easier to keep out of
a repo than to remove from its history.

Get them from the **Proyekto resources section** — Marc uploads the brand/design
assets there, Block Berthold included, since it is not publicly available
online. Drop them into this folder using the filenames in the table above.

To flip this once licences are confirmed, remove the two exclusion lines from
`.gitignore`.

## Regenerating from source

Sources came from the brand team as OTF/TTF. Conversion:

```bash
npx --yes ttf2woff2 < "Work Sans/WorkSans-VariableFont_wght.ttf" > WorkSans-Variable.woff2
npx --yes ttf2woff2 < "Block Berthold/blockberthold.otf"         > BlockBerthold.woff2
```

Bantayog Sans shipped woff2 already — the Roman weights were copied straight
across. Its Italic, Baybayin, SmallCaps and Alt cuts exist in the source set but
are **not** shipped: nothing on the site calls for them, and each is roughly
75KB. Add a face when a design actually needs one, not in advance.

## Weight notes

Block Berthold is a single-weight display face. `fonts.css` declares it across
`100 900` so any requested weight maps onto that one file rather than the
browser reaching for a synthetic bold — `font-synthesis-weight: none` is set on
`body` as a second guard.
