"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionModule } from "@/lib/motion-controller";
import { registerYachatdacEffects, revertSplits } from "./effects";

/**
 * Wonder §06, restored at 1440 × 900 on August's direction, 9 September 2026.
 * 14 September 2026, August's direction: the desktop held reading screen and
 * the automatic opening are removed. "Bad UX, no freedom on scroll" — the
 * sticky span took the page away from the reader, and a stop that opened by
 * itself moved the page under them. The itinerary is now one manual native
 * accordion at every width, day 1 open by default, and nothing but a click
 * changes a stop. Grammar: "the world opening" / disclose; "what endures" /
 * settle; "arriving quietly" / arrive; the rule under a stop still fills as a
 * scroll indicator ("the world opening", itinerary rule) but no longer opens
 * anything. Transition is the active channel.
 * Fonts load before mounting: `settle` splits and measures headings, and the
 * brand faces arrive late on a cold production load.
 * The controller owns this module and matchMedia owns every GSAP callback.
 */
export function itinerary(root: HTMLElement): MotionModule {
  let media: gsap.MatchMedia | undefined;
  let refreshTimer = 0;
  let resizeTimer = 0;
  let generation = 0;

  const refreshSoon = () => {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
  };

  const mount = () => {
    media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", (context) => {
      const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-stage-row]"));
      const end = root.querySelector<HTMLElement>("[data-stage-end]");
      const details = Array.from(root.querySelectorAll<HTMLDetailsElement>("[data-stage]"));
      let active: gsap.core.Timeline | undefined;
      let finishState: (() => void) | undefined;
      // ScrollTrigger wraps the held section; its next ground is then the
      // spacer's sibling, not the section's (including accordion toggles).
      const nextSection = () => (root.parentElement?.classList.contains("pin-spacer")
        ? root.parentElement : root).nextElementSibling;

      // Finish BEFORE THE CREST, not just the foot's hold (August,
      // 15 September 2026). The wave overhangs §07: at its first appearance
      // the old closing rule was only 61% drawn. Reserve its actual height
      // and 2vh of stillness; direct scrub cannot lag behind that deadline.
      // Grammar: "the world opening", itinerary rule.
      const MIN_RUN = 0.3;
      const wave = nextSection()?.querySelector<SVGSVGElement>(
        "[data-seam='wonder-wave-before']",
      );
      const finishBeforeWave = () =>
        root.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
        - (wave?.getBoundingClientRect().height ?? 0) - window.innerHeight * 0.02;
      const capped = (el: HTMLElement, startAt: number, endAt: number) => {
        // The row's reveal and accordion can translate ancestors of a rule.
        // Layout offsets exclude those transforms when a refresh remeasures.
        const top = () => {
          let offset = 0;
          for (let node: HTMLElement | null = el; node && node !== root; node = node.offsetParent as HTMLElement | null) {
            offset += node.offsetTop;
          }
          return root.getBoundingClientRect().top + window.scrollY + offset;
        };
        const end = () => Math.min(top() - window.innerHeight * endAt, finishBeforeWave());
        return {
          // Never spend the reveal below the viewport just to retain 30vh:
          // the closing rule has a shorter visible run before the crest.
          start: () => Math.max(top() - window.innerHeight,
            Math.min(top() - window.innerHeight * startAt, end() - window.innerHeight * MIN_RUN)),
          end,
          // Revert the parent's hold before measuring, including mid-hold
          // refreshes. The hold must be registered before these triggers.
          pinnedContainer: root,
          invalidateOnRefresh: true,
        };
      };
      const enter = (trigger: HTMLElement, targets: HTMLElement[]) => {
        if (!targets.length) return;
        const tl = gsap.timeline({ paused: true }).arrive(targets);
        const openStage = trigger.querySelector<HTMLDetailsElement>("details[open]");
        if (openStage) tl.stageArrival(openStage, {}, 0.1);
        ScrollTrigger.create({
          trigger,
          animation: tl,
          ...capped(trigger, 0.88, 0.2),
          scrub: true,
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

      /** One stop opens or closes. Only a click calls this (14 Sep 2026). */
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
        let sibling = nextSection();
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
      // The rule below a stop draws itself left to right as the stop passes
      // through the viewport. Grammar: "the world opening", itinerary rule.
      // It used to fill in burnt ochre and open the next day at a full fill
      // (10 Sep 2026); on 14 September 2026, August's direction, the opening
      // is removed and the draw is the artist's black dots being revealed,
      // not a colour. `data-rules-draw` tells the stylesheet the module is
      // driving the rules, so the static dots hide under the drawn layer;
      // without JavaScript the attribute is absent and the plain dots stay.
      // Every rule draws, the one above day 1 and the closing rule included
      // (both were skipped before and hid under the drawn layer).
      root.dataset.rulesDraw = "";
      // Capped before the crest like the rows above — the closing rule on desktop
      // and the rule above day 6 on the phone both sit within a screen of the
      // foot and used to be covered by §07's wave half-drawn.
      root.querySelectorAll<HTMLElement>("[data-stage-fill]").forEach((fill) => {
        ScrollTrigger.create({
          trigger: fill,
          animation: gsap.effects.stageRule(fill),
          ...capped(fill, 0.88, 0.55),
          scrub: true,
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
        delete root.dataset.rulesDraw;
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

  // A width change re-splits the headings, so the module remounts on it.
  // Mobile browsers fire resize whenever the address bar collapses, and a
  // remount there would restart entrances mid-scroll, so a height-only
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
