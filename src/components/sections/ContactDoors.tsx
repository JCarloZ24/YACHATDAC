import { CardRail } from "@/components/ui/CardRail";
import { SeamGlyph } from "@/components/ui/Furniture";
import type { SeamGlyphMotif } from "@/components/ui/Furniture";
import { contactRoutes } from "@/content/contact";

/**
 * The four doors — "Different things go to different people."
 *
 * One card pattern, two pages. Our People §06 (Figma 2841:25358) and About §09
 * (2653:19676) draw the same object: a ground-filled card with the artist's
 * motif where an image band would be, then title, description and a verb-led
 * label at the foot. It was built on Our People first; About is the second
 * consumer, and CLAUDE.md's rule is that a second card pattern does not get
 * invented, so it moved here rather than being copied.
 *
 * ⚠ NOT `ContactBlock`. That component renders the same four routes as
 * `rounded-sm border p-5` — a hairline box with text in it, which is the lo-fi
 * wireframe pattern. It still serves /partnerships and /connect and is not
 * touched; the hi-fi pages use this instead.
 *
 * WHAT THE FRAME OWNS, AND WHAT THIS DOES. The grounds and the accent differ
 * between the two frames and are props. Everything else is shared: the four
 * destinations come from `contactRoutes` so no page can drift from another,
 * and the labels are fixed here for the same reason — the Figma frames agree
 * on all four, and a label that lived in a page file could quietly stop
 * matching its neighbour's.
 *
 * ⚠ NO HOVER, NO TRANSITION. Both pages are static by decision. A door is
 * distinguished by its ground and its motif, not by answering a cursor.
 *
 * ⚠ A LABEL SAYS WHAT HAPPENS, NEVER WHERE THE FILE IS. `→ /the-record` is a
 * developer artefact; a visitor cannot parse it. Each label is verb-led and
 * drawn from the destination's own name in `src/content/site.ts`.
 */

/** Verb-led, drawn from each destination's own name. Never a route path. */
const DOOR_LABELS = [
  "Plan a visit",
  "See partnerships",
  "Meet the rangers",
  "Visit the record",
] as const;

/** boomerang, circle, starburst — the repo's glyph names, in frame order. */
const DEFAULT_GLYPHS: SeamGlyphMotif[] = ["c", "a", "b"];

export function ContactDoors({
  grounds,
  glyphs = DEFAULT_GLYPHS,
  accent = "text-gold",
}: {
  /**
   * One literal `bg-*` class per door. Literal, never interpolated — Tailwind
   * cannot see a class built from a template string and `bg-${tone}` compiles
   * to nothing (`src/lib/tone.ts`).
   */
  grounds: readonly string[];
  /** Motif rotation. Decorative — it must not encode a category or a role. */
  glyphs?: readonly SeamGlyphMotif[];
  /** The label colour, as a literal class. Gold on canvas, ochre on charcoal. */
  accent?: string;
}) {
  return (
    <CardRail columns="sm:grid-cols-2 lg:grid-cols-4">
      {contactRoutes.routes.map((route, i) => (
        <a
          key={route.href}
          href={route.href}
          /* min-h, not h. 320 is the frame's door and it holds at the widths
             the frame draws, but at 1024 a four-up row gives each door 194px
             and "Something for the record" wraps to three lines — a fixed
             height spills that text out of the card instead of growing.

             ⚠ AND IT IS `lg:`-ONLY. 320 is a floor for a 194px column; on a
             phone the door is the full width, its natural height is ~200px,
             and the floor was injecting ~120px of empty ground per door —
             480px per page, on two pages. In the rail below `sm` the cards
             stretch to their tallest sibling anyway. */
          className={`relative flex flex-col rounded-3xl ${grounds[i % grounds.length]} p-6 text-canvas lg:min-h-80`}
        >
          <SeamGlyph
            motif={glyphs[i % glyphs.length]}
            className="relative top-1 left-0 w-14 shrink-0"
          />
          <h3 className="headline mt-8 text-2xl leading-[1.2] sm:text-[1.75rem]">
            {route.title}
          </h3>
          <p className="mt-3 text-[0.9375rem] leading-[1.5] text-canvas/75">
            {route.description}
          </p>
          <p className={`eyebrow mt-auto text-[0.8125rem] tracking-[0.3em] ${accent}`}>
            → {DOOR_LABELS[i]}
          </p>
        </a>
      ))}
    </CardRail>
  );
}
