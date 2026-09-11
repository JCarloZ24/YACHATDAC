# Homepage collage derivatives

*Last updated: 11 September 2026*

## Replacement painting

Latest 9 September direction switches the active canvas source to
`/artwork/paintings/red-radial-painting.svg`, moved from this folder's `painting.svg`.
The descriptive filename is not an official artwork title. See
`public/artwork/paintings/README.md`.
This user-supplied SVG has a 1656 × 950 viewBox and embeds a PNG image; it contains
no vector paths or circles. It preserves the raster appearance and does not add
resolution. The existing WebP derivative remains available but is no longer loaded.

Origin: `public/media/home/painting.png`, supplied directly by the user on
9 September 2026 to replace the earlier painting photograph in the hero canvas.
Authorship and production method are unconfirmed; this replacement is not
attributed to the artist of the earlier work. User direction authorises its use.
`derivatives/painting.webp` is a lossless 1656 × 950 conversion, 1,736,576 bytes,
with no resize, crop or sharpening. The source PNG is preserved. The same canvas
and scroll reveal render it; the earlier photo derivative remains as a record.

## Gallery photographs

Origin: existing supplied client photography in `public/media/library/`.
Each output in `derivatives/` has its exact source path, dimensions and motion
grade in `src/content/homepage-media.ts`. Existing source credits and consent
notes remain in `src/content/kit.ts` and `src/content/record-media.ts`.

Created for the user's homepage collage screenshot on 8 September 2026 with
Sharp: resize to the manifest width without enlargement, WebP quality 80.
Expanded on 9 September with twelve additional 480px derivatives at quality 78.
No source was overwritten. The 24 files total 736,744 bytes. Twenty-four unique photographs fill 36 plates;
twelve small distant plates reuse existing URLs without additional downloads.
The hero shares the decoded DOM images with its Three.js textures.
No photographs were generated. This is a mid-fidelity selection, not a claim
that every screenshot photo has been exactly matched.

F8 permits supplied photo use. All slots take `frame` motion: whole plates move
around a fixed camera and crops remain fixed. Portraits are unnamed and imply no
organisational role. No fire imagery is used as decorative atmosphere.


Portal assets, 9 September 2026. Origin: sunset-road.webp is a quality-90 WebP of existing public/media/hero-country-day.png (credit/production method unconfirmed). road-background.png contains the original JPEG bytes exported from Figma 7XBvi0Mdbtmym10nkF9IGp node 3371:41346; road-foreground.png is the original transparent PNG from 3371:41347. woodland-road-ending.webp composites those exact layers at width 1440 and crops their top 900px for the reference ending. Credit/production method unconfirmed; used at user direction. Masters retained unchanged; no AI generation/upscaling.


Latest user correction, 9 September 2026: the woodland road from Figma is used throughout the central opening and arrival. The sunset road and image crossfade are no longer used or loaded.


Daylight correction, 9 September 2026: the same canvas now composites the transparent Figma treeline over its supplied sky texture, sampling the pale grey-blue/daylight band with restrained saturation and a warm horizon. woodland-road-foreground.webp preserves the top 1440?900 foreground with alpha; road-sky.webp is the full original sky transcoded to WebP. Origin remains Figma nodes 3371:41346/41347. No change to portal timing or terrain colours.


Full-height foreground, 9 September 2026. Origin: Figma 7XBvi0Mdbtmym10nkF9IGp, foreground node 3371:41347, re-extracted at its full source size. `derivatives/woodland-road-full.webp` is that whole 1440x1500 layer with alpha (WebP q82/alpha 90, 350 KB), superseding `woodland-road-foreground.webp`, which kept only its top 1440x900 and so did not contain the near road or the speckled charcoal dissolve along the photograph's bottom edge. Supplied pixels throughout; nothing generated, resampled or outpainted. Credit/production method remains unconfirmed. This also supersedes `derivatives/red-earth-track.webp` — a colour-corrected screen capture prepared to extend the near ground before the full layer was found — which is now unreferenced and can be deleted once the frame is signed off.


Truth colour layers, 9 September 2026. Origin: Figma 7XBvi0Mdbtmym10nkF9IGp, frame 3371:44774; background 3371:44776 and soft-light overlay 3371:44780. truth-blue-sky.webp is the 1440x900 visible crop of the original background at y=1422 after fitting to 1440x6996. truth-soft-light.webp is the corresponding overlay crop at y=464 after fitting to 1440x7619. Both are WebP quality 95 derivatives of the supplied assets, not generated imagery. Credit/production method unconfirmed. Original source files are unchanged. Shader applies the frame's 25% black overlay in display RGB, then soft-light masked by terrain alpha.


### Truth timeline layers - 9 September 2026

Origin: Figma YACHATDAC V2, Homepage Prototype 3371:45208-46472. `derivatives/truth-sky-sequence.webp` and `truth-light-sequence.webp` are complete supplied image layers exported to WebP (quality 95), replacing cropped views for reversible offset animation; no authored replacement pixels. Credit unconfirmed. `truth-dotted-path.svg` (3371:45366) and `truth-year-marker.svg` (3371:45367) are exact vector exports including the original arrow and rosette. Narrative and date provenance: `src/content/home-truth-scenes.ts` and homepage draft amendment.

### Invitation - 9 September 2026
Origin: Figma 7XBvi0Mdbtmym10nkF9IGp, frame 3371:41740. Photos sandstone-overhang-group.webp (3371:41802), verandah-table-people.webp (3371:41842), person-beside-smoking-fire.webp (3371:41865) are exact supplied fills converted with Sharp to WebP quality 88, maximum width 1000 without enlargement. Credits and identities unconfirmed; use authorised by user direction/F8. All three use frame motion. Fire photograph accompanies Caring for Country only. No generated photography. invitation-ring.svg (3371:41805), invitation-spiral.svg (3371:41845), invitation-boomerang.svg (3371:41868), invitation-chevron.svg (I3371:41841;4179:9009) are unchanged Figma exports.

### Pathway cards and offer plates repointed to the library - 11 September 2026

User direction: *"let's optimize the images in homepage for better quality."* The four pathway
cards and the four closing-offer plates no longer use `derivatives/`. They point straight at the
masters in `public/media/library/`, which are 2000-3840px and already served to other routes.

**What was wrong.** Those eight slots were 480-520px WebPs, 7-38 KB each. Both sets are `fill` +
`object-cover`, and cover scales a photograph until its *short* axis fills the box and crops the
long one - so the width actually painted is the box's HEIGHT times the source's aspect, not the
box's width. A 1.897:1 photograph in the pathway card's 5:4 box is painted 459 CSS px wide at a
1440 viewport, 918 at DPR 2. A 480px file into 918px of box is a 1.9x upscale, and that is the
softness. The declared `sizes` had the same error and has been corrected in all three components
(the Invitation included); the offer plates now *derive* theirs from the slot geometry and the
recorded pixel size rather than declaring a flat figure.

**Why it costs nothing.** `next.config.ts` has image optimisation on (AVIF/WebP), so `next/image`
serves a resized device bucket and the file behind it is only a ceiling. Measured against the dev
server: asking the old derivative for 1080px returns 480px - the ceiling - at 12.8 KB; the master
returns a real 1080px AVIF at 49 KB. No bytes added to git, no masters copied, one layer removed.

**Verified pure downscales before repointing.** Every derivative's aspect matched its master to
within 0.002, and SSIM against a fresh downscale of the master ran 0.92-0.98 evenly across the
channels - WebP loss at 30 KB, not a colour move. Framing is unchanged, so this is not a design
edit. ⚠ Re-run that check before repointing anything else: a derivative that *is* a crop cannot be
swapped for its master without changing what the picture shows.

The derivative files stay on disk - `homeHeroFrames` still uses all eight for the /homepagev2
collage, where they are 100px plates and the small file is the right one.

⚠ **The Invitation's three are NOT fixed and cannot be from here.** They are the Figma fills
recorded above, capped at 1000px with no master in this repo; an SSIM sweep of all 126 library
images scored ~0.10 against each, i.e. no match. `person-beside-smoking-fire` is 802px and is
already at its ceiling. Fixing them means re-downloading the fills from node 3371:41740 at full
resolution.
