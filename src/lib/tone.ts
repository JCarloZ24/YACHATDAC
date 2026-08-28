/**
 * Palette anchors for full-width sections.
 *
 * The homepage established the pattern in BeatSection: a section names a
 * colour from the brand set and everything inside it takes its contrast from
 * that. The pillar pages are long enough to need the same vocabulary shared
 * rather than re-declared per page, so it lives here.
 *
 * Explicit maps, not template strings — Tailwind only sees class names it can
 * read statically. `bg-${tone}` compiles to nothing.
 *
 * Canvas is the only light ground in the set. Everything else is dark, which
 * is why `onLight` is a single boolean rather than a per-colour contrast
 * calculation: there is no middle tier in this palette.
 */

export type Tone =
  | "evergreen"
  | "midnight"
  | "roasted"
  | "oxide"
  | "canvas"
  | "charcoal";

export const toneBg: Record<Tone, string> = {
  evergreen: "bg-evergreen",
  midnight: "bg-midnight",
  roasted: "bg-roasted",
  oxide: "bg-oxide",
  canvas: "bg-canvas",
  charcoal: "bg-charcoal",
};

/** True for grounds that take dark ink. Canvas is the only one. */
export function isLight(tone: Tone): boolean {
  return tone === "canvas";
}

type ToneInk = {
  /** Section and page headings. */
  heading: string;
  /** Body copy. Never full-contrast — the headline should stay the loudest thing. */
  body: string;
  /** Secondary copy: captions, meta, labels. */
  muted: string;
  /** Eyebrows and small accents. */
  accent: string;
  /** Hairlines, card edges, table rules. */
  border: string;
  /** Card and panel fills. Kept very low alpha; these are surfaces, not blocks. */
  surface: string;
};

/**
 * Ink for a given ground.
 *
 * Ochre reads as the accent on every dark ground in the set. On canvas it is
 * too pale to carry a small-caps label, so oxide takes over — the same swap
 * BeatSection makes for its canvas beats.
 */
export const toneInk: Record<Tone, ToneInk> = {
  evergreen: {
    heading: "text-canvas",
    body: "text-canvas/75",
    muted: "text-canvas/55",
    accent: "text-ochre",
    border: "border-canvas/20",
    surface: "bg-canvas/5",
  },
  midnight: {
    heading: "text-canvas",
    body: "text-canvas/75",
    muted: "text-canvas/55",
    accent: "text-ochre",
    border: "border-canvas/20",
    surface: "bg-canvas/5",
  },
  roasted: {
    heading: "text-canvas",
    body: "text-canvas/75",
    muted: "text-canvas/55",
    accent: "text-ochre",
    border: "border-canvas/20",
    surface: "bg-canvas/5",
  },
  oxide: {
    heading: "text-canvas",
    body: "text-canvas/80",
    muted: "text-canvas/60",
    accent: "text-canvas",
    border: "border-canvas/25",
    surface: "bg-canvas/8",
  },
  charcoal: {
    heading: "text-canvas",
    body: "text-canvas/75",
    muted: "text-canvas/50",
    accent: "text-ochre",
    border: "border-canvas/15",
    surface: "bg-canvas/5",
  },
  canvas: {
    heading: "text-evergreen",
    body: "text-evergreen/80",
    muted: "text-evergreen/60",
    accent: "text-oxide",
    border: "border-evergreen/20",
    surface: "bg-evergreen/5",
  },
};
