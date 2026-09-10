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
 * Six 100vh reading spans, plus measured overflow for taller stops. Mobile
 * keeps native disclosures. Closed-panel fonts load before measuring (cold
 * production loads previously rejected the layout until a resize).
 * The controller owns this module and matchMedia owns every GSAP callback.
 */
export function itinerary(root: HTMLElement): MotionModule {
  let media: gsap.MatchMedia | undefined;
  let refreshTimer = 0;
  let resizeTimer = 0;
  let generation = 0;

  const refreshSoon = () => {
    if (root.dataset.itineraryMode === "scroll") return;
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
  };

  const mount = () => {
    media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", (context) => {
      // DevTools can emulate a touch pointer at any width. Pointer type is
      // irrelevant to this scroll sequence; only the layout needs to fit.
      // 10 September 2026, August's direction, after reading the 375 frame:
      // the phone is the frame's accordion, not the held screen. Its height
      // follows the open stop rather than the frame's fixed 1047px.
      if (window.matchMedia("(min-width: 64rem)").matches) {
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
          animation: tl,
          start: "top 88%",
          end: "top 20%",
          scrub: 0.8,
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

      /** One stop opens or closes. Called by a click and, on the phone, by
          the rule below a stop reaching a full fill. */
      const runToggle = (stage: HTMLDetailsElement, open: boolean) => {
        const summary = stage.querySelector<HTMLElement>("[data-stage-head]");
        const panel = stage.querySelector<HTMLElement>("[data-stage-panel]");
        if (!summary || !panel) return;
        finish();

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
          following.forEach((el) => el.style.removeProperty("transform"));
        };
        active = gsap.timeline().add(gsap.effects.disclose(stage, { open, following, offsets }));
        // No heading reveal on a stop the reader opened: only the copy and
        // the picture arrive.
        if (open) active.stageArrival(stage, { title: false }, 0.12);
        active!.eventCallback("onComplete", () => {
          finishState?.();
          finishState = undefined;
          active = undefined;
          refreshSoon();
        });
      };

      context.add("toggleStage", (event: MouseEvent) => {
        const summary = (event.target as Element).closest<HTMLElement>("[data-stage-head]");
        if (!summary || !root.contains(summary)) return;
        const stage = summary.parentElement as HTMLDetailsElement;
        event.preventDefault();
        runToggle(stage, !stage.open);
      });
      context.add("advanceStage", (stage: HTMLDetailsElement, open: boolean) => {
        if (stage.open === open) return;
        runToggle(stage, open);
      });
      // The rule below a stop reads that stop's passage through the viewport,
      // and its full fill is what opens the next day (10 September 2026,
      // August's direction). Grammar: "the world opening", itinerary rule.
      // Nothing closes on the way down: opening a stop below the reader adds
      // height below them, so the page never jumps under the thumb; scrolling
      // back up past the same rule closes it again, which removes that same
      // height from below. The closing rule is skipped — the last day has no
      // next one to open.
      rows.forEach((row, index) => {
        const next = details[index + 1];
        const fill = rows[index + 1]?.querySelector<HTMLElement>("[data-stage-fill]");
        if (!fill || !next) return;
        ScrollTrigger.create({
          trigger: fill,
          animation: gsap.effects.stageRule(fill),
          start: "top bottom-=12%",
          end: "top 55%",
          scrub: 0.6,
          onLeave: () => context.advanceStage(next, true),
          onEnterBack: () => context.advanceStage(next, false),
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
        root.querySelectorAll<HTMLElement>("[data-stage-fill]")
          .forEach((fill) => fill.style.removeProperty("--stage-fill"));
      };
    }, root);
  };

  // document.fonts.ready only covers faces already used in visible content.
  // Closed stages use GoodDog too: measuring its fallback on a cold Vercel
  // load rejected the whole sequence, although a later resize worked.
  const mountWhenFontsReady = async () => {
    const version = ++generation;
    const fonts = new Set(Array.from(root.querySelectorAll<HTMLElement>(
      "h2, [data-stage-title], [data-stage-copy] p, [data-stage-copy] li",
    )).map((el) => {
      const style = getComputedStyle(el);
      return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    }));
    await Promise.allSettled(Array.from(fonts, (font) => document.fonts.load(font)));
    if (version !== generation || !root.isConnected) return;
    mount();
    ScrollTrigger.refresh();
  };

  // A width change can turn a short paragraph into a tall one even when it
  // stays inside the desktop breakpoint. Re-check fit, not just the query.
  // Mobile browsers fire resize whenever the address bar collapses, and a
  // remount there would drop the held screen mid-scroll, so a height-only
  // change under the toolbar's own travel is ignored (10 September 2026).
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  const onResize = () => {
    const sameWidth = window.innerWidth === lastWidth;
    const toolbarOnly = sameWidth && Math.abs(window.innerHeight - lastHeight) <= 140;
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;
    if (toolbarOnly) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      media?.revert();
      void mountWhenFontsReady();
    }, 240);
  };

  return {
    init() {
      registerYachatdacEffects();
      root.addEventListener("toggle", refreshSoon, true);
      window.addEventListener("resize", onResize);
      void mountWhenFontsReady();
    },
    destroy() {
      generation++;
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
  const heights = rows.map((el) => el.offsetHeight);
  const closingRule = root.querySelector<HTMLElement>("[data-stage-end]")?.offsetHeight ?? 0;
  // Keep the type and photo sizes. A long stop gets more document scroll,
  // rather than switching every stop to a manual accordion at laptop sizes.
  const fits = Math.max(...headings.map((el) => el.offsetHeight)) + 64 <= viewport.clientHeight;
  const overflow = heights.map((height) => Math.max(0, height + closingRule + 8 - viewport.clientHeight));
  stages.forEach((el, i) => { el.open = initialOpen[i]; });
  if (!fits) {
    delete root.dataset.itineraryMode;
    root.style.removeProperty("--itinerary-span");
    return null;
  }

  // The stage window, not the whole screen: on the phone the screen is the
  // tall box the window sticks inside, and overflow is measured against the
  // window in both cuts (10 September 2026).
  const viewHeight = viewport.clientHeight;
  const spans = overflow.map((extra) => 1 + extra / viewHeight);
  const starts = spans.map((_, index) => spans.slice(0, index).reduce((sum, value) => sum + value, 0));
  const totalSpan = spans.reduce((sum, value) => sum + value, 0);
  root.style.setProperty("--itinerary-span", `${totalSpan * 100}vh`);

  // The dotted rule under the active stop is the list's scroll indicator:
  // it fills in burnt ochre across that stop's span and is full at the
  // handover. Grammar: "the world opening", itinerary rule (10 Sep 2026).
  const fills = stages.map((_, index) =>
    (rows[index + 1] ?? root.querySelector<HTMLElement>("[data-stage-end]"))
      ?.querySelector<HTMLElement>("[data-stage-fill]") ?? null);
  const paint = (index: number, ratio: number) => {
    fills.forEach((fill, i) => {
      if (!fill) return;
      const value = i < index ? 1 : i > index ? 0 : gsap.utils.clamp(0, 1, ratio);
      fill.style.setProperty("--stage-fill", `${value * 100}%`);
    });
  };

  let selected = -1;
  let active: gsap.core.Timeline | undefined;
  let rowOffset = 0;
  const finish = () => { active?.progress(1); active = undefined; };
  const align = (index: number, read = 0) => {
    // offsetTop rounds the 9.59848px SVG rules and drifts almost a pixel
    // between stops. Rectangle differences retain the subpixel geometry.
    rowOffset = rows[index].getBoundingClientRect().top - track.getBoundingClientRect().top;
    gsap.set(track, { y: -rowOffset - read });
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
    animation: intro,
    start: "top 65%",
    end: "top 20%",
    scrub: 0.8,
  });

  const at = (progress: number) => {
    const position = progress * totalSpan;
    const next = starts.findIndex((start) => start > position);
    return next === -1 ? stages.length - 1 : Math.max(0, next - 1);
  };
  const fillAt = (progress: number, index: number) =>
    (progress * totalSpan - starts[index]) / spans[index];
  const readAt = (progress: number, index: number) =>
    gsap.utils.clamp(0, overflow[index], (progress * totalSpan - starts[index] - 0.2) * viewHeight);
  const controller = ScrollTrigger.create({
    id: "wonder-itinerary",
    trigger: root,
    start: "top top",
    end: `+=${totalSpan * 100}%`,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const index = at(self.progress);
      if (index !== selected) {
        intro.progress(1);
        context.showStage(index, self.isActive);
      }
      // Only transform work on scroll. Geometry is measured at selection or
      // refresh; oversized copy travels through the same clipped track.
      gsap.set(track, { y: -rowOffset - readAt(self.progress, index) });
      paint(index, fillAt(self.progress, index));
    },
    onRefresh: (self) => {
      finish();
      context.showStage(at(self.progress), false);
      align(selected, readAt(self.progress, selected));
      paint(selected, fillAt(self.progress, selected));
    },
  });

  const go = (index: number) => {
    const bounded = Math.max(0, Math.min(stages.length - 1, index));
    // The shared scroller keeps its own target in sync; writing window scroll
    // beside Lenis would pull the reader back toward its old target.
    smoothScrollTo(controller.start + (starts[bounded] + 0.08) * (controller.end - controller.start) / totalSpan, 0.55);
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
    clampScrollTo(controller.start + (starts[bounded] + 0.08) * (controller.end - controller.start) / totalSpan);
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
    fills.forEach((fill) => fill?.style.removeProperty("--stage-fill"));
    rows.forEach((row, i) => {
      row.inert = false;
      headings[i].removeAttribute("tabindex");
    });
    delete root.dataset.itineraryMode;
    delete root.dataset.activeStage;
    root.style.removeProperty("--itinerary-span");
  };
}
