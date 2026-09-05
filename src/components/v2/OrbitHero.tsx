import type { Beat } from "@/content/lofi/homepage";
import { heroNightSlot, heroSlot } from "@/content/lofi/media";
import { MediaOrField } from "@/components/ui/MediaOrField";
import { SplitReveal } from "@/components/motion/text/SplitReveal";

/**
 * T7 — the artwork orbit. Home hero, proposal 2 (the Danu wheel in this
 * brand's terms). Presentation only; src/lib/motion/orbit.ts drives it.
 *
 * ▲ ARTWORK — the intended cards are Leonard Mickelo's artworks, queued on
 * the permissions sign-off list. Until a yes is recorded the slats are the
 * cleared set: photography, era colour fields and type. Swapping a slat's
 * content in is a markup change only.
 *
 * The slats sit radially (paddles on a waterwheel), which is how the
 * reference's dominoes read — no per-card counter-rotation, one wheel
 * transform per frame.
 */

type Slat =
  | { kind: "photo"; src: string | null; alt: string }
  | { kind: "field"; label: string; detail: string; className: string };

const SLATS: Slat[] = [
  { kind: "photo", src: heroSlot.src, alt: "" },
  { kind: "field", label: "Today", detail: "Turraburra", className: "bg-evergreen text-canvas" },
  { kind: "field", label: "Wonder", detail: "On Country", className: "bg-midnight text-canvas" },
  { kind: "field", label: "Bought back", detail: "2019–2026", className: "bg-roasted text-canvas" },
  { kind: "field", label: "Truth", detail: "Told here", className: "bg-oxide text-canvas" },
  { kind: "field", label: "1950s", detail: "The wrong name", className: "bg-charcoal text-canvas" },
  { kind: "photo", src: heroNightSlot.src, alt: "" },
  { kind: "field", label: "Living work", detail: "Every week", className: "bg-evergreen text-canvas" },
  { kind: "field", label: "Before the record", detail: "Older", className: "bg-midnight text-canvas" },
  { kind: "field", label: "1902", detail: "Thirty-seven", className: "bg-charcoal text-oxide" },
  { kind: "field", label: "Deep time", detail: "A seabed", className: "bg-charcoal text-canvas" },
  { kind: "field", label: "Iningai Country", detail: "Still here", className: "bg-roasted text-canvas" },
];

/**
 * Slat placement is baked into server-side inline styles: the ring is static
 * (rotate about the wheel's axis, then push out along the slat's own z), and
 * only the WHEEL's rotationX moves per frame. GSAP must not own the slat
 * transforms — its translate-before-rotate ordering would collapse the ring
 * onto a single point.
 */
const RADIUS = 380;

export function OrbitHero({ beat }: { beat: Beat }) {
  const step = 360 / SLATS.length;
  return (
    <section
      data-orbit-root
      className="relative min-h-svh overflow-hidden bg-charcoal [perspective:1400px]"
    >
      <div
        data-orbit-stage
        className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateY(-18deg)]"
      >
        <div
          data-orbit-wheel
          className="absolute left-[62%] top-1/2 [transform-style:preserve-3d]"
        >
          {SLATS.map((slat, index) => (
            <div
              key={index}
              data-orbit-card
              aria-hidden
              className="absolute h-32 w-48 overflow-hidden rounded-lg [backface-visibility:hidden]"
              style={{
                transform: `translate(-50%, -50%) rotateX(${index * step}deg) translateZ(${RADIUS}px)`,
              }}
            >
              {slat.kind === "photo" ? (
                <MediaOrField src={slat.src} alt={slat.alt} sizes="192px" />
              ) : (
                <div
                  className={`flex h-full w-full flex-col justify-between p-4 ${slat.className}`}
                >
                  <span className="eyebrow text-[10px] opacity-80">
                    {slat.label}
                  </span>
                  <span className="headline text-lg leading-tight">
                    {slat.detail}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Depth fog — the wheel recedes into the ground, not into a void. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-radial from-transparent via-charcoal/40 to-charcoal"
      />

      <div className="relative z-10 flex min-h-svh flex-col justify-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-28 lg:px-16">
          <p data-v2-arrive className="eyebrow text-ochre">
            {beat.eyebrow}
          </p>
          <SplitReveal
            as="h1"
            mode="chars"
            gate="entry"
            className="headline mt-6 max-w-4xl text-5xl text-canvas sm:text-6xl lg:text-7xl"
          >
            {beat.headline}
          </SplitReveal>
          <p data-v2-arrive className="mt-8 max-w-xl text-lg leading-relaxed text-canvas/75">
            {beat.body[0]}
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gold">
        <span className="callout scroll-cue block text-scroll">&darr; Scroll</span>
      </div>
    </section>
  );
}
