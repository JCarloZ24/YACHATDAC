# Art Direction

*Last updated: 8 September 2026*

What this site is, how its content is staged, and how to design a page that hasn't been designed yet.

**Companion files:** `MOTION-SYSTEM.md` (behaviour and timing), `motion-tokens.css` (values as code). When this document and the motion system conflict, **this one wins** — it knows the subject matter.

---

## 0. Precedence and deviation

Same three tiers as the motion system:

1. **Principles** (§2) — these govern.
2. **Tokens** (§3) — defaults. Start here.
3. **Patterns** (§4, §5) — vocabulary, not a menu.

**You are expected to deviate.** If a page needs a staging pattern that isn't described here, build it. If a listed treatment fights the content, drop it. The test for anything new is §7 — if it passes, it belongs, whether or not it appears below.

What must not vary: the principles, the palette, the typographic system, and the restraint. Everything else is available.

When you deviate, leave a comment saying what and why.

---

## 1. What this site is

*Answered 2026-08-31 by Ivy, with subject and audience drawn from the Branding Guide sitemap, the Ten Year Strategic Plan and the v3 page-copy drafts rather than from inference.*

- **Subject:** the history and living work of the **Iningai Nation**, on Iningai Country — its people, territory, and record. The site is published by **YACHATDAC**, the Yambangku Aboriginal Cultural Heritage and Tourism Development Aboriginal Corporation, formed in 2016 by Traditional Custodian families and based in Barcaldine, Central Western Queensland. It manages **Turraburra**, 8,870 hectares 120km north of Barcaldine, called Gracevale until it was bought back in 2019.

  Note what is *not* in that line: **material culture**. There is no artefact, tool, vessel or garment photography, and objects appear in the copy only as things already taken from the site. This site's material is Country, people, work, rock art and the written record — not a collection. §4 is built accordingly.

- **Audience:** **there is no single ranking, and forcing one would be wrong.** The Branding Guide's own sitemap assigns an audience per pillar, and the drafts carry a matching four-way router that appears verbatim on both About and Our People:

  | Pillar | Audience |
  |---|---|
  | **Wonder** — Guesting on-Country | Travellers, families, school groups — *the Curious* |
  | **Truth** — Research & Discovery | Universities, funders, brands, researchers, partners — *the Practitioners* |
  | **Living Work** — Caring for Country | Other Indigenous communities worldwide; also neighbouring landholders and funders |
  | **Connect / The Record** | All site visitors; and people holding archival material |

  Design each page for its pillar's audience, not for a site-wide average. Wonder carries more second-person address than the other six pages combined; Living Work has almost none and speaks in the third person about the organisation. That difference is in the copy already — do not flatten it.

  Two audiences sit across all pillars and are easy to forget: **community members and descendants** ("For anyone still finding their way home, this Country is patient"), and **Aboriginal and Torres Strait Islander readers**, who are given a warning about images and names of people who have passed away.

- **Primary job:** **preserve and present the record.** Truth-telling and archive in equal measure — which is exactly what §2's "the record must survive the design" is written against. Where a design choice trades findability for impact, findability wins.

- **Voice:** written from **inside the community** — copy says "our", not "the". This matches the About draft, which uses "we" and "our" throughout, and the homepage's "We are its Traditional Custodians, and we are still here."

  ⚠ **This is not fully settled and the design should not assume it is.** Decision **D16** is open: CR10 flags that "our people" reads differently when the site is the community's own voice than when a third party writes it, and the note says "This needs Suzanne, not us." The drafts also shift between the *corporation* speaking ("We were formed by key members of the Traditional Custodian families") and the *community* speaking ("The Native Police are sent to disperse us"), sometimes inside one paragraph. Living Work alone avoids the first person entirely. Design attribution blocks and pull-quotes so a byline can carry that distinction rather than the body copy having to.

Everything below assumes a **cultural heritage site**, not a portfolio or a brand campaign. That distinction is the single most important input to the design, and §6 exists because of it.

---

## 2. Principles

**The material is the design.** Photographs, artefacts, textiles, and artworks carry the page. Typography holds them and gets out of the way. Every reference in the source set is image-led, and that is the one thing they all agree on — it is the spine of this site too.

**Motion earns its place by revealing, not decorating.** A morph that carries an artefact from a grid into full view is showing the user where it went. A fade-and-rise on a paragraph is showing off. The first is welcome anywhere; the second should appear at most once on the site.

**Nothing static, nothing frantic.** The brief is that the site should not feel dead — but heritage material rewards a slower pulse than an agency showreel. Default toward the long end of the duration scale. `--dur-slow` and `--dur-xslow` will feel right more often here than on a commercial site.

**Depth over decoration.** Where the references feel expensive, it is almost always layering — subjects passing in front of headlines, foreground and background moving at different rates. Build depth with the real material. Don't add gradients, glows, or floating shapes to manufacture it.

**Restraint concentrates.** One signature moment per page. If the home page has a morph that people remember, the interior pages should be quiet and let content lead. Motion spread evenly across a site cancels itself out.

**The record must survive the design.** Every artefact, name, date, and caption stays readable, selectable, linkable, and reachable without JavaScript running or motion playing. If an effect obscures the record, the effect goes.

**Attribution is part of the composition.** Source, date, collection, and contributor are content, not fine print. Design space for them from the start rather than appending them.

---

## 3. Brand tokens

*Filled 2026-08-31 from the Figma local variable collection `YACHATDAC Colour`, which matches `YACHATDAC Branding Guide (Initial).pdf` hex-for-hex. Full set in [`brand/palette/palette.json`](../brand/palette/palette.json).*

```css
:root {
  /* Core palette. Every colour is tied to a real element of Country — keep the
     name/meaning pairing, never flatten to primary/secondary/accent. */

  --c-ground:  #f6f6ec; /* Off-White, "Natural Canvas". The default surface.
                           Recurs as the lit sky and bleached grass right through
                           the photography — 378A7604_1.28.1, _1.76.2. */
  --c-ink:     #090e12; /* Charcoal Black, "Fire & Story". 17.83:1 on ground. */
  --c-accent:  #d69828; /* Yellow Ochre, "Morning Light". Wayfinding and emphasis
                           only. Sampled dominant across the batch-1 golden-hour
                           frames — _1.14.1 grass #c68b4a, _1.91.1 rock #b85f33. */
  --c-muted:   #4e3524; /* Roasted Brown, "Earth". Captions and attribution.
                           THE most recurring colour in the photography: the
                           #a89078 / #906048 / #784830 / #483018 family is the top
                           five sampled values across all eight library frames. */
  --c-line:    #22372b; /* Deep Evergreen, "Living Country", at low opacity for
                           rules and dividers. Also the standard dark ground. */

  /* Type — see the assessment below. */
  --f-display: "Block Berthold", "Arial Black", sans-serif;
  --f-body:    "Work Sans", ui-sans-serif, system-ui, sans-serif;
}
```

**Also in the set, and load-bearing:** `#cb7722` Burnt Ochre (Country) · `#32b0ae` Turquoise
Blue (Water & Sky) · `#5e7930` Eucalyptus Green (Vegetation) · `#af231c` Oxide Red (The Land)
· `#122449` Midnight Navy (Night Sky) · `#fbae3d` Yellow Gold — **the hero scroll cue and
nothing else**, not a drift of Yellow Ochre; both are real and both stay.

**Where the colours came from is verifiable.** Programmatic sampling of the eight
`public/media/library` frames returns a warm earth family — `#a89078`, `#906048`, `#784830`,
`#603018`, `#483018` — sitting directly on the Roasted Brown / Burnt Ochre axis. The one
outlier is `country-wide.webp`, whose sky samples `#c0d8d8` and `#a8c0d8`: that is the
Turquoise "Water & Sky" anchor, evidenced. The palette was drawn from this Country, and the
photography confirms it.

⚠ **`elder-portrait.webp` samples as near-greyscale** (`#303030`, `#484848`, `#606060`), as
does batch 1's `378A7604_1.42.5`. Two monochrome frames in an otherwise warm set — they need
a deliberate treatment or they will read as a mistake.

### Contrast, measured

Ratios computed against the palette above. **AAA body text (7:1) is reachable only on the
four neutral grounds** — every accent fails AAA everywhere.

| Foreground | on Off-White | on Deep Evergreen | on Charcoal | on Midnight | on Roasted |
|---|---|---|---|---|---|
| Charcoal `#090e12` | **17.83** ✅AAA | 1.52 ❌ | — | 1.27 ❌ | 1.72 ❌ |
| Off-White `#f6f6ec` | — | **11.71** ✅AAA | **17.83** ✅AAA | **14.05** ✅AAA | **10.39** ✅AAA |
| Yellow Ochre `#d69828` | 2.30 ❌ | 5.08 ✅AA | 7.74 ✅AAA | 6.10 ✅AA | 4.51 ✅AA |
| Yellow Gold `#fbae3d` | 1.72 ❌ | 6.80 ✅AA | 10.36 ✅AAA | 8.17 ✅AAA | 6.04 ✅AA |
| Turquoise `#32b0ae` | 2.43 ❌ | 4.82 ✅AA | 7.35 ✅AAA | 5.79 ✅AA | 4.28 ⚠large |
| Burnt Ochre `#cb7722` | 3.11 ⚠large | 3.76 ⚠large | 5.73 ✅AA | 4.51 ✅AA | 3.34 ⚠large |
| Oxide Red `#af231c` | 6.27 ✅AA | 1.87 ❌ | 2.84 ❌ | 2.24 ❌ | 1.66 ❌ |
| Eucalyptus `#5e7930` | 4.54 ✅AA | 2.58 ❌ | 3.93 ⚠large | 3.10 ⚠large | 2.29 ❌ |

**Rules that follow from the numbers:**

- **Body copy is Charcoal on Off-White, or Off-White on any of the four dark grounds.** Those
  are the only AAA-capable pairings. No accent colour carries body text anywhere.
- **Yellow Ochre and Yellow Gold cannot be used as text on the light ground** (2.30, 1.72).
  On dark grounds they are the strongest accents available.
- **Oxide Red and Eucalyptus Green invert.** Both work on Off-White and fail on every dark
  ground. Do not carry a red or green accent from a light section into a dark one.
- `docs/brand.md` suspected Turquoise on Evergreen was a problem. **It passes AA at 4.82.**
  Eucalyptus on Evergreen is the real failure, at **2.58**.
- ⚠ **A live defect:** `globals.css` sets `:focus-visible { outline: 2px solid ochre }`. On
  the Off-White ground that is **2.30:1**, below WCAG 1.4.11's 3:1 floor for a non-text
  indicator. Logged in OPEN QUESTIONS.

### Typefaces — using yours, assessed

Four families are supplied and installed. The Figma audit confirms **Block Berthold covers
H1–H3 only**; `Typography/Desktop/H4`–`H6` are Bantayog Sans ExtraBold Alt.

**Work Sans holds up for long-form, and it is the right body face.** It is a genuine text
face rather than a display face pressed into service, it ships as a variable font so weight
is a continuous axis, and its moderate x-height and open apertures hold at the 16–20px sizes
Truth's eighteen sections need. It is also the only one of the four with an unambiguous
licence (SIL OFL 1.1), which matters for a site that must outlive its build. Of the four it
is the closest to the Branding Guide's stated brief of *"humanistic typography"*.

The honest caveat: **Block Berthold is not humanistic.** It is a 1908 Berthold display
grotesque — heavy, tightly-set, and built for impact at size. It is a good foil for Work Sans
precisely because the two are so distinct, and it earns its place at H1–H3, but it should
never be asked to run below H3 or to carry more than a few words.

Type scale follows a consistent ratio. ⚠ Three ramps currently disagree — the bound Figma
text styles, the `YACHATDAC Type` variables (56/48/40/32/24/20), and `globals.css`. Logged in
OPEN QUESTIONS; the bound styles should win, because they are what everything points at.

**Rules that hold regardless of the values:**

- The palette is drawn from **the tribe's own material** — textiles, pigments, landscape, existing brand — not selected for contrast appeal. If the brand colours came from somewhere real, say where in a comment.
- **Photography is never tinted to match the palette.** Do not duotone historical images to fit a brand colour. `IMG-05` is explicitly out of scope for archival material (see §6).
- Accent colour is for **wayfinding and emphasis only** — never large fills behind content.
- Type scale follows a consistent ratio. Display face carries personality; body face is chosen for reading long-form history at length, which most display faces cannot do.
- Contrast meets **WCAG AA minimum**, AAA for body text. Elders and researchers are part of this audience.

---

## 4. Content types and how each is staged

This is the core of the document. Different material demands different treatment, and getting this wrong is how heritage sites end up feeling like agency work.

*Revised 2026-08-31 against the real material. Three content types were removed because
nothing exists to fill them — artefacts and objects, documents and records, and oral history
and audio. Each is recorded as a gap in [`ASSETS.md`](../ASSETS.md) §10 rather than silently
dropped. File-level detail for every frame named below is in
[`brand/PHOTO-INDEX.md`](../brand/PHOTO-INDEX.md).*

### Portraits and people

*Photographs of individuals, families, groups. All contemporary — the 2024 batch-1 shoot, the March 2022 batch-2 shoot and the batch-3 cultural burning shoot. There is no historical portraiture in the collection.*

**Stillness is the treatment.** This is the strictest category on the site.

- **Entry:** `ENT-02` mask wipe or a plain fade. Nothing that moves the face.
- **At rest:** static, or `IMG-06` Ken Burns at the very slowest — 1.0→1.03 over 20s, no faster. ⚠ **Batch 1 only** — its 3840px masters have 2.7× headroom. Batch 2 is 2000px, below the 1.5× floor, and will soften.
- **Names are never animated.** No `ENT-07` decode, no scramble, no letter-by-letter reveal on a person's name.
- **Never:** dissolve, particle formation, warp, glitch, trail, tilt, cursor-follow. A face is not a texture.

**The material.** The strongest quote and testimony frames are `378A7604_1.80.1` (close
portrait, the empty left third purpose-built for a pull-quote), `_1.77.4` (full-length under
a rock arch, dark flanks are ready-made type zones) and `_1.42.5` (monochrome, head bowed).
For a person anchoring a page, `_1.40.2` and `_1.74.1` have the best light in the set.

⚠ **Batch 1 is 100% landscape.** There is not one portrait-orientation frame in fifty, so a
tall mobile hero has nothing to crop from except batch 2's seven portrait frames.

⚠ **Two frames are near-greyscale** — `_1.42.5` and `elder-portrait.webp`. They will not sit
beside the warm frames without a deliberate treatment.

⚠ **Consent is unresolved for roughly 33 identifiable faces.** Our People's own draft records
that Rangers are unnamed across the site and that a full list with consent to be named and
photographed is still needed. **Batch 1 is an elder/knowledge shoot** — a portrait from it
captioned under "Iningai Rangers" asserts that person is a ranger. Caption what the frame
shows, never who the person is.

⚠ **Children appear in fifteen batch-2 frames**, six with clearly identifiable faces
(`March22-1584`, `1596`, `1975`, `2050`, `2167`, `1833`). Guardian consent is required
regardless of crop, and `1584` — an adult applying ochre to an identifiable child — is the
highest-risk frame in the collection.

### Places and territory

*Landscape, escarpment, plains, tracks, rock faces. **The best-resourced category on the site** — and where the strongest motion should live.*

- **Depth:** `SCR-01` layered parallax. ⚠ **Not currently buildable** — it needs 3+ separated depth layers or a depth map, and neither exists. Generating depth maps from the batch-1 3840px frames is the cheapest route to real depth and should be the first thing tried.
- **Occlusion:** `TXT-06` — a place name sitting *between* the landscape and a foreground element. ⚠ **Blocked.** It costs one cut-out asset with alpha, and **not one of the 155 raster files in this project has an alpha channel.** This remains the highest-impact effect available, and producing a single cut-out from a batch-1 frame is the highest-value asset request on the list.
- **Drift:** `IMG-06` Ken Burns, generous. Landscapes tolerate movement that portraits don't. **Batch 1 only** — see the resolution note above.
- **Maps:** ⚠ **No map or territory vectors exist.** `ENT-08` stroke draw was the assigned treatment and it cannot run — see the artwork section below. Note also the standing rule: no heritage coordinates in map layers, markup, comments or source, and no real elevation data or place names for Turraburra until the land-detail permission is settled.

**The material.** For full-bleed with room for a headline: `378A7604_1.91.1` (the plain seen
from above at golden hour, clean sky across the whole right half), `_1.76.2` (**the most
"empty and usable" frame in batch 1**), `_1.28.1` (entire upper half clean sky), `_1.77.5`
(a silhouette at a shelter mouth — anonymous, so no consent question) and `March22-0267`
(**the strongest graphic frame** — a red road across green scrub; crop the vehicle out and it
becomes a pure colour-field plate). `March22-2432` carries scale better than any other frame
in batches 1 and 2 — `country-wide-track` now carries it better still, and it is the only
frame in the collection that shows how much country 8,870 hectares is.

**Batch 3 changes what this category can do.** It has the best headroom in the collection at
2.84×, which makes it the only set where `IMG-06` Ken Burns runs at full width without
softening. `fire-line-duskblue` has the largest single type zone anywhere — two-thirds clean
dusk sky. `fire-horizon-night` gives two type zones on one frame. `burn-canopy-held` is the
one frame that makes the argument for cool burning without a caption: untouched green canopy
over cleaned black ground. And `aerial-burn-scar` shows a burn from directly above as a shape
with a defined edge, which is the hardest thing about patch burning to convey at ground level.

**The sandstone shelter is a distinct case inside this category, alongside rock art.** Batch 3
puts four frames at a rock shelter — `shelter-fire-foreground` (which arrived from the client
named "Cultural Site Maintenance 01"), `shelter-ledge-walking`, `shelter-worker-seated` and
`shelter-seedling` — with fire being worked around the site. No marks or art are visible in
any of them, but the shelter is the dominant thing in frame and all four are bucketed
`cultural-site`. **They must be captioned.** Fire at the base of a shelter reads as a heritage
site burning to anyone who does not know what a cool burn is, which is the exact opposite of
what the photograph shows. Four further batch-3 frames have outcrop or escarpment in shot and
are flagged on their entries.

**Rock art is a distinct case inside this category.** Eleven frames show painted figures,
hand stencils, engravings or possible worked marks — `March22-untitled` and `March22-2302`
most explicitly, plus `378A7604_1.19.1`, `_1.12.2`, `_1.7.2`, `_1.6.1` and `_1.9.1`. Use is
cleared (Ivy, 2026-08-30 and 2026-08-31) but **Elder Advisory Group endorsement is not
confirmed**. Until it is: contained and captioned, never full-bleed, never tiled, never a
background behind unrelated content, and never a decorative texture. `March22-2302`'s
location must not be identifiable from surrounding context.

### Artworks, patterns, textiles

*Leonard Mickelo's supplied vectors — 15 files in `brand/artwork/vectors/` — plus three photographed dot paintings. No weaving, beadwork or textile photography exists.*

These are graphic, often repeating, and built to be seen in motion.

- **Repetition:** `TXT-03`-style marquee applied to pattern bands as section dividers. Slow. `dots-rule.svg` (172 paths), `band-a.svg` (274) and `band-b.svg` (243) are built for exactly this.
- **Construction:** `ENT-08` stroke draw to show a motif being built line by line. ⚠ **Blocked, and not fixable by us.** Every one of the 15 vectors is filled compound paths — **zero strokes across the whole set**. Redrawing them as strokes is the prohibited generation, not a workaround. This needs a stroke-based re-export from the artist, and it is on the outstanding-asks list in `permissions.md`.
- **Scale:** `ENT-02` mask reveal at large size. `blob-mask.svg` is a single-path mask shape supplied for precisely this, and it also feeds `IMG-11` shape morph.
- **Masking and travel:** `dots-trail.svg` (562 paths) is the homepage trail and the Guide's road; `dots-wave.svg` drifts inside a mask for river banks and grounds.

**Motion on artwork is permitted** — Ivy, 2026-08-30. The limit is unchanged and absolute:
**animating, masking, revealing, cropping and recomposing a supplied vector is permitted;
authoring new geometry in that style is not.** Recomposition means instancing, masking,
mirroring, scaling and recombining the artist's actual paths — never tracing, never drawing a
new rosette, never generating a matching motif. Leonard Mickelo's own sign-off is still
outstanding.

⚠ **Six colours inside the artwork are not in the brand palette** — `#31afe3` in `glyph-b`
(distinctly bluer than Turquoise), `#f9b24c`, `#d57907`, `#98470d`, `#fefefe`, and `#d97804`
in `blob-mask.svg`. **Do not recolour the artwork to match the palette.** It is the artist's
work; §6 and the standing rules both bind. The discrepancy is recorded, not corrected.

⚠ **In Figma the same rule is one careless line of script away from being broken.** The
`Glyph / Truth` variants are full-colour artwork — the boomerang is `#fefefe` with `#f9b24c`
stripes, the circle runs `#f9b24c` / `#d57907` / `#98470d`, the starburst is the off-palette
`#31afe3`. Because instance fills are overridable, a loop that paints "every SOLID fill white"
flattens all three into monochrome blobs that still *look* deliberate. **Instance the motif and
set nothing.** Home is the reference: its seven glyphs carry the artist's colours untouched.

**The `Artwork / Ring` watermarks are the one exception, and only on light grounds.** Ring A
(`2051:4022`) and Ring B (`2051:4024`) ship with the path at `#f6f6ec @ 0.08` and are placed as
background texture, the instance opacity carrying the ground: navy 0.13/0.15, charcoal and
evergreen 0.07/0.08, roasted 0.07. **On a `#f6f6ec` canvas ground that is the same colour as
the ground and renders nothing** — which is why The Record §04's ring had never once been
visible. Canvas grounds take a roasted `#4e3524` path at instance 0.30.

This is not a breach of the rule above. A ring is a watermark whose whole job is to sit at a
few percent against whatever is behind it; a `Glyph / Truth` motif is a piece of the artist's
artwork shown at full strength, and it is never recoloured. Keep the two straight: **change a
ring's colour to make it visible, never a motif's to make it match.**
Recolouring is authoring, and it is the rule above, not a style preference.

⚠ **`Artwork / Cluster` is authored for background use and needs unwrapping for foreground
use.** It ships as a frame at **8% opacity carrying its own `#f6f6ec` background fill**, with
the artist's path inside at 8%. Instanced as-is on a photograph it is invisible; paint the
wrapper and it becomes a solid rectangle. To use it as a foreground mark: clear the wrapper's
fill, set the wrapper to 100%, and colour **the path**. The three `⚠ PENDING-MOTIF · artwork
cluster — sits ON the photograph` instances on Truth are still invisible for this reason.

⚠ The three paintings are 1149–1448px with spiral binding and furniture in frame. They need
cropping to use, are too small for full-bleed, and **no artist is recorded for them**. They also **cannot be re-shot** — the originals are in Australia and inaccessible — and must not be AI-upscaled, because on a dot painting an upscaler invents dots that were never placed. 1.57MP is the permanent ceiling.

### Chronology

*Truth's descent — Iningai Nation → 1861 → 1862 → 1886 → 1902, ending on the thirty-seven at Lake Dolly — plus the deep-time sections. This is **written copy, not imagery**: there are no dated photographs, so chronology is carried by type and ground colour.*

- `SCR-04` horizontal scroll or `SCR-02` pinned section with a scrubbed timeline.
- **Colour is the chronology.** The descent ladder in [`src/content/kit.ts`](../src/content/kit.ts) is ordered, not decorative — "red is spent once" — and `wave-divider.svg` carries the handoff between grounds. Do not sort or re-group it.
- Progress must be visible — the user always knows where they are in the span.
- **Provide a static index.** A timeline that can only be read by scrolling through it is not an archive. Every event needs a direct link. Truth's own "Start from the beginning ↓" targets the *last* entry, which is why global smooth-scroll is deliberately off.
- ⚠ **The 1902 count is unresolved.** The Truth draft records "thirty-five" in one recording against a published thirty-seven adults and three children, with a note asking Suzanne to confirm. The homepage repeats thirty-seven without the caveat. Do not set either number as a display statistic until it is settled.

---

## 5. Page archetypes

Choreography for the page types this site will need. **New pages that don't fit these should be built by applying §2 and §4, not by forcing a fit.**

### Threshold — the home page

The one place to spend boldness.

Open with the most characteristic thing in the tribe's world, at full scale, in whatever form suits it — a landscape, a face, a motif, a recording. Not a hero image with a headline centred over it, which is the default treatment and reads as templated.

Choreography: material arrives first, orientation second. One signature moment, then let the user descend into the site. `TXT-06` occlusion or a `LAY-01` morph would both carry this.

### Collection index

A browsable set — artefacts, portraits, places, documents.

- `ENT-05` cascade on load, eased stagger per motion system §1.3.
- `LAY-02` accordion slats or `LAY-03` scatter↔grid if the set is small and visual.
- `LAY-05` reorder on filter — items move to new positions rather than snapping. Filtering an archive should feel like the archive rearranging, not reloading.
- Item → detail via `LAY-04`, image persisting.

### Subject detail

One artefact, person, place, or document.

- Arrives from `LAY-04`, so the subject is already on screen. Supporting content fades in **~150ms after the morph settles** — never simultaneously, or the user's eye has nowhere to land.
- Attribution block designed, not appended.
- Related items at the foot, entering on `SCR-12`.

### Chronology page

Per §4. Pinned or horizontal, always with a static fallback index.

### Territory / map

Per §4. `ENT-08` for boundaries and routes, `SCR-01` for depth. Place names as `TXT-06` where the composition allows.

### Stewardship / about

Who maintains this, on whose authority, with what permissions, and how to contribute or correct. The credibility of the whole site rests here.

⚠ **Revised 31 August 2026, under F7 and F9.** This archetype used to read *"Quiet page. Text-led, minimal motion, `ENT-06` line masks at most… motion undermines credibility in exactly this context."* That is superseded. What undermines credibility is **decoration**, not motion — and the distinction is what the page's motion is *doing*.

**Design a stewardship page's motion to be evidentiary.** It should show the organisation being measured, the record admitting its own gaps, a claim being checked against the thing that authorises it. About's signature moment is still a line mask, as the old rule wanted — but at full scale, on a pinned screen, as the page's argument rather than as a ration. The page's ⚠ pink markers, its unfilled partner slots and its future-tense sentences are part of that argument: a stewardship page that shows what it does not yet know is more credible than one that is merely still.

What stays true from the old wording: this page type is **type-led more often than any other**, its loud channel is `type` on most screens, and it takes fewer pins than a narrative page. See `05 · About` in `docs/motion/scenes.md` for the worked example.

---

## 6. What this site does not do

### The excluded-techniques table is retired — F9, Ivy, 31 August 2026

This section used to carry a table banning six techniques outright on portraits, artefacts and
archival photographs: dissolve `IMG-03`, chromatic split / glitch `IMG-04`, velocity warp
`IMG-01`, character decode `ENT-07`, image trail `INT-07` and duotone recolour `IMG-05`.
**All six are now available, on depicted subjects as well as abstract elements**, along with the
overshoot easings `back`, `elastic` and `bounce` that `motion-grammar.md` used to ban. Ivy:
*"these are definitely permitted… these things would make motions, transitions, way more alive
and fun which is what i want."* Full reasoning in **F9**, `docs/decisions-and-risks.md`.

The table's stated reasons were about **meaning** — a glitch "signals corrupted data", a
dissolve reads as "the content being disposable" — and meaning is set by where an effect is used,
not by the effect existing. A dissolve behind a question the whole organisation is measured
against is an argument. The same dissolve on a portrait for a scroll flourish is the thing the
table was actually pointing at. The rule made that judgement in advance and got it wrong in both
directions, and the pages that obeyed it all went flat the same way.

**What replaces it is §7, applied per use.** An effect earns its place once per page, where it
says something the copy already says. A second decorative use of the same technique on one page
is still the failure this section exists to name, and it still comes out.

### Fire is a practice, not atmosphere — added 1 September 2026

Fire on this site means **fire-stick farming**: a responsibility, a method and a body of
knowledge. Embers as sparkle behind an unrelated headline trivialises it. The rule existed
already inside one sketch in `sketch-library.md`; batch 3's forty-four photographs make it a
site rule.

**This is not a revival of the retired table and it bans no technique.** Any effect may be
used on a fire frame. What may not happen is a fire frame used as decoration behind copy that
is not about caring for Country. The judgement is about *where*, which is exactly what F9 says
the judgement should be about.

Two practical corollaries:

- **The spectacular frames are the dangerous ones.** `fire-line-duskblue`,
  `fire-night-silhouette`, `fire-line-sunset` and `fire-horizon-night` are the strongest
  pictures in the collection and will be reached for as heroes on unrelated pages.
- **Several read as wildfire to anyone who does not know the practice** — a fire line across a
  dark horizon, flame climbing a trunk, fire at the base of a rock shelter. Those carry a
  caption requirement on their entries in `brand/photo-notes/batch-3.md`, and it is not
  optional.

**What did not change, because none of it is a rule about technique:** `MOTION_GRADE` from F8
still decides *where* an effect lands on portraits and cultural-site material — the plate,
ground, scrim, type and neighbouring layers carry it while the image plane holds.
**Artwork amendment, 8 September 2026, user direction:** generated artwork is now
permitted, including The Record's handprint aperture. The earlier iconography
restriction is removed; generated assets carry their own provenance and are not
attributed to the supplied artist. No heritage coordinates. The reduced-motion cut and the performance
floors stand, as does **no layout properties, ever** — that one is performance, not taste.

**Still avoid:**

- **Scroll-jacking the whole site.** Pinning is a tool for one or two sections, not a navigation model. Researchers need to find things fast.
- **Motion gating content.** Nothing may require an animation to complete before it can be read.
- **Decorative floating shapes, gradient washes, glows.** Depth comes from the material.
- **Stock imagery.** Not one frame. If an image isn't of this tribe, it doesn't appear.
- **All-caps eyebrow labels, single-word colour accents in headlines, `→` appended to link text.** Templated tells.
- **Numbered markers** (01 / 02 / 03) unless the content genuinely is a sequence.

---

## 7. Designing a page that isn't in this document

Four questions, in order.

1. **What is the material?** Match it to a §4 content type. That determines the treatment before anything else does.
2. **What is the page's job?** Browse, read, examine, orient, or contribute. Browsing pages can move; reading pages should not.
3. **What is the one moment?** Pick a single thing the page does that the user will remember. Everything else stays quiet.
4. **Does it pass?** Content readable without motion. Nothing in §6. Attribution designed in. Reduced-motion substitution exists. Contrast passes AA. Keyboard-reachable.

If all four resolve, build it — including with techniques not listed here. If question 3 has no answer, the page probably doesn't need motion, and that is a legitimate outcome.

---

## 8. Voice

Plain, specific, unhurried. The material is significant enough that the writing does not need to argue for it.

- **Name things precisely.** A specific object name over "artefact". A place name over "location".
- **Use the community's own terms**, with translation or gloss on first use. Never replace an indigenous term with an English approximation for convenience.
- **Say who and when.** "Photographed by [name], [year], [collection]" rather than "Historical photograph".
- **Active voice, sentence case.**
- **Acknowledge gaps.** "The maker of this piece is not recorded" is better writing than silence, and it is honest about the archive.
- **No marketing register.** Nothing is "stunning", "iconic", or "timeless". Describe what it is.
- **Empty and error states give direction**, in the interface's voice: "No records match these filters. Try widening the date range."

---

## Appendix — what to hand me to complete this

- Brand palette (hex values, and where the colours came from if that's known)
- Artwork and vector files
- A sample of the photography — enough to judge grade, resolution, and whether cut-outs are viable
- Typefaces, if already chosen
- The four answers in §1

With those, §3 gets real values and §4 gets specific to your actual material rather than generic to the category.

**Status, 2026-08-31 — all five delivered.** Palette, artwork, photography, typefaces and the
§1 answers are all in. §1 and §3 are filled, §4 is specific. The measured inventory is
[`ASSETS.md`](../ASSETS.md); the per-frame index is
[`brand/PHOTO-INDEX.md`](../brand/PHOTO-INDEX.md).

---

## OPEN QUESTIONS

Things this document could not resolve. Nothing here was guessed — each is a real gap or a
real contradiction found in the material.

### Cultural and consent

1. **Elder Advisory Group endorsement is not confirmed.** Use of cultural-site and story-wall
   imagery was cleared by Ivy on 2026-08-30, and the motion grade moved to `full` on
   2026-08-31 — but the endorsement behind both is still outstanding, and risk **R10** records
   that no approver is named because **D9** is unresolved.
2. **Leonard Mickelo's artist sign-off** on artwork motion remains outstanding.
3. **Attribution for the three paintings** in `brand/artwork/paintings/`. The Figma file
   records no artist and the filenames carry none. **Do not credit anyone until confirmed.**
4. **Consent for ~33 identifiable faces** across both batches, and **guardian consent for six
   identifiable children**. Our People's draft already flags that Rangers are unnamed and a
   full list with consent is needed.
5. **Whether the water holes in `March22-1908` are publishable** — a cultural site feature.
6. **Ochre marking protocol.** `March22-1584`, `1596` and `1717` show ochre applied to faces,
   including a child's. Whether that carries protocol is not something we can determine.

### Naming and voice

7. **The Iningai / Innigai spelling (R18).** Every draft and coded file says *Iningai*; Steve
   writes *Innigai*. One of them is wrong and it is the name of a nation.
8. **Yambangku or Yumbangku (D-pending).** The logo and the published research differ. The
   About draft flags it; the v3 homepage dropped the expansion entirely rather than choose.
9. **Whose "our" (D16 / CR10).** §1 Voice is written as "our" per Ivy's answer, but D16 is
   open and the note says "This needs Suzanne, not us." The drafts shift between the
   corporation and the community speaking, sometimes inside one paragraph.
10. **"The Record" vs "Resources".** Every v3 page calls the hub *The Record*; the repo and
    build documentation call it *Resources*, and the route is `/resources`.
11. **"Right-way fire" vs "fire-stick farming".** CR3 renamed it on Living Work; Truth and The
    Record still say right-way fire. D17 holds one exception.
12. **The 1902 count** — thirty-five or thirty-seven. Unresolved in the Truth draft itself.

### Palette and code

13. **`globals.css` and `kit.ts` ship three colours that are not in the brand palette** —
    `#d97804`, `#3f6b1f` "Olive Grove", `#c23d31` "Rust Red". All three live in the Figma
    collection named `_relume (legacy — do not bind)`; the brand values are `#cb7722`,
    `#5e7930`, `#af231c`. Not corrected here because it would restyle the live site. **This
    is a drift report, not a reopening of the palette decision, which is settled.**
14. **`:focus-visible` fails WCAG 1.4.11.** Yellow Ochre on Off-White is **2.30:1** against a
    3:1 floor for a non-text indicator. A real, shipped accessibility defect.
15. **Three type ramps disagree** — the bound Figma text styles, the `YACHATDAC Type`
    variables (56/48/40/32/24/20), and `globals.css`. The bound styles should win.
16. **Six colours inside the supplied artwork are off-palette**, including `#31afe3` in
    `glyph-b`. Recorded, deliberately not corrected.

### Missing assets

17. **No cut-outs with alpha exist**, so `TXT-06` occluded type and `AMB-03` are unavailable.
    §4 calls `TXT-06` the highest-impact effect on the site. One cut-out closes this.
18. **No stroked vectors exist**, so `ENT-08` cannot run on any artwork.
19. **No `public/noise.png`**, so `IMG-09` grain, `IMG-07` and `IMG-02` cannot run.
20. **No frame sequences, no 3D, no map vectors, no artefact / document / audio material.**
    Full list in [`ASSETS.md`](../ASSETS.md) §10.
21. ~~**Font licences unresolved**~~ — **resolved 2 Sep 2026.** Block Berthold is served
    under the Adobe Fonts web project `qqn2php`; Bantayog Sans is covered by a commercial
    licence key. See `public/fonts/README.md`, and R3 / R4 in `decisions-and-risks.md`.
22. **§5 "Collection index" still lists artefacts and documents** as browsable categories.
    §5 was out of scope for this pass and was deliberately left untouched, but it now
    references two content types that §4 no longer carries.
