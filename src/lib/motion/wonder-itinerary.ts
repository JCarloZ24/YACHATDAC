"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import { registerYachatdacEffects, revertSplits } from "./effects";
import { clampScrollTo, smoothScrollTo } from "./smooth-scroll";

/**
 * Wonder §06, restored at 1440 × 900 on August's direction, 9 September 2026.
 * Later direction adds automatic opening, aligned to one viewport. Grammar:
 * "the world opening" / itineraryStep, disclose, frameOpen; "what endures" /
 * settle; "arriving quietly" / arrive. Transition is the active channel.
 * Six 100vh reading spans; smaller screens keep native disclosure layout.
 * The controller owns this module and matchMedia owns every GSAP callback.
 */
export function itinerary(root: HTMLElement): MotionModule {
  let media: gsap.MatchMedia | undefined;
  let refreshTimer = 0;
  let resizeTimer = 0;

  const refreshSoon = () => {
    if (root.dataset.itineraryMode === "scroll") return;
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
  };

  const mount = () => {
    media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", (context) => {
      if (window.matchMedia("(min-width: 64rem) and (min-height: 55rem) and (pointer: fine)").matches) {
        const cleanup = heldItinerary(root, context);
        if (cleanup) return cleanup;
      }
      const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-stage-row]"));
      const end = root.querySelector<HTMLElement>("[data-stage-end]");
      const details = Array.from(root.querySelectorAll<HTMLDetailsElement>("[data-stage]"));
      let active: gsap.core.Timeline | undefined;
      let finishState: (() => void) | undefined;

      const enter = (trigger: HTMLElement, targets: HTMLElement[]) => {
        if (!targets.length) return;
        const tl = gsap.timeline({ paused: true }).arrive(targets);
        const openStage = trigger.querySelector<HTMLDetailsElement>("details[open]");
        if (openStage) tl.stageArrival(openStage, {}, 0.1);
        ScrollTrigger.create({
          trigger,
          start: "top 88%",
          onEnter: () => tl.play(),
          onEnterBack: () => tl.play(),
          // Hash links and scroll restoration must not leave content hidden.
          onRefresh: (self) => {
            if (self.scroll() >= self.start) tl.progress(1);
          },
        });
      };
      const heading = root.querySelector<HTMLElement>("h2");
      if (heading?.parentElement) {
        enter(heading.parentElement, Array.from(heading.parentElement.children) as HTMLElement[]);
      }
      rows.forEach((row) => enter(row, [
        row.firstElementChild as HTMLElement,
        row.querySelector<HTMLElement>("summary")!,
      ]));

      const finish = () => active?.progress(1);

      context.add("toggleStage", (event: MouseEvent) => {
        const summary = (event.target as Element).closest<HTMLElement>("[data-stage-head]");
        if (!summary || !root.contains(summary)) return;
        const stage = summary.parentElement as HTMLDetailsElement;
        const panel = stage.querySelector<HTMLElement>("[data-stage-panel]");
        if (!panel) return;
        event.preventDefault();
        finish();

        const open = !stage.open;
        const rowIndex = details.indexOf(stage);
        const following = rows.slice(rowIndex + 1);
        if (end) following.push(end);
        // The following sections share the same document displacement. Move
        // their containers too so the evergreen wave stays joined to the list.
        let sibling = root.nextElementSibling;
        while (sibling instanceof HTMLElement) {
          following.push(sibling);
          sibling = sibling.nextElementSibling;
        }
        const before = following.map((el) => el.getBoundingClientRect().top);

        if (open) {
          stage.open = true;
        } else {
          // Lift the closing panel out of flow for one layout change. Keep
          // native open until its clip closes; no height tween or text scale.
          const top = summary.offsetTop + summary.offsetHeight;
          panel.style.position = "absolute";
          panel.style.top = `${top}px`;
          panel.style.left = "0";
          panel.style.right = "0";
        }
        summary.setAttribute("aria-expanded", String(open));
        const offsets = following.map((el, i) => before[i] - el.getBoundingClientRect().top);

        finishState = () => {
          stage.open = open;
          summary.removeAttribute("aria-expanded");
          panel.style.removeProperty("position");
          panel.style.removeProperty("top");
          panel.style.removeProperty("left");
          panel.style.removeProperty("right");
          panel.style.removeProperty("clip-path");
          stage.querySelector<HTMLElement>("[data-stage-copy]")?.style.removeProperty("opacity");
          stage.querySelector<HTMLElement>("[data-stage-chevron]")?.style.removeProperty("transform");
          following.forEach((el) => el.style.removeProperty("transform"));
        };
        active = gsap.timeline().add(gsap.effects.disclose(stage, { open, following, offsets }));
        if (open) active.stageArrival(stage, {}, 0.12);
        active!.eventCallback("onComplete", () => {
          finishState?.();
          finishState = undefined;
          active = undefined;
          refreshSoon();
        });
      });
      const onClick = (event: MouseEvent) => context.toggleStage(event);
      root.addEventListener("click", onClick);
      window.addEventListener("resize", finish);

      return () => {
        root.removeEventListener("click", onClick);
        window.removeEventListener("resize", finish);
        active?.kill();
        finishState?.();
        revertSplits(root);
      };
    }, root);
  };

  // A width change can turn a short paragraph into a tall one even when it
  // stays inside the desktop breakpoint. Re-check fit, not just the query.
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      media?.revert();
      mount();
      ScrollTrigger.refresh();
    }, 240);
  };

  return {
    init() {
      registerYachatdacEffects();
      root.addEventListener("toggle", refreshSoon, true);
      window.addEventListener("resize", onResize);
      mount();
    },
    destroy() {
      media?.revert();
      media = undefined;
      root.removeEventListener("toggle", refreshSoon, true);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(refreshTimer);
      window.clearTimeout(resizeTimer);
    },
  };
}

/** One real accordion, held with CSS sticky. Its fixed outer span means native
    open/close changes cannot alter the scroll positions that select a stop. */
function heldItinerary(root: HTMLElement, context: gsap.Context): (() => void) | null {
  const screen = root.querySelector<HTMLElement>("[data-itinerary-screen]");
  const viewport = root.querySelector<HTMLElement>("[data-stage-viewport]");
  const track = root.querySelector<HTMLElement>("[data-stage-track]");
  const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-stage-row]"));
  const stages = Array.from(root.querySelectorAll<HTMLDetailsElement>("[data-stage]"));
  const headings = stages.map((el) => el.querySelector<HTMLElement>("summary")!);
  if (!screen || !viewport || !track || !stages.length) return null;

  const initialOpen = stages.map((el) => el.open);
  root.dataset.itineraryMode = "scroll";
  root.style.setProperty("--itinerary-span", `${stages.length * 100}vh`);
  stages.forEach((el) => { el.open = true; });
  const tallest = Math.max(...rows.map((el) => el.offsetHeight));
  const closingRule = root.querySelector<HTMLElement>("[data-stage-end]")?.offsetHeight ?? 0;
  const fits = tallest + closingRule <= viewport.clientHeight - 8;
  stages.forEach((el, i) => { el.open = initialOpen[i]; });
  if (!fits) {
    delete root.dataset.itineraryMode;
    root.style.removeProperty("--itinerary-span");
    return null;
  }

  let selected = -1;
  let active: gsap.core.Timeline | undefined;
  const finish = () => { active?.progress(1); active = undefined; };
  const align = (index: number) => {
    // offsetTop rounds the 9.59848px SVG rules and drifts almost a pixel
    // between stops. Rectangle differences retain the subpixel geometry.
    const offset = rows[index].getBoundingClientRect().top - track.getBoundingClientRect().top;
    gsap.set(track, { y: -offset });
  };
  const select = (index: number) => {
    selected = index;
    stages.forEach((el, i) => {
      el.open = i === index;
      headings[i].tabIndex = i === index ? 0 : -1;
      // Rows above the clip cannot receive hidden focus. Arrow navigation on
      // the active summary can still return to any previous stop.
      rows[i].inert = i < index;
    });
    align(index);
    root.dataset.activeStage = String(index + 1);
  };

  context.add("showStage", (index: number, animate: boolean) => {
    if (index === selected) return;
    finish();
    const before = rows.map((el) => el.getBoundingClientRect().top);
    select(index);
    if (!animate) return;
    const offsets = rows.map((el, i) => before[i] - el.getBoundingClientRect().top);
    active = gsap.effects.itineraryStep(stages[index], { rows, offsets });
  });

  select(0);
  const sectionHeading = root.querySelector<HTMLElement>("[data-itinerary-heading]")!;
  const intro = gsap.timeline({ paused: true });
  intro.arrive(sectionHeading.querySelector("[data-eyebrow]"));
  intro.settle(sectionHeading.querySelector("h2"), {}, 0.1);
  intro.stageArrival(stages[0], {}, 0.2);
  ScrollTrigger.create({
    trigger: root,
    start: "top 65%",
    onEnter: () => intro.play(),
    onEnterBack: () => intro.play(),
    onRefresh: (self) => { if (self.scroll() >= self.start) intro.progress(1); },
  });

  const at = (progress: number) => Math.min(stages.length - 1, Math.floor(progress * stages.length));
  const controller = ScrollTrigger.create({
    id: "wonder-itinerary",
    trigger: root,
    start: "top top",
    end: `+=${stages.length * 100}%`,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const index = at(self.progress);
      if (index !== selected) {
        intro.progress(1);
        context.showStage(index, self.isActive);
      }
    },
    onRefresh: (self) => {
      finish();
      context.showStage(at(self.progress), false);
      align(selected);
    },
  });

  const go = (index: number) => {
    const bounded = Math.max(0, Math.min(stages.length - 1, index));
    // The shared scroller keeps its own target in sync; writing window scroll
    // beside Lenis would pull the reader back toward its old target.
    smoothScrollTo(controller.start + (bounded + 0.08) * (controller.end - controller.start) / stages.length, 0.55);
  };
  context.add("chooseStage", (event: MouseEvent) => {
    const target = (event.target as Element).closest<HTMLElement>("[data-stage-head]");
    if (!target) return;
    event.preventDefault();
    go(headings.indexOf(target));
  });
  context.add("keyStage", (event: KeyboardEvent) => {
    const target = (event.target as Element).closest<HTMLElement>("[data-stage-head]");
    if (!target) return;
    const current = headings.indexOf(target);
    const next = event.key === "ArrowDown" ? current + 1
      : event.key === "ArrowUp" ? current - 1
      : event.key === "Home" ? 0
      : event.key === "End" ? stages.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    const bounded = Math.max(0, Math.min(stages.length - 1, next));
    clampScrollTo(controller.start + (bounded + 0.08) * (controller.end - controller.start) / stages.length);
    context.showStage(bounded, true);
    headings[bounded].focus({ preventScroll: true });
  });
  const click = (event: MouseEvent) => context.chooseStage(event);
  const keydown = (event: KeyboardEvent) => context.keyStage(event);
  root.addEventListener("click", click);
  root.addEventListener("keydown", keydown);

  return () => {
    root.removeEventListener("click", click);
    root.removeEventListener("keydown", keydown);
    active?.kill();
    revertSplits(root);
    rows.forEach((row, i) => {
      row.inert = false;
      headings[i].removeAttribute("tabindex");
    });
    delete root.dataset.itineraryMode;
    delete root.dataset.activeStage;
    root.style.removeProperty("--itinerary-span");
  };
}
