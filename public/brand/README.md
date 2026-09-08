# Brand assets

*Last updated: 8 September 2026*

## Logo

**Do not recreate or approximate the logo in code.** The real mark is a
hand-lettered `YACHATDAC.` wordmark in Oxide Red, paired with boomerang and
dot-painting motifs in Yellow Ochre and Burnt Ochre.

| File | Use | Status |
| --- | --- | --- |
| `logo-wordmark.svg` | Wordmark only — header, loader, small sizes | ✅ **in** |
| `logo-full.svg` | Wordmark + motifs + legal-name lockup | not supplied |
| `logo-mono.svg` | Single-colour version | not supplied |

`logo-wordmark.svg` was extracted on 2026-08-20 from Marc's hi-fi navbar —
node `17:260`, a 15-vector group — on the "Reference — Marc's hi-fi" page of
Figma file `Qk35pAX0sz2ntNRXceY7Gb`, and exported whole. Its paths are already
`fill="white"`, so it needs no filter over dark imagery.

`SiteHeader` and `Preloader` now render this asset. The old text placeholder is
gone. Rendering the artist's real vector satisfies §5; redrawing, recolouring
or restyling it does not — do neither.

⚠ It is the wordmark **only**. The full lockup with boomerang and dot-painting
motifs, and the single-colour cut, still have to come from the brand team.

## Commissioned artwork — what is here

**The artwork now lives in `public/artwork/`, not here.** Fifteen vectors were
brought in from `KIT · Truth` and `FOUNDATIONS · Artwork` on 2026-08-30; the
manifest is `src/content/kit.ts`, which carries each piece's Figma node id and
path count. `artwork-path.svg` moved to `public/artwork/dots-trail.svg` — the
same 562-path vector, re-exported from YACHATDAC-V2 node `2051:2801` rather than
the retired Exploration file.

**Artwork motion is PERMITTED** — Ivy, 2026-08-30, superseding the old
"static imagery only" hold. Leonard Mickelo's supplied vectors may be animated,
masked, revealed, scrubbed and transformed. Leonard's own artist sign-off is
noted outstanding in `permissions.md`.

**Artwork amendment — 8 September 2026, user direction.** Generated artwork is
permitted. The former restriction is removed. Supplied artwork retains its
credit and provenance; generated interface assets are recorded separately.
The Record uses the user's supplied `public/artwork/handprint-impression.png`
as its aperture mask and generated `public/artwork/record-sandstone.webp` as its
stone material. Neither is attributed to Leonard Mickelo or treated as a
cultural record. Sources and the generation prompt are recorded in
`public/artwork/record-portal-provenance.md` and `src/content/record-media.ts`.

## Commissioned artwork

Separate from the logo. A hero artwork and pattern system is being commissioned
from an Aboriginal artist — hero artwork, repeatable patterns, supporting
motifs, cropped compositions, full-colour and single-colour variants, scalable
vectors.

Delivery is **not blocking** (open decision 10). The site is built
placeholder-first with swap-in-ready slots, so launch does not wait on the
artist's timeline. Sections carry `data-placeholder="beat-media"` where art is
expected.

**Motion permission for artwork is recorded** — Ivy, 2026-08-30, and under
decision **F8** (31 Aug 2026) artwork motion is built freely without a
per-piece sign-off queue; Leonard Mickelo reviews the work at presentation
alongside Steve (FNAN) and the Elders. See `docs/decisions-and-risks.md` F8,
which also preserves the permissions board's record.

Generated assets are permitted by the 8 September 2026 direction above. Keep
them distinguishable in the manifest from supplied artwork and cultural records.
