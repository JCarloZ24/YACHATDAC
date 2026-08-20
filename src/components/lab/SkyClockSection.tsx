"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { register, start } from "@/lib/motion-controller";
import { createSkyClock, toKeyframes, type SkyClockMode } from "@/lib/motion/sky-clock";
import { Reveal } from "@/components/ui/Reveal";
import { beats, invitation, wayForward } from "@/content/homepage";
import { SKY_PHASES } from "./skyPhases";
import styles from "./SkyClock.module.css";

/**
 * A2 — sky clock, over the homepage's seven beats.
 *
 * Copy comes from `src/content/homepage.ts`, which tracks the approved draft
 * (decision D5) — not from the mockup, whose copy predates the v2 sync. Where
 * the two disagree the repo wins: the mockup's Truth beat still carries the
 * withdrawn dating claim's framing and a named heritage site, and its Belonging
 * headline is the v1 wording.
 *
 * The mockup's Truth "story wall" graphic is deliberately not built. See the
 * page notes.
 */

const KEYFRAMES = toKeyframes(SKY_PHASES);

/** The seven beats, in order, matched one-to-one with SKY_PHASES. */
const SECTIONS = [
  ...beats.map((beat) => ({
    id: beat.id,
    eyebrow: beat.eyebrow,
    headline: beat.headline,
    body: beat.body,
  })),
  {
    id: "invitation",
    eyebrow: invitation.eyebrow,
    headline: invitation.headline,
    body: [] as string[],
  },
  {
    id: "way-forward",
    eyebrow: wayForward.eyebrow,
    headline: wayForward.headline,
    body: [wayForward.body],
  },
];

export function SkyClockSection({
  mode,
  reduced,
  onPhase,
}: {
  mode: SkyClockMode;
  reduced: boolean;
  onPhase?: (index: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const unregister = register(
      createSkyClock(host, {
        reduced,
        mode,
        phases: SKY_PHASES,
        onPhase: (index) => {
          setPhase(index);
          onPhase?.(index);
        },
      }),
    );
    start();
    return unregister;
  }, [mode, reduced, onPhase]);

  // X2 — the scroll cue. The only ambient, time-based loop allowed above the
  // fold, and it retires permanently on the first scroll rather than looping
  // for as long as the page is open the way the mockup's CSS keyframes do.
  useEffect(() => {
    const cue = cueRef.current;
    if (!cue || reduced) return;

    const loop = gsap.to(cue, {
      scaleY: 1,
      transformOrigin: "top",
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: "sine.inOut",
    });

    const retire = () => {
      loop.kill();
      gsap.to(cue.parentElement, { opacity: 0, duration: 0.32, ease: "power2.out" });
      window.removeEventListener("scroll", retire);
    };
    window.addEventListener("scroll", retire, { passive: true, once: true });

    return () => {
      loop.kill();
      window.removeEventListener("scroll", retire);
    };
  }, [reduced]);

  const ink = SKY_PHASES[phase]?.ink ?? "canvas";

  return (
    <div ref={hostRef} className={styles.stage} data-ink={ink}>
      {/* Fixed atmosphere. One sky layer and one sun disc per keyframe — the
          cross-fade addresses them by index, so the counts must match. */}
      <div className={styles.atmosphere} aria-hidden="true">
        {KEYFRAMES.map((keyframe, index) => (
          <div
            key={`sky-${index}`}
            data-sky-layer=""
            className={styles.skyLayer}
            style={{ background: keyframe.sky, opacity: index === 0 ? 1 : 0 }}
          />
        ))}

        <div data-stars="" className={styles.stars} style={{ opacity: 0 }} />

        <div data-sun-track="" className={styles.sunTrack}>
          {KEYFRAMES.map((keyframe, index) => (
            <div
              key={`sun-${index}`}
              data-sun-disc=""
              className={styles.sunDisc}
              style={{
                opacity: index === 0 ? 1 : 0,
                // The glow is part of the gradient, not an animated shadow.
                background: `radial-gradient(circle, ${keyframe.sun} 0 22%, color-mix(in srgb, ${keyframe.sun} 45%, transparent) 34%, transparent 68%)`,
              }}
            />
          ))}
        </div>
      </div>

      {SECTIONS.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          data-beat=""
          className={`${styles.beat} ${section.id === "belonging" ? styles.alignRight : ""}`}
        >
          <div className={styles.beatInner}>
            <Reveal>
              <p className="eyebrow opacity-70">
                {String(index + 1).padStart(2, "0")} — {section.eyebrow}
              </p>
            </Reveal>
            <Reveal index={1}>
              <h2 className="headline mt-5 text-4xl sm:text-5xl lg:text-6xl">
                {section.headline}
              </h2>
            </Reveal>
            {section.body.map((paragraph, i) => (
              <Reveal key={i} index={2 + i}>
                <p className="mt-6 max-w-prose text-lg leading-relaxed opacity-85">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            {section.id === "invitation" ? (
              <div className="mt-10 grid gap-px sm:grid-cols-3">
                {invitation.cards.map((card, i) => (
                  <Reveal key={card.title} index={2 + i}>
                    <div className="h-full border border-current/20 p-6">
                      <p className="eyebrow opacity-60">{card.eyebrow}</p>
                      <h3 className="headline mt-2 text-2xl">{card.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed opacity-75">
                        {card.description}
                      </p>
                      <p className="eyebrow mt-5 text-oxide">{card.cta} →</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : null}

            {section.id === "way-forward" ? (
              <Reveal index={3}>
                <p className="callout mt-8 text-2xl opacity-80">
                  {wayForward.tagline}
                </p>
              </Reveal>
            ) : null}

            {index === 0 ? (
              <div className="mt-16 flex items-center gap-3 opacity-60">
                <span
                  ref={cueRef}
                  className="block h-8 w-px origin-top scale-y-0 bg-current"
                />
                <span className="eyebrow">Scroll</span>
              </div>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
