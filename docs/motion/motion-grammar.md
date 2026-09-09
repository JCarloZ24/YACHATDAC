# The motion grammar

*Last updated: 9 September 2026*

*Decided 30 August 2026. The second artefact, and the one the code answers to.*

Parallax, dissolves and text effects are not the design. They are the alphabet. The design is
what each one **means**, used consistently enough that the reader learns it without being told.

> **The hard rule: every animation in the codebase must cite a row of this table.
> One that cites nothing is decoration — delete it.**

This table is not a description of the code. It is the code's source: each row names a
registered effect in `src/lib/motion/effects/`, and each effect's doc comment names its row
back. Adding a behaviour means adding it to a row here first.

**Ten rows, thirty effects.** The row count is what the brief caps and it should stay near
ten — a twentieth *role* is what this document exists to refuse. The effect count is free to
grow, because several effects can serve one role at different volumes. See Variants below.

---

| Narrative role | What it does on screen | Easing / duration | Sketch | Plate | Effect |
|---|---|---|---|---|---|
| **what endures** | A line rises from behind an edge and never exits. Masked at the line. | `country` · 0.82s · 0.09 stagger | B5 | — | `settle` |
| **what endures**, display cut | A short heading resolves character by character. Six words at most. | `country` · 0.82s · 0.028 stagger | B6 | — | `display` |
| **arriving quietly** | 16px and a fade, once, no re-trigger. The baseline for a quiet screen. | `country` · 0.55s · 0.06 stagger | X4 | P5 | `arrive` |
| **what radiates from a source** | Elements arrive in order of distance from a chosen origin, not DOM order, with seeded hand jitter. | `country` · 0.55s · 0.045/unit | L1 + L3 | P4 | `emanate` |
| **what radiates**, layout cut | Three arrival tiers — anchor, mid, detail — each with its own micro-stagger. | `country` · 0.55s · at 0 / .25 / .45 | L2 | P4 | `triad` |
| **the world opening** | A frame's clip opens while the image counter-scales. The Record uses a sandstone wall with separate openings for every inked area of one supplied handprint; the camera passes through a palm opening to approach distant image-card planes. Wonder's itinerary opens a native disclosure: its clip reveals held media, the chevron turns, and following rows settle into their measured positions. | `machine`, scrubbed; Record: 360vh; `disclose`: `country` · 0.55s, chevron `quiet` · 0.32s | M2 / SCR-11 | P3 | `frameOpen`, `handprintPortal`, `disclose` |
| **being drawn in** | A slow scrubbed push toward the subject. Transform-origin points at what matters. | `machine`, scrubbed | M1 | P2 | `pushIn` |
| **a change of ground** | The new ground sweeps over the old as a scaleY wipe. | `machine`, scrubbed | X7 lineage | P7 | `ground` |
| **time handing over** | Two stacked plates cross-dissolve. One whole frame hands to another. | `country` · 0.82s | A5 | **P9** | `dissolve` |
| **the guide leading the eye** | The traveller flies a leg; its trail draws behind by mask reveal. | `country` · 2.0s | G1 + G3 | — | `guide` ¹ |
| **a person speaking** | Words undim as they are spoken. No movement at all. Dim state 0.28. | `quiet` · 0.55s · 0.045 stagger | Y2 | P6 | `dim` |
| **accumulating** | Things add up: a count advances, a mark fills, an index lights. | `country` / `machine` | X3 | — | `stepCounter` `splitFlap` `vesselFill` `flattenReveal` |
| **the rest** | Nothing moves, for a stated duration. | — | brief §3 | **P1, P8** | `hold` |

¹ `guide` was specified and permitted but **not built**. Dropped on Ivy's call, 2026-08-30: the
traveller was a fix for flatness, and flatness was being fixed by density instead.

**Back in build, 31 Aug 2026 — About.** Density is the right fix for a page whose argument is
accumulation, and the wrong one for a page whose argument is a single question. On `05 · About`
the traveller and the page's thread are the same object: the question travels down the page and
settles at each thing it measures, so the Guide is carrying meaning rather than covering for
flatness. `G1` travel + trail draw-on, `G3` waypoint settle, `G4` hand-off at the seams;
traveller is the trail lead rosette. Every placement ▲ flagged for Leonard Mickelo.

**One row is proposed and not yet in the table above — `the page holding its ground`, 8 Sep
2026.** `/about` was built as a deck: a section is read to its end, the page stops, and the
reader charges the seam until the hand-off plays. That behaviour cites nothing here, which by
the hard rule makes it decoration until somebody decides otherwise. It is written up in full,
with the four deviations it carries and the questions only Ivy can answer, in
[`deck.md`](deck.md). The row lands in this table when it is signed off, or the behaviour comes
out.

## Variants — more effects, same rows

Ten rows, thirty effects. That is deliberate: a row is a **meaning**, and several effects
can serve one meaning at different volumes. This is how the vocabulary grows without the grammar
diluting — the brief caps the table at six to eight roles and it is right to.

| Row | Quiet | Loud |
|---|---|---|
| the world opening | `frameOpen` (in its frame) | `breakOut` (frame gone), `aperture` (through a letterform), `escape` (a grid cell becomes the screen, and comes back), `surface` (The Record's pre-rendered screen opens from its cell), `reflow` (a filtered collection rearranges) |
| being drawn in | `pushIn` (one plane); shared wheel inertia (`SCR-09`, `createSmoothScroll`) | `plateParallax` (layers inside one frame), `bleed` (past the edge) |
| a change of ground | `ground` (one sweep) | `groundRamp` (across four screens on Living Work §03), `waveHandoff`, `overlap`, `stickyIndex` |
| what endures | `settle` (lines) | `display` (chars), `ghostType` (behind everything), `knockout` (as a window) |
| what radiates | `arrive` | `emanate`, `triad`, `scatterResolve`, `mosaic`, `handoff` |
| the guide leading the eye | `routeDraw` (a drawn map surfaces out of short segments that start at seeded-random points and join until the whole shape stands — the D4 contour-map read — scrubbed across a sticky span; the line is the guide, there is no traveller. **Nothing synthetic is drawn:** these maps are filled ribbons, not stroked lines, so the segments are white strokes inside a MASK and what appears is the artist's own shape at the artist's own weight. Stroking a copy over the top was the first cut and it drew a doubled, bloated line that then had to fade out and hand over — the thickening-and-thinning the user reported on 9 Sep 2026. Wonder §02 and §04, `src/lib/motion/route-map.ts`), `brushFill` (a shape is coloured in: ONE continuous stroke entering at the top left and working down and up across it, never lifting, with the gap to the next stripe, the ends and the middle of every stripe all seeded-jittered so nothing in it is straight or evenly spaced — "imperfect, like a child colouring the area", 9 Sep 2026. Wonder §02) | `guide` |

`scrimRamp` belongs to no row on its own: X5 is a legibility requirement that travels with
whatever media effect it accompanies, and it is non-negotiable wherever copy sits on a picture.

**Wonder itinerary restoration — 9 September 2026, latest user direction.**
Figma `2033:5889` replaces the six-screen film with the canvas accordion, first
stop open. `arrive` introduces the heading and row furniture once. `disclose`
reveals or closes the panel by clip, fades its copy, turns the supplied chevron,
and translates following rows from their old positions after one layout change.
The photograph never scales or drifts. No pin, snap, timed opening or colour
ramp remains in this section. Reduced motion and no JavaScript use the same
native disclosures with immediate state changes. Desktop reference: 1440 × 900.

**Later scroll direction — 9 September 2026, supersedes the manual-only cut.**
The restored accordion now holds in a viewport at desktop sizes that can fit
its longest stop. Six 100vh reading spans advance the open stop automatically,
forward or backward. `itineraryStep` is a `disclose` variant in **the world
opening** row: one native layout change, then measured row translations so the
active heading always lands at the same viewport position. `stageArrival`
composes **what endures** (`settle`, whole lines), **arriving quietly** (`arrive`,
copy blocks) and **the world opening** (`frameOpen`, held photo clip). These are
the treatments reviewed in the live effects lab. No photograph scales or warps.
The heading enters on scroll, and each stop's text and picture enter when that
stop is reached. No wheel lock or velocity snap. Short viewports, mobile,
reduced motion and no JavaScript keep the ordinary document; motion-capable
mobile disclosures still reveal text and pictures. The held layout measures
CMS copy before enabling so no long stop is clipped.

`escape` is `handoff` made reversible. `handoff` reparents the element, which is right for a
one-way continuity cut and wrong for anything a reader can scroll back out of; `escape` flies a
clone and leaves the real cell in place at opacity 0, so the grid behind it never reflows and the
card returns to exactly where it was. Both are Flip, and neither may be scrubbed — Flip measures
at trigger time, so a scrubbed Flip computed at one viewport width lands wrong at another. Pin
for a screen, run on enter, reverse on leave-back.

**The Record opening — 8 September 2026, latest user direction.**
`handprintPortal` supersedes the static hero with one Three.js aperture scene
(360vh of scroll, transition channel). **Latest correction:** the user rejects
the repeated handprints and smooth silhouette. One supplied ink impression
defines the openings: black is empty, white remains sandstone, including the
palm's white centre and gaps between finger pads. The plain wall has a generated
photographic sandstone material and extruded cut edges in Three.js. Cards are
textured planes at different depths well behind the wall. The camera passes
through the hand, then approaches the cards. Whole card frames grow through
perspective; their image UVs remain fixed (no independent photo warp or drift).
Only camera transforms, projected link transforms and copy opacity change. The
opening reverses on scroll back. The user explicitly permits generated artwork
for this direction, replacing the earlier iconography restriction. The supplied
ink mask and generated stone are interface assets, not records of rock art.
Reduced motion, unavailable WebGL or missing assets use the static hero and
ordinary catalogue. A native skip link bypasses the scene at every position.

**Earlier static direction — 8 September 2026 (F7 exception).**
The route no longer mounts page or grid motion and has no animated headings,
hover effects, count fades or route transition. The `surface` and `reflow` work
below remains in source as an earlier design; it is not active on `/the-record`.
**Scroll-feel amendment, 8 September 2026:** user direction adds the shared
`SCR-09` Lenis scroller (`lerp: 0.12`, the Living Work settings) to this route.
This is the input behaviour for the "being drawn in" row above; it creates no
section timeline. Content stays still. Touch and reduced motion use native
scrolling, and the scroller is destroyed when the catalogue page unmounts.
See [the scene ledger](scenes.md#the-record--static-by-direction-8-september-2026).

**Earlier measured cut — 8 September 2026, F7/F8 motion refinement.** `surface`
uses the existing screen plate rather than a DOM clone. Its image counter-scale is the
reciprocal of the plate's **current** scale on each axis, so the picture stays undistorted
throughout the flight. The rectangular corner mask uses `clip-path`; copy arrives 0.15s
after the plate lands. No new artwork is drawn. The scroll-driven return requested on
5 September remains a local exception to the unscrubbed `escape` above: measure inside
the held frame, rebuild after resize while preserving progress, and keep clicks timed.
`reflow` measures cards by their stable content ids, transforms the new layout for 0.55s,
and fades incoming cards. React retains ownership of every node. Both cuts revert when
the grid changes, the route unmounts, or reduced motion is enabled.

## Compositions — the sentences

Effects are the vocabulary; **compositions** are how a screen is actually built. Lumen is not
dense because it has forty effects, it is dense because every screen runs three or four at once,
and the Living Work hi-fi's §02 proves the point: pin, aperture, figure cycling, progress rail,
break-out and a Flip handoff, all on one screen.

`src/lib/motion/compose.ts` makes that a named thing with a declared loud channel and a span in
vh, asserted in development. `src/lib/motion/recipes.ts` holds the seven built so far. A screen
that reaches for loud effects from two channels fails the build rather than shipping as noise.

---

## Why `hold` is a real row

The brief is explicit that *"a rest scene is a real scene, not padding"*, and heaviness only
reads as heavy next to stillness. An unnamed pause is indistinguishable from a section somebody
forgot to animate; a `hold` in a timeline is a decision any reviewer can read.

The kit had already worked this out independently — `P8 · CINEMATIC HOLD` and `P1 · full-bleed
hold` are drawn as plates in `KIT · Truth`. Naming the effect just lets the code say what the
design already said.

## Why `dissolve` is the one effect permitted on held material

Most of this vocabulary deforms an image: scrubs it, masks it, pushes into it, opens a frame
over it. A dissolve does none of that. It hands one whole frame to another, which is how film
has always moved between two records, and it is why `P9 · DISSOLVE PAIR` is a `frame`-grade
plate while `P3` is not.

## The corollary that governs faces and records

> **Portraits of real people hold still. The world moves around them.**

No parallax drift on a face, no hover-scale on an archival photograph, no ken-burns on a person
who did not consent to being animated. Motion applied to a person turns them into an asset.

The same shape governs cultural-site material — Marra Wonga, the engravings, the teaching wall.
Ivy's decision of 30 August 2026 is that these are **available and used**, at `frame` grade: the
plate, the ground, the scrim, the type and every neighbouring layer move at full cinematic
weight, and the image plane inside them holds. That is not a smaller ration. P1 and P8 are the
heaviest plates in the kit and both are frame plates.

The grade is enforced in `src/content/lofi/media.ts` and stamped on every tile as
`data-motion`, so a held photograph dropped into a scrubbing grid keeps its image still rather
than quietly inheriting whatever the component does.

## Bans, restated because they are grammar too

- ~~**No overshoot.**~~ **Lifted by F8 (31 Aug 2026).** `back`, `elastic` and `bounce` are
  allowed; the dev-mode guard in `effects/shared.ts` is a no-op. Character is a design choice.
- ~~The §6 excluded-techniques table~~ is retired by the same decision. Dissolve, chromatic
  split, velocity warp, character decode, image trail and duotone are available on depicted
  subjects. See `ART-DIRECTION.md` §6 and F9.
- **No count-up on figures of loss.** A number describing people who died or land taken is
  stated and held, never ticked upward like a sales metric.
- **Testimony is split by line or word, not by character.** Note what this is and is not:
  `ENT-07` decode is available everywhere under F9 — on headings, on names of organisations, on
  interface text. This one line is about a *content type*, not a technique. Anything a person
  actually said keeps its words intact as words.
- **No layout properties, ever.** Transform, opacity and `clip-path` only. Animating
  `width`/`height`/`top`/`left` is what makes an "immersive" site stutter, and one janky frame
  costs more reverence than any effect buys.
