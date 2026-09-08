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
  Vector3,
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
 * hand, and image planes far behind it. Scroll first crosses the wall, then
 * approaches the cards. Images stay fixed inside their whole card frames;
 * perspective, not UV animation, creates the approach. Render on demand.
 */
const END_Z = -26;
const DEPTHS = [-34, -40, -36, -42, -37];
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
    if (!mounted || prefersReduced()) return;
    const version = generation;
    const stage = root.querySelector<HTMLElement>("[data-portal-stage]");
    const gallery = root.querySelector<HTMLElement>("[data-portal-gallery]");
    if (!stage || !gallery) return;

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
    let render = () => {};
    const visibility = () => {
      if (!document.hidden) render();
    };
    const release = () => {
      if (dead) return;
      dead = true;
      observer?.disconnect();
      intersection?.disconnect();
      context?.revert();
      root
        .querySelectorAll<HTMLElement>(
          "[data-portal-copy], [data-portal-caption]",
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
      gallery.inert = true;
      root
        .querySelectorAll<HTMLElement>("[data-portal-card]")
        .forEach((element) => {
          element.style.removeProperty("transform");
        });
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
      const [hand, stone, images] = await Promise.all([
        load(maskSrc),
        load(stoneSrc),
        Promise.all(
          elements.map(async (element) => {
            const image = element.querySelector<HTMLImageElement>("img");
            if (!image) return null;
            try {
              return await load(image.currentSrc || image.src);
            } catch {
              return null;
            }
          }),
        ),
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
      wall = buildPortalWall(hand, stone);
      scene.add(wall.group);
      const camera = new PerspectiveCamera(FOV, 1, 0.01, 150);
      const state = { progress: 0 };
      plane = new PlaneGeometry(1, 1);
      const cards = elements.map((element, index) => {
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
          color: texture ? new Color("white") : colour("roasted"),
        });
        materials.push(material);
        const mesh = new Mesh(plane!, material);
        mesh.position.z = DEPTHS[index % DEPTHS.length];
        scene.add(mesh);
        return { element, mesh, texture, x: 0, y: 0, width: 0, height: 0 };
      });
      const projected = new Vector3();
      let width = 1;
      let height = 1;
      let openingX = 0;
      let openingY = 0;
      let revealed = false;

      render = () => {
        if (dead || offscreen || document.hidden || !renderer) return;
        const p = state.progress;
        const enter = Math.min(p / 0.5, 1);
        const approach = gsap.utils.clamp(0, 1, (p - 0.5) / 0.44);
        const eased = approach * approach * (3 - 2 * approach);
        const z =
          p < 0.5
            ? 11.5 * (1 - enter) ** 2 - 0.5
            : -0.5 + (END_Z + 0.5) * eased;
        const aim = Math.min(enter * 1.8, 1);
        const aimEase = aim * aim * (3 - 2 * aim);
        camera.position.set(openingX * aimEase, openingY * aimEase, z);
        camera.updateMatrixWorld();
        renderer.render(scene, camera);

        // Transparent semantic links follow the canvas planes. All layout
        // reads happen on resize; scroll frames write transforms only.
        for (const card of cards) {
          projected.copy(card.mesh.position).project(camera);
          const x = ((projected.x + 1) * width) / 2;
          const y = ((1 - projected.y) * height) / 2;
          const scale =
            (END_Z - card.mesh.position.z) / (z - card.mesh.position.z);
          card.element.style.transform = `translate3d(${x - card.x}px, ${y - card.y}px, 0) scale(${scale})`;
        }
        const nextRevealed = p >= 0.94;
        if (nextRevealed !== revealed) {
          revealed = nextRevealed;
          gallery.inert = !revealed;
        }
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
        camera.updateProjectionMatrix();
        const scale =
          width < 1024 ? Math.min(0.8, Math.max(0.48, width / height)) : 1;
        wall.group.scale.setScalar(scale);
        wall.group.position.y = width < 1024 ? 1.7 : 1.35;
        openingX = wall.openingCenter.x * scale;
        openingY = wall.group.position.y + wall.openingCenter.y * scale;
        for (const card of cards) {
          const { element, mesh, texture } = card;
          card.width = element.offsetWidth;
          card.height = element.offsetHeight;
          card.x = element.offsetLeft + card.width / 2;
          card.y = element.offsetTop + card.height / 2;
          const frustumHeight =
            2 * Math.tan((FOV * Math.PI) / 360) * (END_Z - mesh.position.z);
          const unit = frustumHeight / height;
          mesh.scale.set(card.width * unit, card.height * unit, 1);
          mesh.position.x = openingX + (card.x - width / 2) * unit;
          mesh.position.y = openingY + (height / 2 - card.y) * unit;
          if (texture) {
            const imageRatio = texture.image.width / texture.image.height;
            const boxRatio = card.width / card.height;
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
          captions: root.querySelectorAll("[data-portal-caption]"),
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
