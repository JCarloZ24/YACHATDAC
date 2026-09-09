# 01 · Wonder — the motion plan

*Last updated: 9 September 2026*

**Latest responsive correction, 9 September 2026:** desktop itinerary selection
depends on available width and reading space, not pointer type. DevTools touch
emulation must retain the automatic sequence at desktop dimensions. Narrow
screens retain native disclosures with reversible scroll entrances. Highlights
and the other section entrances now scrub from their entry threshold to top 20%
of the viewport, retracing on reverse scroll. This supersedes the single-play
entrances described below. Out here's text reserves 144px beneath it so the
104px incoming hosts wave has at least 40px clearance, including the static cut.

*Status: **built**, 9 September 2026. The motion is `src/lib/motion/wonder.ts`,
mounted by `app/wonder/_components/Motion.tsx`; the maps are
`src/lib/motion/route-map.ts`; the hosts' pointer is
`app/wonder/_components/HostNames.tsx`. The scene ledger entry is
[`scenes.md`](scenes.md#wonder--verb-arrives--2340vh-12-sections), which is
where the pacing and the exceptions are recorded.

Two rounds: the page was built to this plan, then corrected the same day on the
user's own reading of it. What is written under each section below is what the
code does, including the parts of this plan that were built and then taken out
(§09's ground sweep, §06's lighting index) and the parts never attempted (§04's
staged draw, the stop icons as buttons). Nothing here describes an intention
that the build does not match.*
*Supersedes the 8 Sep draft of this file: the terrain dolly and every 3D scene
are withdrawn on user direction, 9 September 2026. Wonder is a GSAP page. The
drawn maps it already has are the thing to deepen, not to replace.*

## The verb

**Wonder arrives.** The page closes a distance. A film shot from the air, then
where it sits on a map, then the road in, then the ground at Turraburra, then
the days themselves. Each section is one step nearer.

The loud channel is **media** (scene ledger row 46). The two exceptions below
declare themselves.

## What "unique per section" means here

Twelve different tricks would read as twelve different websites. What the page
can carry is one grammar with a different *instrument* each time: the same
arrival, the same draw, the same opening, attached to whatever that section is
actually made of. The map draws, the itinerary unfolds, the hosts answer the
pointer, the landscapes breathe. Nothing below invents a new meaning.

## Per section

### 01 · Hero — leave it

The film is the loud media and it works. One addition only: `settle` on the H1,
rising once behind its own line as the film runs. Nothing else. The sound
toggle and the tier picker are untouched.

### 02 · The facts — extend it, and let the map finish loudly

**Where the map sits, corrected 9 Sep 2026 on user report ("fix the map").**
The supplied `facts-map.svg` carries a crop in its own viewBox — the
right-hand window that suits a phone — and it was being rendered at 1440 into
the column's 600 × 640 image slot. Two crops on top of each other, and what
survived was Queensland alone with a stub of coastline.

The artwork's own frame is its clip rect, 1128.88 × 783, which is exactly the
group the hi-fi places at (205.33, 83): Queensland on the right and a pale
Australia stretching away behind the copy column. So the desktop now renders
the whole drawing at those proportions as a layer across the screen, painted
before the copy so the ghost outline passes behind the words as the frame
draws it, and the PHONE's crop is applied in CSS instead of in the file. One
inlined SVG, one set of draw tags, both breakpoints, and not one path altered
— the file stays as supplied.

The wave carrying canvas up over the film stays exactly as built. Four changes:

- **Extend the span.** 220vh to 320vh at 1440. The draw completes with scroll
  to spare today, which is why it reads as quick.
- **Text arrives with the ground.** `triad` on the copy column: standfirst as
  the anchor, the six chips as the mid tier, the six fact pairs as the detail
  tier. It runs under the map's own draw, in the first third of the span.
- **The red fill is coloured in by hand.** Three cuts to get here. It began as
  one even zigzag, which read as a wipe; then as three interleaved passes,
  which read as visible diagonal stripes with the ground showing between them;
  and it is now what the user asked for on 9 Sep 2026 — "start on top-left,
  only 1 stroke up-down movement... imperfect, like a child colouring the
  area". One continuous stroke that never lifts, entering at the shape's top
  left, with the gap to the next stripe, both ends and the middle of every
  stripe seeded-jittered, and wide enough that the stripes overlap into solid
  colour rather than leaving gaps.
- ~~**The overshoot frame** — the ink thickening and lighting before it
  settles.~~ Built as `inkFlare`, and **removed on 9 Sep 2026** with the ink
  layer it belonged to. The user's read: "the lines are thick and become less
  thick, absorbing or dissolving the thickness — make it more natural without
  dissolving or distorting the lines." They were right, and the flare was only
  half of it: these maps are filled ribbons rather than stroked lines, so
  stroking a copy of a band's path drew a line along BOTH of its edges. The
  draw was a bloated double of the artwork that then had to hand over to the
  real shape, and that hand-over is the thinning.
  The draw is now done by reveal — the segments are white strokes inside a
  mask and what appears is the artist's own shape at the artist's own weight.
  Nothing synthetic is drawn, so nothing has to dissolve. `inkFlare` is out of
  the grammar table with it.

### 03 · Highlights — the section that has to stop being bland

It is three photographs and it currently does nothing with them.

- The cards arrive in order across the rail. This was `emanate` — which
  arrives elements from 0.7 scale — and it is not any more: when its timeline
  failed to finish, the cards stood at 70% of their width and read as a layout
  that does not match the frame. A card that only ever moves and fades cannot
  be left the wrong size by a stalled tween.
- `frameOpen` per card: the rounded clip opens from its own foot while the
  picture counter-scales and holds still inside it. These are hands and a
  ranger, `frame` grade, so the plate opens and the image does not move.
- The chip and the title arrive 0.15s after their card lands.
- Image quality is a build item, not a motion one. The cards render about 950px
  wide at 1440 and the `sizes` hint already says so. Verify the batch-2 source
  is actually 2000px before blaming the animation.

### 04 · Getting here — fix the crop first, then deepen the draw

**The 1920 crop is a bug, not a taste question.** The map is placed at the
frame's own 1440 coordinates, so above 1440 it runs past the section's edge.
Fix it by scaling the map's host to the viewport rather than pinning it at 1440
pixel offsets, and move `MAP_PINS` to percentages of the map box, the way the
lab positions its waypoints. Do this before any motion work. A longer animation
on a cut-off map is a worse cut-off map.

Then take three things from the lab that the route map does not have yet:

- **NOT BUILT — levels, not one pass.** The plan wanted the state outline,
  then the interior roads, then the property, then the pins. Each cut of this
  map is tagged as a SINGLE `data-route` path, so the staging is a property of
  Marc's export rather than of the motion code: delivering it means splitting
  that path and re-tagging the artwork, which is a drawing change, not an
  animation one. Left for a pass that has the file open.
- **The roads reveal like the state does.** §04 runs the same rewrite as §02
  and took two fixes of its own on the way (9 Sep 2026). Its band carries a
  mask of its own from Figma — the inside stroke that draws its black edge —
  so the reveal mask goes on a wrapper rather than on the band, which would
  have thrown that away. And both maps were minting a mask with the same id,
  so `url(#…)` resolved to whichever came first in the document: §04's roads
  were being masked by §02's Queensland mask, and simply never appeared. Mask
  ids now come from a counter that cannot collide.
- ~~**BUILT — the ridge treatment**, as `inkFlare`.~~ The last tenth of the draw
  thickens the ink to 2.3× and lights it, and it is still hot as the finished
  map comes up underneath. The same effect runs on §02, so the two maps read as
  one family.
- **NOT BUILT — waypoints as real buttons.** The lab's waypoints are focusable
  because they open detail panels. These four icons duplicate the list of stops
  sitting immediately beside them in the copy, so making them tab stops would
  add four focus stops that announce nothing a keyboard reader has not already
  read. That is worse for the reader, not better, so they stay decorative and
  `aria-hidden`. The judgement would change the moment they carry something the
  list does not.

Span 220vh to 300vh, and the crop is fixed — see above.

### 05 · Turraburra — landscape behind the outgoing black section

Latest user direction, 9 September 2026: the photograph fills a sticky viewport
behind Getting here's charcoal wave. The title and description seat together
in a 100vh screen, then hold for another 80vh of scroll effort before releasing.
The existing photograph has full motion for this section: `landscapeApproach`
eases scale from 1.035 to 1 on entry, finishing before the hold; `landscapeGyroscope` follows
the mouse with ±1.2% translation and ±1° tilt, smoothing over 0.8s and returning
to centre on exit. Separate layers prevent pointer and scroll transforms from
competing. The copy and its legibility scrim stay still. CSS grid bounds the
background to these two sections; the itinerary follows in ordinary flow.
Touch gets scroll only. Reduced motion and no JavaScript keep a full-height
static photograph behind the same copy. Short viewports and longer CMS copy
disable the reading hold when the content cannot fit, keeping every word reachable.
This supersedes the former frame-only `bleed` treatment for this slot.
Shared module: `src/lib/motion/wonder-landscape.ts`; shared markup helpers:
`LandscapeBackdrop` and `LandscapeScreen`; styling: `Landscape.module.css`.

### 06 - Itinerary: automatic stops in the restored accordion

**Latest user direction, 9 September 2026:** open each stop automatically at
a consistent viewport position, with scroll entrances for text and pictures.
The live `/lab/effects` was inspected and its `settle` and `frameOpen` demos
replayed. Their registered effects are reused here, with `arrive` on copy.

The same native accordion becomes a CSS-sticky reading screen when the desktop
viewport fits the longest stop. Each stop gets 100vh of scrolling, six spans
in total; one stop is open, and reverse scrolling returns to previous stops.
A fixed outer span means changing a disclosure cannot shift the scroll positions
that select it. The track translates so every active row lands at the same y.
`itineraryStep` moves measured rows and `stageArrival` brings in the title as
whole lines, copy as blocks and the held picture through a right-edge clip.

The original 1040px grid, type, badges, chevrons, dotted rules, 30px panel gap
and 500 x 400px picture stay. In the held layout, row padding is 24px, the
heading-to-list gap is 24px and top padding responds from 32px to 112px. This
is the deliberate viewport-fit amendment to the earlier exact Figma spacing:
at 1440 x 900 even the longest stop fits without cutting copy or adding a
nested scroller. The section retains 164px after the reading screen.

The transition channel is active during each handover; text and media remain
quiet within the frame. There is no wheel lock or velocity snap. Clicking the
next summary goes to its reading span; Arrow Up/Down and Home/End support
keyboard navigation. Normal Tab leaves the section. Reduced motion and no JS
retain immediate native disclosures. Mobile and short windows retain the
original document layout, with text/picture entrances when motion is enabled.
Widths are measured again after resize; content that cannot fit uses the normal
layout instead of clipping. The module is `src/lib/motion/wonder-itinerary.ts`.

**Production / viewport correction, 9 September 2026.** Live and production
builds could fall back on a fresh 1440 × 900 load, then recover after resize:
the first measurement did not wait for fonts used only in closed panels.
The module now requests those existing font faces before measuring. The
880px height gate is removed. On desktop, a stop taller than its reading
window adds that overflow to its 100vh leg: 20vh seated, scroll through the
excess content, then 80vh held at the foot. Text sizes and photo dimensions
stay unchanged. Forward/reverse scroll and keyboard destinations use the
measured leg boundaries. Mobile, reduced motion, no JavaScript and windows
too short for a heading plus a readable strip retain native disclosures.
This supersedes the short-window and all-stops-must-fit fallback above.

### 07 · Before you come — convert, do not decorate

Informational and the first conversion point, so it stays nearly still:
`hold`, with `arrive` on the four fact cells and the eyebrow. The one moving
thing is the call to action, which gets a single attention beat once the
section has settled on screen. Not a loop. A pulsing button on an evergreen
band is the fastest way to make a page look like an ad.

### 08 · Where you sleep — the quiet twin of §03

Same instrument, lower volume: `frameOpen` on the two cards at `scale: 1`.
The heading and body arrive first. Two cards, so no `emanate`. A spread of
two is just a stagger. The 9 September 2026 image-quality pass removed the
6% parallax and overscale: the supplied photographs contain people and have
limited resolution. The frame opens around a held image, then `hold` leaves
it still. The cards have no text overlay, so the dark scrim was removed too.

### 09 · What it is like out here — the landscape, and no sweep

Built with the `ground` sweep this plan asked for, and **removed the same day
on user report**: drawn as a translucent evergreen band rising up the foot of
the plate, what it actually read as was a green film over the sunset. A wipe
belongs between two grounds, and there is no join here for it to happen at.

Latest user direction, 9 September 2026: reuse §05's exact landscape module,
markup helpers and animation. The sunset fills the viewport, the heading and
list hold in the same reading position for 80vh of additional scroll, and mouse
movement adds the same tilt and drift. The following Hosts wave enters only
after that hold releases. Reduced motion, touch and tall-content fallbacks
match §05. **The page has no `ground` sweep.**

### 10 · Your hosts — the pointer answers

The interaction the direction asks for, with the corollary that governs it:
**portraits hold still.** The picture never scales, drifts or tilts under the
pointer. What answers is everything else.

- Hovering or focusing a person dims the rest of the card toward 0.28 and
  brings their name up. That is `dim`, the effect testimony uses, and it is the
  right one here: it is a person, so the treatment is attention rather than
  animation.
- **The name sits at chest height, not over the face** (corrected 9 Sep 2026 on
  user report). A label across somebody's face is worse than no label at all.
- On touch and on keyboard every name is simply present. No hover-only
  information.
- **Three of the eight in frame are named** — Uncle Vincent, Graham and
  Suzanne, identified by the user on 9 September 2026 and recorded as
  `hostsPeople` in `src/content/wonder-media.ts` with their positions in the
  photograph. The other five are not named and must not be guessed at, so the
  interaction has three hotspots and the rest of the group carries nothing.
  Hovering a named figure lifts that one name; no empty label ever appears over
  anyone else.
- Whether those three are content to be named on the page is still Steve's
  question at presentation. The mechanism is built, the names come from one
  content module, and removing a person is a one-line change.

### 11 · From Country — arrive, then get out of the way

`emanate` on the three story cards. The existing hover lift and chevron slide
stay as they are; they are already right. Marra Wonga stays `frame` grade, so
nothing touches the image plane.

### 12 · Come and see it — hand over

`dissolve` from the roasted ground into the footer, so the page ends by handing
on rather than stopping. The blob buttons keep their own hover. The held
brochure button stays visibly held (R14).

## New grammar — added to the table, 9 September 2026

Two entries, both variants of a row that already exists, not new rows. Both sit
under *the guide leading the eye*, beside `routeDraw`, and both are in
[`motion-grammar.md`](motion-grammar.md) now rather than pending.

1. **`inkFlare`** — the last frame of a draw: the ink thickens to 2.3× and
   lights. One CSS custom property per route per frame, inherited by every ink
   in that route's group, so the per-frame cost does not scale with the
   hundreds of ink paths. The glow is a drop-shadow toggled at a threshold and
   never animated — `filter` stays out of the per-frame path. §02 and §04.
2. **`brushFill`** — three overlapping passes of the continuous up-and-down
   stroke, each with its own width and seeded jitter on where a stripe sits and
   where it starts and stops. The first pass leaves gaps, the third closes
   them. Every pass is wider than the stripe spacing, because a gap inside a
   painted area reads as a hole rather than as brushwork. §02.

Everything else on this page cites a row as it stood.

## What was built, in the order it was built

1. §04's crop fix, verified at 1920 and again at 1440.
2. Grammar entries for `inkFlare` and `brushFill`.
3. §02 — 320vh, `triad`, the ragged brush, the flare.
4. §04's flare and copy arrival. Its staged draw was not attempted, above.
5. §05 and §09, the two landscapes, and §09's change of ground.
6. §03, §08, §11 — the three card sections, one instrument shared.
7. §06's index and §10's pointer.
8. §07 and §12, the two conversion points, deliberately quietest.

**One shared bug, fixed at the source.** Every entry effect on the page is a
`from` tween, so building one writes opacity 0 immediately and the copy stays
hidden until the timeline plays. Three separate ways of never playing showed up
in one afternoon: a trigger that killed itself having missed its crossing, a
document that grew after the triggers measured it, and an eyebrow animated
twice — where the second `from` recorded the first's hidden state as its
destination and dutifully animated from 0 to 0. All three are fixed in
`compose.ts` and `wonder.ts` with the reasoning in comments. The rule they add
up to: **no entry effect may leave content invisible**, whatever the reader
did to arrive.

**Left open for review.** The five consecutive media screens at §01–§05 break
the ledger's own "no channel three deep" rule. It is recorded as an exception
in [`scenes.md`](scenes.md) and flagged for Ivy rather than quietly allowed —
the alternative is to make §03 or §05 quiet, and both read worse.

Every module registers through `src/lib/motion-controller.ts` with
`init`/`destroy`, writes transform, opacity, `clip-path` and
`stroke-dashoffset` only, and specifies spans in vh. Reduced motion gets the
finished state, never a slower version.
