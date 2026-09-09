"use client";

import * as THREE from "three";
import type { MotionModule } from "../motion-controller";

/** INT-04, user reference 2026-09-09. Generated interpretation, not a scan.
 * A tapered elliptical section follows the curved wood's centreline.
 */
function makeGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.0, -1.9, 0), new THREE.Vector3(-1.14, -1.05, 0),
    new THREE.Vector3(-1.05, -0.05, 0), new THREE.Vector3(-0.65, 0.72, 0),
    new THREE.Vector3(0.35, 1.23, 0), new THREE.Vector3(1.65, 1.62, 0),
  ]);
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  const length = 160, sides = 40;
  for (let i = 0; i <= length; i++) {
    const u = i / length, point = curve.getPointAt(u), tangent = curve.getTangentAt(u);
    const end = Math.pow(Math.sin(Math.PI * u), 0.32);
    const width = (0.28 + 0.11 * Math.sin(Math.PI * u)) * end;
    for (let j = 0; j <= sides; j++) {
      const angle = j / sides * Math.PI * 2;
      positions.push(point.x - tangent.y * Math.cos(angle) * width,
        point.y + tangent.x * Math.cos(angle) * width,
        Math.sin(angle) * 0.085 * end);
      uvs.push(u, j / sides);
      if (i < length && j < sides) {
        const a = i * (sides + 1) + j, b = a + sides + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.center();
  return geometry;
}

let woodCanvas: HTMLCanvasElement | undefined;
function makeWood() {
  if (woodCanvas) {
    const texture = new THREE.CanvasTexture(woodCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 2048; canvas.height = 512;
  const context = canvas.getContext("2d")!;
  const pixels = context.createImageData(canvas.width, canvas.height);
  let seed = 42;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    const u = x / canvas.width, v = y / canvas.height;
    const grain = Math.sin(v * 420 + Math.sin(u * 22) * 3 + Math.sin(u * 7) * 9);
    const fine = Math.sin(v * 1700 + Math.sin(u * 45) * 5);
    const noise = (random() - 0.5) * 26 + grain * 9 + fine * 4;
    const stripe = Math.sin(u * 98 + Math.sin(v * Math.PI * 2) * 0.6) > 0.86;
    const front = Math.min(Math.abs(v - 0.25), Math.abs(v - 0.75));
    const radius = Math.hypot((u - 0.49) / 0.067, front / 0.19);
    const color = radius < 0.78 ? [30, 31, 27] : radius < 1 || stripe ? [206, 137, 54] : [126, 63, 30];
    const i = (y * canvas.width + x) * 4;
    for (let c = 0; c < 3; c++) pixels.data[i + c] = color[c] + noise;
    pixels.data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  woodCanvas = canvas;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function createRecordBoomerang(canvas: HTMLCanvasElement, ready: () => void): MotionModule {
  let dispose: (() => void) | undefined;
  return {
    init() {
      dispose?.();
      let renderer: THREE.WebGLRenderer;
      try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
      camera.position.z = 7.5;
      const texture = makeWood(), geometry = makeGeometry();
      const material = new THREE.MeshPhysicalMaterial({ map: texture, roughness: 0.63,
        metalness: 0, clearcoat: 0.18, clearcoatRoughness: 0.58, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      scene.add(new THREE.HemisphereLight(0xffebd0, 0x26364e, 2.5));
      const key = new THREE.DirectionalLight(0xffdfb7, 4.2); key.position.set(-3, 4, 5); scene.add(key);
      const rim = new THREE.DirectionalLight(0xc8deff, 2.4); rim.position.set(4, 1, -2); scene.add(rim);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      let targetX = -0.12, targetY = -0.22, targetZ = -0.2;
      mesh.rotation.set(targetX, targetY, targetZ);
      let frame = 0, dragging = false, manipulated = false, px = 0, py = 0, visible = true;
      const render = () => {
        frame = 0;
        const factor = reduced.matches ? 1 : 0.13;
        mesh.rotation.x += (targetX - mesh.rotation.x) * factor;
        mesh.rotation.y += (targetY - mesh.rotation.y) * factor;
        mesh.rotation.z += (targetZ - mesh.rotation.z) * factor;
        renderer.render(scene, camera);
        if (visible && Math.abs(targetX - mesh.rotation.x) + Math.abs(targetY - mesh.rotation.y) + Math.abs(targetZ - mesh.rotation.z) > 0.001) frame = requestAnimationFrame(render);
      };
      const update = () => { if (!frame && visible) frame = requestAnimationFrame(render); };
      const resize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.position.z = camera.aspect < 1 ? 9.5 : 7.5;
        camera.updateProjectionMatrix(); update();
      };
      const observer = new ResizeObserver(resize); observer.observe(canvas);
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) update(); });
      visibility.observe(canvas);
      const down = (e: PointerEvent) => { dragging = true; manipulated = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); };
      const move = (e: PointerEvent) => {
        if (dragging) { targetY += (e.clientX - px) * 0.009; targetX += (e.clientY - py) * 0.009; px = e.clientX; py = e.clientY; }
        else if (!manipulated && e.pointerType === "mouse") {
          const box = canvas.getBoundingClientRect();
          targetY = -0.22 + ((e.clientX - box.left) / box.width - 0.5) * 0.4;
          targetX = -0.12 + ((e.clientY - box.top) / box.height - 0.5) * 0.25;
        }
        update();
      };
      const up = () => { dragging = false; };
      const keyboard = (e: KeyboardEvent) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(e.key)) return;
        e.preventDefault();
        manipulated = true;
        if (e.key === "Home") { targetX = -0.12; targetY = -0.22; targetZ = -0.2; }
        else if (e.key === "ArrowLeft") targetY -= 0.2;
        else if (e.key === "ArrowRight") targetY += 0.2;
        else if (e.key === "ArrowUp") targetX -= 0.2;
        else targetX += 0.2;
        update();
      };
      canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
      canvas.addEventListener("keydown", keyboard);
      resize(); render(); ready();
      dispose = () => {
        cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect();
        canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); canvas.removeEventListener("keydown", keyboard);
        geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose();
      };
    },
    destroy() { dispose?.(); dispose = undefined; },
  };
}
