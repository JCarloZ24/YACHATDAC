"use client";

/**
 * /about — the ten seams. Verb: ANSWERS.
 *
 * Built to Figma `REF · SCORE · 05 ABOUT — the ground ramp, the pacing, and
 * the ten seams` (2642:19666). This module is the SEAM PASS: it animates the
 * joins between the eleven sections and the X4 baseline arrivals, and nothing
 * inside a section. The interiors — §03's 300vh pin, IMG-03, the animated
 * ground ramp, the line-mask settle — are a later pass, ledgered at
 * `docs/motion/scenes.md:331-390`.
 *
 * THE SCORE'S SEAM LADDER, and where each lives:
 *
 *   01 → 02   Wave / Divider · OFF-WHITE          coverSeams (gated slide)
 *   02 → 03   ground sweep, scrubbed              coverSeams + nameAndRule (rule out) + questionRule (echo)
 *   03 → 03b  HARD CUT — waveless, ruleless       coverSeams (charcoal covers charcoal)
 *   03b → 04  Wave / Divider · OFF-WHITE          coverSeams
 *   04 → 05   ring contracts, transform-only      coverSeams + loopAndRing (ring out) + valuesRelay
 *   05 → 06   Wave / Divider · NAVY               coverSeams
 *   06 → 07   Wave / Divider · OFF-WHITE + lift   coverSeams + boardHandoff (overlap out)
 *   07 → 08   Dots / Rule only, no ground change  coverSeams + partnersDots
 *   08 → 09   Wave / Divider · CHARCOAL + doors   coverSeams + doorsAssembly
 *   09 → 10   continuous charcoal                 no code, deliberately
 *
 * THE WAVE SEAMS ARE PINNED HAND-OFFS (user direction, 8 Sep 2026). The
 * outgoing section pins when its foot meets the viewport's, and the incoming
 * section — its wave statically seated on its crest — slides up and covers it
 * over roughly one viewport of scroll. The wave never takes a tween: the
 * cover IS its motion, driven by scroll, which is also what fixed the
 * disappearing-wave defect (GSAP's inline transform was clobbering the
 * Tailwind seat-translate; now nothing writes transforms to a wave at all).
 * ⚠ This spends five pins where the score's played-tween reading spent none
 * and the grammar budgets one pin per page (§03's, still unspent) — a
 * deliberate deviation, flagged for design sign-off.
 *
 * Page-specific like `truth-descent.ts`, not part of the cross-page vocabulary
 * in `recipes.ts` — §03b reuses that file's `breath` directly.
 *
 * SEAM TRIGGERS ARE HAND-ROLLED inside `build`, per the `vessels` precedent:
 * `composition()`'s own timeline runs `start: "top top"`, and a seam lives at a
 * section's foot or crest, so each seam creates its own ScrollTrigger. They are
 * created inside the matchMedia context, so `destroy` reverts them with
 * everything else, and none of them exists under prefers-reduced-motion.
 *
 * The rules that carry meaning across a seam (§02's fact rule, §06's
 * timeline, §09's thread) are scrubbed — a carry happens at the reader's own
 * pace — with SCRUB tokens, never `true`.
 *
 * CHANNEL ACCOUNTING (F7, asserted in dev): only §06 and §09 are loud in
 * `transition` on this page, and `overlap` — the one LOUD-table effect used —
 * belongs to §06. `waveHandoff` is furniture (quiet by the LOUD list's own
 * comment) and the hand-rolled rule/clip/ring tweens take no screen.
 *
 * GROUP G (the traveller) IS NOT HERE. Every Guide placement is ▲ Leonard
 * Mickelo's to approve; the sections carry named comments where its legs would
 * attach, and nothing more.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WAVE_ROLL } from "@/components/ui/Furniture";
import { clearAll, composition } from "@/lib/motion/compose";
import { registerYachatdacEffects } from "@/lib/motion/effects";
import { pointerScene } from "@/lib/motion/scene";
import {
  clampScrollTo,
  lockScroll,
  smoothScrollActive,
  smoothScrollTo,
  unlockScroll,
} from "@/lib/motion/smooth-scroll";
import { DUR, EASE, SCRUB, STAGGER } from "@/lib/motion/tokens";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

const q = <T extends HTMLElement>(root: HTMLElement, sel: string) =>
  root.querySelector<T>(sel);
const qa = <T extends HTMLElement>(root: HTMLElement, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel));

/**
 * The pinned hand-offs — the five wave seams as holds.
 *
 * The outgoing section pins (no spacer) the moment its foot meets the
 * viewport's; the incoming section keeps scrolling and covers it, its
 * statically-seated wave leading the edge, until the incoming top reaches the
 * viewport top and the pin releases — by then the outgoing section is fully
 * covered, so its return to flow is invisible. Painting order needs no
 * z-index: both sections are positioned with `z-index: auto`, so the later
 * sibling draws above the pinned one.
 *
 * ⚠ NO GSAP TRANSFORM EVER TOUCHES A WAVE. The wave's seat is a Tailwind
 * translate compiled onto `transform`, and any inline write clobbers it —
 * that was the disappearing-wave defect. Here the wave just rides its
 * section.
 *
 * THE PAGE IS A DECK (user direction, 8 Sep 2026 — "think of it like a
 * PowerPoint presentation"). A section is a slide: from 0–99% of its reading
 * the next slide is never visible and the scroll is ordinary reading (the
 * slide's internal animations, a future pass, ride that); at 100% — the
 * slide's foot meeting the viewport's — the page STOPS and further scroll
 * charges the hold (see BUFFER); a full charge PLAYS the transition. The
 * hand-off always runs whole: down seats the next slide, up restores the
 * previous one, and the wheel is held while it plays (lenis `lock`) exactly
 * as a slide transition cannot be scrubbed. There is no mid-state: a seam is
 * never somewhere the page rests.
 *
 * Driven by a plain deb/immediate native-scroll listener into
 * `smoothScrollTo` (lenis-aware) — NOT ScrollTrigger's `snap`, whose tween
 * writes `scrollTop` in competition with lenis's own interpolation and loses
 * quietly, and not ST's `scrollEnd` event, which live testing showed
 * unreliable under lenis's interpolation tail.
 *
 * ⚠ POINTER-AND-WHEEL ONLY — `pointerScene`, not `scene` (user direction,
 * 9 September 2026). The deck is built on lenis: the hold is a lenis stop,
 * and only lenis can make a scroll stop total. Lenis is constructed for
 * `(pointer: fine)` and no-reduced-motion and for nothing else, so gating the
 * deck on anything wider than that builds pins and auto-play glides on a
 * surface with no lenis under them. On a phone that is exactly what happened:
 * a flick's momentum crossed a gate, the glide fired against the thrown
 * scroll, and the two fought — the jumpy, buggy read reported from a
 * touchscreen. Touch now gets the page in flow: no pins, no holds, no
 * charge, no magnet, waves seated statically where the markup puts them, and
 * the sections' own scrubs and arrivals still running. Under
 * prefers-reduced-motion the same is true (X6: "no pins created"), which is
 * why one condition covers both and needs no cut branch — nothing is ever
 * built to undo.
 */
/**
 * The hold's charge requirement, as a fraction of the viewport. When a slide
 * reads 100% (its foot meeting the viewport's), the page STOPS — scroll
 * input no longer moves the view at all. Wheel-down input charges the gate
 * instead (the rail's teal bar); this constant is how much accumulated
 * deltaY, in viewport-heights, counts as a full charge. Idling drains the
 * charge back to nothing — partial charge is never banked — wheel-up hands
 * the page back to reading, and a full charge plays the transition. The
 * same fraction is also the gate's positional lead-in: the played glide
 * traverses it, so the incoming slide's edge peeks below as the transition
 * opens. Short slides (the Breath) skip the hold: their whole slide is one
 * glance.
 */
export const BUFFER = 0.2;

export function coverSeams(
  seams: Array<{ out: HTMLElement; over: HTMLElement }>,
): MotionModule {
  let revert: (() => void) | null = null;
  return {
    init: () => {
      revert = pointerScene(
        () => {
          registerYachatdacEffects();

          // The crest's READY height while a hold is charging: the dock
          // raises the wave this far, and the reader's ticks PULL it the
          // rest of the way up — the wave itself is the charge gauge,
          // peeking taller from the fold with every notch and relaxing
          // back as an idle charge drains. Full pull = full crest = the
          // transition releases.
          const CREST_READY = 0.6;

          // How far the roll actually TRAVELS. Landing identical to the
          // Figma resting shape pins the endpoints, not the distance: the
          // crest is ARMED this far left of home (any offset inside the
          // tiled strip is seamless) and a play settles it rightward into
          // home. The full two-tile sweep the strip allows read as a
          // conveyor; a sixth of it reads as water shifting.
          const ROLL_REACH = WAVE_ROLL * 0.15;

          const gates = seams.map(({ out, over }) => {
            // A slide shorter than the viewport cannot wait for its foot to
            // meet the viewport's — that pins it mid-screen (the Breath held
            // its photograph in the middle of the page). A short outgoing
            // slide gates at "top top" instead: it seats, and the incoming
            // section — already adjacent below it in flow — plays over it
            // from there.
            const short = () => out.offsetHeight <= window.innerHeight + 1;

            // The wave belongs to the TRANSITION, not to the reading above
            // it: statically seated it overhangs its section by ~104px and
            // pokes into the outgoing section's last stretch. Hidden until
            // this gate opens — and its INK (the tiled strip inside the
            // svg, an SVG child whose transform attribute cannot clobber
            // the root's seat translate) both RISES and ROLLS as the
            // transition plays: the crest travels sideways like water while
            // it surfaces, and the roll's distance (WAVE_ROLL) lands on an
            // identical tile so the resting wave matches the static markup
            // exactly. Short-slide seams skip all of this: there the
            // incoming section rides visibly against the photograph the
            // whole way, wave on its crest, per the score's "the
            // photograph's horizon becomes the loop's baseline".
            const wave = short()
              ? null
              : over.querySelector<HTMLElement>('[data-seam="wave"]');
            const ink =
              wave?.querySelector<SVGGElement>("[data-wave-ink]") ?? null;
            // THE CREST'S LAW: whenever the seam's edge or the 100% mark is
            // on screen, the crest is full — and once up, it never leaves
            // the screen by vanishing. It SWELLS at the fold when the page
            // docks at the mark (growWave, from engage — that is the crest
            // announcing the seam), STANDS through the hold and after a
            // rewind lands (the earlier build re-armed it to zero the
            // instant a rewind finished, deleting the crest in one frame in
            // front of the reader — the reported defect), ROLLS right
            // through a play and in reverse through a rewind, and only
            // FADES once the page is genuinely back in the reading above
            // the mark, where the wave is off-screen anyway.
            const crestUp = () =>
              !!wave && Number(gsap.getProperty(wave, "opacity")) > 0.5;

            const growWave = () => {
              if (!wave || !ink) return;
              const up = crestUp();
              gsap.killTweensOf([wave, ink]);
              gsap.set(wave, { autoAlpha: 1 });
              if (up) {
                // Already standing (a re-dock, or a rewind's full crest):
                // ease to the ready height and the armed position — never
                // vanish-and-regrow.
                gsap.to(ink, {
                  scaleY: CREST_READY,
                  x: -ROLL_REACH,
                  duration: 0.35,
                  ease: EASE.quiet,
                });
              } else {
                gsap.fromTo(
                  ink,
                  { scaleY: 0, transformOrigin: "50% 100%", x: -ROLL_REACH },
                  { scaleY: CREST_READY, duration: 0.45, ease: EASE.country },
                );
              }
            };

            // The pull. Charge feedback on the crest itself: ready height
            // at 0, full at 1, eased so ticks read as tugs and the drain
            // as the wave settling back. No-op until the crest is up.
            const pullWave = (p: number) => {
              if (!ink || !crestUp()) return;
              gsap.to(ink, {
                scaleY: CREST_READY + (1 - CREST_READY) * p,
                duration: 0.22,
                ease: "power2.out",
                overwrite: "auto",
              });
            };

            const rollWave = (reverse = false) => {
              if (!wave || !ink) return;
              gsap.killTweensOf([wave, ink]);
              gsap.set(wave, { autoAlpha: 1 });
              gsap.set(ink, { scaleY: 1 });
              // Short travel (ROLL_REACH), timed to the transition: fastest
              // at the release — when the cover's own motion masks it —
              // then decelerating continuously home, done about when the
              // slide seats. A pure ease-out has no mid-flight surge.
              gsap.fromTo(
                ink,
                { x: reverse ? 0 : -ROLL_REACH },
                {
                  x: reverse ? -ROLL_REACH : 0,
                  duration: DUR.large * 1.5,
                  ease: "power2.out",
                },
              );
            };

            const showWave = wave
              ? (self: ScrollTrigger) => {
                  // Forward plays are primed by the glide; the roll owns
                  // the ink until it lands.
                  if (self.isActive && self.direction > 0) return;
                  if (!ink) return;
                  if (self.isActive) {
                    // Rewinding: full crest immediately, rolling in
                    // REVERSE while the seam recedes.
                    rollWave(true);
                    return;
                  }
                  if (self.progress >= 1) {
                    // Past the seam (seated, refresh, deep link): the
                    // component's own resting shape, shown instantly.
                    gsap.killTweensOf(ink);
                    gsap.set(wave, { autoAlpha: 1 });
                    gsap.set(ink, { scaleY: 1, x: 0 });
                    return;
                  }
                  // Below the gate. A rewind LANDS here (at the mark, where
                  // the crest is naturally on screen at the fold) — the
                  // crest keeps standing; it must never vanish in place.
                  // Only when the page is genuinely back in the reading
                  // above the mark (a refresh/resize there) does it fade,
                  // off-screen, and re-arm the roll.
                  const mark =
                    self.start -
                    (short() ? 0 : Math.round(window.innerHeight * BUFFER));
                  if (window.scrollY > mark - 8) return;
                  gsap.killTweensOf(ink);
                  gsap.to(wave, {
                    autoAlpha: 0,
                    duration: 0.3,
                    overwrite: "auto",
                  });
                  gsap.set(ink, { x: -ROLL_REACH });
                }
              : undefined;
            if (wave) gsap.set(wave, { autoAlpha: 0 });
            if (ink)
              gsap.set(ink, {
                scaleY: 0,
                transformOrigin: "50% 100%",
                x: -ROLL_REACH,
              });

            return {
              isShort: short,
              /** The dock swell — the crest rising to ready at the fold. */
              growWave: wave && ink ? growWave : null,
              /** The charge pull — crest height tracking the charge. */
              pullWave: wave && ink ? pullWave : null,
              /** The play roll — full crest, rolling right. */
              primeWave: wave && ink ? () => rollWave(false) : null,
              t: ScrollTrigger.create({
                trigger: out,
                // Tall slides open their gate BUFFER late — see the constant.
                start: () =>
                  short()
                    ? "top top"
                    : `bottom bottom-=${Math.round(window.innerHeight * BUFFER)}`,
                endTrigger: over,
                end: "top top",
                pin: out,
                pinSpacing: false,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                // onRefresh too: a deep link or resize must land the wave in
                // the state its scroll position has earned, not wait for a
                // toggle that already happened.
                onToggle: showWave,
                onRefresh: showWave,
              }),
            };
          });

          // The projector, with a charging hold. Three zones per seam,
          // reading down the page:
          //   READING — ordinary scroll, fully inert.
          //   THE HOLD — at the 100% mark the page STOPS. Scroll input no
          //     longer moves the view; wheel-down CHARGES the gate (the
          //     rail's teal bar), idling drains the charge, wheel-up hands
          //     the page back to reading. The view stands perfectly still.
          //   THE GATE — a full charge releases it: the whole transition
          //     plays, wheel held, and the next slide seats. Entering the
          //     gate from below rewinds to the 100% mark the same way.
          // The hold needs lenis (only lenis makes a stop total); without
          // it — touch, or smooth scroll torn down — the lead-in zone
          // free-scrolls and the gate plays on entry, as before.
          const buf = () => Math.round(window.innerHeight * BUFFER);
          const readMark = (g: (typeof gates)[number]) =>
            g.isShort() ? g.t.start : g.t.start - buf();
          const inGate = (y: number, pad: number) =>
            gates.find((g) => y > g.t.start + pad && y < g.t.end - pad);
          const inBuffer = (y: number) =>
            gates.find(
              (g) => !g.isShort() && y > readMark(g) + 2 && y <= g.t.start + 1,
            );
          const nameOf = (g: (typeof gates)[number]) =>
            (g.t.vars.pin as HTMLElement).getAttribute("data-ab") ?? "?";

          // The site header is a 130px overlay that scrolls with the page,
          // and the FIRST hold parks well short of that (the hero's 100%
          // mark is ~84px in), leaving the navbar's lower half hanging on
          // screen. A scrubbed exit boost walks it out ~1.5× faster than
          // the page, so it is fully gone by the moment the hold can
          // engage — and it returns symmetrically on the way back up.
          // gates[0] is the hero's (the pair list starts there).
          const header = document.querySelector<HTMLElement>("header");
          const firstGate = gates[0];
          if (header && firstGate && !firstGate.isShort()) {
            gsap.fromTo(
              header,
              { y: 0 },
              {
                y: () =>
                  -Math.max(0, header.offsetHeight - readMark(firstGate) + 8),
                ease: EASE.machine,
                scrollTrigger: {
                  trigger: document.body,
                  start: 0,
                  end: () => readMark(firstGate),
                  scrub: SCRUB.light,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          let lastY = window.scrollY;
          let playing = false;
          let playTarget = -1;
          let playSafety = 0;
          let holding: (typeof gates)[number] | null = null;
          let firing = false;
          let crestBeat: gsap.core.Tween | null = null;
          let settleUntil = 0;
          const charge = { p: 0 };
          let drain: gsap.core.Tween | null = null;

          // The hold announces itself to assistive tech (MOTION-SYSTEM.md
          // §Accessibility: scroll-jacking must not trap keyboard or
          // screen-reader users). Browse-mode readers never depended on the
          // scroll system — the DOM is complete, rest state is the finished
          // state — but anyone AT the hold is told how to move on.
          const live = document.createElement("div");
          live.className = "sr-only";
          live.setAttribute("aria-live", "polite");
          document.body.appendChild(live);

          // Bring a held page back to its 100% mark. Lenis's lerp carries
          // the page a few frames PAST the mark before the crossing is
          // seen, and an instant clamp back reads as a glitch-bounce
          // (100% → ~92% → snap). Real overshoots settle back with a short
          // eased glide instead — the magnet catching — while sub-pixel
          // drifts still clamp invisibly. Debounced so the settle's own
          // scroll events cannot restart it mid-flight; `force` moves the
          // page through its own lock.
          const settleToMark = (g: (typeof gates)[number]) => {
            const over = window.scrollY - readMark(g);
            if (Math.abs(over) <= 2) return;
            if (Math.abs(over) > 6) {
              if (Date.now() < settleUntil) return;
              settleUntil = Date.now() + 450;
              smoothScrollTo(readMark(g), 0.3, true, true);
            } else {
              clampScrollTo(readMark(g));
            }
          };

          // The rail listens to both; anyone tuning can watch the deck think.
          const announce = (
            action: string,
            from: number,
            to: number,
            name: string,
          ) => {
            window.dispatchEvent(
              new CustomEvent("ab:gate", {
                detail: { action, from: Math.round(from), to: Math.round(to), name },
              }),
            );
          };
          const announceCharge = (g: (typeof gates)[number], p: number) => {
            // The crest and the rail hear the same number, always.
            g.pullWave?.(p);
            window.dispatchEvent(
              new CustomEvent("ab:buffer", {
                detail: { name: nameOf(g), progress: p },
              }),
            );
          };

          const glide = (
            action: "play" | "rewind",
            g: (typeof gates)[number],
            target: number,
            prime = true,
          ) => {
            playing = true;
            playTarget = target;
            window.clearTimeout(playSafety);
            playSafety = window.setTimeout(() => {
              playing = false;
            }, 2200);
            // Every forward play starts with the crest full and rolling —
            // growth belongs to the dock (engage), never to a moment when
            // the seam edge is on screen. The hold's release primes just
            // before calling here.
            if (action === "play" && prime) g.primeWave?.();
            announce(action, window.scrollY, target, nameOf(g));
            smoothScrollTo(target, 0.9, true);
          };

          const release = () => {
            drain?.kill();
            drain = null;
            holding = null;
            live.textContent = "";
            unlockScroll();
          };

          // The full-charge release — the crest beat, then the play. Shared
          // by the wheel's charge, the keyboard escape and the native-jump
          // fallback: whatever completes the charge fires the same way. The
          // beat is rhythm, not formation (the crest grew at the dock);
          // `firing` keeps further input from double-releasing during it.
          const fire = (g: (typeof gates)[number]) => {
            if (firing || playing) return;
            firing = true;
            charge.p = 1;
            announceCharge(g, 1);
            crestBeat = gsap.delayedCall(0.2, () => {
              firing = false;
              release();
              g.primeWave?.();
              glide("play", g, g.t.end, false);
            });
          };

          const engage = (g: (typeof gates)[number]) => {
            holding = g;
            drain?.kill();
            charge.p = 0;
            announceCharge(g, 0);
            lockScroll();
            settleToMark(g);
            // The dock announces itself: the crest swells up at the fold
            // (or simply keeps standing if it already is), and assistive
            // tech is told how to move on.
            g.growWave?.();
            live.textContent =
              "Section complete. Scroll on, or press Page Down, to open the next section.";
          };

          // The wheel capture is armed only AT the mark (a hair of
          // tolerance), never below it: charging must not begin while
          // reading progress is short of 100% — a fixed one-notch window
          // here once swallowed the hero's entire 84px read, filling the
          // buffer in step with the gold bar. Below the mark a tick stays
          // ordinary scroll (which is also what walks the navbar out); the
          // crossing itself is caught by the scroll-engage and its soft
          // settle, and only a page RESTING at 100% turns ticks straight
          // into charge with zero motion.
          const nearMark = (y: number) =>
            gates.find(
              (g) =>
                !g.isShort() && y >= readMark(g) - 6 && y <= g.t.start + 1,
            );

          const onWheel = (e: WheelEvent) => {
            if (firing || playing) return;
            // Normalize: Firefox reports lines (mode 1), not pixels.
            const dy =
              e.deltaY *
              (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
            if (!holding) {
              // The pre-capture. This listener is registered in the CAPTURE
              // phase, so it runs before lenis's within the same dispatch:
              // locking here means lenis sees a stopped instance and drops
              // the event — the tick becomes charge, never motion.
              if (dy <= 0 || !smoothScrollActive()) return;
              const g = nearMark(window.scrollY);
              if (!g) return;
              engage(g);
            }
            const g = holding;
            if (!g) return;
            if (dy < 0) {
              // Upward intent: the hold opens its hand.
              charge.p = 0;
              announceCharge(g, 0);
              release();
              return;
            }
            drain?.kill();
            charge.p = Math.min(1, charge.p + dy / buf());
            announceCharge(g, charge.p);
            if (charge.p >= 1) {
              fire(g);
            } else {
              // Partial charge is never banked: pause and it leaks away.
              drain = gsap.to(charge, {
                p: 0,
                delay: 0.4,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => announceCharge(g, charge.p),
              });
            }
          };
          window.addEventListener("wheel", onWheel, {
            passive: true,
            capture: true,
          });

          // The keyboard escape — the skip mechanism MOTION-SYSTEM.md's
          // accessibility rules require, handled at INTENT time (keydown)
          // rather than scroll time, where the hold's clamp and lenis's
          // stop fight native movement before any threshold can read it.
          // A held page treats a downward key as the full charge —
          // keyboard paging is deliberate — and an upward key as the hand
          // opening: release() runs synchronously inside the keydown, so
          // the same press's native scroll executes against an
          // already-unlocked page.
          const onKey = (e: KeyboardEvent) => {
            if (!holding || firing || playing) return;
            const t = e.target as HTMLElement | null;
            if (t?.closest?.("input, textarea, select, [contenteditable=true]"))
              return;
            const isSpace = e.key === " " || e.key === "Spacebar";
            if (
              e.key === "PageDown" ||
              e.key === "ArrowDown" ||
              (isSpace && !e.shiftKey)
            ) {
              e.preventDefault();
              fire(holding);
            } else if (
              e.key === "PageUp" ||
              e.key === "ArrowUp" ||
              e.key === "Home" ||
              (isSpace && e.shiftKey)
            ) {
              charge.p = 0;
              announceCharge(holding, 0);
              release();
            }
          };
          window.addEventListener("keydown", onKey);

          const onScroll = () => {
            const y = window.scrollY;
            const dir: 1 | -1 = y >= lastY ? 1 : -1;
            lastY = y;
            if (playing) {
              if (Math.abs(y - playTarget) <= 2) playing = false;
              return;
            }
            if (holding) {
              const over = y - readMark(holding);
              // A decisive upward native jump (scrollbar, focus moving
              // back) is an escape, not a drift — open the hand rather
              // than dragging the reader back down.
              if (over < -6) {
                charge.p = 0;
                announceCharge(holding, 0);
                release();
                return;
              }
              // A decisive downward NATIVE jump (screen readers, focus
              // scrolls, scrollIntoView) is intent, not drift — honor it
              // as the full charge instead of fighting it. The leaks the
              // magnet settles stay well under this; keys are caught
              // earlier, at keydown.
              if (over > 120 && Date.now() >= settleUntil) {
                fire(holding);
                return;
              }
              // Everything else: a hold is a hold — settle drifts back.
              settleToMark(holding);
              return;
            }
            const gate = inGate(y, 1);
            if (gate) {
              glide(
                dir > 0 ? "play" : "rewind",
                gate,
                dir > 0 ? gate.t.end : readMark(gate),
              );
              return;
            }
            const b = inBuffer(y);
            if (b && dir > 0 && smoothScrollActive()) engage(b);
          };
          window.addEventListener("scroll", onScroll, { passive: true });

          // Deep links and restored scroll positions can WAKE mid-seam or
          // mid-lead-in with no scroll event to resolve them; after the
          // settle refresh, resolve to whichever state the position earned.
          const boot = window.setTimeout(() => {
            if (playing || holding) return;
            const y = window.scrollY;
            const gate = inGate(y, 1);
            if (gate) {
              const fwd =
                (y - gate.t.start) / (gate.t.end - gate.t.start) >= 0.5;
              glide(fwd ? "play" : "rewind", gate, fwd ? gate.t.end : readMark(gate));
            } else {
              const b = inBuffer(y);
              if (b) clampScrollTo(readMark(b));
            }
          }, 1200);

          return () => {
            window.clearTimeout(boot);
            window.clearTimeout(playSafety);
            drain?.kill();
            crestBeat?.kill();
            if (holding) unlockScroll();
            live.remove();
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("wheel", onWheel, { capture: true });
            window.removeEventListener("scroll", onScroll);
          };
        },
      );
    },
    destroy: () => {
      revert?.();
      revert = null;
    },
  };
}

/**
 * An ochre rule draws itself left to right, once, when it reaches the reader.
 * Set hollow eagerly so it never shows drawn-then-undrawn.
 */
function ruleIn(rule: HTMLElement, start = "top 85%"): void {
  gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
  gsap.to(rule, {
    scaleX: 1,
    duration: DUR.large,
    ease: EASE.country,
    scrollTrigger: { trigger: rule, start, once: true },
  });
}

/** The X4 baseline: the section's stamped copy arrives once, quietly. */
function arrivals(tl: gsap.core.Timeline, root: HTMLElement): void {
  const els = qa(root, "[data-arrive]");
  if (els.length) tl.arrive(els);
}

/* -------------------------------------------------------------------------
   §01 — heroQuiet · media ⚡4 in the ledger, baseline only in the seam pass
   ------------------------------------------------------------------------- */

export function heroQuiet(root: HTMLElement, span = 110): MotionModule {
  return composition("heroQuiet", root, {
    channel: "none",
    span,
    uses: ["arrive"],
    build: () => {
      /* §01's media moment (P1, ⚡4) is the interiors pass. Nothing scrubs. */
    },
    enter: arrivals,
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §02 — nameAndRule · seams 01 → 02 and 02 → 03
   ------------------------------------------------------------------------- */

/**
 * Markup:
 *   [data-seam="wave"]          the off-white wave — static, rides coverSeams
 *   [data-ab-rule="seam-out"]   the bottom rule that extends into §03's
 *   [data-arrive]               the name block
 */
export function nameAndRule(root: HTMLElement, span = 299): MotionModule {
  return composition("nameAndRule", root, {
    channel: "none",
    span,
    uses: ["arrive"],
    build: () => {
      // 02 → 03 · "ground sweep, scrubbed — the last fact rule extends and
      // becomes the quote rule." The extension happens at reading pace, as the
      // section's foot crosses the viewport; scrolling back retracts it.
      const rule = q(root, '[data-ab-rule="seam-out"]');
      if (rule) {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: EASE.machine,
            scrollTrigger: {
              trigger: root,
              start: "bottom 85%",
              end: "bottom 35%",
              scrub: SCRUB.light,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    },
    enter: arrivals,
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §02's road — its own screen, and the page's one media-loud scrub
   ------------------------------------------------------------------------- */

/**
 * The ledger rules §02 three screens — "decode (type) → the road (media) →
 * register (type, quiet)" (scenes.md:358) — so the road declares its own
 * channel and F7 is satisfied per screen, exactly as the law is written.
 *
 * Markup:
 *   [data-media][data-plane="mid"]  the oversized plane inside the clip;
 *                                   `movable()` holds `frame`-graded photos
 */
export function roadScreen(root: HTMLElement, span = 62): MotionModule {
  return composition("roadScreen", root, {
    channel: "media",
    span,
    uses: ["plateParallax"],
    build: () => {
      const media = qa(root, "[data-media]");
      if (!media.length) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: SCRUB.normal,
          invalidateOnRefresh: true,
        },
      });
      tl.plateParallax(media, { duration: 1 }, 0);
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §03 — questionRule · seam 02 → 03's echo, and nothing else yet
   ------------------------------------------------------------------------- */

/**
 * The pin, the animated ramp, IMG-03 and the line-mask settle all belong to
 * the interiors pass; the static gradient carries the ground until then.
 *
 * Markup:
 *   [data-ab-rule="quote"]  the thread's first appearance, under the question
 *   [data-arrive]           the claims block
 */
export function questionRule(root: HTMLElement, span = 235): MotionModule {
  return composition("questionRule", root, {
    channel: "none",
    span,
    uses: ["arrive"],
    build: () => {
      const rule = q(root, '[data-ab-rule="quote"]');
      if (rule) ruleIn(rule, "top 82%");
    },
    enter: arrivals,
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §04 — loopAndRing · seams 03b → 04 and 04 → 05
   ------------------------------------------------------------------------- */

/**
 * Markup:
 *   [data-seam="wave"]        the off-white wave — static, rides coverSeams
 *   [data-artwork="ring-b"]   the closed ring that contracts toward §05
 *   [data-arrive]             the header block and the card rail
 */
export function loopAndRing(root: HTMLElement, span = 265): MotionModule {
  return composition("loopAndRing", root, {
    channel: "none",
    span,
    uses: ["arrive"],
    build: () => {
      // 04 → 05 · "ring contracts, transform-only scrub — the closed ring
      // becomes the bullet of COUNTRY FIRST." Scale and a small drop as the
      // section leaves; §05's first value rule receives it (valuesRelay).
      const ring = q(root, '[data-artwork="ring-b"]');
      if (ring) {
        gsap.to(ring, {
          scale: 0.72,
          yPercent: 8,
          ease: EASE.machine,
          scrollTrigger: {
            trigger: root,
            start: "bottom 70%",
            end: "bottom 20%",
            scrub: SCRUB.normal,
            invalidateOnRefresh: true,
          },
        });
      }
    },
    enter: arrivals,
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §05 — valuesRelay · seam 04 → 05's landing
   ------------------------------------------------------------------------- */

/**
 * Markup:
 *   [data-ab-rule="value"]  the first value's gold rule — the contracted
 *                           ring's landing (the frame's "bullet" is not built)
 *   [data-ab-eyebrow]       COUNTRY FIRST, arriving with it
 *   [data-arrive]           the header block
 */
export function valuesRelay(root: HTMLElement, span = 249): MotionModule {
  return composition("valuesRelay", root, {
    channel: "none",
    span,
    uses: ["arrive"],
    build: () => {
      const rule = q(root, '[data-ab-rule="value"]');
      if (!rule) return;
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rule, start: "top 85%", once: true },
      });
      tl.to(rule, { scaleX: 1, duration: DUR.large, ease: EASE.country });
      const eyebrow = q(root, "[data-ab-eyebrow]");
      if (eyebrow) tl.arrive(eyebrow, {}, "-=0.35");
    },
    enter: arrivals,
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §06 — boardHandoff · transition ⚡4 · seams 05 → 06 and 06 → 07
   ------------------------------------------------------------------------- */

/**
 * The page's one loud transition composition. Grammar rows: "a change of
 * ground", divider cut (the navy wave) and overlap cut (the board receding
 * under §07's wave — the score's "the Guide goes quiet and waits at the
 * edge", built without the Guide).
 *
 * Markup:
 *   [data-seam="wave"]          the navy wave — static, rides coverSeams
 *   [data-ab-rule="timeline"]   the thread acquiring its date — scrubbed
 *   [data-ab-beat]              the three dots, seating as the draw arrives
 *   [data-ab-lift]              the column that lifts and dims at the foot
 *   [data-ab-date]              2031 — reserved, unanimated (never counted up)
 */
export function boardHandoff(root: HTMLElement, span = 245): MotionModule {
  return composition("boardHandoff", root, {
    channel: "transition",
    span,
    uses: ["overlap", "arrive"],
    build: () => {
      // The thread acquires a date, at reading pace.
      const rule = q(root, '[data-ab-rule="timeline"]');
      if (rule) {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: EASE.machine,
            scrollTrigger: {
              trigger: rule,
              start: "top 80%",
              end: "top 45%",
              scrub: SCRUB.normal,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      // The beats seat left to right as the draw reaches them — a short catch
      // (F9: §06's beats and §09's doors are where this page spends its
      // overshoot), played once, never scrubbed (overshoot on a scrub jitters).
      const beats = qa(root, "[data-ab-beat]");
      if (beats.length) {
        gsap.set(beats, { scale: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: rule ?? root, start: "top 65%", once: true },
        });
        tl.to(beats, {
          scale: 1,
          duration: DUR.small,
          ease: EASE.catch,
          stagger: 0.18,
        });
      }

      // 06 → 07 · the board lifts and dims as the people's wave rides over
      // it. `overlap`'s numbers are deliberately small — a movement at the
      // join, not the page sliding around.
      const lift = q(root, "[data-ab-lift]");
      if (lift) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "bottom 60%",
            end: "bottom 8%",
            scrub: SCRUB.normal,
            invalidateOnRefresh: true,
          },
        });
        tl.overlap(lift, {});
      }
    },
    enter: arrivals,
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §07 — peopleWave · seam 06 → 07's incoming half
   ------------------------------------------------------------------------- */

/**
 * The off-white wave rides over §06's receding board. The scored carry —
 * "2031's endpoint becomes §07's first caption rule" — has no caption rule in
 * the markup, so it lands on the wave and the eyebrow's arrival;
 * `data-ab-rule="caption"` is reserved in Sections.tsx if design adds one.
 *
 * Markup:
 *   [data-seam="wave"]  the off-white wave — static, rides coverSeams
 *   [data-arrive]       the header block
 */
export function peopleWave(root: HTMLElement, span = 145): MotionModule {
  return composition("peopleWave", root, {
    channel: "none",
    span,
    uses: ["arrive"],
    build: () => {
      /* The wave rides the 06 → 07 cover pin; nothing scrubs here yet. */
    },
    enter: arrivals,
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §08 — partnersDots · seam 07 → 08
   ------------------------------------------------------------------------- */

/**
 * "Dots / Rule only, no ground change — the rule, and nothing else." Each
 * group's dotted rule draws itself on as it reaches the reader; clip-path is
 * on the allowed per-frame list, and the rules are the section's whole seam.
 *
 * Markup:
 *   [data-artwork="dots-rule"]  each group's dotted rule (DottedRule stamps it)
 *   [data-arrive]               the header block
 */
export function partnersDots(root: HTMLElement, span = 175): MotionModule {
  return composition("partnersDots", root, {
    channel: "none",
    span,
    uses: ["arrive"],
    build: () => {
      qa(root, '[data-artwork="dots-rule"]').forEach((rule) => {
        gsap.set(rule, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.to(rule, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: DUR.large,
          ease: EASE.country,
          scrollTrigger: { trigger: rule, start: "top 85%", once: true },
        });
      });
    },
    enter: arrivals,
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §09 — doorsAssembly · transition ⚡3 · seam 08 → 09
   ------------------------------------------------------------------------- */

/**
 * "The partner groups' rules become the four doors' edges." Said literally:
 * each door starts as its own top edge — a thin line echoing §08's rules —
 * then opens downward to the full card with the score's short catch (the F9
 * overshoot this section is allocated). No Flip, so nothing here can be
 * mis-scrubbed. The thread that started under §03's question draws taut at
 * the reader's own pace, which is the thread's whole conceit.
 *
 * Declares `transition` per the ledger but uses nothing from the LOUD table —
 * honest headroom, the same shape as §08's `none`.
 *
 * Markup:
 *   [data-seam="wave"]         the charcoal wave — static, rides coverSeams
 *   [data-ab-doors] a          the four doors
 *   [data-ab-rule="thread"]    the thread, arrived — scrubbed
 *   [data-arrive]              the header block and the contact details
 */
export function doorsAssembly(root: HTMLElement, span = 140): MotionModule {
  return composition("doorsAssembly", root, {
    channel: "transition",
    span,
    uses: ["arrive"],
    build: () => {
      const doors = qa(root, "[data-ab-doors] a");
      if (doors.length) {
        gsap.set(doors, { clipPath: "inset(0% 0% 98.5% 0%)", y: 24 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: q(root, "[data-ab-doors]") ?? root,
            start: "top 78%",
            once: true,
          },
        });
        tl.to(doors, {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          duration: DUR.medium,
          ease: EASE.catch,
          stagger: STAGGER.grid,
        });
      }

      const thread = q(root, '[data-ab-rule="thread"]');
      if (thread) {
        gsap.fromTo(
          thread,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: EASE.machine,
            scrollTrigger: {
              trigger: thread,
              start: "top 92%",
              end: "top 60%",
              scrub: SCRUB.light,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    },
    enter: arrivals,
    cut: clearAll,
  });
}
