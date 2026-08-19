# Brand assets — placeholder

## Logo

**Do not recreate or approximate the logo in code.** The real mark is a
hand-lettered `YACHATDAC.` wordmark in Oxide Red, paired with boomerang and
dot-painting motifs in Yellow Ochre and Burnt Ochre.

Final vector files (SVG/EPS) come from the brand team. Drop them here as:

| File | Use |
| --- | --- |
| `logo-full.svg` | Wordmark + motifs + legal-name lockup |
| `logo-wordmark.svg` | Wordmark only — header, small sizes |
| `logo-mono.svg` | Single-colour version |

Until then, `SiteHeader` renders a plain text wordmark marked
`data-placeholder="logo"`. Swap it for the real asset, do not restyle the
placeholder to look closer to the real thing.

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
