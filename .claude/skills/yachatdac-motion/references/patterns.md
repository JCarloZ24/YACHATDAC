# GSAP patterns

The idioms this project uses. Copy the shape, not just the API call — the shape is
what keeps forty-eight behaviours from becoming forty-eight different architectures.

## Scrub vs trigger-once

Scrub when the visitor should control the pace — parallax, sky ramps, camera moves,
video position. Trigger-once when something simply needs to arrive — entry staggers,
headlines, cards.

```js
// scrubbed: tied to scroll position
scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 }

// once: plays and is done, never re-triggers on scroll-up
scrollTrigger: { trigger: el, start: 'top 82%', once: true }
```

`once: true` is not optional on Tier 2. Re-triggering on scroll-up is the single most
irritating thing a site can do.

## Reduced motion — always matchMedia, never an if-statement

An if-statement checks once at init and never updates. `gsap.matchMedia()` handles
the user changing the setting mid-session and gives a free teardown.

```js
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, scrub: 1, pin: true } });
  tl.from(items, { yPercent: 110, stagger: 0.09, ease: 'expo.out' });
  return () => tl.kill();          // revert runs automatically
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set(items, { clearProps: 'all' });   // final state, instantly. no pin.
});
```

Reduced motion **cuts**. No half-speed variant, no "gentler" parallax.

## Stagger by grid and by origin (L1)

```js
gsap.from(items, {
  scale: 0.7, opacity: 0,
  stagger: { each: 0.045, grid: [rows, cols], from: originIndex },
  ease: 'power2.out'
});
```

`from` takes an index, `'center'`, `'edges'`, or `'start'`. Choose the origin per
section deliberately — the logo, a subject's face, the sun in the photograph. A
default centre origin wastes the idea.

## Seeded jitter (L3)

Deterministic, so it's identical on every load and in every screenshot test.

```js
const noise = i => (Math.sin(i * 12.9898) * 43758.5453) % 1;
gsap.from(items, {
  y: 20, opacity: 0,
  delay: i => Math.abs(noise(i)) * 0.04,     // <=40ms
  stagger: 0.06, ease: 'expo.out'
});
```

Random per load is a bug, not a feature.

## Pinned step-through (X3)

```js
ScrollTrigger.create({
  trigger: section,
  pin: true,
  scrub: 0.8,
  end: '+=' + (steps.length * 80) + '%',
  snap: { snapTo: 1 / (steps.length - 1), duration: 0.3, ease: 'power2.inOut' }
});
```

Snapping stops people stranding between steps. Document the span in `vh` in the
wireframe. One pinned section per page, and none under reduced motion.

## Horizontal pin (B4, T4)

```js
gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: wrap, pin: true, scrub: 1,
    end: () => '+=' + track.scrollWidth,
    invalidateOnRefresh: true          // recalculates on resize
  }
});
```

`invalidateOnRefresh` matters — without it, resizing breaks the end position.

## Shared element handoff (C2)

Use Flip rather than duplicating the node. One element, measured in both states.

```js
const state = Flip.getState(el);
container.appendChild(el);                    // move it to its new home
Flip.from(state, { scrollTrigger: { scrub: true }, ease: 'none' });
```

Re-measure on resize. Only one of these on the homepage.

## Scrubbing media (M6, D2)

Never set `src` per frame, and never animate `currentTime` directly — animate a
proxy and assign in `onUpdate`.

```js
const proxy = { t: 0 };
gsap.to(proxy, {
  t: video.duration, ease: 'none',
  scrollTrigger: { trigger: section, scrub: 0.4 },
  onUpdate: () => { video.currentTime = proxy.t; }
});
```

Video must be `muted`, `playsinline`, with a poster. Transcode at a 1s keyframe
interval or seeking stutters.

## Per-frame property rules

Animate `transform` and `opacity`. If a design needs a box to change size, animate
`clip-path: inset()` and counter-scale the contents (that's M2) rather than
animating `width`/`height`.

CSS variables are fine to animate when a value feeds a gradient or mask string —
it avoids re-parsing the whole string every frame.

```js
gsap.to(el, { '--reveal': '150%', ease: 'none', scrollTrigger: { scrub: true } });
```

## Teardown

Every module exports `init()` and `destroy()`. On destroy: kill timelines, kill the
triggers created by the module (not `ScrollTrigger.killAll()` — that takes out other
sections), cancel rAF loops, dispose GL resources, disconnect observers.

## Refresh

Call `ScrollTrigger.refresh()` after fonts load and after any late-loading media
changes layout height. Web fonts arriving late is the most common cause of pins
landing in the wrong place.

## Registered effects — the vocabulary, stored

`gsap.registerEffect()` is how this project stores a reusable animation under a
name. It is the mechanism behind `src/lib/motion/effects.ts`, and it is what makes
the brief's audit rule mechanical: every registered effect cites a row of
`docs/motion/motion-grammar.md`, and a behaviour that cites nothing has nowhere to
live.

Note that the `gsap-core` skill does not cover `registerEffect` at all. This is the
reference for it on this project.

```js
gsap.registerEffect({
  name: 'settle',
  extendTimeline: true,             // also becomes a timeline method
  defaults: { duration: 0.82, ease: 'expo.out', stagger: 0.09 },
  effect: (targets, config) => gsap.from(targets, { yPercent: 110, ...config })
});

gsap.effects.settle(heading);       // as a call
tl.settle(heading).pushIn(plate, {}, '<');   // as a timeline method
```

**Effects are pure animation builders.** They return a tween or a timeline and know
nothing about ScrollTrigger. That is not a stylistic choice — it is what lets one
effect serve an entry, a scrub and a hero timeline without three copies. Scroll
wiring belongs in the section module, next to the `vh` span it costs:

```js
gsap.timeline({ scrollTrigger: { trigger: frame, scrub: 0.8 } })
    .frameOpen(frame, { duration: 1 });
```

**Do not put stateful behaviour in an effect.** Ticker loops (the type river),
pointer listeners (cursor gravity) and WebGL are modules with `init()`/`destroy()`,
because they have something to tear down and an effect does not.

**Typing.** GSAP declares `[key: string]: any` on `Timeline` specifically for
`extendTimeline`, so effect methods typecheck but are not checked. A typo in an
effect name fails at runtime, not at build — which is a reason to add the name to
`EffectName` in `effects.ts` when adding a row.

**The banned-ease guard.** `effects.ts` throws in development if an effect is handed
`back`, `elastic` or `bounce`. The ban was a rule in two documents that nothing
enforced; now it fails loudly in dev and costs nothing in production.
