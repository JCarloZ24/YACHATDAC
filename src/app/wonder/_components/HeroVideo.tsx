"use client";

import { useEffect, useRef, useState } from "react";
// Aliased: the play effect below has its own local `start`.
import { register, start as startMotion } from "@/lib/motion-controller";

/**
 * The hero's video fill (Header / 5, 2033:5352) with the one control the
 * frame does not draw: a sound toggle.
 *
 * WHY A TOGGLE. Browsers refuse to autoplay video with sound until the
 * visitor has interacted with the page, so the film cannot open with audio.
 * The compromise (agreed 8 Sep 2026): the hero plays silently on load, as
 * the frame draws it, and one button in the corner unmutes and restarts the
 * film from the top with its supers and sound.
 *
 * `silentFrom` can start the silent loop past the edit's burned-in supers
 * (0–12s: the TURRABURRA card, Suzanne's lower third, the location tag) so
 * they do not sit under our H1. It is 0 today — the call on 8 Sep 2026 was
 * to run the whole film start to end in both states — and stays a prop so
 * the skip is one number away if the supers read badly under the title.
 *
 * REDUCED MOTION. Nothing autoplays; the poster stands as the hero still and
 * the button plays the film, with sound, on request.
 *
 * The poster is frame 0 of the same edit — the aerial dirt road the hi-fi
 * frame's still shows — so the two states read as one piece.
 */
/**
 * THE UNMUTE USED TO STARTLE PEOPLE (August, 10 September 2026).
 *
 * Two causes, and both are fixed — one in the files, one here.
 *
 * The files: all three encodes carried the edit's delivery mix at −17.0 LUFS
 * with a true peak of +0.6 dBFS, i.e. clipping. They are now normalised to
 * −23 LUFS / −5.8 dBFS peak (two-pass `loudnorm`, `linear=true`, so the
 * 6.7 LU range is preserved rather than pumped, the picture stream copied —
 * same 1501 frames, same 60.04s — and the audio taken from the ProRes
 * master's PCM so it is still only one lossy generation). No EQ: the master
 * measures as an ordinary outdoor ambience curve, and tone is the edit's
 * decision, not ours. Anyone re-cutting the film has to normalise the
 * replacement or this comes straight back; the numbers, the band readings
 * and the exact commands are in brand/video/README.md.
 *
 * Here: the ramp climbed to FULL SCALE. A hero film is ambient, not a
 * feature — it plays under a headline while someone reads — so the ceiling
 * is `SOUND_MAX`, and the visitor's own system volume takes it from there.
 */

/**
 * ⚠ THE FADE-IN IS SHORT, AND THAT IS THE POINT (August, 10 September 2026:
 * "I want to hear clearly the scale on guitar without the audio peaking").
 *
 * The film opens on a guitar scale, and measured off the encode that opening
 * is the QUIETEST passage in it — 0–4s peaks at −16 to −23 dBFS against
 * −9 to −11 through the body, some 6–7 dB down. So a long ramp was landing
 * squarely on top of the one deliberate musical moment, fading in over the
 * very thing it should have let through, and there was never any peak to
 * protect against there: the loudest sample in the whole file is −5.8 dBFS,
 * and `SOUND_MAX` pulls that to about −7.7.
 *
 * 220ms is what is left after removing the part that did harm. It exists
 * only to stop an instant unmute clicking — a DC step into an open output —
 * and is over before the first note has finished sounding.
 *
 * The fade OUT stays long. Nothing is lost by it: the level is on its way to
 * zero, and a film that cuts dead reads as a fault.
 */
const FADE_IN_MS = 220;
const FADE_OUT_MS = 600;
/** The loudest the film is ever played at. Never ramp to 1. */
const SOUND_MAX = 0.8;

export type HeroTiers = {
  small: string;
  medium: string;
  large: string;
  /**
   * A cut FRAMED FOR PORTRAIT, for phones. Optional, and absent today.
   *
   * A 16:9 film full-bleed in a portrait phone is magnified 3.7× by
   * `object-cover` and shows the middle 27% of the frame, so 73% of every
   * byte is discarded and no landscape encode can be both sharp and light —
   * 1440 is 14.9 MB at CRF 30 and still soft. The fix is a re-cut framed for
   * the shape (August's call, 10 September 2026), and it is the editor's to
   * make: a blind centre crop cuts Suzanne's head in half at 0:20 and slices
   * the guests at 0:45. See brand/video/README.md for the brief.
   *
   * Set this and phones use it. Until then `pickTier` deliberately does NOT
   * chase the magnification, so the weight stays where it is today.
   */
  portrait?: string;
};

type Connection = {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
};

/**
 * Is this a link we should not spend 6 MB of somebody's data plan on
 * uninvited? Data saver on, or a 2g/3g effective type, or a measured
 * downlink under 1.5 Mb/s (Network Information API — Chromium and Android
 * only; Safari and Firefox always answer no and are judged on screen alone).
 */
function slowLink(): boolean {
  const connection = (navigator as Navigator & { connection?: Connection })
    .connection;
  return (
    connection?.saveData === true ||
    /(^|-)(2g|3g)$/.test(connection?.effectiveType ?? "") ||
    (connection?.downlink !== undefined && connection.downlink < 1.5)
  );
}

/** Every tier is the same 16:9 edit at a different width. */
const TIER_WIDTHS = { small: 960, medium: 1440, large: 1920 } as const;
const SOURCE_ASPECT = 16 / 9;

/**
 * How wide a source this element actually needs, in real pixels.
 *
 * ⚠ NOT THE VIEWPORT WIDTH (August, 10 September 2026: "the video quality on
 * mobile is blurry"). The film fills a `min-h-svh` header under
 * `object-cover`, and cover scales the frame until the SHORT axis fills — so
 * in a portrait box the height drives the magnification and the sides are
 * cropped away. On a 390 × 844 phone the 16:9 frame is blown up to 1444 CSS
 * px wide to make its height reach 844, and only the middle 27% of it is on
 * screen. At DPR 3 that asked ~4500px of source width from a 960px file: a
 * 4.7× upscale, which is the blur, and nothing to do with the encode.
 *
 * The old picker read `innerWidth`, so a phone measured ~780 and was handed
 * the smallest tier — the one guess that made it worst. This measures the
 * box the film is actually painted into and works back through the cover
 * scale. DPR stays clamped at 2: past that the file needed grows faster than
 * any benefit a 6in screen can show.
 */
function neededWidth(video: HTMLVideoElement): number {
  const box = video.getBoundingClientRect();
  const w = box.width || window.innerWidth;
  const h = box.height || window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return Math.max(w, h * SOURCE_ASPECT) * dpr;
}

/**
 * Also the choice made on demand when a held film is finally asked for.
 *
 * Which encode to fetch, decided once before the element has a source, so
 * the browser never starts one download and abandons it for another.
 *
 *   · Data saver, or a 2g/3g effective type (Network Information API,
 *     Chromium and Android only) → small, whatever the screen asks for.
 *   · Otherwise the smallest tier that covers `neededWidth`, and where
 *     nothing covers it — every portrait phone, see above — the largest the
 *     link will carry.
 *   · `large` still wants a measured 5 Mb/s or an unknown link; a phone on a
 *     slow-but-not-2g connection takes `medium` and stays soft rather than
 *     spending 25 MB.
 *
 * Browsers without the API (Safari, Firefox) are judged on screen alone.
 * The choice is not revisited mid-play: a tier switch would restart the
 * film, which is worse than a soft frame.
 *
 * ⚠ WHETHER to fetch at all is decided by the caller, not here — this only
 * answers WHICH. A slow link still gets `small` because by the time this is
 * reached on such a link, the visitor has asked for the film.
 */
function pickTier(tiers: HeroTiers, video: HTMLVideoElement): string {
  const connection = (navigator as Navigator & { connection?: Connection })
    .connection;
  if (slowLink()) return tiers.small;

  const box = video.getBoundingClientRect();
  const w = box.width || window.innerWidth;
  const h = box.height || window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // A box taller than the source's own shape is one where cover crops the
  // sides — every portrait phone. A cut framed for that shape needs no
  // magnification at all, so it wins outright when there is one.
  if (tiers.portrait && h * SOURCE_ASPECT > w) return tiers.portrait;

  const needed = neededWidth(video);
  const fast = connection?.downlink === undefined || connection.downlink >= 5;

  // ⚠ DO NOT CHASE A WIDTH NO TIER CAN REACH. A portrait phone asks for
  // ~3000px; the widest encode is 1920. Buying it would spend 18–25 MB of
  // somebody's data to move 3.7× of upscale to 2.1× — still soft, and
  // against R11's budget, which this film already exceeds at 6.2 MB. Where
  // the ask is unreachable the honest target is the box's own width: pay for
  // the pixels that land on screen, stay at today's weight, and let the
  // portrait cut above be the thing that actually fixes it.
  const target = needed > TIER_WIDTHS.large ? w * dpr : needed;

  if (target <= TIER_WIDTHS.small) return tiers.small;
  if (target <= TIER_WIDTHS.medium || !fast) return tiers.medium;
  return tiers.large;
}

/**
 * NOTHING IS FETCHED WHERE NOTHING WILL PLAY (9 Sep 2026, mobile pass). A
 * source is attached only where the film is actually going to autoplay. On
 * a data-saver or 2g/3g link, and under reduced motion, the element is
 * marked held and left sourceless: with `preload="auto"` an attached source
 * is a committed download, and even the phone tier is 6.3 MB against R11's
 * 2.5 MB above-the-fold budget. Under reduced motion that was 6.3 MB for a
 * film that never plays at all. Held, the poster stands as the hero still
 * and the corner button fetches and plays on request, which is the state
 * reduced motion was always meant to be in.
 *
 * THERE IS NO PARSE-TIME SCRIPT ANY MORE. There was one, briefly: an inline
 * `<script>` that attached the source during HTML parse, because the effect
 * below could not run until hydration and hydration was stuck behind the
 * route map's 6.5s (desktop) / 12.5s (phone) of blocked main thread. With
 * that block fixed the script bought nothing measurable — the request goes
 * out at ~400ms either way — and it cost a console error on every
 * client-side navigation back to this page, since React renders a `<script>`
 * in the component tree rather than executing it.
 */

export function HeroVideo({
  tiers,
  poster,
  silentFrom = 0,
  label,
}: {
  tiers: HeroTiers;
  poster: string;
  /** Seconds into the film the silent loop starts. */
  silentFrom?: number;
  /** What the film shows — read by assistive tech. */
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const [reduced, setReduced] = useState(false);
  /** Held = no source attached, poster standing, button will fetch on click. */
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Both flags are read in one place so the button's label and the DOM's
    // own `data-held` record can never disagree.
    const sync = () => {
      setReduced(motion.matches);
      setHeld(motion.matches || slowLink());
    };
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  // The source is set here, not in markup: the tier is a client decision
  // (screen and connection), and an element with no src fetches nothing —
  // so the poster stands in until the chosen encode is attached, and the
  // browser never starts one download only to abandon it for another.
  //
  // It is attached ONLY where the film will autoplay. Held — reduced motion,
  // or a link too slow to spend 6.3 MB uninvited — the element stays
  // sourceless and the poster is the hero; `toggle` fetches on request.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // `held` state drives the button's label; the attribute is the DOM's
    // own record of the same call.
    if (reduced || slowLink()) {
      video.setAttribute("data-held", "");
      return;
    }
    video.removeAttribute("data-held");
    if (!video.getAttribute("src")) video.src = pickTier(tiers, video);
    const start = () => {
      if (video.currentTime < silentFrom) video.currentTime = silentFrom;
      void video.play().catch(() => {
        /* Autoplay refused — the poster stays and the button still works. */
      });
    };
    if (video.readyState >= 1) start();
    else video.addEventListener("loadedmetadata", start, { once: true });
    return () => video.removeEventListener("loadedmetadata", start);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tiers are static per page
  }, [reduced, silentFrom]);

  /**
   * THE FILM STOPS ONCE IT IS COVERED (9 Sep 2026, mobile pass).
   *
   * The hero is `position: sticky` inside a wrapper that spans every section
   * (page.tsx), so it never scrolls away — it is only painted over. Left
   * alone the browser therefore decodes a looping film behind the whole
   * ~12,000px page: measured at 375 the hero was still pinned at 0–812 with
   * the video running at scrollY 6000, five thousand pixels after the last
   * frame of it was visible. On a phone that is battery and heat spent on a
   * picture nobody can see.
   *
   * Playback economy, not narrative motion, so it cites no grammar row and
   * writes nothing per frame — a passive scroll listener comparing one
   * number against a cached threshold. It registers as a module so a route
   * change tears it down with everything else.
   *
   * THE GRACE. The facts section opens with a transparent band — its own top
   * padding plus the wave crest — through which the film is still visible
   * after the hero's foot has passed the top of the screen. It is measured
   * off that section rather than guessed, so the two breakpoints' different
   * padding (40 / 104) and wave heights need no second constant here.
   *
   * SOUND IS THE EXCEPTION. A visitor who turned the film on is listening to
   * it; it keeps playing wherever they scroll.
   */
  useEffect(() => {
    const video = ref.current;
    // Held: nothing is playing to pause. Sound on: they are listening to it.
    if (!video || reduced || sound || held) return;
    const hero = video.closest("header");
    if (!hero) return;

    let threshold = 0;
    // Kept off the scroll path: reading layout on every scroll event is the
    // one thing that would make this cost more than it saves.
    const measure = () => {
      const facts = hero.nextElementSibling;
      const band =
        facts instanceof HTMLElement
          ? parseFloat(getComputedStyle(facts).paddingTop) +
            (facts.querySelector("svg")?.getBoundingClientRect().height ?? 0)
          : 240;
      threshold = hero.offsetHeight + band;
    };

    let covered = false;
    const sync = () => {
      const next = window.scrollY > threshold;
      if (next === covered) return;
      covered = next;
      if (covered) video.pause();
      else void video.play().catch(() => {});
    };

    // A resize can move the threshold past where the page already sits — an
    // orientation flip is the common one — so it re-reads and re-decides.
    const onResize = () => {
      measure();
      sync();
    };

    // Named `guard`, not `module`: Next forbids assigning to `module` even
    // as a local (@next/next/no-assign-module-variable).
    const guard = {
      init() {
        onResize();
        window.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", onResize);
      },
      destroy() {
        window.removeEventListener("scroll", sync);
        window.removeEventListener("resize", onResize);
      },
    };
    const unregister = register(guard);
    startMotion();
    return unregister;
  }, [reduced, sound, held]);

  // Sound on rises from silence just fast enough not to click; sound off
  // falls to silence before muting so the film does not cut dead. One frame
  // handle means a quick on/off/on cancels whichever ramp is still running.
  const fade = useRef<number | null>(null);
  const cancelFade = () => {
    if (fade.current !== null) cancelAnimationFrame(fade.current);
    fade.current = null;
  };
  const ramp = (
    video: HTMLVideoElement,
    target: number,
    done?: () => void,
  ) => {
    cancelFade();
    const from = video.volume;
    // Clamped to the ceiling as well as to 0–1, so no caller can ask for
    // full scale by passing 1.
    const to = Math.min(SOUND_MAX, Math.max(0, target));
    // Rising is a click guard, falling is a musical exit; they are not the
    // same length. Read off the direction so no call site has to say.
    const ms = to > from ? FADE_IN_MS : FADE_OUT_MS;
    // rAF's timestamp can precede performance.now() by a frame, so the
    // fraction is clamped at both ends — a negative k threw IndexSizeError.
    const started = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - started) / ms));
      video.volume = Math.min(1, Math.max(0, from + (to - from) * k));
      if (k < 1) {
        fade.current = requestAnimationFrame(step);
      } else {
        fade.current = null;
        done?.();
      }
    };
    fade.current = requestAnimationFrame(step);
  };

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (sound) {
      setSound(false);
      ramp(video, 0, () => {
        video.muted = true;
        video.volume = SOUND_MAX;
      });
      return;
    }
    // Held until now — reduced motion, or a link we would not spend the
    // film's weight on uninvited. The click IS the invitation, so this is
    // where the encode is finally fetched.
    if (!video.getAttribute("src")) {
      video.src = pickTier(tiers, video);
      video.removeAttribute("data-held");
      setHeld(false);
    }
    video.volume = 0;
    video.muted = false;
    video.currentTime = 0;
    setSound(true);
    void video.play().catch(() => {});
    ramp(video, SOUND_MAX);
  };

  // With a non-zero `silentFrom` the silent loop wraps back there rather than
  // to the supers; with sound on, and at 0, the native loop does the work.
  //
  // ⚠ THE WRAP NO LONGER RE-FADES (August, 10 Sep 2026, same pass as the
  // fade-in above). It used to force the level to silence and ramp back, to
  // stop the loop point landing as a peak. Measured, there is no peak to
  // stop: the edit fades itself out — its last half second is −51 dBFS RMS,
  // effectively silence — and comes back in on the quiet guitar scale. So
  // the guard was silencing the first fifth of a second of that scale on
  // every single repeat, which is the exact complaint it now has to answer.
  // The level is simply left where it is and the film loops as cut. Restore
  // this only if a re-cut ends hard, and check `brand/video/README.md`
  // first — a hard out is a note for the editor, not a patch for the player.
  //
  // Which leaves this handler with one job, and only when `silentFrom` is
  // non-zero: send the SILENT loop back past the burned-in supers. The wrap
  // tracking that used to live here went with the re-fade.
  const onTimeUpdate = () => {
    const video = ref.current;
    if (!video || sound || silentFrom === 0) return;
    if (video.duration - video.currentTime < 0.3) {
      video.currentTime = silentFrom;
      void video.play().catch(() => {});
    }
  };

  useEffect(() => cancelFade, []);

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        muted
        playsInline
        loop
        /* `auto`, not `metadata`: the gate that matters is "can it play", and
           `metadata` asks the browser to stop at the header. Weight is
           already controlled by the tier, not by holding the fetch back. */
        preload="auto"
        aria-label={label}
        onTimeUpdate={onTimeUpdate}
        data-tiers={JSON.stringify(tiers)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={sound}
        /* On the phone it sits in the hero's foot padding under the wrapped
           title; at lg on the title's baseline (pb-[120px]) to its right. The
           facts wave only rides up over the foot on scroll, so neither spot
           is covered at rest. */
        className="eyebrow absolute right-5 bottom-8 z-20 inline-flex items-center gap-2 rounded-full border border-canvas/40 bg-charcoal/50 px-4 py-2 text-canvas backdrop-blur-sm transition-colors duration-(--dur-small) ease-quiet hover:bg-charcoal/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas lg:right-16 lg:bottom-[120px]"
      >
        {/* The label names the CURRENT state, not the action. */}
        <SpeakerIcon on={sound} />
        {sound ? "Sound on" : held ? "Play the film" : "Sound off"}
      </button>
    </>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7.5h3l4-3.5v12l-4-3.5H3z" />
      {on ? (
        <>
          <path d="M13 7.5a3.5 3.5 0 0 1 0 5" />
          <path d="M15.5 5a7 7 0 0 1 0 10" />
        </>
      ) : (
        <path d="M13.5 8l4 4m0-4l-4 4" />
      )}
    </svg>
  );
}
