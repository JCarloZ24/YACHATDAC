---
name: yachatdac-motion
description: Scroll animation, motion and 3D system for the YACHATDAC website. Use this skill whenever the task involves GSAP, ScrollTrigger, scroll-driven animation, parallax, pinned sections, hero or loader sequences, image sequences, WebGL/three.js scenes, reveal or entry animations, or any motion on the YACHATDAC site — including when the request just says "animate this section", "make the hero move", "add a scroll effect", "build sketch M2", or names a sketch ID like A1, B5, D4, E1, L4, T3 or X6. Also use it when reviewing or refactoring existing motion code, or when deciding whether an animation is appropriate at all. Consult it before writing any animation code for this project, not after.
---

# YACHATDAC motion system

Motion for the YACHATDAC website (Yambangku Aboriginal Cultural Heritage and Tourism
Development Aboriginal Corporation, Iningai Country, Barcaldine QLD). The site tells a
sequence of narrative beats as the visitor scrolls, so animation carries meaning here —
it is not decoration, and a wrong choice can misrepresent cultural material.

Work in this order: **check the rules → resolve what to build → check permissions →
use a template → run the checklist.**

## 1. Hard rules

These override the prompt. If a request conflicts with one, say so and offer the
nearest acceptable alternative rather than complying.

**Cultural**

- Never animate, mask, reveal, scrub, reconstruct, 3D-scan, particle-ise or draw-on
  imagery of cultural sites — Marra Wonga, rock engravings, the teaching wall, any
  heritage site. These are shown as still photographs with their story in words.
  Motion turns a record into a spectacle, which is the specific harm to avoid.
- Never reproduce, imitate or generate Aboriginal iconography in code. That includes
  procedurally drawn concentric circles, dot fields, meandering paths with waypoints,
  U-shapes and animal tracks. If a design calls for artwork, it comes from the
  commissioned artist as a supplied asset — never from generated geometry.
- Never place heritage site coordinates, names or precise locations in map data,
  markup, comments or source files.
- Artwork elements move only where `references/permissions.md` records a yes.
  Absent an entry, treat every artwork element as static.

**Accessibility**

- Every behaviour ships a `prefers-reduced-motion` branch that **cuts** — instant
  final state. Never a slowed-down or "gentler" variant. Pinning is disabled entirely.
- Focus order follows the DOM. Pinned sections must not trap keyboard users.
- Copy over media needs ≥4.5:1 contrast measured against the brightest frame.

**Performance**

- Per-frame work touches `transform` and `opacity` only. Flag anything animating
  `width`, `height`, `top`, `left` or `filter` on every frame and rewrite it.
- One WebGL section on the entire site. Lazy-loaded after first paint, paused
  off-screen via IntersectionObserver, disposed on teardown, poster-frame fallback.
- Device pixel ratio capped at 1.5 in any canvas or WebGL context.

## 2. Resolve what to build

If the request names a sketch ID (A1–A4, B1–B5, C1–C3, D1–D4, E1–E4, F1–F2,
L1–L4, M1–M7, T1–T6, X1–X6, Y1–Y3), read `references/sketch-library.md` for its
spec, tier and status before writing anything.

If it doesn't, pick from the library rather than inventing a behaviour, and say
which one you picked. The library exists so the site has a limited motion
vocabulary instead of a different idea per section.

**Tiers.** Tier 1 is homepage only: pinning, scrubbed media, parallax, WebGL,
signature moments. Tier 2 is every other page including all CMS-generated pages:
entry staggers and hover states only. A CMS template must not be able to produce
Tier 1 motion.

**Budget.** Two signature moments on the homepage, total. If a third is requested,
ask which existing one it replaces.

## 3. Check permissions before building

`references/permissions.md` is the live status board for anything that needs a
human decision. Read it whenever the task touches artwork, land or terrain, or
cultural material. Two entries are currently open and both affect real work:

- **Artwork motion** — vectorised artwork from Leonard Mickelo exists but no motion
  permission is recorded. Use artwork as static imagery only. Group L behaviours
  (radial emanation, scale triad, hand irregularity, dark ground) are derived from
  composition rather than motifs and are cleared to build now.
- **Land and terrain detail** — D4 (contour map) and E1 (terrain dolly) are approved
  in principle for the About and Research pages, pending confirmation of how much of
  the property may be shown and at what detail. Until that's confirmed: build with
  abstracted or generic terrain, no real elevation data for Turraburra, no place
  names, no boundaries, no waypoint labels.

When a task is blocked on one of these, build the mechanism against placeholder data
and note clearly what needs swapping in once permission lands.

## 4. Build from a template

Copy from `assets/` rather than starting fresh — the templates already contain the
reduced-motion branch, the teardown, and the correct easing tokens.

| File | Use for |
|---|---|
| `assets/motion-controller.js` | Always. Central registry — every timeline registers here so reduced motion, route changes and teardown are handled in one place. |
| `assets/section-scrub.js` | Any scroll-linked section without pinning. Most work. |
| `assets/section-pin.js` | Pinned step-throughs and horizontal panoramas. |
| `assets/webgl-section.js` | The one WebGL section. Lazy import, DPR cap, IO pause, dispose, poster. |
| `assets/image-sequence.js` | Frame-scrubbed sequences and scrubbed video. |
| `assets/motion-tokens.css` | Palette, durations, easing curves as CSS custom properties. |

Every section module exports `init()` and `destroy()`. No orphaned ScrollTriggers,
no timelines created outside the controller.

Read `references/patterns.md` for the GSAP idioms this project uses — scrub vs
trigger-once, grid and radial stagger, FLIP handoffs, snap on pinned steps, and the
`gsap.matchMedia()` shape for the reduced-motion branch.

Read `references/tokens.md` for durations, staggers, parallax ratios, scroll spans
and the palette. Don't invent values; the whole point of the token set is that
sections built by different people feel like one site.

## 5. Run the checklist before returning

```
[ ] reduced-motion branch present, and it cuts rather than slows
[ ] no pin without a documented scroll span in vh
[ ] text split by line or word, never by character
[ ] once:true on all Tier 2 entry animations (no re-trigger on scroll-up)
[ ] contrast >= 4.5:1 for copy over media
[ ] transform/opacity only in the per-frame path
[ ] destroy() removes triggers, disposes GL resources, cancels rAF
[ ] no generated Aboriginal iconography, no heritage coordinates
[ ] permissions.md checked if the task touched artwork, land or cultural material
```

State which items you verified. If one can't be satisfied, say why rather than
quietly dropping it.

## Style notes

The brand attributes are grounded, honest, organic, human, respectful, awakened.
In motion terms that means: things settle and never rebound; loaders report real
progress; layers move at uneven rates; the visitor sets the pace; motion finishes
before reading starts; and surprise is rationed. Easing is `country` for anything
large and `quiet` for interface furniture — never overshoot or elastic, which read
as playful against this brand.

Truth-telling sections should move less than the rest of the site, not more.
