"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Color, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene,
  ShaderMaterial, SRGBColorSpace, Texture, Vector2, WebGLRenderer,
} from "three";
import { prefersReduced, type MotionModule } from "@/lib/motion-controller";
import type { HomeHeroFrame } from "@/content/homepage-media";
import { registerHome } from "./effects/home";
import { createPaintingMaterial } from "./home-painting";
import { HOME_PAINTING, HOME_PORTAL } from "@/content/kit";

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
 * F7/F8, Home opens / homeHeroOpen, user direction 8 September 2026.
 * 9 September POV correction: fixed plates, a stationary eye and head rotation.
 * Only the entrance moves the gallery. AMB-05 adds local vegetation wind to
 * the road layer on arrival; gallery UVs remain held. No per-frame layout reads.
 * Render on approach/resize/scroll and
 * damped mouse navigation (latest reference, 8 September 2026).
 * The semantic DOM collage doubles as the texture source and robust fallback.
 */
export function createHomeHero(
  root: HTMLElement,
  canvas: HTMLCanvasElement,
  frames: HomeHeroFrame[],
): MotionModule {
  let cleanup = () => {};
  const destroy = () => cleanup();

  const init = () => {
    destroy();
    let disposed = false;
    let renderer: WebGLRenderer | undefined;
    let context: gsap.Context | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let loaderObserver: MutationObserver | undefined;
    let intersection: IntersectionObserver | undefined;
    let stopPointer = () => {};
    let clearPointerListeners = () => {};
    let resumePointer = () => {};
    let offscreen = false;
    let timeline: gsap.core.Timeline | undefined;
    let breeze: gsap.core.Timeline | undefined;
    let syncBreeze = () => {};
    let geometry: PlaneGeometry | undefined;
    const textures: Texture[] = [];
    const materials: (MeshBasicMaterial | ShaderMaterial)[] = [];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const restore = () => {
      root.removeAttribute("data-hero-canvas");
      root.removeAttribute("data-hero-motion");
      root.removeAttribute("data-hero-phase");
    };
    const release = () => {
      if (disposed) return;
      disposed = true;
      window.clearTimeout(safety);
      loaderObserver?.disconnect();
      resizeObserver?.disconnect();
      intersection?.disconnect();
      stopPointer();
      breeze?.kill();
      clearPointerListeners();
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
      event.preventDefault();
      release();
    };
    const onVisibility = () => {
      syncBreeze();
      if (document.hidden) { timeline?.pause(); stopPointer(); }
      else {
        if (root.dataset.heroMotion === "entering") timeline?.resume();
        resumePointer();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      // Tab must never land on an invisible scroll link; Escape skips the intro.
      if (event.key === "Tab" || event.key === "Escape") release();
    };
    cleanup = release;
    preference.addEventListener("change", init);
    const safety = prefersReduced() ? undefined : window.setTimeout(release, 10000);
    if (prefersReduced()) return;
    root.dataset.heroMotion = "preparing";
    window.addEventListener("keydown", onKey);

    const build = async () => {
      try {
        renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.setClearColor(0, 0);
        canvas.addEventListener("webglcontextlost", onLost);
        const scene = new Scene();
        const gallery = new Group();
        scene.add(gallery);
        const camera = new PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, 0, 12);
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();
        const entrance = { x: 24, y: -1, z: -16, yaw: -0.3 };
        const exit = { progress: 0, portal: 0, wonder: 0, truth: 0, truthSky: 1422, truthLight: 464, belonging: 0, landscapeLift: 0, landscapeZoom: 1 };
        let landscapeReady = false;
        syncBreeze = () => {
          breeze?.paused(disposed || offscreen || document.hidden || !landscapeReady || exit.portal <= 0.65);
        };
        const tokens = getComputedStyle(document.documentElement);
        const dark = new Color(tokens.getPropertyValue("--color-charcoal").trim());
        const warm = new Color(tokens.getPropertyValue("--color-oxide").trim());
        const ground = dark.clone();
        const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
        geometry = new PlaneGeometry(1, 1);
        const paintingImage = new Image();
        const paintingTexture = new Texture(paintingImage);
        paintingTexture.colorSpace = SRGBColorSpace;
        textures.push(paintingTexture);
        const paintingMaterial = createPaintingMaterial(paintingTexture, HOME_PAINTING.width, HOME_PAINTING.height);
        // What sits behind the land once the lift takes it up: charcoal, not
        // the renderer's clear colour, which has warmed to oxide by then.
        (paintingMaterial.uniforms.beyond.value as Color).copy(dark);
        materials.push(paintingMaterial);
        const landscapeImage = new Image();
        const landscapeTexture = new Texture(landscapeImage);
        landscapeTexture.colorSpace = SRGBColorSpace;
        textures.push(landscapeTexture);
        paintingMaterial.uniforms.landscape.value = landscapeTexture;
        const skyImage = new Image();
        const skyTexture = new Texture(skyImage);
        skyTexture.colorSpace = SRGBColorSpace;
        textures.push(skyTexture);
        paintingMaterial.uniforms.sky.value = skyTexture;
        const truthLayers = [
          { src: HOME_PORTAL.truthSky, uniform: "truthSkyMap" },
          { src: HOME_PORTAL.truthLight, uniform: "truthLightMap" },
        ].map(({ src, uniform }) => {
          const image = new Image();
          const texture = new Texture(image);
          texture.colorSpace = SRGBColorSpace;
          textures.push(texture);
          paintingMaterial.uniforms[uniform].value = texture;
          image.src = src;
          return { image, texture };
        });
        const paintingPlate = new Mesh(geometry, paintingMaterial);
        paintingPlate.frustumCulled = false;
        paintingPlate.renderOrder = 1000;
        paintingPlate.visible = false;
        scene.add(paintingPlate);
        const images = Array.from(root.querySelectorAll<HTMLImageElement>("[data-hero-image]"));
        await Promise.allSettled(images.map((image) => image.decode()));
        if (disposed) return;

        const plates: { frame: HomeHeroFrame; mesh: Mesh }[] = [];
        frames.forEach((frame) => {
          const image = images.find((element) => element.dataset.heroImage === frame.id);
          if (!image?.naturalWidth) return;
          const texture = new Texture(image);
          texture.colorSpace = SRGBColorSpace;
          // Static object-cover crop, computed once. Frame-grade UVs never move.
          const ratio = image.naturalWidth / image.naturalHeight;
          if (ratio > frame.aspect) {
            texture.repeat.x = frame.aspect / ratio;
            texture.offset.x = (1 - texture.repeat.x) / 2;
          } else {
            texture.repeat.y = ratio / frame.aspect;
            texture.offset.y = (1 - texture.repeat.y) / 2;
          }
          texture.needsUpdate = true;
          textures.push(texture);
          const material = new MeshBasicMaterial({
            map: texture, transparent: true, opacity: frame.opacity, depthWrite: false,
          });
          materials.push(material);
          const mesh = new Mesh(geometry, material);
          // CSS rotates clockwise; world space is y-up.
          mesh.rotation.z = -frame.angle * Math.PI / 180;
          // Cylinder position and tangent orientation are calculated on resize.
          gallery.add(mesh);
          plates.push({ frame, mesh });
        });
        if (!plates.length) { release(); return; }
        const render = () => {
          syncBreeze();
          if (disposed || document.hidden || offscreen) return;
          gallery.position.set(entrance.x, entrance.y, entrance.z);
          gallery.rotation.set(0, entrance.yaw, 0);
          // True head turn from one eye position. Photos never track our gaze;
          // their changing perspective comes entirely from camera projection.
          camera.rotation.set(pointer.y * 0.075, -pointer.x * 0.11, -pointer.x * 0.008, "YXZ");
          const dissolve = Math.min(1, exit.progress / 0.4);
          plates.forEach(({ frame, mesh }) => {
            (mesh.material as MeshBasicMaterial).opacity = frame.opacity * (1 - dissolve);
          });
          // 9 September user correction: red builds underneath the outgoing content.
          const colourProgress = gsap.utils.clamp(0, 1, exit.progress / 0.65);
          ground.copy(dark).lerp(warm, colourProgress);
          paintingMaterial.uniforms.progress.value = gsap.utils.clamp(0, 1, (exit.progress - 0.45) / 0.5);
          paintingMaterial.uniforms.portal.value = landscapeReady ? exit.portal : 0;
          paintingMaterial.uniforms.wonder.value = exit.wonder;
          paintingMaterial.uniforms.truth.value = exit.truth;
          paintingMaterial.uniforms.belonging.value = exit.belonging;
          paintingMaterial.uniforms.truthSkyOffset.value = exit.truthSky;
          paintingMaterial.uniforms.truthLightOffset.value = exit.truthLight;
          // Where the cover crop's window sits in the photograph. Recomputed
          // per frame rather than on resize because the drift moves it: the
          // crop half-height comes from the current viewport, so this stays
          // right across a resize without a second code path.
          //
          // ⚠ Landscape texture v runs TOP to bottom — v=0 is the top of the
          // photograph, not its bottom. Verified against the screen, 9
          // September 2026, after both signs here were first written the
          // other way: it put the treeline where the near ground belonged and
          // drifted the land up instead of down. Hence anchor RISES to bring
          // the bottom edge into frame, and FALLS to move the land down the
          // screen. Both constants read in their own plain sense; this line
          // owns the axis. Don't invert one without the other.
          const crop = paintingMaterial.uniforms.landscapeCrop.value as Vector2;
          // Half the visible window's height in image space, after the push-in
          // narrows it. Bottom-anchoring means holding the window's lower edge
          // against the photograph's, so it has to follow the zoom — otherwise
          // pushing in would drag the near ground back out of frame.
          const halfY = crop.y / exit.landscapeZoom * 0.5;
          paintingMaterial.uniforms.landscapeZoom.value = exit.landscapeZoom;
          // Clamped to the texture. The landscape map wraps ClampToEdge, so a
          // window that runs off either end smears the first or last row of
          // the photograph across the band instead of erroring — silent, and
          // easy to ship. A narrow viewport has no vertical crop at all and
          // so no room to move: there the rise is held here, and only the
          // push-in's narrowing window frees any travel.
          paintingMaterial.uniforms.landscapeAnchor.value = gsap.utils.clamp(
            halfY, 1 - halfY, 0.5 + LANDSCAPE_BOTTOM_BIAS * (0.5 - halfY));
          // The Invitation carries the scene off the top of the canvas; the
          // window on the photograph does not move with it. See the lift note
          // in home-painting.ts.
          paintingMaterial.uniforms.lift.value = exit.landscapeLift;
          // Maps this plate into the old top-900 crop the shader thresholds
          // were calibrated against. See the HOME_PORTAL note in kit.ts.
          paintingMaterial.uniforms.legacyScale.value =
            HOME_PORTAL.height / HOME_PORTAL.legacyHeight;
          renderer?.setClearColor(ground, 1);
          renderer?.render(scene, camera);
        };
        // Independent loading: a failed painting leaves the red-ground transition usable.
        landscapeImage.src = HOME_PORTAL.src;
        skyImage.src = HOME_PORTAL.sky;
        void Promise.all([landscapeImage.decode(), skyImage.decode(),
          ...truthLayers.map(({ image }) => image.decode())]).then(() => {
          if (disposed) return;
          landscapeTexture.needsUpdate = true;
          skyTexture.needsUpdate = true;
          truthLayers.forEach(({ texture }) => { texture.needsUpdate = true; });
          landscapeReady = true;
          paintingMaterial.uniforms.landscapeReady.value = 1;
          render();
        }).catch(() => {});
        paintingImage.src = HOME_PAINTING.src;
        void paintingImage.decode().then(() => {
          if (disposed) return;
          paintingTexture.needsUpdate = true;
          paintingPlate.visible = true;
          render();
        }).catch(() => {});
        let ticking = false;
        const tick = (_time: number, delta: number) => {
          const blend = 1 - Math.exp(-Math.min(delta, 64) / 160);
          pointer.x += (pointer.targetX - pointer.x) * blend;
          pointer.y += (pointer.targetY - pointer.y) * blend;
          if (Math.abs(pointer.targetX - pointer.x) + Math.abs(pointer.targetY - pointer.y) < 0.001) {
            pointer.x = pointer.targetX;
            pointer.y = pointer.targetY;
            stopPointer();
          }
          render();
        };
        stopPointer = () => { gsap.ticker.remove(tick); ticking = false; };
        resumePointer = () => {
          if (disposed || offscreen || document.hidden || root.dataset.heroMotion !== "settled") return;
          if (!ticking) { ticking = true; gsap.ticker.add(tick); }
        };
        const onPointer = (event: PointerEvent) => {
          if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
          if (root.dataset.heroMotion !== "settled") return;
          // Layout reads occur on input only, never in the damping ticker.
          const bounds = root.getBoundingClientRect();
          // The fixed header overlays the hero but is not its DOM child.
          // Follow coordinates across that overlay instead of treating it as exit.
          if (event.clientX < bounds.left || event.clientX > bounds.right ||
              event.clientY < bounds.top || event.clientY > bounds.bottom) {
            onLeave();
            return;
          }
          pointer.targetX = gsap.utils.clamp(-1, 1, (event.clientX - bounds.left) / bounds.width * 2 - 1) * 5;
          pointer.targetY = gsap.utils.clamp(-1, 1, 1 - (event.clientY - bounds.top) / bounds.height * 2) * 1.8;
          resumePointer();
        };
        const onLeave = () => { pointer.targetX = 0; pointer.targetY = 0; resumePointer(); };
        document.addEventListener("pointermove", onPointer, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
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
        // Preserve ticker pausing separately from final listener teardown.
        clearPointerListeners = () => {
          scrollCue?.removeEventListener("click", goToWonder);
          document.removeEventListener("pointermove", onPointer);
          document.documentElement.removeEventListener("pointerleave", onLeave);
        };
        intersection = new IntersectionObserver(([entry]) => {
          offscreen = !entry.isIntersecting;
          syncBreeze();
          if (offscreen) stopPointer();
          else { render(); resumePointer(); }
        });
        intersection.observe(root);
        const resize = () => {
          if (disposed) return;
          const { width, height } = root.getBoundingClientRect();
          if (!width || !height) return;
          const stageWidth = Math.max(width, 900);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          const landscapeAspect = HOME_PORTAL.width / HOME_PORTAL.height;
          (paintingMaterial.uniforms.landscapeCrop.value as Vector2).set(
            Math.min(1, camera.aspect / landscapeAspect), Math.min(1, landscapeAspect / camera.aspect),
          );
          const imageAspect = HOME_PAINTING.width / HOME_PAINTING.height;
          (paintingMaterial.uniforms.cropScale.value as Vector2).set(
            Math.min(1, camera.aspect / imageAspect), Math.min(1, imageAspect / camera.aspect),
          );
          renderer?.setSize(width, height, false);
          const unit = (2 * Math.tan(20 * Math.PI / 180) * 12) / height;
          plates.forEach(({ frame, mesh }) => {
            // Centre the cylinder on the viewer's eye, including radial depth.
            // Tangent plates naturally face us when our head turns toward them.
            const theta = gsap.utils.clamp(-1.25, 1.25, (frame.x / 100 - 0.5) * 2);
            const depth = frame.depth * 0.85;
            const radius = 12 - depth;
            const planeWidth = stageWidth * frame.w / 100 * unit * 0.88 * (1 - depth / 24);
            mesh.position.set(
              radius * Math.sin(theta),
              height * (0.5 - frame.y / 100) * unit * 1.3,
              12 - radius * Math.cos(theta),
            );
            mesh.rotation.y = -theta;
            mesh.rotation.x = 0;
            mesh.rotation.z = -frame.angle * Math.PI / 180;
            mesh.scale.set(planeWidth, planeWidth / frame.aspect, 1);
          });
          render();
        };
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(root);
        resize();
        root.dataset.heroCanvas = "ready";
        context = gsap.context(() => {
          registerHome();
          breeze = gsap.effects.homeLandscapeBreeze(root, {
            phase: paintingMaterial.uniforms.breezePhase, render,
          });
          timeline = gsap.effects.homeHeroOpen(root, { gallery: entrance, render });
          timeline?.eventCallback("onComplete", () => {
            root.dataset.heroMotion = "settled";
            window.clearTimeout(safety);
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
        // The async canvas pin changes the Invitation document position.
        ScrollTrigger.refresh();

        const begin = () => {
          if (disposed || document.hidden) return;
          const loader = document.querySelector<HTMLElement>("[data-home-loader]");
          if (loader && !loader.hidden && getComputedStyle(loader).display !== "none") return;
          loaderObserver?.disconnect();
          root.dataset.heroMotion = "entering";
          root.dataset.heroPhase = "black";
          timeline?.play(0);
        };
        const loader = document.querySelector("[data-home-loader]");
        if (loader) {
          loaderObserver = new MutationObserver(begin);
          loaderObserver.observe(loader, { attributes: true, attributeFilter: ["hidden"] });
        }
        begin();
      } catch {
        // Images, WebGL or decode can fail independently of the readable page.
        release();
      }
    };
    void build();
  };
  return { init, destroy };
}
