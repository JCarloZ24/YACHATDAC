"use client";

import gsap from "gsap";
import { prefersReduced, type MotionModule } from "@/lib/motion-controller";
import { homeLoaderFilm } from "@/content/homepage-media";
import { registerLoading } from "./effects/loading";
import { hasSeenIntro, introForced, markIntroSeen } from "@/lib/intro-gate";
import { DUR, EASE } from "./tokens";

type Connection = { saveData?: boolean; effectiveType?: string; downlink?: number };

/**
 * Is this a link we should not spend megabytes of somebody's data plan on
 * uninvited? Same test HeroVideo.tsx applies, and for the same reason — data
 * saver on, a 2g/3g effective type, or a measured downlink under 1.5 Mb/s.
 * Safari and Firefox do not implement the API and always answer no.
 */
function slowLink(): boolean {
  const c = (navigator as Navigator & { connection?: Connection }).connection;
  return (
    c?.saveData === true ||
    /(^|-)(2g|3g)$/.test(c?.effectiveType ?? "") ||
    (c?.downlink !== undefined && c.downlink < 1.5)
  );
}

/** Which encode, decided once BEFORE the element has a source, so the browser
 *  never starts one download and abandons it for another. */
function pickTier(): string {
  const px = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  return px >= 1800 ? homeLoaderFilm.tiers.large : homeLoaderFilm.tiers.small;
}

/** How long a stalled film gets before we stop pretending and open the door. */
const START_GRACE_MS = 3000;
const HARD_CAP_MS = (homeLoaderFilm.duration + 15) * 1000;
/** The count still has to travel when there is no film to travel with. */
const HELD_RAMP_S = 1.2;
const SKIP_RAMP_S = 0.4;

/**
 * Home opens — loader lifecycle (F7 / X1 override).
 *
 * ⚠ REWRITTEN 10 September 2026, user direction. The 8 September version ran
 * for one second and then dismissed ITSELF: a GSAP `onComplete` called
 * `finish()`, and a `setTimeout(finish, 1500)` guaranteed it even if the
 * ticker stalled. Both of those would now cut the film off at a second and a
 * half, so both are gone. The cover is dismissed by the reader pressing the
 * blob, and by nothing else except Escape and the hard cap.
 *
 * What did NOT change, deliberately: `cover.hidden = true` is still the only
 * completion signal. home-hero.ts:337 watches exactly that attribute with a
 * MutationObserver and is the sole listener, so inventing a cleaner handoff
 * here would silently strand the hero's opening.
 *
 * Registration belongs to the central controller. Cleanup owns only this
 * cover, its timers and listeners; it must not stop other sections' motion.
 */
export function createHomeLoader(cover: HTMLDivElement): MotionModule {
  let context: gsap.Context | undefined;
  let release: (() => void) | undefined;

  const destroy = () => {
    release?.();
    context?.revert();
    context = undefined;
    release = undefined;
  };

  return {
    init() {
      destroy();
      // A 39-second autoplaying film is the precise thing this preference
      // exists to refuse. No cover, no fetch, no door — straight to the page.
      if (prefersReduced()) {
        cover.hidden = true;
        return;
      }
      // Already been through the door this session (10 September 2026, user
      // direction). The parse-time script in HomeLoader.tsx has normally hidden
      // the cover before this runs — but not on a client-side navigation back
      // to `/`, where React renders that script rather than executing it, so
      // the runtime read is what covers the SPA case.
      //
      // `cover.hidden = true` even though CSS may already have hidden it:
      // home-hero.ts:337 watches THIS attribute to know when to start the
      // hero's opening. It happens to also test computed display (:340), so
      // the CSS route alone would work today — but that would leave the hero's
      // start resting on a line in another file nobody would think to protect.
      if (!introForced() && hasSeenIntro()) {
        cover.hidden = true;
        return;
      }

      cover.hidden = false;
      const root = document.documentElement;
      const previousOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

      const video = cover.querySelector<HTMLVideoElement>("[data-loader-video]");
      const skip = cover.querySelector<HTMLButtonElement>("[data-loader-skip]");
      const enter = cover.querySelector<HTMLButtonElement>("[data-loader-enter]");

      let finished = false;
      let opened = false;
      let timeline: gsap.core.Timeline | undefined;
      let frame = 0;
      let ramp: gsap.core.Tween | undefined;

      /** Scrub the count and the wave to an absolute position. */
      const setProgress = (p: number) => {
        timeline?.progress(Math.max(0, Math.min(1, p)));
      };

      /** Carry the count the rest of the way on the clock, not the film —
       *  used when there is no film, when it errors, and when Skip is
       *  pressed. Tweens a proxy rather than the timeline's own progress, so
       *  the scrub stays the one way this timeline is ever moved. */
      const rampTo100 = (seconds: number) => {
        ramp?.kill();
        const proxy = { p: timeline?.progress() ?? 0 };
        ramp = gsap.to(proxy, {
          p: 1,
          duration: seconds,
          ease: "none",
          onUpdate: () => setProgress(proxy.p),
          onComplete: open,
        });
      };

      /** 100%. The door appears; the film keeps running behind it. */
      const open = () => {
        if (opened || finished) return;
        opened = true;
        setProgress(1);
        cover.setAttribute("aria-valuenow", "100");
        if (skip) {
          gsap.to(skip, { autoAlpha: 0, duration: 0.3, ease: "none" });
          skip.disabled = true;
        }
        if (enter) {
          enter.removeAttribute("aria-hidden");
          enter.tabIndex = 0;
          enter.classList.remove("pointer-events-none");
          // Rises into place rather than appearing in it (user direction).
          // fromTo, not to: the button has been sitting in flow at opacity 0
          // holding its space since the first frame, so there is no implicit
          // start state to read — it has to be stated.
          gsap.fromTo(enter, { opacity: 0, y: 28 }, {
            opacity: 1,
            y: 0,
            duration: DUR.medium,
            ease: EASE.country,
          });
          // ⚠ NOT focused programmatically (user direction, 10 September 2026:
          // "remove the stroke on the blob button"). The stroke WAS the house
          // focus ring — globals.css gives :focus-visible a charcoal outline
          // inside a gold halo with a 2px radius, which is why a rounded
          // rectangle appeared around a blob. Calling focus() here drew it for
          // every reader, mouse users included, on a control nobody had
          // reached for. Keyboard users still get it by tabbing, which is the
          // only time it should be there; Skip disables itself at 100%, so
          // one Tab lands here.
        }
      };

      const finish = () => {
        if (finished) return;
        finished = true;
        ramp?.kill();
        timeline?.kill();
        window.cancelAnimationFrame(frame);
        window.clearTimeout(graceTimer);
        window.clearTimeout(capTimer);
        if (video) {
          video.pause();
          video.removeAttribute("src");
          video.load();
        }
        cover.hidden = true;
        root.style.overflow = previousOverflow;
        window.removeEventListener("keydown", onKey);
        preference.removeEventListener("change", onPreference);
      };

      /** The exit: fade the cover, then hand off. */
      const leave = () => {
        if (finished) return;
        // THE ONLY PLACE the session flag is written. leave() is the one
        // user-driven exit — the blob and Escape both come through here — so
        // it means "you went through the door" and nothing else.
        //
        // Deliberately not finish(), which also runs on unmount and would mark
        // the film seen for a reader who never saw it. Deliberately not
        // open(), which the stall cap can fire on a film that failed to load —
        // The Record sets its own flag conditionally for exactly that reason
        // (record-loader.ts:57), and an aborted opening should replay.
        markIntroSeen();
        gsap.to(cover, { opacity: 0, duration: 0.4, ease: "none", onComplete: finish });
      };

      const onKey = (event: KeyboardEvent) => {
        // ⚠ Tab NO LONGER dismisses. It used to, because there was nothing in
        // here to focus and swallowing Tab would have trapped the reader.
        // There are two buttons now, and Tab must reach them. Escape stays as
        // the way out for anyone who wants no part of the film.
        if (event.key === "Escape") leave();
      };
      const onPreference = () => {
        if (preference.matches) finish();
      };

      release = finish;
      window.addEventListener("keydown", onKey);
      preference.addEventListener("change", onPreference);

      // Hard cap, independent of GSAP and of the film: a paused ticker, a
      // background tab or a half-delivered file must never leave the reader
      // with no way forward. It opens the door — it does not enter for them.
      const capTimer = window.setTimeout(open, HARD_CAP_MS);
      let graceTimer = 0;

      context = gsap.context(() => {
        registerLoading();
        timeline = gsap.effects.homeLoaderFilm(cover) as gsap.core.Timeline;
        // Skip sits OUTSIDE [data-loader-art] now that it has moved to the
        // corner, so it has to be named here or it would never fade up.
        gsap.to(cover.querySelectorAll("[data-loader-art], [data-loader-skip]"),
          { opacity: 1, duration: 0.4, delay: 0.14 });

        skip?.addEventListener("click", () => rampTo100(SKIP_RAMP_S));
        enter?.addEventListener("click", leave);

        // NOTHING IS FETCHED WHERE NOTHING WILL PLAY. On a data-saver or 2g/3g
        // link the film is the wrong 3 MB to spend, and without the film there
        // is no reason to hold anyone for 39 seconds — so the count travels on
        // its own and the door opens at the old prototype's pace.
        if (!video || slowLink()) {
          rampTo100(HELD_RAMP_S);
          return;
        }

        video.src = pickTier();
        gsap.to(video, { opacity: 1, duration: 0.8, ease: "none" });

        // ⚠ The element carries `loop`, so `ended` NEVER FIRES — it seeks back
        // to 0 and carries on. That is the point (no black screen at 39s), but
        // it also removes the signal that the first pass finished, which is
        // what the count is measured against. So the pass is detected here:
        // within a frame of the end, or by currentTime jumping BACKWARDS if a
        // wrap lands between two frames.
        //
        // The end test fires just BEFORE the wrap on purpose. Catching it
        // after would show one frame of the count reset to 0 on its way to
        // 100 — a flicker at exactly the moment the reader is watching it
        // land. Once open() runs this loop returns without rescheduling, so
        // progress is frozen at 100 and every later loop changes nothing:
        // the film keeps running, the button stays put.
        let lastTime = 0;
        const tick = () => {
          if (finished || opened) return;
          const total = video.duration || homeLoaderFilm.duration;
          const t = video.currentTime;
          if (total > 0) {
            if (t >= total - 0.1 || t + 0.5 < lastTime) {
              open();
              return;
            }
            setProgress(t / total);
          }
          lastTime = t;
          frame = window.requestAnimationFrame(tick);
        };

        video.addEventListener("error", () => rampTo100(HELD_RAMP_S));
        video.addEventListener("playing", () => {
          window.clearTimeout(graceTimer);
          frame = window.requestAnimationFrame(tick);
        }, { once: true });

        // If it has not started by now it is not going to feel like a film.
        graceTimer = window.setTimeout(() => {
          if (!opened && (video.currentTime || 0) <= 0) rampTo100(HELD_RAMP_S);
        }, START_GRACE_MS);

        // Autoplay can still be refused (a policy, an extension, a codec);
        // the rejection is the signal to stop waiting for it.
        void video.play().catch(() => rampTo100(HELD_RAMP_S));
      }, cover);
    },
    destroy,
  };
}
