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
// /living-work's ring turn, reused rather than rewritten — see §03 below.
import { driftArtwork } from "@/lib/motion/recipes";
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
/**
 * Pre-hide something a KEYBOARD CAN STILL REACH.
 *
 * ⚠ `autoAlpha` IS WRONG ON ANYTHING FOCUSABLE, and this is a fix for a
 * regression the held screens introduced. `autoAlpha: 0` sets
 * `visibility: hidden`, which takes an element out of the tab order AND out of
 * the accessibility tree — and `visibility` INHERITS, so hiding a wrapper hides
 * every link inside it. Measured on /about at scroll 0: seven of the page's
 * eleven focusable elements were unreachable — §04's four area cards (hidden
 * through their slot), §06's governance link, §07's "meet the people" and §08's
 * "partner with us". A keyboard user tabbing from the top reached the four
 * footer links and nothing else (13 September 2026).
 *
 * Opacity alone keeps the element in both trees, so Tab finds it and
 * `revealOnFocus` in compose.ts scrolls the page to where it is visible. The
 * pointer half matters just as much: a transparent link still takes clicks, and
 * §04's cards sit on top of one another on the ring, so without it a reader
 * could click a card they cannot see.
 *
 * Everything NOT focusable keeps `autoAlpha` — it is the better hide, and a
 * screen reader reading a paragraph that is mid-clear is worse than silence.
 */
const hideReachable = (els: HTMLElement | HTMLElement[]) =>
  gsap.set(els, { opacity: 0, pointerEvents: "none" });

const quietly = (
  tl: gsap.core.Timeline,
  el: HTMLElement,
  at: number,
  duration = 0.035,
) =>
  tl.fromTo(
    el,
    { opacity: 0, y: 16, pointerEvents: "none" },
    {
      opacity: 1,
      y: 0,
      pointerEvents: "auto",
      /* ⚠ `visibility` IS RESTORED HERE AND NOT LEFT TO THE CALLER, which is a
         fix for a regression this helper caused. It used to animate `autoAlpha`
         and therefore un-hid both halves; when it moved to opacity (so the
         links it brings on stay in the tab order — see `hideReachable`) it
         stopped restoring visibility, and anything a recipe had pre-hidden with
         `autoAlpha: 0` was left at `opacity: 1; visibility: hidden` — present,
         correct, and permanently invisible. Three elements shipped like that
         and were reported: §03's attribution and its tagline, and §06's 2031
         (13 September 2026).
         Setting it in the `to` only means the helper no longer depends on how
         its caller chose to hide the element: pre-hidden with `autoAlpha` it is
         un-hidden here, pre-hidden with `hideReachable` this is a no-op and the
         element stays focusable at rest. `visibility` is not interpolable, so
         GSAP applies it as the tween starts and restores it on the way back —
         which is `autoAlpha`'s own behaviour, and what these beats had. */
      visibility: "visible",
      duration,
      ease: EASE.country,
    },
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
const HELD = { minWidth: "1024px", minHeight: "640px" } as const;

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
 *   02  THE NAME LANDS, AND COLLAPSES  18%    resolves · long name to 0.45 ·
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
 *   [data-ab2-decode] ×3           the legal name's aria-hidden runs, one per
 *                                  fixed line (15 Sep 2026 — see Sections.tsx)
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
      // ⚠ THE LEGAL NAME IS SEVERAL RUNS NOW, ONE PER LINE (15 September 2026
      // — see the note in Sections.tsx). `legalP` is still the one paragraph
      // that carries the dim and the accessible string.
      const legalRuns = qa(root, "[data-ab2-decode]");
      const legalP = legalRuns[0]?.parentElement ?? null;
      const short = q(root, "[data-ab2-short]");
      const bodies = qa(root, "[data-ab2-body]");
      const rule = q(root, "[data-ab2-rule]");
      const facts = qa(root, "[data-ab2-fact]");
      const rows = qa(root, "[data-ab2-row]");
      const head = q(root, "[data-ab2-register-head]");
      const recap = q(root, "[data-ab2-recap]");
      const prose = q(root, '[data-ab2-block="prose"]');

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
        [registerBlock, prose, short, ...bodies, ...facts, ...rows].filter(
          Boolean,
        ),
        { autoAlpha: 0 },
      );
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      if (legalP) gsap.set(legalP, { opacity: 1 });

      // ---- 01 → 02 · the name ------------------------------------------
      // The decode runs first and alone; nothing else is on the screen, which
      // is the board's own frame 01.
      //
      // ⚠ .07, AND ONE RUN PER LINE — 15 September 2026, user report ("the
      // acronym reveal is too slow and exceeds the section width"). Two things
      // changed and they are the same change:
      //
      //   · The name is now three fixed lines (Sections.tsx), each its own
      //     `decode` target, because ScrambleText rewrites the whole string
      //     every frame and one wrapping paragraph therefore RE-BREAKS under
      //     the reader for the length of the resolve. That is what put 1238px
      //     of noise inside a 1240px column at 1440 and four lines of noise
      //     where two lines of name were going to land at 1366.
      //   · .07 rather than .13. The pass of 14 September had already halved
      //     this once for pace and it was still the longest single beat on the
      //     screen. ScrambleText reveals a string left to right, so three runs
      //     offset by the page's own line ratio read as ONE sweep travelling
      //     down the block rather than as three effects — the sequential read
      //     asked for on 12 September, now spread over half the scroll.
      //
      // Everything that followed the decode moves up with it and NOTHING after
      // .28 moves, so the dwell the 14 September note defends is kept and
      // lengthened rather than re-opened: the short name now stands from ~.13
      // to .28 instead of from .19.
      //
      // The stagger is the line stagger carried across as a ratio, the way
      // every other split beat on this page does it — see `lineBeat`, which
      // cannot be used directly here because `decode` splits nothing and takes
      // no stagger of its own.
      const DECODE_FOR = 0.07;
      if (legalRuns.length) {
        const each = DECODE_FOR / (1 + LINE_STAGGER * (legalRuns.length - 1));
        legalRuns.forEach((run, i) => {
          tl.decode(run, { duration: each }, each * LINE_STAGGER * i);
        });
      }

      // It resolves, and dims as the short name lands under it — "two lines,
      // one gesture: this is what we are called, and this is what you will
      // call us".
      //
      // ⚠ 0.45, NOT THE BOARD'S 0.28, and the markup no longer dims it as well.
      // The paragraph carried `text-evergreen/30` on top of this, so the two
      // compounded to 0.084 and the legal name was very nearly invisible — the
      // reported defect (user, 13 September 2026). Removing the class dimmer
      // was most of the fix; 0.45 is the rest of it, on the same direction. The
      // dim now lives in exactly one place, which is this line.
      //
      // It sits on the decode's END, wherever that is — .07 since 15 September
      // 2026. The paragraph is the dim's target and always was: there are three
      // runs inside it now and dimming them one at a time would make the name
      // fade off in strips.
      if (legalP) {
        tl.to(
          legalP,
          { opacity: 0.45, duration: 0.08, ease: EASE.country },
          DECODE_FOR,
        );
      }
      /* ⚠ THE ARRIVAL IS HALVED AND THE DWELL IS THE POINT (user direction,
         14 September 2026, second reading: "the text 'Most people say
         yachatdac' disappears too quickly after appearing like you won't have
         a second to read it").

         The reported defect was not spacing, it was SIGN. `settle` ran .12 from
         .15, so the line finished arriving at .27 — and the block that carries
         it began clearing at .25. The short name never reached full opacity in
         a single frame: it was still fading in while it was already fading out,
         which is exactly what "you won't have a second to read it" describes.
         The pass before this one moved both numbers together and preserved the
         overlap, because the relationship looked deliberate when it was read as
         a relationship rather than as a duration and an end.

         A `settle` is ARRIVAL, not reading; reading happens in the still frame
         after it. So the arrival is .06 (~196px of wheel at 0.55) and the line
         then STANDS from .19 to .28 with nothing else moving — ~295px of wheel
         on a screen that is not itself travelling. Every reading beat below is
         budgeted the same way, and none of them clears before it has landed.

         ⚠ IT LANDS ON THE DECODE'S END, WHICH MOVED TO .07 ON 15 SEPTEMBER
         2026 — so the arrival is unchanged at .06 and the STAND is now .13 →
         .28 rather than .19 → .28. The dwell this note defends is not re-opened
         by the pacing pass above it; it is half again as long. Nothing after
         .28 moved, so the rest of the sheet reads exactly as it did. */
      if (short) {
        tl.set(short, { autoAlpha: 1 }, DECODE_FOR);
        tl.settle(short, lineBeat(0.06), DECODE_FOR);
      }

      // ---- the name goes BEFORE the prose arrives ------------------------
      // ⚠ THE ORDER CHANGED — 13 September 2026, user direction, reported from
      // 1366 x 643. The paragraphs used to arrive at .30 while the name was
      // still up and the whole block cleared together at .48, so a 643px screen
      // carried the legal name, the short name and five lines of prose at once
      // and the last line fell below the fold.
      //
      // The name clears first and the prose is read on the screen it leaves.
      // Clearing with `autoAlpha` alone would not have been enough — a hidden
      // element keeps its box, so the prose would still have begun 265px down
      // an empty screen. It is a separate block sharing the same grid cell now
      // (Sections.tsx, about.css), so the prose is read WHERE THE NAME WAS.
      //
      // The block still clears WHOLE rather than line by line: its children
      // each already own a split, and a second split beat on any of them would
      // orphan the first one's line nodes — the trap annotated at `freshSplit`.
      // Nothing is lost, because the derived recap carries what was read.
      if (nameBlock) {
        tl.to(
          nameBlock,
          { autoAlpha: 0, duration: 0.05, ease: EASE.country },
          0.28,
        );
      }

      // ---- 03 · the body, line by line ----------------------------------
      /* ⚠ `lineBeat(0.06)` AND .14 APART — arrival, then dwell, the same
         correction the short name above carries and for the same reason. At
         `lineBeat(0.09)` .10 apart a four-line paragraph finished arriving .08
         after it started, so the second was still settling when the first was
         already being replaced and the block's own clear (.49) landed before
         the second had finished (.52). Both paragraphs were arriving-and-
         leaving rather than standing.

         .06 arrives a four-line paragraph in ~.08, and the .14 step leaves each
         one standing for ~.06 — ~196px of wheel at 0.55 — before the next. */
      if (prose) tl.set(prose, { autoAlpha: 1 }, 0.33);
      bodies.forEach((body, i) => {
        const at = 0.33 + i * 0.14;
        tl.set(body, { autoAlpha: 1 }, at);
        tl.settle(body, lineBeat(0.06), at);
      });

      // ---- the turn -----------------------------------------------------
      // THE HEADING RETAINS; EVERYTHING UNDER IT GOES (user direction,
      // 12 September 2026).
      if (prose) {
        tl.to(
          prose,
          { autoAlpha: 0, duration: 0.05, ease: EASE.country },
          0.61,
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
          { "--ab2-fold": 0, duration: 0.08, ease: EASE.country },
          0.62,
        );
      }

      // The register takes the name's place, under a heading that never moved.
      if (registerBlock) {
        tl.to(
          registerBlock,
          { autoAlpha: 1, duration: 0.04, ease: EASE.country },
          0.66,
        );
      }
      if (recap) quietly(tl, recap, 0.665);

      // ---- 04 · the thread enters ---------------------------------------
      // ⚠ FURNITURE, AND IT PAYS FOR THE FACTS. The road, the register and the
      // thread all arrive .04 earlier than they did before 14 September 2026.
      // Nothing here is read — the road is a picture collapsing, the rule is a
      // 2px line — so shortening the gap between them costs the reader nothing
      // and buys the four facts below the width they needed. Their shape is
      // unchanged: the register still lands mid-fold and the rule still draws
      // into the first fact's arrival, exactly as they did at .62/.65.
      if (rule) {
        tl.to(rule, { scaleX: 1, duration: 0.03, ease: EASE.country }, 0.68);
      }
      if (head) quietly(tl, head, 0.69);

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

      // ⚠ .085 APART, NOT .07 — and the run starts at .62, not .68 (user
      // direction, 14 September 2026: "the scroll is too quick in pacing and
      // user might miss some sections or text"). At .07 a fact got 126px of a
      // 200vh read, which made this the tightest sequence on /about — three
      // times tighter per item than §05's values at .30–.35, and half of §08's
      // .12, which is the one number on this page the reader has already
      // ratified ("too fast, slow it down", 12 September 2026, see thePartners).
      //
      // .07 is 126px, and at /about's 0.55 wheel weight that is ~229px of
      // wheel per fact — over the bar §08 was ratified at, which is the test
      // that matters now the whole page is scrolled 1.8x heavier.
      //
      // ⚠ IT CAME DOWN FROM .085, AND THAT IS A TRADE, NOT A REGRESSION. The
      // second reading found the failure was upstream: the name and both
      // paragraphs were arriving and leaving without ever standing still (see
      // the blocks above), and fixing SIGN costs more of the read than fixing
      // spacing did. The budget now divides as .13 decode + .15 name and its
      // dwell + .05 clear + .28 prose and its dwells + .09 furniture + .29
      // facts + .01 rest = 1.0, with nothing spare. Eight reading beats do not
      // fit a 200vh read with dwell on all of them; the heavier wheel is what
      // makes .07 read like .12 did, and more span is the only thing that would
      // buy real room here.
      const FACT_AT = 0.69;
      const FACT_STEP = 0.07;
      facts.forEach((fact, i) => {
        const at = FACT_AT + i * FACT_STEP;
        // ⚠ THE FOLD MUST NOT START BEFORE THE ARRIVAL LANDS. At .045 after an
        // arrival that ran .035 the fact stood for .010; the first cut of this
        // pass shortened the offset to .03 and made it NEGATIVE — the same
        // defect being fixed above, reintroduced two beats later and caught by
        // the budget check rather than by eye. Arrival .022, fold at .05: the
        // fact stands for .028 at heading scale before it collapses.
        //
        // It is thinner than the dwells above and that is deliberate rather
        // than a shortfall — a fact does not VANISH, it folds into its register
        // row and the row stays on the screen, so the reading continues after
        // the beat. The short name had nowhere to go, which is why it needed
        // three times this.
        const folds = at + 0.05;
        const top = rowTop[i] ?? 0;

        // Arrives in its row's place, one row below the last that settled.
        tl.fromTo(
          fact,
          { autoAlpha: 0, y: top + 18 },
          { autoAlpha: 1, y: top, duration: 0.022, ease: EASE.country },
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
              duration: 0.035,
              ease: "none",
            },
            folds + 0.012,
          );
        }
      });

      /* ⚠ THE TRAILING REST, ADDED 14 September 2026 WITH THE PACING PASS.
         A scrub maps the reader's 0→1 onto 0→`tl.duration()`, and the duration
         is wherever the LAST tween ends — so until this line existed every
         position in this recipe was quietly renormalised against whatever the
         fourth fact happened to land on (.992 before the pass, .977 after it),
         and each edit above silently moved every beat that was not edited. The
         rest pins the clock at 1.0 so a position written here is the fraction
         of the read it says it is. §05, §06, §07 and §08 each carry one for the
         same reason; §02 was the section that did not and should have. */
      tl.to({}, { duration: 0.01 }, 0.99);
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
      // ⚠ EVERY RUN, NOT THE FIRST — the name is three of them since
      // 15 September 2026, and restoring only one leaves two lines of noise
      // standing under a resolved first line.
      el.querySelectorAll<HTMLElement>("[data-ab2-decode]").forEach((run) => {
        if (run.dataset.decodeText) run.textContent = run.dataset.decodeText;
      });
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
 * ground goes out under the question" — as amended on 15 September 2026, "now
 * through a WAVE edge" — "the page holding its ground, the interior scrub
 * without a read clock", "what endures" (`settle`), and "what radiates, the
 * artist's ring grounds under scroll" (`driftArtwork`, added 15 September
 * 2026).
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
 *   [data-ab-ground]        the rising front's window; carries the one custom
 *                           property, `--ab-front`, unitless and read as svh
 *   [data-ab-front]           the body that travels — wave crest, then ground
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
      const claimsCol = q(root, "[data-ab-claims-col]");
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

      // ---- the ground the question is read against ----------------------
      /* ⚠ THE RINGS TURN — user direction, 15 September 2026 ("the background
         ring SVGs behind 'What does it leave for the generations who come after
         us' should rotate under scrolling, the way /living-work does it").

         This is /living-work's own helper, exported for the purpose rather than
         written a second time: one tween, `rotation: 30`, `ease: "none"`,
         across this whole read — so it winds clockwise as the reader descends
         and unwinds at the same tempo on the way back, because it is scrub-
         linked rather than looped. `drift` on the two `RingArtwork`s in
         Sections.tsx is what opts them in.

         It is FIRST, and at position 0, for two reasons. It is ground: it has
         been turning since before the first claim is read, so nothing about it
         reads as an event. And its tween ends at exactly 1.0, which is the
         invariant the last beat of this timeline is annotated to protect — a
         beat that ran past 1.0 would make every position below mean something
         other than the fraction of the read it looks like.

         Quiet by construction, so §03 is still loud in TYPE and `uses` gains
         nothing from compose.ts's LOUD table. The rings sit ABOVE the rising
         front (Sections.tsx) so they emerge out of it as it passes; turning
         them does not change which side of it they are on. */
      driftArtwork(tl, root);

      // ---- the ground -------------------------------------------------
      // LINEAR, one-for-one with scroll. The grammar row is explicit about
      // why: eased, a ramp stands still through the first third and then
      // lurches, which reads as broken rather than eased. 130 → −30 so the
      // front is genuinely off-screen at both ends — see about.css.
      //
      // ⚠ THE NUMBERS ARE THE SAME AND THE UNIT IS GONE (15 September 2026,
      // the wave pass). The front's leading edge is now the Wave / Divider's
      // contour rather than a gradient stop, so what reads `--ab-front` is a
      // `translate3d` and no longer a set of gradient stops — and a PERCENTAGE
      // translate resolves against the moving element's own height rather than
      // against the screen, which would have quietly changed what every number
      // here means. Unitless, read as `svh` by the stylesheet, 130 and −30 are
      // the same two positions they always were. The stylesheet carries the
      // arithmetic.
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
          { "--ab-front": 130 },
          // ⚠ .14, NOT .18. The crossing runs on an empty screen by design —
          // the grammar row is explicit that dark ink on a darkening ground
          // reads as a rendering fault — but the span was set against a 900px
          // screen and at 643 it left the reader looking at nothing for about a
          // fifth of the read (measured, 13 September 2026). Shorter, and the
          // question follows it in rather than waiting on it.
          { "--ab-front": -30, duration: 0.14, ease: "none" },
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
      // ⚠ .10, NOT .14, AND CLAIM 2 COMES UP AT .20 — 13 September 2026.
      // At .14 / .24 there was a stretch around p≈.22 with claim 1 gone, claim 2
      // not yet arrived and nothing on the screen but the eyebrow (measured at
      // 1366 x 643). The handover still keeps clear air between the two — the
      // scrub trails the scroll by a few hundredths and butting them together
      // once put claim 1's last line at ~25% under a fully-arrived claim 2 —
      // but the air is now .03 rather than a dead beat.
      if (claimA) tl.vacate(claimA, lineBeat(0.1), 0.06);
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
          0.2,
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
      // ⚠ THE CLAIMS COLUMN IS CLEARED HERE, EXPLICITLY — THE COLUMN, NOT THE
      // SCREEN. Originally nothing cleared it: it sat at opacity 1 for the whole
      // read and what hid the eyebrow was the rising front passing over it. That
      // worked, but it was timing rather than layout — the eyebrow's box and the
      // question's overlap inside the shared stage cell, so any viewport where
      // the front had not reached the head of the screen when the question
      // arrived would paint the two on top of each other. Reported from
      // 1366 x 643 and not reproducible from the outside, which is exactly why
      // it is fixed by removing the possibility rather than by re-timing.
      //
      // ⚠ BUT IT WAS THE WHOLE SCREEN, AND THAT TOOK THE RINGS (reported
      // 14 September 2026: "the background svg is gone again in 'what does it
      // leave for the generations who come after us?'"). `[data-ab-screen=
      // "claims"]` carries four layers the question needs left alone — the
      // plate, the two scrims and the risen charcoal FRONT — and the artist's
      // rings, which sit above the front precisely so they emerge out of it as
      // it rises and are ground for the dark state. Fading the screen faded all
      // five, so the question was asked on bare charcoal and the section's
      // background was the only thing behind it.
      //
      // Only the eyebrow and the claims share the cell with the question, and
      // they are the column. Clearing the column keeps the 1366 x 643 guarantee
      // — the two can still never paint on top of each other — and leaves the
      // front and the rings standing, which is the composition the question was
      // always meant to be read against. Nothing else in this recipe needed to
      // change: the front is already fully risen by .72.
      if (claimsCol) {
        tl.to(
          claimsCol,
          { autoAlpha: 0, duration: 0.04, ease: "none" },
          0.72,
        );
      }

      if (question) {
        tl.set(question, { autoAlpha: 1 }, 0.72);
        tl.settle(question, lineBeat(0.1), 0.72);
      }

      // The thread's first appearance, drawing left to right: scaleX from a
      // left origin, as a beat on this timeline rather than on a viewport
      // trigger of its own. A `top 82%` trigger inside a held screen is
      // consumed while the slide is still behind the one covering it: the
      // draw plays where nobody can see it and then nothing moves for the
      // whole read. That failure is the grammar's "interior scrub" row.
      // ⚠ .86, NOT .89, AND THE TWO LINES BELOW MOVE WITH IT (pacing pass,
      // 14 September 2026). The attribution and the tagline sat .035 apart —
      // ~63px of a 200vh read, the narrowest pair on /about — so the citation
      // and the line about ancient traditions arrived almost together at the
      // end of the page's loudest screen. The .03 comes out of the question's
      // own dwell, which had .21 of the read to itself and still has .19; the
      // question is not read any faster and the two lines below it get half
      // again as long. The tagline's position is NOT part of this: see below.
      if (rule) {
        tl.set(rule, { autoAlpha: 1 }, 0.86);
        tl.to(rule, { scaleX: 1, duration: 0.04, ease: EASE.country }, 0.86);
      }

      // After the settle has landed, never with it — naming the source while
      // the question is still arriving puts the citation ahead of the claim.
      //
      // `quietly` is X4's arrival written as a fromTo — see the helper for why
      // it cannot be `arrive` here.
      if (attribution) quietly(tl, attribution, 0.91);
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
 * ⚠ REBUILT AS A TRAVELLING ROW, 15 SEPTEMBER 2026, USER DIRECTION: "four
 * cards in horizontally, no need to shrink, scroll carousel to the left upon
 * scrolling · make the subtext that appears only appear in the middle right
 * next to the cards that refer to it", with the homepage Pathways rail named
 * as the style to follow. Grammar row: "accumulating, About §04's four stand
 * in a ROW that travels".
 *
 * The lede is still a chain of three clauses, each read on its own, and the
 * card each clause names still arrives after it — that is the ACCUMULATION
 * this recipe is named for and it is kept. What the cards do once they are
 * there is what changed: they stand in a horizontal row inside a clipped mask
 * and the row travels left with the read.
 *
 * ⚠ WHAT LEFT, AND WHY IT LEFT TOGETHER. The diamond placed four cards on the
 * artist's spiral at 0.475 scale, each seating on a `catch` overshoot, each
 * losing its body and its label to a `clip-path` that closed the card's foot
 * behind them, with the whole ring turning a quarter per card. Those were not
 * five decisions, they were one: fitting four WHOLE cards onto a ring. At that
 * scale a card's body measured about 8px, so it HAD to be given up, which is
 * why the compaction existed at all. "No need to shrink" removes the premise,
 * so the scale, the overshoot, the compaction, the turn and the drawn-empty
 * fourth position all go with it. `catch` is not lost to the site — the F9
 * ledger still budgets it at §09's doors.
 *
 * ⚠ THE SUBTEXT BELONGS TO THE CARD IN THE MIDDLE. A card's body and label are
 * legible only while that card is at the mask's CENTRE, derived from that
 * card's own distance to the centre rather than from an index — so the copy on
 * screen is always the copy for the card in front of the reader, and the lit
 * body walks along the row as the row travels. It lives inside its own card,
 * in that card's flow, so it cannot float away from what it describes. Nothing
 * is rendered twice for this and nothing is hidden: a second copy of a link is
 * a second tab stop, `aria-hidden` does not take an element out of the tab
 * order, and `visibility` would leave a keyboard reader an invisible
 * destination. It is only ever dimmed.
 *
 * ⚠ ONE WRITER PER ELEMENT. The track takes the travel — one `x`, and nothing
 * else writes the track's transform — and each body takes its own opacity. §04
 * is where this law was learned: three `quickSetter`s on one element's
 * transform did not compose, and `scale` silently stayed at 1 for a whole
 * sequence. Same reason the band in §02 is one custom property.
 *
 * ⚠ POSITION-SCRUBBED, NOT VELOCITY-DRIVEN. The board asks for the motion to
 * take the reader's scroll velocity and be parkable (IMG-01, released by F9).
 * Bound to scroll position instead, on user direction, so the section retraces
 * exactly on the way back — the contract §02 and §03 keep, and the reason
 * `ease: "none"` is right here. The velocity pattern lives in
 * `src/lib/motion/orbit.ts` if this is revisited; it is a `/v2` sketch and
 * must not be extended.
 *
 * ⚠ NEVER ON THE CARD PHOTOGRAPHS. The board is explicit: "never on the
 * photographs inside the cards, which are frame grade". Nothing here touches a
 * plate — the TRACK travels and every photograph rides it without a transform
 * of its own, which is now true by construction rather than by care.
 *
 * Span 300 − 100 = 200; the deck's BUFFER does not come off it. See the
 * arithmetic written out at `theQuestion`.
 *
 * Markup:
 *   [data-ab4-head]              eyebrow + headline, hold then leave
 *   [data-ab4-clause] ×3         read on its own, then clears
 *   [data-ab4-loop]              the MASK — the clipped window the row is read
 *                                through, and the box its centre is measured in
 *   [data-ab4-track]               the row; takes the travel, and nothing else
 *   [data-ab4-slot] ×4               one card; in flex flow, fixed width
 *   [data-ab4-card-body]               body + label; lit only in the middle
 *   [data-ab4-ring]              the spiral, ground artwork behind the row
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
      /* ⚠ THE ROW'S TRAVEL IS MEASURED, ONCE, AND IT IS PATHWAYS' FORMULA WITH
         ONE TERM ADDED. `homeHeroDissolve` carries the homepage's pathway rail
         with

             min(0, mask.clientWidth - paddingLeft - track.scrollWidth)

         which reads as: walk the track left by exactly the amount it overruns
         its window, and no further. That is reused rather than re-derived,
         because the user named that rail as the style to follow.

         ⚠ BOTH GUTTERS COME OFF HERE, NOT ONE, AND THAT IS A REAL DIFFERENCE
         FROM PATHWAYS. Pathways subtracts only the left gutter because its
         TRACK carries its own `pr-16`, so the right-hand margin is already
         inside its `scrollWidth`. This row's padding sits on CardRail's line,
         which is not what `scrollWidth` is read from, so the right margin has
         to be a term in the arithmetic instead. Measured 15 September 2026
         with only the left gutter subtracted: travel came out −228 and the
         last card's right edge landed at exactly 1440 — flush against the
         viewport, with no gutter at all. CLAUDE.md is explicit that only
         full-bleed media may touch the viewport edge, and a link card is not
         that. Subtracting both gives −328 and the row finishes inside the
         column it started in.

         `clientWidth` is the PADDING box, so the two subtractions turn it into
         the column's own content width — the box the row must end up inside.
         `min(0, …)` is the whole safety story: a row that already fits returns
         0 and simply stands, so a narrower card cap on a short screen or a
         future fifth area behave without a branch.

         Measured once per build, not per frame: it changes only when the window
         does, and a `scrollWidth` read on a scrub tick is a forced layout three
         times a frame. `gsap.matchMedia` rebuilds the composition on a
         breakpoint change and `ScrollTrigger.refresh` re-runs `build`, so the
         number cannot go stale behind a resize. */
      const travelFor = () => {
        const track = q(root, "[data-ab4-track]");
        if (!track) return 0;
        const cs = getComputedStyle(loop);
        const left = parseFloat(cs.paddingLeft) || 0;
        const right = parseFloat(cs.paddingRight) || 0;
        return Math.min(0, loop.clientWidth - left - right - track.scrollWidth);
      };

      /* THE PITCH — one card plus one gap, in px, read off the built row rather
         than recomputed from the tokens. Two cards is the only measurement this
         needs: their left edges are exactly a pitch apart, and taking the
         difference means the module never has to know what `--ab4-card` and
         `--ab4-gap` currently resolve to. */
      const slotBox = slots.map((s) => s.getBoundingClientRect());
      const pitch =
        slots.length > 1
          ? slotBox[1].left - slotBox[0].left
          : slotBox[0].width;

      hideReachable(slots);

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
      // ⚠ .09, NOT .12 (user direction, 14 September 2026: the first card and
      // "If Country is not cared for" should arrive "few % scroll more early,
      // like around 2-3%"). Nothing animates between 0 and this mark — the head
      // is `set` visible at 0 and then holds — so the opening .12 was a static
      // eyebrow-and-headline screen the reader waited out before the section
      // began. Taking it to .09 is the 3% asked for, at the top of the range.
      //
      // It moves ALL THREE clauses, and that is deliberate rather than
      // incidental: `at` is `CLAUSE_AT + i * STEP`, so lowering the mark slides
      // the whole chain earlier and leaves `STEP` — the rhythm between clauses,
      // and the thing CARD_SEAT's read is measured inside — completely
      // untouched. Moving only the first would have made the gap to the second
      // .20 against the others' .17, which is a limp in the one sequence on the
      // page whose claim is that four things hold each other up evenly.
      //
      // The tail absorbs it. The fourth card now seats at .715 instead of .745
      // and the deliberately empty hold at .80 → .86 is unchanged, so the run
      // up to it grows from .055 to .085 of quiet — more of the pause the hold
      // already exists to give, not less.
      const CLAUSE_AT = 0.09;
      const STEP = 0.17;
      const CARD_IN = 0.025; // after its clause
      // ⚠ THE GAP BETWEEN THESE TWO WAS THE READ, and it is now WHEN THE ROW
      // STARTS WALKING. The original argument: a card arrives with its
      // photograph, its title and its description, and the reader is given
      // ~18vh of held scroll to take that in before it is put away on the ring
      // — close it up and the whole state is a flicker, and there was no
      // reason to have shown the description at all (user direction,
      // 12 September 2026). Nothing is put away any more, so what the gap buys
      // is that the FIRST card is read standing still before the carousel
      // begins. The number is unchanged, so the dwell that note defends
      // survives the rebuild intact.
      const CARD_SEAT = 0.115;
      // How long a clause stands before it clears. It was the mark the FOLD
      // ran on — "last, once its card is compact" — and it is kept at the same
      // number so the section's rhythm does not move with the rebuild.
      const CLAUSE_FOLD = 0.175;

      clauses.forEach((clause, i) => {
        const at = CLAUSE_AT + i * STEP;
        gsap.set(clause, { autoAlpha: 0 });
        tl.set(clause, { autoAlpha: 1 }, at);
        tl.settle(clause, lineBeat(0.06), at);

        // ⚠ IT CLEARS; IT NO LONGER FOLDS (15 September 2026). Its destination
        // used to be a point on a clearing ellipse around the diamond — the
        // sentence the reader had just finished becoming the thing that
        // physically held the cards together — and there is no diamond to hold
        // together. So the clause is read where the reader is reading it and
        // then goes, which is what every other clause chain on this page does.
        //
        // That retired the worst arithmetic in the section, and it is worth
        // recording why rather than just deleting it: the fold had to cross
        // from the paragraph's coordinate space into the loop's, because every
        // clause is absolute at the same origin. Getting it wrong stacked all
        // three on the left of the screen on top of each other, and getting
        // the radius wrong landed them underneath the photographs they named
        // (both 12 September 2026). Neither failure has anywhere left to
        // happen.
        //
        // It goes on the same mark the fold used, so the rhythm the section
        // was tuned to is untouched — a clause still stands for `CLAUSE_FOLD`
        // of the read before it leaves.
        tl.to(
          clause,
          { autoAlpha: 0, duration: 0.05, ease: EASE.country },
          at + CLAUSE_FOLD,
        );
      });

      // ---- the cards ----------------------------------------------------
      /* Each card still arrives AFTER the clause that names it, and that is
         the half of the old sequence worth keeping: it is the accumulation the
         grammar row is named for, and it is what still builds the section's
         claim rather than asserting it. The fourth arrives with no clause of
         its own, as it always did.
         ⚠ WHAT LEFT: the seating onto the spiral, its `catch` overshoot, the
         `clip-path` that closed the card's foot behind its own body, and the
         quarter-turn orbit. All four were one mechanism — fitting four WHOLE
         cards onto a ring — and the user's direction removes its premise
         ("no need to shrink"). `catch` is not lost to the site; the F9 ledger
         still budgets it at §09's doors. */
      slots.forEach((slot, i) => {
        const base4 = CLAUSE_AT + i * STEP;
        const arrives = base4 + CARD_IN;

        tl.to(
          slot,
          { opacity: 1, pointerEvents: "auto", duration: 0.02, ease: "none" },
          arrives,
        );
        /* It rises the last few pixels into place on a custom property rather
           than on `y`, because about.css owns this element's transform — the
           law this very section taught the page. A whole card arriving whole
           is the entire beat now, so `settle`'s own 16px-and-a-fade shape is
           what it borrows. */
        tl.fromTo(
          slot,
          { "--ab4-in": 18 },
          { "--ab4-in": 0, duration: 0.06, ease: EASE.country },
          arrives,
        );
      });

      // ---- the row travels ------------------------------------------------
      /* ⚠ A CAROUSEL, NOT A TURN — user direction, 15 September 2026 ("scroll
         carousel to the left upon scrolling"), with the homepage Pathways rail
         named as the style. One `x` on the track, over the WINDOW THE ORBIT
         USED (`CLAUSE_AT + CARD_SEAT` for .56), so the section's pacing is
         inherited rather than re-tuned: the row begins walking as the first
         card finishes being read and stops at the empty hold.

         ⚠ ONE TWEEN, ONE ELEMENT, ONE PROPERTY, and on this page that is a law
         — §04 is where it was learned. Nothing else writes the track's
         transform, so there is no `quickSetter` cache to lose and nothing for a
         later tween to clobber. A single scrubbed value also means the row
         retraces EXACTLY on the way back up, the contract every held screen on
         this page keeps.

         `ease: "none"` is Pathways' own and it is right for a rail: an eased
         carousel stands still through the first third of the reader's scroll
         and then lurches, which reads as broken rather than eased — the same
         argument §03's grammar row makes about the rising front.

         The travel is a FUNCTION, so GSAP evaluates it at build and again on
         every `invalidate`/refresh; a row that fits its window returns 0 and
         the tween is a no-op that still occupies its place in the timeline. */
      const track = q(root, "[data-ab4-track]");
      if (track) {
        tl.to(
          track,
          { x: travelFor, duration: 0.56, ease: "none" },
          CLAUSE_AT + CARD_SEAT,
        );
      }

      // ---- the subtext belongs to the card in the middle -----------------
      /* ⚠ THE REPORTED FIX (user direction, 15 September 2026: "make the
         subtext that appears only appear in the middle right next to the cards
         that refer to it"). A card's body and its verb-led label come up to
         FULL strength while that card is at the mask's CENTRE, and "the
         centre" is DERIVED — from that card's own distance to the middle of
         the window, in pitches — rather than taken from an index. That is what
         makes the emphasis on screen always follow the card in front of the
         reader, and what makes it walk along the row as the row travels; an
         index-based rule emphasises the wrong card the moment the travel is
         anything but a whole number of pitches.

         ⚠ IT IS AN EMPHASIS, NOT A SWITCH, and that correction is the user's
         (same day: "why are the original descriptions lost inside the
         cards?"). Off the middle a body rests at `BODY_REST`, not at 0 — every
         description stays legible and no card is ever an empty coloured slab.
         The note on that constant carries the argument.

         Under the diamond this copy was deleted outright when its card seated,
         because at seat scale it measured about 8px. Nothing is shrunk now, so
         nothing has to be given up at all. */
      const bodySetters = bodies.map((b) =>
        b ? (gsap.quickSetter(b, "--ab4-o") as (v: number) => void) : null,
      );
      /* ⚠ EVERY BOX IS MEASURED HERE, AT BUILD, AND NOTHING IS MEASURED ON A
         TICK. The first cut of this read `loop.getBoundingClientRect()` inside
         the per-card loop, which is a forced layout per card per frame — four
         of them, three times a frame, for two numbers that only change when the
         window does. These are the same two the travel uses. */
      const loopLeft = loop.getBoundingClientRect().left;
      const gutter = parseFloat(getComputedStyle(loop).paddingLeft) || 0;
      // Each card's centre at rest, measured from the mask's own left edge.
      const cardCentre = slotBox.map(
        (b) => b.left - loopLeft + b.width / 2,
      );
      // The middle of the window the row is read through.
      const windowCentre = gutter + (loop.clientWidth - gutter) / 2;

      const litFor = (x: number) => {
        slots.forEach((_, i) => {
          // Where this card has got to, in pitches from the middle.
          const d = Math.abs(cardCentre[i] + x - windowCentre) / pitch;
          const u =
            d <= BODY_FLAT
              ? 1
              : d >= BODY_FADE
                ? 0
                : 1 - (d - BODY_FLAT) / (BODY_FADE - BODY_FLAT);
          /* Smoothstepped, so a body neither snaps on nor creeps in — and
             lifted off a FLOOR rather than run to zero. See `BODY_REST`: a
             card off the middle is quieter than the one being read, never
             blank. */
          const s = u * u * (3 - 2 * u);
          bodySetters[i]?.(BODY_REST + (1 - BODY_REST) * s);
        });
      };
      /* It is driven by the SAME cursor the travel is, on a plain object, so
         the two cannot drift: one clock, and the lit card is a pure function of
         where the row has got to. */
      const cursor = { x: 0 };
      litFor(0);
      tl.to(
        cursor,
        {
          x: travelFor,
          duration: 0.56,
          ease: "none",
          onUpdate: () => litFor(cursor.x),
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
      /* ⚠ THE 0.16 CONTRACTION IS GONE AND THE FADE STAYS (15 September 2026).
         Shrinking the whole block about its centre WAS the loop closing — the
         figure the section's claim rested on, collapsing into §05's first
         bullet. A ROW does not close; a row of four cards contracting to a dot
         reads as the layout being dragged off rather than as anything handing
         over, which is the same objection the 12 September note records against
         travelling it to a corner. So what is left is the departure that note
         actually argued for: the screen empties on the same curve as the
         clauses, into §05's ground, instead of posting something into it.

         The `scale` had one other job and it is worth naming because it is now
         done differently: it guaranteed nothing of §04 was still painting when
         the roasted front had passed. `autoAlpha` ends at 0, which does that
         on its own, and it leaves `x` — the travel's property, on the track
         inside — untouched, so the reverse scrub retraces cleanly instead of
         unwinding a scale and a translate against each other. */
      tl.to(
        loop,
        {
          autoAlpha: 0,
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
 *   [data-ab6-future]               the Elder Advisory Group sentence
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
      // ⚠ `future` IS THE PARAGRAPH ITSELF, and it has to be listed here by
      // name. This used to hide `[data-ab6-unsettled]`, the wrapper the two
      // chromatic ghosts lived in. When the ghosts came off on 13 September
      // 2026 the wrapper went with them, `q()` returned null, and the sentence
      // was left out of the pre-hide entirely — so it stood on the screen from
      // the first frame instead of arriving on its beat (reported the same
      // day). Removing a decoration took its hiding place with it.
      const hidden = [heading, ...facts, future, date, body].filter(
        Boolean,
      ) as HTMLElement[];
      gsap.set(hidden, { autoAlpha: 0 });
      if (cta) hideReachable(cta);
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
      // ⚠ OPACITY, NOT `autoAlpha`, because the governance link lives in
      // here: `visibility` inherits, so gating this part with it took the one
      // focusable element in §06 out of the tab order along with the dots. See
      // `hideReachable`.
      hideReachable(calendarPart);

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
      /* ⚠ .11 APART, NOT .07 (user direction, 14 September 2026 — the same
         pass that widened §02's facts and §03's closing pair). At .07 these two
         sentences were tied with §02's facts as the narrowest reading beats on
         the page: 126px of a 200vh read to take in how the board is made up
         before the next sentence replaced it.
         The room comes from below, not from the reader — part 1's clear, the
         thread's draw and everything after it all move back with these, and the
         trailing rest gives up .05 of the hold it was spending on a finished
         calendar. Nothing that is read lost any of its own time. */
      facts.forEach((fact, i) => {
        const at = [0.12, 0.23][i] ?? 0.23;
        tl.set(fact, { autoAlpha: 1 }, at);
        tl.settle(fact, lineBeat(0.045), at);
      });
      if (factRule) {
        tl.to(factRule, { scaleX: 1, duration: 0.035, ease: EASE.country }, 0.31);
      }
      if (future) {
        tl.set(future, { autoAlpha: 1 }, 0.35);
        tl.settle(future, lineBeat(0.05), 0.35);
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
        0.48,
      );

      /* ---- part 2 · the thread acquires a date ---------------------------
         Clip, do not scale. Since 11 September 2026 the thread is the dotted
         wave (`thread-dots`), not a 2px bar, and `scaleX` would stretch every
         dot into a growing ellipse as the rule drew. A `clip-path` inset is the
         same edge travelling across held geometry that Wonder's itinerary rule
         uses, and it leaves the dots their own shape. Pace and curve unchanged
         from the viewport-triggered original. */
      const DRAW_AT = 0.57;
      const DRAW_FOR = 0.2;
      // Part 1 is gone by .54; the gate opens on the bare screen between them.
      tl.set(calendarPart, { opacity: 1, pointerEvents: "auto" }, 0.55);
      tl.to(
        rule,
        { clipPath: "inset(0 0% 0 0)", duration: DRAW_FOR, ease: EASE.machine },
        DRAW_AT,
      );

      if (date) quietly(tl, date, 0.78, 0.035);
      if (body) {
        tl.set(body, { autoAlpha: 1 }, 0.81);
        tl.settle(body, lineBeat(0.05), 0.81);
      }
      if (hairline) {
        tl.to(hairline, { scaleX: 1, duration: 0.03, ease: EASE.country }, 0.87);
      }
      if (cta) quietly(tl, cta, 0.89, 0.03);

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
      tl.to({}, { duration: 0.08 }, 0.92);
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
 * "The people", held, as a row of four squares that carousels.
 *
 * Grammar rows: "the page holding its ground, the interior scrub without a read
 * clock", "the world opening, one face at a time" — as amended on 15 September
 * 2026, "About §07 squared". User direction, 12 September 2026, replacing the
 * static three-column row; rebuilt 15 September 2026, replacing the walk.
 *
 * The header arrives in reading order and then STANDS for the whole section,
 * like §05's and §06's. Underneath it the roster is one row of equal SQUARES,
 * four to the column, and the reader's scroll travels the row left.
 *
 * ⚠ NOTHING ON THIS RAIL CHANGES SIZE — user direction, 15 September 2026
 * ("four cards in a row, no shrinking"). What went with the scale went because
 * it only ever existed to survive the scale: the plate's `transform-origin:
 * bottom center`, which kept a growing plate from shoving the name under it
 * down, and the stand-in marker's counter-scale, which kept a label legible on
 * a shrinking card. A `frame`-grade portrait of an identifiable person now
 * cannot be re-proportioned by its own motion by construction rather than by a
 * rule.
 *
 * ⚠ CONTINUOUS, NOT STEPPED. There is no snap and no index: the travel is a
 * real number of card widths and every caption's legibility falls off smoothly
 * from the rail's centre, so the rail retraces exactly on the way back — the
 * contract the five held screens before this one keep, and the reason none of
 * them needed a played-once guard the way §06's dots did.
 *
 * ⚠ THE GEOMETRY IS IN CSS AND THIS MEASURES NOTHING. It writes ONE unitless
 * number to the track (`--ab7-travel`, in card widths) and one per caption
 * (`--ab7-o`), and nothing at all per frame — the cards are in flex flow, so
 * their places are the stylesheet's arithmetic. A rail that read `offsetWidth`
 * every tick would be a layout read three times a frame for a number that only
 * changes when the window does.
 *
 * ⚠ THE TRAVEL AND THE LEGIBILITY ARE ON DIFFERENT ELEMENTS ON PURPOSE. §04
 * proved that several `quickSetter`s on one element's transform do not compose
 * — `scale` silently stayed at 1 for its whole sequence. The track takes the
 * travel, each label takes its own opacity, so every element has exactly one
 * property and nothing can be clobbered.
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
 *   [data-ab7-track]       the row; takes the travel, and nothing else
 *   [data-ab7-frame] ×n      one per person; in flow, a quarter of the column
 *   [data-ab7-plate]           the square picture; static
 *   [data-ab7-label]           the name and role; takes the opacity
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

      // ⚠ NO `plates` ANY MORE. It existed to hand every plate a `--ab7-s`
      // setter, and nothing on this rail scales since 15 September 2026.
      const track = q(root, "[data-ab7-track]");
      const labels = frames.map((f) => q(f, "[data-ab7-label]"));

      // Rest state is the finished document, so everything the sequence brings
      // on is hidden here rather than in the markup. A mask is not a hiding
      // place — `settle` splits with `autoSplit` and a re-split orphans the
      // tween's line nodes, annotated at `freshSplit`, bitten twice.
      const hidden = [claim, body].filter(Boolean) as HTMLElement[];
      gsap.set(hidden, { autoAlpha: 0 });
      gsap.set(frames, { autoAlpha: 0 });
      if (cta) hideReachable(cta);

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
      // The cards arrive where the carousel will find them — the row already
      // laid out and already centred in the column — so the travel begins on a
      // row that is standing rather than on one still assembling itself.
      /* ⚠ THE RISE IS A CUSTOM PROPERTY, NOT `y`, AND THAT IS NOT A STYLE
         CHOICE. A card's own transform is written by the STYLESHEET from
         `--ab7-in`; GSAP's `y` would write an inline `transform` of its own,
         which does not merge with it — it replaces it. Measured on the walked
         rail this replaces: with `y` here, every frame's travel silently froze
         at whatever the stylesheet held when the tween first rendered, and the
         whole rail scaled in place without ever moving (12 September 2026). The
         numbers looked perfect, which is why it only showed up on screen. The
         travel has since moved to the track, so the clobber would now be the
         rise against nothing — but the law is the same one §04 states from the
         other side ("no tween ever writes `transform` to a slot, so nothing can
         be clobbered by a later one"), it is what keeps the track's single
         property single, and it costs nothing to keep. */
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

      // ---- the carousel --------------------------------------------------
      /* ⚠ A CAROUSEL, NOT A WALK — 15 September 2026, user direction: "four
         cards in a row, no shrinking, and a carousel that scrolls left as the
         reader scrolls". What this replaces walked a FOCUS along the row and
         grew whichever plate it landed on to ×2.3, writing two numbers per
         frame every tick. The row now holds four equal squares and the whole
         TRACK travels left; nothing changes size, so the only per-frame numbers
         left are the travel itself and one opacity per caption.

         ⚠ IT IS STILL ONE SCRUBBED CURSOR, and that is the contract rather than
         a leftover. A scrub maps the reader's position onto the timeline in
         both directions, so a rail derived from a single tweened value retraces
         EXACTLY on the way back up — which is why none of the six held screens
         needs a played-once guard the way §06's dots did. Anything that
         advanced the carousel by its own arithmetic would not come back.

         ⚠ AND IT IS STILL ONE PROPERTY PER ELEMENT. The track takes the travel
         and nothing else writes the track's transform; each label takes its own
         opacity. §04 proved that several setters on one element's transform do
         not compose — `scale` silently stayed at 1 for a whole sequence — and
         the walked rail carried the same note from the other side. The
         stylesheet composes; the module writes variables. */
      const RAIL_AT = 0.3;
      const RAIL_FOR = 0.56;

      /** How many cards the column holds. Mirrors the quarter in about.css. */
      const ACROSS = 4;
      /* ⚠ `max(0, cards − 4)` IS THE WHOLE TRAVEL RULE, and it is why this is
         safe to ship against today's roster of two. A row that fits the column
         travels ZERO pitches and stands centred; the moment a fifth face is
         added the same code walks it one pitch, and a sixth, two. There is no
         branch and no second layout — adding a face is a content change. */
      const TRAVEL = Math.max(0, frames.length - ACROSS);
      const onScreen = Math.min(frames.length, ACROSS);

      const travelTo = track
        ? (gsap.quickSetter(track, "--ab7-travel") as Setter)
        : null;
      const o = labels.map((l) =>
        l ? (gsap.quickSetter(l, "--ab7-o") as Setter) : null,
      );

      /* The caption of the card in the middle is the one that is legible, and
         "the middle" is derived rather than indexed — `(onScreen − 1) / 2`
         is the centre of the cards actually on screen, in card widths, and the
         travel slides it along the roster. With two faces centred in the column
         the centre is 0.5 and both captions are lit, because both cards ARE in
         the middle; with four it is 1.5 and the two inner captions are lit;
         with five it walks from 1.5 to 2.5 as the row travels. An index-based
         rule gets all three of those wrong. */
      const walk = (travel: number) => {
        const centre = (onScreen - 1) / 2 + travel;
        frames.forEach((_, i) => {
          const d = Math.abs(i - centre);
          const u =
            d <= CAPTION_FLAT
              ? 1
              : d >= CAPTION_FADE
                ? 0
                : 1 - (d - CAPTION_FLAT) / (CAPTION_FADE - CAPTION_FLAT);
          // Smoothstepped, so a caption neither snaps on nor creeps in.
          o[i]?.(u * u * (3 - 2 * u));
        });
        travelTo?.(travel);
      };
      walk(0);

      // One tween on a plain object, so the carousel is a single scrubbed value
      // and every number on the rail is derived from it — n cards cannot drift
      // out of step with each other if there is only one clock. It runs even
      // when `TRAVEL` is 0: the beat still belongs to the rail, the captions
      // are already lit by `walk(0)`, and the timeline's shape does not change
      // with the length of the roster.
      const cursor = { travel: 0 };
      tl.to(
        cursor,
        {
          travel: TRAVEL,
          duration: RAIL_FOR,
          ease: "none",
          onUpdate: () => walk(cursor.travel),
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

/* How near the rail's centre a card has to be for its caption to be fully
   legible, and how far out it goes dark — both in card widths. ¾ and 1½ are
   the numbers a four-up row asks for: the two inner cards sit exactly 0.5 from
   the centre and are flat-on, the two outer ones sit exactly 1.5 and are flat-
   off, and nothing in between is left half-lit by arithmetic. Grammar row: "the
   world opening, one face at a time", as amended 15 September 2026. */
const CAPTION_FLAT = 0.75;
const CAPTION_FADE = 1.5;

/* §04's twin of the pair above: how near the mask's centre a card has to be
   for its SUBTEXT to be fully legible, and how far out it goes dark — both in
   card pitches. Grammar row: "accumulating, About §04's four stand in a ROW
   that travels", 15 September 2026.

   ⚠ MUCH TIGHTER THAN §07's, AND HALF A PITCH IS THE WHOLE ARGUMENT. Card
   centres are exactly one pitch apart, so a threshold of half a pitch can
   contain AT MOST ONE CARD — which is precisely the instruction ("only appear
   in the middle"). §07's ¾-and-1½ is right for §07 because its four square
   plates divide the column and two genuinely share the middle, and a name is a
   short label two of which can be read at once. A body here is a paragraph and
   a verb-led link: two lit at once is two things asking to be read, which is
   the defect being fixed.
   Measured first at 0.5/1.15, which lit two — with a 1340px window and a 408px
   pitch the centre falls BETWEEN two cards, so the nearer read 1.0 and its
   neighbour 0.63. Geometry, not tuning: no pair of thresholds wider than half
   a pitch can light one card on a row whose centre is not on a card. 0.2 flat
   keeps a card fully lit while it is the middle one and hands over through a
   brief dark crossing rather than through a dissolve of two paragraphs. */
const BODY_FLAT = 0.2;
const BODY_FADE = 0.5;

/* ⚠ WHAT A CARD OFF THE MIDDLE KEEPS, AND IT IS NOT ZERO (user report,
   15 September 2026: "why are the original descriptions lost inside the
   cards?").

   The first cut of this ran the thresholds above all the way to 0, on a
   literal reading of "only appear in the middle". It worked and it was wrong,
   for two reasons the report makes obvious the moment it is on screen:

     · Three of the four cards became empty coloured slabs — a title on a
       440px block of evergreen with nothing under it. The copy was still in
       the document and still in the accessible tree, so nothing was LOST, but
       the sighted desktop reader could not see three quarters of the section.
     · It argued against the headline. This section's claim is "Four things,
       and they hold each other up", and a build that shows one description at
       a time says the opposite of that.

   So the middle card is EMPHASISED rather than the others ERASED: every
   description is legible at all times, and the one in the middle comes up to
   full. 0.55 against `text-canvas/86` on these four grounds is quiet and still
   comfortably readable — measured on evergreen, roasted, charcoal and navy,
   which are the four the cards use. This is the number to move if the emphasis
   wants to be stronger or softer; 1 here turns the emphasis off entirely and
   leaves a plain row, which is also a legitimate answer. */
const BODY_REST = 0.55;

type Setter = (value: number) => void;

/* -------------------------------------------------------------------------
   §08 — thePartners · type ⚡2 · seam 07 → 08, and the register filling
   ------------------------------------------------------------------------- */

/**
 * "Dots / Rule only, no ground change — the rule, and nothing else", and then
 * the register fills a column at a time.
 *
 * Grammar row: "accumulating, the register fills a column at a time". User
 * direction, 12 September 2026, replacing `partnersDots`' three independent
 * per-rule viewport triggers.
 *
 * The three groups arrive TOGETHER — rule and title — and then the names fill
 * in by ROUND: the first partner of every group, then the second of every
 * group, and so on. The three lists advance in step rather than one completing
 * before the next begins, because the section's claim is three kinds of partner
 * held at the same time and a register that filled one column to the bottom
 * first would say the opposite. The groups are 4, 3 and 2 long, so there are
 * four rounds and the shorter groups simply stop.
 *
 * ⚠ THIS IS THE ONE INTERIOR ON THE PAGE THAT SCROLLS WHILE IT PLAYS. §02–§07
 * are held screens; §08 is not, and deliberately (user decision, 12 September
 * 2026): its names are 30px type and nothing in the section is sized in `svh`,
 * so holding it would have meant shrinking the frame's own type to clear the
 * 820px floor the other six are built to. Nothing here needs a still stage —
 * all three groups are on screen together and the names simply fill in.
 *
 * ⚠ AND THAT IS WHY THE TIMELINE IS HAND-ROLLED ON THE BLOCK. `composition()`'s
 * own timeline runs `trigger: root, start: "top top"`, which on an unpinned
 * 175vh section is still running long after the groups have left the top of the
 * screen — the last round would play to nobody. Triggering on the block's own
 * passage bounds the scrub to the window in which a reader can actually see it,
 * at every viewport height. Same precedent as the seams in this file, which are
 * hand-rolled inside `build` for the same structural reason.
 *
 * ⚠ A SEPARATOR BELONGS TO THE ROUND THAT BRINGS THE NAME AFTER IT. The middot
 * lives inside the item it follows, so revealing it with its own name shows
 * "QUT ·" pointing at nothing for a whole round. Sections.tsx stamps it with
 * `n + 1`; this reads the number and never has to know the rule.
 *
 * Markup:
 *   [data-ab8-groups]           the block the scrub is anchored on
 *   [data-artwork="dots-rule"]  each group's rule — clip-drawn, all together
 *   [data-ab8-title]            each group's name
 *   [data-ab8-name]             a partner, carrying `data-ab8-round`
 *   [data-ab8-sep]              the middot, carrying the NEXT round's number
 *   [data-arrive]               the header block
 */
export function thePartners(root: HTMLElement, span = 200): MotionModule {
  return composition("thePartners", root, {
    // The ledger's ⚡2 — the page's quiet type screen. Nothing in the LOUD table
    // is used, so the assertion passes and this stays as quiet as it is scored.
    // (`partnersDots` declared "none", which contradicted the ledger row.)
    channel: "type",
    span,
    /* ⚠ THIS USED TO DECLARE ITS OWN 1280px FLOOR, and no longer needs to. Nothing in §08 is sized in `svh` — the names are 30px and the
       heading 3.5rem — so its height is a function of WIDTH, not of the window.
       Measured: the column is 803px at 1440, 920 at 1280 and 1056 at 1024,
       because the heading goes from two lines to three and every group's list
       wraps to two. Tightened it stands at 1280 and at 1440; at 1024 it does not
       stand on any laptop screen, and the only ways to make it would be to
       shrink the frame's own type or to drop copy. Below 1280 this is the
       complete flow document, the same fallback the other six take below theirs.
       about.css carries the identical pair and says so. */
    minWidth: "1024px",
    minHeight: "640px",
    uses: ["settle", "arrive"],
    build: (tl) => {
      const claim = q(root, "[data-ab8-claim]");
      const lede = q(root, "[data-ab8-lede]");
      const cta = q(root, "[data-ab8-cta]");
      const rules = qa(root, '[data-artwork="dots-rule"]');
      const titles = qa(root, "[data-ab8-title]");
      const marks = qa(root, "[data-ab8-name], [data-ab8-sep]");
      if (!marks.length) return;

      root.dataset.abHeld = "true";

      // Rest state is the finished register, so everything the rounds bring on
      // is hidden here rather than in the markup — the flow document, the
      // reduced-motion cut and the JavaScript-off page are all complete.
      //
      // ⚠ THE TITLES TAKE THE SAME CLIP AS THE RULES, not a fade. "Both lines
      // and text should be synced as it reveal" (user, 12 September 2026): a
      // rule that wipes left to right beside a title that fades in place are two
      // different gestures happening at the same time, which is not the same
      // thing as one gesture. Given the same `clip-path` inset, the same start
      // and the same duration, the line and its name wipe on together as one
      // edge travelling across both.
      gsap.set([...rules, ...titles], { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(marks, { autoAlpha: 0 });
      gsap.set([claim, lede].filter(Boolean) as HTMLElement[], {
        autoAlpha: 0,
      });
      if (cta) hideReachable(cta);

      const rounds = marks.reduce(
        (n, el) => Math.max(n, Number(el.dataset.ab8Round ?? 0) + 1),
        0,
      );

      // ---- the header, in reading order ---------------------------------
      if (claim) {
        tl.set(claim, { autoAlpha: 1 }, 0.02);
        tl.settle(claim, lineBeat(0.055), 0.02);
      }
      if (lede) {
        tl.set(lede, { autoAlpha: 1 }, 0.1);
        tl.settle(lede, lineBeat(0.05), 0.1);
      }

      // ---- the groups arrive, together ----------------------------------
      /* "Research, government and land, and industry and community all appears
         at once" — so all six elements share one tween: three rules and three
         titles, same start, same duration, same curve, no stagger anywhere.
         Every line grows with every other and each name grows with its own line.

         ⚠ .16 OF THE READ, WHICH IS ~290px — MORE THAN TWICE THE FIRST CUT.
         That one drew the rules over .12 and faded the titles over .04 on an
         unheld section, so on screen it was a flicker ("too fast, slow it
         down", 12 September 2026). Held, there is room for the wipe to be read
         as a wipe. */
      tl.to(
        [...rules, ...titles],
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.16, ease: EASE.country },
        0.18,
      );

      // ---- the rounds ----------------------------------------------------
      // Every element carrying round n comes on together, whichever group it
      // belongs to. Written against the data attribute rather than against the
      // group arrays so adding a partner in src/content/about.ts needs no
      // change here — the round count is derived above.
      // ⚠ .09 AND .12 APART, roughly double the first cut's .05 and its .18 of
      // an unheld read. On a 200vh read that is ~160px for a round to arrive and
      // ~216px between rounds — a wheel notch or two apiece, on a screen that is
      // not itself moving.
      const ROUND_AT = 0.38;
      const ROUND_EVERY = 0.12;
      for (let n = 0; n < rounds; n += 1) {
        const set = marks.filter((el) => Number(el.dataset.ab8Round) === n);
        if (!set.length) continue;
        tl.fromTo(
          set,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.09,
            ease: EASE.country,
          },
          ROUND_AT + n * ROUND_EVERY,
        );
      }

      if (cta) quietly(tl, cta, 0.86, 0.04);

      /* ⚠ A TRAILING REST HAS TO HOLD THE CLOCK OPEN, or it is not a rest at
         all — it is every earlier beat played late. A scrub maps the reader's
         0 → 1 onto 0 → `tl.duration()`, and the duration is wherever the LAST
         tween ends; §05 was measured playing its beats at .93 of the read
         before this was understood (12 September 2026). The last round here
         lands at .76 + .05 and the register is then simply readable, which is
         the point of a register. */
      tl.to({}, { duration: 0.1 }, 0.9);
    },
    enter: arrivals,
    cut: (el) => {
      delete el.dataset.abHeld;
      clearAll(el);
    },
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
