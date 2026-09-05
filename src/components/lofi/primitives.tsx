import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Shared building blocks for the pillar pages.
 *
 * All Tier 2 (F4): entry staggers and hover states, no GSAP. Anything that
 * pins, scrubs or parallaxes belongs on the homepage and goes through the
 * motion controller instead.
 */

/**
 * Standing notice that a page is built from an unapproved draft.
 *
 * STATUS.md is explicit — "Nothing here is approved; nothing here has been
 * built from." These pages exist so the flow and motion can be reviewed, and
 * that has to be legible on screen rather than only in a tracker. The old
 * PageStub said "Not built yet" for the same reason; this replaces it.
 */
export function DraftNotice({
  circle,
  blockedOn,
}: {
  circle: "open" | "shared with care" | "held by community";
  blockedOn: string;
}) {
  const restricted = circle === "held by community";
  return (
    <div
      className={`rounded-sm border p-5 ${
        restricted
          ? "border-oxide/50 bg-oxide/10"
          : "border-ochre/40 bg-ochre/5"
      }`}
    >
      <p className={`eyebrow ${restricted ? "text-oxide" : "text-ochre"}`}>
        Draft — not approved · circle: {circle}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-canvas/70">
        Built from an unapproved copy draft so flow and motion can be reviewed.
        Not for publication. Blocked on: {blockedOn}
      </p>
    </div>
  );
}

/** A full-width page section. `tone` is a Tailwind background class. */
export function Section({
  id,
  tone = "bg-canvas",
  className = "",
  children,
}: {
  id?: string;
  tone?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      /* min-h is measured from the lo-fi, not picked. Body sections across
         Wonder, Truth and Living Work run 0.52–1.15vh there (Living Work
         step 06 is the shortest at 0.52, Truth's 2019 entry the tallest at
         1.15). The coded pages had no floor at all, so a short section
         collapsed to its own padding and two of them landed on screen at
         once — which is most of why a page could not be read one section at
         a time. 60svh sits near the low end of the lo-fi's own range;
         anything with more content simply grows past it. */
      className={`relative flex min-h-[60svh] items-center ${tone} ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-16 lg:py-28">
        {children}
      </div>
    </section>
  );
}

/** Eyebrow + headline, entry-staggered. */
export function SectionHeader({
  eyebrow,
  headline,
  onDark = true,
  accent,
}: {
  eyebrow: string;
  headline: string;
  onDark?: boolean;
  accent?: string;
}) {
  return (
    <>
      <Reveal>
        <Eyebrow className={accent ?? (onDark ? "text-ochre" : "text-oxide")}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <Reveal index={1}>
        <h2
          className={`headline mt-5 max-w-3xl text-3xl sm:text-4xl lg:text-(length:--text-beat) ${
            onDark ? "text-canvas" : "text-evergreen"
          }`}
        >
          {headline}
        </h2>
      </Reveal>
    </>
  );
}

/** Body paragraphs at the reading measure, entry-staggered. */
export function Body({
  paragraphs,
  onDark = true,
  startIndex = 2,
}: {
  paragraphs: readonly string[];
  onDark?: boolean;
  startIndex?: number;
}) {
  return (
    <div className="mt-8 max-w-2xl space-y-5">
      {paragraphs.map((paragraph, index) => (
        <Reveal key={paragraph} index={startIndex + index}>
          <p
            className={`text-base leading-relaxed ${
              onDark ? "text-canvas/75" : "text-evergreen/80"
            }`}
          >
            {paragraph}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Image slot. Flat field until real photography lands — a stand-in for
 * imagery, not a design.
 */
export function MediaSlot({
  note,
  className = "aspect-4/3",
  tone = "bg-canvas/10",
}: {
  note: string;
  className?: string;
  tone?: string;
}) {
  return (
    <div
      data-placeholder="media"
      className={`relative overflow-hidden ${tone} ${className}`}
    >
      <p className="absolute inset-x-0 top-0 p-4 text-[11px] leading-snug text-canvas/45">
        [ IMAGE — {note} ]
      </p>
    </div>
  );
}

/**
 * A media slot that must NOT be filled.
 *
 * Used where imagery permission is unresolved. The block is on the material,
 * not on one page: permissions.md holds story-wall imagery site-wide and says
 * to build the beat typographically (B5, Y2) until a permission is recorded.
 */
export function HeldSlot({
  reason,
  className = "aspect-21/9",
}: {
  reason: string;
  className?: string;
}) {
  return (
    <div
      data-placeholder="held"
      className={`relative overflow-hidden border border-dashed border-oxide/60 bg-oxide/5 ${className}`}
    >
      <p className="absolute inset-x-0 top-0 p-4 text-[11px] leading-snug text-oxide">
        ⛔ SLOT HELD — {reason}
      </p>
    </div>
  );
}
