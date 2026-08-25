"use client";

/**
 * E1 — Terrain dolly. The one WebGL section on the site.
 *
 * The mesh never animates; only the camera moves. That keeps it cheap, and it is
 * also the honest version — the land is not performing, you are moving across it.
 *
 * Wireframe, not photoreal. Wireframe reads as survey data, which is what this is.
 * A textured photoreal version reads as a video game and invites the Game-of-Thrones
 * comparison the team already rejected. Stay on the survey side of that line.
 *
 * Status is *hold* in the sketch library: approved in principle for About and
 * Research, land-detail level unconfirmed. It therefore renders the synthetic
 * field from `src/lib/terrain/generic-field.ts` and never a real DEM. Never add
 * place labels, boundaries or site markers to this scene.
 *
 * Budget, per the skill: one WebGL section site-wide, lazy-imported after first
 * paint, DPR capped at 1.5, render loop paused off-screen, everything disposed
 * on teardown, poster-frame fallback on reduced motion / no WebGL / Save-Data.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type * as THREE_NS from "three";
import type { MotionModule } from "@/lib/motion-controller";
import { sampleGenericField } from "@/lib/terrain/generic-field";

gsap.registerPlugin(ScrollTrigger);

const DPR_CAP = 1.5;

/** World size of the terrain patch, x by z. Wide enough to read as country. */
const SPAN: [number, number] = [5, 3.6];

/**
 * Camera path. Shallow and slow: that reads as landscape. Anything faster reads
 * as a flythrough and makes people queasy. Roll stays at zero and the horizon
 * stays level, per E3's note, which this inherits.
 *
 * The camera stays on one side of the patch and sweeps across it, closing in
 * and dropping slightly. It never crosses the mesh: flying *over* terrain puts
 * the grid under your feet and the read collapses into wallpaper.
 */
const CAMERA_FROM = { x: -2.4, y: 1.15, z: -2.9, tx: 0.1, ty: 0, tz: -0.2 };
const CAMERA_TO = { x: 2, y: 0.72, z: -1.2, tx: 0, ty: -0.02, tz: 0.9 };

export type TerrainDollyOptions = {
  reduced: boolean;
  /** Mesh resolution per side. Comes from the shared detail preset. */
  segments: number;
  /** Octaves of the generic field. The generalisation dial. */
  octaves: number;
  /** Peak-to-trough height of the landform, in world units. */
  relief: number;
  /** Told why the poster is showing, so the page can say so out loud. */
  onFallback?: (reason: string) => void;
};

export function createTerrainDolly(
  host: HTMLElement,
  { reduced, segments, octaves, relief, onFallback }: TerrainDollyOptions,
): MotionModule {
  const canvas = host.querySelector("canvas");

  let disposed = false;
  let raf: number | null = null;
  let observer: IntersectionObserver | null = null;
  let tween: gsap.core.Tween | null = null;
  let renderer: THREE_NS.WebGLRenderer | null = null;
  let scene: THREE_NS.Scene | null = null;
  let camera: THREE_NS.PerspectiveCamera | null = null;
  let geometry: THREE_NS.PlaneGeometry | null = null;
  let material: THREE_NS.MeshBasicMaterial | null = null;
  let onResize: (() => void) | null = null;

  const fallback = (reason: string) => {
    host.dataset.fallback = reason;
    onFallback?.(reason);
  };

  const webglUnavailable = () => {
    try {
      return !document.createElement("canvas").getContext("webgl2");
    } catch {
      return true;
    }
  };

  function init() {
    // Reduced motion cuts. It does not get a slower dolly.
    if (reduced) return fallback("reduced-motion");
    if (!canvas) return fallback("no-canvas");
    if (webglUnavailable()) return fallback("no-webgl");

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (connection?.saveData) return fallback("save-data");

    delete host.dataset.fallback;
    void build(canvas);
  }

  async function build(target: HTMLCanvasElement) {
    // Lazy: nothing 3D blocks first paint.
    const THREE = await import("three");
    if (disposed) return;

    geometry = new THREE.PlaneGeometry(SPAN[0], SPAN[1], segments, segments);
    geometry.rotateX(-Math.PI / 2); // XY plane → ground plane

    const position = geometry.attributes.position;
    const colours = new Float32Array(position.count * 3);
    const low = new THREE.Color("#5e7930"); // eucalyptus — low ground
    const high = new THREE.Color("#d69828"); // ochre — ridge lines
    const colour = new THREE.Color();

    // Sample first, then normalise. The field never uses its full 0..1 range,
    // and stretching it here is what makes the difference between "gentle
    // hills" and country with ridges in it — without touching the field, which
    // D4 contours from and which should stay identical across both components.
    const heights = new Float32Array(position.count);
    let lowest = Infinity;
    let highest = -Infinity;

    for (let i = 0; i < position.count; i++) {
      // Vertex x/z back to normalised field coordinates.
      const u = position.getX(i) / SPAN[0] + 0.5;
      const v = position.getZ(i) / SPAN[1] + 0.5;
      const height = sampleGenericField(u, v, octaves);
      heights[i] = height;
      if (height < lowest) lowest = height;
      if (height > highest) highest = height;
    }

    const range = highest - lowest || 1;

    for (let i = 0; i < position.count; i++) {
      const height = (heights[i] - lowest) / range;

      // Centred on zero, so changing the relief does not also raise or lower
      // the whole landform out of the camera's framing.
      position.setY(i, (height - 0.5) * relief);
      colour.copy(low).lerp(high, height);
      colours[i * 3] = colour.r;
      colours[i * 3 + 1] = colour.g;
      colours[i * 3 + 2] = colour.b;
    }

    position.needsUpdate = true;
    geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
    geometry.computeVertexNormals();

    material = new THREE.MeshBasicMaterial({
      wireframe: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    scene = new THREE.Scene();
    scene.add(new THREE.Mesh(geometry, material));
    // Fades the far edge of the patch out, so the mesh has no visible border
    // and the land reads as continuing past the frame.
    scene.fog = new THREE.Fog("#122449", 3.4, 8); // midnight navy

    camera = new THREE.PerspectiveCamera(52, 16 / 9, 0.1, 100);
    renderer = new THREE.WebGLRenderer({
      canvas: target,
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });

    onResize = () => {
      if (!renderer || !camera) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
      renderer.setSize(rect.width, rect.height, false);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });

    const cam = { ...CAMERA_FROM };
    const apply = () => {
      if (!camera) return;
      camera.position.set(cam.x, cam.y, cam.z);
      camera.lookAt(cam.tx, cam.ty, cam.tz);
    };
    apply();

    tween = gsap.to(cam, {
      ...CAMERA_TO,
      ease: "none",
      scrollTrigger: {
        trigger: host,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      onUpdate: apply,
    });

    target.addEventListener("webglcontextlost", onContextLost);

    // A scroll site spends most of its life not looking at the 3D.
    observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { rootMargin: "10% 0px" },
    );
    observer.observe(host);
  }

  const onContextLost = (event: Event) => {
    event.preventDefault();
    pause();
    fallback("context-lost");
  };

  function play() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function pause() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function tick() {
    if (renderer && scene && camera) renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function destroy() {
    disposed = true;
    pause();
    observer?.disconnect();
    observer = null;
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
    if (onResize) window.removeEventListener("resize", onResize);
    onResize = null;
    canvas?.removeEventListener("webglcontextlost", onContextLost);
    geometry?.dispose();
    material?.dispose();
    renderer?.dispose();
    renderer = null;
    scene = null;
    camera = null;
    geometry = null;
    material = null;
  }

  return { init, destroy };
}
