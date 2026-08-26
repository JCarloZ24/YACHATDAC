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
| 2 | Wonder | 2220 | 1419 | 15 |
| 3 | Truth | 4440 | 1704 | 21 |
| 4 | Living Work | 6660 | 986 | 9 |
| 5 | The Record | 8880 | 1123 | 10 |
| 6 | About | 11100 | 1106 | 11 |
| 7 | Our People | 13320 | 814 | 9 |
| 8 | Partnerships | 15540 | 423 | 5 |
| 9 | Connect | 17760 | 446 | 6 |
| 10 | Legal | 19980 | 295 | 6 |

**Every route in `src/app` now has a frame.** Every frame's section heights sum
to its frame height exactly, every section name carries its span in `vh`, and
all 111 CTAs carry their destination as `→ /path`. Verified programmatically;
the overlap scan returns zero.

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

### Type — one job left, and it is a manual one

⚠ **This section said the opposite on 26 August, and it was wrong.**

Applying the real brand text styles from the MCP environment **breaks the file**.
Figma cannot measure text in a font it cannot load, and Block Berthold and
Bantayog Sans are not loadable there — every converted node collapsed to a
14px-tall box with 64px or 96px type inside it. 108 headlines were left
overlapping the copy beneath them. Worse, a node carrying an unloadable font
cannot be written to *at all* afterwards, so they could not be repaired in
place; all of them had to be rebuilt.

**Every headline in the file is now a Work Sans stand-in**, measuring and laying
out correctly, and named by the style it stands in for:

| Prefix | Style | Stand-in |
| --- | --- | --- |
| `D96 →` | Display/96 | Work Sans SemiBold 96 |
| `H64 →` | Heading/64 | Work Sans SemiBold 64 |
| `CT32 →` | Card Title/32 | Work Sans SemiBold 32 |
| `EB24 →` | Eyebrow/Section-24 | Work Sans ExtraBold 24 |
| `CTA16 →` | Nav & CTA/16 | Work Sans ExtraBold 16 |
| `EB12 →` | *(no style in the kit)* | Work Sans ExtraBold 12 |
| `Scroll32 →` | Accent/Scroll-32 | Work Sans SemiBold 32 |

Each stand-in already carries the target style's line-height and tracking, so
applying the real style does not reflow anything.

**The one outstanding job:** select by layer-name prefix in the Figma UI, on a
machine with the fonts installed, and apply each style. Figma re-measures
correctly there. `Body/*` and `Link/*` are already right — Work Sans is the real
body face. The kit has no 12px eyebrow, so `EB12` either needs
**Eyebrow/Footer-12** adding (Bantayog Sans ExtraBold, 12px, 150% line height,
8% tracking) or the family set directly.

**Do not apply text styles from the MCP environment.** That is what broke it.

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
