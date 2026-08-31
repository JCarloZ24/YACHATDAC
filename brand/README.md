# brand/

The source of truth for YACHATDAC's brand assets — palette, typefaces, artwork and
photography, gathered into one place on 2026-08-31.

**This folder is not what the site serves.** `public/` holds the web-optimised copies that
Next.js serves, and nothing in this audit moved or changed them. Use `brand/` when you need
the original, the licence, or the answer to "what do we actually have".

The measured inventory is [`../ASSETS.md`](../ASSETS.md).

```
brand/
  README.md              this file
  PHOTO-INDEX.md         quick-pick chooser — start here when picking a photograph
  photo-notes/
    batch-1.md           all 50 frames, described individually
    batch-2.md           all 39 frames, described individually
    paintings.md         the three photographed dot paintings
  palette/
    palette.json         12 colours, from the Figma `YACHATDAC Colour` collection
    palette.css          the same, as custom properties
  typefaces/             4 families + every licence file shipped with them
  artwork/
    vectors/             15 SVG — Leonard Mickelo's artwork and Marc's furniture
    paintings/           3 JPEG — photographed original dot paintings
  photography/
    batch-1/             50 WebP, 3840×2024        ⛔ gitignored
    batch-2/             39 PNG, 2000px long edge  ⛔ gitignored
    derivatives/         edits — crops, B&W, grades. Masters are never overwritten.
  video/                 README only               ⛔ gitignored
```

## What is and isn't in git

**Tracked:** the palette, the vectors, the paintings, Work Sans, and every index and notes
file. Vectors and paintings are brand assets, like `public/brand/`.

**Ignored:** `photography/`, `video/`, and the three unlicensed font families — mirroring the
rules already in place for `/public/media/` and `/public/fonts/`. The client media library
lives in Drive today and moves into the CMS at launch; a commercial font binary is far easier
to keep out of a repo than to remove from its history.

The notes files are tracked precisely *because* the images are not. A fresh clone gets the
knowledge without the binaries.

## Repopulating after a fresh clone

**Batch 1** — 50 WebP at 3840×2024. Local source is the Drive folder
`YACHATDAC 240808 American Heart Association Film Shoot Images`. Otherwise pull from Figma
`PHOTO LIBRARY · 1st batch`, node `2048:9525`.

**Batch 2** — 39 frames from Figma `PHOTO LIBRARY · 2nd batch`, node `2049:12760`, children
`2049:12721`–`12759`. Pull per-node rather than per-section: a section-level call caps at 20
images and returns them **unnamed**, and a mismapped manifest is worse than none. Take
`rawImages[0]` — it is the master; `rawImages[1]` and the export are the small placed render.

**Fonts** — Block Berthold, Bantayog Sans and Good Dog come from the Proyekto resources
section. Marc uploads the brand assets there.

## Editing images

Editing is cleared — B&W, cropping and grading — Ivy, 2026-08-31. Both batches are
**contemporary commissioned shoots** (batch 1 August 2024, batch 2 March 2022), not archival
material, which is why §6's ban on recolouring the record does not bite here.

Two rules:

- **Never overwrite a master.** Every edit is a new file in `photography/derivatives/`, named
  after its source, so anything can be reverted.
- **§6 still binds on depicted subjects.** Dissolve, glitch, warp, decode, trail and duotone
  remain banned on portraits, artefacts and archival photographs regardless of the crop or
  grade applied.

`PHOTO-INDEX.md` carries a **Crop** line on every batch-2 frame, because most of them can be
cropped from a tourism frame into a work frame — and several can be cropped to remove
children entirely.

## Artwork

**Motion on supplied artwork is permitted** (Ivy, 2026-08-30). **Recompose, never author**
(Ivy, 2026-08-31): new pieces come from instancing, masking, cropping, recolouring, mirroring
and recombining the artist's actual paths. Authoring new geometry in that style is not
permitted and is not ours to authorise on the artist's behalf.

Do not recolour the artwork to match the brand palette. Six colours inside it are off-palette
and that is recorded, not corrected — see `../ASSETS.md` §3.

**The paintings cannot be re-shot or replaced.** The originals are in Australia and
inaccessible, and they must not be AI-upscaled — on a dot painting an upscaler invents dots
that were never placed, which falsifies the work. 1.57MP is the permanent ceiling; design
within it.

Full permission record:
[`.claude/skills/yachatdac-motion/references/permissions.md`](../.claude/skills/yachatdac-motion/references/permissions.md).
