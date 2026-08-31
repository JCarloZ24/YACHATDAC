# The motion grammar

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
| **the world opening** | A frame's clip opens while the image counter-scales, so the picture is revealed rather than resized. | `machine`, scrubbed | M2 | P3 | `frameOpen` |
| **being drawn in** | A slow scrubbed push toward the subject. Transform-origin points at what matters. | `machine`, scrubbed | M1 | P2 | `pushIn` |
| **a change of ground** | The new ground sweeps over the old as a scaleY wipe. | `machine`, scrubbed | X7 lineage | P7 | `ground` |
| **time handing over** | Two stacked plates cross-dissolve. One whole frame hands to another. | `country` · 0.82s | A5 | **P9** | `dissolve` |
| **the guide leading the eye** | The traveller flies a leg; its trail draws behind by mask reveal. | `country` · 2.0s | G1 + G3 | — | `guide` ¹ |
| **a person speaking** | Words undim as they are spoken. No movement at all. Dim state 0.28. | `quiet` · 0.55s · 0.045 stagger | Y2 | P6 | `dim` |
| **accumulating** | Things add up: a count advances, a mark fills, an index lights. | `country` / `machine` | X3 | — | `stepCounter` `vesselFill` `flattenReveal` |
| **the rest** | Nothing moves, for a stated duration. | — | brief §3 | **P1, P8** | `hold` |

¹ `guide` is specified and permitted but **not built**. Dropped from the current pass on Ivy's
call, 2026-08-30: the traveller was a fix for flatness, and flatness is being fixed by density
instead. The row stays because the behaviour is still designed and permitted.

## Variants — more effects, same rows

Ten rows, thirty effects. That is deliberate: a row is a **meaning**, and several effects
can serve one meaning at different volumes. This is how the vocabulary grows without the grammar
diluting — the brief caps the table at six to eight roles and it is right to.

| Row | Quiet | Loud |
|---|---|---|
| the world opening | `frameOpen` (in its frame) | `breakOut` (frame gone), `aperture` (through a letterform), `escape` (a grid cell becomes the screen, and comes back) |
| being drawn in | `pushIn` (one plane) | `plateParallax` (layers inside one frame), `bleed` (past the edge) |
| a change of ground | `ground` (one sweep) | `groundRamp` (across four screens), `waveHandoff`, `overlap`, `stickyIndex` |
| what endures | `settle` (lines) | `display` (chars), `ghostType` (behind everything), `knockout` (as a window) |
| what radiates | `arrive` | `emanate`, `triad`, `scatterResolve`, `mosaic`, `handoff` |

`scrimRamp` belongs to no row on its own: X5 is a legibility requirement that travels with
whatever media effect it accompanies, and it is non-negotiable wherever copy sits on a picture.

`escape` is `handoff` made reversible. `handoff` reparents the element, which is right for a
one-way continuity cut and wrong for anything a reader can scroll back out of; `escape` flies a
clone and leaves the real cell in place at opacity 0, so the grid behind it never reflows and the
card returns to exactly where it was. Both are Flip, and neither may be scrubbed — Flip measures
at trigger time, so a scrubbed Flip computed at one viewport width lands wrong at another. Pin
for a screen, run on enter, reverse on leave-back.

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
- **No count-up on figures of loss.** A number describing people who died or land taken is
  stated and held, never ticked upward like a sales metric.
- **No character splits on testimony.** Anything a person actually said is split by line or
  word. Characters are for short display headings only.
- **No layout properties, ever.** Transform, opacity and `clip-path` only. Animating
  `width`/`height`/`top`/`left` is what makes an "immersive" site stutter, and one janky frame
  costs more reverence than any effect buys.
