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
    batch-3/             44 WebP, 4096×3072         ⛔ gitignored
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

**Batch 3** — 44 frames from Figma `PHOTO LIBRARY · 3rd batch`, node `2756:34661`, children
`2756:34617`–`34660`. Same per-node rule as batch 2. **The files on the board are renamed
already**, so a pull maps straight onto `brand/photo-notes/batch-3.md`; if you pull an
unrenamed copy, the **Origin** line on every entry carries the original UUID.

**Fonts** — Block Berthold, Bantayog Sans and Good Dog come from the Proyekto resources
section. Marc uploads the brand assets there.

## Naming a batch

**A master keeps the name it arrived with** — unless that name is machine-generated and
carries no information, in which case it is renamed once, at ingest, before anything
references it. Batches 1 and 2 kept their camera-native names. Batch 3 arrived as 41-character
iPhone UUIDs and was renamed to content slugs — `fire-line-timber`, `hands-soil`,
`shelter-seedling` — where the first token is the dominant physical subject and `-tall` marks
a portrait frame.

Two rules make that safe:

- **A slug describes what is visibly in the frame, never what it means.** No `ceremony`, no
  `sacred`, no `ritual`. That judgement belongs to Our People, not to a filename.
- **Provenance moves to the notes file.** Every batch-3 entry closes with an **Origin** line
  carrying the original filename and the Figma node. Since `photography/` is gitignored, that
  line is the only durable record of the mapping — an entry without one has lost it.

Renaming a master that already has references is a different act, and is not permitted.

## Editing images

Editing is cleared — B&W, cropping and grading — Ivy, 2026-08-31. All three batches are
**contemporary commissioned shoots** (batch 1 August 2024, batch 2 March 2022, batch 3 the
cultural burning shoot), not archival material, which is why §6's ban on recolouring the
record does not bite here.

Two rules:

- **Never overwrite a master.** Every edit is a new file in `photography/derivatives/`, named
  after its source, so anything can be reverted.
- **§6's technique table is retired — F9, Ivy, 31 Aug 2026.** Dissolve, glitch, warp, decode,
  trail and duotone are available on depicted subjects. What still binds is the **motion
  grade**: portraits of real people and cultural-site material hold their image plane while
  the world moves around them. And, since batch 3, fire is a practice — it may carry any
  technique, but it may not be used as decoration behind copy that is not about it.

`PHOTO-INDEX.md` carries a **Crop** line on every batch-2 and batch-3 frame, because most
batch-2 frames can be cropped from a tourism frame into a work frame — and several can be
cropped to remove children entirely. In batch 3 the crop line usually answers a different
question: whether a crop removes an identifiable person, or removes the rock shelter.

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
