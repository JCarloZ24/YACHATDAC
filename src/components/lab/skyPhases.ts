import type { SkyPhase } from "@/lib/motion/sky-clock";

/**
 * The clock itself: what time of day each narrative beat happens at.
 *
 * SKY COLOUR IS NOT INVENTED HERE. Each beat in `src/content/homepage.ts`
 * already declares a `tone` — a palette anchor, chosen when the copy was
 * structured. Those tones are the sky. The mockup used its own tints
 * (#efe2c4, #c9743f, #15110e and others) which sit outside the brand palette;
 * snapping to the tones keeps one decision in one place, and it happens to give
 * a legible arc for free: night, first light, day, dusk, night.
 *
 * Every dark sky carries off-white copy at 10:1 or better. The one light sky
 * (the Invitation) carries charcoal. That is the reason the Wonder beat is
 * midnight rather than something warmer — off-white on burnt ochre measures
 * 3.4:1 and fails the 4.5:1 floor, and no amount of liking the colour fixes it.
 *
 * Sun and star values are motion, so they live here rather than in the copy.
 */

export type SkyPhaseContent = SkyPhase & {
  /** What the reviewer should be told this moment is. */
  label: string;
  /** CSS colour for this phase's sky layer. */
  sky: string;
  /** CSS colour for this phase's sun disc. */
  sun: string;
  /** Copy colour on this sky. */
  ink: "canvas" | "charcoal";
};

export const SKY_PHASES: SkyPhaseContent[] = [
  {
    id: "welcome",
    label: "Before first light",
    sky: "var(--color-charcoal)",
    sun: "var(--color-ochre)",
    ink: "canvas",
    sunX: 0.5,
    sunY: 0.92,
    sunScale: 0.8,
    stars: 0.35,
  },
  {
    id: "wonder",
    label: "First light over the escarpment",
    sky: "var(--color-midnight)",
    sun: "var(--color-ochre)",
    ink: "canvas",
    sunX: 0.58,
    sunY: 0.74,
    sunScale: 1.1,
    stars: 0.6,
  },
  {
    id: "truth",
    label: "Time stops",
    sky: "var(--color-oxide)",
    sun: "var(--color-ochre)",
    ink: "canvas",
    sunX: 0.64,
    sunY: 0.44,
    sunScale: 0.9,
    stars: 0,
    // The one beat where the atmosphere holds. Sketch library: "Sky holds
    // still. The only section where time stops." House style: truth-telling
    // sections move less than the rest of the site, not more.
    hold: true,
  },
  {
    id: "belonging",
    label: "Full day",
    sky: "var(--color-roasted)",
    sun: "var(--color-ochre)",
    ink: "canvas",
    sunX: 0.42,
    sunY: 0.34,
    sunScale: 1.4,
    stars: 0,
  },
  {
    id: "living-work",
    label: "Working light, late",
    sky: "var(--color-evergreen)",
    sun: "var(--color-ochre)",
    ink: "canvas",
    sunX: 0.26,
    sunY: 0.7,
    sunScale: 0.7,
    stars: 0.25,
  },
  {
    id: "invitation",
    label: "Open sky",
    sky: "var(--color-canvas)",
    sun: "var(--color-ochre)",
    ink: "charcoal",
    sunX: 0.5,
    sunY: 0.24,
    sunScale: 1,
    stars: 0,
  },
  {
    id: "way-forward",
    label: "Night, and the way out",
    sky: "var(--color-charcoal)",
    sun: "var(--color-midnight)",
    ink: "canvas",
    sunX: 0.5,
    sunY: -0.14,
    sunScale: 0.35,
    stars: 0.7,
  },
];
