"use client";

import { motionSettled, prefersReduced } from "@/lib/motion-controller";

/** X7 / SYS-02, August, 11 September 2026. Cache hits still need decoding
 * and layout composition. Each loading cycle gets its own readiness reader;
 * nothing from an outgoing page can declare the next page ready. */
export function createPageReadiness() {
  const decoded = new WeakMap<HTMLImageElement, { source: string; done: boolean }>();
  const heldVideos = new Set<HTMLVideoElement>();
  const posters = new Map<string, { done: boolean }>();
  let lastHeight = -1;
  let stableSince = performance.now();
  let lastRead = -Infinity;
  let result = false;

  const check = () => {
    const now = performance.now();
    // Media/layout reads are batched at 10Hz, not for every dot of the sweep.
    if (now - lastRead < 100) return result;
    lastRead = now;
    const main = document.querySelector("main");
    if (!main) return false;
    const inView = (element: Element) => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && box.bottom > 0
        && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth;
    };

    let mediaReady = true;
    for (const image of main.querySelectorAll<HTMLImageElement>("img")) {
      if (!inView(image)) continue;
      const source = image.currentSrc || image.src;
      if (!source) continue;
      let state = decoded.get(image);
      if (!state || state.source !== source) {
        state = { source, done: false };
        decoded.set(image, state);
        const current = state;
        // A failed image settles on the existing tonal fallback, too.
        void image.decode().catch(() => undefined).then(() => { current.done = true; });
      }
      if (!state.done) mediaReady = false;
    }
    for (const video of main.querySelectorAll<HTMLVideoElement>("video")) {
      if (!inView(video)) continue;
      if (!video.paused) {
        heldVideos.add(video);
        video.pause();
      }
      const hasSource = video.hasAttribute("src") || video.querySelector("source[src]");
      // Intentionally source-less videos keep their poster under reduced
      // motion/data saving. A playable first frame suffices; never buffer a
      // whole film or force off-screen lazy videos to download.
      if (hasSource && !video.error && video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        mediaReady = false;
      } else if ((!hasSource || video.error) && video.poster) {
        // Reduced-motion and data-saving visits often use only the poster.
        // Decode that same URL, so these visits get the readiness cover too.
        let poster = posters.get(video.poster);
        if (!poster) {
          poster = { done: false };
          posters.set(video.poster, poster);
          const current = poster;
          const image = new Image();
          image.src = video.poster;
          void image.decode().catch(() => undefined).then(() => { current.done = true; });
        }
        if (!poster.done) mediaReady = false;
      }
    }

    if (!prefersReduced()) {
      if (main.querySelector('[data-page-ready="loading"]')) mediaReady = false;
      if (main.querySelector('[data-portal-state="loading"]')) mediaReady = false;
      if (main.querySelector('[data-hero-motion="preparing"]:not([data-hero-canvas="ready"])')) mediaReady = false;
    }
    const height = document.documentElement.scrollHeight;
    if (height !== lastHeight || !mediaReady || !motionSettled()
      || document.fonts.status !== "loaded") {
      lastHeight = height;
      stableSince = now;
      result = false;
      return false;
    }
    result = now - stableSince >= 300;
    return result;
  };
  return {
    check,
    release() {
      for (const video of heldVideos) {
        if (video.isConnected) void video.play().catch(() => undefined);
      }
      heldVideos.clear();
    },
  };
}

/** A navigation request is published before router.push, so the cover paints
 * over the outgoing page while the incoming route is still being fetched. */
export const PAGE_LOAD_START = "yachatdac:page-load-start";

/** The retained development sandboxes are outside the public site's shell. */
export function isPublicRoute(pathname: string): boolean {
  return !["/lab", "/v2", "/homepagev2"].some(root => pathname === root || pathname.startsWith(`${root}/`));
}
