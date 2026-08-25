"use client";

import { useEffect, useRef } from "react";
import { BeatContent, toneClasses } from "@/components/sections/BeatContent";
import { BeatSection } from "@/components/sections/BeatSection";
import { GhostType } from "@/components/ui/GhostType";
import { MediaTile } from "@/components/ui/MediaTile";
import type { Beat } from "@/content/homepage";
import { skyBeatSlots } from "@/content/media";
import { usePrefersReducedMotion } from "@/lib/motion";
import { register } from "@/lib/motion-controller";
import { createSkyClock, SKY_CLOCK_SPAN_VH } from "@/lib/sections/sky-clock";

/**
 * A2 — Sky coupled to content. Homepage beats 2, 3 and 4.
 *
 * Wonder, Truth and Belonging share one pinned screen. The sky ramps from
 * Midnight Navy through Oxide Red to Roasted Brown while the three beats
 * cross-fade on the same clock — one continuous passage of time rather than
 * three separate sections, which is the point of the beat order.
 *
 * The scroll span is SKY_CLOCK_SPAN_VH and it is reserved in layout, not
 * conjured by ScrollTrigger. The wireframe labels this "A2 beat n of 3" across
 * 83 + 83 + 84 = 250vh, and that label is the handoff contract.
 *
 * WHAT RIDES THE PIN
 * ------------------
 * The colour ramp on its own is invisible: against an empty screen a changing
 * background reads as nothing happening. Three layers give it something to be
 * behind — oversized letterforms at the 0.15 parallax ratio, a settling media
 * tile per beat, and Y2 word emphasis on Truth. None of them adds a pin or a
 * scroll span; they ride the one that already exists, so A2 is still one
 * signature moment and not four.
 *
 * ⚠ TRUTH HAS NO MEDIA TILE AND MUST NOT GET ONE.
 * permissions.md: story-wall imagery is "not resolved — treat as unavailable.
 * Build the Truth beat typographically (B5, Y2)." That is why skyBeatSlots has
 * no `truth` key and why this beat gets `emphasis` instead. Adding a tile here
 * would need a recorded permission, not a code change.
 *
 * TWO TREES, ON PURPOSE
 * ---------------------
 * Under reduced motion this renders three ordinary stacked sections in normal
 * document flow, each at its own tone. Not a slower pin — no pin at all, per
 * the accessibility hard rule ("Pinning is disabled entirely"). The server
 * snapshot of usePrefersReducedMotion is `true`, so first paint is always the
 * safe tree and the pinned one is opted into after hydration.
 */

/** The beat that permissions.md directs to be built typographically. */
const TYPOGRAPHIC_BEAT_ID = "truth";

export function SkyClock({ beats }: { beats: Beat[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReduced) return;
    return register(createSkyClock(root));
  }, [prefersReduced]);

  if (prefersReduced) {
    // Three ordinary beats in document flow. Reuses BeatSection so the two
    // trees cannot drift — same markup, same media slot, same tone handling.
    return (
      <>
        {beats.map((beat) => (
          <BeatSection key={beat.id} beat={beat} />
        ))}
      </>
    );
  }

  return (
    <div
      ref={rootRef}
      data-motion="A2"
      data-span-vh={SKY_CLOCK_SPAN_VH}
      className="relative"
      style={{ height: `${SKY_CLOCK_SPAN_VH}vh` }}
    >
      <div data-sky-pin className="relative h-svh w-full overflow-hidden">
        {/* The sky ramp: solid fields stacked and cross-faded by opacity.
            Not an animated backgroundColor — see sky-clock.ts for why. */}
        <div aria-hidden className="absolute inset-0">
          {beats.map((beat) => (
            <div
              key={beat.id}
              data-sky-layer
              className={`absolute inset-0 ${toneClasses[beat.tone]}`}
            />
          ))}
        </div>

        {beats.map((beat) => {
          const slot = skyBeatSlots[beat.id];
          return (
            <section
              key={beat.id}
              id={beat.id}
              data-sky-beat
              className="absolute inset-0 flex items-center"
            >
              <GhostType word={beat.eyebrow} />

              {slot ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-[7%] hidden w-[26vw] max-w-sm -translate-y-1/2 lg:block"
                >
                  <MediaTile slot={slot} />
                </div>
              ) : null}

              <BeatContent
                beat={beat}
                reveal={false}
                emphasis={beat.id === TYPOGRAPHIC_BEAT_ID}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
