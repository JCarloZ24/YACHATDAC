# Design files — placeholder

*Last updated: 26 August 2026*

**Current milestone: Lo-Fi Wireframes.** Target was 21 August 2026 — **overdue**.
The client's v3 prototypes landed on 24 August, three days after the deadline,
and invalidated parts of what had been drawn. A correction pass is running now
against a 28–31 August hi-fi start.

Design happens in Figma; this folder holds the links, exports and decisions
that the codebase needs to stay in step with it.

## Missing — needed here

| File | Owner | Milestone | Status |
| --- | --- | --- | --- |
| Figma link — lo-fi wireframes | Ivy (Jasmin Ivy C. Fedilo) | Lo-Fi Wireframes, 21 Aug | ✅ [Lo-fi — YACHATDAC (Home + 3 pillars)](https://www.figma.com/design/Qk35pAX0sz2ntNRXceY7Gb/Yachatdac-Exploration?node-id=0-1) |
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

**⚠ In practice item 2 has been done by Ivy, not Marc.** About and The Record
were drawn on the lo-fi canvas, and Our People and Partnerships are being added.
The roadmap split above has not been formally changed — it is recorded here so
the divergence is visible rather than discovered.

### Frames on the canvas, 26 August

All in [Yachatdac Exploration](https://www.figma.com/design/Qk35pAX0sz2ntNRXceY7Gb/Yachatdac-Exploration),
one page, 1440 wide. Ivy's frames sit at and below the origin; Marc's imported
hi-fi and UI kit sit roughly 10,000px above it.

| Page | State |
| --- | --- |
| Home | ✅ reconciled to v3 — Living Work beat cut, ★M2 moved to Wonder, Truth beat grown to 250vh for its four-step sequence |
| Truth | ✅ the accepted v2 shape (D20). Descent still owes a v3 reconciliation |
| Wonder | ⏳ rebuild — 8 sections against v3's 15 |
| Living Work | ⏳ rebuild — the step set was replaced in v3 |
| About | ⏳ reconcile |
| The Record | ⏳ reconcile — 13 cards, two facet axes per D21's holding position |
| Our People | ⏳ not drawn |
| Partnerships | ⏳ not drawn — four live links point at it |
| Connect, legal | ❌ no frame from either designer |

**Brand faces cannot be set through the Figma MCP** — the sandbox sees only
Figma's hosted Google Fonts. Thirteen text styles carry Work Sans stand-ins with
the target face in each style's description; new headline-tier text is named by
its intended style (`H64 →`, `CT32 →`, `EB24 →`, `EB12 →`, `CTA16 →`) so the font
pass can find it. `Body/*` and `Link/*` are already correct — Work Sans is the
real body face.

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
