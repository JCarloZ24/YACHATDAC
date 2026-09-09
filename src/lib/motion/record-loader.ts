"use client";

import gsap from "gsap";
import { prefersReduced, type MotionModule } from "../motion-controller";
import { registerRecordLoading } from "./effects/record-loading";

/** SYS-02, user direction 2026-09-09: homepage artwork, actual readiness.
 * The portal owns loading/cancellation. This module owns the cover, progress,
 * scroll/focus lock and exit; all are released on route changes or failure. */
export function createRecordLoader(cover: HTMLDivElement, portal: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      cleanup?.();
      const documentRoot = document.documentElement;
      const overflow = documentRoot.style.overflow;
      const siblings = Array.from(cover.parentElement?.children ?? [])
        .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== cover)
        .map((node) => ({ node, inert: node.inert }));
      const wave = cover.querySelector<HTMLElement>("[data-loader-wave]");
      const count = cover.querySelector<HTMLElement>("[data-loader-count]");
      const context = gsap.context(() => {}, cover);
      const page = cover.parentElement;
      const imageError = (event: Event) => {
        const image = event.target;
        if (image instanceof HTMLImageElement && image.closest("[data-record-grid]")) {
          image.style.visibility = "hidden";
        }
      };
      page?.addEventListener("error", imageError, true);
      let finished = false;
      let exiting = false;
      let timeline: gsap.core.Timeline | undefined;
      const abort = () => portal.dispatchEvent(new Event("record-portal-abort"));
      const prevent = (event: Event) => event.preventDefault();
      const key = (event: KeyboardEvent) => {
        if (event.key === "Tab" || event.key === "Escape") {
          abort();
          finish();
        } else if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
          event.preventDefault();
        }
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        timeline?.kill();
        observer.disconnect();
        cover.hidden = true;
        documentRoot.style.overflow = overflow;
        siblings.forEach(({ node, inert }) => { node.inert = inert; });
        window.removeEventListener("keydown", key, true);
        cover.removeEventListener("wheel", prevent);
        cover.removeEventListener("touchmove", prevent);
      };
      const update = () => {
        if (finished) return;
        const state = portal.dataset.portalState;
        const complete = state === "ready" || state === "fallback";
        const percent = complete ? 100 : Math.min(95, Number(portal.dataset.portalProgress) || 0);
        if (count) count.textContent = String(percent);
        cover.setAttribute("aria-valuenow", String(percent));
        if (wave && !exiting) wave.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        if (!complete || exiting) return;
        exiting = true;
        if (prefersReduced() || state === "fallback") finish();
        else context.add(() => {
          registerRecordLoading();
          timeline = gsap.effects.recordLoader(cover) as gsap.core.Timeline;
          timeline.eventCallback("onComplete", finish);
        });
      };
      const observer = new MutationObserver(update);
      cover.hidden = false;
      documentRoot.style.overflow = "hidden";
      siblings.forEach(({ node }) => { node.inert = true; });
      window.addEventListener("keydown", key, true);
      cover.addEventListener("wheel", prevent, { passive: false });
      cover.addEventListener("touchmove", prevent, { passive: false });
      observer.observe(portal, { attributes: true, attributeFilter: ["data-portal-state", "data-portal-progress"] });
      update();
      cleanup = () => {
        finish(); context.revert(); cover.hidden = true;
        page?.removeEventListener("error", imageError, true);
      };
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
