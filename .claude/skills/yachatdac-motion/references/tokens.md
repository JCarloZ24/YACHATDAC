# Tokens

Don't invent values. Sections built by different people should feel like one site,
and that only happens if the timing numbers are shared.

## Easing

| Name | Curve | Use |
|---|---|---|
| `country` | `cubic-bezier(.16,1,.3,1)` / `expo.out` | Anything large — sections, images, headlines. Heavy settle, no rebound. |
| `quiet` | `cubic-bezier(.33,1,.68,1)` / `power2.out` | Interface furniture — hovers, menus, small reveals. |
| `machine` | `none` / linear | Scrubbed video, image sequences, progress bars only. |
| overshoot | `back.out`, `elastic` | **Banned.** Reads playful; the brand is grounded. |

## Duration

```
large   820ms   sections, full-bleed media, headlines
medium  550ms   cards, list items, image frames
small   320ms   hovers, focus rings, toggles
```

## Stagger

```
grid            60ms
headline lines  90ms
point fields    12ms   (cap ~120 nodes, else move to canvas)
radial          by distance from origin, ~45ms per normalised unit
jitter          <=40ms and <=2px, seeded — never random per load
```

## Parallax ratios

```
0.15 / 0.4 / 0.7 / 1.0
```

Deliberately uneven. Evenly spaced ratios read as a slider; uneven ones read as
landscape.

## Scroll spans

Wireframes must express these in `vh`, not `px`. Pinning is structural — if the
span isn't in the layout, it gets retrofitted badly later.

```
standard section        100vh
pinned step-through     ~320vh for four steps
pinned panorama         ~250vh
corridor (T4)           ~250vh
coupled sky beats (A2)  ~250vh for three beats
```

## Route transitions

```
ground wipe (X7)    600ms   country — the new page's own ground clips in
shared morph (C4)   500ms   country — card into detail hero
back navigation     crossfade + morph only (browser back carries no types)
```

All zeroed under reduced motion — the swap is instant.

## The guide (group G)

```
guide leg (G1 travel)     2000ms  country — one flight between waypoints
trail draw-on             follows the leg; mask reveal, no per-frame filters
band undulation (G2)      ambient ±6px x-drift, ~8s period, transform-only
waypoint settle (G3)      500ms   quiet — lands, then holds still
hand-off (G4)             rides the route transition it leads (X7/C4 timing)
```

The guide is decorative (`aria-hidden`), never in the focus order, and under
reduced motion it rests at its waypoints — the trail and pointer render in
their settled states, no travel. Every G use is ▲-flagged in `permissions.md`.

## Palette

```
--evergreen #22372b   --ochre     #d69828   --burnt   #cb7722
--oxide     #af231c   --brown     #4e3524   --eucalypt #5e7930
--turquoise #32b0ae   --navy      #122449   --charcoal #090e12
--offwhite  #f6f6ec
```

Solid colours, not gradients — agreed in the briefing. The imagery is strong enough
without gradient overlays.

## Type

Headline `Block Berthold`. Subhead `Bantayog Sans`. Callouts `Good Dog Cool`.
Body `Work Sans`. Motiva is scrapped — don't reintroduce it.

Split narrative and testimony copy by line or word only. Character splits are
allowed on short display headings (≤ ~6 words — sketch B6) with SplitText's
`aria:"auto"` so the accessible name survives. Never chars on body copy or quoted
speech: there it still breaks the reading and reads as a gimmick.

## Performance budget

```
above-the-fold payload   < 2.5MB
draw calls (WebGL)       < 40
texture memory           < 8MB
DPR cap                  1.5
target                   60fps on a mid-range Android, cold cache, throttled
```

The people this site is most for are often on the worst connection to it. Test
accordingly.
