"use client";

/**
 * WebGL scene factory — the generic half of the pattern proven in
 * src/lib/motion/terrain-dolly.ts, extracted so E-group sketches (E5
 * distortion surface next) share one lifecycle instead of five.
 *
 * Contract per SKILL.md: lazy import of three after the section is near,
 * DPR ≤ 1.5, IntersectionObserver activation through the manager (one
 * renderer live at a time), context-lost → poster, full dispose on destroy,
 * and a poster fallback whose reason is stamped on the host so the section
 * can render honest static art instead.
 *
 * Reduced motion never builds the scene at all — the poster IS the reduced
 * experience (X6: absent, not slowed).
 */

import type { MotionModule } from "@/lib/motion-controller";
import { releaseActive, requestActive, type ManagedScene } from "./manager";

type ThreeNS = typeof import("three");

export type SceneContext = {
  THREE: ThreeNS;
  scene: import("three").Scene;
  camera: import("three").PerspectiveCamera;
  renderer: import("three").WebGLRenderer;
  host: HTMLElement;
};

export type SceneImpl = {
  /** Build the scene graph. May return its own teardown. */
  build(ctx: SceneContext): (() => void) | void;
  /** Per-frame update. elapsed/delta in seconds. */
  update?(elapsed: number, delta: number): void;
};

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

export function createWebGLScene(
  getHost: () => HTMLElement | null,
  impl: SceneImpl,
): MotionModule {
  let destroyed = false;
  let io: IntersectionObserver | null = null;
  let ro: ResizeObserver | null = null;
  let frame = 0;
  let ctx: SceneContext | null = null;
  let implTeardown: (() => void) | void;
  let handle: ManagedScene | null = null;

  const fallback = (host: HTMLElement, reason: string) => {
    host.dataset.webglFallback = reason;
  };

  const loop = () => {
    if (!ctx) return;
    const clock = performance.now() / 1000;
    impl.update?.(clock, 1 / 60);
    ctx.renderer.render(ctx.scene, ctx.camera);
    frame = requestAnimationFrame(loop);
  };

  handle = {
    resume() {
      if (!frame && ctx) frame = requestAnimationFrame(loop);
    },
    suspend() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };

  const buildScene = async (host: HTMLElement) => {
    const THREE = await import("three");
    if (destroyed) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      fallback(host, "context-lost");
      if (handle) releaseActive(handle);
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      host.clientWidth / Math.max(host.clientHeight, 1),
      0.1,
      100,
    );

    ctx = { THREE, scene, camera, renderer, host };
    implTeardown = impl.build(ctx);

    ro = new ResizeObserver(() => {
      if (!ctx) return;
      const { clientWidth: w, clientHeight: h } = host;
      ctx.renderer.setSize(w, h);
      ctx.camera.aspect = w / Math.max(h, 1);
      ctx.camera.updateProjectionMatrix();
    });
    ro.observe(host);
  };

  const init = () => {
    const host = getHost();
    if (!host) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return fallback(host, "reduced-motion");
    }
    if ((navigator as SaveDataNavigator).connection?.saveData) {
      return fallback(host, "save-data");
    }
    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2")) {
      return fallback(host, "no-webgl2");
    }

    let loading = false;
    io = new IntersectionObserver(
      (entries) => {
        const near = entries.some((entry) => entry.isIntersecting);
        if (near && !ctx && !loading) {
          loading = true;
          void buildScene(host).then(() => {
            if (!destroyed && handle) requestActive(handle);
          });
        } else if (near && ctx && handle) {
          requestActive(handle);
        } else if (!near && handle) {
          releaseActive(handle);
        }
      },
      { rootMargin: "25% 0px" },
    );
    io.observe(host);
  };

  const destroy = () => {
    destroyed = true;
    if (handle) releaseActive(handle);
    io?.disconnect();
    ro?.disconnect();
    if (typeof implTeardown === "function") implTeardown();
    if (ctx) {
      ctx.scene.traverse((object) => {
        const mesh = object as import("three").Mesh;
        mesh.geometry?.dispose?.();
        const material = mesh.material as
          | import("three").Material
          | import("three").Material[]
          | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose?.();
      });
      ctx.renderer.dispose();
      ctx.renderer.domElement.remove();
      ctx = null;
    }
  };

  return { init, destroy };
}
