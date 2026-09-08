# The deck — About's scroll model

*Built 8 September 2026 on JC's direction: **"think of it like a PowerPoint presentation."**
Scoped to `/about` and to no other route.*

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

Nine of the ten seams work this way. The tenth — Get in touch into the footer — is left flowing,
because the footer is site chrome and does not belong to the page.

The reader's experience is three zones, in this order, per slide:

| | The reader is doing | The page is doing |
|---|---|---|
| **Reading** | Ordinary scroll, all the way to the end of the slide | Nothing. This is where the slide's own interior motion will live |
| **The hold** | Scrolling on, and the view has stopped | Charging. The wave crest rises at the fold and is pulled taller by every notch |
| **The transition** | Nothing — the wheel is held | Playing the hand-off, once, whole |

There is no fourth state. A seam is never somewhere the page can rest: a charge that is not
finished drains away and the reader is returned to reading, and a transition that has begun
always completes.

## Why the page stops rather than slows

The first three attempts at this were all thresholds — scroll far enough into the seam and it
commits, not far enough and it snaps back. Every one of them felt broken, and the reason is
worth writing down: **a threshold is invisible.** The reader has no way to know where it is,
so the same gesture produces a transition on Tuesday and a rubber-band on Wednesday, and the
page reads as unreliable rather than as designed.

Stopping is legible. The page halts, the wave stands up, and the reader learns in one seam that
scrolling now does something other than scroll. Nothing is hidden and nothing is guessed at.

## The wave is the gauge

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

## The new row

The grammar's hard rule is that every animation cites a row of its table, and adding a behaviour
means adding the row first. The deck cites nothing that exists. It needs this row, and this is
the proposal:

| Narrative role | What it does on screen | Easing / duration | Sketch | Plate | Effect |
|---|---|---|---|---|---|
| **the page holding its ground** | Scroll arrives at the end of a section and stops. The page waits, visibly, until the reader commits to the next one. | `country` · held, then 0.9s | — | — | `coverSeams` |

It is a real role and not a variant of *a change of ground*: that row is about how one ground
replaces another, and this one is about **the page refusing to continue**. The nearest thing in
the existing table is `hold` — stillness with a name — and the deck is `hold` made conditional
on the reader.

## What it costs

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
where the site deliberately keeps native scrolling, the seams flow and the transitions play on
entry. The deck is a pointer-and-wheel behaviour, and mobile gets the page it always had.

**It is not the page's motion.** This is the layer between sections. The interiors — §03's pinned
question, the F9 releases, the cards, and Group G's traveller, still ▲ Leonard Mickelo — are
ledgered in `scenes.md` and unbuilt. The hooks are in the markup waiting for them.

## The numbers

Tuning lives in `coverSeams`. These are feel, not law, and none of them came from the frame:

| | | |
|---|---|---|
| Charge to fill a gate | a fifth of a viewport, in wheel distance | about two notches |
| Crest ready height | three fifths of full | the rest is the reader's pull |
| Roll distance | a sixth of the tiled period | further read as a conveyor belt |
| Transition | 0.9s | wheel held throughout |
| Charge drain | begins after a short pause | partial charge is never banked |

---

*Reviewed by: — · Signed off: —*
