# Design files — placeholder

**Current milestone: Lo-Fi Wireframes.** Target 21 August 2026.

Design happens in Figma; this folder holds the links, exports and decisions
that the codebase needs to stay in step with it.

## Missing — needed here

| File | Owner | Milestone | Status |
| --- | --- | --- | --- |
| Figma link — lo-fi wireframes | Ivy (Jasmin Ivy C. Fedilo) | Lo-Fi Wireframes, 21 Aug | ⏳ not supplied |
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
