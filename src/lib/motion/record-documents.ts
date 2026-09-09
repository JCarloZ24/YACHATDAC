"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "../motion-controller";
import { registerRecordDocuments } from "./effects/record-documents";

/** SCR-15, 2026-09-09. Pin only when the entire shelf fits for reading. */
export function createRecordDocuments(root: HTMLElement): MotionModule {
  let cleanup: (() => void) | undefined;
  return {
    init() {
      registerRecordDocuments();
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const track = root.querySelector<HTMLElement>("ul");
        const viewport = root.querySelector<HTMLElement>("[data-documents-window]");
        if (!track || !viewport || root.offsetHeight > window.innerHeight) return;
        root.dataset.documentsPinned = "true";
        track.scrollLeft = 0;
        // Overflow-visible tracks can omit trailing padding from scrollWidth.
        // Measure the final card explicitly so the end gutter survives pinning.
        const distance = () => {
          const last = track.lastElementChild as HTMLElement | null;
          const gutter = parseFloat(getComputedStyle(track).paddingRight) || 0;
          return Math.max(0, (last ? last.offsetLeft + last.offsetWidth + gutter : track.scrollWidth) - viewport.clientWidth);
        };
        const section = root.closest<HTMLElement>("#documents")!;
        const next = section.nextElementSibling as HTMLElement | null;
        const grounds = next ? [section, next] : [section];
        const travel = () => Math.max(1, distance() / window.innerWidth);
        const animation = gsap.timeline();
        const traverse = gsap.effects.recordDocumentsTraverse(track, { distance }) as gsap.core.Tween;
        const hold = gsap.to({}, { duration: 0.4 });
        const rebuild = () => {
          animation.clear();
          animation.add(traverse.duration(travel()), 0);
          animation.add(hold, travel());
        };
        rebuild();
        const trigger = ScrollTrigger.create({ trigger: root, start: "top top", pin: true,
          end: () => `+=${(travel() + 0.4) * 100}%`,
          animation, scrub: true, invalidateOnRefresh: true,
          onRefreshInit: rebuild,
          onUpdate: () => root.dispatchEvent(new CustomEvent("documents-progress", { detail: traverse.progress() })),
        });
        // SCR-16 refinement: leave the shelf on cream; darken only after
        // the following section has entered the viewport.
        const ground = gsap.effects.recordDocumentsGround(grounds) as gsap.core.Tween;
        ScrollTrigger.create({ trigger: next ?? section, start: "top 65%", end: "top 15%",
          animation: ground, scrub: 0.5, invalidateOnRefresh: true });
        const seek = (event: Event) => {
          const direction = (event as CustomEvent<number>).detail;
          const progress = gsap.utils.clamp(0, 1, traverse.progress() + direction * viewport.clientWidth * 0.85 / Math.max(1, distance()));
          window.scrollTo(0, trigger.start + progress * travel() * window.innerHeight);
        };
        root.addEventListener("documents-seek", seek);
        return () => { root.removeEventListener("documents-seek", seek); delete root.dataset.documentsPinned; };
      }, root);
      cleanup = () => media.revert();
    },
    destroy() { cleanup?.(); cleanup = undefined; },
  };
}
