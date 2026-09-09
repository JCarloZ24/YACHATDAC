# The deck — gated section hand-offs

*Built 8 September 2026 on JC's direction: **"think of it like a PowerPoint presentation."**
Extended to `/truth` by direct user direction on 9 September 2026.*

This is not one of the three artefacts. `spine.md` says what the site argues, `motion-grammar.md`
says what each behaviour means, `scenes.md` says what each screen does. This document exists
because About's scroll model answers to none of them cleanly, and a deviation that lives only in
code review is a deviation nobody signed.

---

## What it is

A section is a **slide**. It is read at ordinary scroll from nothing to whole. When its foot
meets the viewport's foot — the reader has seen all of it — the page **stops**. Further scrolling
does not move the view; it charges the seam. A full charge **plays** the hand-off: the finished
slide holds while the next one rises over it, and the next slide seats flush against the top of
the screen. Scrolling back up runs the same hand-off backwards.

About gates nine of its ten seams. Truth's twenty ledger beats resolve into sixteen decks:
Ahead's "What is being built" and "Work with us" share one deck; TODAY's image chapter and
Iningai Rangers record share one; "The site is studied with its owners" and "Research &
discovery" share another; and the escarpment image and 1902 count share a fourth, leaving
fifteen gated joins.
Both pages leave the final content-to-footer join flowing, because the footer is site chrome and
does not belong to either page.

Each paired group is one whole viewport deck, not two cards sharing a transition. Its combined
content track moves inside a clipped inner viewport over the deck's read runway. Ahead's slide
itself remains unclipped so its incoming wave can overhang the hero. Only after both entries in a
pair have passed does the shared deck reach 100% and expose its magnetic buffer.

TODAY uses the same cover law as About's Breath → WhatWeDo seam inside one deck. Its full image,
scrim and heading form one outgoing underlay while the original Iningai Rangers record rises from
below as one evergreen panel, Wave / Divider attached to its leading edge. The heading's authored
foot aligns with the wave at rest. It follows the wave one-for-one until its crown reaches the
viewport crown, clamps there without resizing or reflowing, and is then covered by the higher-z
wave and ground. At 100% the record's foot aligns with the viewport foot;
there is no second content translation.

The escarpment → 1902 deck repeats that construction without moving the held image plane. The
count's charcoal ground and existing divider rise together over the dissolve pair, progressively
closing the visible image window. The divider receives no independent root transform: it moves
because it belongs to the incoming content track.

**How much image survives is arithmetic, not art direction** (9 September 2026). The deck
translates a cover by exactly its own height and lands it bottom-flush, so the photograph keeps a
band of `100svh − panel`. The count's panel had grown to 958px on a 900px screen: it covered the
image *and* overshot, pushing its own crest 58px off the top, so the beat ended on bare charcoal
with no wave and no photograph — which is why it stopped reading like TODAY, whose 792px panel and
104px wave add up to almost exactly one screen. The count's panel now carries a
`min-h-[calc(100svh-7rem)]` floor and sits at 798: ground and crest together close the image, with
the whole wave on screen. **Adding content to that panel pushes the crest off the top again**, and
nothing will warn you.

⚠ **The count's exit divider used to sit at that track's foot, and that was wrong.** It was in
flow, at the foot of the OUTGOING content, riding the escarpment slide's track — so it travelled
as far as that track did, parked at the pinned slide's bottom edge, and was then covered by the
1840s rising over it rather than leading it. Two rules it broke: a divider is seated on the
section it introduces (`scenes.md`, the hero→Ahead note), and a wave inside a
`[data-truth-deck-viewport]` can never overhang its join because the deck clips that box. It now
sits on the 1840s article, leading, full-bleed out of the reading column, carrying the
`data-count-wave` anchor the trail rail measures its restart from.

**The hand-off scrolls; it does not overlay** (9 September 2026, user direction). A cover used to
be legible on colour alone: a section was replaced by one arriving in a *different* colour, so
"covered" announced itself. Since D26 put the page on one egg-white ground it does not — an
identically-coloured slide sliding over a stationary one reads as text swapping on a static page,
with the old section's half-covered lines still sitting behind the new heading.

So the outgoing travels a full viewport too, and the pair move together: the outgoing's foot stays
against the incoming's head for the whole hand-off, which is exactly what ordinary scrolling looks
like. `exitVh` on `createGatedDeck`, default 100. **The deck keeps its hold and its gate** — the
page still stops at the end of a section and waits to be committed — but the transition between
two sections is now a scroll rather than a presentation overlay.

The displacement is **capped each frame at the incoming slide's measured penetration**, which is
what makes the lockstep exact rather than approximate. The exit runs over the cover span —
whatever the layout between two runways happens to be — while the incoming always arrives over
exactly one viewport of scroll. The two disagree wherever a section carries closing padding, and
an uncapped exit outran the arrival and opened a strip of bare page along the foot: measured, 46px
at the seabed seam and a 7px hairline at three others, one of them a dark-to-light join where it
showed. Reading the incoming's own rect per frame makes "the outgoing never rises faster than the
incoming arrives" true by construction, so a seam cannot regress by gaining padding later. Every
seam on the page now measures a gap of exactly 0 through its cover.

`exitVh` below 100 turns the hand-off back into a parallax, and 0 restores the original stationary
cover. Those are the only two other settings that mean anything.

The reader's experience is three zones, in this order, per slide:

| | The reader is doing | The page is doing |
|---|---|---|
| **Reading** | Ordinary scroll, all the way to the end of the slide | Nothing. This is where the slide's own interior motion will live |
| **The hold** | Scrolling on, and the view has stopped | Charging the route instrument. About pulls its wave; Truth holds its already-complete wave and charges the rail marker |
| **The transition** | Nothing — the wheel is held | Playing the hand-off, once, whole |

There is no fourth state. A seam is never somewhere the page can rest: a charge that is not
finished drains away and the reader is returned to reading, and a transition that has begun
always completes.

Truth's opening hero has a deliberately short 20vh reading zone. Its one-viewport image and copy
remain sticky and still while that span clears the independent site navbar. The 20vh magnetic
buffer begins at its foot, and only a completed charge begins the first cover.

## Why the page stops rather than slows

The first three attempts at this were all thresholds — scroll far enough into the seam and it
commits, not far enough and it snaps back. Every one of them felt broken, and the reason is
worth writing down: **a threshold is invisible.** The reader has no way to know where it is,
so the same gesture produces a transition on Tuesday and a rubber-band on Wednesday, and the
page reads as unreliable rather than as designed.

Stopping is legible. The page halts, the wave stands up, and the reader learns in one seam that
scrolling now does something other than scroll. Nothing is hidden and nothing is guessed at.

## The instrument belongs to the page

About's wave is its gauge. Truth uses the chronology rail instead: the single traveller follows
the actual lateral wander and tangent of the full-height SVG guide. The hero marker begins below
its "Start from the beginning" cue; subsequent beats reset to the top and travel to the bottom.
It remains at the bottom while the 20vh buffer charges, then transfers continuously along the
SVG guide from the outgoing foot to the incoming head as the cover plays. There is no endpoint
jump. It carries no number or attached progress bar. On rewind the inverse is true. The marker's
read ScrollTrigger fades it over the final fifth of the 1950s, keeps it absent through the
escarpment and count, and restores it over the opening fifth of the 1840s. It fades permanently
over the final fifth of Before people. The visible RECORD strand follows the same silences.

Marc's Wave / Divider remains structural on Truth. It carries the incoming ground with the
cover; its root receives no GSAP transform. The reusable inner ink takes About's 0.6→1 pull and
short roll, but on Truth that motion is scrubbed over the last 20vh of the outgoing section's
ScrollTrigger span. It reaches full at 100% and stays unchanged throughout the buffer. This keeps
Truth's instrument as the record rather than making the wave a second charge gauge.

### About: the wave is the gauge

Marc's `Wave / Divider` was furniture. Here it is the instrument the reader reads:

- **At the dock** it swells up out of the seam line to a ready height — the page announcing that
  it has stopped on purpose.
- **Through the hold** every notch of the wheel **pulls it taller**. Pause and it relaxes back
  down as the charge drains. The wave answers the hand: *there is more here, keep pulling.*
- **At full height** the transition releases, and the crest rolls — right as the next slide
  covers, left as a rewind uncovers.

Two rules govern it absolutely, and both were bought with defects:

> **No transform is ever written to the wave element itself.** Its seat is a utility class
> compiled onto `transform`; the first inline write deleted it and the wave vanished for a whole
> build. The ink inside the SVG is what moves.

> **Once the crest is up, it never leaves the screen by vanishing.** It grows only at the fold,
> where the seam edge is still below the viewport. Anywhere the edge is visible, the crest is
> already full — otherwise the reader sees a flat white line where a wave belongs, which was the
> defect that took the longest to name.

The ink is a mirrored, tiled strip of the component's own exported path, so it can roll a short
distance and still land pixel-identical to the drawn resting shape. Every state a reader can
stop on is the shape in the Figma file.

## The grammar row

The grammar's hard rule is that every animation cites a row of its table. Direct user direction
for Truth on 9 September 2026 admits this row:

| Narrative role | What it does on screen | Easing / duration | Sketch | Plate | Effect |
|---|---|---|---|---|---|
| **the page holding its ground** | Scroll arrives at the end of a section and stops. The page waits, visibly, until the reader commits to the next one. | `country` · held, then 0.9s | — | — | `coverSeams`, `createGatedDeck` |
| **the page holding its ground**, the interior scrub | A pinned section animates against its own reading span rather than against a viewport it never crosses. | `machine`, scrubbed `read.start`→`read.end` | SCR-02 | — | `createGatedDeck` + module recipes |

It is a real role and not a variant of *a change of ground*: that row is about how one ground
replaces another, and this one is about **the page refusing to continue**. The nearest thing in
the existing table is `hold` — stillness with a name — and the deck is `hold` made conditional
on the reader.

## About deviations still awaiting review

Four deviations, each real, each needing a decision rather than an explanation.

**1. Nine pins where the budget is one.** `scenes.md` is explicit that §03 is "the page's argument
and the only pin", and the site convention is one per page. The deck spends a pin at every gated
seam. §03's own pin — the 300vh question — is still unspent and still owed.

**2. The score's waves were furniture; these perform.** `REF · SCORE · 05` draws five static
`Wave / Divider` seams. These grow, get pulled by the reader, and roll. The resting shape is
unchanged, but a wave that responds to input is a different object from a wave that marks a join.

**3. The hard cut is now a covered cut.** The score says of 03 → 03b: *"Nothing carries. That is
the point, and it is the only hard cut on the page."* It is now a gated hand-off like the others,
carrying no wave and no rule — charcoal covering charcoal — so the character survives even though
the mechanism does not.

**4. Every screen now has a transition event.** F7 says each screen turns up exactly one channel,
and the ledger gives About only two transition screens, §06 and §09. A locked, played hand-off at
every seam is arguably a transition moment on all eleven. The build's own assertion still passes,
because the deck's motion is not made of listed loud effects — which means the rule is satisfied
mechanically while the question stays open. **This is the one that most needs Ivy's answer**, and
it is not a code question: either the deck is exempt because it is page furniture rather than
screen content, or the ledger's channel column needs rewriting for this page.

Two smaller ones, same status: §03's arrival gradient proportions were retimed away from the
drawn frame so the photograph reads clear on the seated screen, and overshoot is spent on §06's
timeline beats, which the ledger did not allocate.

## What it does not do

**It does not trap anyone.** The accessibility rule in `MOTION-SYSTEM.md` requires a skip
mechanism, and the deck's is its own grammar: a downward key at a hold is read as the whole
charge and plays the transition, an upward key opens the hand, a large native jump — a screen
reader moving focus — is honoured as intent instead of being fought, and a live region tells
assistive tech how to move on. Browse-mode readers were never affected: the rest state is the
finished state, so the page is complete with no motion at all.

**It does not exist under reduced motion.** No pins, no holds, no smooth scroll — the page is the
static build it was before this work, which is what X6 asks for and not a lesser version of it.

**It does not exist without smooth scroll.** The hold needs Lenis to make a stop total. On touch,
where the site deliberately keeps native scrolling, sections flow normally and no magnetic
transition or production progress indicator is created. The deck is a pointer-and-wheel
behaviour, and mobile keeps native page flow.

**It is not the page's motion.** This is the layer between sections. The interiors — §03's pinned
question, the F9 releases, the cards, and Group G's traveller, still ▲ Leonard Mickelo — are
ledgered in `scenes.md` and unbuilt. The hooks are in the markup waiting for them.

## Interiors: the deck owns geometry, not content (9 September 2026)

A deck breaks the ordinary way of writing interior motion, and it does it silently, which is the
dangerous part. Once a slide is pinned at `top top` with `pinSpacing: false`, its contents never
cross the viewport again. A `top 88% → top 38%` trigger on a heading inside it therefore measures
a journey that does not happen: the span is spent while the slide is still climbing **behind the
slide covering it**. The animation runs, correctly, to completion — off-screen. Then nothing at
all moves for the 125vh the reader spends actually reading the section.

Nothing errors. Every trigger fires. The page simply performs its choreography where nobody can
see it, and reads as though it had none. Truth shipped in that state and the gap was reported as
"the animations are missing" rather than as "the animations are early", which is worth recording
because the symptom points away from the cause.

So the deck now hands its clocks out:

```ts
createGatedDeck({
  root: "[data-descent-root]",
  slides: "[data-truth-slide]",
  onSlideSpans: bindTruthScenes,   // ({ index, slide, runway, read, cover })[]
})
```

`onSlideSpans` is called once, inside the deck's own matchMedia branch, after every read clock
exists; any teardown it returns is run on revert. Interior beats bind with
`start: () => read.start, end: () => read.end` and are authored as **fractions of that span**, so
a section's storyboard reads as `.10–.28` rather than as pixel offsets. `read.start`/`read.end`
must be read lazily — both move on refresh.

The deck also stamps `[data-deck-active]` on the root. That is the other half: the flow-path
modules (`truth-descent.ts`, `truth-descent-v2.ts`) check it and stand down for whatever the deck
has taken over, because two scrubs writing one plane is worse than either alone. Modules
initialise in registration order and `matchMedia.add` is synchronous, so the flag is set before
they run.

**The unpinned path is unchanged and still correct.** Touch, under 1024px and no-Lenis have no
pins, sections cross the viewport normally, and viewport-relative triggers are exactly right
there. Two paths, one of which runs at a time.

⚠ **This sharpens the fourth deviation below rather than answering it.** Every screen already had
a transition event; now every screen also has interior motion on its own clock. The mitigation is
that interior beats stay inside each scene's declared channel in `scenes.md` and stay quiet — the
type-channel scenes get no camera push at all, and the four `none` scenes get nothing. That is a
discipline, not a resolution, and Ivy's answer is still what settles it.

## The numbers

Tuning lives in `coverSeams` and `createGatedDeck`. These are feel, not law, and none of them
came from the frame:

| | | |
|---|---|---|
| Charge to fill a gate | a fifth of a viewport, in wheel distance | about two notches |
| Truth hero read runway | one fifth of a viewport behind the continuous hero pin | clears the navbar while the hero itself remains still |
| Truth later-beat read runway | five quarters of a viewport behind one continuous viewport pin | gives every non-hero beat the same heavy 0–100% travel; overflow moves on the clipped inner track and the runway can never appear as blank content |
| Crest ready height | three fifths of full | the rest is the reader's pull |
| Roll distance | a sixth of the tiled period | further read as a conveyor belt |
| Transition | 0.9s | wheel held throughout |
| Charge drain | begins after a short pause | partial charge is never banked |

---

*Last updated: 9 September 2026 · Reviewed by: —*
