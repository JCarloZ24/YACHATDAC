"use client";

/** Our People gathers — F7 / D5 / D12, user direction 11 September 2026.
 * One canvas, one pin and one clock, following the homepage. The existing
 * document is the scene's text layer, so selection, links and CMS copy survive.
 * Nothing hijacks wheel/touch input. Longer paragraphs lengthen the journey.
 * All effects cite the Our People rows in docs/motion/motion-grammar.md.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced, type MotionModule } from "@/lib/motion-controller";
import { registerYachatdacEffects, revertSplits } from "./effects";
import { EASE } from "./tokens";
import { PEOPLE_HANDOFF_VH, PEOPLE_PHOTO_HOLD, peopleTimeAt, type PeopleLeg, type PeopleState, type PeopleStop } from "./effects/people";
import { clampScrollTo, refreshScrollBounds } from "./smooth-scroll";
import { createPeopleWorld, peopleBox, type PeopleSection } from "./our-people-world";
import { cardPassOpacity } from "./record-masonry";

gsap.registerPlugin(ScrollTrigger);

export function createOurPeople(root: HTMLElement, canvas: HTMLCanvasElement): MotionModule {
  let cleanup = () => {};
  let position: { scene: number; fraction: number } | { after: number } | undefined;
  let restoreFocus: HTMLElement | null = null;
  let escaped = false;
  const destroy = () => {
    cleanup();
    canvas.removeEventListener("webglcontextrestored", init);
    window.removeEventListener("afterprint", init);
  };

  function init() {
    destroy();
    const track = root.querySelector<HTMLElement>("[data-people-track]");
    if (!track) return;
    let disposed = false;
    let context: gsap.Context | undefined;
    let world: ReturnType<typeof createPeopleWorld> | undefined;
    let trigger: ScrollTrigger | undefined;
    let timeline: gsap.core.Timeline | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let mutation: MutationObserver | undefined;
    let sections: PeopleSection[] = [];
    const state: PeopleState = { travel: 0, knockout: 0, reveal: 1 };
    const legs: PeopleLeg[] = [];
    let frame = 0;
    let focusFrame = 0;
    let resizeTimer = 0;
    let viewport = 0;
    let width = 0;
    let maxTravel = 0;
    let contentHeight = 0;
    let lastScene = -1;
    let refreshing = false;
    let refreshFocus: HTMLElement | null = null;
    let lastFocused: HTMLElement | null = null;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const printing = window.matchMedia("print");
    const setTrack = gsap.quickSetter(track, "y", "px");
    const heroFrame = track.querySelector<HTMLElement>("[data-people-hero-frame]");
    const heroCopy = track.querySelector<HTMLElement>("[data-people-hero-copy]");
    const setHeroFrame = heroFrame ? gsap.quickSetter(heroFrame, "y", "px") : null;
    const setHeroCopy = heroCopy ? gsap.quickSetter(heroCopy, "y", "px") : null;
    let heroFlight: { frameTravel: number; titleTravel: number } | undefined;
    // User direction, 14 September 2026: the Our People hero stays put and
    // Suzanne's section rises over it, instead of both scrolling away.
    const heroSection = track.querySelector<HTMLElement>('[data-people-scene="hero"]');
    const setHeroSection = heroSection ? gsap.quickSetter(heroSection, "y", "px") : null;
    let heroHold: { start: number; end: number; bottom: number } | undefined;
    // Marc's review, 14 September 2026: the team cards take The Record's card
    // entrance — they fade IN and OUT at the viewport edges instead of all six
    // lighting at once off the first card's position, and nothing travels
    // sideways any more. Measured once per build; `paint` only does maths.
    // Grammar: "being drawn in", Our People cards.
    let cardPass: { card: HTMLElement; top: number; height: number; index: number; hidden: boolean; rate: number }[] = [];
    // ⚑ THE WORLD OPENING, Suzanne's portrait — 15 September 2026, user
    // direction ("same as the one from living work where it's getting big").
    // Living Work's break frame (clusterDescent, recipes.ts) opens its clip
    // from inset(16% 12%) to the whole frame while the frame's top travels
    // from 92% to 40% of the screen, eased `country`, the picture held at
    // scale 1 (frame grade), and a caption settling in from halfway. The same
    // numbers here — but read off the frame's SCREEN position each paint, not
    // placed on the timeline: this page holds its track still at stops while
    // the clock runs on, and a timed open played out during a hold with the
    // photograph barely on screen. The canvas draws the photograph, so the
    // window itself is an inset in our-people-world.ts.
    //
    // ⚑ RETUNED, same day, user report ("you can barely see that transition
    // … when i get to the whole image it's already done"). Living Work's
    // numbers were copied too literally: `country` is a steep ease-out, so
    // 80% of the open had happened in the first third of the travel, before
    // the photograph was fully on screen. Now the window starts smaller
    // (see PORTRAIT_INSET in our-people-world.ts), runs from the frame's top
    // at 95% of the screen to 14% — just before the page's own "portrait"
    // stop at 12% — so it is still opening while the whole picture is in
    // view, and eases `sine.inOut` so the growth is spread across the travel.
    const PORTRAIT_FROM = 0.95;
    const PORTRAIT_TO = 0.14;
    let portraitPass: { top: number; caption: HTMLElement | null } | undefined;
    // Resolved on first paint: the `country` CustomEase is registered by
    // registerYachatdacEffects inside build, after this closure is created.
    let countryEase: ((progress: number) => number) | undefined;
    const country = (progress: number) => (countryEase ??= gsap.parseEase(EASE.country))(progress);
    const even = gsap.parseEase("sine.inOut");
    // The same hold for Who decides under the team (14 Sep 2026). Its canvas
    // ground scrolls with the camera, so a roasted veil, clipped at the
    // team's top edge, stands in for it while the section is held.
    const decisionSection = track.querySelector<HTMLElement>('[data-people-scene="decision"]');
    const setDecisionSection = decisionSection ? gsap.quickSetter(decisionSection, "y", "px") : null;
    const holdVeil = root.querySelector<HTMLElement>("[data-people-hold-veil]");
    let decisionHold: { start: number; end: number; bottom: number } | undefined;

    const paint = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (disposed || document.hidden || !world) return;
      setTrack(-state.travel);
      if (heroFlight && setHeroFrame) setHeroFrame(gsap.utils.clamp(
        0, heroFlight.titleTravel - heroFlight.frameTravel, state.travel - heroFlight.frameTravel,
      ));
      // Y1: supporting copy appears at its resting location while the aperture
      // lands. At the end of the handoff its local transform reaches zero.
      if (heroFlight && setHeroCopy) setHeroCopy(state.knockout > 0 && state.knockout < 1
        ? state.travel - heroFlight.titleTravel : 0);
      if (heroHold && heroSection && setHeroSection) {
        const offset = gsap.utils.clamp(0, heroHold.end - heroHold.start, state.travel - heroHold.start);
        const floor = heroHold.end - state.travel;
        state.heroOffset = offset;
        state.heroFloor = offset > 0 ? floor : undefined;
        setHeroSection(offset);
        const hidden = offset > 0 ? Math.max(0, heroHold.bottom - heroHold.start - floor) : 0;
        heroSection.style.clipPath = hidden ? `inset(0 0 ${hidden}px 0)` : "";
      }
      if (decisionHold && decisionSection && setDecisionSection && holdVeil) {
        const offset = gsap.utils.clamp(0, decisionHold.end - decisionHold.start, state.travel - decisionHold.start);
        const floor = decisionHold.end - state.travel;
        setDecisionSection(offset);
        const hidden = offset > 0 ? Math.max(0, decisionHold.bottom - decisionHold.start - floor) : 0;
        decisionSection.style.clipPath = hidden ? `inset(0 0 ${hidden}px 0)` : "";
        holdVeil.style.opacity = offset > 0 ? "1" : "0";
        holdVeil.style.clipPath = offset > 0 ? `inset(0 0 ${Math.max(0, viewport - floor)}px 0)` : "";
      }
      for (const entry of cardPass) {
        const fade = cardPassOpacity({
          top: entry.top - state.travel, height: entry.height, viewport, index: entry.index,
        });
        // A custom property, not an opacity tween: the canvas draws each card's
        // photograph and reads this same value back, and the ordinary-flow
        // fallback simply never defines it (our-people.css defaults it to 1).
        entry.card.style.setProperty("--people-card-fade", String(fade));
        // ⚑ THE RECORD'S COLUMN DRIFT, 15 September 2026, user direction
        // ("the cards are like in a random position when scrolling then
        // going to the fixed place where they are all uniform"): each column
        // rides lower by its own share of the screen — The Record's
        // 6/14/9/18vh, cycled by column — and settles into the even row as
        // its top rises from the screen's foot to 30%, ahead of the row's
        // own stop at 12%. Desktop only, as on The Record (`rate` is 0 below
        // lg). Linear, like the catalogue: it is the scroll shown as drift.
        if (entry.rate) {
          const settle = gsap.utils.clamp(0, 1, (viewport - (entry.top - state.travel)) / (viewport * 0.7));
          const lift = entry.rate * viewport * (1 - settle);
          entry.card.style.setProperty("--people-card-y", String(lift));
          entry.card.style.transform = lift ? `translateY(${lift}px)` : "";
        }
        // A card the reader cannot see must not take a tab stop. Written only
        // on the change, so a scroll frame is still one property write.
        const hidden = fade < 0.01;
        if (hidden !== entry.hidden) {
          entry.hidden = hidden;
          entry.card.style.visibility = hidden ? "hidden" : "";
        }
      }
      if (portraitPass) {
        const top = portraitPass.top - state.travel;
        const progress = gsap.utils.clamp(0, 1,
          (viewport * PORTRAIT_FROM - top) / (viewport * (PORTRAIT_FROM - PORTRAIT_TO)));
        state.portraitOpen = even(progress);
        if (portraitPass.caption) {
          // The caption settles in over the last third of the open.
          const settle = country(gsap.utils.clamp(0, 1, (progress - 0.66) / 0.3));
          portraitPass.caption.style.opacity = String(settle);
          portraitPass.caption.style.transform = settle < 1 ? `translateY(${14 * (1 - settle)}px)` : "";
        }
      }
      world.render(state);
      const index = sections.findLastIndex(section => section.top <= state.travel + viewport * 0.35);
      if (index !== lastScene && index >= 0) {
        root.dataset.peopleActive = sections[index].element.dataset.peopleScene;
        lastScene = index;
      }
    };
    const invalidate = () => {
      if (!disposed && !frame && !document.hidden) frame = requestAnimationFrame(paint);
    };

    const release = () => {
      if (disposed) return;
      const inStage = Boolean(trigger && window.scrollY >= trigger.start && window.scrollY <= trigger.end);
      const afterStage = trigger && window.scrollY > trigger.end ? window.scrollY - trigger.end : 0;
      const rootTop = trigger?.start ?? 0;
      const focused = document.activeElement instanceof HTMLElement && track.contains(document.activeElement)
        ? document.activeElement : null;
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(focusFrame);
      clearTimeout(resizeTimer);
      resizeObserver?.disconnect();
      mutation?.disconnect();
      preference.removeEventListener("change", restart);
      printing.removeEventListener("change", restart);
      canvas.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("beforeprint", onPrint);
      document.removeEventListener("visibilitychange", invalidate);
      document.fonts.removeEventListener("loadingdone", schedule);
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("focusout", onFocusOut);
      ScrollTrigger.removeEventListener("matchMedia", onMediaRefresh);
      root.removeEventListener("scroll", onStageScroll);
      document.removeEventListener("click", onAnchor, true);
      trigger?.kill();
      context?.revert();
      revertSplits(track);
      world?.destroy();
      gsap.set(track, { clearProps: "transform" });
      if (heroFrame) { gsap.set(heroFrame, { clearProps: "transform" }); heroFrame.style.removeProperty("--people-hero-fade"); }
      const advisory = track.querySelector<HTMLElement>('[data-people-scene="advisory"]');
      if (advisory) gsap.set(advisory, { clearProps: "opacity" });
      if (heroCopy) gsap.set(heroCopy, { clearProps: "transform" });
      cardPass.forEach(({ card }) => {
        card.style.removeProperty("--people-card-fade");
        card.style.removeProperty("--people-card-y");
        card.style.removeProperty("visibility");
        card.style.transform = "";
      });
      cardPass = [];
      if (portraitPass?.caption) { portraitPass.caption.style.opacity = ""; portraitPass.caption.style.transform = ""; }
      portraitPass = undefined;
      state.portraitOpen = undefined;
      // The ordinary document shows the fact, not a count that will never
      // run: a fallback has no clock to reach the ratio with.
      track.querySelectorAll<HTMLElement>("[data-people-count]").forEach(count => { count.textContent = `${count.dataset.peopleCount}%`; });
      const veil = root.querySelector<HTMLElement>("[data-people-veil]");
      if (veil) gsap.set(veil, { clearProps: "opacity" });
      root.querySelectorAll("[data-people-pattern], [data-people-pattern-box], [data-people-pattern-ring]")
        .forEach(element => gsap.set(element, { clearProps: "opacity,top,height,backgroundColor" }));
      if (heroSection) { gsap.set(heroSection, { clearProps: "transform" }); heroSection.style.clipPath = ""; }
      heroHold = undefined;
      if (decisionSection) { gsap.set(decisionSection, { clearProps: "transform" }); decisionSection.style.clipPath = ""; }
      if (holdVeil) { holdVeil.style.opacity = ""; holdVeil.style.clipPath = ""; }
      decisionHold = undefined;
      root.removeAttribute("data-people-ready");
      root.dataset.pageReady = "fallback";
      root.removeAttribute("data-people-active");
      sections.forEach(section => section.element.removeAttribute("data-people-scroll"));
      refreshScrollBounds();
      // The fallback returns to the same content, rather than the old pin's
      // much larger scroll offset throwing the reader down to the footer.
      if (inStage && root.isConnected) clampScrollTo(rootTop + state.travel);
      else if (afterStage && root.isConnected) clampScrollTo(rootTop + maxTravel + afterStage);
      // Pin reparenting can blur the active link even though it survives.
      if (focused?.isConnected) focused.focus({ preventScroll: true });
    };
    cleanup = release;

    function rememberPosition() {
      if (position) return;
      // Preserve what the reader sees, including the footer after the pin.
      // The upper third matches the scene marker, even when its crest is
      // still entering from the preceding section at a different viewport.
      const gaze = state.travel + viewport * 0.35;
      const index = sections.findLastIndex(section => section.top <= gaze);
      if (trigger && window.scrollY > trigger.end) position = { after: window.scrollY - trigger.end };
      else if (index >= 0) position = { scene: index, fraction: (gaze - sections[index].top) / sections[index].height };
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.closest("[data-people-scene]") === sections[index]?.element) {
        restoreFocus = active;
      }
    }
    const restart = () => {
      if (disposed) return;
      rememberPosition();
      init();
    };
    function onLost(event: Event) {
      event.preventDefault();
      release();
      // A backgrounded browser may restore this context. The complete HTML
      // is visible meanwhile; no stacked absolute panels can strand a reader.
      canvas.addEventListener("webglcontextrestored", init, { once: true });
    }
    function onKey(event: KeyboardEvent) {
      if ((event.key === "Escape" && !event.altKey && !event.ctrlKey && !event.metaKey)
        || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f")) {
        escaped = true;
        release();
      }
    }
    function onPrint() {
      release();
      if (!escaped) window.addEventListener("afterprint", init, { once: true });
    }
    function seek(element: HTMLElement, alignment = 0.16) {
      if (!trigger || !timeline) return;
      const y = gsap.utils.clamp(0, maxTravel, peopleBox(element, track!).top - viewport * alignment);
      const time = peopleTimeAt(legs, y);
      root.scrollTop = 0;
      goTo(time);
    }
    function goTo(time: number, after = 0) {
      if (!trigger || !timeline) return;
      clampScrollTo(trigger.start + time * viewport + after);
      trigger.update();
      timeline.time(time);
      paint();
    }
    function onFocus(event: FocusEvent) {
      if (event.target instanceof HTMLElement) lastFocused = event.target;
      if (refreshing) return;
      const target = event.target;
      if (target instanceof HTMLElement && track!.contains(target)) {
        seek(target, 0.24);
        // Native focus may scroll the clipped stage before the mobile rail.
        // Give the rail its own horizontal correction after seeking the clock.
        for (let parent = target.parentElement; parent && parent !== track; parent = parent.parentElement) {
          if (parent.scrollWidth <= parent.clientWidth + 1) continue;
          const style = getComputedStyle(parent);
          if (!/auto|scroll/.test(style.overflowX)) continue;
          const bounds = parent.getBoundingClientRect();
          const box = target.getBoundingClientRect();
          const left = bounds.left + parseFloat(style.paddingLeft || "0");
          const right = bounds.right - parseFloat(style.paddingRight || "0");
          if (box.left < left) parent.scrollLeft += box.left - left;
          else if (box.right > right) parent.scrollLeft += box.right - right;
        }
      }
    }
    function onFocusOut(event: FocusEvent) {
      const target = event.target;
      queueMicrotask(() => {
        if (!disposed && lastFocused === target && document.activeElement !== target) lastFocused = null;
      });
    }
    function onMediaRefresh() {
      // GSAP's shared orientation matchMedia reverts every pin before its
      // ordinary refresh callbacks. Its final event runs after reparenting,
      // within the same task, so a keyboard link can keep its focus.
      if (!disposed && document.activeElement === document.body && lastFocused?.isConnected) {
        refreshing = true;
        lastFocused.focus({ preventScroll: true });
        refreshing = false;
      }
    }
    function onStageScroll() {
      // Focusing a clipped child can scroll overflow:hidden even though it
      // has no scrollbar. That would move HTML without moving the camera.
      if (root.scrollTop) root.scrollTop = 0;
    }
    function hashTarget() {
      try {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        return target && track!.contains(target) ? target : null;
      } catch { return null; }
    }
    function onHash() {
      const target = hashTarget();
      if (target) seek(target);
    }
    function schedule() {
      rememberPosition();
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(restart, 180);
    }
    function onAnchor(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      let target: HTMLElement | null = null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!target || !track!.contains(target)) return;
      event.preventDefault();
      // Keep Next's history state and ordinary back-button semantics.
      history.pushState(history.state, "", url.hash);
      seek(target);
    }

    preference.addEventListener("change", restart);
    printing.addEventListener("change", restart);
    if (prefersReduced() || printing.matches || escaped) {
      root.dataset.pageReady = "fallback";
      // Reading can continue in the ordinary document. Re-enabling motion
      // measures that new position instead of restoring an older saved one.
      position = undefined;
      restoreFocus = null;
      return;
    }

    async function build() {
      // X7 / SYS-02: keep the cover through asynchronous scene composition.
      root.dataset.pageReady = "loading";
      await document.fonts.ready;
      if (disposed) return;
      try {
        const focused = document.activeElement instanceof HTMLElement && track!.contains(document.activeElement)
          ? document.activeElement : null;
        const oldTop = root.getBoundingClientRect().top + window.scrollY;
        const nativeTravel = Math.max(0, window.scrollY - oldTop);
        // Read token-resolved grounds before the enhanced stylesheet hands
        // them to Three. Values stay in globals.css, never duplicated here.
        const elements = Array.from(track!.querySelectorAll<HTMLElement>(":scope > [data-people-scene]"));
        const colors = elements.map(element => getComputedStyle(element).backgroundColor);
        root.dataset.peopleReady = "true";
        width = root.clientWidth;
        viewport = root.clientHeight;
        contentHeight = track!.scrollHeight;
        maxTravel = Math.max(0, contentHeight - viewport);
        sections = elements.map((element, index) => {
          const box = peopleBox(element, track!);
          return { element, top: box.top, height: box.height, color: colors[index] };
        });
        context = gsap.context(() => {
          registerYachatdacEffects();
          // "open", was "advisory": the page's first screen is the hero
          // photograph since the advisory moved to the loading cover
          // (15 September 2026, user direction).
          const stops: PeopleStop[] = [{ y: 0, hold: 0.12, key: "open" }];
          const addStop = (element: HTMLElement | null, hold: number, key: string, align = 0.28) => {
            if (!element) return;
            const box = peopleBox(element, track!);
            const available = Math.max(viewport * 0.08, (viewport - Math.min(box.height, viewport * 0.84)) / 2);
            const y = gsap.utils.clamp(0, maxTravel, box.top - Math.min(viewport * align, available));
            const stop: PeopleStop = { y, hold, key };
            stops.push(stop);
            return stop;
          };
          const title = track!.querySelector<HTMLElement>("[data-people-title]");
          const titleStop = addStop(title?.parentElement ?? null, 0.6, "title", 0.24);
          if (heroFrame && titleStop) {
            const photo = peopleBox(heroFrame, track!);
            heroFlight = {
              frameTravel: photo.top + Math.max(0, (photo.height - viewport) / 2),
              titleTravel: titleStop.y,
            };
          }
          // Measure masks before any effect changes HTML opacity/transforms.
          world = createPeopleWorld(canvas, track!, sections, width, viewport, invalidate, heroFlight);
          // User direction, 14 September 2026: scrolling off the advisory
          // does not scroll the photograph up. The advisory fades out on the
          // spot, the track cuts across the shared charcoal while the screen
          // is empty, and the photograph fades in where it is held.
          //
          // ⚑ 15 September 2026: the advisory is no longer on the page, so
          // there is nothing to fade out and the photograph is simply there
          // at the top. The fade stays wired for a markup that still carries
          // an advisory scene, and is skipped when none is found.
          const advisoryScene = track!.querySelector<HTMLElement>('[data-people-scene="advisory"]');
          const fadeIn = advisoryScene && world.hasPortal && heroFlight && titleStop ? 0.9 : 0;
          if (fadeIn && heroFlight) {
            stops.push({ y: 0, hold: 0.7, key: "advisory-out" });
            state.reveal = 0;
          }
          if (world.hasPortal && heroFlight && titleStop) {
            stops.push({ y: heroFlight.frameTravel, hold: fadeIn + PEOPLE_PHOTO_HOLD, key: "hero-photo", travelVh: 0.1 });
            titleStop.travelVh = PEOPLE_HANDOFF_VH;
          } else heroFlight = undefined;
          const suzanne = sections.find(section => section.element.dataset.peopleScene === "suzanne");
          if (heroSection && suzanne && titleStop) {
            const hero = peopleBox(heroSection, track!);
            // Hold from the moment the hero's foot (or its title stop) is
            // reached until Suzanne's top reaches the viewport crown.
            const start = Math.max(titleStop.y, hero.top + hero.height - viewport);
            if (suzanne.top > start) heroHold = { start, end: suzanne.top, bottom: hero.top + hero.height };
          }
          addStop(track!.querySelector('[data-people-scene="suzanne"] figure'), 0.25, "portrait", 0.12);
          const quote = track!.querySelector<HTMLElement>("[data-people-testimony] p");
          // The blockquote is one full screen (14 Sep 2026): stop with it
          // filling the viewport exactly.
          const testimony = track!.querySelector<HTMLElement>("[data-people-testimony-screen]");
          const blockquote = track!.querySelector<HTMLElement>("[data-people-testimony]");
          if (testimony) {
            const box = peopleBox(testimony, track!);
            stops.push({ y: gsap.utils.clamp(0, maxTravel, box.top + (box.height - viewport) / 2), hold: 2.4, key: "testimony" });
          } else addStop(quote, 1.15, "testimony", 0.3);
          const decision = track!.querySelector<HTMLElement>('[data-people-scene="decision"] .headline');
          // User direction, 14 September 2026: the testimony and Who decides
          // are ONE screen. After the quotation holds, it clears, the roasted
          // ground washes over the canvas (a veil under the text track), the
          // track cuts to Who decides while the screen is a single colour, and
          // the ring pattern and the sentence come up on that same ground.
          const veil = root.querySelector<HTMLElement>("[data-people-veil]");
          const decisionScene = track!.querySelector<HTMLElement>('[data-people-scene="decision"]');
          const merged = Boolean(veil && decisionScene && testimony && decision);
          if (merged && decisionScene) {
            const box = peopleBox(decisionScene, track!);
            const held = stops.find(stop => stop.key === "testimony");
            if (held) stops.push({ y: held.y, hold: 1.1, key: "decision-veil" });
            stops.push({ y: gsap.utils.clamp(0, maxTravel, box.top + Math.max(0, (box.height - viewport) / 2)),
              hold: 2.3, key: "decision", travelVh: 0.1 });
          } else addStop(decision, 0.55, "decision", 0.3);

          const cards = Array.from(track!.querySelectorAll<HTMLElement>("[data-people-card]"));
          const rows: HTMLElement[][] = [];
          for (const card of cards) {
            const top = peopleBox(card, track!).top;
            const row = rows.find(items => Math.abs(peopleBox(items[0], track!).top - top) < 2);
            if (row) row.push(card); else rows.push([card]);
          }
          rows.forEach((row, index) => addStop(row[0], 0.35, `team-${index}`, 0.12));
          // The card entrance reads document position against the reading
          // clock rather than riding the timeline, so each row genuinely
          // arrives at its OWN stop — the one grouped fade this replaces lit
          // row two long before `team-1` was reached. Measured here, with the
          // rest of the page's geometry, and never inside a scroll frame.
          const portraitFrame = track!.querySelector<HTMLElement>('[data-people-scene="suzanne"] figure [data-media]');
          portraitPass = portraitFrame ? {
            top: peopleBox(portraitFrame, track!).top,
            caption: portraitFrame.parentElement?.querySelector<HTMLElement>("figcaption") ?? null,
          } : undefined;
          // Columns by measured left edge, as The Record reads its own.
          const cardColumns = [...new Set(cards.map(card => Math.round(peopleBox(card, track!).left)))].sort((a, b) => a - b);
          const drifts = width >= 1024 ? [0.06, 0.14, 0.09, 0.18] : [0];
          cardPass = cards.map((card, index) => {
            const box = peopleBox(card, track!);
            const column = Math.max(0, cardColumns.indexOf(Math.round(box.left)));
            return { card, top: box.top, height: box.height, index, hidden: false, rate: drifts[column % drifts.length] };
          });
          const ratio = track!.querySelector<HTMLElement>("[data-people-ratio]");
          addStop(ratio, 2.4, "ratio", 0.5);
          const names = Array.from(track!.querySelectorAll<HTMLElement>('[data-people-scene="acknowledgements"] li'));
          names.forEach((name, index) => addStop(name, 0.16, `name-${index}`, 0.28));
          stops.push({ y: maxTravel, hold: 0.4, key: "contact-end" });
          stops.sort((a, b) => a.y - b.y);
          timeline = gsap.effects.peopleJourney(root, { state, stops, legs, viewport });
          if (!timeline) return;
          const at = (element: HTMLElement, screenFraction = 0.8) =>
            peopleTimeAt(legs, Math.max(0, peopleBox(element, track!).top - viewport * screenFraction));

          if (title) timeline.add(gsap.effects.peopleKnockout(title, {
            state,
            duration: heroFlight ? PEOPLE_HANDOFF_VH / 100 : 0.65,
            frame: heroFlight ? heroFrame : undefined,
            copy: heroFlight ? heroCopy : undefined,
          }), heroFlight ? `hero-photo+=${fadeIn + PEOPLE_PHOTO_HOLD}` : at(title, 0.95));
          if (fadeIn && heroFrame) {
            if (advisoryScene) timeline.fromTo(advisoryScene, { opacity: 1 }, { opacity: 0, duration: 0.7, ease: "sine.inOut" }, "advisory-out");
            // The photo plane and the HTML furniture on it (scrim, artwork,
            // stand-in marker) share one value. A custom property, so the
            // knockout's own opacity tween on the frame is never contested.
            heroFrame.style.setProperty("--people-hero-fade", "0");
            timeline.fromTo(state, { reveal: 0 }, {
              reveal: 1, duration: fadeIn, ease: "sine.inOut",
              onUpdate: () => heroFrame.style.setProperty("--people-hero-fade", String(state.reveal)),
            }, "hero-photo");
          }
          // User direction, 14 September 2026: her words enter the way the
          // homepage's closing line does ("A way forward, for whoever needs
          // one.", homeWayForward) — the screen is empty for a beat, then the
          // sentence is simply there, resolving in place. Opacity only, so it
          // still honours testimony's stillness; replaces the per-word `dim`.
          if (quote && testimony && blockquote) {
            const [mark, , cite] = Array.from(blockquote.children);
            // Then, as before, the words brighten one by one with the scroll
            // (user, same day: keep the text's scroll animation) — the line
            // fades up at `dim`'s resting 28% and the reading lights it.
            if (mark) timeline.fromTo(mark, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: "sine.inOut" }, "testimony+=0.15");
            timeline.fromTo(quote, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "sine.inOut" }, "testimony+=0.3");
            const speech = gsap.effects.dim(quote) as gsap.core.Timeline;
            speech.duration(1.1);
            timeline.add(speech, "testimony+=0.8");
            if (cite) timeline.fromTo(cite, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "sine.inOut" }, "testimony+=1.7");
            // The quotation's editorial note used to follow her name here. It
            // came off the page on 14 September 2026, so nothing follows.
          } else if (quote) {
            const speech = gsap.effects.dim(quote) as gsap.core.Tween;
            speech.duration(0.85);
            timeline.add(speech, "testimony");
          }
          if (merged && veil && testimony && decision && decisionScene) {
            // The words clear; the screen and its scrim stay under the wash
            // (15 Sep 2026), so the photograph does not brighten as it goes.
            timeline.to(blockquote ?? testimony, { autoAlpha: 0, duration: 0.5, ease: "sine.inOut" }, "decision-veil");
            // The scrim sits above the wash (it is in the track, the veil is
            // under it), so it clears on the wash's own tempo: photograph and
            // scrim give way to the roasted ground together, with no dark
            // brown step at the cut.
            const scrims = testimony.querySelectorAll("[data-people-testimony-scrim]");
            if (scrims.length) timeline.to(scrims, { opacity: 0, duration: 0.9, ease: "sine.inOut" }, "decision-veil+=0.2");
            timeline.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "sine.inOut" }, "decision-veil+=0.2");
            // The section's own roasted ground is now under the veil.
            timeline.set(veil, { opacity: 0 }, "decision");
            // The pattern is already on the testimony screen (user, 14 Sep
            // 2026) and only changes colour with the wash; at the cut the
            // section's own rings, at the identical place, take over.
            const decisionStop = stops.find(stop => stop.key === "decision");
            const team = sections.find(section => section.element.dataset.peopleScene === "team");
            if (decisionStop && team && team.top > decisionStop.y) {
              const scene = peopleBox(decisionScene, track!);
              decisionHold = { start: decisionStop.y, end: team.top, bottom: scene.top + scene.height };
            }
            // Who decides' rings (15 September 2026, user direction): kept off
            // the full-bleed photograph, so they come up only after the cut,
            // on the roasted ground alone, and TURN at Living Work's tempo
            // (20 degrees per unit, linear, scrubbed) from there until the team
            // section reaches the top. Inner <img> only.
            const decisionRings = decisionScene.querySelector<HTMLElement>("[data-people-decision-rings]");
            if (decisionRings) {
              timeline.fromTo(decisionRings, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: "sine.inOut" }, "decision");
              const team = sections.find(section => section.element.dataset.peopleScene === "team");
              const turnFrom = timeline.labels.decision ?? at(decisionScene, 0);
              const turnFor = Math.max(0.5, (team ? peopleTimeAt(legs, team.top) : timeline.duration()) - turnFrom);
              timeline.fromTo(decisionRings.querySelectorAll("[data-artwork] > img"), { rotation: 0 },
                { rotation: 20 * turnFor, duration: turnFor, ease: "none" }, turnFrom);
            }
            const eyebrow = decisionScene.querySelector(".eyebrow");
            // User direction, 14 September 2026: the same entrance as the
            // quotation — label first, then the sentence resolves in place at
            // 28% and brightens word by word with the scroll.
            if (eyebrow) timeline.fromTo(eyebrow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: "sine.inOut" }, "decision+=0.15");
            timeline.fromTo(decision, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "sine.inOut" }, "decision+=0.3");
            const authority = gsap.effects.dim(decision) as gsap.core.Tween;
            authority.duration(1.1);
            timeline.add(authority, "decision+=0.8");
          } else if (decision) timeline.add(gsap.effects.settle(decision, { duration: 0.4, stagger: 0.06 }), at(decision, 0.85));
          // The team cards are NOT on this timeline. Marc's review, 14
          // September 2026: they take The Record's card entrance, which is a
          // function of where a card sits on the screen, not of a position on
          // the clock — see `cardPass` above and the pass in `paint`. The one
          // grouped fade that used to live here (and, before it, the
          // sideways `peopleGather` Marc read as "cards going left and
          // right") are both gone.
          // User direction, 14 September 2026 (after Living Work's rolling
          // figures): the bar fills with the scroll while the page holds on
          // it, and the numbers count up with it — 80 while the gold 4/5
          // draws, 20 while the last 1/5 does. Scrubbed, so it runs back too.
          if (ratio) {
            // The span the count is drawn over. Halved by user direction on 14
            // September 2026 and NOT reopened by Marc's review — his note was
            // about the figure's resting state, not its pace.
            const fill = 2.0;
            timeline.add(gsap.effects.peopleGround(ratio, { duration: fill }), "ratio+=0.1");
            for (const count of track!.querySelectorAll<HTMLElement>("[data-people-count]")) {
              const target = Number(count.dataset.peopleCount);
              const first = target >= 50;
              const proxy = { value: 0 };
              // ⚠ THE COUNT STARTS FROM WHAT THE PAGE ALREADY SHOWS (user
              // direction, 14 September 2026). The figure ships as "0%" in the
              // markup, so the number on screen before the ratio is reached is
              // the number the count begins at, and nothing is written here at
              // build. An earlier pass the same day rested the figure at 80%
              // and swapped a counting copy in — which made the reader watch
              // 80% jump backwards to nothing and climb again.
              //
              // `immediateRender: false` is what keeps that true in both
              // directions: the tween does not touch the text until the
              // playhead reaches it, and scrubbing back before it renders
              // progress 0, which writes "0%" again rather than stranding the
              // figure part-counted.
              timeline.fromTo(proxy, { value: 0 }, {
                value: target, duration: fill * (first ? 0.8 : 0.2), ease: "none", immediateRender: false,
                onUpdate: () => { count.textContent = `${Math.round(proxy.value)}%`; },
              }, `ratio+=${0.1 + (first ? 0 : fill * 0.8)}`);
            }
          }
          // User direction, 14 September 2026: each acknowledgement — name and
          // what they did — fades in whole where it sits, one after another as
          // the reader reaches it (was a line settle on the name only).
          //
          // 15 September 2026, user direction ("the same text animation as the
          // ones on living work where the white text goes from left to
          // right"): each NAME now wipes in left to right, Living Work §08's
          // clip (inset from the right, eased `country`), and what they did
          // fades up behind it. On this page's reading clock, so it scrubs.
          for (const name of names) {
            const heading = name.querySelector<HTMLElement>("[data-people-name]");
            const detail = heading?.nextElementSibling;
            const start = at(name, 0.9);
            timeline.fromTo(name, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: true }, start);
            if (heading) timeline.fromTo(heading, { clipPath: "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: EASE.country, immediateRender: true }, start);
            if (detail) timeline.fromTo(detail, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "sine.inOut", immediateRender: true }, start + 0.35);
          }
          // The governance rings turn with the scroll across the section's whole
          // passage (15 September 2026, user direction), at Living Work's tempo
          // (20 degrees per unit, linear, scrubbed both ways). Inner <img> only.
          const governanceScene = track!.querySelector<HTMLElement>('[data-people-scene="governance"]');
          const governanceRings = governanceScene
            ? Array.from(governanceScene.querySelectorAll<HTMLElement>("[data-people-governance-rings] [data-artwork] > img")) : [];
          if (governanceScene && governanceRings.length) {
            const box = peopleBox(governanceScene, track!);
            const from = at(governanceScene, 1);
            const span = Math.max(0.5, peopleTimeAt(legs, box.top + box.height) - from);
            timeline.fromTo(governanceRings, { rotation: 0 }, { rotation: 20 * span, duration: span, ease: "none" }, from);
          }
          for (const seat of track!.querySelectorAll<HTMLElement>("[data-people-seat]")) {
            timeline.add(gsap.effects.arrive(seat, { y: 16, duration: 0.45 }), at(seat));
          }
          // X7: the supplied crest rises from its baseline and, from 14 Sep
          // 2026 (user direction), rolls in as it does — alternate waves from
          // alternate sides. The span is the section's own approach, measured
          // on the reading clock (viewport foot → 15% from the top) rather
          // than a fixed length, so a hold mid-approach cannot finish the
          // crest before its ground is seen.
          track!.querySelectorAll<SVGElement>("[data-wave-ink]").forEach((wave, index) => {
            const section = wave.closest<HTMLElement>("[data-people-scene]");
            if (!section) return;
            const from = at(section, 1);
            const duration = Math.max(0.3, at(section, 0.15) - from);
            timeline!.add(gsap.effects.peopleGround(wave, {
              crest: true, duration, direction: index % 2 ? -1 : 1,
            }), from);
          });
          const doors = track!.querySelectorAll<HTMLElement>('[data-people-scene="contact"] a');
          if (doors.length) timeline.add(gsap.effects.arrive(doors, { y: 16, duration: 0.4, stagger: 0.06 }), at(doors[0]));
          // GSAP already batches this once per timeline update. Paint in the
          // same tick; a second RAF adds a frame of lag to the entire page.
          timeline.eventCallback("onUpdate", paint);
          trigger = ScrollTrigger.create({
            id: "our-people-journey", trigger: root, start: "top top",
            end: () => `+=${timeline!.duration() * viewport}`,
            // Wheel inertia comes from the shared Lenis instance. Touch and
            // keyboard retain a direct connection to this one reading clock.
            pin: true, scrub: true, animation: timeline,
            // A resize rebuilds this measured timeline in full. Invalidating
            // its object tweens in place would recapture a mid-scroll start.
            onRefreshInit: () => {
              refreshing = true;
              refreshFocus = document.activeElement instanceof HTMLElement && track!.contains(document.activeElement)
                ? document.activeElement : null;
            },
            onRefresh: () => {
              const target = refreshFocus;
              if (target) {
                cancelAnimationFrame(focusFrame);
                focusFrame = requestAnimationFrame(() => {
                  if (disposed || !target.isConnected) return;
                  refreshing = true;
                  target.focus({ preventScroll: true });
                  refreshing = false;
                });
              }
              refreshFocus = null;
              refreshing = false;
              invalidate();
            },
          });
        }, root);

        ScrollTrigger.refresh();
        refreshScrollBounds();
        contentHeight = track!.scrollHeight;
        sections.forEach(section => {
          section.element.dataset.peopleScroll = String(Math.round((trigger?.start ?? 0) + peopleTimeAt(legs, section.top) * viewport));
        });
        if (position && "after" in position) {
          goTo(timeline?.duration() ?? 0, position.after);
          position = undefined;
        } else if (position && sections[position.scene]) {
          const section = sections[position.scene];
          const travel = gsap.utils.clamp(0, maxTravel, section.top + section.height * position.fraction - viewport * 0.35);
          const time = peopleTimeAt(legs, travel);
          goTo(time);
          position = undefined;
        } else if (hashTarget()) {
          onHash();
        } else if (nativeTravel > maxTravel) {
          goTo(timeline?.duration() ?? 0, nativeTravel - maxTravel);
        } else if (nativeTravel > 1) {
          const time = peopleTimeAt(legs, Math.min(maxTravel, nativeTravel));
          goTo(time);
        }
        paint();
        const focusTarget = restoreFocus ?? focused;
        lastFocused = focusTarget;
        if (focusTarget?.isConnected) focusTarget.focus({ preventScroll: true });
        if (restoreFocus?.isConnected) seek(restoreFocus, 0.24);
        restoreFocus = null;
        canvas.addEventListener("webglcontextlost", onLost);
        window.addEventListener("keydown", onKey);
        window.addEventListener("hashchange", onHash);
        window.addEventListener("beforeprint", onPrint);
        document.addEventListener("visibilitychange", invalidate);
        document.fonts.addEventListener("loadingdone", schedule);
        root.addEventListener("focusin", onFocus);
        root.addEventListener("focusout", onFocusOut);
        ScrollTrigger.addEventListener("matchMedia", onMediaRefresh);
        root.addEventListener("scroll", onStageScroll);
        document.addEventListener("click", onAnchor, true);

        resizeObserver = new ResizeObserver(() => {
          if (Math.abs(root.clientWidth - width) > 1 || Math.abs(root.clientHeight - viewport) > 1
            || Math.abs(track!.scrollHeight - contentHeight) > 1) schedule();
        });
        resizeObserver.observe(root);
        resizeObserver.observe(track!);
        const words = () => {
          const clone = track!.cloneNode(true) as HTMLElement;
          clone.querySelectorAll("[data-people-count]").forEach(count => count.remove());
          return clone.textContent?.replace(/\s+/g, " ").trim();
        };
        const contentStamp = words();
        // The ratio's counting figures rewrite their own text on the clock; those
        // mutations are motion, not content, and must not rebuild the page.
        mutation = new MutationObserver(records => {
          if (records.every(record => (record.target instanceof Element ? record.target : record.target.parentElement)
            ?.closest("[data-people-count]"))) return;
          if (words() !== contentStamp) schedule();
        });
        mutation.observe(track!, { childList: true, subtree: true, characterData: true });
        root.dataset.pageReady = "ready";
      } catch (error) {
        console.warn("Our People canvas unavailable; the full document remains available.", error);
        release();
      }
    }
    void build();
  }
  return { init, destroy };
}
