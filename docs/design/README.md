# Design files — placeholder

*Last updated: 26 August 2026*

**Current milestone: Lo-Fi Wireframes — complete, 26 August.** Target was 21
August 2026, so it landed five days late: the client's v3 prototypes arrived on
24 August, three days *after* the deadline, and invalidated parts of what had
been drawn. The correction pass ran on 26 August and is done.

**Ten frames, one row, every route covered.** Hi-fi can start. What is still
open, and who holds it, is at the foot of this file and in the review sheet.

Design happens in Figma; this folder holds the links, exports and decisions
that the codebase needs to stay in step with it.

## Missing — needed here

| File | Owner | Milestone | Status |
| --- | --- | --- | --- |
| Figma link — lo-fi wireframes | Ivy (Jasmin Ivy C. Fedilo) | Lo-Fi Wireframes, 21 Aug | ✅ **Complete, ten frames** — [Lo-fi — YACHATDAC](https://www.figma.com/design/Qk35pAX0sz2ntNRXceY7Gb/Yachatdac-Exploration?node-id=0-1) |
| Figma link — hi-fi mockups | Marc | Hi-Fi Mockups Approved, 31 Aug | ⏳ not started |
| Figma link — UI design system / component library | Marc | — | ⏳ not supplied |
| Relume Figma kit link | Marc → JC | — | ⏳ not supplied |
| Whiteboard sketches — scroll and animation behaviour | JC | Lo-Fi Wireframes | ⏳ not supplied |

Add each as a link in this file rather than committing exports, except where a
static reference is genuinely useful (spacing specs, redlines) — those go in
`docs/design/exports/`.

## Timeline

| Date | Milestone |
| --- | --- |
| 21 Aug 2026 | Lo-fi wireframes complete |
| 28–31 Aug 2026 | Hi-fi mockups approved |
| 14 Sep 2026 | Website launch |

Sprint cadence is twice-weekly meetings.

## Lo-fi scope

Four pieces, per the roadmap:

1. Lo-fi wireframes for the Heritage-style homepage sections — Ivy
2. Lo-fi wireframes for inner pages (About, informational) — Marc
3. Whiteboard sketches for scroll and animation behaviour — JC
4. Team review and sign-off

**⚠ In practice item 2 has been done entirely by Ivy, not Marc.** About, The
Record, Our People, Partnerships, Connect and the legal pages were all drawn on
the lo-fi canvas. The roadmap split above has not been formally changed — it is
recorded here so the divergence is visible rather than discovered, and so the
hours land against the right name.

### Frames on the canvas, 26 August — **ten, complete**

All in [Yachatdac Exploration](https://www.figma.com/design/Qk35pAX0sz2ntNRXceY7Gb/Yachatdac-Exploration),
one page, 1440 wide.

**The canvas was reflowed on 26 August into a single row in site order**, at a
pitch of 2220 (1440 frame + 560 annotation column + 160 gutter), every frame
top-aligned at `y=0`. Scrolling right walks the site. It replaces a two-row grid
that had started colliding — Truth grew past the row height and was sitting on
top of Our People, its spec panel and its title. Rows cannot collide again
however tall a page grows. Marc's imported hi-fi and UI kit are untouched, at
negative Y.

**Every frame's section heights sum to its frame height exactly**, and every
section name carries its span in `vh`. That is the handoff contract R7 rests on
— if it stops being true, pinning gets retrofitted into a layout with no room
for it. Verified programmatically after every edit; the overlap scan returns
zero.

| # | Page | x | vh | Sections | State |
| --- | --- | --- | --- | --- | --- |
| 1 | Home | 0 | 903 | 7 | ✅ v3. Belonging beat corrected to v3's copy. **No header band** — D24 |
| 2 | Wonder | 2220 | 1410 | 15 | ✅ v3. Section 06 rebuilt as the **six named stay stages**; two unsourced sections cut |
| 3 | Truth | 4440 | 1704 | 21 | ✅ v3 descent. **Tail cut** (235vh) — one `#partner`, not two |
| 4 | Living Work | 6660 | 992 | 9 | ✅ v3. **Eight-step section cut** (562vh) — not in any draft |
| 5 | The Record | 8880 | 1155 | 10 | ✅ v3 — both facet axes per D21, 13 cards |
| 6 | About | 11100 | 1091 | 11 | ✅ already matched v3 |
| 7 | Our People | 13320 | 820 | 9 | ✅ eight of nine people cards visibly held |
| 8 | Partnerships | 15540 | 433 | 5 | ✅ minimal — stops four live links being dead ends |
| 9 | **Connect** | 17760 | 442 | 6 | ✅ **drawn new** — the most-linked destination on the site |
| 10 | **Legal** | 19980 | 265 | 6 | ✅ **drawn new** — three routes, one template |

**The set is complete.** Every route in `src/app` now has a frame.

### The header, and the footer

**A header is now drawn on nine of the ten frames** — it had been missing from
all of them, which meant no page could reach any other except through the
footer. **D2** defines it: *Wonder · Truth · Living Work · The Record · About*,
with *Get in touch* as a button. Home is the exception, per **D24**: it carries
no header band and an annotation saying where the header appears.

The footer carries v3's four purpose columns — *Pages / Organisation / Get in
touch / Follow* — on all ten frames. The Acknowledgement slot stays visibly
empty pending Suzanne (R1); ICN and ABN are blank (R15). All 160 footer links
were renamed on 26 Aug to the `→ /destination` convention the CTAs use, so the
whole canvas encodes destinations one way.

### The fact audit, 26 August

Every frame was read **back** against its source — the v3 drafts and JC's
content modules — rather than only being drawn from them. 178 body sentences and
every date, quantity and proper noun were traced to a source file.

**Five passages were found that appear in no client draft.** All five traced to
`src/content/lofi/*` — the prototype namespace — which the wireframes had been
quietly drawing from alongside the real sources. All five were **removed, not
softened**:

| Where | What | Why it went |
| --- | --- | --- |
| Truth · Eromanga | *"A seven-metre plant eater walks its shoreline, and will not be found until 1963"* | A palaeontological claim in no draft. Replaced with `truth.ts`, which is v3 verbatim |
| Truth · lore floor | *"one figure at the southern end of the shelter is the pursuer himself"* | An **unsourced claim about a sacred site**. Replaced with the client's own Seven Sisters text |
| Wonder · escarpment | *"A labyrinth of weathered caves and blowholes"* | Invented imagery. v3 says only that the escarpment runs along the edge of the Aramac Range |
| Living Work · roads | *"about twenty hours of grader time"* | An unsourced quantity. v3 lists a grader under Machinery with no hours against it |
| Living Work · fire | black ash *"is a biochar in its own right"* | An added technical assertion. v3 says only that rangers look for black ash rather than scorched ground |

Two further sections were cut entire because they exist in no draft and
duplicated content already on the same page: Living Work's *"Why we are
publishing this"* + the eight-step *"How we built this"* (562vh), and Wonder's
*"Why we say guesting"* + the standalone first-night band (156vh).

⚠ **The "what travels / what stays here" framing died with the Living Work cut.**
It is a knowledge-sovereignty device rather than decoration, and it is worth
finding a home for. It has none in v3.

### Type — the font pass is done

**This was wrong in the previous version of this file.** Brand faces *can* be set
through the MCP: the text styles already point at the right families, and a node
can be created in Work Sans, given its words, then have the real style applied.

**123 stand-in nodes across all ten frames were converted on 26 August** — every
`D96 →`, `H96 →`, `H64 →`, `CT32 →`, `EB24 →` and `CTA16 →` now carries its real
text style. **Not one frame changed height**, because the stand-ins already
carried the target line-height and tracking.

⚠ **One exception, and it is the only font work left in the file.** The 69
12-pixel footer eyebrows (named `EB12 ·`) are still Work Sans ExtraBold. The kit
has no 12px eyebrow style and one cannot be created from this environment,
because Bantayog Sans will not load here. Either select those nodes and set the
family, or add **Eyebrow/Footer-12** — Bantayog Sans ExtraBold, 12px, 150% line
height, 8% tracking.

### Open on the frames, for the review

Shorter than it was. Nine decisions closed on 26 August — see
[`../decisions-and-risks.md`](../decisions-and-risks.md).

- **Living Work's five status labels** are unconfirmed (R14) and drawn in oxide.
  Rainbow Credits' body is empty. CR5 is a layout question routed to Ivy.
- **Wonder stage 03 keeps a held story-wall image slot** — R10, and the hold
  survived the section rebuild. The permission does not travel with a redraw.
- **Our People** should not go to `in-review` until the consent question is
  answered. Eight of nine cards are unnamed.
- **The Record's on-request response time** is the last unfilled field on that
  page (R23), and now has an owner — August, per D10.

**Resolved since the last version of this file**, and no longer open:

- ~~Two `#partner` anchors on Truth~~ — the tail was cut; one anchor remains.
- ~~Truth's ending~~ — Wattanuri stays the floor, recorded as a deliberate
  departure from v3 rather than an unresolved question.
- ~~Wonder's two sections not in v3~~ — cut, with the reason on the frame.

## What wireframes must express

Motion is structural on this site, not a finishing layer. Two things have to be
decided at wireframe stage or they get retrofitted badly:

- **Scroll spans in `vh`, not `px`.** A pinned step-through needs ~320vh for
  four steps; a pinned panorama ~250vh; a standard section 100vh. If the span
  is not in the layout, the pin has nowhere to live.
- **Which sections are Tier 1.** Tier 1 (pinning, scrubbing, parallax, WebGL,
  signature moments) is homepage-only. Everything else — including every
  CMS-generated page — is Tier 2: entry staggers and hover states. The budget
  is **two signature moments on the homepage, total**.

Behaviours come from the sketch library in
`.claude/skills/yachatdac-motion/references/sketch-library.md`, by ID. Naming
the ID in the wireframe is what makes the handoff to front-end unambiguous.

## Reference sites

Sourced by Ivy from the GSAP showcase, confirmed by Marc as the design
direction:

- **Heritage** — the structural base for homepage sections
- **No Art Music**

The client's Game-of-Thrones-style 3D map concept was assessed as too extreme
to implement and is not in scope. The agreed direction is more restrained:
static foreground, moving/changing background on scroll, fades rather than
drastic effects. The imagery and video are already strong enough — they do not
need heavy animation or gradients to land.

## Homepage vs inner pages

The homepage is the animation-heavy, visually rich page, with an intro
video/loading sequence in front of it. Inner pages stay simple and
straightforward. That split is deliberate and should be visible in the
wireframes.
