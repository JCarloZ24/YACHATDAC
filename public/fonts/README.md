# Fonts

Self-hosted woff2, wired up in [`src/app/fonts.css`](../../src/app/fonts.css).
The three faces above the fold are preloaded in the root layout.

| Role | Family | Files | Licence |
| --- | --- | --- | --- |
| Headline | Block Berthold | Adobe Fonts kit `qqn2php` (family `berthold-block-w1g`); `BlockBerthold.woff2` kept as fallback only | ✅ **Adobe Fonts web project** — the kit stylesheet in the root layout is the licensed delivery |
| Subheadline / eyebrow | Bantayog Sans | `BantayogSans-{Regular,Medium,SemiBold,Bold,Black}.woff2` | ✅ **commercial licence held** — key below |
| Body | Work Sans | `WorkSans-Variable.woff2`, `WorkSans-Italic-Variable.woff2` | ✅ SIL OFL 1.1 — `WorkSans-OFL.txt` |
| Callouts | GoodDog Plain / Good Dog Cool | — files still missing | ✅ freeware — `GoodDog-LICENCE.txt`; drop `GoodDogPlain.woff2` in here |

## Licensing — resolved 2026-09-02 (from admin)

**Block Berthold** is licensed through **Adobe Fonts**, web project `qqn2php`
(`https://use.typekit.net/qqn2php.css`, linked in `src/app/layout.tsx`). The
kit serves the family as `berthold-block-w1g` at 400/700, normal and italic,
and that kit IS the web licence — Adobe Fonts terms cover hosted delivery
only. The self-hosted `BlockBerthold.woff2` stays solely as the second entry
in the font stack (offline/kit-outage fallback) and stays out of git; if
compliance review objects to keeping any local copy, delete the file and the
fallback entry together.

**Bantayog Sans** — commercial licence key held by the organisation:

> `A15B292D-4BA744BC-9E903E9B-7C320135`

Keep the purchase record (invoice / licence PDF) with the brand assets in the
Proyekto resources section; if this repository ever goes public, move the key
there too and reference it here instead of quoting it.

Missing files (declared in `fonts.css`, 404 today): `GoodDogPlain.woff2` and
`BantayogSans-ExtraBold.woff2` — get both from the Proyekto resources section
and drop them in this folder.

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
