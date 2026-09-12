"use client";

/**
 * /about — the ten seams, and §03's interior. Verb: ANSWERS.
 *
 * Built to Figma `REF · SCORE · 05 ABOUT — the ground ramp, the pacing, and
 * the ten seams` (2642:19666). This module animates the joins between the
 * eleven sections and the X4 baseline arrivals.
 *
 * ⚠ SIX SECTION INTERIORS ARE NOW HERE TOO (12 September 2026, user
 * direction, in this order) — `theRegister` (§02), `theQuestion` (§03),
 * `theLoop` (§04), `theValues` (§05), `theCalendar` (§06) and `theRoster`
 * (§07). Each is a 300vh CSS sticky span, not a GSAP pin, sharing `HELD`'s
 * bounds and about.css's layout; each is documented at length at its own recipe
 * rather than here. §01, §03b and §08 – §11 remain seams only.
 *
 * THE SCORE'S SEAM LADDER, and where each lives:
 *
 *   01 → 02   Wave / Divider · OFF-WHITE          coverSeams (gated slide)
 *   02 → 03   ground sweep, scrubbed              coverSeams + nameAndRule (rule out) + theQuestion (echo)
 *   03 → 03b  HARD CUT — waveless, ruleless       coverSeams (charcoal covers charcoal)
 *   03b → 04  Wave / Divider · OFF-WHITE          coverSeams
 *   04 → 05   ring contracts, transform-only      coverSeams + loopAndRing (ring out) + valuesRelay
 *   05 → 06   Wave / Divider · NAVY               coverSeams
 *   06 → 07   Wave / Divider · OFF-WHITE + lift   coverSeams + boardLift (overlap out) + theRoster
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
 * ⚠ §06 spends its channel at its EDGES — the navy wave in, `boardLift` out —
 * so `theCalendar`, its whole interior, declares `channel: "none"` and the
 * assertion holds it to it. The five held screens are otherwise quiet by
 * construction: `settle`, `arrive` and hand-rolled clips and folds.
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
 * A line-split beat, sized for a SCRUB.
 *
 * ⚠ THE STAGGER HAS TO BE CARRIED ACROSS AS A RATIO, and forgetting that is a
 * real defect rather than a nicety. The grammar sets the line stagger against
 * the line's own duration — `STAGGER.line` 0.09s against `DUR.large` 0.82s,
 * about 11% — and on a PLAYED timeline that ratio is what "90ms stagger" in
 * the frame means. A scrubbed timeline's clock is scroll, not seconds, so a
 * beat authored at duration 0.10 that keeps the 0.09 DEFAULT staggers its
 * lines 90% of a line apart instead of 11%: the last line of a three-line
 * settle then lands a quarter of the whole read after the first.
 *
 * That is what made §03's question still be arriving while its rule, its
 * attribution and its tagline all came in on top of it (reported 12 September
 * 2026 — "should be in sequential"). Every split beat on a scrub goes through
 * here so the proportion is kept and the beat's END is `duration × (1 + 0.11 ×
 * (lines − 1))`, which is the number the sheet has to be laid out against.
 */
const LINE_STAGGER = STAGGER.line / DUR.large;
const lineBeat = (duration: number) => ({
  duration,
  stagger: duration * LINE_STAGGER,
});

/**
 * X4's quiet arrival — 16px and a fade — written as a `fromTo` on a timeline.
 *
 * ⚠ NOT `arrive`, and the reason is subtle enough to be worth writing down:
 * `arrive` is a `gsap.from`, so its END state is whatever the element reads at
 * the moment the tween is BUILT. Everything a held screen brings on is
 * pre-hidden in `build` so nothing can flash before the timeline first
 * renders — and a `from` off a hidden element animates 0 → 0, so the element
 * simply never appears. That is not theoretical: it is how §03's attribution
 * and tagline shipped silently broken until they were measured in a browser
 * (12 September 2026). Declaring both endpoints also keeps `autoAlpha`'s
 * visibility flip inside the tween rather than stranded in a `set`.
 *
 * Same 16px travel and the same curve the X4 row specifies, so it is that row
 * and not a new one.
 */
const quietly = (
  tl: gsap.core.Timeline,
  el: HTMLElement,
  at: number,
  duration = 0.035,
) =>
  tl.fromTo(
    el,
    { autoAlpha: 0, y: 16 },
    { autoAlpha: 1, y: 0, duration, ease: EASE.country },
    at,
  );

/**
 * The bounds every held screen on this page shares.
 *
 * `hold:`'s query from globals.css and the media query about.css is written
 * against, as a pair a composition can spread. It was written out four times
 * before §06 made it five, and the numbers have to agree with the stylesheet
 * exactly: a held layout with no motion, or motion with no held layout, is
 * worse than neither. One place to change, and `about.css`'s header says the
 * same thing from the other side.
 *
 * ⚠ DECLARING THESE MEANS THE CUT BELOW THEM. `composition()` builds the
 * complement branch as `spec.cut` (compose.ts), so a section that also owns
 * something which must never be withheld — §06's seam lift — cannot put that
 * something in a composition carrying these. See `boardLift`.
 */
const HELD = { minWidth: "1024px", minHeight: "820px" } as const;

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

          // D2, August, 11 September 2026: SiteHeader owns its scroll exit
          // and hover reveal. The former exit boost moved its parent too,
          // leaving the recalled 130px bar clipped by 48px on this page.

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
   §02 — theRegister · the page's second held screen
   ------------------------------------------------------------------------- */

/**
 * ⚑ THE REGISTER PASS (12 September 2026, user direction). Built to Figma
 * `2632:19655` — `REF · 05 ABOUT §02 THE REGISTER — the facts arrive one at a
 * time · 6 FRAMES`, whose six states and scroll percentages are this beat
 * sheet. Supersedes `nameAndRule` and `roadScreen`, which were the seam pass's
 * placeholders for it.
 *
 * Grammar rows: "what endures, the name resolves" (`decode`), "what endures"
 * (`settle`), "the page holding its ground, the interior scrub without a read
 * clock", "accumulating" (the register building, X3).
 *
 * THE BOARD'S SIX STATES, and where each lands on this clock:
 *
 *   01  THE NAME, UNRESOLVED            0%    decode begins
 *   02  THE NAME LANDS, AND COLLAPSES  18%    resolves · long name to 0.28 ·
 *                                             settle on the short name
 *   03  THE BODY, LINE BY LINE         34%    settle, 90ms line stagger
 *   04  ONE FACT, ALONE                52%    rule draws · fact 1 at size
 *   05  THE FACTS ADVANCE              72%    fact 3 at size, 1–2 folded
 *   06  THE REGISTER STANDS           100%    all folded, section static
 *
 * ⚠ THE BOARD SAYS "NO PIN, NO SCRUB" AND IS OVERRULED — see the section's own
 * comment in Sections.tsx for the reasoning and for what answers the note's
 * objection. This is the page's SECOND held screen against a one-pin budget;
 * flagged in scenes.md beside the deck's own deviation.
 *
 * ⚠ F7, AND IT DECIDES THE BUILD. The ledger satisfied the loud-channel law on
 * this section PER SCREEN — "decode (type) → the road (media) → the register
 * (type, quiet)" (scenes.md). Folding three screens into one throws that
 * reasoning away: one screen gets one loud channel. So this declares **type**,
 * `decode` is the one loud moment, and the road's `plateParallax` is GONE —
 * it is LOUD media and `assertChannel` would (correctly) throw. The road
 * arrives and folds on opacity and clip-path, which are in no LOUD list.
 *
 * ⚠ NOTHING ELSE MAY WRITE `clip-path` ON THE BAND. The fold owns it, through
 * `--ab2-fold`. `frameOpen` was the obvious way to open the road and is not
 * used for exactly this reason — two writers on one property, and the last
 * frame to run wins.
 *
 * Span: 300 − 100 = 200, the same derivation as `theQuestion`, and the deck's
 * BUFFER does not come off it. See the arithmetic written out there.
 *
 * Markup:
 *   [data-ab-eyebrow]              THE heading — never leaves, never moves
 *                                  except with the road
 *   [data-ab2-headwrap]            its wrapper; the stylesheet's travel only
 *   [data-ab2-decode]              the legal name's aria-hidden run
 *   [data-ab2-short]               "Most people say YACHATDAC."
 *   [data-ab2-body] ×2             the two paragraphs
 *   [data-ab2-band] [data-ab2-plane]  the road, and the plane inside it
 *   [data-ab2-under] [data-ab2-caption]  everything that travels with the fold
 *   [data-ab2-rule]                the thread entering
 *   [data-ab2-fact] ×4             the presenter — one fact at size
 *   [data-ab2-row] ×4              the register rows, folding in
 */
export function theRegister(root: HTMLElement, span = 200): MotionModule {
  return composition("theRegister", root, {
    channel: "type",
    span,
    ...HELD,
    uses: ["decode", "settle"],
    build: (tl) => {
      const stage = q(root, "[data-ab-stage]");
      const nameBlock = q(root, '[data-ab2-block="name"]');
      const registerBlock = q(root, '[data-ab2-block="register"]');
      const legal = q(root, "[data-ab2-decode]");
      const short = q(root, "[data-ab2-short]");
      const bodies = qa(root, "[data-ab2-body]");
      const rule = q(root, "[data-ab2-rule]");
      const facts = qa(root, "[data-ab2-fact]");
      const rows = qa(root, "[data-ab2-row]");
      const head = q(root, "[data-ab2-register-head]");
      const recap = q(root, "[data-ab2-recap]");

      root.dataset.abHeld = "true";

      // Rest state is the finished document, so everything the sequence brings
      // on is hidden here rather than in the markup — hiding it in CSS would
      // hide it for JavaScript-off too.
      // ⚠ A MASK IS NOT A HIDING PLACE. Everything that arrives here is hidden
      // with `autoAlpha` on the ELEMENT, including the copy that then settles
      // line by line — the split's own from-state is not trusted to hold it.
      //
      // `settle` splits with `autoSplit: true`, so SplitText re-splits when a
      // font lands or the box is re-measured, and a re-split makes NEW line
      // nodes while the tween keeps the old ones. The from-state goes with
      // them: measured on first load, each paragraph's first line was still
      // masked and lines 2–4 stood in plain sight, before their beat and
      // underneath the name that had not resolved yet (reported 12 September
      // 2026). It is the same orphaning `freshSplit` is annotated for.
      //
      // So the element is hidden, its beat flips it visible, and the mask only
      // has to do the part it is good at — the rise.
      gsap.set(
        [registerBlock, short, ...bodies, ...facts, ...rows].filter(Boolean),
        { autoAlpha: 0 },
      );
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      if (legal) gsap.set(legal.parentElement, { opacity: 1 });

      // ---- 01 → 02 · the name ------------------------------------------
      // The decode runs first and alone; nothing else is on the screen, which
      // is the board's own frame 01.
      if (legal) tl.decode(legal, { duration: 0.18 }, 0);

      // It resolves, and dims as the short name lands under it — "two lines,
      // one gesture: this is what we are called, and this is what you will
      // call us". 0.28 is the board's number and the same value the recap and
      // every read-already line on this screen use.
      if (legal?.parentElement) {
        tl.to(
          legal.parentElement,
          { opacity: 0.28, duration: 0.08, ease: EASE.country },
          0.18,
        );
      }
      if (short) {
        tl.set(short, { autoAlpha: 1 }, 0.18);
        tl.settle(short, lineBeat(0.12), 0.18);
      }

      // ---- 03 · the body, line by line ----------------------------------
      bodies.forEach((body, i) => {
        const at = 0.30 + i * 0.05;
        tl.set(body, { autoAlpha: 1 }, at);
        tl.settle(body, lineBeat(0.12), at);
      });

      // ---- the turn -----------------------------------------------------
      // THE HEADING RETAINS; EVERYTHING UNDER IT GOES (user direction,
      // 12 September 2026). The name block clears whole rather than line by
      // line: its three children each already own a split, and a second split
      // beat on any of them would orphan the first one's line nodes — the trap
      // annotated at `freshSplit`. Nothing is lost by clearing it, because the
      // derived recap carries what was read at 0.28, which is the board's
      // "read already".
      if (nameBlock) {
        tl.to(
          nameBlock,
          { autoAlpha: 0, duration: 0.07, ease: EASE.country },
          0.48,
        );
      }

      // THEN THE ROAD SLIDES IN OVER THE HEADING AND PUSHES IT DOWN. One
      // number does it — see the note in about.css. 1 → 0 opens the band
      // downward from its own top edge while the heading and the block below
      // travel down out of its way; the same number runs back 0 → 1 across the
      // four rows below, so the arrival and the collapse are the same gesture
      // read in two directions rather than two effects that have to agree.
      if (stage) {
        tl.to(
          stage,
          { "--ab2-fold": 0, duration: 0.09, ease: EASE.country },
          0.56,
        );
      }

      // The register takes the name's place, under a heading that never moved.
      if (registerBlock) {
        tl.to(
          registerBlock,
          { autoAlpha: 1, duration: 0.05, ease: EASE.country },
          0.62,
        );
      }
      if (recap) quietly(tl, recap, 0.63);

      // ---- 04 · the thread enters ---------------------------------------
      if (rule) {
        tl.to(rule, { scaleX: 1, duration: 0.04, ease: EASE.country }, 0.65);
      }
      if (head) quietly(tl, head, 0.66);

      // ---- 04 → 06 · the facts arrive one at a time ----------------------
      // The mechanism the whole section exists for. Each fact takes the screen
      // ALONE at heading scale, then folds down into its register row as the
      // next one comes up — so the reader is always looking at exactly one
      // fact, and by the end all four stand as an index that can be scanned
      // and linked to. "Nothing is lost."
      //
      // The presenter is a SECOND rendering of the row's own copy, not a moved
      // element: Flip would be the obvious tool and `handoff`/`escape` are
      // both LOUD transition, which this screen may not spend (see F7 above).
      // Scaling and travelling the presenter into place costs nothing and does
      // not distort the face the way a Flip on type does.
      // Each fact stands where ITS OWN ROW will be. Measured once, from the
      // rows themselves: they are all present in the document and only their
      // opacity changes, so these offsets never move while the sequence runs.
      // `offsetTop` is relative to the register wrapper, which is the
      // presenter's positioning context.
      const rowTop = rows.map((row) => row.offsetTop);

      const FACT_AT = 0.68;
      const FACT_STEP = 0.07;
      facts.forEach((fact, i) => {
        const at = FACT_AT + i * FACT_STEP;
        const folds = at + 0.045;
        const top = rowTop[i] ?? 0;

        // Arrives in its row's place, one row below the last that settled.
        tl.fromTo(
          fact,
          { autoAlpha: 0, y: top + 18 },
          { autoAlpha: 1, y: top, duration: 0.035, ease: EASE.country },
          at,
        );

        // Collapses INTO that row rather than handing over to one elsewhere:
        // it shrinks toward the register's own scale, from the row's top-left,
        // and the row underneath takes its place at the same instant. Scaling
        // from `left top` is what makes the two read as one object changing
        // size rather than two crossfading. Transform and opacity only.
        tl.to(
          fact,
          {
            autoAlpha: 0,
            scale: 0.62,
            transformOrigin: "left top",
            duration: 0.038,
            ease: EASE.country,
          },
          folds,
        );
        if (rows[i]) {
          tl.fromTo(
            rows[i],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.038, ease: EASE.country },
            folds + 0.008,
          );
        }

        // The road gives up a quarter of its height per row. One property, so
        // the clip, the plane and the column beneath cannot drift apart — see
        // the note in about.css.
        if (stage) {
          tl.to(
            stage,
            {
              "--ab2-fold": (i + 1) / facts.length,
              duration: 0.045,
              ease: "none",
            },
            folds + 0.012,
          );
        }
      });

    },
    // ⚠ NO ENTRY ARRIVAL, DELIBERATELY. The heading is the one thing on this
    // section that never moves, and its travel when the road arrives is a
    // STYLESHEET transform on its wrapper. An `arrive` would write `transform`
    // inline on the heading and inline beats a stylesheet — the same collision
    // the register index hit. Nothing here needs an entrance: the section
    // opens on the heading already in place, which is the board's frame 01.
    enter: undefined,
    cut: (el) => {
      delete el.dataset.abHeld;
      // ⚠ `clearAll` CLEARS STYLES, NOT TEXT. Every other cut on this page is
      // whole because motion here is transform and opacity; the decode is the
      // one effect that rewrites content, so the reduced-motion and
      // too-small-window branches have to put the name back themselves or a
      // resize across the breakpoint can strand a reader on scrambled copy.
      const decoded = el.querySelector<HTMLElement>("[data-ab2-decode]");
      if (decoded?.dataset.decodeText) {
        decoded.textContent = decoded.dataset.decodeText;
      }
      clearAll(el);
    },
  });
}

/* -------------------------------------------------------------------------
   §03 — theQuestion · the page's one held screen
   ------------------------------------------------------------------------- */

/**
 * ⚑ THE INTERIORS PASS (12 September 2026, user direction). Built to Figma
 * 2653:19669, whose layer names are this beat sheet almost verbatim.
 *
 * Grammar rows: "the screen clears" (`vacate`), "a change of ground, the
 * ground goes out under the question", "the page holding its ground, the
 * interior scrub without a read clock", "what endures" (`settle`).
 *
 * ⚠ WHY THERE IS NO PIN HERE. §03 is a slide in `coverSeams`' deck, which
 * already pins this very section at its foot — two ScrollTriggers pinning one
 * node do not work. So the hold is LAYOUT: ./about.css gives the section the
 * pin's full height and sticks one screen inside it, and this module only
 * scrubs against the section's own top-to-foot span. The sticky screen
 * releases exactly where the deck's pin engages, so the two abut instead of
 * overlapping. Same shape /wonder §02 and §04 use.
 *
 * ⚠ THE SPAN IS DERIVED, NOT CHOSEN, and it is the one number a later height
 * change silently breaks:
 *
 *     span = 300 (the section)  −  100 (the sticky screen)  =  200
 *
 * `composition` runs `start: "top top", end: "+=span%"`, and 200 is exactly how
 * long the sticky screen is held: a sticky box stops being stuck when its foot
 * reaches its container's foot, which here is `height − viewport`. So the scrub
 * and the hold are the same interval by construction, and the sequence finishes
 * on the frame the screen stops being held.
 *
 * ⚠ BUFFER DOES NOT COME OFF IT, which is the trap. `coverSeams` opens this
 * seam's gate BUFFER **late** ("tall slides open their gate BUFFER late" — see
 * the constant), at `bottom bottom-=BUFFER`, and then takes BUFFER back off to
 * find the 100% read mark. The two cancel: the read mark lands exactly where
 * the section's foot meets the viewport's, which is the same place the sticky
 * hold ends. A first cut subtracted BUFFER anyway and ran 180, which finished
 * the sequence 20vh early and left the last 20vh of the hold with the screen
 * still stuck and nothing moving on it. Measured against the live deck,
 * 12 September 2026: section top 3103, height 2700, viewport 900 — sticky
 * released at 4903 (= 3103 + 2700 − 900) and the pin engaged at ~5083.
 *
 * ⚠ AND WHY IT DECLARES BOTH BOUNDS. `minWidth`/`minHeight` here are `hold:`'s
 * thresholds from globals.css, which is the query ./about.css matches. The
 * layout and the motion have to be withheld together: a held screen with no
 * sequence shows one frozen claim for 200vh, and a sequence with no held
 * screen animates type that is scrolling away underneath it.
 *
 * CHANNEL. §03 is loud in **type** (scenes.md), and it stays honest: `settle`
 * and `vacate` are type at reading scale, `dissolve` takes no screen, and the
 * ground is a MODULE ramp rather than `gsap.effects.groundRamp` — `groundRamp`
 * is in compose.ts's LOUD.transition and declaring it here would (correctly)
 * throw. Truth §13 makes the same move for the same reason; the grammar row
 * reads "module ramp, `groundRamp` lineage".
 *
 * Markup:
 *   [data-ab-eyebrow]       the header — holds, then leaves as the ground does
 *   [data-ab-claim] ×2      the two claims: one replaces the other, both leave
 *   [data-ab-ground]        the rising front (one custom property)
 *   [data-ab-plate]         IMG-03 — "at rest it is already gone"
 *   [data-ab-question]      D96, line masks, 90ms
 *   [data-ab-rule="quote"]  the thread's first appearance
 *   [data-ab-attribution]   arrives after the settle lands, never with it
 *   [data-ab-tagline]       the last thing said before the Breath
 */
export function theQuestion(root: HTMLElement, span = 200): MotionModule {
  return composition("theQuestion", root, {
    channel: "type",
    span,
    ...HELD,
    uses: ["settle", "vacate", "arrive", "dissolve"],
    build: (tl) => {
      const eyebrow = q(root, "[data-ab-eyebrow]");
      const [claimA, claimB] = qa(root, "[data-ab-claim]");
      const ground = q(root, "[data-ab-ground]");
      const plate = q(root, "[data-ab-plate]");
      const question = q(root, "[data-ab-question]");
      const rule = q(root, '[data-ab-rule="quote"]');
      const attribution = q(root, "[data-ab-attribution]");
      const tagline = q(root, "[data-ab-tagline]");

      // The flag ./about.css hangs the whole held layout off. Set here, in the
      // branch that only exists when the reader wants motion and the window
      // can hold a screen, so its absence is the fallback rather than a
      // separate cut to maintain. `composition` reverts the matchMedia context
      // on destroy but has never removed an attribute, so this one is taken
      // off in `cut` as well as being absent from it.
      root.dataset.abHeld = "true";

      // Everything the sequence brings on starts off. Authored here rather
      // than in the markup because the markup IS the finished document —
      // hiding the question in CSS would hide it for JavaScript-off too.
      if (claimB) gsap.set(claimB, { autoAlpha: 0 });
      gsap.set([question, rule, attribution, tagline].filter(Boolean), {
        autoAlpha: 0,
      });
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      // ---- the ground -------------------------------------------------
      // LINEAR, one-for-one with scroll. The grammar row is explicit about
      // why: eased, a ramp stands still through the first third and then
      // lurches, which reads as broken rather than eased. 130% → −30% so the
      // front is genuinely off-screen at both ends — see about.css.
      //
      // ⚠ IT STARTS AFTER THE SCREEN HAS CLEARED, and that ordering is the
      // rule, not the taste. The claims are `text-charcoal` and the front is
      // evergreen into charcoal, so any overlap is dark ink on dark ground: a
      // first cut ran the ground from .27, under the claims, and at .58 claim
      // 2's last line sat as an unreadable smudge on near-charcoal while still
      // at half opacity. It looked like a rendering fault rather than an
      // effect. The reader's own description has the same order — the claims,
      // THEN the gradient, THEN the question — so the beats are sequential:
      // every claim is read on the photograph, and the question is read on
      // charcoal, and the ground changes in the gap between them with nothing
      // on it. Front reaches the claims' band at ≈.71, by which time they and
      // the header have been gone since ≈.60.
      if (ground) {
        tl.fromTo(
          ground,
          { "--ab-front": "130%" },
          { "--ab-front": "-30%", duration: 0.18, ease: "none" },
          0.58,
        );
      }

      // IMG-03 is taken by the ground rather than fading on its own clock:
      // it finishes just before the front clears the head of the screen, so
      // "at rest it is already gone" is true of the plate and the ground at
      // the same moment.
      if (plate) {
        tl.to(plate, { autoAlpha: 0, duration: 0.16, ease: "none" }, 0.58);
      }

      // ---- the header leaves with the ground ---------------------------
      // ⚠ THE EYEBROW IS NOT PERSISTENT (user direction, 12 September 2026:
      // "remove the header when it transitions background color"). It holds
      // still through both claims — it is what they are measured against — and
      // then goes as the ground changes under it, so the question is asked on a
      // screen with nothing on it at all rather than under a standing label.
      //
      // It goes with claim 2, and both finish BEFORE the front arrives — see
      // the ordering note on the ground above. That is also what retired the
      // ink step this used to carry: burnt-deep is a light-ground token and
      // could not have survived the crossing, and now nothing crosses.
      // Starts ON the ground's first frame (.58) so the header goes AS the
      // colour turns rather than before it, and finishes at .66 — still clear
      // of .71, where the front reaches its band. Claim 2 has gone just ahead
      // of it, so the screen empties content-first, label-last.
      if (eyebrow) tl.vacate(eyebrow, lineBeat(0.08), 0.58);

      // ---- the claims -------------------------------------------------
      // Claim 1 is read, then leaves upward past the eyebrow; claim 2 takes
      // its exact place, is read, and leaves the same way.
      //
      // ⚠ THE TWO NEVER OVERLAP, and they have to be sequenced rather than
      // crossfaded to guarantee it. They share ONE grid cell (about.css) so
      // that the second replaces the first where the reader is already
      // looking — which also means any moment both carry ink is two
      // paragraphs printed on top of each other. A first cut ran the exit and
      // the entrance together from .08 and .16; measured, both stood at full
      // opacity from .16 to .30, because a masked stagger keeps its LAST line
      // opaque until the end.
      //
      // So claim 2 starts after claim 1 has finished, AND there is a deliberate
      // .06 of clear air between them (.24 → .30). The gap is not padding: the
      // scrub is `SCRUB.normal`, so what is painted trails the scroll by a few
      // hundredths, and butting the two beats together put claim 1's last line
      // at ~25% opacity underneath a fully-arrived claim 2 (measured, .28–.32).
      // Anything that shortens this gap has to re-measure the handover.
      if (claimA) tl.vacate(claimA, lineBeat(0.14), 0.06);
      if (claimB) {
        // ⚠ IT FADES, IT DOES NOT `settle`, AND THAT IS A CONSTRAINT AS WELL AS
        // THE BRIEF. The brief first: the reader's own description of this beat
        // is "fades in and text replaces the previous phrase", so a fade is
        // what was asked for, and the frame only marks this element as leaving.
        //
        // The constraint is `freshSplit` (effects/shared.ts): it keeps ONE live
        // SplitText per element and reverts the previous one before making a
        // new one, so two split beats on the same element leave the first
        // beat's tween holding line nodes that are no longer in the document.
        // Claim 2 is the only element here that both arrives and leaves, and
        // with `settle` + `vacate` its arrival silently did nothing — it popped
        // in at full opacity while the exit worked perfectly (measured,
        // 12 September 2026). Every other split beat on this timeline owns its
        // element's only split: claim 1 and the header just leave, the question
        // just arrives. Adding a second split beat to any of them reopens this.
        tl.fromTo(
          claimB,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.10, ease: EASE.country },
          0.24,
        );
        // Read, then gone — leaving just as the rising front reaches its band,
        // so the ground goes out from under the sentence as the sentence goes.
        // The screen clears BEFORE the question, which is what "the question
        // is asked on nothing" means (scenes.md:1122) and what the frame's own
        // note on this element says.
        tl.vacate(claimB, lineBeat(0.12), 0.48);
      }

      // ---- the answer -------------------------------------------------
      // The ground is charcoal by now, so the cream question has its ratio
      // from the first frame it is visible in.
      // Held until the front is entirely past the head of the screen, so the
      // cream question has its full ratio in the first frame it is visible in
      // rather than landing on the tail of the evergreen crossing.
      if (question) {
        tl.set(question, { autoAlpha: 1 }, 0.76);
        tl.settle(question, lineBeat(0.10), 0.76);
      }

      // The thread's first appearance, drawing left to right: scaleX from a
      // left origin, as a beat on this timeline rather than on a viewport
      // trigger of its own. A `top 82%` trigger inside a held screen is
      // consumed while the slide is still behind the one covering it: the
      // draw plays where nobody can see it and then nothing moves for the
      // whole read. That failure is the grammar's "interior scrub" row.
      if (rule) {
        tl.set(rule, { autoAlpha: 1 }, 0.89);
        tl.to(rule, { scaleX: 1, duration: 0.04, ease: EASE.country }, 0.89);
      }

      // After the settle has landed, never with it — naming the source while
      // the question is still arriving puts the citation ahead of the claim.
      //
      // `quietly` is X4's arrival written as a fromTo — see the helper for why
      // it cannot be `arrive` here.
      if (attribution) quietly(tl, attribution, 0.93);
      // ⚠ THE LAST BEAT ENDS AT EXACTLY 1.0, and that is load-bearing rather
      // than tidy. A timeline's position parameter is a TIME, and a scrub maps
      // the reader's 0→1 onto 0→`tl.duration()` — so while the longest beat
      // ended at 1.015, every number written here was read about 1.5% early and
      // the beat sheet quietly meant something other than it said. Normalised,
      // a position in this function IS the fraction of the read it looks like.
      // Anything added after this has to keep that true.
      if (tagline) quietly(tl, tagline, 0.965);
    },
    // The eyebrow only. The claims are the sequence's now, and the answer
    // screen is brought on by it — a baseline arrival on either would fight
    // the same opacity from a second trigger.
    enter: (tl, el) => {
      const eyebrow = q(el, "[data-ab-eyebrow]");
      if (eyebrow) tl.arrive([eyebrow]);
    },
    cut: (el) => {
      delete el.dataset.abHeld;
      clearAll(el);
    },
  });
}

/* -------------------------------------------------------------------------
   §04 — theLoop · the page's third held screen
   ------------------------------------------------------------------------- */

/**
 * ⚑ THE LOOP CLOSES (12 September 2026, user direction). Built to Figma
 * `2695:21396` — `REF · 05 ABOUT §04 THE LOOP — each clause builds the card it
 * names · 6 FRAMES`. Supersedes `loopAndRing`, which was the seam pass's one
 * tween on the ring.
 *
 * Grammar row: "accumulating, the loop closes".
 *
 * THE SECTION'S CLAIM IS THAT FOUR THINGS HOLD EACH OTHER UP, and this draws
 * it rather than asserting it. The lede is a chain of three clauses; each
 * arrives at reading size, folds down onto its place on the artist's spiral,
 * and the card that clause names seats there on a short overshoot. The fourth
 * position is drawn and left empty, because the draft has three clauses and a
 * fourth would be invented. When all four stand the loop is closed — the only
 * state in which the claim is true — and it holds there before contracting
 * into §05's first bullet.
 *
 * ⚠ ONE CARD IS WHOLE AT A TIME. A card carries a photograph, a title, a body
 * and a label, and at the scale four fit on the spiral the body lands near 8px.
 * So a card arrives WHOLE and centred, is read, and then becomes a compact
 * version of itself — photograph and title only, which is exactly what the
 * board seats on the ring — as the next one arrives. It is never rendered
 * twice for this: a second copy of a link is a second tab stop, and
 * `aria-hidden` does not take an element out of the tab order.
 *
 * ⚠ ONE WRITER FOR EVERY SLOT TRANSFORM. Each card is moved by TWO things —
 * its own seating, and the turn of the whole loop — and two tweens writing
 * `x`/`y` to one element is the last frame to run winning. So the tweens move
 * a plain state object and a single `onUpdate` computes every slot's position
 * from it. Same reason the band in §02 is one custom property rather than
 * three tweens.
 *
 * ⚠ POSITION-SCRUBBED, NOT VELOCITY-DRIVEN. The board asks for the turn to
 * take the reader's scroll velocity and be parkable mid-turn (IMG-01, released
 * by F9). Bound to scroll position instead, on user direction, so the section
 * retraces exactly on the way back — the contract §02 and §03 keep. The
 * velocity pattern lives in `src/lib/motion/orbit.ts` if this is revisited; it
 * is a `/v2` sketch and must not be extended.
 *
 * ⚠ NEVER ON THE CARD PHOTOGRAPHS. The board is explicit: the turn applies to
 * the ring and its connectors, "never on the photographs inside the cards,
 * which are frame grade". Nothing here touches a plate — a card's slot travels
 * and the photograph rides it without a transform of its own.
 *
 * Span 300 − 100 = 200; the deck's BUFFER does not come off it. See the
 * arithmetic written out at `theQuestion`.
 *
 * Markup:
 *   [data-ab4-head]              eyebrow + headline, hold then leave
 *   [data-ab4-clause] ×3         read at size, then folded onto the loop
 *   [data-ab4-loop]              the positioning context the diamond is measured in
 *   [data-ab4-ring]              the spiral
 *   [data-ab4-slot] ×4           the cards
 *   [data-ab4-card-body]         what a card gives up when it compacts
 *   [data-ab4-ground]            the rising roasted front
 */
export function theLoop(root: HTMLElement, span = 200): MotionModule {
  return composition("theLoop", root, {
    channel: "media",
    span,
    ...HELD,
    uses: ["settle", "arrive"],
    build: (tl) => {
      const head = q(root, "[data-ab4-head]");
      const loop = q(root, "[data-ab4-loop]");
      const ring = q(root, "[data-ab4-ring]");
      const ground = q(root, "[data-ab4-ground]");
      const clauses = qa(root, "[data-ab4-clause]");
      const slots = qa(root, "[data-ab4-slot]");
      const bodies = qa(root, "[data-ab4-card-body]");
      if (!loop || !slots.length) return;

      root.dataset.abHeld = "true";

      // ---- the figure, measured ---------------------------------------
      // Derived from the room the loop actually has rather than from the
      // frame's pixels, so the diamond holds at every size the held build is
      // allowed at. The board's proportions are kept: its ring is 172 wide by
      // 260 tall, so the horizontal radius is two thirds of the vertical.
      const SEAT = 0.5; // the board's slot card is 152 against the rail's 298
      const CLAUSE_SEAT = 0.55; // a connector is a label, not a paragraph
      // How much of a card is kept when it compacts. The body and the label go,
      // and the card's foot closes behind them — but not so far that it eats
      // the title, which is the half of the card that has to survive. Measured
      // against a two-line title at seat scale.
      const KEEP = 0.7;
      const loopBox = loop.getBoundingClientRect();
      const box = loopBox;
      const card = slots[0].getBoundingClientRect();
      const ry = Math.max(
        120,
        (box.height - card.height * SEAT) / 2 - 10,
      );
      const rx = Math.min(
        (box.width - card.width * SEAT) / 2 - 10,
        ry * 0.66,
      );

      // Top, right, bottom, left — the order the cards are authored in and the
      // order the clauses name them.
      const base = [0, 1, 2, 3].map((i) => (i * Math.PI) / 2);

      const state = { seat: [0, 0, 0, 0], orbit: 0 };
      // Three numbers, not three transform properties — see the note on the
      // slot in about.css. Custom properties compose; three `quickSetter`s on
      // one element's transform do not.
      const setters = slots.map((slot) => ({
        x: gsap.quickSetter(slot, "--ab4-x") as (v: number) => void,
        y: gsap.quickSetter(slot, "--ab4-y") as (v: number) => void,
        s: gsap.quickSetter(slot, "--ab4-s") as (v: number) => void,
      }));

      // THE ONE WRITER. A card at `seat = 0` is whole and centred on the loop;
      // at `seat = 1` it is compact and standing on the ring at its own angle,
      // which the turn then carries round. Everything in between is the card
      // travelling out to its place.
      const paint = () => {
        slots.forEach((_, i) => {
          const seated = state.seat[i];
          const angle = base[i] + state.orbit;
          setters[i].x(Math.sin(angle) * rx * seated);
          setters[i].y(-Math.cos(angle) * ry * seated);
          setters[i].s(1 - (1 - SEAT) * seated);
        });
      };
      gsap.set(slots, { autoAlpha: 0 });
      paint();

      // ---- the head ----------------------------------------------------
      if (head) tl.set(head, { autoAlpha: 1 }, 0);

      // ---- clause N builds card N --------------------------------------
      // Three clauses, four cards. The fourth arrives on the empty position
      // with no clause of its own — the loop closing rather than a new claim.
      // One pass per card, and the order inside a pass is the whole point:
      // the clause is READ, its card arrives WHOLE and is read, the card
      // compacts onto the ring, and only then does the clause fold after it.
      //
      // ⚠ THE FOLD COMES LAST, and it has to. A folded clause sits on the
      // clearing ellipse, which is sized for a COMPACT card — fold it while
      // its card is still at full size and the label lands on top of the
      // photograph it belongs to (caught on screen, 12 September 2026).
      const CLAUSE_AT = 0.12;
      const STEP = 0.17;
      const CARD_IN = 0.025; // after its clause
      // ⚠ THE GAP BETWEEN THESE TWO IS THE READ, and it is the point of the
      // whole card existing. A card arrives with its photograph, its title and
      // its description, and the reader is given ~18vh of held scroll to take
      // that in before it is put away on the ring. Closing this up turns the
      // whole state into a flicker and there is no reason to have shown the
      // description at all (user direction, 12 September 2026).
      const CARD_SEAT = 0.115; // ~18vh later — the whole card's dwell
      const CLAUSE_FOLD = 0.175; // last, once its card is compact

      clauses.forEach((clause, i) => {
        const at = CLAUSE_AT + i * STEP;
        gsap.set(clause, { autoAlpha: 0 });
        tl.set(clause, { autoAlpha: 1 }, at);
        tl.settle(clause, lineBeat(0.06), at);

        // It folds onto its place BETWEEN the card it names and the next —
        // the sentence the reader has just finished becoming the thing that
        // physically holds the cards together. The element that was read is
        // the one that folds; nothing is set twice.
        //
        // ⚠ THE TARGET IS TWO BOXES APART, so it is computed from both. Every
        // clause is absolute at the same origin — the top-left of the
        // paragraph they came out of — which is right for reading them one at
        // a time and useless as a destination. The delta from that origin to a
        // point on the loop has to cross from the paragraph's coordinate space
        // into the loop's. Getting this wrong stacked all three on the left of
        // the screen, on top of each other and unreadable (12 September 2026).
        // ⚠ ON AN ELLIPSE THAT CLEARS THE CARDS, not on the ring itself. The
        // midpoint between two cards looks like the obvious place and is not:
        // a seated card is half its own width either side of its point, so a
        // label at the ring's own radius lands underneath one. Measured, the
        // three ran into each other and into the cards (12 September 2026).
        // The clearing ellipse is the ring plus half a seated card plus air.
        const mid = base[i] + Math.PI / 4;
        const clauseRx = rx + (card.width * SEAT) / 2 + 36;
        const clauseRy = Math.min(ry + 110, loopBox.height / 2 - 30);
        const target = {
          x: loopBox.left + loopBox.width / 2 + Math.sin(mid) * clauseRx,
          y: loopBox.top + loopBox.height / 2 - Math.cos(mid) * clauseRy,
        };
        const from = clause.getBoundingClientRect();
        tl.to(
          clause,
          {
            // Centred on its point rather than hung off its corner: the
            // measured box is the unscaled one, so half of it is scaled too.
            x: target.x - from.left - (from.width * CLAUSE_SEAT) / 2,
            y: target.y - from.top - (from.height * CLAUSE_SEAT) / 2,
            scale: CLAUSE_SEAT,
            autoAlpha: 0.72,
            duration: 0.05,
            ease: EASE.country,
          },
          at + CLAUSE_FOLD,
        );
      });

      // ---- the cards ----------------------------------------------------
      // Whole, read, then compact. `catch` is the site's first overshoot and
      // the F9 ledger budgets it exactly here and at §09's doors — "a thing
      // that holds has to catch".
      slots.forEach((slot, i) => {
        const base4 = CLAUSE_AT + i * STEP;
        const arrives = base4 + CARD_IN;
        const seats = base4 + CARD_SEAT;

        tl.to(slot, { autoAlpha: 1, duration: 0.02, ease: "none" }, arrives);
        tl.to(
          state.seat,
          { [i]: 1, duration: 0.07, ease: EASE.catch, onUpdate: paint },
          seats,
        );
        if (bodies[i]) {
          tl.to(
            bodies[i],
            { autoAlpha: 0, duration: 0.04, ease: EASE.country },
            seats,
          );
        }
        // The card's foot closes with its body so the compact card is tight
        // rather than a whole card with a hole in it.
        tl.fromTo(
          slot,
          { clipPath: "inset(0% 0% 0% 0% round 1.5rem)" },
          {
            // `round` keeps the card's own 1.5rem corner on the new foot.
            // A plain inset cuts a straight edge and the compact card ends in
            // two square corners against three round ones (reported
            // 12 September 2026).
            clipPath: `inset(0% 0% ${Math.round((1 - KEEP) * 100)}% 0% round 1.5rem)`,
            duration: 0.05,
            ease: EASE.country,
          },
          seats,
        );
      });

      // ---- the turn -----------------------------------------------------
      // One quarter per card, so each new card arrives at the top of the loop
      // and the one before it has moved round to make room.
      tl.to(
        state,
        {
          orbit: Math.PI * 2,
          duration: 0.56,
          ease: "none",
          onUpdate: paint,
        },
        CLAUSE_AT + CARD_SEAT,
      );

      // ---- the hold -----------------------------------------------------
      // .80 → .86 is deliberately empty. All four standing, the ring out of
      // its skew: the only state in which the section's claim is true, and the
      // one moment the screen is allowed to stop.

      // ---- it contracts --------------------------------------------------
      // Transform-only, NOT C2 — Living Work's aperture already spent it. The
      // cards are not faded out; they are pulled inward with the ring, so the
      // closed loop is what becomes §05's first bullet.
      if (ground) {
        tl.fromTo(
          ground,
          { "--ab4-front": "130%" },
          { "--ab4-front": "-30%", duration: 0.14, ease: "none" },
          0.86,
        );
      }
      // ⚠ IT CONTRACTS ON THE SPOT, AND IT FADES (user direction, 12 September
      // 2026). Two departures from the board, which contracts the loop toward
      // §05's bullet at the top of the next section and says in as many words
      // that "the cards are not faded out — they are pulled inward with it".
      //
      // Travelling it to a corner read as the loop escaping off the screen
      // rather than closing, and a closed loop still standing at full strength
      // when the ground has already gone roasted reads as left behind rather
      // than handed over. So it shrinks about its own centre and goes with the
      // clauses, on the same curve — the screen empties into §05's ground
      // instead of posting something into it.
      tl.to(
        loop,
        {
          scale: 0.16,
          autoAlpha: 0,
          transformOrigin: "center center",
          duration: 0.14,
          ease: EASE.country,
        },
        0.86,
      );
      if (head) {
        tl.to(
          head,
          { autoAlpha: 0, duration: 0.08, ease: EASE.country },
          0.88,
        );
      }
      if (ring) tl.to(ring, { rotate: 24, duration: 0.14, ease: "none" }, 0.86);
    },
    enter: undefined,
    cut: (el) => {
      delete el.dataset.abHeld;
      clearAll(el);
    },
  });
}

/* -------------------------------------------------------------------------
   §05 — theValues · the page's fourth held screen
   ------------------------------------------------------------------------- */

/**
 * ⚑ THE INTERIORS PASS (12 September 2026, user direction). Supersedes
 * `valuesRelay`, which was the seam pass's one tween on the first value's rule.
 *
 * Grammar rows: "what endures" (`settle`), "the page holding its ground, the
 * interior scrub without a read clock", "a change of ground, the frame opens
 * and the picture does not move".
 *
 * ⚠ NO REFERENCE BOARD. §02, §03 and §04 each have one; §05 does not. The page
 * frame (Figma 2653:19672) gives the composition and the constraints and the
 * sequence is the user's own, so where this departs from anything it is worth
 * saying which of the two is being followed.
 *
 * "How we work" stands for the whole section. Each value is read on its own —
 * rule, label, lede, then the conclusion that actually constrains a decision —
 * and clears. After the second, the photograph opens from the top and pushes
 * the heading and the column down into the space it takes, and RECIPROCITY is
 * read beneath it. The picture stays: it is the rest scene that value arrives
 * out of.
 *
 * ⚠ KEPT QUIET, DELIBERATELY. The ledger scores this ⚡2 with "rest after" —
 * the page's breather between §04 and §06, both ⚡4. Held on user direction,
 * but the beats are `settle` and a fade and nothing else: no overshoot, no
 * ground ramp, no contraction. §03b's Breath is still the page's hard rest.
 * Anything added here should be measured against that.
 *
 * ⚠ THE IMAGE PLANE IS NEVER TOUCHED. §02's band counter-travels its plane so
 * a chosen edge stays in view; this one holds absolutely still. The frame's own
 * layer note is "P1 full-bleed hold: the ground and the type move around it,
 * the image plane NEVER does", and the photograph is `frame` grade — the notes
 * record four people cropped to hands, one of them a child. The band's CLIP
 * opens and the column travels; nothing writes a transform to `[data-ab5-plane]`.
 *
 * ⚠ THE FOLD RUNS ONCE. §02's road gives its height back across the register's
 * four rows; this one opens and stays open, because the picture is not making
 * room for anything — it is what the last value is read against.
 *
 * ⚠ `[data-ab-rule="value"]` AND `[data-ab-eyebrow]` ARE SEAM 04 → 05's
 * LANDING. §04's contracting loop hands off to the first value's rule and
 * label; `theLoop` says so in as many words. Renaming either hook means
 * changing that recipe too.
 *
 * Span 300 − 100 = 200; the deck's BUFFER does not come off it. See the
 * arithmetic at `theQuestion`.
 *
 * Markup:
 *   [data-ab5-head]          "How we work" — stands, then travels with the band
 *   [data-ab5-value] ×3      one cell, one value on screen at a time
 *   [data-ab5-rule]          each value's gold thread
 *   [data-ab5-label] [data-ab5-lede] [data-ab5-conclusion]
 *   [data-ab5-band]          the photograph's frame; its clip opens
 *   [data-ab5-caption]       arrives with the picture, derived from the fold
 */
export function theValues(root: HTMLElement, span = 200): MotionModule {
  return composition("theValues", root, {
    channel: "type",
    span,
    ...HELD,
    uses: ["settle", "arrive"],
    build: (tl) => {
      const stage = q(root, "[data-ab-stage]");
      const values = qa(root, "[data-ab5-value]");
      if (!values.length) return;

      root.dataset.abHeld = "true";

      // Rest state is the finished document, so everything the sequence brings
      // on is hidden here rather than in the markup. A mask is not a hiding
      // place — `settle` splits with `autoSplit` and a re-split orphans the
      // tween's line nodes, which is annotated at `freshSplit` and has bitten
      // twice. The element is hidden; the mask only does the rise.
      gsap.set(values, { autoAlpha: 0 });
      values.forEach((value) => {
        const rule = q(value, "[data-ab5-rule]");
        if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      });

      // ---- the values, one at a time ------------------------------------
      // Each arrives in the order the eye reads it — the thread, then who it
      // belongs to, then what it says, then the sentence that constrains a
      // decision. Then it clears WHOLE: a block fade, not a second split beat
      // on copy that already took one.
      // Written out rather than derived from a step, because the band has to
      // land BETWEEN the second value clearing and the third arriving and a
      // single stride cannot express that. A value's own internal beats run
      // `at` → `at + 0.193`; it is read until it clears.
      //
      // ⚠ THE LAST VALUE HAS TO FINISH BY ~.89. It settles last and is the
      // longest of the three, and the section is scored as a rest — if it is
      // still arriving at 1.0 there is no rest left to take, which is what the
      // first cut did (measured, 12 September 2026).
      // ⚠ EACH VALUE'S INTERNAL RUN IS ~.14, AND IT HAS TO BE. Three values,
      // a photograph and a rest have to fit 200vh; at ~.19 apiece the last
      // conclusion was still rising at 1.0 and the section had no rest left to
      // take, which is the one thing its ledger row asks of it (measured,
      // 12 September 2026). The scrub also trails by roughly .07 of the read,
      // so a beat that ends at .82 on paper lands near .89 on screen — the
      // last one is placed against the screen, not against the paper.
      const ARRIVES = [0.03, 0.33, 0.68];
      const CLEARS = [0.26, 0.55];
      const BAND_AT = 0.58;

      values.forEach((value, i) => {
        const at = ARRIVES[i];
        const rule = q(value, "[data-ab5-rule]");
        const label = q(value, "[data-ab5-label]");
        const lede = q(value, "[data-ab5-lede]");
        const conclusion = q(value, "[data-ab5-conclusion]");

        tl.set(value, { autoAlpha: 1 }, at);
        if (rule) {
          tl.to(
            rule,
            { scaleX: 1, duration: 0.04, ease: EASE.country },
            at,
          );
        }
        if (label) quietly(tl, label, at + 0.025, 0.025);
        if (lede) tl.settle(lede, lineBeat(0.05), at + 0.045);
        // "LANDS SEPARATELY, after a beat" — the frame's own words for the
        // conclusion, and the reason it is not staggered in with the lede.
        if (conclusion) tl.settle(conclusion, lineBeat(0.055), at + 0.08);

        // The last value is not cleared: it is what the section ends on, and
        // the picture above it is the rest it arrives out of.
        if (i < CLEARS.length) {
          tl.to(
            value,
            { autoAlpha: 0, duration: 0.05, ease: EASE.country },
            CLEARS[i],
          );
        }
      });

      // ---- the photograph opens ------------------------------------------
      // Between the second value clearing and the third arriving. One number
      // drives the frame's clip, the caption's opacity and the travel of
      // everything below — and deliberately NOT the plane. See the head of
      // this recipe and the note in about.css.
      if (stage) {
        tl.to(
          stage,
          { "--ab5-fold": 0, duration: 0.09, ease: EASE.country },
          BAND_AT,
        );
      }

      // ---- the rest ------------------------------------------------------
      // ⚠ A TRAILING REST HAS TO HOLD THE CLOCK OPEN, or it is not a rest at
      // all — it is every earlier beat played late.
      //
      // A scrub maps the reader's 0→1 onto 0→`tl.duration()`, and the duration
      // is wherever the LAST tween happens to end. Leave the final stretch
      // genuinely empty and the duration becomes .82, so a beat written at .76
      // actually plays at .76/.82 = .93 of the read and the last conclusion is
      // still rising as the section hands over. Measured exactly that, twice,
      // before this was understood (12 September 2026).
      //
      // §02, §03 and §04 all end ON their last beat, so their clocks normalise
      // themselves and the trap never fired. This is the first section scored
      // with a rest AFTER its last beat, so the rest is declared: an inert
      // tween on a throwaway object that occupies the final stretch, holds the
      // duration at 1.0, and touches nothing. The picture stands, the last
      // value is read under it, and nothing moves.
      tl.to({}, { duration: 0.12 }, 0.88);
    },
    // The heading only, and it never leaves.
    enter: arrivals,
    cut: (el) => {
      delete el.dataset.abHeld;
      clearAll(el);
    },
  });
}

/* -------------------------------------------------------------------------
   §06 — theCalendar (the held screen) + boardLift (the seam) · 300vh / 200 read
   ------------------------------------------------------------------------- */

/**
 * "Who decides", held as one screen with two parts under one header.
 *
 * Figma 2707:21402, the five-frame reference board. Grammar rows: "the page
 * holding its ground, the interior scrub without a read clock", "the screen
 * clears", "what has not happened yet", and the transition row's divider cut
 * for the seams either side.
 *
 * THE SHAPE, on user direction of 12 September 2026: "same protocol for this
 * section, sequential animations, just separate the two parts."
 *
 *   "Who decides"          the persistent header — settles once, never leaves
 *   part 1 · the claim     what the board is, through the Elder Advisory Group
 *   part 1 clears
 *   part 2 · the calendar  the thread, 2031, and the governance documents
 *
 * The two parts share one grid cell (about.css), so the calendar REPLACES the
 * claim rather than following it down the page. The reader's eye never travels
 * to find the other half of the answer, which is the same discipline §02's
 * register and §04's loop keep.
 *
 * ⚠ THE RINGS STAY IN THE BACKGROUND, and that is a markup fact rather than a
 * motion one: the ring layer moved INSIDE the stage (Sections.tsx) and the stage
 * paints no ground. Both were asked for by name. Nothing here touches them.
 *
 * ⚠ THE THREAD AND ITS BEATS ARE RE-BOUND, NOT REWRITTEN. They were triggered
 * from the THREAD's own viewport crossings — `top 80%` → `top 45%` scrubbed for
 * the draw, `top 65% once` for the dots. Inside a sticky screen the thread never
 * crosses anything: it is parked on the held screen for the whole section, so
 * both triggers resolve at a moment the reader cannot see. Both move onto the
 * section's read clock. The draw keeps its clip, its `machine` curve and its
 * reading pace; the dots keep their catch and their 0.18 stagger. "Retain the
 * animation and scroll-effect" (user, 12 September 2026) — the animation is the
 * same animation; only what fires it changed.
 *
 * ⚠ THE DOTS ARE PLAYED, NEVER SCRUBBED. `catch` is an overshoot, and an
 * overshoot dragged back and forth reads as a wobble rather than as a catch —
 * which is why the original wrote them on a `once: true` trigger. They stay
 * played-once here, fired from the read with a guard, and a scrub back leaves
 * them seated.
 *
 * Markup:
 *   [data-ab-stage] [data-ab-lift]  the sticky screen; also what the seam lifts
 *   [data-ab6-head] [data-arrive]   the persistent eyebrow
 *   [data-ab6-part="claim"]         h2, two facts, the ochre rule, the future
 *   [data-ab6-unsettled]            the sentence that does not resolve (CSS)
 *   [data-ab6-part="calendar"]      the thread, 2031, the body, the link
 *   [data-ab-rule="timeline"]       the dotted wave, clip-drawn
 *   [data-ab-beat] [data-ab6-beat-label]   the three dots and their names
 *   [data-ab-date]                  2031 — stated and held, never counted
 */
export function theCalendar(root: HTMLElement, span = 200): MotionModule {
  return composition("theCalendar", root, {
    /* ⚠ "none" IS THE TRUE DECLARATION AND THE ONE WORTH ASSERTING. §06 is
       scored ⚡4 in TRANSITION, and it spends that channel entirely at its
       edges — the navy wave riding in on `coverSeams`, and `overlap` lifting the
       board out in `boardLift` below. The interior therefore has to spend
       nothing, and declaring "none" makes `assertChannel` say so: any loud
       effect added here throws, whichever channel it belongs to. */
    channel: "none",
    span,
    ...HELD,
    uses: ["settle", "arrive"],
    build: (tl) => {
      const claimPart = q(root, '[data-ab6-part="claim"]');
      const calendarPart = q(root, '[data-ab6-part="calendar"]');
      const rule = q(root, '[data-ab-rule="timeline"]');
      if (!claimPart || !calendarPart || !rule) return;

      root.dataset.abHeld = "true";

      const heading = q(claimPart, "[data-ab6-claim]");
      const facts = qa(claimPart, "[data-ab6-fact]");
      const factRule = q(claimPart, "[data-ab6-rule]");
      const unsettled = q(claimPart, "[data-ab6-unsettled]");
      const future = q(claimPart, "[data-ab6-future]");

      const beats = qa(root, "[data-ab-beat]");
      const labels = qa(root, "[data-ab6-beat-label]");
      const date = q(root, "[data-ab-date]");
      const body = q(root, "[data-ab6-body]");
      const hairline = q(root, "[data-ab6-hairline]");
      const cta = q(root, "[data-ab6-cta]");

      // Rest state is the finished document, so everything the sequence brings
      // on is hidden HERE rather than in the markup. A mask is not a hiding
      // place — `settle` splits with `autoSplit` and a re-split orphans the
      // tween's line nodes (annotated at `freshSplit`; it has bitten twice). The
      // element is hidden with `autoAlpha`; the mask only does the rise.
      //
      // ⚠ THE WRAPPER, NOT THE SENTENCE, for the Elder Advisory Group line: its
      // two ghosts are siblings of the paragraph, so hiding the paragraph alone
      // leaves two coloured ghosts of a sentence that is not there.
      const hidden = [heading, ...facts, unsettled, date, body, cta].filter(
        Boolean,
      ) as HTMLElement[];
      gsap.set(hidden, { autoAlpha: 0 });
      gsap.set([factRule, hairline].filter(Boolean) as HTMLElement[], {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(rule, { clipPath: "inset(0 100% 0 0)" });
      if (beats.length) gsap.set(beats, { scale: 0 });
      if (labels.length) gsap.set(labels, { autoAlpha: 0 });

      /* ⚠ THE WHOLE CALENDAR IS GATED, NOT JUST ITS PIECES, and this is a fix
         rather than tidiness. The dots and their names are PLAYED (below) —
         deliberately, because an overshoot dragged backwards reads as a wobble —
         so they do not reverse when the reader scrolls back up. Everything else
         in part 2 is scrubbed and does, and the two parts share one grid cell.
         Without this the reader scrolls back to the claim and finds three ochre
         dots and "QUARTERLY / ANNUAL GENERAL MEETING / 2031 · THE REVIEW" sitting
         across the headline. Caught in a screenshot, not in the numbers, which
         read `scale: 0` on exactly the dots that were on the screen (12 September
         2026). A `set` inside a scrubbed timeline DOES reverse, so gating the
         part puts the played beats behind something that does. */
      gsap.set(calendarPart, { autoAlpha: 0 });

      /* ---- part 1 · the claim ------------------------------------------
         Read in the order the eye takes it: what the board holds, then how it
         is made up, then when it sits, then the rule, then the one sentence on
         this page about something that has not happened yet.

         ⚠ EVERY BEAT'S END IS `duration × (1 + 0.11 × (lines − 1))` — see
         `lineBeat`. The sheet below is laid out against those ends, not against
         the durations, and the whole of part 1 has to be off the screen before
         the thread starts to draw. */
      if (heading) {
        tl.set(heading, { autoAlpha: 1 }, 0.03);
        tl.settle(heading, lineBeat(0.055), 0.03);
      }
      facts.forEach((fact, i) => {
        const at = [0.11, 0.18][i] ?? 0.18;
        tl.set(fact, { autoAlpha: 1 }, at);
        tl.settle(fact, lineBeat(0.045), at);
      });
      if (factRule) {
        tl.to(factRule, { scaleX: 1, duration: 0.035, ease: EASE.country }, 0.25);
      }
      if (unsettled && future) {
        tl.set(unsettled, { autoAlpha: 1 }, 0.29);
        tl.settle(future, lineBeat(0.05), 0.29);
      }

      /* ---- part 1 clears -------------------------------------------------
         Grammar row: "the screen clears". `vacate`'s direction and its reason —
         what has been answered leaves through the top and does not come back —
         at BLOCK scale rather than per line, and deliberately not the effect
         itself: every element in here has already taken a `settle` split, and a
         second `freshSplit` on the same element in the same timeline reverts the
         first and orphans its line nodes. §05's values clear the same way for
         the same reason. */
      tl.to(
        claimPart,
        { autoAlpha: 0, y: -40, duration: 0.06, ease: EASE.country },
        0.43,
      );

      /* ---- part 2 · the thread acquires a date ---------------------------
         Clip, do not scale. Since 11 September 2026 the thread is the dotted
         wave (`thread-dots`), not a 2px bar, and `scaleX` would stretch every
         dot into a growing ellipse as the rule drew. A `clip-path` inset is the
         same edge travelling across held geometry that Wonder's itinerary rule
         uses, and it leaves the dots their own shape. Pace and curve unchanged
         from the viewport-triggered original. */
      const DRAW_AT = 0.52;
      const DRAW_FOR = 0.2;
      // Part 1 is gone by .49; the gate opens on the bare screen between them.
      tl.set(calendarPart, { autoAlpha: 1 }, 0.5);
      tl.to(
        rule,
        { clipPath: "inset(0 0% 0 0)", duration: DRAW_FOR, ease: EASE.machine },
        DRAW_AT,
      );

      if (date) quietly(tl, date, 0.73, 0.035);
      if (body) {
        tl.set(body, { autoAlpha: 1 }, 0.76);
        tl.settle(body, lineBeat(0.05), 0.76);
      }
      if (hairline) {
        tl.to(hairline, { scaleX: 1, duration: 0.03, ease: EASE.country }, 0.82);
      }
      if (cta) quietly(tl, cta, 0.84, 0.03);

      /* ---- the dots, played once from the read clock ---------------------
         F9: §06's beats and §09's doors are where this page spends its
         overshoot. The three seat left to right with their names, on the same
         `catch` they had on the viewport trigger — the dots are the only thing on
         this page that pops, and they pop because a date the board is
         accountable to arriving is worth a catch.

         ⚠ EACH SEATS WHEN THE DRAW REACHES IT, not on a fixed stagger. The
         original fired all three on one `stagger: 0.18` off a `once` trigger, so
         the rhythm was the tween's and had nothing to do with where the line
         had got to — which was invisible while the thread scrolled past, and is
         not invisible on a held screen. `machine` is linear (tokens.ts), so the
         clip's fraction at read-progress p is exactly `(p − DRAW_AT) / DRAW_FOR`
         and each dot can be compared against its own position on the line. The
         line stops on the third dot, so the third dot seats as the line lands.
         Measured seating all three at 15% drawn before this (12 September 2026).

         ⚠ FIRED FROM `onUpdate`, NOT FROM `tl.call()`, and that is the fix
         rather than a preference. A scrub sets the timeline's progress in jumps,
         and a flick can carry it straight over a callback's position without ever
         firing it — which would leave the dots at `scale: 0` for the rest of the
         read, on the one screen they are the subject of. Reading the progress
         every frame cannot be jumped over.

         ⚠ AND THEY RETREAT WITH THE LINE. "Played once, never scrubbed" came
         from a `once: true` trigger on a thread that scrolled past — by the time
         a reader came back the section was gone, so the dots never had to undo
         anything. Held, the reader watches the line retract, and a dot left
         sitting 73% along a line that is no longer under it reads as a rendering
         fault rather than as a beat that has already happened (caught in a
         screenshot at .62, not in the numbers, 12 September 2026). Each dot's pop
         is its own paused timeline that plays and reverses with the draw. This is
         still not a scrub: the pop runs on its own clock either way, so the
         overshoot is never dragged back and forth and cannot jitter — the thing
         the original comment was actually protecting. */
      /* Each beat's centre as a fraction of THE THREAD'S OWN WIDTH — which is
         what decides when the draw reaches it, and is not the same as its
         fraction of the column.

         ⚠ TIED BY HAND TO `BEAT_X` AND `THREAD_W` IN Sections.tsx, for the same
         reason those two are tied to each other: Tailwind cannot see a computed
         class, so none of the three can be derived from the others. Move one,
         move all three. The thread stops ON the last beat (`73.4% + 9px` of the
         1240 column), so the beats sit at 9/919, (0.339 × 1240 + 9)/919 and 1 —
         the last dot seats exactly as the line finishes, which is the whole
         point of the line stopping there. */
      const BEAT_F = [0.01, 0.467, 1];
      const pops = BEAT_F.map((_, i) => {
        const pop = gsap.timeline({ paused: true });
        if (beats[i]) {
          pop.to(beats[i], { scale: 1, duration: DUR.small, ease: EASE.catch }, 0);
        }
        if (labels[i]) {
          pop.to(
            labels[i],
            { autoAlpha: 1, duration: DUR.small, ease: EASE.country },
            0,
          );
        }
        return pop;
      });
      const shown = BEAT_F.map(() => false);
      tl.eventCallback("onUpdate", () => {
        const drawn = (tl.progress() - DRAW_AT) / DRAW_FOR;
        BEAT_F.forEach((f, i) => {
          const wanted = drawn >= f;
          if (wanted === shown[i]) return;
          shown[i] = wanted;
          if (wanted) pops[i].play();
          else pops[i].reverse();
        });
      });

      /* ---- the rest ------------------------------------------------------
         ⚠ A TRAILING REST HAS TO HOLD THE CLOCK OPEN, or it is not a rest at
         all — it is every earlier beat played late. A scrub maps the reader's
         0 → 1 onto 0 → `tl.duration()`, and the duration is wherever the LAST
         tween happens to end; leave the final stretch genuinely empty and a beat
         written at .86 plays at .86/.89 = .97 of the read. §05 was measured
         doing exactly that, twice, before this was understood (12 September
         2026). An inert tween on a throwaway object occupies the last stretch,
         holds the duration at 1.0 and touches nothing.

         The rest also has to be real here for a reason §05's did not: the
         section hands over to §07's wave, and the governance link is the last
         thing a reader is asked to notice on this page. */
      tl.to({}, { duration: 0.13 }, 0.87);
    },
    // The eyebrow only, and it never leaves.
    enter: arrivals,
    cut: (el) => {
      delete el.dataset.abHeld;
      clearAll(el);
    },
  });
}

/**
 * Seam 06 → 07 — the board recedes as the people's wave rides over it.
 *
 * ⚠ SEPARATE FROM `theCalendar`, AND NOT BY PREFERENCE. A composition that
 * declares `minWidth`/`minHeight` builds the CUT below those bounds
 * (compose.ts), so anything inside `theCalendar` is withheld on a phone, on a
 * short window, and under reduced motion. `overlap` cannot be withheld: §07's
 * off-white wave is scored to ride over a board that is receding, and a static
 * board under a moving wave is a different seam. So the lift lives here, with no
 * bounds, and this is where §06 spends the loud transition channel its ledger
 * row gives it.
 *
 * The numbers are deliberately small — a movement at the join, not the page
 * sliding around.
 *
 * ⚠ WHAT THIS COSTS BELOW 1024px: the thread's draw and the dots' catch now
 * live on the held screen's read clock, so they do not happen at all in the flow
 * build. `clearAll` leaves the thread fully drawn and the dots seated, so the
 * document is complete and correct — it simply does not animate, exactly as
 * §02 – §05 do not below the same bounds. Stated rather than discovered.
 */
export function boardLift(root: HTMLElement, span = 245): MotionModule {
  return composition("boardLift", root, {
    channel: "transition",
    span,
    uses: ["overlap"],
    build: () => {
      // Held, `[data-ab-lift]` is the sticky STAGE rather than a column inside
      // it, because the stage is what stands at the section's foot when the deck
      // reaches it — and the artist's rings ride inside the stage, so they
      // recede with the board. In flow it is the same wrapper doing the same
      // thing to the same content.
      const lift = q(root, "[data-ab-lift]");
      if (!lift) return;
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
    },
    cut: clearAll,
  });
}

/* -------------------------------------------------------------------------
   §07 — theRoster · 300vh / 200 read · seam 06 → 07's incoming half
   ------------------------------------------------------------------------- */

/**
 * "The people", held, with the portraits walked one face at a time.
 *
 * Grammar rows: "the page holding its ground, the interior scrub without a read
 * clock", "the world opening, one face at a time". User direction, 12 September
 * 2026, replacing the static three-column row.
 *
 * The header arrives in reading order and then STANDS for the whole section,
 * like §05's and §06's. Underneath it the roster is one row: the reader's
 * scroll walks a FOCUS along it, the frame it is on grows to full size and
 * carries a legible name, and the ones either side wait small and unnamed.
 *
 * ⚠ CONTINUOUS, NOT STEPPED. There is no snap and no index: `focus` is a real
 * number and every frame's scale falls off smoothly from it, so the rail
 * retraces exactly on the way back — the contract the five held screens before
 * this one keep, and the reason none of them needed a played-once guard the way
 * §06's dots did.
 *
 * ⚠ THE GEOMETRY IS IN CSS, IN svh. This writes two unitless numbers per frame
 * and measures nothing: `--ab7-x` (how many pitches from the focus) and
 * `--ab7-s` (the plate's scale), plus `--ab7-o` on the label. A rail that read
 * `offsetWidth` every tick would be a layout read per frame per frame, for a
 * number that only changes when the window does.
 *
 * ⚠ THE TRAVEL AND THE SCALE ARE ON DIFFERENT ELEMENTS ON PURPOSE. §04 proved
 * that three `quickSetter`s on one element's transform do not compose — `scale`
 * silently stayed at 1 for its whole sequence. Here the frame takes the travel,
 * the plate takes the scale and the label takes the opacity, so each element
 * has exactly one property and nothing can be clobbered. It is also what keeps
 * the name from arriving at 2.3× the size of every other label on the page.
 *
 * ⚠ THE SEAM NEEDS NO CODE. 06 → 07's off-white wave is statically seated on
 * this section's crest and rides `coverSeams`; `peopleWave`, which this
 * replaces, had an empty build for exactly that reason. The scored carry —
 * "2031's endpoint becomes §07's first caption rule" — still has no caption
 * rule in the markup, so it lands on the wave and the eyebrow's arrival.
 *
 * Markup:
 *   [data-ab-stage]        the sticky screen — paints nothing, or the rings go
 *   [data-ab7-head]        eyebrow (`data-arrive`), claim, body — stands
 *   [data-ab7-frame] ×n    one per person; takes the travel
 *   [data-ab7-plate]         the picture; takes the scale
 *   [data-ab7-label]         the name; takes the opacity
 *   [data-ab7-cta]         "Meet the people"
 */
export function theRoster(root: HTMLElement, span = 200): MotionModule {
  return composition("theRoster", root, {
    // The ledger's ⚡3 for this section. Nothing in the LOUD table is used —
    // the rail is hand-rolled, as §04's orbit is — so the assertion passes and
    // the declaration is a statement of where this screen spends itself.
    channel: "media",
    span,
    ...HELD,
    uses: ["settle", "arrive"],
    build: (tl) => {
      const claim = q(root, "[data-ab7-claim]");
      const body = q(root, "[data-ab7-body]");
      const frames = qa(root, "[data-ab7-frame]");
      const cta = q(root, "[data-ab7-cta]");
      if (!frames.length) return;

      root.dataset.abHeld = "true";

      const plates = frames.map((f) => q(f, "[data-ab7-plate]"));
      const labels = frames.map((f) => q(f, "[data-ab7-label]"));

      // Rest state is the finished document, so everything the sequence brings
      // on is hidden here rather than in the markup. A mask is not a hiding
      // place — `settle` splits with `autoSplit` and a re-split orphans the
      // tween's line nodes, annotated at `freshSplit`, bitten twice.
      const hidden = [claim, body, cta].filter(Boolean) as HTMLElement[];
      gsap.set(hidden, { autoAlpha: 0 });
      gsap.set(frames, { autoAlpha: 0 });

      // ---- the header, in reading order ---------------------------------
      if (claim) {
        tl.set(claim, { autoAlpha: 1 }, 0.03);
        tl.settle(claim, lineBeat(0.055), 0.03);
      }
      if (body) {
        tl.set(body, { autoAlpha: 1 }, 0.13);
        tl.settle(body, lineBeat(0.05), 0.13);
      }

      // ---- the rail seats ------------------------------------------------
      // The frames arrive where the walk will find them: the first already in
      // focus, the rest already waiting beside it, so the walk begins on a row
      // that is standing rather than on one still assembling itself.
      /* ⚠ THE RISE IS A CUSTOM PROPERTY, NOT `y`, AND THAT IS NOT A STYLE
         CHOICE. A frame's horizontal place on the rail is a `transform` written
         by the STYLESHEET from `--ab7-x`; GSAP's `y` writes an inline
         `transform` of its own, which does not merge with it — it replaces it.
         Measured: with `y` here, every frame's travel silently froze at
         whatever `--ab7-x` held when the tween first rendered, and the whole
         rail scaled in place without ever moving (12 September 2026). The
         scales looked perfect in the numbers, which is why this only showed up
         on screen. §04 states the same law from the other side: "no tween ever
         writes `transform` to a slot, so nothing can be clobbered by a later
         one." One property per element, and transforms are composed in CSS. */
      tl.fromTo(
        frames,
        { autoAlpha: 0, "--ab7-in": 24 },
        {
          autoAlpha: 1,
          "--ab7-in": 0,
          duration: 0.05,
          ease: EASE.country,
          stagger: 0.02,
        },
        0.24,
      );

      // ---- the walk ------------------------------------------------------
      /* `focus` runs 0 → frames.length − 1 across this window, so the window is
         divided by the roster and adding a face costs every other face a little
         of its beat rather than costing the page any scroll.
         ⚠ PAST ABOUT SIX FACES, GROW THE SPAN INSTEAD. At two the beat is a
         comfortable .28 of the read; at six it is .09, which is about as brisk
         as a portrait can be looked at. This is the number to change, and the
         `span` argument in Motion.tsx is the other half of it. */
      const RAIL_AT = 0.3;
      const RAIL_FOR = 0.56;
      const last = frames.length - 1;

      const x = frames.map((f) => gsap.quickSetter(f, "--ab7-x") as Setter);
      const s = plates.map((p) =>
        p ? (gsap.quickSetter(p, "--ab7-s") as Setter) : null,
      );
      const o = labels.map((l) =>
        l ? (gsap.quickSetter(l, "--ab7-o") as Setter) : null,
      );

      const walk = (focus: number) => {
        frames.forEach((_, i) => {
          const d = Math.abs(i - focus);
          // Smoothstep over one pitch either side: flat at the extremes, so a
          // frame neither snaps into focus nor creeps out of it.
          const near = d >= 1 ? 0 : (1 - d) * (1 - d) * (3 - 2 * (1 - d));
          x[i](i - focus);
          s[i]?.(1 + GAIN * near);
          o[i]?.(near);
        });
      };
      walk(0);

      // One tween on a plain object, so the walk is a single scrubbed value and
      // the per-frame numbers are derived from it rather than tweened
      // separately — n frames cannot drift out of step with each other if there
      // is only one clock.
      const cursor = { focus: 0 };
      tl.to(
        cursor,
        {
          focus: last,
          duration: RAIL_FOR,
          ease: "none",
          onUpdate: () => walk(cursor.focus),
        },
        RAIL_AT,
      );

      if (cta) quietly(tl, cta, 0.88, 0.03);

      /* ⚠ A TRAILING REST HAS TO HOLD THE CLOCK OPEN, or it is not a rest at
         all — it is every earlier beat played late. A scrub maps the reader's
         0 → 1 onto 0 → `tl.duration()`, and the duration is wherever the LAST
         tween ends; §05 was measured playing its beats at .93 of the read
         before this was understood (12 September 2026). An inert tween occupies
         the last stretch, holds the duration at 1.0 and touches nothing. */
      tl.to({}, { duration: 0.09 }, 0.91);
    },
    // The eyebrow only, and it never leaves.
    enter: arrivals,
    cut: (el) => {
      delete el.dataset.abHeld;
      clearAll(el);
    },
  });
}

/** How much bigger the focused plate is. Mirrors `--ab7-gain` in about.css. */
const GAIN = 1.3;

type Setter = (value: number) => void;

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
 * User revision, 11 September 2026 / grammar "the doors answer": wait for
 * the deck to seat before playing `doorsOpen`. The old row-only trigger
 * spent most of its 0.55s reveal during the slide hand-off. Tall headers
 * also wait for the row itself to enter the viewport. A retained trigger
 * completes missed entries on refresh, matching composition's X4 handling.
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
    uses: ["arrive", "doorsOpen"],
    build: () => {
      const row = q(root, "[data-ab-doors]");
      const doors = row ? qa(row, "a") : [];
      if (row && doors.length) {
        const entrance = gsap.effects.doorsOpen(doors, { paused: true }) as gsap.core.Timeline;
        ScrollTrigger.create({
          trigger: root,
          start: () => {
            const rowOffset = row.getBoundingClientRect().top - root.getBoundingClientRect().top;
            // The deck rests exactly at top: 0; ScrollTrigger enters only
            // after crossing its start. A 1vh seating tolerance avoids
            // requiring one more wheel tick to reveal the waiting cards.
            return `top ${Math.min(window.innerHeight * 0.01, window.innerHeight * 0.78 - rowOffset)}px`;
          },
          onEnter: () => entrance.play(),
          onEnterBack: () => entrance.play(),
          onRefresh: (self) => {
            if (self.scroll() >= self.start) entrance.progress(1);
          },
        });

        // Focus can move straight to an off-screen link. Reveal it immediately;
        // the nested context gives matchMedia and the controller its cleanup.
        gsap.context(() => {
          const reveal = () => { entrance.progress(1); };
          row.addEventListener("focusin", reveal);
          if (row.contains(document.activeElement)) reveal();
          return () => row.removeEventListener("focusin", reveal);
        }, root);
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
