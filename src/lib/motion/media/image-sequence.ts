"use client";

/**
 * D2 — frame-scrubbed image sequence. TS port of the skill template
 * (assets/image-sequence.js) with two production fixes agreed for the v2
 * build:
 *
 * 1. The canvas is sized ONCE to the host rect × DPR (≤1.5), not to each
 *    frame's naturalWidth per draw — resizing a canvas every frame is a
 *    layout + clear on the hot path.
 * 2. Frames draw cover-fit, so the sequence behaves like object-fit: cover
 *    whatever the host's aspect is.
 *
 * Everything else is the template verbatim: proxy + snap "frame" (never set
 * src per frame), preload 12 then stream on idle, saveData thins the frame
 * count, reduced motion pins frame 0 (the poster the host renders anyway).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";

gsap.registerPlugin(ScrollTrigger);

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

export type ImageSequenceOptions = {
  frames: number;
  src: (index: number) => string;
};

export function createImageSequence(
  getRoot: () => HTMLElement | null,
  { frames, src }: ImageSequenceOptions,
): MotionModule {
  const images: HTMLImageElement[] = new Array(frames);
  const proxy = { frame: 0 };
  let mm: gsap.MatchMedia | null = null;
  let ctx2d: CanvasRenderingContext2D | null = null;
  let canvas: HTMLCanvasElement | null = null;

  const count = (navigator as SaveDataNavigator).connection?.saveData
    ? Math.min(frames, 12)
    : frames;
  const idx = (i: number) => Math.round((i / (count - 1)) * (frames - 1));

  const load = (i: number, priority: boolean) => {
    if (images[i]) return images[i];
    const img = new Image();
    img.fetchPriority = priority ? "high" : "low";
    img.src = src(i);
    images[i] = img;
    return img;
  };

  const draw = () => {
    const img = images[idx(Math.round(proxy.frame))];
    if (!img?.complete || !ctx2d || !canvas) return;
    const scale = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight,
    );
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx2d.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };

  const init = () => {
    const root = getRoot();
    canvas = root?.querySelector("canvas") ?? null;
    if (!root || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    ctx2d = canvas.getContext("2d");

    for (let i = 0; i < Math.min(12, count); i++) load(i, true);
    window.requestIdleCallback?.(() => {
      for (let i = 12; i < count; i++) load(i, false);
    });

    images[0]
      ?.decode?.()
      .then(draw)
      .catch(() => undefined);

    mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(proxy, {
        frame: count - 1,
        ease: "none",
        snap: "frame",
        scrollTrigger: {
          trigger: root,
          scrub: 0.5,
          start: "top bottom",
          end: "bottom top",
        },
        onUpdate: draw,
      });
      return () => tween.kill();
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      proxy.frame = 0;
      draw();
    });
  };

  const destroy = () => {
    mm?.revert();
    mm = null;
    images.length = 0;
    ctx2d = null;
    canvas = null;
  };

  return { init, destroy };
}
