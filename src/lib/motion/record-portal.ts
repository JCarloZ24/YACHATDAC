"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Color,
  Fog,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import {
  prefersReduced,
  register,
  start,
  type MotionModule,
} from "../motion-controller";
import { registerYachatdacEffects } from "./effects";
import { buildPortalWall } from "./record-portal-wall";

/**
 * Grammar: "the world opening" / handprintPortal / SCR-11.
 * Latest user correction, 2026-09-08: a generated 3D wall, a real cut-through
 * hand, and image planes far behind it. Cards approach from the first scroll input,
 * pass beyond the viewport at staggered depths and fade near the camera. Images stay fixed inside their whole card frames;
 * perspective, not UV animation, creates the approach. Render on demand.
 */
// User refinement, 2026-09-09: the leftmost photo starts farther away;
// a second set of photographs fills the journey at its own depths/speeds.
const DEPTHS = [-48, -56, -38, -58, -62, -36, -52, -68, -44, -76];
const ADVANCES = [5, 4, 16, 10, 6, 9, 7, 3, 12, 5];
const FRAME_DISTANCE = 20;
const FOV = 42;

export function mountRecordPortal(module: MotionModule): () => void {
  const unregister = register(module);
  start();
  return unregister;
}

export function createRecordPortal(
  root: HTMLElement,
  canvas: HTMLCanvasElement,
  maskSrc: string,
  stoneSrc: string,
  stencilSrc: string | null,
): MotionModule {
  let mounted = false;
  let generation = 0;
  let cleanScene: (() => void) | undefined;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clear = () => {
    generation++;
    cleanScene?.();
    cleanScene = undefined;
  };

  const build = async () => {
    clear();
    if (!mounted || prefersReduced()) {
      root.dataset.portalState = "fallback";
      return;
    }
    const version = generation;
    const stage = root.querySelector<HTMLElement>("[data-portal-stage]");
    const gallery = root.querySelector<HTMLElement>("[data-portal-gallery]");
    if (!stage || !gallery) {
      root.dataset.portalState = "fallback";
      return;
    }
    root.dataset.portalState = "loading";

    const textures: Texture[] = [];
    const materials: MeshBasicMaterial[] = [];
    let renderer: WebGLRenderer | undefined;
    let plane: PlaneGeometry | undefined;
    let wall: ReturnType<typeof buildPortalWall> | undefined;
    let context: gsap.Context | undefined;
    let observer: ResizeObserver | undefined;
    let intersection: IntersectionObserver | undefined;
    let offscreen = false;
    let dead = false;
    let readyFrame = 0;
    let render = () => {};
    const visibility = () => {
      if (!document.hidden) render();
    };
    const release = () => {
      if (dead) return;
      dead = true;
      cancelAnimationFrame(readyFrame);
      observer?.disconnect();
      intersection?.disconnect();
      context?.revert();
      root
        .querySelectorAll<HTMLElement>(
          "[data-portal-copy]",
        )
        .forEach((element) => {
          element.style.removeProperty("opacity");
        });
      textures.forEach((texture) => texture.dispose());
      materials.forEach((material) => material.dispose());
      plane?.dispose();
      wall?.dispose();
      if (renderer) {
        canvas.removeEventListener("webglcontextlost", lost);
        // React owns the canvas. Dispose GPU resources without losing its
        // context so live reduced-motion changes can reuse the same element.
        renderer.dispose();
      }
      document.removeEventListener("visibilitychange", visibility);
      root.removeAttribute("data-portal-enhanced");
      root.dataset.portalState = "fallback";
      gallery.inert = true;
    };
    const lost = (event: Event) => {
      event.preventDefault();
      release();
      ScrollTrigger.refresh();
    };
    cleanScene = release;

    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      });
      renderer.outputColorSpace = SRGBColorSpace;
      renderer.debug.onShaderError = () => {
        throw new Error("Portal shader unavailable");
      };
      canvas.addEventListener("webglcontextlost", lost);
      const loader = new TextureLoader();
      const load = async (src: string) => {
        const texture = await loader.loadAsync(src);
        if (dead || version !== generation) texture.dispose();
        else textures.push(texture);
        return texture;
      };
      const elements = Array.from(
        root.querySelectorAll<HTMLElement>("[data-portal-card]"),
      );
      const gridImages = Array.from(
        root.closest("[data-page-root]")?.querySelectorAll<HTMLImageElement>("[data-record-grid] img") ?? [],
      ).slice(0, 3);
      let settled = 0;
      const total = 2 + (stencilSrc ? 1 : 0) + elements.length + gridImages.length;
      const tracked = <T,>(task: Promise<T>): Promise<T> => task.finally(() => {
        settled++;
        if (!dead && version === generation) {
          root.dataset.portalProgress = String(Math.round(5 + settled / total * 85));
        }
      });
      const [hand, stone, stencilSheet, images] = await Promise.all([
        tracked(load(maskSrc)),
        tracked(load(stoneSrc)),
        // Decoration can fall back to the original footprint if its sheet
        // fails to load; the portal and its article links remain available.
        stencilSrc ? tracked(load(stencilSrc)).catch(() => null) : null,
        Promise.all(
          elements.map((element) => tracked((async () => {
            const image = element.querySelector<HTMLImageElement>("img");
            if (!image) return null;
            try {
              return await load(image.currentSrc || image.src);
            } catch {
              return null;
            }
          })())),
        ),
        Promise.all(gridImages.map((image) => {
          image.loading = "eager";
          return tracked(image.decode().catch(() => {
            // Retain the card's tonal ground if its photograph is unavailable.
            image.style.visibility = "hidden";
          }));
        })),
      ]);
      if (dead || version !== generation) return;

      const css = getComputedStyle(root);
      const colour = (name: string) =>
        new Color(css.getPropertyValue(`--color-${name}`).trim());
      const ground = colour("charcoal");
      const scene = new Scene();
      scene.background = ground;
      scene.fog = new Fog(ground, 20, 85);
      stone.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      wall = buildPortalWall(
        hand,
        stone,
        colour("oxide").lerp(colour("roasted"), 0.18),
        stencilSheet?.image ?? null,
      );
      scene.add(wall.group);
      const camera = new PerspectiveCamera(FOV, 1, 0.01, 150);
      const state = { progress: 0 };
      // SCR-11, 9 September: enough vertices for the same radial zoom lens
      // used by Home's painting. UVs stay attached to the whole photo frame.
      plane = new PlaneGeometry(1, 1, 36, 24);
      const lens = { value: 0 };
      const lensAspect = { value: 1 };
      const cards = elements.map((element, index) => {
        // Keep the remaining photographs on their original paths when a
        // preview is removed from the composition.
        const slot = Number(element.dataset.portalSlot ?? index);
        const texture = images[index];
        if (texture) {
          texture.colorSpace = SRGBColorSpace;
          texture.anisotropy = Math.min(
            4,
            renderer!.capabilities.getMaxAnisotropy(),
          );
        }
        const material = new MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          color: texture ? new Color("white") : colour("roasted"),
        });
        material.onBeforeCompile = (shader) => {
          shader.uniforms.uPortalLens = lens;
          shader.uniforms.uPortalLensAspect = lensAspect;
          shader.vertexShader = `uniform float uPortalLens;
uniform float uPortalLensAspect;
${shader.vertexShader}`.replace(
            "#include <project_vertex>",
            `#include <project_vertex>
            if (gl_Position.w > 0.0) {
              vec2 screen = gl_Position.xy / gl_Position.w;
              vec2 radial = screen * vec2(uPortalLensAspect, 1.0);
              float radius2 = dot(radial, radial);
              // Smooth bounded magnification: straight frame edges bow more
              // at the periphery, without turning back toward the viewport.
              float expansion = 1.0 + uPortalLens * 0.48 * radius2 / (1.0 + radius2);
              gl_Position.xy *= expansion;
            }`,
          );
        };
        material.customProgramCacheKey = () => "record-photo-radial-lens-v1";
        materials.push(material);
        const mesh = new Mesh(plane!, material);
        mesh.position.z = DEPTHS[slot % DEPTHS.length];
        scene.add(mesh);
        return {
          element, mesh, texture,
          depth: DEPTHS[slot % DEPTHS.length],
          advance: ADVANCES[slot % ADVANCES.length],
          baseX: 0, baseY: 0, driftX: 0, driftY: 0,
        };
      });
      let width = 1;
      let height = 1;
      let openingX = 0;
      let openingY = 0;

      render = () => {
        if (dead || offscreen || document.hidden || !renderer) return;
        const p = state.progress;
        lens.value = Math.sin(Math.PI * p) ** 2;
        // Immediate scroll response: front-load travel while retaining each
        // plane's distinct depth. This is reversible, with no timed easing lag.
        const rush = 1 - (1 - p) ** 3 - p;
        // The grid enters halfway through the shortened two-viewport journey.
        const ending = gsap.utils.clamp(0, 1, (p - 0.5) / 0.44);
        const endingOpacity = 1 - ending * ending * (3 - 2 * ending);
        // SCR-11, latest user direction: one continuous forward journey.
        // Distinct card depths and advances prevent a shared arrival plane.
        const z = 11 - 24 * p - 42 * p * p;
        const aim = Math.min(p / 0.22, 1);
        const aimEase = aim * aim * (3 - 2 * aim);
        camera.position.set(openingX * aimEase, openingY * aimEase, z);
        for (const card of cards) {
          card.mesh.position.set(
            card.baseX + card.driftX * p * p,
            card.baseY + card.driftY * p * p,
            card.depth + card.advance * p + (11 - card.depth) * 0.6 * rush,
          );
          const distance = z - card.mesh.position.z;
          const offsetX = card.mesh.position.x - camera.position.x;
          const offsetY = card.mesh.position.y - camera.position.y;
          card.mesh.rotation.set(
            gsap.utils.clamp(-0.18, 0.18, offsetY / Math.max(distance, 3) * 0.3) * lens.value,
            gsap.utils.clamp(-0.3, 0.3, -offsetX / Math.max(distance, 3) * 0.4) * lens.value,
            0,
          );
          const fade = gsap.utils.clamp(0, 1, (distance - 1.5) / 8.5);
          card.mesh.material.opacity = fade * fade * (3 - 2 * fade) * endingOpacity;
          card.mesh.visible = Boolean(card.texture) && distance > 1.5;
        }
        camera.updateMatrixWorld();
        renderer.render(scene, camera);
      };

      const resize = () => {
        if (dead || !renderer || !wall) return;
        width = stage.clientWidth;
        height = stage.clientHeight;
        if (!width || !height) return;
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, width < 1024 ? 1.5 : 2),
        );
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        lensAspect.value = camera.aspect;
        camera.updateProjectionMatrix();
        const scale =
          width < 1024 ? Math.min(0.8, Math.max(0.48, width / height)) : 1;
        wall.group.scale.setScalar(scale);
        wall.group.position.y = width < 1024 ? 1.7 : 1.35;
        openingX = wall.openingCenter.x * scale;
        openingY = wall.group.position.y + wall.openingCenter.y * scale;
        for (const card of cards) {
          const { element, mesh, texture } = card;
          const cardWidth = element.offsetWidth;
          const cardHeight = element.offsetHeight;
          const x = element.offsetLeft + cardWidth / 2 - width / 2;
          const y = height / 2 - element.offsetTop - cardHeight / 2;
          // Size is measured at a common reference distance, not each card's
          // destination: different depths now produce genuinely different scales.
          const unit = 2 * Math.tan((FOV * Math.PI) / 360) * FRAME_DISTANCE / height;
          mesh.scale.set(cardWidth * unit, cardHeight * unit, 1);
          const upper = y > height * 0.1;
          // Upper frames stay readable for the closing fade; lower side
          // frames already extend past the edges during the fast approach.
          // User refinement, 2026-09-09: pull the leftmost picture inward
          // so it remains noticeable before continuing past the screen edge.
          const spread = element === elements[0] ? 0.95 : upper ? 0.55 : 1.25;
          card.baseX = openingX + x * unit * spread;
          card.baseY = openingY + y * unit;
          // Move whole frames outward, including the formerly centred picture,
          // so none settles in front of the camera. Image UVs remain fixed.
          const directionX = Math.abs(x) < 1 ? width * 0.12 : x;
          const directionY = Math.abs(y) < 1 ? height * 0.12 : y;
          const length = Math.hypot(directionX, directionY);
          card.driftX = directionX / length * (upper ? 0.6 : 4);
          card.driftY = directionY / length * (upper ? 0.6 : 4);
          if (texture) {
            const imageRatio = texture.image.width / texture.image.height;
            const boxRatio = cardWidth / cardHeight;
            texture.repeat.set(
              Math.min(1, boxRatio / imageRatio),
              Math.min(1, imageRatio / boxRatio),
            );
            texture.offset.set(
              (1 - texture.repeat.x) / 2,
              (1 - texture.repeat.y) / 2,
            );
          }
        }
        render();
      };

      root.setAttribute("data-portal-enhanced", "");
      resize();
      registerYachatdacEffects();
      context = gsap.context(() => {
        const animation = gsap.effects.handprintPortal(state, {
          copy: root.querySelectorAll("[data-portal-copy]"),
        });
        animation.eventCallback("onUpdate", render);
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          animation,
          scrub: true,
          onRefresh: render,
        });
      }, root);
      observer = new ResizeObserver(resize);
      observer.observe(stage);
      intersection = new IntersectionObserver(([entry]) => {
        offscreen = !entry.isIntersecting;
        if (!offscreen) render();
      });
      intersection.observe(root);
      document.addEventListener("visibilitychange", visibility);
      ScrollTrigger.refresh();
      // Async scene setup adds the scroll span after native hash navigation.
      // Keep incoming links to the catalogue/documents at their actual target.
      const anchor = document.getElementById(window.location.hash.slice(1));
      if (anchor && !root.contains(anchor)) {
        anchor.scrollIntoView({ behavior: "instant", block: "start" });
      }
      // render() includes shader compilation and texture upload. Reveal only
      // after that frame is submitted, never just after the files download.
      render();
      readyFrame = requestAnimationFrame(() => {
        if (dead || version !== generation) return;
        root.dataset.portalProgress = "100";
        root.dataset.portalState = "ready";
      });
    } catch {
      release();
      ScrollTrigger.refresh();
    }
  };

  const changed = () => {
    void build();
  };
  const skip = (event: Event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      "[data-portal-skip]",
    );
    const grid = document.getElementById("research-and-discovery");
    if (!link || !grid) return;
    event.preventDefault();
    event.stopPropagation();
    grid.scrollIntoView({ behavior: "instant", block: "start" });
    grid.focus({ preventScroll: true });
  };
  return {
    init: () => {
      if (mounted) return;
      mounted = true;
      preference.addEventListener("change", changed);
      root.addEventListener("click", skip);
      void build();
    },
    destroy: () => {
      mounted = false;
      clear();
      preference.removeEventListener("change", changed);
      root.removeEventListener("click", skip);
    },
  };
}
