# Design files — placeholder

*Last updated: 26 August 2026*

**Current milestone: Lo-Fi Wireframes — complete, 26 August.** Target was 21
August 2026, so it landed five days late: the client's v3 prototypes arrived on
24 August, three days *after* the deadline, and invalidated parts of what had
been drawn. The correction pass ran on 26 August and is done.

**Ten frames, one row, every route covered.** Hi-fi can start. The full spec is
in [`lofi-spec.md`](lofi-spec.md); the canvas itself is deliberately quiet, and
what is still open and who holds it is at the foot of this file and in the
review sheet.

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

### Frames on the canvas — ten, complete

All in [Yachatdac Exploration](https://www.figma.com/design/Qk35pAX0sz2ntNRXceY7Gb/Yachatdac-Exploration),
one page, 1440 wide, in a single row in site order at a pitch of 2220, every
frame top-aligned at `y=0`. Scrolling right walks the site. Marc's imported
hi-fi and UI kit are untouched, at negative Y.

**The full spec now lives in [`lofi-spec.md`](lofi-spec.md)** — one section per
page, with the motion sketch IDs, the span arithmetic, the decisions behind each
page, and what is still held on it.

| # | Page | x | vh | Sections |
| --- | --- | --- | --- | --- |
| 1 | Home | 0 | 903 | 7 |
| 2 | Wonder | 2220 | 1363 | 14 |
| 3 | Truth | 4440 | 1704 | 21 |
| 4 | Living Work | 6660 | 986 | 9 |
| 5 | The Record | 8880 | 1123 | 10 |
| 6 | About | 11100 | 1106 | 11 |
| 7 | Our People | 13320 | 814 | 9 |
| 8 | Partnerships | 15540 | 423 | 5 |
| 9 | Connect | 17760 | 393 | 6 |
| 10 | Legal | 19980 | 295 | 6 |

**Every route in `src/app` now has a frame.** Every frame's section heights sum
to its frame height exactly, every section name carries its span in `vh`, and
all 243 CTA and link nodes carry their destination as `→ /path`. Twenty distinct
destinations, every one of them a route that exists. Verified programmatically;
the overlap scan returns zero, as does the clipped-text scan.

### The canvas is deliberately quiet

The wireframes carried **66,700 characters of annotation** — about 11,000 words,
which read as "there is an enormous amount still to resolve" when the opposite
was true. That is now **6,100 characters, a 91% cut**, and the rule is simple:

> **Pink means one thing: a person has to fill this in.** Suzanne's wording, a
> name, a number, a permission, a status label. Nothing else is pink.

46 pink notes remain across ten frames, in 21 distinct messages. The ten SPEC
panels and the whole margin-note column are gone — their content is in
[`lofi-spec.md`](lofi-spec.md), in full rather than summarised.

### The header — Marc's geometry, D2's items

Built to Marc's `Navbar / 1 /` component (`127:5287`): 1440x130, 64px side
padding, container 1312x40, his own logo vector, nav links gap 32, actions gap
16, pill CTA. Items are D2's — Wonder · Truth · Living Work · The Record ·
About, with *Get in touch* as the button.

On nine frames. **Home carries none**, per D24, with a single line saying the
first navigation is section 05.

### Type — change six styles, not six hundred nodes

**The font pass is now a styles job.** Every headline, eyebrow, CTA and body
node in the ten frames is **bound to a text style**. Change the family on the
style and every node using it updates at once. Nothing has to be selected by
hand.

| Style | Set its font to | Currently | Nodes |
| --- | --- | --- | --- |
| `Display/96` | **Block Berthold** Regular | Work Sans SemiBold | 9 |
| `Heading/64` | **Block Berthold** Regular | Work Sans SemiBold | 58 |
| `Card Title/32` | **Block Berthold** Regular | Work Sans SemiBold | 116 |
| `Eyebrow/Section-24` | **Bantayog Sans** ExtraBold | Work Sans ExtraBold | 125 |
| `Eyebrow/Footer-12` | **Bantayog Sans** ExtraBold | Work Sans ExtraBold | 69 |
| `Nav & CTA/16` | **Bantayog Sans** ExtraBold | Work Sans ExtraBold | 237 |
| `Accent/Scroll-32` | **GoodDog Plain** Regular | Work Sans SemiBold | 1 |
| `Eyebrow/Hero-32` · `Nav & CTA/16 Bold` | as named | Work Sans | 0 — kit only |

**Each style carries the instruction in its own description**, visible in the
Figma styles panel, so it travels with the file rather than living in this
document.

`Body/*` and `Link/*` are **already correct** — Work Sans is the real body face.
Their descriptions say so. Do not change them.

⚠ **Do it in the Figma UI, on a machine with the fonts installed. Never through
the plugin API.** Figma cannot measure a font it cannot load, and Block
Berthold, Bantayog Sans and GoodDog Plain are all unavailable there. Setting
them from the API collapses every node to a 14px-tall box and the nodes then
cannot be repaired in place — that happened on 26 August and cost a full rebuild
of 108 headlines. It is the reason the styles ship pointing at Work Sans.

**What changed on 26 August to make this possible**

- The eight brand styles were **repointed to loadable Work Sans stand-ins** at
  matching weight, line height and tracking, so applying them is safe.
- **1,099 nodes were bound** — 615 headline-tier, 484 body and link. Binding
  moved nothing: not one frame changed height, because the stand-ins already
  carried each style's metrics exactly.
- **`Eyebrow/Footer-12` was created.** The kit had no 12px eyebrow, which is why
  the 69 footer labels had nowhere to point.
- **Eight nodes were mislabelled** — four `EB24 →` and four `CT32 →` that were
  actually 16px ExtraBold. Relabelled to `CTA16 →` rather than restyled, so the
  design is unchanged.
- **`__probe`** — a diagnostic style left behind by the earlier font
  investigation — was deleted.

**120 text nodes are deliberately unbound.** They are the annotation layer: the
Inter notes, the `[ held ]` slots and the 11–13px captions. They are not design,
and they should not take a brand face.

**Layer names still carry the prefix** — `D96 →` `H64 →` `CT32 →` `EB24 →`
`CTA16 →` `EB12 →` `Scroll32 →` — so the binding stays auditable at a glance.
They are now a record of what a node *is*, not a to-do list.

⚠ **Expect reflow when the real fonts land.** The stand-ins match on size, line
height and tracking, but Block Berthold and Bantayog Sans have different glyph
widths, so line breaks will move and some sections will change height. That is
normal and is hi-fi's business — but it does mean **the `vh` figures in the
frame names are measured against the stand-ins**, and want re-checking once the
faces are real.

### Still open on the frames

- **Living Work's five status labels** are unconfirmed (R14) and drawn in oxide.
  Rainbow Credits' body is empty.
- **Wonder stage 03 keeps a held story-wall image slot** — R10.
- **Our People** should not go to `in-review` until the consent question is
  answered. Eight of nine cards are unnamed.
- **The Record's on-request response time** is the last unfilled field on that
  page (R23), owned by August per D10.
- **The Acknowledgement slot** is empty pending Suzanne (R1); ICN and ABN blank
  (R15).

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
