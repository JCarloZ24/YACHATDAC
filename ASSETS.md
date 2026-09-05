# ASSETS

What this project actually holds, measured rather than assumed, and what that material can
and cannot build.

Compiled 2026-08-31. Dimensions, alpha channels, path and stroke counts and dominant colours
were all read programmatically with `sharp` and by parsing the SVG source. Every photograph
was opened and described individually — see [`brand/PHOTO-INDEX.md`](brand/PHOTO-INDEX.md).

**Companion documents:** [`docs/ART-DIRECTION.md`](docs/ART-DIRECTION.md) (§4 references the
files below), [`docs/MOTION-SYSTEM.md`](docs/MOTION-SYSTEM.md) (the effect IDs).

---

## 1 · Where things live

```
brand/                      source of truth — this document describes it
  palette/                  palette.json, palette.css      tracked
  typefaces/                4 families, 18 files           partly gitignored
  artwork/vectors/          15 SVG                         tracked
  artwork/paintings/        3 JPEG                         tracked
  photography/batch-1/      50 WebP                        gitignored
  photography/batch-2/      39 PNG                         gitignored
  video/                    README only                    gitignored
public/                     web-serving copies — unchanged by this audit
```

`brand/photography/` and `brand/video/` are gitignored for the same reason `/public/media/`
already is: the client media library lives in Drive today and moves into the CMS at launch.
The index files that describe them **are** tracked, so the knowledge survives a fresh clone.

---

## 2 · Photography

| Set | Files | Format | Dimensions | On disk | Source |
|---|---|---|---|---|---|
| Batch 1 | 50 | WebP, all landscape | 3840×2024 (45 of 50); one at 1440×960 | 19.5 MB | Figma `2048:9525` |
| Batch 2 | 39 | PNG, 32 landscape + **7 portrait** | 2000px long edge | **195.4 MB** | Figma `2049:12760` |
| Batch 3 | 44 | WebP, 39 landscape + **5 portrait** | 4096×3072 (36 of 44); one panorama 4096×906; one at 1024×768 | 38.4 MB | Figma `2756:34661` |
| `public/media/library` | 20 | WebP, all landscape | 8 at 2000×1054, 12 at ~480×253 | 1.4 MB | derived from batch 1 |
| `public/media` | 2 | PNG | 1537×1023 | 4.7 MB | hero day/night |

**Batch 1** is an elder / knowledge shoot — portraits, seed and plant work, grinding,
nursery, sunsets, dead trees, escarpment, rock art, and exactly one fire frame (`1.40.3`) —
which is why that single frame ended up placed on five different pages before batch 3 arrived.
**No child appears anywhere in batch 1.**

**Batch 2** is a guiding shoot — staff hosting a visiting family. Ochre grinding, a smoking
ceremony, plant identification, walking and climbing, campground, signage. **Children appear
in 15 frames**, six with identifiable faces.

**Batch 3** is a cultural burning shoot — fire-stick farming, from reading the grass before
a burn through to burnt ground already regenerating. Flame lines by day and night, smoke
through timber, drone views of burn scars, hands with soil and grass, crews lighting and
watching, and four frames at a sandstone rock shelter. **It closes the collection's largest
subject gap: batch 1 held exactly one fire frame and batch 3 holds around thirty.** No child
appears in it. Two frames are crowds — around twenty-five and around eighteen identifiable
adults — which together form the largest consent block in the project.

**Alpha channels: none.** All 155 raster files across every set are fully opaque. Batch 2's
PNGs carry a 4th channel, but its minimum value is 255 in every file — no real transparency.
Batch 3 arrived from Figma as PNG with the same spurious alpha; it was measured per file and
dropped on transcode, so the collection keeps this property honestly rather than by omission.

### Resolution notes

- **Batch 1 has real headroom.** 3840 ÷ 1440 = 2.7×, comfortably above the 1.5–2× floor
  `IMG-06` and `SCR-11` need.
- **Batch 2 does not.** 2000 ÷ 1440 = 1.39×, below the 1.5× floor. Ken Burns on a batch-2
  frame at full width will soften. Use them at ≤1333px displayed, or re-export from source.
- **Batch 3 has the best headroom in the collection.** 4096 ÷ 1440 = **2.84×**. Every frame
  clears the floor except `fire-slope-lowres` at 1024×768 — 0.71×, which cannot go full-bleed
  at 1440 and cannot take a push. `burn-pano-sunset` is 4096×906, roughly 4.5:1, and is a band
  rather than a hero.
- **`public/media/library` 2000px derivatives are equally thin** at 1.39×.
- ⚠ **The 12 `b1-*-proxy.webp` files are 455–480px wide and are referenced by no code
  anywhere in `src/`.** They are orphans. Either wire them up as blur-up placeholders or
  delete them.
- ⚠ **`hero-country-day.png` and `hero-country-night.png` are 2.3 MB each** against a
  2.5 MB above-the-fold budget (risk R11). They are PNG at 1537×1023 and should be WebP.
- ⚠ **Batch 2 is 195 MB of PNG.** Transcode to WebP at quality 82 before anything ships;
  batch 1 went 72 MB → 1.4 MB on the same treatment.

---

## 3 · Artwork — vectors

15 files in `brand/artwork/vectors/`, exports of Leonard Mickelo's supplied artwork plus
Marc's drawn furniture. Manifest with Figma node ids: [`src/content/kit.ts`](src/content/kit.ts).

| File | viewBox | Paths | **Strokes** | Declared fills |
|---|---|---|---|---|
| `band-a.svg` | 958×83 | 274 | **0** | `#fbae3d` |
| `band-b.svg` | 958×113 | 243 | **0** | `#fbae3d` |
| `blob-mask.svg` | 240×269 | 1 | **0** | `#d97804` |
| `cluster.svg` | 145×128 | 7 | **0** | `#f6f6ec` |
| `dots-rule.svg` | 1278×21 | 172 | **0** | `#fbae3d` |
| `dots-trail.svg` | 972×80 | 562 | **0** | `#f6f6ec` |
| `dots-wave.svg` | 823×93 | 481 | **0** | `#fbae3d` |
| `glyph-a.svg` | 43×42 | 30 | **0** | `#f9b24c` `#f6f6ec` `#d57907` `#98470d` |
| `glyph-b.svg` | 43×42 | 13 | **0** | `#31afe3` `#fefefe` |
| `glyph-c.svg` | 45×37 | 43 | **0** | `#fefefe` `#f9b24c` |
| `logo-wordmark.svg` | 216×64 | 15 | **0** | keyword `white` |
| `ring-a.svg` | 416×375 | 47 | **0** | `#f6f6ec` |
| `ring-b.svg` | 465×470 | 158 | **0** | `#f6f6ec` |
| `ring-c.svg` | 447×452 | 129 | **0** | none declared — inherits |
| `wave-divider.svg` | 1442×151 | 1 | **0** | `#4e3524` |

### Two findings

**Every vector is filled compound paths. Not one carries a stroke.** `ENT-08` stroke draw
cannot run on any of them, and the fix is not available to us — redrawing supplied artwork as
strokes is the prohibited generation, not a workaround. This needs a stroke-based re-export
from the artist.

**Six colours inside the artwork are not in the brand palette.** `#31afe3` (a bright cyan in
`glyph-b`, distinctly bluer than Turquoise `#32b0ae`), `#f9b24c`, `#d57907`, `#98470d`,
`#fefefe` (against Off-White `#f6f6ec`), and `#d97804` in `blob-mask.svg` — which is the
*legacy* Burnt Ochre, not the brand's `#cb7722`. **Do not recolour the artwork to fix this.**
It is the artist's work; the discrepancy is recorded, not corrected. Logged in OPEN QUESTIONS.

`ring-c.svg` declares no fill at all and will inherit `currentColor` or default to black —
set a fill explicitly wherever it is used.

## 4 · Artwork — paintings

Three photographs of original dot paintings. Full detail:
[`brand/photo-notes/paintings.md`](brand/photo-notes/paintings.md).

| File | Size | Orientation | Ground |
|---|---|---|---|
| `painting-01-turquoise.jpg` | 1448×1086 | landscape | turquoise-blue, arch and wave band |
| `painting-02-purple.jpg` | 1149×1369 | **portrait** | violet storm sky, treeline, radial oval |
| `painting-03-red.jpg` | 1448×1086 | landscape | red-orange, radial burst |

⚠ **No artist is recorded for these in the Figma file** — attribution is unconfirmed.
⚠ **All three need cropping** — spiral binding and the photographed surface are in frame.
⚠ **Modest resolution, and it is permanent.** At 1149–1448px (1.57MP) they are below the 1.5×
floor for any zoom and too small for full-bleed on a wide display. **These files cannot be
re-shot or replaced — the originals are in Australia and inaccessible — and they must not be
AI-upscaled**, because on a dot painting an upscaler invents dots that were never placed,
which falsifies the work. Everything must be designed within 1.57MP.
## 5 · Typefaces

| Role | Family | Files | Licence |
|---|---|---|---|
| Headline (H1–H3) | Block Berthold | 1 woff2, 66KB | ⚠ **Adobe / H. Berthold AG — commercial, webfont licence unconfirmed** |
| Subhead, H4–H6 | Bantayog Sans | 6 woff2, ~73KB each | ⚠ **No licence file shipped** |
| Body | Work Sans | 2 variable woff2, 125–131KB | ✅ SIL OFL 1.1 |
| Callout | Good Dog Cool / Plain | 2 woff2 + 2 TTF sources | ⚠ Licence text shipped, terms unverified |

**Good Dog is no longer missing.** Both `public/fonts/README.md` and `docs/brand.md` say the
callout face was "not supplied" — the woff2 files and the TTF sources both exist and are now
in `brand/typefaces/`. Those two documents are stale on this point.

Block Berthold, Bantayog Sans and Good Dog are gitignored, mirroring the existing
`/public/fonts/` rules.

## 6 · Palette

12 variables in the Figma collection `YACHATDAC Colour`, matching
`YACHATDAC Branding Guide (Initial).pdf` hex-for-hex. Written to
[`brand/palette/palette.json`](brand/palette/palette.json) and `palette.css`.

## 7 · Video

One file — `Sample Video - Yachatdac.mp4`, **162 MB**, in Downloads, not copied into the repo.
It is the only video the project holds. Unusable as-is: it needs transcoding to MP4 (H.264)
plus WebM with a poster frame, targeting ~1.2 MB for a background loop.

---

## 8 · ART-DIRECTION §4 coverage

| §4 content type | Material? | What we hold |
|---|---|---|
| **Artefacts and objects** | ❌ **None** | No artefact, tool, vessel, garment or jewellery photography in either batch. Objects appear in the copy only as things already removed from the site. **§4 type deleted — see gaps below.** |
| **Portraits and people** | ✅ Strong | ~22 identifiable-face frames in batch 1, 11 in batch 2. ⚠ No portrait-orientation frames in batch 1 at all. |
| **Places and territory** | ✅ Strong | Escarpment, plains, sunsets, aerials, rock faces, tracks. The best-resourced category. ⚠ No maps, no territory vectors. |
| **Artworks, patterns, textiles** | ✅ Good | 15 vectors + 3 paintings. ⚠ Zero strokes; no textile or weaving photography. |
| **Documents and records** | ❌ **None** | No manuscript, treaty, register, letter or transcription imagery. **§4 type deleted.** |
| **Chronology** | ✅ Data only | Truth's timeline is written copy, not imagery. No dated photographs. Buildable from type. |
| **Oral history and audio** | ❌ **None** | No recordings, no waveforms, no transcripts as assets. **§4 type deleted.** |

## 9 · Effect support

Against the `MOTION-SYSTEM.md` catalogue. "Blocked" means the asset does not exist, not that
the technique is wrong.

### 🔴 Blocked — the asset does not exist

| Effect | Needs | Status |
|---|---|---|
| **`TXT-06` occluded type** | A cut-out with alpha | **No alpha in any of 155 raster files.** §4 calls this "the single highest-impact effect available to you". It is unavailable until cut-outs are produced. |
| **`ENT-08` stroke draw** | SVG single continuous strokes | **All 15 vectors are filled compound paths, 0 strokes.** Needs a stroke-based re-export from the artist. Cannot be fixed by redrawing. |
| `AMB-03` live crossing | One cut-out asset | Same alpha gap. Described in MOTION-SYSTEM as the highest impact-to-effort in the set. |
| `SCR-03` scrubbed sequence | 60–90 frame sequence | No frame sequences exist. |
| `SPA-07` turntable | Multi-angle photography or a 3D model | Neither exists. |
| `SPA-06` particle formation | GPU work, or a pre-rendered sequence | No sequences. |
| `IMG-09` grain | A noise texture at `/noise.png` | **File does not exist in `public/`.** Cheapest gap on this list to close. |
| `IMG-07` shader crossfade · `IMG-02` hover displacement | A noise/gradient map | Same missing texture. |
| `SCR-06` camera drive · `SPA-02`–`SPA-05` | 3D models / scenes | None exist. |

### 🟡 Blocked pending work on assets we have

| Effect | Blocker |
|---|---|
| `SCR-01` layered parallax | Needs 3+ separated depth layers or a depth map. Neither exists — but depth maps can be generated from batch-1 frames, which is the cheapest route to real depth. |
| `IMG-12` hover video · `AMB-06` video field | The one video is 162 MB and untranscoded. |
| `IMG-06` Ken Burns | ✅ on batch 1 (2.7× headroom). ❌ on batch 2, the 2000px derivatives and the heroes — all below the 1.5× floor. |
| `SCR-11` zoom-through | Batch-1 photography only. **Excluded outright on the three paintings**: 1448 ÷ 1440 = 1.005× headroom against a 1.5–2× floor, and with no re-shoot and no upscale permitted that cannot be fixed. |

### ✅ Supported now

`ENT-01` `ENT-02` `ENT-03` `ENT-04` `ENT-05` `ENT-06` `ENT-09` `ENT-10` ·
`SCR-02` `SCR-04` `SCR-05` `SCR-07` `SCR-08` `SCR-09` `SCR-10` `SCR-12` ·
`LAY-01` `LAY-02` `LAY-03` `LAY-04` `LAY-05` `LAY-06` ·
`IMG-08` `IMG-10` `IMG-11` · `TXT-01`–`TXT-05` `TXT-07` `TXT-08` ·
`NAV-01`–`NAV-06` · `INT-01`–`INT-06` `INT-08` `INT-09` · `SPA-01` ·
`AMB-02` `AMB-04` `AMB-05`

Notes: `IMG-11` shape morph has a ready-made asset in `blob-mask.svg`, a single-path mask
shape. `NAV-01` wordmark interstitial has `logo-wordmark.svg`. `TXT-02` variable weight works
on Work Sans only — Block Berthold is a single-weight face.

### ⛔ Excluded by ART-DIRECTION §6, regardless of assets

`IMG-03` dissolve · `IMG-04` chromatic split · `IMG-01` velocity warp · `ENT-07` character
decode · `INT-07` image trail · `IMG-05` duotone recolour — none of these may be applied to
portraits, artefacts or archival photographs. `IMG-01`, `IMG-04` and `SPA-06` remain
available for abstract and decorative elements. `AMB-01` gradient mesh conflicts with §6's
ban on gradient washes.

**These exclusions are unaffected by the motion-grade change of 2026-08-31.** Grade `full`
governs *which channel moves*; §6 governs *which techniques are never applied to a depicted
subject*. Both hold at once.

---

## 10 · Gaps to fill

Ordered by what unblocks the most.

1. **Cut-outs with alpha.** One subject on a transparent background unblocks `TXT-06` and
   `AMB-03` — the two highest-impact effects in the system. Batch 1's 3840px frames are good
   source material. This is the single highest-value asset request on the list.
2. **A noise texture at `public/noise.png`.** Unblocks `IMG-09`, and feeds `IMG-07` and
   `IMG-02`. Trivial to produce.
3. **Stroke-based vector exports from Leonard Mickelo.** Unblocks `ENT-08`. Must come from
   the artist — this is on the outstanding-asks list in `permissions.md` alongside the
   layered-vector request.
4. **Transcode batch 2** from 195 MB PNG to WebP q82, and the two heroes from PNG to WebP.
   Batch 3 was transcoded on ingest and is 38 MB for 44 frames at 4096px, which is the
   standard the other two sets should meet.
5. **Artefact and object photography.** No material at all. §4's "Artefacts and objects" type
   was deleted for this reason.
6. **Document and record imagery.** No manuscripts, treaties, registers or letters. §4 type
   deleted.
7. **Oral history and audio.** No recordings, waveforms or transcript assets. §4 type deleted.
8. **Map and territory vectors.** §4's territory treatment assumes boundary and route
   geometry that does not exist. Note the standing rule: no heritage coordinates.
9. ~~**Portrait-orientation frames of Country.**~~ **Largely closed by batch 3**, which adds
   five portrait frames at 3072×4096 — `burn-sun-heath-tall`, `smoke-canopy-tall`,
   `fire-stags-tall`, `fire-trunk-night-tall`, `burn-track-outcrop-tall`. Batch 1 is still
   100% landscape and batch 2's seven portraits are still 1.39×; these five are the first
   tall frames of Country with real headroom. What is still missing is a portrait frame of
   **open Country without fire in it** — every one of the five is a burn frame.
10. **Frame sequences**, if `SCR-03` or `SPA-07` are wanted.
11. **A re-shoot or re-scan of the three paintings** — currently 1149–1448px, with binding and
    furniture in frame.
12. **Attribution for the three paintings.** Not recorded anywhere in the Figma file.

## 11 · Housekeeping found during the audit

- The 12 `b1-*-proxy.webp` files at ~480px are referenced by no code. Wire up or delete.
- `public/fonts/README.md` and `docs/brand.md` both say Good Dog Cool is "not supplied". It is.
- The Figma `⛔ R10 QUARANTINE` group is **stale** — those frames were cleared for use by Ivy
  on 2026-08-30 and again on 2026-08-31. The label should be removed or re-worded in the file.
- `globals.css` sets `:focus-visible` to Yellow Ochre on Off-White — **2.30:1**, below the
  3:1 WCAG 1.4.11 floor for a non-text indicator. A real accessibility defect.
- `ring-c.svg` declares no fill.
