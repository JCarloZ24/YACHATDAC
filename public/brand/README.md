# Brand assets

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

| File | Source | Rule |
| --- | --- | --- |
| `artwork-path.svg` | Figma node `17:312`, 562 vector nodes | ⛔ **static only** |

The dotted path across the bottom of the hero. It is the artist's supplied,
vectorised artwork — exported, not generated — so using it is fine.

**It must never move.** `permissions.md` records no motion permission for
artwork: *"static imagery only. No animating, masking, revealing, scrubbing,
looping or transforming any artwork element."* It is stamped `data-static` in
the DOM, which every motion module on the site checks before touching a media
element.

It is also **not** sketch C1. C1 — a continuous line with lit waypoints — is on
hold precisely because a machine-drawn meandering path with waypoints reads as
iconography. This one is not machine-drawn. Do not reimplement it as code
because it "looks simple"; that would turn a permitted asset into a prohibited
generation.

## Commissioned artwork

Separate from the logo. A hero artwork and pattern system is being commissioned
from an Aboriginal artist — hero artwork, repeatable patterns, supporting
motifs, cropped compositions, full-colour and single-colour variants, scalable
vectors.

Delivery is **not blocking** (open decision 10). The site is built
placeholder-first with swap-in-ready slots, so launch does not wait on the
artist's timeline. Sections carry `data-placeholder="beat-media"` where art is
expected.

**Motion permission for artwork is not recorded.** Until it is, artwork is
static imagery only — no animating, masking, revealing, scrubbing, looping or
transforming any artwork element. See
`.claude/skills/yachatdac-motion/references/permissions.md`, which is the live
status board and should be updated when a decision comes back.

Never generate Aboriginal iconography in code as a stand-in — no procedural
concentric circles, dot fields, meandering waypoint paths, U-shapes or animal
tracks. If artwork is needed and has not arrived, leave the slot empty.
