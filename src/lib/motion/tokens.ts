/**
 * Motion tokens — one source, in TypeScript.
 *
 * Before this file, five modules each declared their own `EASE_COUNTRY` and
 * `DUR_LARGE` and drifted apart: split-text.ts, v2-home.ts, recall.ts,
 * truth-descent.ts and ui/Reveal.tsx, with 33 hardcoded literals between them.
 * The whole point of a shared token set is that sections built by different
 * people feel like one site, and copies defeat it.
 *
 * Values are verbatim from the motion skill's references/tokens.md and mirror
 * the custom properties in src/app/motion-tokens.css. This module re-exports
 * the token set; it does not get to invent one. If a number here disagrees with
 * the skill, the skill wins and this file is what changes.
 */

/* -------------------------------------------------------------------------
   Easing
   ------------------------------------------------------------------------- */

/**
 * `country` for anything large — sections, media, headlines. Heavy settle, no
 * rebound. `quiet` for interface furniture. `machine` is linear, and is only
 * ever correct for scrubbed media, image sequences and progress.
 *
 * `country` and `quiet` are CustomEase curves drawn from the CSS beziers below
 * and registered by effects/index.ts, so a section animated in GSAP and a hover
 * transitioned in CSS settle at exactly the same rate. They used to be
 * `expo.out` and `power2.out`, which were close approximations and visibly not
 * the same curve. Registration happens inside registerYachatdacEffects(), which
 * every motion host calls before it animates anything.
 *
 * Overshoot eases (`back`, `elastic`, `bounce`) were banned until decision F8
 * (31 Aug 2026) lifted the grounded-character rule. Using them directly is
 * allowed — add named entries as designs call for them.
 *
 * `catch` is the first one a design called for: `gathering` needs cards that
 * seat into a set rather than settle into one. `elastic` and `bounce` stay
 * unnamed until something actually asks.
 */
export const EASE = {
  country: "country",
  quiet: "quiet",
  machine: "none",

  /** A thing seating into place — cards locking into a set. Keep the overshoot
      short; `country` is still the default for anything large. */
  catch: "back.out(1.4)",
} as const;

/** The CSS cubic-beziers the same curves compile to, for non-GSAP transitions. */
export const EASE_CSS = {
  country: "cubic-bezier(.16,1,.3,1)",
  quiet: "cubic-bezier(.33,1,.68,1)",
  machine: "linear",
  catch: "cubic-bezier(.34,1.56,.64,1)",
} as const;

/* -------------------------------------------------------------------------
   Duration and stagger — seconds, because GSAP takes seconds
   ------------------------------------------------------------------------- */

export const DUR = {
  /** Sections, full-bleed media, headlines. */
  large: 0.82,
  /** Cards, list items, image frames. */
  medium: 0.55,
  /** Hovers, focus rings, toggles. */
  small: 0.32,
  /** One leg of the Guide's flight (G1). */
  guideLeg: 2.0,
} as const;

export const STAGGER = {
  grid: 0.06,
  line: 0.09,
  word: 0.045,
  char: 0.028,
  /** Point fields. Cap around 120 nodes, else it belongs on a canvas. */
  point: 0.012,
  /** Radial, per normalised unit of distance from the origin (L1). */
  radial: 0.045,
} as const;

/**
 * Seeded jitter ceilings (L3). Deterministic, never random per load — random
 * per load is a bug, not a feature, and it makes every screenshot test flap.
 */
export const JITTER = { maxDelay: 0.04, maxOffset: 2 } as const;

/* -------------------------------------------------------------------------
   Space
   ------------------------------------------------------------------------- */

/**
 * Parallax depth ratios. Deliberately uneven — evenly spaced ratios read as a
 * slider, uneven ones read as landscape.
 */
export const PARALLAX = [0.15, 0.4, 0.7, 1.0] as const;

/** Scroll spans, in vh. Pinning is structural: if the span is not in the
    layout, it gets retrofitted badly later. */
export const SPAN = {
  section: 100,
  pinnedSteps: 320,
  panorama: 250,
  corridor: 250,
  skyBeats: 250,
} as const;

/**
 * Scrub values. Never `true` — the slight lag *is* the weight, and a hard-tied
 * scrub reads as a scrollbar rather than as a camera.
 */
export const SCRUB = { light: 0.6, normal: 0.8, heavy: 1.2 } as const;

/* -------------------------------------------------------------------------
   The L2 scale triad
   ------------------------------------------------------------------------- */

/** Three arrival tiers, as timeline offsets. A layout rule as much as a motion
    one — the artwork's own composition works in these three sizes. */
export const TRIAD = { anchor: 0, mid: 0.25, detail: 0.45 } as const;

export type Tier = keyof typeof TRIAD;
