# Motion System Specification

A working vocabulary of web motion, effects and transitions — written to be handed to Claude Code as a build reference.

**How to use this:** every motion has a stable ID (e.g. `LAY-01`). In Claude Code you say *"implement `LAY-01` shared-element morph for the project grid, tokens from MOTION-SYSTEM.md §1"* and it has everything it needs: the trigger, the parameters, the library, and the failure modes.

### Precedence — read this before treating anything below as a rule

This document has three tiers, and they do not carry equal weight.

1. **Principles** (§0 "the pattern underneath", §5 "restraint") — these govern. Don't break them.
2. **Tokens** (§1) — these are *defaults*, measured from reference footage so the starting point is considered rather than arbitrary. Reach for them first.
3. **The catalog** (§2) — this is *vocabulary*, not a menu. It exists to name things, not to bound them.

**Deviation is expected.** If a section calls for a spring where `power2.5.out` is the default, use a spring. If a motion isn't catalogued here, build it. If a listed effect is wrong for the content, don't use it — see ART-DIRECTION.md for material this site specifically shouldn't apply.

The constraint is coherence, not compliance: motion across the site should feel like it came from one hand. A deliberate departure that serves the content is correct. Reaching for `ENT-01` on every section because it's listed first is the failure this document exists to prevent.

When you do deviate, say so in a comment with the reason. That's how the system learns rather than drifts.

**Companion file:** `ART-DIRECTION.md` covers what the site is, how content is staged, and what not to do. When the two conflict, ART-DIRECTION wins — it knows the subject matter.

---

## 0. Reading the reference set

Eleven files were supplied; two were byte-identical, so ten unique references. Each was decomposed into frame sequences and measured. What follows in §1 is derived from those measurements, not from convention.

| Ref | Subject | Signature motion | Catalog IDs |
|---|---|---|---|
| `sandhillstudio…0303` | Netflix-style film site | Accordion slats → hero → scattered gallery → reassembly | `LAY-01` `LAY-02` `LAY-03` `ENT-05` |
| `sandhillstudio…0488` | Mexico travel site | Parrots crossing hero, zoom-out layout assembly, synced bg+card swap | `AMB-03` `TXT-06` `LAY-04` `IMG-07` |
| `ohheytherelexi…0422` | Habital architecture | Velocity-driven barrel warp on a drag carousel, wordmark interstitial | `IMG-01` `INT-06` `NAV-01` |
| `manjeshuidesigner…0386` | India culture portfolio | Cylindrical 3D carousel with rotateY perspective, vertical type | `SPA-01` `TXT-04` `LAY-04` |
| `Spline 3D` | Danu Ventures | Scroll-driven 3D ring that morphs through sections | `SPA-02` `SCR-06` `SCR-02` |
| `Parallax Figma` | Hydration product | Multi-depth parallax, product descends on scroll | `SCR-01` `SCR-03` |
| `UX Animation Examples` | Planet site | Hero sphere scales/repositions, camera flies *into* planet to change section | `SCR-11` `SCR-06` `ENT-03` |
| `AQMv…` | peachweb | WebGL hero scenes, iridescent glass, bento grid | `SPA-05` `AMB-01` |
| `AQOR…` | Origin Objects | Editorial luxury: serif display, slow scale-on-scroll reveals | `TXT-01` `SCR-12` `IMG-06` |
| `AQP6…` | Dark immersive agency | Particle formation, dissolve, chromatic glitch | `SPA-06` `IMG-03` `IMG-04` |

### The pattern underneath

Strip the surface and three ideas produce almost everything above:

1. **Elements persist across states.** Nothing is destroyed and recreated. The same image is a slat, then a hero, then a gallery tile. This is the single highest-value technique in the set and the hardest to fake.
2. **Scroll is a timeline, not a jump.** Position in the document drives a continuous parameter — rotation, scale, camera, colour — rather than firing discrete "reveal" events.
3. **Motion carries physics.** Things lag, overshoot, bow and settle. The barrel warp in `IMG-01` exists purely to communicate velocity.

Chase those three. The specific effects are interchangeable.

---

## 1. Foundations — measured tokens

### 1.1 Easing

The hero expansion in `sandhillstudio…0303` (2.0–2.8s) was measured frame by frame, tracking element width across 24 frames, then fitted against standard curves:

| Candidate | RMSE vs measured |
|---|---|
| **`power2.5.out`** | **0.022** |
| `power2.out` | 0.050 |
| `cubic-bezier(.33,1,.68,1)` | 0.051 |
| `power3.out` | 0.052 |
| CSS `ease-out` | 0.093 |
| `expo.out` | 0.182 |
| `linear` | 0.219 |

Measured progress: **25% → 0.527, 50% → 0.801, 75% → 0.935**.

That is a *slightly* sharper attack than `easeOutQuad` and softer than `easeOutCubic`. It is deliberate, and it is the difference between motion that feels designed and motion that feels defaulted. CSS `ease-out` is visibly wrong — it's the flattest common curve and the most overused.

```css
:root {
  /* Workhorse. Anything a user triggered: expand, open, reveal. */
  --ease-out:        cubic-bezier(0.33, 1, 0.68, 1);
  /* Gentler. Ambient or secondary motion. */
  --ease-out-soft:   cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* Aggressive. Elements arriving from offscreen. */
  --ease-out-strong: cubic-bezier(0.16, 1, 0.30, 1);
  /* Symmetric. Loops, ping-pong, ambient drift. */
  --ease-in-out:     cubic-bezier(0.65, 0, 0.35, 1);
  /* Exits only. Never for entrances — it feels like a stall. */
  --ease-in:         cubic-bezier(0.55, 0, 1, 0.45);
}
```

In GSAP use `power2.5` directly — it accepts fractional powers and is the exact measured curve:

```js
gsap.to(el, { width: 566, duration: 0.8, ease: "power2.5.out" });
```

**Never use `linear`** except for: continuous rotation, marquees, progress bars, and scroll-scrubbed values (where the scroll position is itself the easing).

### 1.2 Duration

Measured hero expansion: **0.80s** for a 375→566px transform. That is slower than most defaults and it is why the reference reads as expensive.

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 100ms | Colour change, focus ring |
| `--dur-fast` | 200ms | Button press, small toggle |
| `--dur-base` | 350ms | Card hover, dropdown, tooltip |
| `--dur-mid` | 600ms | Section reveal, modal open |
| `--dur-slow` | 800ms | Hero morph, layout change *(measured)* |
| `--dur-xslow` | 1200ms | Full page transition |
| `--dur-ambient` | 8–20s | Background loops, drift |

Rule of thumb: **duration scales with distance travelled and with area changed.** A 40px hover lift at 800ms feels broken; a full-viewport layout morph at 300ms feels cheap. If an element crosses more than half the viewport, it earns `--dur-slow` or longer.

### 1.3 Stagger

Measured from the gallery reassembly (6.9–8.6s), tracking entry onset per element:

```
element 1 → 0.400s   —
element 0 → 0.467s   +67ms
element 2 → 0.500s   +33ms
element 3 → 0.633s   +133ms
element 4 → 0.833s   +200ms
```

The gap **widens** as the sequence progresses. That is not a constant stagger — it's a stagger with easing applied to the *distribution*, which is what stops a cascade feeling mechanical.

```js
gsap.from(".tile", {
  y: 60, opacity: 0, duration: 0.8, ease: "power2.5.out",
  stagger: { each: 0.08, from: "start", ease: "power1.in" }
});
```

Ranges: **40–70ms** for tight lists, **80–130ms** for cards and galleries, **150–250ms** for 3–5 hero elements. Cap total cascade length at ~1.2s — past that the last item feels forgotten.

### 1.4 Transform discipline

Animate **`transform`** and **`opacity`** only. Everything else triggers layout or paint and drops frames.

- `width`/`height`/`top`/`left`/`margin` → use `scale`/`translate`, or FLIP (`LAY-01`)
- `box-shadow` → animate opacity of a stacked pseudo-element
- `filter: blur()` → real cost; keep the blurred layer small or pre-render
- `background-position` → `translate` a larger child instead

Set `will-change: transform` **on interaction start and remove it after.** Leaving it on permanently allocates GPU layers for every element and is worse than not using it.

### 1.5 Reduced motion — non-negotiable

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

That handles CSS. JS-driven motion must check the query itself:

```js
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

For scroll-scrubbed and 3D work, don't just disable — **substitute**. Replace a scrubbed camera move with a cross-fade; replace a particle formation with its final frame. The content must still be reachable.

---

## 2. The catalog

Each entry: **what it is → what triggers it → parameters → how to build it → cost.**

Cost is `L` (CSS only), `M` (JS animation library), `H` (WebGL/3D).

---

### ENT — Entrances and reveals

| ID | Name | Description |
|---|---|---|
| `ENT-01` | Fade and rise | Opacity 0→1 with `translateY(24–60px)`. The baseline. Use it *sparingly* — on every section it is the single clearest tell of generated work. Cost `L` |
| `ENT-02` | Mask wipe | `clip-path: inset()` animated from one edge. Content appears to be uncovered rather than to move. Far more expensive-feeling than `ENT-01`. Cost `L` |
| `ENT-03` | Defocus in | `filter: blur(12px)` → `0` with opacity. Seen on the planet reference's text. Reads as focus pulling. Keep blur ≤16px for perf. Cost `L` |
| `ENT-04` | Scale from centre | `scale(0.92)` → `1`. Pair with opacity; never scale from 0 (feels like a popup). Cost `L` |
| `ENT-05` | Cascade | `ENT-01`/`ENT-02` applied across siblings with eased stagger per §1.3. The gallery reassembly. Cost `M` |
| `ENT-06` | Line mask | Each text line in an overflow-hidden wrapper, translated up from below. The editorial standard. Cost `M` |
| `ENT-07` | Character decode | Letters cycle through random glyphs before settling. Technical/agency register only. Cost `M` |
| `ENT-08` | Stroke draw | `stroke-dashoffset` animated to 0. For logos, icons, diagrams, maps. Pairs with your vector assets. Cost `L` |
| `ENT-09` | Counter roll | Numbers count to value, or digit strips translate vertically. Cost `M` |
| `ENT-10` | Split curtain | Two halves part to reveal. Strong for page-load moments; too heavy to repeat. Cost `L` |

---

### SCR — Scroll-driven

| ID | Name | Description |
|---|---|---|
| `SCR-01` | Layered parallax | 3+ depth layers at differing scroll rates. Reference: forest / bottle / headline each on separate rates. **Foreground moves fastest.** Keep spread under ~30% or it detaches. Cost `M` |
| `SCR-02` | Pinned section | Section locks to viewport while an internal timeline scrubs. The core of the Spline reference. GSAP ScrollTrigger `pin: true`. Cost `M` |
| `SCR-03` | Scrubbed sequence | Scroll position indexes a pre-rendered frame sequence. **This is your Seedance pathway** — see §3. Cost `M` |
| `SCR-04` | Horizontal section | Vertical scroll translates a horizontal track. Cost `M` |
| `SCR-05` | Velocity skew | `skewY` proportional to scroll velocity, lerped back to 0. Subtle: cap at 6–8°. Cost `M` |
| `SCR-06` | Camera drive | Scroll progress maps to 3D camera position/rotation. Spline and planet references both. Cost `H` |
| `SCR-07` | Stacking cards | Cards pin and stack with decreasing scale, later ones overlapping. Cost `M` |
| `SCR-08` | Theme shift | Background and text colours interpolate across sections. Cost `L` |
| `SCR-09` | Inertial scroll | Lenis or similar. **Prerequisite for `SCR-05`, `IMG-01`, `SCR-10`** — you cannot compute meaningful velocity from native scroll. Cost `M` |
| `SCR-10` | Coupled marquee | Marquee base speed plus scroll velocity; direction flips with scroll direction. Cost `M` |
| `SCR-11` | Zoom-through | Camera flies *into* an object until it fills frame, cutting to the next section. The planet reference's best move. Cost `H` (or `M` faked with scale + crossfade) |
| `SCR-12` | Enter reveal | IntersectionObserver fires `ENT-*` once at threshold. Set `once: true` — replaying on every pass is irritating. Cost `L` |

---

### LAY — Layout and shared element

**The most valuable category in this set.** Everything here keeps elements alive across states.

| ID | Name | Description |
|---|---|---|
| `LAY-01` | FLIP morph | Measure First position, change Last state, Invert with a transform, Play. Element travels between two layouts with no duplication. **Measured: 0.80s, `power2.5.out`.** Use GSAP Flip or the View Transitions API. Cost `M` |
| `LAY-02` | Accordion slats | Row of vertical panels; hovered/active panel expands, siblings compress. Reference opens on this. `flex-grow` transition, or FLIP for correctness. Cost `L`–`M` |
| `LAY-03` | Scatter ↔ grid | Same items reflow between an ordered grid and an irregular scattered composition. Reference at 3.6–4.4s. Store both position sets, tween between, stagger per §1.3. Cost `M` |
| `LAY-04` | Card to detail | Thumbnail expands into full detail view, retaining the image element. Seen in the India portfolio and travel site. `LAY-01` plus content fade-in offset ~150ms *after* the morph settles. Cost `M` |
| `LAY-05` | List reorder | Filter/sort with items animating to new positions rather than snapping. Cost `M` |
| `LAY-06` | Masonry settle | Items drop into an irregular grid with per-column stagger. Cost `M` |

---

### IMG — Image and media effects

| ID | Name | Description |
|---|---|---|
| `IMG-01` | Velocity barrel warp | **Measured.** Image edges bow outward while dragging, flat at rest. At speed: **66–84px of bow on a 558px-wide image (~12–15% of width)**. At rest: **0.1px** — fully relaxed. The centre *trails* the corners, like fabric. Drive the shader uniform from a lerped velocity value, never from raw delta. Cost `H` |
| `IMG-02` | Hover displacement | A noise/gradient map distorts the image toward the cursor. Cost `H` |
| `IMG-03` | Dissolve | Image disintegrates into particles or noise-thresholded fragments. Dark agency reference. Cost `H` |
| `IMG-04` | Chromatic split | R/G/B channels offset, driven by velocity or hover. Keep under 4px — beyond that it reads as a broken display. Cost `M`–`H` |
| `IMG-05` | Duotone resolve | Monochrome/duotone → full colour on hover or enter. **Works with a photo library and no video.** Cost `L` |
| `IMG-06` | Ken Burns | Slow scale (1.0→1.08) and drift over 12–20s. Present in the reference hero even while "static". Cost `L` |
| `IMG-07` | Shader crossfade | Two textures blended through a noise/gradient map, so the wipe has shape. The travel site's synced background+card change. Cost `H` |
| `IMG-08` | Liquid/metaball | Blobs merge and separate via SDF or blur+contrast threshold. Cost `M`–`H` |
| `IMG-09` | Grain | Animated noise overlay at 3–6% opacity. Cheapest possible upgrade to a flat composition — unifies mismatched image sources. Cost `L` |
| `IMG-10` | Progressive blur | Stacked blur layers with a gradient mask, so blur increases toward an edge. Cost `L`–`M` |
| `IMG-11` | Shape morph | `clip-path` animated between shapes. Cost `L` |
| `IMG-12` | Hover video | Poster image swaps to muted looping video on hover. **Direct use for Seedance clips.** Preload metadata only. Cost `L` |

---

### TXT — Typography

| ID | Name | Description |
|---|---|---|
| `TXT-01` | Word/line stagger | Split into lines or words, each masked and revealed. The editorial luxury signature. Cost `M` |
| `TXT-02` | Variable weight | Animate `font-variation-settings` weight/width. Requires a variable font. Cost `L` |
| `TXT-03` | Kinetic marquee | Large type looping horizontally, often as a section divider. Cost `L` |
| `TXT-04` | Rotated axis | `writing-mode: vertical-rl` labels alongside imagery. Used throughout the India portfolio. Cost `L` |
| `TXT-05` | Path text | Type following an SVG curve, optionally rotating. Cost `L` |
| `TXT-06` | Occluded type | Headline sits *between* background and a foreground element, so subjects pass in front of it. The parrots-and-"Mexico" moment. Sells depth harder than parallax. Requires cut-out assets. Cost `L` |
| `TXT-07` | Tracking expand | `letter-spacing` widening on entrance. Animates cheaply, reads as luxury. Cost `L` |
| `TXT-08` | Outline fill | `-webkit-text-stroke` outline filling with colour. Cost `L` |

---

### NAV — Page and route transitions

| ID | Name | Description |
|---|---|---|
| `NAV-01` | Wordmark interstitial | Screen clears to a centred wordmark, which scales subtly while the next route loads. The Habital reference at 6–7s. **Solves the async problem elegantly** — the interstitial covers real load time. Cost `M` |
| `NAV-02` | Curtain wipe | A panel sweeps across, covering then uncovering. Cost `L` |
| `NAV-03` | Route morph | A shared element persists across the route change. The premium option; View Transitions API makes it viable now. Cost `M` |
| `NAV-04` | Clip expand | A circle expands from the click coordinates. Cost `L` |
| `NAV-05` | Push | Outgoing content slides away as incoming slides in. Cost `L` |
| `NAV-06` | Fade through | Out to a neutral state, then in. The safe default. Cost `L` |

---

### INT — Micro-interaction and pointer

| ID | Name | Description |
|---|---|---|
| `INT-01` | Magnetic cursor | Custom cursor lerps toward pointer; interactive elements pull it. Lerp factor 0.1–0.15. Cost `M` |
| `INT-02` | Invert cursor | `mix-blend-mode: difference` cursor inverting whatever it crosses. Cost `L` |
| `INT-03` | Tilt | `rotateX/Y` from pointer position over the card. Max 8–12°, `perspective: 1000px`. Cost `L` |
| `INT-04` | Fill sweep | Button background sweeps in from the approached edge. Detect entry direction. Cost `L` |
| `INT-05` | Underline draw | `scaleX` from 0, origin flipped on enter vs leave. Cost `L` |
| `INT-06` | Drag momentum | Pointer drag with inertia and rubber-band bounds. The Habital carousel. **Pairs with `IMG-01`.** Cost `M` |
| `INT-07` | Image trail | Images spawn along the cursor path and fade. Cost `M` |
| `INT-08` | Magnetic button | Button translates toward the cursor within a radius. Cost `M` |
| `INT-09` | Hover preview | An image follows the cursor while hovering a list row. Cost `M` |

---

### SPA — 3D and spatial

| ID | Name | Description |
|---|---|---|
| `SPA-01` | Arc carousel | Items on a cylindrical arc; off-centre items `rotateY` away. The India portfolio. Achievable in **pure CSS 3D** — `perspective` on the container, `rotateY` + `translateZ` per item. No WebGL needed. Cost `M` |
| `SPA-02` | Scroll rotation | A 3D object rotates/morphs as scroll progresses. Spline reference's ring. Cost `H` |
| `SPA-03` | Camera dolly | Camera moves through a scene between sections. Cost `H` |
| `SPA-04` | Float and orbit | Objects drift on sine offsets, slowly orbiting. Cost `H` |
| `SPA-05` | Iridescent glass | Transmission material with dispersion and env-map. The peachweb look. Expensive — one hero object, not many. Cost `H` |
| `SPA-06` | Particle formation | Particles converge into a shape, disperse, reform. The dark agency reference. GPU instancing required past ~10k. Cost `H` |
| `SPA-07` | Turntable | Product rotates on scroll or drag. **Often better as `SCR-03`** — a pre-rendered frame sequence beats a live model for a single hero object. Cost `M`–`H` |

---

### AMB — Ambient and background

| ID | Name | Description |
|---|---|---|
| `AMB-01` | Gradient mesh | Slow-drifting multi-point gradient. Cost `M` |
| `AMB-02` | Flow field | Noise-driven particle or line motion. Cost `H` |
| `AMB-03` | Live crossing | Creatures/objects traverse the hero on a loop. The parrots. **Highest impact-to-effort item in the whole set** — one cut-out asset plus a path tween. Randomise timing so the loop isn't detectable. Cost `L` |
| `AMB-04` | Dust and bokeh | Slow-drifting particles with depth blur. Cost `L`–`M` |
| `AMB-05` | Breathing | Scale 1.0↔1.02 over 4–6s on a hero element. Cost `L` |
| `AMB-06` | Video field | Muted looping video with an overlay for text contrast. Cost `L` |

---

### SYS — State and feedback

| ID | Name | Description |
|---|---|---|
| `SYS-01` | Skeleton shimmer | Gradient sweeps across placeholder blocks. Cost `L` |
| `SYS-02` | Counter loader | Percentage counts to 100 while assets preload. Pairs with `NAV-01`. Cost `M` |
| `SYS-03` | Optimistic state | UI updates before the server confirms, reconciling after. Cost `L` |
| `SYS-04` | Toast | Slide and fade from an edge, auto-dismiss. Cost `L` |
| `SYS-05` | Modal | Scrim fades, dialog scales 0.96→1. Cost `L` |

---

## 3. Producing the assets

You have photos, artworks, vectors, and Seedance. Here's what each unlocks.

### Photos and artwork

Feed: `IMG-01` `IMG-02` `IMG-05` `IMG-06` `IMG-07` `LAY-01` `LAY-02` `LAY-03` `SCR-01`

Prepare them properly or the motion will expose them:

- **Cut-outs with alpha** are the unlock for `TXT-06` and `AMB-03`. A subject on transparent background, layered over a headline, is the single cheapest way to get real depth. Export PNG or WebP with alpha.
- **Depth maps** turn one photo into a parallax scene. Generate one, use it as a displacement map, and a flat image gains `SCR-01` behaviour with no second asset.
- **Resolution headroom.** `IMG-06` scales to 1.08 and `SCR-11` scales far past that. Export at 1.5–2× the largest displayed size or the zoom will soften.
- **Consistent grade.** Mixed sources read as a collage the moment they move together. `IMG-09` grain at 3–6% papers over a surprising amount of mismatch.

### Vectors

Feed: `ENT-08` `TXT-05` `IMG-11` `TXT-08`

Keep paths clean and named. `ENT-08` needs single continuous strokes, not filled compound shapes — a logo drawn as outlines can't be stroke-animated without conversion.

### Seedance video

Two distinct uses, and the second is the valuable one.

**Direct playback** — `IMG-12` `AMB-06` `AMB-03`. Straightforward. Export MP4 (H.264) and WebM, poster frame, `muted playsinline loop preload="metadata"`.

**Frame sequences for scrubbing** — `SCR-03` `SPA-07`. This is how you get `SPA-02` and `SPA-06` results without writing WebGL. Generate a clip where the subject transforms continuously, extract to frames, and index them by scroll position:

```bash
ffmpeg -i clip.mp4 -vf "fps=30,scale=1600:-1" -q:v 4 frames/f_%04d.jpg
```

Then preload and draw to canvas on scroll. Budget carefully: **60–90 frames** for a full-viewport sequence, WebP or AVIF, under ~2.5MB total. Beyond that you're shipping a video the user can't skip.

Prompting Seedance for this: ask for **a single continuous camera or object movement, locked framing, no cuts, consistent lighting**. Cuts and lighting shifts destroy scrubbing — the sequence must read as one continuous state change.

**What Seedance cannot do:** anything that must respond to input. `IMG-01`, `INT-01`, `LAY-01`, `INT-06` are interactive and must be real code. Don't try to fake responsiveness with video.

---

## 4. Stack

Deliberately small. Every library is a decision you have to defend later.

| Need | Choice | Note |
|---|---|---|
| Timelines, scroll | **GSAP + ScrollTrigger** | Now fully free including all plugins. `power2.5.out` supported natively. |
| Layout morphs | **GSAP Flip** or **View Transitions API** | Flip for in-page (`LAY-01`–`LAY-06`); View Transitions for cross-route (`NAV-03`). |
| Smooth scroll | **Lenis** | Required before `SCR-05` `SCR-10` `IMG-01`. |
| Text splitting | **GSAP SplitText** | For `TXT-01` `ENT-06`. |
| 3D | **Three.js**, or **Spline** for authored scenes | Spline if you want to design rather than code the scene — that's what the reference used. |
| React 3D | **React Three Fiber + drei** | Only if already in React. |
| Lightweight alternative | **Motion (Framer Motion)** | If the project is React and needs are modest, this alone may cover `ENT-*` `LAY-*` `SYS-*`. |

**Do not install all of these.** A site needing `ENT-*`, `LAY-01`, `SCR-01` and `SCR-12` needs GSAP and nothing else.

---

## 5. Budget and quality floor

**Performance**

- 60fps on mid-range mobile is the target, not desktop.
- One `H`-cost effect per viewport. Two WebGL scenes visible at once will drop frames on most phones.
- Lazy-init below-fold animation; `IntersectionObserver` to start and **stop** loops offscreen.
- Kill every `requestAnimationFrame` loop when its element leaves the viewport. This is the most common cause of a site that feels fine at first and degrades as you scroll.
- Total motion JS under ~150KB gzipped.
- Test with CPU throttled 4×.

**Accessibility**

- `prefers-reduced-motion` respected with substitutions, not just removal (§1.5).
- Nothing critical conveyed by motion alone.
- Keyboard focus visible and never animated out of view.
- Scroll-jacking (`SCR-02` `SCR-04`) must not trap keyboard or screen-reader users. Provide a skip mechanism.
- No flashing above 3Hz.

**Restraint**

The references are 10–30 second showreels. A real site is used for minutes. Pick **one signature moment** — a `LAY-01` morph, or a `SCR-11` zoom-through, or an `IMG-01` carousel — and let everything else stay quiet. Motion applied evenly across a page cancels itself out and reads as generated. The reference sites are memorable because they each do one thing you haven't seen, not six things you have.

---

## 6. Handing this to Claude Code

Reference IDs directly and state the tokens:

> Build the project index as `LAY-02` accordion slats. Clicking a slat runs `LAY-01` into a full-bleed hero — 0.8s, `power2.5.out`. Scrolling past reflows to `LAY-03` scattered gallery with 80ms eased stagger. Use GSAP Flip. Tokens from MOTION-SYSTEM.md §1. Include the §1.5 reduced-motion substitution.

Good practice when building:

- Build the layout static and correct **first**. Motion is applied to working structure, never used to hold it together.
- Implement one ID at a time and verify frame rate before adding the next.
- Keep durations and easings as CSS custom properties or a single JS tokens object. Never inline a magic number — you will want to retune the whole system at once.
- When something feels wrong, it is almost always **duration**, not easing. Try ±200ms before changing the curve.

---

## Appendix — measurement method

Findings in §1 came from frame extraction and pixel measurement, not estimation:

- Frames extracted at source rate with `ffmpeg -ss <t> -i <file> -frames:v 1`
- Element width tracked per frame via luminance thresholding across a horizontal band
- Normalised progress fitted against 11 candidate easing curves by RMSE
- Edge curvature measured by fitting a quadratic to the detected image boundary, compared between moving and settled frames

Reproduce or extend any of it with the same approach on new references — measuring two or three moments from a site you admire is worth more than an hour of guessing.
