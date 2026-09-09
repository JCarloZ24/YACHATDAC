"use client";
import gsap from "gsap";

/** SCR-15: the document shelf traverses before the page continues. */
export function registerRecordDocuments() {
  gsap.registerEffect({
    name: "recordDocumentsGround",
    effect: (targets: gsap.TweenTarget) => gsap.fromTo(targets,
      { "--document-ground-progress": "0%" },
      { "--document-ground-progress": "100%", duration: 0.7, ease: "none" }),
  });
  gsap.registerEffect({
    name: "recordDocumentsTraverse",
    effect: (targets: gsap.TweenTarget, config: { distance: () => number }) =>
      gsap.fromTo(targets, { x: 0 }, { x: () => -config.distance(), duration: 1, ease: "none" }),
  });
}
