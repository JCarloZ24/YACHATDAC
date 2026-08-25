import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import type { Beat } from "@/content/homepage";

/** Palette anchor per beat. Explicit map — Tailwind cannot see dynamic names. */
const toneClasses: Record<Beat["tone"], string> = {
  evergreen: "bg-evergreen",
  midnight: "bg-midnight",
  roasted: "bg-roasted",
  oxide: "bg-oxide",
  canvas: "bg-canvas",
  charcoal: "bg-charcoal",
};

/**
 * Beats 2–5 — Wonder, Truth, Belonging, Living Work.
 *
 * Each is a full-height panel with no call to action. The visitor is being
 * carried, not routed. The background changes beat to beat while the content
 * holds its position, which is the "static foreground, moving background"
 * direction agreed in the 18 Aug briefing.
 */
export function BeatSection({ beat }: { beat: Beat }) {
  const onCanvas = beat.tone === "canvas";

  return (
    <section
      id={beat.id}
      className={`relative flex min-h-svh items-center ${toneClasses[beat.tone]}`}
    >
      {/* Artwork slot. Placeholder-first, swap-in-ready (open decision 10):
          the commissioned hero art and repeatable patterns are not blocking
          launch, so this stays a flat field until they arrive. */}
      <div
        aria-hidden
        data-placeholder="beat-media"
        className="absolute inset-0 opacity-0"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 lg:px-16">
        <Reveal>
          <Eyebrow className={onCanvas ? "text-oxide" : "text-ochre"}>
            {beat.eyebrow}
          </Eyebrow>
        </Reveal>

        <Reveal index={1}>
          <h2
            className={`headline mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-(length:--text-beat) ${
              onCanvas ? "text-evergreen" : "text-canvas"
            }`}
          >
            {beat.headline}
          </h2>
        </Reveal>

        <div className="mt-8 max-w-xl space-y-5">
          {beat.body.map((paragraph, index) => (
            <Reveal key={paragraph} index={2 + index}>
              <p
                className={`text-base leading-relaxed ${
                  onCanvas ? "text-evergreen/80" : "text-canvas/75"
                }`}
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
