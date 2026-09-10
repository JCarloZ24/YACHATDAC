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

/** Every tier is the same 16:9 film at a different width. */
const TIER_WIDTHS = { small: 960, medium: 1440, large: 1920 } as const;
const SOURCE_ASPECT = 16 / 9;

/**
 * Which encode, decided once BEFORE the element has a source, so the browser
 * never starts one download and abandons it for another.
 *
 * ⚠ NOT `innerWidth` (August, 11 September 2026: "fix the video quality just
 * like what we did on Wonder"). This is HeroVideo.tsx's `neededWidth` logic,
 * moved here for the same reason it was written there — the cover is
 * `inset-0` under `object-cover`, and cover scales the frame until the SHORT
 * axis fills, so in a portrait box the HEIGHT drives the magnification and
 * the sides are cropped away. On a 390 x 844 phone the 16:9 frame is blown up
 * to 1444 CSS px wide to make its height reach 844, and only the middle 27%
 * is on screen. The old two-tier picker read `innerWidth`, measured ~390, and
 * handed that phone the 960 file: a 4.7x upscale at DPR 3, which is the blur,
 * and nothing to do with the encode.
 *
 * DPR is clamped at 2 — past that the file needed grows faster than any
 * benefit a 6in screen can show — and where the ask is unreachable (every
 * portrait phone asks for ~3000px and the widest encode is 1920) the honest
 * target is the box's own width. Wonder's comment carries the full argument;
 * do not re-derive it, and do not chase a width no tier can reach.
 */
function pickTier(cover: HTMLElement): string {
  const { tiers } = homeLoaderFilm;
  if (slowLink()) return tiers.small;

  const box = cover.getBoundingClientRect();
  const w = box.width || window.innerWidth;
  const h = box.height || window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const needed = Math.max(w, h * SOURCE_ASPECT) * dpr;

  const c = (navigator as Navigator & { connection?: Connection }).connection;
  const fast = c?.downlink === undefined || c.downlink >= 5;

  const target = needed > TIER_WIDTHS.large ? w * dpr : needed;
  if (target <= TIER_WIDTHS.small) return tiers.small;
  if (target <= TIER_WIDTHS.medium || !fast) return tiers.medium;
  return tiers.large;
}

/**
 * SOUND — user direction, 11 September 2026: "sound should be on by default,
 * but provide the sound off option right away."
 *
 * Both halves of that are load-bearing and they pull against each other.
 * Browsers refuse to autoplay audible video until the visitor has interacted
 * with the page, so "on by default" cannot be a promise — it can only be an
 * ATTEMPT, made first, with a silent fallback that keeps the film running.
 * Wonder solved the same problem the other way round (silent always, sound on
 * request) because its film opens under a headline someone is reading; this
 * one IS the page, so it asks.
 *
 * The order matters: unmuted `play()` is tried first, and only its rejection
 * turns `muted` on and retries. Doing it the safe way round — start muted,
 * unmute after — is what produces the audible pop everyone has heard on
 * badly-behaved sites, and on a policy-blocked browser it would leave the
 * element muted anyway. So the fallback costs nothing where it is not needed.
 *
 * The ceiling is Wonder's `SOUND_MAX`, and for Wonder's reason: this is a bed
 * under an interface, and the visitor's own system volume takes it from there.
 */
const SOUND_MAX = 0.8;
/** Long enough to be a fade rather than a switch; short enough to be under
 *  the first bar. Wonder's fade-in is 220ms because its opening guitar scale
 *  is the quietest passage in the file and a long ramp fell on top of it;
 *  this bed opens at level, so it gets an ordinary one. */
const FADE_IN_MS = 400;
const FADE_OUT_MS = 600;

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
      const soundButton = cover.querySelector<HTMLButtonElement>("[data-loader-sound]");

      let finished = false;
      let opened = false;
      let timeline: gsap.core.Timeline | undefined;
      let frame = 0;
      let ramp: gsap.core.Tween | undefined;

      /* ── Sound ─────────────────────────────────────────────────────────
         A rAF volume ramp rather than a GSAP tween, copied in shape from
         HeroVideo.tsx. It is deliberately NOT inside the gsap.context below:
         audio level is not motion, it must survive `prefersReduced` having
         nothing to do with it, and one raw frame handle means a quick
         on/off/on cancels whichever ramp is still running instead of
         stacking two. */
      let fadeFrame: number | null = null;
      /** What the control CLAIMS, which is not always what the element does —
       *  a browser can refuse audible autoplay after we have asked for it. */
      let soundOn = false;

      const cancelFade = () => {
        if (fadeFrame !== null) window.cancelAnimationFrame(fadeFrame);
        fadeFrame = null;
      };

      const rampVolume = (target: number, done?: () => void) => {
        if (!video) return;
        cancelFade();
        const from = video.volume;
        // Clamped to the ceiling as well as to 0-1, so no caller can reach
        // full scale by passing 1.
        const to = Math.min(SOUND_MAX, Math.max(0, target));
        const ms = to > from ? FADE_IN_MS : FADE_OUT_MS;
        // rAF's timestamp can precede performance.now() by a frame, so the
        // fraction is clamped at both ends — a negative k throws IndexSizeError.
        const started = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, Math.max(0, (now - started) / ms));
          video.volume = Math.min(1, Math.max(0, from + (to - from) * k));
          if (k < 1) {
            fadeFrame = window.requestAnimationFrame(step);
          } else {
            fadeFrame = null;
            done?.();
          }
        };
        fadeFrame = window.requestAnimationFrame(step);
      };

      /** The button's whole appearance is one attribute; the markup draws both
       *  states and CSS shows one. Nothing here reaches into its innards. */
      const showSound = (on: boolean) => {
        soundOn = on;
        soundButton?.toggleAttribute("data-on", on);
        soundButton?.setAttribute("aria-pressed", String(on));
      };

      const setSound = (on: boolean) => {
        if (!video) return;
        if (on) {
          video.volume = 0;
          video.muted = false;
          showSound(true);
          rampVolume(SOUND_MAX);
          // A play() that resolves is the only proof the browser accepted an
          // audible stream; a rejection means the policy said no and the
          // control must go back to telling the truth.
          void video.play().catch(() => {
            video.muted = true;
            showSound(false);
            void video.play().catch(() => {});
          });
          return;
        }
        showSound(false);
        rampVolume(0, () => {
          video.muted = true;
          video.volume = SOUND_MAX;
        });
      };

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
        cancelFade();
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
        // open(), which the stall cap can fire on a film that failed to load;
        // an aborted opening should replay. The Record's loader set its own
        // flag conditionally for exactly that reason, and is the precedent
        // here — it was removed on 11 September 2026 (record-loader.ts), which
        // leaves this the only loading screen on the site and the only place
        // the reasoning still lives.
        markIntroSeen();
        // The sound leaves WITH the picture. Without this the cover faded at
        // full level and finish() cut the bed dead mid-bar, which reads as a
        // fault rather than an exit — the same reason HeroVideo's fade-out is
        // long where its fade-in is not.
        //
        // ⚠ The two durations are TIED, and the tie is why the cover's fade
        // moved from 0.4s to FADE_OUT_MS. finish() calls cancelFade(), so a
        // ramp still running when the tween completes is abandoned wherever
        // it happens to be — a 600ms fade under a 400ms cover would have been
        // cut at a third of level, i.e. the same hard stop this is meant to
        // remove, only quieter. They now land together. Change one and change
        // the other.
        rampVolume(0);
        gsap.to(cover, { opacity: 0, duration: FADE_OUT_MS / 1000, ease: "none", onComplete: finish });
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
        gsap.to(cover.querySelectorAll("[data-loader-art], [data-loader-skip], [data-loader-sound]"),
          { opacity: 1, duration: 0.4, delay: 0.14 });

        skip?.addEventListener("click", () => rampTo100(SKIP_RAMP_S));
        enter?.addEventListener("click", leave);
        soundButton?.addEventListener("click", () => setSound(!soundOn));

        // NOTHING IS FETCHED WHERE NOTHING WILL PLAY. On a data-saver or 2g/3g
        // link the film is the wrong 3 MB to spend, and without the film there
        // is no reason to hold anyone for 39 seconds — so the count travels on
        // its own and the door opens at the old prototype's pace.
        if (!video || slowLink()) {
          // No film means no sound to offer. The control is removed rather
          // than disabled: a dead speaker icon on a screen with no picture is
          // an unanswerable question.
          soundButton?.remove();
          rampTo100(HELD_RAMP_S);
          return;
        }

        video.src = pickTier(cover);
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

        video.addEventListener("error", () => {
          soundButton?.remove();
          rampTo100(HELD_RAMP_S);
        });
        video.addEventListener("playing", () => {
          window.clearTimeout(graceTimer);
          frame = window.requestAnimationFrame(tick);
        }, { once: true });

        // If it has not started by now it is not going to feel like a film.
        graceTimer = window.setTimeout(() => {
          if (!opened && (video.currentTime || 0) <= 0) rampTo100(HELD_RAMP_S);
        }, START_GRACE_MS);

        // SOUND ON BY DEFAULT, and this is the only place it is attempted.
        //
        // Two failures are being told apart here, and conflating them is the
        // bug this shape exists to avoid. An audible `play()` is refused by
        // every browser that has not seen an interaction yet — that is the
        // COMMON case, it says nothing about the film, and it must fall back
        // to a muted pass, not to the no-film ramp. Only when the muted retry
        // also fails is autoplay genuinely off (a policy, an extension, a
        // codec), and that rejection is the signal to stop waiting.
        //
        // `showSound(true)` before the attempt so the control is honest during
        // the round trip and corrects itself on rejection; `video.volume` is
        // raised by the ramp, not set here, so an accepted stream still fades
        // in rather than starting at level.
        video.volume = 0;
        video.muted = false;
        showSound(true);
        rampVolume(SOUND_MAX);
        void video.play().catch(() => {
          cancelFade();
          video.muted = true;
          video.volume = SOUND_MAX;
          showSound(false);
          void video.play().catch(() => rampTo100(HELD_RAMP_S));
        });
      }, cover);
    },
    destroy,
  };
}
