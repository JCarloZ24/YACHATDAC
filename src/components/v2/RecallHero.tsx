import type { Beat } from "@/content/lofi/homepage";
import { heroSlot } from "@/content/lofi/media";
import { MediaOrField } from "@/components/v2/MediaOrField";

/**
 * A5 — The Recall. Home hero, proposal 1 (Ivy's blur-into-the-past opening).
 * Presentation only; the choreography lives in src/lib/motion/recall.ts and
 * reads this markup by its data attributes.
 *
 * The server markup is the FINISHED frame — sharp plate visible, tints off,
 * title present — so the page is complete with JavaScript off and under
 * reduced motion. The module rewinds to the rest state at init, beneath the
 * loader, then plays the arrival.
 *
 * All three plates are the same optimized asset (same src, same sizes → one
 * request); the blur on the soft plates is static CSS, rendered once — the
 * animation only ever crossfades opacity (SKILL.md: no per-frame filter).
 */
export function RecallHero({ beat }: { beat: Beat }) {
  return (
    <section
      data-recall-root
      className="relative flex min-h-svh items-end overflow-hidden bg-charcoal"
    >
      <div
        aria-hidden
        data-recall-plate="deep"
        className="absolute inset-0 scale-110 opacity-0 blur-2xl"
      >
        <MediaOrField src={heroSlot.src} alt="" sizes="100vw" />
      </div>
      <div
        aria-hidden
        data-recall-plate="mid"
        className="absolute inset-0 scale-105 opacity-0 blur-md"
      >
        <MediaOrField src={heroSlot.src} alt="" sizes="100vw" />
      </div>
      <div data-recall-plate="sharp" className="absolute inset-0">
        <MediaOrField
          src={heroSlot.src}
          alt="Turraburra — Country at first light."
          sizes="100vw"
          priority
        />
      </div>

      {/* The era washes — Truth's ground ladder, run upward on arrival. */}
      <div aria-hidden data-recall-tint="charcoal" className="absolute inset-0 bg-charcoal opacity-0" />
      <div aria-hidden data-recall-tint="navy" className="absolute inset-0 bg-midnight opacity-0" />
      <div aria-hidden data-recall-tint="roasted" className="absolute inset-0 bg-roasted opacity-0" />
      <div aria-hidden data-recall-tint="evergreen" className="absolute inset-0 bg-evergreen opacity-0" />

      {/* X5 — legibility scrim under the copy. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal/85 via-charcoal/25 to-transparent"
      />

      <div
        data-recall-title
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 lg:px-16"
      >
        <p className="eyebrow text-ochre">{beat.eyebrow}</p>
        <h1 className="headline mt-6 max-w-4xl text-5xl text-canvas sm:text-6xl lg:text-7xl">
          {beat.headline}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-canvas/75">
          {beat.body[0]}
        </p>
      </div>

      <div
        data-recall-cue
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold"
      >
        <span className="callout scroll-cue block text-scroll">&darr; Scroll</span>
      </div>
    </section>
  );
}
