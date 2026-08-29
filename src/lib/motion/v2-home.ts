"use client";

/**
 * /v2/home — the page choreography beyond the hero.
 *
 * One module, wired by data attributes, so the server markup stays the owner
 * of structure and this file owns nothing but behaviour. Every screen keeps
 * ONE loud channel (F7):
 *
 *   [data-v2-arrive]                 quiet entries — X4-equivalent, once:true
 *   [data-v2-frame] > [data-v2-frame-media]
 *                                    M2 — the frame opens, the image
 *                                    counter-scales; that screen's loud media
 *   [data-v2-sweep]                  a band's ground arrives as a scaleY sweep
 *                                    (transition-loud; transform only)
 *   [data-v2-river] > [data-v2-river-track]
 *                                    Y7 — type river; duplicated track,
 *                                    modulo wrap, scroll velocity adds drift;
 *                                    paused off-screen, absent under reduced
 *   [data-v2-magnet]                 X8 — magnetic pull, fine pointers only
 *
 * Per-frame work is transform/opacity plus M2's clip-path inset, which is the
 * skill's own sanctioned exception (patterns.md).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

const EASE_COUNTRY = "expo.out";
const DUR_MEDIUM = 0.55;

export function createV2Home(): MotionModule {
  let ctx: gsap.Context | null = null;
  let riverTick: (() => void) | null = null;
  const magnetCleanups: Array<() => void> = [];

  const init = () => {
    ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Quiet entries. once:true — re-triggering on scroll-up is banned.
        gsap.utils.toArray<HTMLElement>("[data-v2-arrive]").forEach((el) => {
          gsap.from(el, {
            y: 24,
            opacity: 0,
            duration: DUR_MEDIUM,
            ease: EASE_COUNTRY,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        // M2 — frame expand + counter-scale, scrubbed.
        gsap.utils.toArray<HTMLElement>("[data-v2-frame]").forEach((frame) => {
          const media = frame.querySelector<HTMLElement>(
            "[data-v2-frame-media]",
          );
          if (!media) return;
          const scrub = {
            trigger: frame,
            start: "top 85%",
            end: "top 15%",
            scrub: 0.7,
          };
          gsap.fromTo(
            frame,
            { clipPath: "inset(16% 12% 16% 12%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: scrub },
          );
          gsap.fromTo(
            media,
            { scale: 1.28 },
            { scale: 1, ease: "none", scrollTrigger: scrub },
          );
        });

        // Transition-loud band: the ground sweeps in over the page.
        gsap.utils.toArray<HTMLElement>("[data-v2-sweep]").forEach((sweep) => {
          gsap.fromTo(
            sweep,
            { scaleY: 0, transformOrigin: "top center" },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sweep.parentElement ?? sweep,
                start: "top 85%",
                end: "top 25%",
                scrub: 0.6,
              },
            },
          );
        });

        // Y7 — the type river.
        const river = document.querySelector<HTMLElement>("[data-v2-river]");
        const track = river?.querySelector<HTMLElement>(
          "[data-v2-river-track]",
        );
        if (river && track) {
          const wrap = gsap.utils.wrap(-50, 0);
          const setX = gsap.quickSetter(track, "xPercent") as (
            v: number,
          ) => void;
          const state = { x: 0, boost: 0 };

          riverTick = () => {
            state.boost *= 0.94;
            state.x -= 0.035 + Math.abs(state.boost);
            setX(wrap(state.x));
          };

          ScrollTrigger.create({
            trigger: river,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              state.boost = gsap.utils.clamp(
                -0.5,
                0.5,
                state.boost + self.getVelocity() / 120000,
              );
            },
            onToggle: (self) => {
              if (!riverTick) return;
              if (self.isActive) gsap.ticker.add(riverTick);
              else gsap.ticker.remove(riverTick);
            },
          });
        }
      });

      // X8 — magnetic CTAs. A hover refinement, so it also respects reduced
      // motion by simply never being wired there.
      mm.add(
        "(prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          gsap.utils
            .toArray<HTMLElement>("[data-v2-magnet]")
            .forEach((el) => {
              const toX = gsap.quickTo(el, "x", {
                duration: 0.4,
                ease: "power3.out",
              });
              const toY = gsap.quickTo(el, "y", {
                duration: 0.4,
                ease: "power3.out",
              });
              const onMove = (event: PointerEvent) => {
                const rect = el.getBoundingClientRect();
                const dx = event.clientX - (rect.left + rect.width / 2);
                const dy = event.clientY - (rect.top + rect.height / 2);
                toX(gsap.utils.clamp(-12, 12, dx * 0.22));
                toY(gsap.utils.clamp(-10, 10, dy * 0.22));
              };
              const onLeave = () => {
                toX(0);
                toY(0);
              };
              el.addEventListener("pointermove", onMove);
              el.addEventListener("pointerleave", onLeave);
              magnetCleanups.push(() => {
                el.removeEventListener("pointermove", onMove);
                el.removeEventListener("pointerleave", onLeave);
              });
            });

          return () => {
            magnetCleanups.forEach((fn) => fn());
            magnetCleanups.length = 0;
          };
        },
      );
    });
  };

  const destroy = () => {
    if (riverTick) gsap.ticker.remove(riverTick);
    riverTick = null;
    magnetCleanups.forEach((fn) => fn());
    magnetCleanups.length = 0;
    ctx?.revert();
    ctx = null;
  };

  return { init, destroy };
}
