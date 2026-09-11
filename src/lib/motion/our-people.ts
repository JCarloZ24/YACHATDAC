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
import { peopleTimeAt, type PeopleLeg, type PeopleState, type PeopleStop } from "./effects/people";
import { clampScrollTo, refreshScrollBounds } from "./smooth-scroll";
import { createPeopleWorld, peopleBox, type PeopleSection } from "./our-people-world";

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
    const state: PeopleState = { travel: 0, knockout: 0 };
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

    const paint = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (disposed || document.hidden || !world) return;
      setTrack(-state.travel);
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
      root.removeAttribute("data-people-ready");
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
      // Reading can continue in the ordinary document. Re-enabling motion
      // measures that new position instead of restoring an older saved one.
      position = undefined;
      restoreFocus = null;
      return;
    }

    async function build() {
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
        world = createPeopleWorld(canvas, track!, sections, width, viewport, invalidate);

        context = gsap.context(() => {
          registerYachatdacEffects();
          const stops: PeopleStop[] = [{ y: 0, hold: 0.12, key: "advisory" }];
          const addStop = (element: HTMLElement | null, hold: number, key: string, align = 0.28) => {
            if (!element) return;
            const box = peopleBox(element, track!);
            const available = Math.max(viewport * 0.08, (viewport - Math.min(box.height, viewport * 0.84)) / 2);
            const y = gsap.utils.clamp(0, maxTravel, box.top - Math.min(viewport * align, available));
            stops.push({ y, hold, key });
          };
          const title = track!.querySelector<HTMLElement>("[data-people-title]");
          addStop(title?.parentElement ?? null, 0.45, "title", 0.24);
          addStop(track!.querySelector('[data-people-scene="suzanne"] figure'), 0.25, "portrait", 0.12);
          const quote = track!.querySelector<HTMLElement>("[data-people-testimony] p");
          addStop(quote, 1.15, "testimony", 0.3);
          const decision = track!.querySelector<HTMLElement>('[data-people-scene="decision"] .headline');
          addStop(decision, 0.55, "decision", 0.3);

          const cards = Array.from(track!.querySelectorAll<HTMLElement>("[data-people-card]"));
          const rows: HTMLElement[][] = [];
          for (const card of cards) {
            const top = peopleBox(card, track!).top;
            const row = rows.find(items => Math.abs(peopleBox(items[0], track!).top - top) < 2);
            if (row) row.push(card); else rows.push([card]);
          }
          rows.forEach((row, index) => addStop(row[0], 0.35, `team-${index}`, 0.12));
          const ratio = track!.querySelector<HTMLElement>("[data-people-ratio]");
          addStop(ratio, 0.35, "ratio", 0.5);
          const names = Array.from(track!.querySelectorAll<HTMLElement>('[data-people-scene="acknowledgements"] li'));
          names.forEach((name, index) => addStop(name, 0.16, `name-${index}`, 0.28));
          stops.push({ y: maxTravel, hold: 0.4, key: "contact-end" });
          stops.sort((a, b) => a.y - b.y);
          timeline = gsap.effects.peopleJourney(root, { state, stops, legs, viewport });
          if (!timeline) return;
          const at = (element: HTMLElement, screenFraction = 0.8) =>
            peopleTimeAt(legs, Math.max(0, peopleBox(element, track!).top - viewport * screenFraction));

          if (title) timeline.add(gsap.effects.peopleKnockout(title, { state, duration: 0.65 }), at(title, 0.95));
          if (quote) {
            const speech = gsap.effects.dim(quote) as gsap.core.Tween;
            speech.duration(0.85);
            timeline.add(speech, "testimony");
          }
          if (decision) timeline.add(gsap.effects.settle(decision, { duration: 0.4, stagger: 0.06 }), at(decision, 0.85));
          rows.forEach(row => {
            timeline!.add(gsap.effects.peopleGather(row, {
              distance: width >= 1024 ? Math.min(96, width * 0.065) : 38,
              duration: 0.65, stagger: 0.08,
            }), at(row[0], 0.98));
          });
          if (ratio) timeline.add(gsap.effects.peopleGround(ratio), at(ratio, 0.8));
          for (const name of names) {
            const heading = name.querySelector<HTMLElement>(".headline");
            if (heading) timeline.add(gsap.effects.settle(heading, { duration: 0.4, stagger: 0.06 }), at(name, 0.9));
          }
          for (const seat of track!.querySelectorAll<HTMLElement>("[data-people-seat]")) {
            timeline.add(gsap.effects.arrive(seat, { y: 16, duration: 0.45 }), at(seat));
          }
          // X7: the supplied crest rises from its baseline. Scaling the held
          // path avoids exposing the mirrored strip's sharp tile junctions.
          for (const wave of track!.querySelectorAll<SVGElement>("[data-wave-ink]")) {
            const section = wave.closest<HTMLElement>("[data-people-scene]");
            if (section) timeline.add(gsap.effects.peopleGround(wave, { crest: true }), at(section, 1));
          }
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
        const words = () => track!.textContent?.replace(/\s+/g, " ").trim();
        const contentStamp = words();
        mutation = new MutationObserver(() => { if (words() !== contentStamp) schedule(); });
        mutation.observe(track!, { childList: true, subtree: true, characterData: true });
      } catch (error) {
        console.warn("Our People canvas unavailable; the full document remains available.", error);
        release();
      }
    }
    void build();
  }
  return { init, destroy };
}
