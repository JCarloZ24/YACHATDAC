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
- WebGL scenes are lazy-loaded after first paint, paused off-screen via
  IntersectionObserver, disposed on teardown, poster-frame fallback — and at most
  **one renderer live at a time**, enforced by the scene manager. Several scenes
  per site is fine; simultaneous contexts are not.
- Device pixel ratio capped at 1.5 in any canvas or WebGL context.

## 2. Resolve what to build

If the request names a sketch ID (A1–A5, B1–B6, C1–C4, D1–D4, E1–E5, F1–F2,
L1–L4, M1–M8, T1–T7, X1–X8, Y1–Y7), read `references/sketch-library.md` for its
spec and status before writing anything.

If it doesn't, pick from the library rather than inventing a behaviour, and say
which one you picked. The library exists so the site has a shared motion
vocabulary instead of a different idea per section — the vocabulary is now large,
but it is still a vocabulary.

**The doctrine (F7 — the immersive mandate, 2026-08-29).** The client directed the
site to be cinematic everywhere; the old tier system and homepage budget are
superseded — see decision F7 in `docs/decisions-and-risks.md`. The rules now:

1. **Motion is the default.** Every page has a motion script — an entrance, scroll
   choreography, and a transition out. A static section is the exception and
   states its reason (e.g. testimony being read).
2. **The Loud Channel rule.** Every screen declares ONE loud channel — **media**,
   **type**, or **transition** — and keeps the other two quiet. Plain text means a
   big media or transition moment; plain media means big type. This is the pacing
   law; it is what keeps "cinematic everywhere" from becoming noise.
3. **One verb per page.** Every page gets a verb (Truth *descends*, Living Work
   *accumulates*, Home *opens*…) and its cinema is built from that grammar.
   Contrast between pages comes from different grammars, not motion vs stillness.
4. **Per-page engineering budgets, not per-site caps.** Document spans in vh; the
   60fps target and the media budgets are the real limits. Several WebGL scenes
   may exist; at most one is live at a time.
5. **CMS surfaces get the full standard kit** — route transitions, split-text
   reveals, hover system, media reveals — as a bounded set an editor cannot break.
   Signature modules remain importable only from hand-built page hosts.

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
| `assets/webgl-section.js` | WebGL scenes. Lazy import, DPR cap, IO pause, dispose, poster — one renderer live at a time via the scene manager. |
| `assets/image-sequence.js` | Frame-scrubbed sequences and scrubbed video. |
| `assets/motion-tokens.css` | Palette, durations, easing curves as CSS custom properties. |

Every section module exports `init()` and `destroy()`. No orphaned ScrollTriggers,
no timelines created outside the controller.

Read `references/patterns.md` for the GSAP idioms this project uses — scrub vs
trigger-once, grid and radial stagger, FLIP handoffs, snap on pinned steps, and the
`gsap.matchMedia()` shape for the reduced-motion branch.

For GSAP API detail beyond these patterns (plugin options, timeline mechanics,
`gsap.utils` helpers), the `gsap-*` skills are the reference. The rules and process
in this document still take precedence — they govern what gets built and how, not
just GSAP syntax.

Read `references/tokens.md` for durations, staggers, parallax ratios, scroll spans
and the palette. Don't invent values; the whole point of the token set is that
sections built by different people feel like one site.

## 5. Run the checklist before returning

```
[ ] reduced-motion branch present, and it cuts rather than slows
[ ] no pin without a documented scroll span in vh
[ ] narrative/testimony copy split by line or word only (chars only on short display headings, aria intact)
[ ] once:true on all entry animations (no re-trigger on scroll-up)
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
progress; layers move at uneven rates; the visitor sets the pace; and motion
finishes before reading starts. Easing is `country` for anything large and `quiet`
for interface furniture — never overshoot or elastic, which read as playful
against this brand. Adventurous means scale and choreography, not bounce.

Truth's cinema is the descent — its dissolves, darkening grounds and rail carry
the chronology, and they are built at full cinematic weight. Testimony is read in
stillness the page chooses; under the doctrine that stillness is a stated
exception, not a smaller ration.
