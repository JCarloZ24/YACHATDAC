# Sketch library

Every motion behaviour available on this project. When a task names an ID, build
that behaviour. When it doesn't, pick the closest match and say which you chose.

Status values: **build** = no blockers · **check** = a constraint or dependency
noted in the row · **hold** = needs sign-off recorded in `permissions.md` ·
**no** = recommended against, decline and offer the alternative.

## Contents

- Group A — Sky Clock (time of day as the scroll spine)
- Group B — Etched (marks that arrive and stay)
- Group C — Walking Together (continuity devices)
- Group L — Artwork-derived (composition only)
- Group X — Core plumbing
- Group M — Media in motion
- Group D — Depth without WebGL
- Group T — Photographs in space
- Group E — WebGL
- Group Y — Type and surface
- Group F — Argue against

---

## Group A — Sky Clock · Tier 1

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| A1 | Sky as background clock | Page-length scrub interpolates a sky colour ramp and moves a light source along an arc. Content layer has no animation. | build — pair with A2 or it's wallpaper |
| A2 | Sky coupled to content | Same ramp, but narrative beats advance on the same clock. Pinned, ~250vh, three beats at 0 / .33 / .66 with overlapping fades. | build |
| A3 | Escarpment parallax | Four cut-out layers at ratios 0.15 / 0.4 / 0.7 / 1.0, scrubbed y-transform. | build — needs masked layers from the photo library |
| A4 | Day-to-night cross-dissolve | Three clips, opacity keyframed with plateaus: 70% hold, 30% transition. | check — transcode to ~1.2MB loops, never ship masters |

## Group B — Etched · Tier 1

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| B1 | Stroke reveal | `pathLength="1"` + `strokeDashoffset` 1→0, staggered across paths. Interface diagrams, data, supplied artwork only. | check — never on cultural imagery or imitation motifs |
| B2 | Stagger resolve | Index-based stagger over a grid or point set, scale 0→1 with overlap. Cap ~120 DOM nodes. | check — must not resolve into figurative or cultural imagery |
| B3 | Erosion reveal | Animated `mask-image` with a soft stop. Uncovers rather than fades. | build — not on anything needing context to accompany it |
| B4 | Pinned horizontal panorama | Pin over a tall spacer, translate x by `scrollWidth - innerWidth`. ~250vh. | hold — subject matter must not be cultural-site material |
| B5 | Type that settles | Line-level mask, `yPercent` 110→0, 90ms stagger, `expo.out`. Workhorse for every heading. | build |

## Group C — Walking Together · Tier 1

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| C1 | Continuous line | One fixed SVG path, dashoffset on page progress, nodes lit per beat. Doubles as progress and nav. | hold — a meandering line with waypoints reads as iconography; needs sign-off, or use a plain vertical rule with no meander |
| C2 | Shared element handoff | FLIP: measure state A and B, animate the delta with transforms only. One per site. | build |
| C3 | Concentric ripple | Staggered scale + fade on nested rings. | no — concentric circles are Aboriginal iconography and appear in the logo. Offer footage of the springs instead |

## Group L — Artwork-derived · Tier 1 and 2

Derived from the composition of the apparel artwork — origin, scale tiers, rhythm,
palette. Reproduces no motifs, so these are clear to build now.

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| L1 | Radial emanation | Stagger by distance from a chosen origin, not DOM order. `stagger:{from:idx, grid:[r,c]}`. Pick the origin per section. | build |
| L2 | Scale triad | Three arrival tiers — anchor 0, mid .25, detail .45 — each with internal micro-stagger. Layout rule as much as motion. | build |
| L3 | Hand irregularity | Seeded per-element delay jitter ≤40ms and ≤2px offset. Deterministic, never random per load. | build |
| L4 | Dark ground, warm figure | Dark surface as default. Content arrives by gaining brightness/saturation rather than fading from light. | build — site-wide decision, confirm before committing component library |

## Group X — Core plumbing · Tier 1 and 2

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| X1 | Honest loader | Progress from real asset decode. Panel lifts, hero already laid out beneath. Hard cap 2.5s, once per session. | build — never fake the number |
| X2 | Scroll cue | 2.4s yoyo, killed permanently on first scroll. Only ambient loop allowed above the fold. | build |
| X3 | Pinned step-through | Pin + scrub + `snap:1/(n-1)`. ~320vh for four steps. One pinned section per page. | build |
| X4 | Entry stagger | `start:"top 82%"`, `once:true`, y16 + fade, 60ms stagger. The Tier 2 default; CMS pages inherit it. | build |
| X5 | Legibility scrim | Directional scrim between media and copy, strength tied to copy presence. Test against brightest frame. | build — non-negotiable wherever copy sits on media |
| X6 | Reduced-motion twin | Same code path, timelines built at duration 0, pins never created. | build — ships with every behaviour |

## Group M — Media in motion · Tier 1 and 2

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| M1 | Scrubbed push-in | scale 1→1.14, y −4%, linear against scroll. Transform-origin toward the subject. | build |
| M2 | Frame expand + counter-scale | `clip-path: inset()` opens while the image scales 1.3→1. Most reusable behaviour on the site. | build |
| M3 | Grade shift | Filter + blend overlay, cool/desaturated → full colour. Two or three per page max. | check — filters are costly on mobile |
| M4 | Slice reveal | 9 masks, image offset inside each, stagger from edges. | check — gallery bands only, never portraits |
| M5 | Mosaic collapse | Per-tile start/end rects, Flip.fit against a hero target, others fade in last third. | build |
| M6 | Scroll-scrubbed video | `currentTime` from a scrubbed proxy. 1s keyframe interval, ≤12s, ≤1080p, muted, playsinline, poster. | check — showpiece, one per site |
| M7 | Image river | Duplicated track, modulo wrap, scroll velocity added to base drift. | check — ambient; pause off-screen, kill under reduced motion |

## Group D — Depth without WebGL · Tier 1

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| D1 | Layered dolly | 3–5 planes at fixed z inside `perspective`, one camera transform on the parent. | build |
| D2 | Image sequence | Preloaded frame set drawn to canvas from a scrubbed index. ~72 frames ≈5MB; preload 12, stream rest. | check — needs a constant-radius drone orbit; confirm before scoping |
| D3 | Depth-map parallax | Depth map drives displacement. Keep total displacement 10–20px or edges tear. | build |
| D4 | Contour map with waypoints | Contours as SVG paths with stroke reveal; waypoints as DOM elements over the top. | hold — approved in principle for About/Research; land detail level unconfirmed. Build abstracted, no real DEM, no place names, no coordinates |

## Group T — Photographs in space · Tier 1

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| T1 | Curved plane | Strips rotated on Y + pushed on Z to form an arc. Max ~25° across the plane. | build |
| T2 | Photo drum | Faces at `rotateY(i*45°) translateZ(r)`, parent rotates. `backface-visibility:hidden`. | check — showpiece; mobile falls back to a horizontal scroller |
| T3 | Diorama tilt | Depth planes in one `preserve-3d` container; rotate the container. Pointer influence ≤2°, off on touch. | build |
| T4 | Corridor | Planes alternating x, spaced on z, turned inward. Pin, ~250vh, fade near and far planes. | build — strongest showpiece; reduced motion becomes a two-column gallery |
| T5 | Panel fold | Two halves hinged on outer edges, ±88° on Y, brightness ramp as they open. | build |
| T6 | Displacement transition | Noise texture drives mix threshold between two images. Needs WebGL. | check — only worth the dependency if used more than once |

## Group E — WebGL · Tier 1 · one section on the site, total

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| E1 | Terrain dolly | Plane displaced by heightmap; camera position and target scrubbed. Wireframe reads as survey data — stay on that side of the line, not photoreal game terrain. | hold — same land-detail confirmation as D4. Build with generic terrain until then |
| E2 | Point cloud | Scanned mesh as GL points, density scrubbed. | no — capture can't happen before launch, and scanning cultural material is a reproduction decision that isn't ours |
| E3 | Camera path | CatmullRom curve, camera at t looking at t+0.04. Zero roll, level horizon, reverses cleanly. | check — rides on E1, so inherits its hold |
| E4 | Sky environment light | One directional light on an arc + gradient environment map; scene relights consistently. | build — if used, A1 becomes redundant; pick one |

## Group Y — Type and surface · Tier 1 and 2

| ID | Behaviour | Spec | Status |
|---|---|---|---|
| Y1 | Image knockout headline | `background-clip:text`, background-position scrubbed. Solid-colour fallback required. One per site. | build |
| Y2 | Word emphasis | Per-word opacity ramp, dim state 0.28 not near-invisible. No movement. | build — right for quoted speech, wrong for marketing copy |
| Y3 | Tracking caption | Anchor stored in image-space coords; label in screen space; connector drawn between. Label is real DOM text. | build |

## Group F — Argue against

| ID | Behaviour | Why not |
|---|---|---|
| F1 | Object viewer | Products only — packaged goods, publications. Never artefacts, tools or anything held by community. Post-launch anyway. |
| F2 | Ambient particles | Fire on this site means fire-stick farming, a practice and a responsibility. Embers as sparkle behind a headline trivialises it. Use footage for atmosphere. |
