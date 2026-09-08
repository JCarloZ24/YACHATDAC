"use client";

import { useEffect, useRef, useState } from "react";

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
const FADE_MS = 600;

export function HeroVideo({
  mp4,
  webm,
  poster,
  silentFrom = 0,
  label,
}: {
  mp4: string;
  webm?: string;
  poster: string;
  /** Seconds into the film the silent loop starts. */
  silentFrom?: number;
  /** What the film shows — read by assistive tech. */
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const start = () => {
      if (video.currentTime < silentFrom) video.currentTime = silentFrom;
      void video.play().catch(() => {
        /* Autoplay refused — the poster stays and the button still works. */
      });
    };
    if (video.readyState >= 1) start();
    else video.addEventListener("loadedmetadata", start, { once: true });
    return () => video.removeEventListener("loadedmetadata", start);
  }, [reduced, silentFrom]);

  // Both directions ramp the level over ~600ms: sound on rises from silence
  // so the opening does not peak under the visitor's finger, sound off falls
  // to silence before muting so the film does not cut dead. One frame handle
  // means a quick on/off/on cancels whichever ramp is still running.
  const fade = useRef<number | null>(null);
  const cancelFade = () => {
    if (fade.current !== null) cancelAnimationFrame(fade.current);
    fade.current = null;
  };
  const ramp = (video: HTMLVideoElement, to: number, done?: () => void) => {
    cancelFade();
    const from = video.volume;
    // rAF's timestamp can precede performance.now() by a frame, so the
    // fraction is clamped at both ends — a negative k threw IndexSizeError.
    const started = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - started) / FADE_MS));
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
        video.volume = 1;
      });
      return;
    }
    video.volume = 0;
    video.muted = false;
    video.currentTime = 0;
    setSound(true);
    void video.play().catch(() => {});
    ramp(video, 1);
  };

  // With a non-zero `silentFrom` the silent loop wraps back there rather than
  // to the supers; with sound on, and at 0, the native loop does the work.
  // Either way a wrap with sound on fades the level back in, so the loop
  // point does not land as a peak — the same ramp the button uses.
  const lastTime = useRef(0);
  const onTimeUpdate = () => {
    const video = ref.current;
    if (!video) return;
    const wrapped = video.currentTime < lastTime.current - 1;
    lastTime.current = video.currentTime;
    if (sound) {
      if (wrapped && fade.current === null) {
        video.volume = 0;
        ramp(video, 1);
      }
      return;
    }
    if (silentFrom === 0) return;
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
        preload="metadata"
        aria-label={label}
        onTimeUpdate={onTimeUpdate}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={sound}
        className="eyebrow absolute right-5 bottom-6 z-20 inline-flex items-center gap-2 rounded-full border border-canvas/40 bg-charcoal/50 px-4 py-2 text-canvas backdrop-blur-sm transition-colors duration-(--dur-small) ease-quiet hover:bg-charcoal/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas lg:right-16 lg:bottom-10"
      >
        {/* The label names the CURRENT state, not the action. */}
        <SpeakerIcon on={sound} />
        {sound ? "Sound on" : reduced ? "Play the film" : "Sound off"}
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
