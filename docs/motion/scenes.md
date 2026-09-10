# The scene ledger

*Last updated: 9 September 2026*

**Record asset reuse, 9 September 2026.** Decoded portal images are cached by
full URL for the browser session (LRU, at most 24 entries / 48 MiB decoded pixel
estimate). Concurrent requests share a promise; failed requests are removed
for retry. Mask samples use weak image keys. Generated carving and boomerang
wood canvases are reused. Every scene creates its own disposable GPU textures;
no renderer, scroll state or content response is persisted in this cache.

**Record return navigation, 9 September 2026 / SYS-02.** Once the first Record
load completes, the document retains a readiness flag across client navigation.
Returning from an article never shows the loader or applies its scroll/focus
lock again. CSS suppresses the returning cover before effects run. A full
browser reload starts a fresh loading cycle; the canvas still initializes.

**Record card interaction, 9 September 2026 / INT-05, NAV-02.** Hover and focus
lift an inner card wrapper 6px independently of the masonry transform; the
title underlines. Catalogue links use a native View Transition to reveal the
actual article in a 420ms expanding circle from the click (keyboard: card
centre). The persistent Record layout waits for the route commit before
revealing. Reduced motion, unsupported browsers and modified clicks retain
ordinary navigation. Article routes prefetch on visibility and pointer/focus intent. A 650ms cap releases stalled snapshots into ordinary navigation; the root snapshot does not resize or crossfade.

**Record closing object, 9 September 2026 / INT-04.** A Three.js boomerang
anchors the existing contribution CTA. Procedural rounded geometry and wood
texture are a generated visual interpretation of the user's reference, not a
scan or a cultural record. Drag or arrow keys rotate it, Home resets it. Subtle
pointer following has no continuous idle spin. Reduced motion uses immediate
input updates. Scene loads near the viewport and disposes on unmount.

**Document exit amendment, 9 September 2026 / SCR-16.** After horizontal travel,
hold for 40vh, then release the full-height shelf on cream. Once On Request's
top reaches 65% of the viewport, share a cream-to-charcoal ground change over
50vh, finishing at top 15%. Remove
the document entrance and exit waves. Reverse scroll restores the shared cream.

**Document shelf, 9 September 2026 / SCR-15.** The document shelf pins while
vertical scroll moves the track to its rightmost extent, then releases into
the next section. Its span is horizontal travel / viewport width × 100vh,
minimum 100vh. Arrow buttons seek within the same scroll span. Reduced motion
and short viewports retain the native shelf so all text stays accessible.

**Home painting text - 9 September 2026 (latest direction):** the painting finishes revealing at timeline 0.95. Then You are entering fades in at 1.08 over 0.50 units, Turraburra at 1.62 over 0.50, and the story line at 2.18 over 0.55. The complete copy holds until 3.03, clears, and the portal begins at 3.18. All later scenes move two units later without changing their pace. Reverse scroll retraces the sequence; reduced motion retains the static fallback. This supersedes the earlier overlapping text/reveal timing.


*Decided 30 August 2026. The third artefact — pacing, on paper, before it is pacing at 60fps.*

A film is not continuously intense, and heaviness only reads as heavy next to stillness. If
everything moves, nothing moves.

Read this top to bottom before building. **If it reads flat on paper it will read flat at
60fps** — and reading flat on paper is exactly what August was pointing at.

## How to read a row

```
# | act | what it says in one line | intensity 1-5 | vh | LOUD CHANNEL | plate | rest after?
```

The **loud channel** column is the one the brief does not have, and it is the one that makes
"too flat" a thing you can see. F7's pacing law: every screen declares ONE loud channel —
**media**, **type** or **transition** — and keeps the other two quiet.

Scan the column down a page. A column reading `type · type · type` is a flat page. Four `media`
in a row is a noisy one. Neither is a matter of opinion once it is written down.

## The rules this ledger is checked against

- **No more than two consecutive scenes at intensity 4–5.** Break a longer run with a rest
  scene, not by softening the heavy ones.
- **A rest scene is a real scene** — one line, one image, or one silence, held. It is where the
  previous scene lands. It cites the `hold` row of the grammar like anything else.
- **The heaviest scene gets the longest hold.** Weight is time, not volume.
- **No channel three times running.** If it happens, the middle one changes channel.

---

## Home — verb *opens* — 1775vh, 8 sections

9 September hero exit prototype: add 120vh of pinned scroll to the existing
canvas. `homeHeroDissolve` fades copy over the first 30% and photos/scrims over
40%. After everything disappears, the canvas ground changes from charcoal to
the existing oxide token over 45–80%, referencing the painting's red-orange
ground. The final 20% holds the colour before release
to Wonder. Reverse scroll restores the gallery. Reduced motion has no pin or
dissolve. Latest 9 September request adds the original red painting in the same
canvas: its white/gold marks reveal outward from the central rosette over 45–95%
of the scroll, starting with the red ground. The original painted ground follows.
The crop removes binding/surroundings only; no tracing, recolouring or upscaling.
Provenance: `public/artwork/painting-03-red-provenance.md`.
Latest asset replacement, 9 September: the user supplied
`public/media/home/painting.png` (1656 × 950). The existing canvas now uses a
lossless WebP derivative of this image with no sharpening. Reveal origin and
aspect ratio follow the replacement. This supersedes the earlier cropped photo;
see `public/media/home/README.md` for provenance.
Subsequent 9 September direction uses `public/artwork/paintings/red-radial-painting.svg` as the
active texture source. This is an SVG wrapper containing the raster image;
the same canvas and reveal remain, without a vector reconstruction.

9 September 2026: Home opts into shared SCR-09 wheel inertia (`lerp: 0.12`),
matching Living Work and The Record at the user's request for heavier scrolling.
Touch and reduced motion remain native; the loading cover prevents wheel input.

**Hero prototype — user direction, 8 September 2026.**

**Latest refinement — 9 September 2026:** 36 cards from 24 distinct supplied
photos now occupy a more strongly curved cylindrical gallery extending beyond
the viewport, following the latest reference. A tighter radius and wider angular
spread turn visible side plates further inward; slightly smaller plates and
greater vertical spacing open the gaps without moving the viewer backwards.
The centre faces forward; side plates turn along the cylinder without bending
the photo surfaces. Depth stays moderate and wider mouse travel reveals wing
cards. The stationary camera and uninterrupted three-second entrance remain.
Mouse exploration adds a restrained head-lean cue to the gallery: up to 2.9°
of roll, 2.6° of vertical tilt and 12.9° of horizontal turn, damped over 0.16s.
These transforms return to neutral at pointer exit; DOM text remains steady.
Latest 9 September POV correction supersedes gallery hover transforms and the
temporary gaze-facing plate rotation. The cylinder is centred on the stationary
eye at z=12. Each plate keeps its tangent orientation; mouse input turns the
camera up to 31.5° horizontally, 7.7° vertically, with up to 2.3° of head roll.
Only the entrance moves the gallery. Flatness when viewed directly and oblique
views when looking away now come from perspective, with no billboarding.
9 September header refinement: pointer tracking uses the hero's screen bounds,
including the fixed navigation overlay, so entering the header does not reset
the gaze. Exiting the hero bounds or browser viewport still restores it.
Photo plates were enlarged by approximately 14% over the previous POV pass,
then another 10% in the subsequent 9 September size refinement.
The previous distribution used the same 24 supplied
photos, including 12 small background instances sharing the same image bytes.
Large angled edge cards and small deep cards form the denser reference gallery.
The loader begins on black for 0.14s; its artwork then appears. After the loader,
another black beat precedes photos entering from outside the right edge. The
camera now stays fixed while the gallery moves into place around the viewer
over three continuous seconds with power2.out easing. This replaces the two-leg
camera journey whose intermediate stop felt awkward. Mouse exploration also
moves the gallery around the fixed viewpoint. The heading follows at 3.14s with a simultaneous 0.8s opacity fade, with no vertical movement or word stagger (latest 9 September direction). This replaces the initially requested fast 1.05s entrance and
the 3.2-second entrance below. Navigation is hidden only during the black beat;
mouse exploration and readable static fallbacks remain.
The 9 September edge-treatment reference adds a static, feathered dark blur
around the media perimeter (X5 media scrim). The centre stays clear and copy
renders above the blur; the three-second gallery motion is unchanged.
**Later interaction refinement, same date:** the five new reference images
supersede the 0.5-second straight approach below. Start far to the left, travel
through an oblique view for 1.1s and settle centrally over another 2.1s. The
heading appears after this 3.2-second journey. A fine mouse pointer then moves
the camera across and above/below the held photo planes, with 0.16s damping;
pointer exit eases home. There is no wheel capture, touch-scroll interception
or idle animation. Rendering sleeps when settled, offscreen or the tab is hidden.
Reduced motion remains a static collage. The camera safety timeout is 10s,
including preparation, the loader and the longer entrance.

Original composition reference:
(`Screenshot 2026-09-08 233541.png`) supersedes the road/sky composition currently
returned by Figma node `3371:41344`. Build a canvas photo collage on charcoal:
the one-second loader releases a distant view, the camera approaches for 0.5s,
then the draft's Reconnection headline reveals by word, with supporting copy
and Scroll following quietly. The loud channel is media during the approach;
the photographs rest while the type enters. There is no ambient loop or pin.
The screenshot's display size is a local `text-h1` override (40–80px); it does
not alter the site's shared heading scale or licensed font mapping.
Use existing supplied photography as a mid-fidelity selection; the screenshot's
fire images are represented by Country/work images until the final selection.
All photo UVs hold fixed, including portraits and cultural-site material.
Reduced motion, unavailable WebGL and JavaScript-off show the static collage
and readable copy. This hero is 100svh with a content-safe minimum height, no
added scroll span. `homepage-media.ts` records the source and grade per slot.

**Loading intro — user direction, 8 September 2026.** Before the homepage,
`homeLoader` reveals the supplied gold dot wave over charcoal with a quiet
0–100 percentage and a static, cropped dot ring at the left. Transition is the
loud channel. Total duration is one second from client initialisation, including
the fade out; this is deliberately timed prototype progress until real homepage
assets are wired. It runs on each homepage mount and adds no scroll span.
Reduced motion and JavaScript-off skip it; Escape or Tab dismiss it immediately.
A separate 1.5-second safety timer releases the cover if animation stalls.
This explicit request supersedes the old X1 real-progress-only loader note for
this prototype. Existing homepage sections are unchanged.

Built to `00 · Home — HI-FI · Desktop · the opening` (Figma `2381:7027`, 15974px = 1775vh),
which supersedes the lo-fi's 903vh / 7 sections. The lo-fi spans remain the copy and structure
contract in `docs/design/lofi-spec.md`; the spans below are what was drawn.

| # | Act | What it says | ⚡ | vh | Loud channel | Ground | Rest after? |
|---|---|---|---|---|---|---|---|
| 01 | I | Reconnection — Country is already here | 5 | 140 | **media** | full bleed, `1.3.1` | ✓ hold |
| 02 | I | Wonder — the oldest sunrise you will ever stand under | 4 | 260 | **media** | full bleed ⟡ stand-in | — |
| 03 | I | **THE DRAIN** — 1861 to 1902, and the photograph withdraws | 5 | 520 | **type** | one plate → bare charcoal | ✓ pinned 340 |
| 04 | I | Belonging — some of us never left | 4 | 240 | **media** | full bleed `1.74.2`, `frame` grade | — |
| 04b | — | **BREATH** — one photograph, no words | 1 | 60 | **none** | `1.14.1`, held | ✓✓ |
| 05 | V | The Invitation — three ways in, the first navigation offered | 3 | 200 | **transition** | bone; three `Card / Truth` | — |
| 06 | V | The Way Forward — the one ask | 2 | 220 | **type** | evergreen; four `Card / Story` | ✓ |
| 07 | — | Footer — custodianship, stated plainly | 1 | 135 | **none** | charcoal + artwork band | — |

**Reads as:** media · media · type · media · none · transition · type · none. No channel three
times running; the two consecutive `media` screens at 01 and 02 are the permitted maximum and 03
breaks them.

**§03 is the page's argument, made in the image channel.** One frame of Country — `1.28.1`, the
plain, no people and no cultural site — runs behind the whole 1861–1902 sequence and is never
replaced, only withdrawn. The scrim ramps, the ground walks evergreen → roasted → oxide →
charcoal, and by *"By 1902 there were thirty-seven of us left"* the plate is at zero: bare
charcoal, no artwork, the only screen on the page with nothing behind the words. The pin then
releases on a **different** frame at full weight. The device is withdrawal, not spectacle —
nothing depicts violence, and no photograph illustrates a massacre.

⚠ **The drain is an editorial device with a cultural reading and is for Suzanne / EAG sign-off.**
Recorded on the ledger board in the Figma notes lane, not only here.

**Where the withholding lives:** 01–04 carry no navigation at all (D24). That is Act I's whole
argument and it is structural, not a motion choice.

**Every card, glyph, wave and band on this page is an instance of the built kit**, not a
lookalike. §05 runs three `Card / Truth` (`2051:2728`) at native 362 × 574 — grounds evergreen /
charcoal / brown, glyphs circle / starburst / boomerang, with the coverflow entry drawn on its own
strip. §06 runs four `Card / Story — no image` (`2212:3122`) at 286 × 352; those four are
**detached**, because the component is 362 wide, four of those do not fit 1240, and instance
children refuse to resize. Their grounds alternate charcoal / brown — evergreen cards disappear
into §06's evergreen ground, which is why Living Work's equivalent section sits on bone.

**The artwork is ground, never furniture.** Rings run at 7–8% scaled 1.5–2.2× past native and
bleeding off an edge; `Dots / Trail` — the kit's own *homepage meander* — at 9% across §05;
`Dots / Wave` at 9% on §06 only, since its spec calls it the footer band; `Dots / Rule` used whole.
Opacity is driven from **one level only**: `Artwork / Ring A/B` bake 8% onto their inner vector, and
setting instance opacity as well is what renders Living Work's background rings at 0.68%.

**Two `Wave / Divider` hand-offs, not four.** Both `flip=down`, 1442 × 151 at `x = -1`, seated at
`sectionHeight − 105` so they overhang the join by 46px — the technique measured off every built
instance in Truth and Living Work. §03 → §04 takes no wave because the returning photograph is the
transition; §04b takes none because a divider through a 60vh held photograph contradicts the hold;
§06 takes none because the shared footer already carries its own Burnt Ochre wave.

## Truth — verb *descends* — 2229vh, 21 sections

The descent proper. Scroll advances time here; the rail is the chronology.

Spans below are measured off the built hi-fi (`02 · Truth — HI-FI · Desktop · the descent`,
Figma `2051:4176` at x=0, 1440 × 20,064px = 2229vh). A full-cinema ALT was proposed beside it at
x=16200 on 30 Aug 2026 and **was not approved**; it and its strips have been removed. This page is
the build target.

| # | Act | What it says | ⚡ | vh | Loud channel | Plate | Rest after? |
|---|---|---|---|---|---|---|---|
| 01 | II | Intro — the opening shot, and the door from Home | 4 | 117 | **media** | plate · wide | — |
| 02 | II | Ahead — the Cultural Knowledge Precinct | 3 | 120 | **type** | diptych | — |
| 03 | II | Partnerships — a guest on Country | 2 | 62 | **type** | `Card / Truth` | — |
| 04 | II | TODAY — the fire comes toward you | 5 | 100 | **media** | plate · wide | ✓ hold |
| 05 | II | TODAY montage — the work going on | 3 | 114 | **media** | field of four | — |
| 06 | II | 2022 — the site studied with its owners. Nothing moves here | 1 | 84 | **none** | — | ✓ |
| 07 | II | Research & discovery — a strip pulled across | 2 | 72 | **type** | evidence strip A | — |
| 08 | II | BREAK · Country now — you never see the join | 4 | 100 | **transition** | dissolve pair | ✓ |
| 09 | II | 2026 — the deed of grant | 4 | 116 | **media** | plate | — |
| 10 | II | 2020 — the name goes back | 3 | 104 | **transition** | diptych | — |
| 11 | II | 2019 — this beat is private | 2 | 107 | **type** | diptych | ✓ |
| 12 | II | **2003 — Suzanne's father. The portrait is held** | **5** | 116 | **media** | portrait 460×613 | ✓✓ hold |
| 13 | II | 1950s — the light goes out | 3 | 123 | **transition** | ⟡ held doc slot | — |
| 14 | II | BREAK · The escarpment — the film goes cold | 5 | 100 | **media** | dissolve pair | ✓ hold |
| 15 | **III** | **THE HARD STOP — three held screens: who is speaking · the count · her testimony** | **1** | **3 × 125** | **none** | — | ✓✓ the longest hold on the site |
| 16 | IV | 1840s — what Mitchell recorded | 3 | 135 | **type** | ⟡ held journal scan | — |
| 17 | IV | Older than the record — the engraving wall | 2 | 69 | **none** | — | ✓ |
| 18 | IV | Still to be found — open research | 2 | 72 | **type** | evidence strip B | — |
| 19 | IV | About 100 million years ago — the Eromanga Sea | 3 | 161 | **transition** | strata stack | — |
| 20 | IV | Underneath all of it — the descent ends, looking up | 1 | 129 | **none** | one held closing shot | ✓✓ |
| 21 | — | Footer — the wave overlaps the last shot by 96px | 1 | 135 | — | — | — |

**Reads as:** no channel runs three deep. §10 carries the brown wave hand-off and is therefore
`transition`, which is what breaks the 09/10/11 run. §20 joins §06, §15 and §17 as intentional
stillness; the closing shot does not dissolve back to the hero.

**The rail carries the chronology and the local reading state.** One frame (`2051:5368`) runs
the full 2229vh, starting below the header and **breaking at the count**. Both strands are
instanced from Leonard Mickelo's supplied meander — never redrawn, never chopped, never tiled.
A **gold mask whose height is document scroll** travels over artwork that is itself static. One
`trail-point` traveller separately reports the current beat. The hero starts below its "Start
from the beginning" cue; subsequent beats run from the viewport top to its foot. The marker is
held at the foot while the 20vh buffer charges. During the cover it transfers from the outgoing
foot to the incoming head while continuing to sample the rendered guide's lateral wander and
tangent; it never teleports between endpoints. It has no numeric or attached progress UI. The
visible strand goes under at the escarpment and the traveller shares that silence: the 1950s read
ScrollTrigger fades it over its final fifth, it remains absent through the escarpment and count,
and the 1840s read ScrollTrigger restores it over its opening fifth. It fades permanently over the
final fifth of Before people, before the closing Wattanuri floor. Under reduced motion the
traveller is absent. This is G1,
**the guide leading the eye**, and `the page holding its ground`, not a timeline mark per era.

**THE GROUND NO LONGER FALLS — one egg white, 9 September 2026 (client direction, D26).**
`/truth` renders on a single ground, Off-White `#f6f6ec`, the same one /about uses. Two
exceptions carry what is left of the descent: **the hard stop keeps its charcoal**, and **the
1950s band travels** from the egg white down to that charcoal as it is read, so the reader
arrives at the count already in the dark. The 1950s is now the only ground on the site that
moves.

What that costs is worth keeping written down. Truth has no dated photographs, so chronology had
exactly two carriers — type and ground colour — and it now has one. **Rust Red is still spent
once**, on the count, but it now reads as the only red *because* it lands on the only dark
ground; the count's charcoal is load-bearing in a way it was not before.

The five wave hand-offs become **four**. A divider is filled with the colour of the section it
introduces, so between two sections of the same colour it has nothing to carry — the seam at the
foot of "Older than the record" is dropped, exactly as /about drops its charcoal-to-charcoal
seam ("nothing carries; that is the point"). The four that survive each still cross a real
change: over the hero photograph, over the TODAY plate, off the foot of the Country-now break,
and into and back out of the count. Each is still seated at `sectionHeight − 105` so the 151px
wave overhangs the join by 46px.

**Each is seated on the section it INTRODUCES.** The hand-off out of the count was the one
exception and it was a bug, corrected 9 September 2026: it sat in flow at the count's own foot,
riding the escarpment slide's track, so it stopped when that track stopped and the 1840s covered
it instead of carrying it. It now leads the 1840s article — the element the deck actually moves —
and breaks the reading column's width with the same `calc(50% - 50vw)` escape the pinned slide's
ground uses. The trail rail's restart anchor (`data-count-wave`) moved with it, and is now
measured through `offsetTop` rather than a viewport rect, so a mid-scroll re-measure can no longer
read it off a pinned, translated surface.

*Superseded, kept for the record:* each section used to own its own solid colour and the
supplied divider carried it down the ladder — evergreen *living present* → roasted brown *the
return* → charcoal → navy *before the record* → charcoal *deep time* — with Marc's
`Wave / Divider` as the visible seam at five hand-offs: evergreen after §01, brown after §09,
charcoal after §14, navy after §15, charcoal after §18. `DESCENT_LADDER` in `kit.ts` still holds
that order and still governs every other page.

site.

The hero→Ahead divider is seated on the incoming Ahead deck, never on the hero runway. Its root
remains structural while the reusable About ink pulls from 0.6 to full height and rolls home over
the final 20vh of the hero ScrollTrigger. It is already complete when the buffer begins, so buffer
charge cannot detach or distort the crest.

**Every active entrance is scroll-scrubbed and reversible, AGAINST ITS OWN SECTION'S READING
SPAN** (9 September 2026). B5 headings retain their line masks; Truth-local M1 entries use
`brighten` from 0.4 to 1 with no translation. Ordinary movable image planes push from 1 to 1.06.

The span is the correction. While the deck pins every slide, a viewport-relative trigger inside
one measures a journey that does not happen: the slide is fixed, so a `top 88%` span is spent
while the section is still climbing BEHIND the slide covering it. Every entrance was completing
off-screen, and then nothing moved for the 125vh the section was actually read — which is why the
page read as though its choreography were missing when all of it was firing. Interior beats are
now authored as fractions of `read.start`→`read.end`, handed out by the deck through
`onSlideSpans` (`SCR-02`, `src/lib/motion/truth-scenes.ts`). The unpinned path — touch, under
1024px, no Lenis — keeps the viewport triggers, which are correct exactly there.

What each beat does with its span:

| Scene | Interior beat |
|---|---|
| 01 | The hero photograph **breathes**: 1.04 → 1.00 across its read AND its cover. ⚠ This SUPERSEDES "the hero … held at its rendered state" — user direction, 9 September 2026, "breathes rather than sits still". Its copy is still held; only the photograph moves, and the 20vh runway still exists to clear the navbar rather than to be read. |
| 02–03 | The two Ahead records arrive as a set, 0.30 of the span apart, **brightness only** — M1 is explicit that an entrance here does not travel, and the descent supplies the movement. The **lift is the hover**: the card rises 4px and the picture scales 1.03 inside a frame that does not move. Their photographs take no scroll push — §02/§03 are type-channel scenes, and a plane cannot carry both a GSAP push and a CSS hover, because the inline transform wins and the hover silently never appears. ⚠ The frame draws three cards, L/M/R; the draft carries two. Raised, not invented. |
| 05, 18 | Montages laid down by hand — uneven fixed offsets, never a single stagger. |
| 07 | The strip pulls across L→R (~.012 apart), then drifts 40px left over the remainder. |
| 08, 14 | The breaks **pull back**, 1.06 → 1.00, where ordinary media pushes in. The page has already stopped; advancing the camera into a held image while the scroll is locked reads as impatience. |
| 12 | Words undim at speaking pace; the attribution is held to .78 of the span, so the speaker is named only after the last word lands. The portrait is **held**, per this ledger's own "the portrait is held" — it previously took the default push, which is the ordinary-media treatment and this is not ordinary media. |
| 13 | The ground **deteriorates** — and since D26 it does so by changing colour, not by dimming: the band walks Off-White → Charcoal across its read span, through the slide's own `::before` painter. Straight, with no intermediate stop (user direction). A version routed via Roasted Brown was built and rejected — it measured better, 5.89:1 worst against 3.47:1, but the brown read as a third ground appearing halfway down. An alpha wash was right over roasted brown and reads as grey over egg white, a bruise rather than a dusk. The ink steps with it at the crossover (charcoal → off-white), and the warm accent is dropped in this band because no warm in the palette clears the middle — the colour drains out of the labels as the light goes out. The ramp is LINEAR — an eased version was built and rejected: it held the ground still for the first third of the section and then lurched, which reads as broken rather than eased, and `machine` is the token rule for scrubbed media anyway. Measured 17.83:1 at both ends and 4.67:1 at its worst, so the band clears AA the whole way down. The photograph still takes no push. |
| 19 | The seabed **builds downward**, top → middle → bottom: the one section that accumulates in the same direction as the scroll. |
| 21 | Footer links fade up once, together, no stagger. |

Scenes 06, 15, 17 and 20 and Suzanne's portrait are held at their rendered state. They carry
`data-v2-static` in the markup rather than being listed in a motion module: 06 and 15 both ride
inside slides that DO move, so a slide-level exclusion would be wrong in both directions at once.

**The twenty story beats resolve into sixteen gated decks on desktop/fine-pointer input** (user
direction, 9 September 2026). "What is being built" and "Work with us" share the Ahead deck;
TODAY's full image and its Iningai Rangers record share a composed deck; "The site is studied with
its owners" and "Research & discovery" share another; and the escarpment image and 1902 count
share a fourth. Each pair is one viewport surface with one internal content track and one gate,
rather than two stacked slides. TODAY repeats About's
Breath → WhatWeDo cover: the original evergreen record and its attached divider rise from below
over the image, scrim and heading as one underlay. The heading's foot begins against the wave and
follows it one-for-one until the heading crown reaches the viewport crown; the heading clamps
there without resize or reflow while the higher-z wave covers it. The record receives no
second translation. The escarpment/count deck repeats the same cover without moving the
frame-graded image plane: its charcoal ground and divider rise on the internal track and close
the image window. Every short deck remains one visible viewport
high. The hero's wrapper adds a
short 20vh ScrollTrigger-owned pin span: its image and copy remain still while the independent
site navbar clears. Every later deck uses a normalized 125vh pin span before its magnetic 100%
mark, so short and tall records share one heavy scroll pace without padding the authored records.
The fifteen content joins play as whole 0.9s covers only after the
buffer commits. The footer join is ordinary flow. Touch, missing Lenis and reduced motion create
no holds or pins. The complete hero is visible on first paint.

**Scene 06 is deliberately intensity 1.** The Figma note on that beat says it in as many words —
*"the page stops moving here, on purpose."* Story-wall material is withheld under F3.

**Scene 15 is the turn** (`spine.md` §5). Suzanne's testimony, under **R5**, no photograph.

⚠ **Rewritten 10 September 2026.** Two things this row used to say are no longer true. Her words
ARE now reproduced — the band was unheld on 9 Sep (August) as a build gate only; the publish gate
is still R5 and `held by community`. And it is no longer one beat: it is **three gated screens** —
who is speaking, the count, her testimony — split at the joins the copy already had, because as a
single 2,989px panel the count was something the reader scrolled past on the way somewhere else.

**The count screen itself still does not move.** No arrival, no count-up, no glow: the numerals
are simply there, at the top of the type scale and no further (`text-h1`, 56 desktop — they were
built at 128px, which is off the scale entirely). The screens either side of it take the page's
ordinary M1, and that is exactly why this one must not: stillness only reads as stillness next to
something that moved. Her quotations undim on the third screen and nothing else there moves — and
they undim **against the reading line, not against scroll progress**. Mapping a
word's undim to how far through a section the reader has scrolled means the
front races the text: measured on this beat, the boundary between read and
unread sat between 35px and 190px down a 900px viewport for the whole section,
so the reader would have been reading at the very top edge, chasing it. Padding
cannot fix it — top padding lengthens the panel, which lengthens the track's
travel, which pulls the front back up; 25vh of it moved the boundary about ten
pixels. Each word now undims over a short band as it passes ~62% of the
viewport, the same reading line the rail lights its pointer on, which puts the
boundary at 430–520px and is immune to content height.

Her testimony is set in the READING face, not the display one — `PullQuote`'s new `voice`
variant. Setting a transcript in the same face as the section titles is a large part of why a bare
quote "reads as our copy — it isn't" (Steve, 7 September 2026). It participates in the same legible gated hold as
the other beats without gaining content animation. Under `prefers-reduced-motion` the lock is
**not created** and it degrades to a full-viewport band the reader scrolls through normally.

**Scene 17 carries no photograph as built.** That was originally a hard constraint — every
engraving frame in its pool was ⛔R10 quarantined — and it is **no longer.** Ivy released
story-wall and cultural-site imagery at `frame` grade on 30 Aug 2026 (`permissions.md`), so the
screen *may* now carry a held frame with its story in words. Until that photo pass happens the
screen stands as built: carried by type, coda at 40px, on bare navy.

## Living Work — verb *accumulates* — ~1607vh, 9 sections

Built to `03 · Living Work · HI-FI · the field notebook` (Figma 2137:2613, 18407px ≈ 2045vh).
Spans below are the built ones; the hi-fi's extra height is content that has not been cut down
yet, and the two should be reconciled before this page is signed off.

| # | Act | What it says | ⚡ | vh | Loud channel | Plate | Rest after? |
|---|---|---|---|---|---|---|---|
| 01 | V | Field notes from Turraburra — the country being brought back | 5 | 100 | **media** | P1 | — |
| 02 | V | **THE APERTURE** — the 0 is a portal onto the plain | 5 | 300 | **type** | — | ✓ pinned |
| 03 | V | Our challenges — the ground thins under you as you read | 3 | 330 | **transition** | — | — |
| 04 | V | Iningai Rangers — the human centre, on dark ground | 4 | 100 | **media** | P1 | ✓ |
| 05 | V | **THE SPRING** — eight days, counted | 5 | 150 | **media** | P8 | ✓ pinned, snapped |
| 06 | V | The work — seven streams | 3 | 360 | **media** | P5 | — |
| 07 | V | Infrastructure — what it takes, met two at a time | 2 | 160 | **none** | — | — |
| 07b | V | **BREATH** — held, no caption | 1 | 47 | **none** | P8 | ✓✓ |
| 08 | V | What the work produces — five vessels, four filling | 2 | 120 | **none** | — | — |
| 09 | V | Get involved — three paths | 2 | 100 | **type** | — | — |

**Reads as:** media · type · transition · media · media · media · none · none ·
none · type.

⚠ **Corrected 8 Sep 2026 — §07 was missing from this ledger.** The page has
built ten sections since the hi-fi; this table listed nine, and §06's row was
carrying §07's phrase ("and what it takes") as if the two had been merged. They
are separate: §07 Infrastructure ships as `whatItTakes` at 160vh, `channel:
"none"`, sticky index and no pin.

It does **not** relieve the §04/§05/§06 media run flagged below — it sits after
it. What it changes is the back half: §07, §07b and §08 are now three
consecutive `none` screens before §09 picks up `type`. That is not a
channel-three-deep violation, because `none` is the absence of a loud channel
rather than a fourth one, but it is 327vh of quiet in a row and should be read
as one stretch rather than as three separate rests.

⚠ **§04, §05 and §06 are three `media` screens running.** That breaks the no-channel-three-deep
rule. It is survivable because §05 pins and snaps — a pinned counter reads as its own kind of
screen rather than as a third helping of the same one — but it is the weakest stretch of the
page and the first thing to fix if the page reads noisy. The honest fix is to move §06 to
**transition** and let the sticky index carry it, since the streams' images are already
inheriting the bleed from §04.

**The 5s:** §01 and §02 are consecutive, which is the permitted maximum of two, and §03 drops to
3 immediately. §05 is the third 5 and sits well clear of them.

**§07b BREATH is the page's hinge** and the reason §06 and §08 both land. 47vh of one
photograph, no caption, nothing moving. The composition declares `channel: "none"` and the
build fails if anything loud is added to it — the only screen on the site where stillness is
enforced by the compiler rather than by discipline.

## The Record — handprint opening, 8 September 2026

**Question panels amendment, 9 September 2026.** `recordQuestionAttach` / SCR-14
brings each panel up 12vh from a translucent, slightly tilted position into its
adjoining layout. Each entrance scrubs from top at 95% to top at 25% with 0.8s
catch-up (slowed at user request), then holds
still for reading. Alternate tilts vary by panel; reverse scrolling detaches them.
Reduced motion leaves all panels fully visible and aligned.

**Question ground amendment, 9 September 2026.** `recordKnowledgeGround` / SCR-13 starts
both the catalogue and question section on cream, then changes both grounds and
their waves together to midnight blue over 70vh at the beginning of the questions
(question section top at 85% to top at 15%). Text changes from charcoal
to cream alongside it. Blue holds during the questions; reverse scroll restores
cream and reduced motion retains the original cream catalogue and blue questions. No pin is added.

**Masonry motion amendment, 9 September 2026.** `recordMasonryPass` / SCR-12
gives the four actual CSS columns 6/14/9/18vh of opposing start/end drift as
each card crosses the viewport. Entire cards move, preserving photo UVs and
icons. Each card fades according to its actual viewport overlap, including
its current scroll translation, with varied entry/exit distances of 17–32vh.
Entry starts 12vh inside the bottom edge; exit finishes 14vh before the top
edge, per the user's timing correction. Cards are fully visible between the
fade bands. Scroll reversal retraces it; mobile uses fade only, reduced
motion remains still, and keyboard-focused cards stay fully opaque.

**Wave handoff, 9 September 2026.** The user replaces the colour fade with the
shared cream WaveDivider used on About, above Research and Discovery. The
hero background and fog remain charcoal throughout the photo journey.
The follow-up animates the divider like About: its ink swells from 60% to
full height and rolls from -15% of WAVE_ROLL to zero over the 100vh entrance,
with 0.3s scrub smoothing. Reverse scroll retraces it; reduced motion keeps
the full static crest. No additional pin or scroll gate is introduced.

**Catalogue layout amendment, 9 September 2026.** User reference replaces the
sidebar and boxed cards with full-width masonry on the original cream ground
(restored by the user's follow-up): four desktop
columns, one mobile column, varied image proportions and bare title/source
captions. No filter, sort or search UI remains. Incoming filter URLs still
resolve with a clear link. Photos retain their native article links and static
image planes. The user's follow-up retains the original rotating set of glyph
icons over the photos; card backgrounds and summaries remain removed.

**Photo lens amendment, 9 September 2026.** User direction applies the Home
painting zoom's radial lens envelope to the Record photo journey. Subdivided
photo planes bow toward the viewport edges during the approach and receive a
small perspective tilt; central images remain comparatively flat. The lens
returns to neutral at the endpoints and reverses with scroll. This is a viewer
projection effect: the original photo UVs, crops and staggered depths stay fixed.

**Question artwork amendment, 9 September 2026.** The user requests movement
in the two background ring patterns behind “What we do not know”.
The latest correction makes `recordPatternDrift` (AMB-04) follow cursor position:
opposing 30px / 46px drift and 3.5° / 5° tilt, with power3.out smoothing over
0.8s horizontally and 1.05s vertically for a softer trailing response. Leaving the
section returns both rings to centre. Touch and reduced motion retain still artwork.
Questions, numbering and
the CTA remain in ordinary flow. This supersedes the static-artwork direction
below for these two instances only; their original opacity is preserved.

**Latest user direction, 8 September 2026.** Build the wall and handprints in
Three.js on a single canvas, with a real hand-shaped hole in the wall geometry.
The user rejects the earlier photographic wall and fixed screen-space cards.
Cards now sit on textured planes at different depths far behind the wall.
Scrolling crosses the opening, then approaches the cards so they come forward.
This supersedes the static intro below; the catalogue and later sections retain
their existing behaviour.

| # | What it says | Intensity | Scroll span | Loud channel | Effect | Rest after? |
|---|---|---|---|---|---|---|
| 01 | Through the wall and past the pictures into the record | 4 | 200vh | transition | `handprintPortal` · SCR-11 | at the catalogue |
| 02 | Everything in the record | 1 | natural flow | none | `hold` | yes |

One lazy-loaded Three.js renderer, rendered only when scroll or size changes.
A server-rendered loading cover uses the homepage's supplied gold wave and
ring (SYS-02 / `recordLoader`, user direction 9 September 2026). Its percentage
tracks settled portal resources and the first three catalogue photographs;
completion waits for texture upload, shader compilation and the first submitted
canvas frame. Scrolling and underlying page focus are locked until the cover
exits. Missing canvas photos are omitted, and failed catalogue photographs
retain their tonal ground. WebGL/chunk failure or a 20-second startup timeout
reveals the static fallback and cancels pending scene activation. Escape/Tab
also bypass to the fallback. Reduced motion and no JavaScript skip the cover;
navigation restores scroll/focus and disposes only this loader's resources.
The camera crosses one of the separate palm openings in the supplied ink print.
Every black region is an opening; white remains wall. The user's latest
8 September 2026 refinement uses 0.65-unit stone depth for the connected palm
opening the camera enters and a 0.36-unit rim on the finger pads, thumb and
other openings (twice their original 0.18 depth). Pictures approach immediately
as the camera moves through the palm. A procedural red-ochre halo surrounds the central handprint. The latest
8 September 2026 user direction adds surrounding pigment-only hand stencils,
using eight distinct finger/palm shapes from the user's reference sheet,
upright and almost the same size as the central hand after the latest user
correction on 8 September 2026. Heights vary by roughly 4%, with no added
rotation; handedness, shape and weathering still differ. All impressions have broad,
mottled pigment deposits spreading into the surrounding rock, following the
user's refinement beyond narrow outlines. Their interiors remain solid
stone; only the central hand has apertures. The wall uses a generated photographic
sandstone material, recorded in `public/artwork/record-portal-provenance.md`.
Nine photo planes start at staggered depths and advance at different speeds from the
first scroll input, retaining fixed image UVs. The 9 September 2026 refinement
adds five supplied catalogue photos, then removes the central grass-and-sunset
preview while preserving the other slots. It places the leftmost original farther
back and closer to the centre for a longer, more noticeable approach. They continue outward beyond the
screen edges and fade near the camera rather than stopping at a common gallery.
The pictures render only in the canvas, without captions or moving hit areas;
article links remain in the catalogue. Latest user correction on 8 September
2026 front-loads picture travel for a much faster response to the first scroll.
Side frames extend beyond the screen; upper frames remain visible for the
closing fade. At 50% progress the remaining pictures start fading, while the
catalogue rises over the final viewport of the 200vh hero through a native-flow
overlap. Scrolling backwards restores the pictures and wall. Reduced motion
removes both the extended hero scroll span and the catalogue overlap.
The user explicitly permits generated artwork on this date. No supplied
photograph, painting or logo is re-authored. Native skip link,
mobile composition, live reduced-motion teardown, missing-asset fallback and
WebGL failure/context-loss fallback are part of this scene. The 200vh span is
absent when enhancement is unavailable. SCR-09 wheel inertia stays enabled.
Layout follows the user's wall and zoom-through direction for this
intro rather than the earlier Figma intro frame; D5 still governs its words.

### Earlier static direction — intro superseded

**Earlier build — F7 exception, user direction on 8 September 2026.** All
animations on `/the-record` are removed: route transition, heading and section
reveals, hero pushes and scrim ramps, card flights and held rows, filter reflows,
count fades, the travelling rail marker, gap dimming and hover motion. Cards
render in ordinary flow and link directly to their entries. All four gaps and
their details stay visible. The filter rail retains native CSS sticky positioning;
search, type/source/tag filters, sorting, counts and the empty-state link still work.
Media assignments and copy are unchanged. The earlier motion module and effect
work is retained in source, but this route no longer imports or registers it.

**Scroll-feel amendment, 8 September 2026 — user direction.** The catalogue
now mounts the shared `SCR-09` Lenis scroller with Living Work's existing
`lerp: 0.12` settings. Wheel scrolling eases into position while the content
remains static. Touch and reduced motion stay native. The filter rail keeps
its own native scrolling, and leaving the catalogue destroys its scroller.

### Earlier motion design — superseded for this route

**Earlier motion refinement, 8 September 2026 — F7/F8.** That build held card rows
with CSS sticky and keeps deck snapping and the gaps pin disabled, per the 4–5 September
requests recorded in `record-flags.ts` and the motion module. These settings supersede
the original pin totals below. `surface` preserves image proportions through the complete
card flight; words follow the landed plate. Filtering rebuilds the grid's motion, including
when returning to all entries, and uses the registered `reflow` effect. The hero's entry
settle and scroll push have separate planes. In the unpinned gaps section each question
lights at its own reading position and remains readable after passing; only the current
question carries the marker. Reduced motion restores every question immediately and
removes flight styles and pending callbacks. No copy or artwork assignments change.
The media audit found that the retired lo-fi bucket table grants `full` to cultural
material despite this page's documented `frame` grades. `record-media.ts` now carries
explicit per-slot grades, including held images of people; both card hovers and full-screen
views read them. The shared lo-fi table is unchanged.

Built to `04 · The Record — HI-FI · Desktop · the record surfaces` (Figma `2463:8492` at x=0,
1440 x 14,612px). The frame is 1,624vh; the scroll span is ~2,050vh because §02's three breakouts
pin 100vh each (+300) and §03 pins 300vh against 174vh drawn (+126) — the same convention as
Living Work §02 and §05, where the frame height is the composition and the span is the scroll.

The only catalogue page on the site: thirteen entries, eleven documents, a gaps section and a
subscribe block. Under F7 that makes it a CMS surface, which gets the full standard kit as a
bounded set an editor cannot break.

**Revised 30 Aug 2026 on Ivy's review.** Two sections were removed. The filter deck categorised
the entries a second time — TYPE appeared as pills there and again as the sticky index beside the
grid — so the controls moved into the rail and the deck went. The empty state was a dead 50vh
screen; it now lives on the filter strip, inside the sequence that produces it, with D25's link
intact. The back half of the page darkens.

**Two axes, two channels.** D21 settled that the source axis is *"an epistemology, not a format —
who says so"*. The page gives each axis its own channel and never explains either in words:

- **TYPE is position** — the sticky rail in the left lane. Stories 5 · Historical accounts 3 ·
  Research 2 · Documentation 2 · Recordings 1, summing to the thirteen the count reports. If those
  two ever disagree the page is lying about its own contents.
- **SOURCE is colour** — the card ground. Iningai knowledge `#22372b` · Colonial record `#4e3524`
  · Published research `#122449`. The rail's SOURCE keys are the legend and the control at once.

| # | Section | ⚡ | vh | Loud channel | Plate | Rest after? |
|---|---|---|---|---|---|---|
| 01 | Intro — what is known about this Country | 4 | 100 | **media** | full bleed | — |
| 02 | **The grid — the rail is the filter, three breakouts** | **5** | 738 | **media** | 3 x full bleed | — |
| 03 | **What we do not know — the page's one pin** | **5** | 174 → 300 pinned | **type** | navy ground | ✓✓ |
| 04 | Documents — the draft's own list, 4 downloadable | 3 | 229 | **type** | — | — |
| 05 | Items marked "on request" — held, dark run begins | 2 | 78 | **none** | — | ✓✓ |
| 06 | The record grows — dark run ends | 4 | 170 | **media** | full bleed band | — |
| 07 | Footer | 1 | 135 | — | — | — |

**Reads as:** `media · media · type · type · none · media · —`. No channel three deep. The two 5s
now sit next to each other because the empty state that separated them is gone, but §03 is
type-quiet against §02's media, so the pair reads as a change of register rather than two loud
screens in a row. §05 is the rest before §06's closing media beat.

**§02 is the signature.** 738vh, and the section Ivy asked for: a sticky presentation scroll that
is still a working catalogue. The rail is **sticky, not pinned** — a pin would take the scroll
away from someone browsing, which is exactly wrong for a CMS surface.

Two signals share the rail's column and must never be confused. **Weight is selection** and
changes only when a row is pressed; the **ochre tick is position**, scroll-driven and read-only.
That separation is what lets one column carry a filter and an index without either lying.

Three entries break out of the grid and take the screen, one per source, and come back. Two are
photographs; card 12 has no photograph in the draft, so it takes the screen as **type** on navy
with the 480-metre bore drawn to scale and the pollen marked at sixty. That is the page's verb at
its most literal.

The breakout is **`escape`** — `handoff` made reversible. It flies a clone and leaves the real
cell at opacity 0, so the grid never reflows and the card returns to exactly where it was. Pinned
100vh, `country` 0.9s on enter, reversed on leave-back. **Never scrubbed:** Flip measures at
trigger time. The revision needed no new effect beyond it.

**§03 is the emotional centre**, and it is the page's second ground change. It sits on **navy
`#122449`** — the same ground the rail gives published research — with `Artwork / Ring B` bleeding
right at 15% and `Artwork / Ring A` bleeding bottom-left at 13%, both static instances of the
supplied components. The section that names the open questions and hands off to *research with us*
is the one section carrying the research ground, so the colour is an argument rather than a
decoration. It stays type-quiet inside that ground: no media, no plate, one pin. §02 has just spent
738vh on photographs and three full-bleed screens; if the section where the archive admits its own
edges were loud in a second channel too, the admission would read as another feature. X3 pinned
step-through, snap 1/3. The rule that opens the questions is `Dots / Rule` with the plate cleared
and the dot vectors recoloured to canvas — leaves recoloured, never the container.

Copy on navy measures 5.2:1 (gold eyebrow), 6.3:1 (body at 0.78) and 8.9:1 (headline and the active
question). The 0.28–0.35 states are the pin's out-of-focus steps and reach full weight at their own
step; they are transient by construction, not copy sitting at that ratio.

It ends on **one** thing: the section's own CTA as a `Button / Blob`, directly under the last
question. An earlier pass put a restated question row and two document cards there and it diluted
the moment — four questions have already made the case, and the button is the only thing that
should follow them. The Record names **which four questions are open**; Truth's `#opportunities`
entry and the Partnerships page carry the pitch and share the destination, so this section hands
off rather than competing with them.

**§04 is the draft's own list format, at hi-fi scale.** Title-led rows across the full column with
the deck beneath, meta and the action on the right — exactly the structure the lo-fi drew. What the
hi-fi adds is scale and the kit: 28px Baloo titles give the rows air, `Dots / Rule` carries the two
group dividers instead of a hairline, `Artwork / Ring A` sits behind at 30% on its roasted path —
the off-white path was invisible on canvas, so the frame recoloured it rather than dimmed it — and the four downloads
are `Button / Blob`. The state of a document is said by its action — **Download** or **In
preparation** — which is how the draft says it. The two group headings replace a 3px progress bar;
a meter has no business on a page with a standing no-odometer rule.

**§05 and §06 are the dark run.** §05 is a stated stillness exception under F7: charcoal, held, no
photograph. Giving the withheld material a picture would perform the withholding, and would put a
face on material whose whole point is that it is not simply available. The ground stays dark
through §06 and an off-white wave hands it into the footer. Before this revision the only wave on
the entire page was §01's; §04 → §05 and §05 → §06 were hard colour cuts. The page now carries
**five** `Wave / Divider` instances — §01 → §02 canvas, §02 → §03 navy, §03 → §04 off-white,
§04 → §05 charcoal, §06 → footer off-white — each seated at its section's height minus 105 so the
151px wave overhangs the join by 46. §02's closing hairline went with the change: a wave that ends
the grid and a rule that ends the grid are the same sentence twice.

**§06 carries the back half's only photograph.** §03, §04 and §05 run 415vh of type between them,
which is the longest stretch on the site without an image; §06 opens on a 440px full-bleed band of
the work being done, which is exactly what its own copy claims — *"new material goes up as the work
happens"*. Copy over it measures 8.24–14.99:1.

**What people still hold is a row of four coloured plates.** The four categories — photographs,
station records, family papers, clippings — run across the full 1240 column at 298 wide, grounds
alternating evergreen `#22372b` and roasted `#4e3524`, each carrying one of the artist's four glyph
motifs (circle, starburst, boomerang, slot) and its line verbatim. Four labelled slots read as the
shape of what is being asked for; four bullet rows read as a paste. The ask — `Button / Blob`,
*Tell us what you have* — sits directly beneath the row.

Navy is deliberately absent from that rotation: on the charcoal dark run a navy plate measures
1.26:1 against the ground and simply disappears. Evergreen and roasted clear it.

They cannot be photographed. The shoot covered Country and Rangers and holds **no archival material
at all** — no documents, letters, maps, albums or clippings — which is a content gap worth
commissioning, recorded here rather than worked around silently.

**Artwork is static everywhere it appears.** `Artwork / Ring B` at 15% and `Artwork / Ring A` at
13% behind §03's navy, `Artwork / Ring A` at 5% behind §04, `Artwork / Ring A` at 7% and
`Dots / Wave` at 9% behind §05, `Artwork / Ring B` at 8% behind §06 — all instances of supplied
components, and the darker the ground the higher the hold, because the ring vectors are canvas. `permissions.md`
records no artwork-motion permission, so none of it moves.

**The count is swapped, never counted.** No odometer on the filter count, and nothing in the
documents register counts up.

**Cards 02, 07 and 09 carry story-wall imagery at `frame` grade**, released by Ivy 2026-08-30 —
superseding the ⛔R10 markers those three cards carried in the lo-fi. Cards 06 and 12 have no
photograph in the draft and carry its own marker verbatim; the band flattens rather than the card
shortening, so the absence is visible instead of tidied away.

**Wherever the copy names a person, the photograph beside it does not show one.** Card 01 and
Breakout A both use open Country for that reason: their copy names Suzanne Thompson, and a person
in that frame would caption them into a role.

**⚠ One copy discrepancy.** `src/content/resources.ts` reads *"What does fire-stick farming
actually do?"*; the lo-fi (`2033:3339`) and the hi-fi both read *"right-way fire"*. The lo-fi is
authority for a hi-fi, so the frame stands and the content file is the one to reconcile.

## About — verb *answers* — 2053vh, 11 sections

> **BUILT — seam pass, 8 Sep 2026.** The ten seams of `REF · SCORE · 05 ABOUT`
> (2642:19666) and the X4 baselines are live: `src/app/about/_components/Motion.tsx`
> hosts, `src/lib/motion/recipes-about.ts` holds the recipes. The section
> interiors below — §03's pin, IMG-03, the animated ramp, Group G — remain
> unbuilt and come as one later pass. Group G stays ▲ Leonard Mickelo.

Built to `05 · About — HI-FI · Desktop · the page answers` (Figma `2653:19666` at x=0,
1440 × 18,474px). The frame is 2,053vh; the scroll span is ~2,118vh because §03 pins 300vh
against 235vh drawn — the same convention as Living Work §02 and The Record §03.

| # | Act | What it says | ⚡ | vh | Loud channel | Plate | Rest after? |
|---|---|---|---|---|---|---|---|
| 01 | I | About YACHATDAC — figures under the escarpment, people as scale | 4 | 110 | **media** | P1 | — |
| 02 | I | What we are — the name decodes, the road runs through, the register writes itself | 3 | 299 | **type** | P3 | — |
| 03 | II | **THE QUESTION** — the ground takes the picture and the question is asked on nothing | 5 | 235 | **type** | **P9** | ✓ pinned 300 |
| 03b | II | **BREATH** — held, no caption, no words | 1 | 55 | **none** | **P8** | ✓✓ |
| 04 | III | What we do — four on the artist's spiral, each clause building its own card | 4 | 265 | **media** | P4 | — |
| 05 | III | How we work — three values, and ochre held full bleed before the third | 2 | 249 | **type** | P1 | ✓ |
| 06 | IV | Who decides — the sentence that keeps qualifying itself, then a date | 4 | 245 | **transition** | — | — |
| 07 | IV | The people — the frames dance, the type holds | 3 | 145 | **media** | P6 | — |
| 08 | IV | Partners — names, not logos | 2 | 175 | **type** | — | ✓ |
| 09 | V | Get in touch — four doors, and ochre speaks once | 3 | 140 | **transition** | — | — |
| 10 | V | Footer — Acknowledgement, then the traveller departs | 1 | 135 | **none** | — | — |

**Reads as:** media · type · type · none · media · type · transition · media · type · transition · none.

No channel runs three deep. The two `type` screens at §02 and §03 are the permitted maximum of
two and §03b drops to `none` immediately after. The 4–5 run is §03 (⚡5) into §03b (⚡1), so the
heaviest scene on the page gets the longest hold, which is the rule working rather than being
survived.

**§02 and §05 each carry a full-bleed band as a screen of their own.** At 299vh and 249vh these
are three-screen sections, and the loud-channel law is per screen: §02 is decode (type) → the
road (media) → register (type, quiet), and §05 is two values (type) → ochre held (media, at rest)
→ the third value. Both replaced a blob-masked plate floating on the right, which read as an
image on the side rather than as part of the page.

**§03 is the page's argument and the only pin.** The ground ramps canvas → evergreen → charcoal
across the pin; the photograph is taken by the ground in bands (`IMG-03`, released under F9); both
claims **leave** the screen rather than dimming in place; and the question settles by line mask on
bare charcoal with nothing behind it. That bare ground is the one place on this page a ground
carries no artwork, and it is deliberate — see the no-bare-ground rule this page otherwise keeps.

**Group G is back in build here, and only here.** The traveller and the page's thread are the same
object: the question travels down the page and settles at each thing it measures. `G1` travel with
trail draw-on, `G3` waypoint settle, `G4` hand-off at each seam; eight waypoints, and the Guide
does not enter §03b. Every placement is ▲ flagged for Leonard Mickelo. `Artwork / Cluster` is not
used — that component renders empty in the V2 file; `Dots / Trail` is the road.

**The F9 releases are each spent once, where the copy already says the thing.** Character decode on
the legal name, because the sentence says most people cannot say it. Dissolve on the picture behind
the question everything is measured against. Velocity warp on the wheel that turns. Chromatic
instability held on the only future-tense sentence on the page, because the Elder Advisory Group is
not yet sitting. Duotone across §07's frames so the near-greyscale one can sit beside the warm ones.
Overshoot twice — the four cards seating in §04, the four doors in §09. A second use of any of them
would be decoration.

**⚠ §07 has no archival photograph and the marker renders.** Neither batch holds archival material
of any kind, so the third slot draws its own absence. Both portraits carry ⚠ CONSENT UNRESOLVED and
are `frame` grade: the world moves, the image plane holds, and captions describe what the frame
shows rather than who the person is.

## Partnerships — verb *hosts* — 1190vh, 10 sections

Built to `07 · Partnerships — HI-FI · Desktop · the page hosts` (Figma `2944:25988` at
`x = −26353, y = 39760`, 1440 × 11,205→**11,430px**). §04 pins 190vh.

**The verb.** *A researcher on Country is a guest on Country* — the page's own first sentence.
Hosting carries the obligation, which greeting does not, and the obligation is the argument.

**Why this page was hard.** Our People had a consent problem. This one has a **content**
problem: *"This page has no draft"* (`lofi-spec.md:556`). It is the only one of the three new
routes the client never wrote, and `D22` made it exist because four live links already point
at it. Worse, the lo-fi's three sections are **two-thirds duplication** — §02 renders the same
imported `knowledgeGaps` object as The Record §03, and §03 is the same contact block as Our
People §06.

**The audit that decided the shape.** `/about#partners` was carrying *more* partnership content
than `/partnerships` did. The commercial offer was all on Living Work; the research protocol was
on The Record; the roster and the mutual-obligation sentence were on About. The guest principle
was hand-copied **three times byte-identical**. So the page was built as a **hub**: the spokes
keep their excerpt and their link, the hub is the only place the whole set sits together, and
where the same fact appears in both, the hub frames it differently.

| § | Section | ⚡ | vh | Ground | Loud | Source |
|---|---|---|---|---|---|---|
| 01 | Hero — the aerial, then *a guest on Country* on evergreen | 2 | 120 | photo → evergreen | **none** | `truth.ts:118` |
| 02 | **The obligation** — alone on a screen | 4 | 100 | evergreen | **type** | `about.ts:117` · `R22` |
| 03 | Open research — three disciplines resolve | 3 | 120 | canvas | **type** | `truth.ts:393` |
| 04 | **What we do not know** — ⚑ the gaps as an OFFER | 5 | 190 | canvas | **media** | `resources.ts:274-300` |
| 04b | BREATH | 1 | 55 | full bleed | **none** | — |
| 05 | Who we already work with — nine names | 3 | 130 | charcoal | **type** | `about.ts:158-187` |
| 06 | **Ways in** — ⚑ the section the site never had | 4 | 140 | evergreen | **transition** | `living-work.ts:359-386` |
| 07 | How work is agreed — the container never fills | 2 | 100 | roasted | **none** | `resources.ts:366-372` |
| 08 | Get in touch — cloned from Our People §06 | 3 | 150 | canvas → dark | **transition** | `contact.ts` |
| 09 | Footer | 1 | 135 | charcoal | **none** | shared |

**Reads as:** none · type · type · media · none · type · transition · none · transition · none.
No channel three deep; both ⚡4–5 runs are broken by a rest.

### §01 — the copy went back onto the ground, 9 September 2026

Ivy moved the hero copy **onto** the photograph on 5 September, because the frame's stacked
arrangement left a whole screen of picture carrying no words. The user reversed that on
9 September, reading the wireframe: the aerial is alone at the top, the wave hands it off, and
the eyebrow, headline, standfirst and action row sit on the page's own evergreen beneath it.
**The obligation never moved through either change** — §02 still states it alone on evergreen.

Two consequences worth naming. **The two X5 scrims are gone**: they bought legibility for type
set on open scrub and no type sits on the picture any more, so the aerial is now bright and
unmuted as the wireframe draws it. **The section is taller than one screen** — roughly 120vh at
1440 × 900, which is the compressed version of the frame's own 1350px stack (the photograph is
held to `58svh` rather than 792px so the eyebrow and headline stay above the fold). That height
is the exact objection the 5 September change was answering; it is accepted here on direction.

**The ⟡ STAND-IN badge was removed from the hero** on the same direction. What it flagged is
unchanged and still held: there is no photograph of research, a survey or a scientist anywhere
in the collection, and `aerial-crew-burnedge` stands in because nobody is identifiable from
height. A reviewer looking at the page will no longer be told — the claim now lives only in
`kit.ts`, in the section's own comment, and here. The badges on §03 and §06 are untouched.

### §01 is the page's only built scene — 9 September 2026

The rest of this ledger describes a page that is **still static**. §01 is now the exception:
the hero takes an **arrival overture**, built at 1440 × 900 first, and nothing below it moves.

| beat | grammar row | effect | at |
|---|---|---|---|
| the eyebrow, *Work with us* | arriving quietly · **X4** | `arrive` | 0 |
| the headline, split **by LINE** | what endures · **B5** | `settle` | 0.20 |
| the standfirst *and* the action row, one beat later | arriving quietly · **X4** | `arrive` | 0.75 |
| the divider at the photograph's foot, into the page's own evergreen | a change of ground | `waveHandoff` | 0.75 |

**The photograph holds still, and that is the direction.** No `pushIn`, no `plateParallax` —
**there are people in this frame**. `aerial-crew-burnedge` is publishable because nobody is
identifiable from height, and `pt-hero` is graded `frame`: the world arrives around the record,
the record does not move. That is also why the row above now reads **none** rather than
**media** — `settle`, `arrive` and `waveHandoff` are all quiet, the wave is furniture, and
nothing on this screen takes it. The ⚡ and the vh follow the same correction: the section is one
screen of held photograph, not one and a half of hypothetical media moment.

**It is an overture, not a scroll scene.** The hero opens at the top of the document, so there
is no span to hang it off — `composition()`'s entry trigger resolves to `progress(1)` at scroll
0 and the arrival would never play. It is gated on `awaitEntry` instead, after the X1 loader on
a first visit and after the X7 wipe on a navigation, exactly as The Record's hero is.

Code: `src/lib/motion/partnerships.ts`, hosted by
`src/app/partnerships/_components/Motion.tsx`. Hooks: `data-pt="hero"`, `data-pt-eyebrow`,
`data-pt-heading`, `data-pt-arrive`, `data-pt-wave`. ⚠ `data-pt-wave` is the divider's **wrapper
box**, never the SVG — the SVG seats itself on a Tailwind translate that an inline GSAP
transform clobbers, which was About's disappearing-wave defect.

### The inversion — §04 is the page's argument

The Record §03 states the four gaps as **absence**: typographic, on a pinned rail, numbered, no
photographs. Here they are an **offer** — each question stays legible and a shutter over the
answer flattens onto its own baseline, disclosing *what is already measuring it*. Same four
questions, same imported object, opposite argument. **If those two sections ever read the same,
this page has no reason to exist**, and the transition strip's frame 07 draws The Record's
treatment beside this one so the difference stays checkable.

§05 runs the same discipline: About §08 carries the identical nine names and is **also
evergreen**, setting them in rows on `Dots / Rule`. The hub uses cards on charcoal, grouped by
what each group is for.

### Two orphaned effects spent

`flattenReveal` (§04) and `display` (§03) both had **zero consumers anywhere in the repo**. Both
were proved in the browser before being drawn — `hosting` in `recipes.ts`, at
`/lab/compose?screen=hosting` — the same order that caught the `escape` portrait-rule bug on
Our People. `mosaic` was planned for §05 and **dropped**: Flip measures at trigger time, so it
cannot be scrubbed, and the composition API has no way to fire a Flip move at the end of a
pinned span. Forcing it would have been decoration, which the grammar's own first rule forbids.

`flattenReveal` is deliberately **not** added to `compose.ts`'s `LOUD` table. That table asks
"does it take the screen", and a shutter collapsing over a paragraph does not.

### What is held

`R9` no form until the legal pages exist · `R12` names not logos · `R22` the Ngapartji-Ngapartji
attribution · `R23` phone hours · `R15` every contact field · `D7` fee-for-service stays on Living
Work and its button label is unsettled · the research protocol is *in preparation* and its
container never fills · no cleared photograph exists for *"How old is the wall?"* · the contact
router's *"Research or partnership"* door ~~is a **self-link** on this page~~ — **retargeted
2 Sep** at §06 *Ways in*; every other page keeps the shared destination.

### The action layer — added 2 September

The page is 1,270vh and originally offered nothing to press until §08, about 8,900px down.
Someone arriving at `/partnerships` has already decided to partner, so the actions now sit
where the intent is:

| Where | What | Why there |
|---|---|---|
| §01 hero | filled gold pill **SEE THE WAYS IN** → §06, with **WHAT WE DO NOT KNOW** → §04 beside it | the page's first action, one beat after the standfirst `arrive`s |
| §04, under the lede | quiet gold link **SEE THE WAYS IN** | the peak of interest — the reader has just been shown four projects they could take on. Quiet on purpose: the shutters are the loud thing here |
| §06, closing | one filled **GET IN TOUCH** pill | the section's cards use text links, so the pill is unambiguously the primary |
| §08 | **`[ EMAIL US — NO CONFIRMED ADDRESS YET ]`**, dashed and unfilled | ⚑ drawn and never filled, per Living Work §08. The site has no working contact channel: every field is bracketed, `R9` blocks a form, and all four doors lead to other pages |

**No CTA anywhere on this page renders a route path.** Twenty across three pages did until
2 Sep; `01 · Wonder` never did, and its `LEARN MORE` / `EXPLORE EXPERIENCES` /
`REGISTER YOUR INTEREST` set is the house pattern the others now follow.

### The link sweep — 2 September, later the same day

**§04 is now `Four open questions`.** It shared a heading and four questions with The
Record §03, so arriving there from that page's CTA read as a repeat. The Record now sets
the four questions **with no answers**, which is its own argument; the shutters here
answer them, and the label on each is **WHAT IS RUNNING** rather than `ALREADY RUNNING`
— two of the four answers are *"Nothing"* and *"Almost nothing has been examined"*, so
the old label promised activity the card does not have.

**§08 is now `The ending`, 70vh.** The router and the six bracketed fields are gone: D5
puts that block on About and Our People because their drafts carry it, and this page has
no draft. One filled **GET IN TOUCH** → `/connect` is the only action on the screen. The
page runs `media · type · type · media · none · type · transition · none · transition ·
none` — unchanged in shape, no channel three deep.

**Section total `11,430 → 10,710`.** Sections still tile the frame exactly, and the
charcoal wave that hands §08 into the footer was missing entirely — 6 waves where the
ledger says 7 — and is restored.

**Every section that was a plain colour now carries `bg · Artwork / Ring`.** Twenty
placements across six pages. The opacity convention is read off the built pages: navy
0.13/0.15, charcoal and evergreen 0.07/0.08, roasted 0.07. ⚠ **On canvas the shipped
artwork is invisible** — the ring path is `#f6f6ec` and so is the ground, which is why
The Record §04's ring has never been visible. Canvas grounds take a roasted `#4e3524`
path at instance 0.30. The rings are watermarks, not `Glyph / Truth` motifs, so the
never-recolour rule does not bind them.

⚠ **Partnerships was the only page in the file with `clipsContent: false`**, on the frame
and on all ten sections, so any bleeding artwork spilled onto the canvas. Fixed to match
every other page.

---

## Connect — verb *reaches* — 645vh, 5 sections

Built to `08 · Connect — HI-FI · Desktop · the page reaches` (Figma `3028:28875` at
`x = −11105, y = 40626`, 1440 × 5,805px). No pin.

**The verb.** Every other page hands off; this is the one you reach them at. Free of *opens ·
descends · accumulates · surfaces · answers · gathers · hosts* and of every motion-token name.

**Deliberately the shortest page on the site.** Its neighbours run 1,190–2,229vh. Someone
arrives at `/connect` to do one thing, and making them scroll a kilometre first is the opposite
of what the page is for. Length here is a service level, not a ration.

| § | Section | vh | Ground | Loud | Source |
|---|---|---|---|---|---|
| 01 | Hero — *Get in touch* | 130 | evergreen | **type** | `contactRoutes.lede` |
| 02 | **Ways in** — the four routes at full size | 190 | canvas | **transition** | `connect/page.tsx:45–62` |
| 03 | No form, and that is on purpose | 100 | roasted | **none** | `connect/page.tsx:100` · `R9` |
| 04 | Contact details — the ending | 90 | charcoal | **transition** | `contact.ts` |
| 05 | Footer | 135 | charcoal | **none** | shared |

**Reads as:** type · transition · none · transition · none. No channel twice in a row.

### §02 is the router, and §04 deliberately is not

`connect/page.tsx` renders `<ContactBlock showRoutes={false} />`, and its own comment says why:
the four routes `ContactBlock` would draw are the same four as *Ways in*, which carries them in
fuller words. **The hi-fi honours that** — §02 has the four cards at 600×420, coloured ground and
a motif, no photographs; §04 carries only the six contact fields. Drawing both would put one
list on one page twice, which is the duplication this whole pass exists to remove.

### The button that cannot be filled

§04's primary action is **drawn and never filled** — `[ EMAIL US — NO CONFIRMED ADDRESS YET ]`,
dashed, unfilled, per Living Work §08's rule for unconfirmed status. Every arrow on the site
ends on this screen. It is the one control on the project that has to work, and it cannot until
one address is confirmed.

### What is held

`R9` no form until the legal pages exist · `R15` every field but Office is bracketed · `R23`
phone answering hours · `R1` the Acknowledgement wording · **no hero image** — the lo-fi gives
no direction and no frame was chosen, so the hero is typographic and says so on the canvas ·
**D2** — whether Connect survives as a nav item is still open, and building the page does not
settle it either way.

⚠ §03's second paragraph (*"There is also no Connect draft…"*) renders live today and reads as
internal build talk to a visitor. Recommended for removal when a Connect draft arrives; drawn
as-is because it is what the page currently renders.

---

## Legal — verb *holds* — 645vh, 5 sections

Built to `09 · Legal — HI-FI · Desktop · the page holds` (Figma `3113:27146` at
`x = 9319, y = 41046`, 1440 × 5,805px). No pin, no photograph, no card.

**The verb.** *Holds* — in both senses the page carries at once: it holds three documents, and
every one of them is held. Free of *opens · descends · accumulates · surfaces · answers ·
gathers · hosts · reaches* and of every motion-token name.

**One frame, three routes.** There is no `/legal` page in the codebase. `00` is a route index,
marked ⚑ NOT A ROUTE on the canvas, and `01–03` are three separate pages that share one
template. Drawing them identically is the argument; three frames would read as three unfinished
pages.

| § | Section | vh | Ground | Loud | Source |
|---|---|---|---|---|---|
| 00 | Route index — ⚑ not a route | 120 | evergreen | **type** | `site.ts:228` · `D4` |
| 01 | Privacy Policy · `/legal/privacy` | 130 | canvas | **none** | `legal/privacy/page.tsx` |
| 02 | Terms of Service · `/legal/terms` | 130 | canvas | **none** | `legal/terms/page.tsx` |
| 03 | Cookie Settings · `/legal/cookies` | 130 | canvas | **none** | `legal/cookies/page.tsx` |
| 04 | Footer | 135 | charcoal | **none** | shared |

**Reads as:** type · none · none · none · none.

**This is the one page where four consecutive `none` channels is right.** The rule exists to stop
a page going flat by accident. Here the flatness is the content: a legal document that animates
is a legal document nobody trusts. The only motion is the index at the top, which is the one
part a visitor navigates rather than reads.

### The bodies are specimen text, and the page says so

Each document carries six clauses of generic boilerplate under a dashed oxide banner reading
*⟡ SPECIMEN TEXT · NOT LEGAL ADVICE · REPLACE ENTIRELY WHEN COUNSEL SUPPLIES THE DOCUMENT*. It
exists so the page can be reviewed at its real length and rhythm rather than as a skeleton.

**No organisation-specific fact is asserted.** Every value that would come from YACHATDAC is
bracketed and set in oxide — retention periods, the providers data is shared with, the contact
address, refund terms, the analytics provider, the last-updated date. The clause *headings* are
the standard subject areas and survive the rewrite; none of the prose does.

**Terms §03 is not boilerplate and is marked so.** *Indigenous Cultural and Intellectual
Property* — flagged on the canvas as a clause that must be drafted with the Traditional Owners,
not taken from a precedent. It governs whether the stories, language and images of Country here
may be reused for research, teaching, media or AI training.

### What is held

`R9` legal review — owner **David**, due **14 September 2026** — holds all three bodies · the
cookie wording is additionally held on the **analytics setup**, because it must describe the
cookies actually set and GA4 is not configured · `R1` the Acknowledgement wording in the footer ·
`R15` the registration numbers.

⚠ **D4 is Final on the label, and the label still promises the wrong artefact.** *Cookie
Settings* implies a consent preferences dialog with toggles; what is drawn is a policy page.
Those are two different things and both may be wanted. Flagged, not resolved.

---

## Wonder — verb *arrives* — ~2340vh, 12 sections

Built 9 September 2026 to the plan in [`wonder-plan.md`](wonder-plan.md), on user direction.
The page's markup is `01 · Wonder · HI-FI · Desktop` (Figma `2033:4367`) and the motion is
`src/lib/motion/wonder.ts`, mounted by `app/wonder/_components/Motion.tsx`.

**The verb.** The page closes a distance. A film shot from the air, then where it sits on a
map, then the road in, then the ground at Turraburra, then the days themselves. Each screen is
one step nearer. Free of *opens · descends · accumulates · surfaces · answers · gathers ·
hosts*.

**No 3D.** An earlier draft of the plan put the terrain dolly behind §04. Withdrawn by the user
on 9 September 2026: Wonder is a GSAP page, and the two drawn maps it already has are what the
page deepens. There is no WebGL on this route.

| § | Section | vh | Ground | Loud | What happens |
|---|---|---|---|---|---|
| 01 | Hero — the film | 100 | full bleed, sticky | **media** | the H1 settles; the scrim ramps as the wave rides up over the film |
| 02 | The facts — the Queensland map | 320 | canvas, sticky span | **media** | `routeDraw` → `brushFill` → `inkFlare`; copy arrives in three tiers |
| 03 | Highlights | 100 | white | **media** | `emanate` across the rail, each card's clip opening from its left edge |
| 04 | Getting here — the route map | 300 | charcoal, sticky span | **media** | the same draw and flare; the copy arrives in stop order |
| 05 | Turraburra | 180 | full bleed | **media** | landscape behind Getting here's outgoing wave; `landscapeApproach` on entry, `landscapeGyroscope` on mouse hover; image and copy hold for 80vh before exit (user direction 9 September 2026) |
| 06 | What a stay looks like | ~720 | canvas, sticky reading screen | **transition** | six automatic stops at one viewport position; line, copy and picture entrances from the effects lab |
| 07 | Before you come | 100 | evergreen | **none** | `hold`, cells arrive, one beat on the call to action |
| 08 | Where you sleep | 120 | canvas | **media** | two frames open around held photographs; no overscale or parallax |
| 09 | What it is like out here | 180 | full bleed | **media** | same landscape entry, mouse drift and 80vh reading hold as §05; no sweep |
| 10 | Your hosts | 100 | canvas | **none** | the copy arrives; the pointer names three of the eight, and the faces hold |
| 11 | From Country | 100 | white | **media** | the card rail again, quieter |
| 12 | Come and see it | 100 | roasted | **none** | the quietest screen, and the second conversion point |

**Reads as:** media · media · media · media · media · transition · none · media · none · media
· none. Five consecutive `media` screens at §01–§05 break the ledger's own rule that no channel
runs three deep, and it is a deliberate exception rather than an oversight: Wonder's argument is
photographic from the film to the landing, and the intensities under it are not flat — the two
maps are the loud pair and §03 sits between them at a much lower volume. **Flagged for Ivy.**
The alternative is to make §03 or §05 quiet, and both were judged worse.

### The itinerary opens each stop at one viewport position

9 September 2026 responsive correction: desktop touch pointers (including
DevTools emulation) use the same automatic itinerary as mouse input. Wonder's
section entrances, including Highlights, now scrub and reverse with scroll
instead of completing once. Out here reserves 144px below its text to clear
the incoming 104px hosts wave by 40px.

Latest direction, 9 September 2026, extends the restored Figma `2033:5889`
accordion with automatic opening. At 1440 x 900, the same native document
holds on canvas while six 100vh reading spans select the active stop. The
heading position stays constant; reverse scrolling returns through the stops.
`itineraryStep` translates measured rows, and `stageArrival` combines `settle`,
`arrive` and `frameOpen` after reviewing the live effects lab. Photos hold
inside their frames. There is no full-screen image duplicate or colour ramp.

The module waits for closed-panel fonts before measuring each stop. Desktop
stops taller than the reading window extend their 100vh leg by the overflow:
20vh seated, scroll through the excess, then 80vh held. This restores automatic
steps on shorter desktops and cold production loads (9 September 2026).
Mobile and windows too short to show a heading plus a readable strip retain
the normal accordion. Reduced motion and no JavaScript use native instant
toggles. See `wonder-plan.md` for measured spans and keyboard behaviour.

### The `ground` row is not used on this page

§09 was built with the sweep and it came out the same day: a translucent
evergreen band rising up a sunset read as a green film over the picture rather
than as one ground handing to another. A wipe belongs at a join, and §09 is not
one.

### The two things the pointer must never do here

§11 holds documentary photographs of Country and of a cultural site, and §10 is a
group portrait. Every one carries `data-motion="frame"`, so `bleed` counter-scales the picture,
`plateParallax` refuses to touch it, and the hosts' interaction moves a label and a dim and
nothing else. Portraits hold still; the world moves around them.

Exception, latest user direction 9 September 2026: §05 Turraburra and §09 Out here
share full-motion landscapes through `wonder-landscape.ts`: a sticky viewport
with shallow entry approach and mouse tilt/drift. Copy holds with the photograph
for 80vh of scroll after seating. Touch disables the pointer effect; reduced motion
and no JavaScript render static full-height sections. Content too tall for the
viewport uses ordinary reading flow.

### Both maps were cropped by their own layout, and both are fixed

§02's artwork is 1128.88 × 783 — Queensland right, a pale Australia reaching
away to its left — and the hi-fi places that whole group at (205.33, 83),
running behind the copy. It was being rendered into the right-hand column's
600 × 640 image slot on top of the phone crop the supplied file carries in its
viewBox, which left the state standing alone. The desktop now draws the whole
artwork at the frame's proportions and the phone's window is applied in CSS, so
one SVG serves both breakpoints and the file is untouched.

### The 1920 crop, fixed

§04's map was placed at the frame's own 1440 pixel offsets inside a 1973-wide window. At exactly
1440 that window's edge fell on the viewport edge; at any wider width it cut the map off
mid-road. The window is gone, the artwork sits at its own 2278 × 1580, and the viewport does the
cropping. Stop icons moved from frame pixels to percentages of the artwork in the same pass.

### What the plan asked for and this does not do

- **§04 does not draw in stages.** The plan wanted the state outline, then the roads, then the
  property, then the pins. Each cut of that map is tagged as ONE `data-route` path, so staging
  it means re-tagging Marc's export rather than changing motion code. Not attempted here.
- **The stop icons are not buttons.** The lab's waypoints are focusable because they open
  panels. These four duplicate the list of stops sitting beside them, so making them tab stops
  would add four focus stops that announce nothing new. Left as decoration, deliberately.
- **The itinerary's dotted rules do not draw themselves.** They are `<img>` SVGs, not inline
  paths. The exported rules arrive with the row furniture; panels animate on request.

---

## Our People — verb *gathers* — 1835vh, 11 sections

Built to `06 · Our People — HI-FI · Desktop · the page gathers` (Figma `2841:25358` at x=0,
1440 × 16,515px). The frame is 1,835vh; the scroll span is ~1,865vh because §03 pins 330vh
against 270vh drawn — the same convention as About §03 and Living Work §02.

**Why this page needed a grammar of its own.** Eight of its nine people have no name, and the
blocker is not missing content: consent to be named and photographed has never been sought
(`R24`). A conventional team grid renders that as eight grey boxes — a page that looks broken,
about people who are anything but. So the choreography carries the argument instead.

| # | Act | What it says | ⚡ | vh | Loud channel | Plate | Rest after? |
|---|---|---|---|---|---|---|---|
| 00 | I | The advisory — the one thing on this page that never moves | 1 | 45 | **none** | **P8** | — |
| 01 | I | Our people — the photograph leaves the screen and survives inside the word | 4 | 210 | **type** | P1 | — |
| 02 | II | Suzanne Thompson — her own photograph, testimony undimming word by word, then the ground goes | 3 | 250 | **transition** | P6 | — |
| 02b | II | **Her decision** — the operative sentence on the site, alone on a screen | 4 | 140 | **type** | — | ✓ |
| 03 | III | **THE GATHERING** — six cards lock into a set, one name resolves, a held card takes the screen | 5 | 270 | **transition** | P4 | ✓ pinned 330 |
| 03b | III | **BREATH** — held, no caption, no words | 1 | 55 | **none** | **P8** | ✓✓ |
| 04 | IV | Board and governance — the ratio drawn to scale, three seats held, one group not yet sitting | 4 | 220 | **transition** | — | — |
| 05 | IV | **The ones who got us here** — the only names set large on this page | 5 | 260 | **type** | — | ✓ |
| 05b | V | **BREATH** — the pivot from the ones who are gone to the ask | 1 | 55 | **none** | **P8** | ✓✓ |
| 06 | V | Get in touch — four doors | 3 | 195 | **transition** | — | — |
| 07 | V | Footer — Acknowledgement, artwork band | 1 | 135 | **none** | — | — |

**Reads as:** none · type · transition · type · transition · none · transition · type · none · transition · none.

No channel runs three deep. §03 and §04 are both `transition`-loud with only the 03b breath
between them — permitted at two, and they are different kinds of transition: grid choreography
against radial assembly plus a ground change. Flagged on the flow board; if it reads as a repeat
on review, §04 moves to `type` on the 80/20 figures. Both ⚡5 screens are followed immediately by
a rest, and they never touch.

### The 2 September pass — Ivy's review

**§04 governance was rebuilt because it did not parse.** The constitutional sentence had been
broken across a column at `x = 820`, so the 80/20 read as two loose figures with an orphaned
clause beside them. The numbers, their labels and the rest of the sentence now run in one
left-to-right line, and the ratio is **drawn to scale** — a 1240px bar split 992 / 248. That bar
is the stat's own transition: it wipes to 80% while the figures stagger in, which is the
"intense" treatment the numbers were asked for and earns them more than a `display` stagger
alone. 190vh → 220vh to give the choreography scroll room; the page is 1,805 → 1,835vh.

**Cards.** The six Gathering cards and the four Get-in-touch doors were plain bordered boxes —
a hi-fi that could pass for the lo-fi. Both now use **The Record §02's card template**: coloured
ground, 24px radius, a motif, type in canvas and gold. The Gathering cards take a photograph
and a 35% scrim; **the doors deliberately take no photograph** (Ivy, 2 September) — colour and
the artist's motif carry them. The rule is now in `CLAUDE.md`: *a card is a coloured ground, a
photograph and a tiny artwork, never a white box.*

All six Gathering cards share **one ground**. Varying it would code a difference between the
named card and the five held ones, and §03's whole argument is that there is none.

**§05 acknowledgements** gained `Artwork / Ring A` and `Ring B` behind the names at the file's
held opacities (7% and 8%), instanced canvas-coloured and not recoloured.

**Two new transition strips**, each placed in the REF lane **beside the section it documents**
rather than stacked at the row top — and the Gathering and Procession strips were moved to
match:

| Strip | Frames | Beside |
|---|---|---|
| `§01 — THE KNOCKOUT` | 8 | §01, the photograph entering the letterforms |
| `§02 — TESTIMONY UNDIMS WORD BY WORD` | 7 | §02, the quote at 0.28 → spoken → whole |

The testimony strip renders the dim states with real per-range fills, so frames 04/05/06 show
the actual 0.28 → 1 progression rather than describing it.

### The artwork, added 1 September

The page shipped with **no `Wave / Divider`, no `Glyph / Truth`, no rings and no dot bands** —
the only built page carrying none of the brand artwork, and Ivy caught it. It now runs the
file's own conventions rather than new ones:

- **Seven waves, one per ground change**, at the established geometry: 1442×151 at `x = −1`,
  `y = ground foot − 105`, drawn in the **incoming** ground's colour. Canvas out of the hero,
  roasted into Her decision, canvas back for the team, evergreen out of the breath, charcoal
  into the ones who got us here, canvas out of the second breath, charcoal into the footer.
  The hero's wave sits at the **section** foot, not the photograph's: the ground under the
  knockout is charcoal, so the photograph's edge is not a ground change and its hard cut is
  annotated as deliberate.
- **The three motifs rotate across the six Gathering cards** — boomerang, circle, starburst,
  repeating — placed bottom-right of each image plane, because top-left is the `⟡ PLACEHOLDER
  FACE` badge and a face sits high in a 380×320 crop. The rotation deliberately **cuts across
  the roles** rather than encoding them: assigning a motif to a role would ascribe meaning to
  the artist's marks, which is not ours to author.
- **The hero and both breaths** carry an `Artwork / Cluster` and a seam glyph, following Truth.

⚠ **Suzanne's photograph carries no artwork, deliberately.** It is the one frame on this page
of a named, living person, and a decorative mark laid over her portrait is a different act from
one laid over Country. If it should have a seam glyph, that is her call, not ours.

⚠ Motif colour is the artist's and is never overridden — see `ART-DIRECTION.md` §Artworks. The
first pass here painted all three white and flattened them; the fix was to copy fills back down
from the main component.

### The two inversions this page runs on

**A held card is not a lesser card.** Same size, same ground, role at full weight — and where a
name would be, **a gold rule**. Never the string `[ Name ]`, which `src/content/our-people.ts`
already refuses in code, and never a shimmering skeleton: a skeleton says *this is arriving*, and
these names are not arriving until somebody is asked. In §03 the five held cards arrive in the
same breath as the named one and then **hold absolutely still while it resolves**. The difference
in behaviour is the message.

**§05 is where the names are.** Everywhere else on this page a name is a rule; in *The ones who
got us here*, and only there, names are set at sixty points and **stay lit — nothing dims out**,
which is the deliberate opposite of §02's `dim`. The living are unnamed because consent has not
been asked for; the ones who got us here are named because it has. The client's own sentence
makes the argument: *"We name them because that is how the record stays straight."* The section
ends on a sixth place held — a gold rule at name scale.

### Effects this page spends that nothing else had

`scatterResolve`, `escape` and `knockout` were all built and had **zero consumers** in the repo.
The §03 choreography is prototyped as the `gathering` composition in `src/lib/motion/recipes.ts`
and runs at `/lab/compose?screen=gathering`, because drawing eight frames of a behaviour nobody
had watched run is the wrong order.

`escape` gained a **`holdPlane`** option here, and it is not optional on this page. A card that
flies to full-bleed scales everything inside it, so a card carrying a portrait magnifies that
portrait — a hover-scale on a face by another name, and the corollary does not care that a Flip
caused it. `holdPlane` counter-scales the image plane against the flier's live scale every frame,
so the frame opens and reveals more of the photograph while the face holds the size it had. That
is `frameOpen`'s rule — revealed, not resized — and it makes `escape` legal on `frame`-grade
media rather than forbidden on it.

`escape` was also missing from `compose.ts`'s loud-channel table. The grammar defines it as
"`handoff` made reversible", `handoff` was always listed, and a card that becomes the entire
screen is the loudest transition available. It was absent because nothing had used it, so the gap
never fired.

### What is held

**Suzanne Thompson is the only person on this page shown as herself** — `378A7604_1.40.2`,
identified by Ivy. Five further frames of her exist (`1.10.1`, `1.69.1`, `1.69.5`,
`March22-1512`, `March22-1668`) and none of them may be reused in a team card, because a reader
would take her for two people.

Every other face is a **placeholder**, badged on the card itself rather than only in a layer name
— a screenshot circulated without the badge is exactly how a placeholder becomes a claim. That
includes **the face on the named card, which is not Graham Ambridge**: no photograph of him
exists in any batch. The library holds five card-usable faces besides Suzanne's, so one card
repeats another's subject in a different frame; it is the only repeat and it goes when the real
portraits arrive. `R24` is the page's blocker; `D16` is open on
the page's own title; `CR4` holds "settler" in Graham Ambridge's biography, which is his own word
about himself.

---

## The scrub exceptions, marked

Per `spine.md`, scroll advances time in exactly three places. Everywhere else it reveals:

- **Home 03** — THE DRAIN, pinned 340vh. Scroll advances the 1861-1902 sequence, and the
  photograph's withdrawal is bound to it. This replaces the lo-fi's A2 sky clock, which put
  static content over a moving sky and could not give each sentence its own entrance.
- **Truth 01–20** — the descent, the rail, the chronology. The rail's gold mask is bound to
  scroll position; the artwork under it never moves.
- **Living Work 05** — THE SPRING. The hi-fi is explicit: "counter · X3 scrubbed 1→8, **the
  only place scroll controls time**" on that page. Eight days a spring ran, one per step,
  snapped so the reader is never stranded on a day that does not exist.

Any other scrub on any other screen is a mistake, not a variation. Note the distinction that
keeps this honest: plenty of screens are *scrubbed* — grounds ramp, plates parallax, apertures
open — but only these three use scroll to advance **time**. Scrubbing a texture is not the same
as scrubbing a chronology.

## Cultural material in this ledger

On The Record, cards 02, 07 and 09 and Breakout B carry `frame`-graded story-wall material on a
page that is otherwise a working catalogue. The grade is what makes that safe: the plate, ground,
scrim, type and the sticky rail animate at full weight around them and the image plane does not move.

Scenes 12, 14 and 17 carry `frame`-graded material — the portrait, the escarpment, the engraving
wall. The world moves around them: grounds sweep, wave dividers hand colour across, type comes
over the top, scrims carry the legibility. The record itself holds still.

**Scene 17 has no photograph as built** — the wall is carried by type on bare navy. The reason has
changed and the ledger should say so: it was a quarantine, and it is now a photo pass that has not
happened. Ivy released story-wall and cultural-site imagery at `frame` grade on 30 Aug 2026, so the
wall may be shown as a still photograph with its story in words. The ⛔R10 prefixes still carried on
the Figma pool boards are stale. Scene 15 is different and unchanged: it has no photograph because
Suzanne's testimony is withheld under **R5**, which no one has waived.

Scene 12 is a portrait of a real person. It is held at 460 × 613 in its **native aspect**: a
16:10 full bleed would mean cropping that photograph, which is a photo-pass decision and not one
this ledger makes. Frames are described by what they show, never by who the person is, and no
section captions a person into a role.

That is the deliberate design, not a limitation working around one.


Home portal continuation, 9 September 2026: the same canvas now opens the central rosette after the text clears, magnifies the original painting around the opening and holds a stationary sunset road behind it. The final approach blends into the exact woodland road/blue-sky layers from Figma 3371:41346 and 3371:41347. Total pin is 276vh, preserving the first 120vh timing; reverse scroll retraces the opening. Reduced motion retains the static hero.


Latest user correction, 9 September 2026: the woodland road from Figma is used throughout the central opening and arrival. The sunset road and image crossfade are no longer used or loaded.


Home central aperture correction, 9 September 2026: the woodland road appears inside the inner ring as soon as the painting begins revealing (painting progress 0?3.5%), before the zoom. It remains opaque while the red ground draws around it. If the landscape fails to load, the centre retains the painting.


Daylight correction, 9 September 2026: the same canvas now composites the transparent Figma treeline over its supplied sky texture, sampling the pale grey-blue/daylight band with restrained saturation and a warm horizon. woodland-road-foreground.webp preserves the top 1440?900 foreground with alpha; road-sky.webp is the full original sky transcoded to WebP. Origin remains Figma nodes 3371:41346/41347. No change to portal timing or terrain colours.


Home ground overlap, 9 September 2026: charcoal now gradually turns oxide over dissolve progress 0?65%, overlapping the text fade (0?30%) and image/scrim fade (0?40%). Painting reveal still starts at 45%; the portal sequence retains its timing. This supersedes the earlier empty dark-field pause.


Wonder continuation, 9 September 2026: the portal arrives on a darker blue sky. The existing Wonder copy rises as one accessible DOM block over the same canvas while the shader warms the sky to daylight. Timeline 2.3?3.1 controls both; 3.1?3.4 holds. Total pin 408vh preserves earlier scroll timing. Reverse scroll lowers the block and cools the sky. Existing static Wonder is shown only without canvas enhancement. Draft wording and CTA destination are retained.


Terrain lighting, 9 September 2026: the same daylight progress now controls sky and land. At night, terrain uses 22% linear exposure, reduced saturation and a cool ambient tint; these blend back to original daylight colours as the sky warms and Wonder rises. Reverse scrolling restores night. This is a shader grade of the supplied image, not new lighting geometry or a modified source asset.


Painting copy styling, 9 September 2026: latest reference uses cream text, a smaller entrance line, larger Turraburra title and smaller right-aligned story. Soft local media scrims and text shadows improve contrast over the artwork and share each fragment?s existing opacity timeline. Licensed heading face retained.


Painting scrim coverage, 9 September 2026: each text fragment now has a full rectangular dark backing extending beyond its complete text bounds, with a blurred outer perimeter. This replaces the centre-weighted ellipse that left the first and last words unshaded. Opacity still follows the text.


Portal lens motion, 9 September 2026: the approach now applies a radial shader curve to the painting alone, stretching peripheral marks around the opening like the supplied motion reference. A sine-squared envelope builds and releases the bend during the existing portal span. Centre, landscape UVs, reveal timing and reduced-motion fallback remain stable. The source artwork is unchanged. Reverse scroll retraces the curve.


Home woodland breeze (AMB-05), 9 September 2026: user authorises subtle vegetation UV motion on the supplied road photograph, superseding frame grade for this layer only. Spatial and colour masks protect the road and suppress dark trunks; grass ripples faster than canopies. This is an approximation from a still photograph, not segmented 3D trees. The existing canvas and controller own the 24-second loop, paused offscreen and in hidden tabs, absent with reduced motion. Painting, sky, other photos and scroll timing remain unchanged.


AMB-05 correction, 9 September 2026: user found the distortion too obvious. Restrict wind to three feathered grass patches in source-image UV space, remove canopy sway, reduce grass displacement by 80%, and slow the ripple from nine to four cycles per 24-second phase. Unselected pixels remain still. This supersedes the broad vegetation mask above.


AMB-05 visibility tuning, 9 September 2026: the reduced pass was too faint. Keep the same three grass selections and stationary trees/road, but increase horizontal displacement from 0.00015 to 0.0006 UV and vertical displacement to 0.00012 UV. Six cycles per 24-second phase give a visible four-second ripple; no broader vegetation warp is restored.


AMB-05 stronger breeze, 9 September 2026: user still could not see the ripple. Increase horizontal displacement fourfold to 0.0024 UV, vertical to 0.00045 UV, broaden the three foreground selections, and use three-second cycles. Reduce colour-mask suppression of dry yellow grass. The road exclusion and stationary horizon remain. This supersedes the previous amplitude tuning.


AMB-05 viewport correction, 9 September 2026: checking the 2048-by-758 landscape confirmed the cover crop removes most of the low grass selections. Add three mid-ground grass selections higher in the source image, retaining the original foreground selections for taller viewports. No amplitude increase; the road exclusion and horizon remain fixed.


AMB-05 final scope correction, 9 September 2026: user requests all vegetation to ripple gently. Remove the six patch selections. Apply a broad vegetation mask with road exclusion and dark-trunk suppression, with 0.0009 UV grass ripple and 0.00065 UV canopy sway. This supersedes the patch-selection approach and its viewport workaround. Sky, road, pause behaviour and reduced-motion fallback remain unchanged.


| **the landscape introduces Truth** | SCR-09: after Wonder holds, its copy rises away; the existing road canvas shifts from pale daylight to the supplied saturated blue sky. Truth, Iningai Nation and the first existing subject-detail paragraph rise into a centred upper block. | homeHeroDissolve 3.4-4.2; hold to 4.6; total pin 552vh; reversible scrub 0.8s | user screenshot 9 September 2026 | quiet type over held landscape with AMB-05 breeze | `homeHeroDissolve` |


Truth frame verified in Figma 3371:44774 (Homepage Prototype), 9 September 2026: content 3371:44831 is 720px wide, top 124px in a 901px frame; eyebrow 20/28, heading 64/64, body Work Sans Medium 20/30, 24px gaps. Existing road and full sky assets are reused; bright sky samples follow the frame background offset -1422px in a 6996px layer. Foreground uses the frame's 25% black scrim. No draft words change; later Truth sequence remains available in normal flow and in the static fallback.


Truth colour correction, 9 September 2026: user requests the exact Figma appearance. Replace the approximate blue-band sampling and land-only dimming with frame 3371:44774's exact visible sky and soft-light crops. A 25% black overlay covers sky and terrain before the foreground-masked soft-light blend, computed in display RGB. Existing Truth scroll progress blends into this corrected composition; timing and copy remain unchanged.


### Home Truth years - 9 September 2026

SCR-10 extends the existing canvas after the Truth introduction through the seven dated Figma frames 3371:45208-46472. Original sky and soft-light image layers use measured per-frame offsets, including the existing 25% black scrim. Exported dotted path and combined arrow/rosette marker sit over the landscape. Prose and year labels crossfade without counting or moving testimony. Every state scrubs backwards; the final Full account link goes to /truth. Static Truth remains the reduced-motion/WebGL fallback. No motion keyframes were present in Figma; timings are the scroll adaptation of its supplied states.


Home Truth smooth scrolling - 9 September 2026: SCR-10 now interpolates the year marker and canvas lighting throughout each one-unit leg, rather than moving quickly then holding for most of the scroll distance. Text fades take 0.3 units each; the final account remains held for 0.9 units. Existing wheel inertia and reversible scrub remain active. This supersedes the earlier 0.4/0.6 transition/hold split.


### Belonging under the stars - 9 September 2026

After the final Truth reading hold, SCR-10 removes its entire copy and dotted year sequence. Belonging rises/fades over the same canvas while sky and soft-light layers move to Figma 3371:41578 offsets 5822. Existing stars twinkle through a luminance mask using the registered AMB-05 phase; no new stars or constellations are drawn. Terrain masks the effect, and shared visibility/reduced-motion cleanup applies. The draft supplies all text and the full CTA label. The static Belonging section remains the fallback.


Belonging procedural stars - 9 September 2026: latest user direction supersedes animating the image stars. A seeded GLSL star field replaces the sky only, with antialiased points, varied luminosity and spatially independent twinkle driven by the existing registered ambient phase. This is generated decorative sky, not astronomical or cultural-record data. No extra renderer, texture or animation loop is added.


Belonging shooting stars - 9 September 2026: occasional procedural meteors extend the existing shader star field. Three varied, screen-relative diagonal paths run in the registered 24-second AMB-05 phase, each visible for 1.4 seconds approximately eight seconds apart. A bright soft head leads a tapered fading trail; the foreground alpha occludes it. The effect appears only once Belonging has settled and inherits existing pause, teardown and reduced-motion behaviour. No textures, extra canvas or independent ticker are added.

Invitation continuation, 9 September 2026: Figma 3371:41740 supplies three 400px-high photo cards, 48px gaps, 40px padding, 20px corners, and a centred 64px heading. After Belonging, the road exits into a charcoal media scrim; the Invitation overlaps its final 24svh. A 65vh reversible homeInvitation entrance lifts whole cards without image warping. D5 retains the longer draft headline, pillar titles, descriptions and destinations; screenshot copy differs. Mobile stacks cards; reduced motion uses the same content in normal flow.
