"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial,
  SRGBColorSpace, Texture, Vector2, WebGLRenderer,
} from "three";
import { prefersReduced, type MotionModule } from "@/lib/motion-controller";
import { HOME_SCENE, registerHome } from "./effects/home";
import { createLandMaterial } from "./home-land";
import { HOME_PORTAL } from "@/content/kit";
import { awaitEntry, routeEntryPending } from "./route-entry";

gsap.registerPlugin(ScrollTrigger);

/**
 * Where the landscape plate's cover crop rests, 9 September 2026 user
 * direction. A viewport wider than the 1440×1500 source crops the plate
 * vertically; 0 keeps the old centred crop (trim off both ends, near ground
 * lost), 1 pins the photograph's bottom edge to the bottom of the canvas.
 * This is the number to turn if the land sits too high or too low at rest.
 *
 * ⚠ Held at 1 deliberately. It briefly went to 0.75 to make room for an
 * Invitation drift that moved the sampling window; that approach is gone
 * (`LANDSCAPE_INVITATION_LIFT` in effects/home.ts now travels the whole scene
 * up the screen instead), and the bottom pin is what puts the photograph's
 * own speckled dissolve at the plate's bottom edge — which is the edge that
 * rises into view. Lower this and the lift uncovers a hard cut through the
 * middle of the land instead.
 *
 * The DOM still behind the canvas is `object-bottom` for the same reason: the
 * two crops have to agree, or the fallback is a different photograph.
 */
const LANDSCAPE_BOTTOM_BIAS = 1;

/**
 * How much scroll each unit of the dissolve timeline costs, in viewport
 * heights. SCR-10 set it at 1.2. Lowered to 0.8 on user direction, 10
 * September 2026: the canvas has taken on The Invitation, the closing line,
 * the offer and the pathways since that number was chosen, and at 120vh a
 * unit the whole page had become a long haul on the wheel.
 *
 * This is THE sensitivity dial for the pinned hero — smaller advances the
 * timeline further per wheel tick, larger slows it down. Nothing else should
 * be retimed to make the page feel faster: the beats' relative pacing is in
 * the timeline, and this scales all of it at once. The scroll-cue jump reads
 * the same constant, so the two cannot drift apart.
 */
const SCROLL_PER_UNIT = 0.8;

/**
 * The homepage canvas: one full-screen land plate, held.
 *
 * ⚠ 10 September 2026, user direction. The page used to open on a perspective
 * gallery — thirty-six photo plates gliding in around a stationary eye that
 * turned with the mouse — and then dissolve into the supplied painting and
 * zoom through its rosette to arrive here. All of it is gone. The hero IS the
 * road now: the scene is up before the first word and does not move until the
 * scroll asks it to, which is why there is no gallery group, no per-plate
 * texture and no pointer damping left in this file.
 *
 * That opening survives whole, and running, at /homepagev2 — an independent
 * fork with its own copy of this module. Read it there before rebuilding any
 * of it from git.
 *
 * F7 holds: media is the loud channel and the type is quiet over it. AMB-05's
 * vegetation wind now starts as soon as the photograph decodes rather than on
 * the portal's arrival. R11: the collage's twenty-six above-the-fold WebPs
 * went with it, leaving this one photograph and its three layer maps.
 */
export function createHomeHero(root: HTMLElement, canvas: HTMLCanvasElement): MotionModule {
  let cleanup = () => {};
  const destroy = () => cleanup();

  const init = () => {
    destroy();
    root.dataset.pageReady = "loading";
    let disposed = false;
    let renderer: WebGLRenderer | undefined;
    let context: gsap.Context | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let loaderObserver: MutationObserver | undefined;
    let releaseEntry: (() => void) | undefined;
    let intersection: IntersectionObserver | undefined;
    let clearListeners = () => {};
    let offscreen = false;
    let timeline: gsap.core.Timeline | undefined;
    /**
     * Last resort for an intro that never finishes — a decode that hangs, a
     * timeline that never completes — so the reader is not held on a black
     * screen. It is stood down while the tab is hidden and re-armed on
     * return, because it measures wall clock and the intro it guards is
     * paused: otherwise the guard becomes the failure.
     */
    let safety: number | undefined;
    /**
     * Is the opening film still covering the page? Checked both here and in
     * begin(), so the two cannot drift apart. `hidden` is the loader's own
     * completion signal; the computed-display test catches the session gate,
     * which hides the cover in CSS before any of this runs.
     */
    const loaderCovering = () => {
      if (routeEntryPending()) return true;
      const loader = document.querySelector<HTMLElement>("[data-home-loader]");
      return Boolean(loader) && !loader!.hidden
        && getComputedStyle(loader!).display !== "none";
    };
    const disarmSafety = () => { window.clearTimeout(safety); safety = undefined; };
    const armSafety = () => {
      disarmSafety();
      if (!prefersReduced()) safety = window.setTimeout(release, 10000);
    };
    let breeze: gsap.core.Timeline | undefined;
    let syncBreeze = () => {};
    let geometry: PlaneGeometry | undefined;
    const textures: Texture[] = [];
    const materials: ShaderMaterial[] = [];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const restore = () => {
      root.dataset.pageReady = "fallback";
      root.removeAttribute("data-hero-canvas");
      root.removeAttribute("data-hero-motion");
      root.removeAttribute("data-hero-phase");
    };
    const release = () => {
      if (disposed) return;
      disposed = true;
      disarmSafety();
      loaderObserver?.disconnect();
      releaseEntry?.();
      resizeObserver?.disconnect();
      intersection?.disconnect();
      breeze?.kill();
      clearListeners();
      context?.revert();
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      geometry?.dispose();
      renderer?.dispose();
      canvas.removeEventListener("webglcontextlost", onLost);
      preference.removeEventListener("change", init);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("keydown", onKey);
      restore();
    };
    const onLost = (event: Event) => {
      // A backgrounded tab is one of the ordinary ways a browser drops a GL
      // context, so this is not only a crash path. Take the rebuild rather
      // than tearing the canvas down for the rest of the visit: release()
      // lifts the [data-hero-canvas="ready"] gate, and with every beat now a
      // panel on this canvas, that shows all of them stacked at once.
      event.preventDefault();
      canvas.addEventListener("webglcontextrestored", () => init(), { once: true });
      release();
    };
    const onVisibility = () => {
      syncBreeze();
      if (document.hidden) {
        timeline?.pause();
        // The timer below is wall-clock and keeps running in a background
        // tab, while the intro it guards is paused and cannot finish. Left
        // armed, ten seconds on another tab destroyed the canvas.
        disarmSafety();
      } else if (root.dataset.heroMotion === "entering") {
        timeline?.resume();
        armSafety();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      // Tab must never land on an invisible scroll link; Escape skips the intro.
      // ⚠ With a modifier held this is not someone moving through the page —
      // Alt+Tab and Ctrl+Tab are window and tab switching, and they arrive
      // here as a Tab keydown. Releasing on those meant coming back from
      // another tab to a page whose canvas had been torn down.
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      // ⚠ And not while the opening film is up (10 September 2026). Tab now
      // MOVES FOCUS inside the loader — it reaches Skip, then "Walk with us" —
      // and Escape is the loader's own way out. Both used to arrive here and
      // tear the canvas down before the hero had drawn a frame, leaving the
      // reader on every panel of the page at once. The loader owns both keys
      // for as long as it is covering; this only skips the hero's own intro.
      if (loaderCovering()) return;
      if (event.key === "Tab" || event.key === "Escape") release();
    };
    cleanup = release;
    preference.addEventListener("change", init);
    if (prefersReduced()) {
      root.dataset.pageReady = "fallback";
      return;
    }
    // ⚠ NOT armed while the opening film is still up (10 September 2026). This
    // guard destroys the canvas after ten seconds and `restore()` strips
    // data-hero-canvas — the attribute invitation.css uses to hide The
    // Invitation, the statement, the offer and the pathways. With the loader
    // now holding for 39 seconds and then waiting for a press, the guard fired
    // long before the intro it guards had started, and the reader pressed
    // "Walk with us" onto every panel of the page stacked on top of each other.
    //
    // The file already knew this shape of failure — see onVisibility below,
    // where ten seconds on another tab destroyed the canvas for the same
    // reason. It measures wall clock; what it guards had not begun.
    //
    // No longer timeout-able, either: the cover waits indefinitely for a
    // press, so no fixed number would be right. It is armed in begin(),
    // the moment the intro actually starts.
    if (!loaderCovering()) armSafety();
    root.dataset.heroMotion = "preparing";
    window.addEventListener("keydown", onKey);

    const build = async () => {
      try {
        renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = SRGBColorSpace;
        canvas.addEventListener("webglcontextlost", onLost);
        const scene = new Scene();
        // The plate writes itself straight to clip space in its vertex shader,
        // so the camera exists only because render() takes one. Nothing here
        // is projected and nothing moves in world space.
        const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        // The page opens at night; the intro walks this to HOME_SCENE.welcome
        // and the scroll takes it on through the day. See HOME_SCENE.
        const exit = { ...HOME_SCENE.night, belonging: 0, landscapeLift: 0, landscapeZoom: 1 };
        let landscapeReady = false;
        syncBreeze = () => {
          breeze?.paused(disposed || offscreen || document.hidden || !landscapeReady);
        };
        const tokens = getComputedStyle(document.documentElement);
        const dark = new Color(tokens.getPropertyValue("--color-charcoal").trim());
        geometry = new PlaneGeometry(1, 1);
        const land = createLandMaterial();
        // What sits behind the land once the lift takes it up, and what shows
        // anywhere the plate is not yet opaque: charcoal, from the token.
        (land.uniforms.beyond.value as Color).copy(dark);
        renderer.setClearColor(dark, 1);
        materials.push(land);
        // Three layers, and they are the whole page: the photograph, the sky
        // sequence behind it and the light sequence over it. The separate
        // daylight sky (HOME_PORTAL.sky) went with the old opening -- every
        // beat now reads the sequences, so there is nothing left for it to do.
        const maps = [
          { src: HOME_PORTAL.src, uniform: "landscape" },
          { src: HOME_PORTAL.truthSky, uniform: "skyMap" },
          { src: HOME_PORTAL.truthLight, uniform: "lightMap" },
        ].map(({ src, uniform }) => {
          const image = new Image();
          const texture = new Texture(image);
          texture.colorSpace = SRGBColorSpace;
          textures.push(texture);
          land.uniforms[uniform].value = texture;
          image.src = src;
          return { image, texture };
        });
        const plate = new Mesh(geometry, land);
        plate.frustumCulled = false;
        scene.add(plate);
        // The photograph is the page's first screen, so it is waited for
        // rather than faded in behind the copy: the black beat lifts onto a
        // finished scene. A decode that fails throws to the catch below and
        // leaves the reader the DOM still, which is the same photograph.
        await Promise.all(maps.map(({ image }) => image.decode()));
        if (disposed) return;
        maps.forEach(({ texture }) => { texture.needsUpdate = true; });
        landscapeReady = true;
        land.uniforms.landscapeReady.value = 1;

        // Figma places both sequence layers against the scene at its own
        // height, so this is what makes the measured offsets mean pixels.
        land.uniforms.sceneHeight.value = HOME_PORTAL.height;

        const render = () => {
          syncBreeze();
          if (disposed || document.hidden || offscreen) return;
          land.uniforms.belonging.value = exit.belonging;
          land.uniforms.skyOffset.value = exit.sky;
          land.uniforms.lightOffset.value = exit.light;
          land.uniforms.lightHeight.value = exit.lightHeight;
          land.uniforms.shade.value = exit.shade;
          // Where the cover crop's window sits in the photograph. Recomputed
          // per frame rather than on resize because the push-in moves it: the
          // crop half-height comes from the current viewport, so this stays
          // right across a resize without a second code path.
          //
          // ⚠ Landscape texture v runs TOP to bottom — v=0 is the top of the
          // photograph, not its bottom. Verified against the screen, 9
          // September 2026, after the sign here was first written the other
          // way: it put the treeline where the near ground belonged. The
          // constant reads in its plain sense; this line owns the axis.
          const crop = land.uniforms.landscapeCrop.value as Vector2;
          // Half the visible window's height in image space, after the push-in
          // narrows it. Bottom-anchoring means holding the window's lower edge
          // against the photograph's, so it has to follow the zoom — otherwise
          // pushing in would drag the near ground back out of frame.
          const halfY = crop.y / exit.landscapeZoom * 0.5;
          land.uniforms.landscapeZoom.value = exit.landscapeZoom;
          // Clamped to the texture. The landscape map wraps ClampToEdge, so a
          // window that runs off either end smears the first or last row of
          // the photograph across the band instead of erroring — silent, and
          // easy to ship. A narrow viewport has no vertical crop at all and
          // so no room to move: there the anchor is held here, and only the
          // push-in's narrowing window frees any travel.
          land.uniforms.landscapeAnchor.value = gsap.utils.clamp(
            halfY, 1 - halfY, 0.5 + LANDSCAPE_BOTTOM_BIAS * (0.5 - halfY));
          // The Invitation carries the scene off the top of the canvas; the
          // window on the photograph does not move with it. See the lift note
          // in home-land.ts.
          land.uniforms.lift.value = exit.landscapeLift;
          // Maps this plate into the old top-900 crop the shader thresholds
          // were calibrated against. See the HOME_PORTAL note in kit.ts.
          land.uniforms.legacyScale.value = HOME_PORTAL.height / HOME_PORTAL.legacyHeight;
          renderer?.render(scene, camera);
        };

        const scrollCue = root.querySelector<HTMLAnchorElement>('a[href="#wonder"]');
        const goToWonder = (event: MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
          const trigger = ScrollTrigger.getById("home-hero-dissolve");
          const wonderTime = (trigger?.animation as gsap.core.Timeline | undefined)?.labels.wonderReady;
          if (trigger && typeof wonderTime === "number") {
            window.scrollTo({ top: trigger.start + window.innerHeight * wonderTime * SCROLL_PER_UNIT, behavior: "instant" });
          }
        };
        scrollCue?.addEventListener("click", goToWonder);
        clearListeners = () => { scrollCue?.removeEventListener("click", goToWonder); };
        intersection = new IntersectionObserver(([entry]) => {
          offscreen = !entry.isIntersecting;
          syncBreeze();
          if (!offscreen) render();
        });
        intersection.observe(root);
        const resize = () => {
          if (disposed) return;
          const { width, height } = root.getBoundingClientRect();
          if (!width || !height) return;
          // Cover crop for the plate: whichever axis has room to spare is
          // trimmed, and LANDSCAPE_BOTTOM_BIAS decides where the vertical trim
          // comes off. Layout is read here and nowhere else.
          const aspect = width / height;
          const landscapeAspect = HOME_PORTAL.width / HOME_PORTAL.height;
          (land.uniforms.landscapeCrop.value as Vector2).set(
            Math.min(1, aspect / landscapeAspect), Math.min(1, landscapeAspect / aspect),
          );
          renderer?.setSize(width, height, false);
          render();
        };
        // SCR-09, 12 September 2026: only adopt the pinned layout after all
        // maps decode. Measure that viewport, not the taller static fallback.
        root.dataset.heroCanvas = "ready";
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(root);
        resize();
        context = gsap.context(() => {
          registerHome();
          breeze = gsap.effects.homeLandscapeBreeze(root, {
            phase: land.uniforms.breezePhase, render,
          });
          timeline = gsap.effects.homeHeroOpen(root, { state: exit, render });
          timeline?.eventCallback("onComplete", () => {
            root.dataset.heroMotion = "settled";
            disarmSafety();
            window.removeEventListener("keydown", onKey);
          });
          const dissolve = gsap.effects.homeHeroDissolve(root, { state: exit, render });
          ScrollTrigger.create({
            id: "home-hero-dissolve",
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * dissolve.duration() * SCROLL_PER_UNIT}`, // SCR-10, retimed 10 September: see SCROLL_PER_UNIT.
            pin: true,
            scrub: 0.8,
            animation: dissolve,
            invalidateOnRefresh: true,
          });
        }, root);
        document.addEventListener("visibilitychange", onVisibility);
        // The async canvas pin changes the following sections' document position.
        ScrollTrigger.refresh();
        root.dataset.pageReady = "ready";

        const begin = () => {
          if (disposed || document.hidden) return;
          if (loaderCovering()) return;
          loaderObserver?.disconnect();
          root.dataset.heroMotion = "entering";
          root.dataset.heroPhase = "black";
          // Armed HERE, not at init: this is the first moment the intro is
          // actually running, so it is the first moment a wall-clock guard on
          // it means anything.
          armSafety();
          timeline?.play(0);
        };
        const loader = document.querySelector("[data-home-loader]");
        if (loader) {
          loaderObserver = new MutationObserver(begin);
          loaderObserver.observe(loader, { attributes: true, attributeFilter: ["hidden"] });
        }
        // X7 / SYS-02, 11 September 2026: a warm-cache canvas must also wait
        // for the shared readiness cover. The film keeps its own door after it.
        releaseEntry = awaitEntry(begin);
      } catch {
        // WebGL, the network or a decode can fail independently of the
        // readable page: the DOM still and the copy over it stay.
        release();
      }
    };
    void build();
  };
  return { init, destroy };
}
