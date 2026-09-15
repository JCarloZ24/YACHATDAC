"use client";

/**
 * The Wattanuri sky, interactable (user direction, 13 September 2026).
 *
 * A Three.js star field laid over the closing photograph — the photograph
 * stays underneath and stays the record; this is a layer of generated points
 * that answers a fine pointer. Stars nearest the cursor brighten and part
 * slightly; the rest of the field holds still (user, 13 Sep 2026: do not
 * move every star on hover). While the band covers the shelter the field
 * lights on its own as it arrives (14 Sep 2026); otherwise nothing moves on
 * its own beyond a slow twinkle.
 *
 * Grammar row: "the sky answers the hand", docs/motion/motion-grammar.md.
 *
 * Deliberately not a controller module: it is a render loop, not a GSAP
 * timeline, and it owns no scroll. It mounts only for a fine pointer without
 * reduced motion, renders only while the band is on screen, and releases its
 * GL context on unmount.
 *
 * The star itself — geometry, parting lens, twinkle, size and colour — lives
 * in src/lib/motion/hand-stars.ts since 15 September 2026, when the homepage
 * night sky took the same field. Only the arrival sweep is Truth's own.
 */
import { useEffect, useRef } from "react";
import {
  AdditiveBlending, OrthographicCamera, Points, Scene, ShaderMaterial, Vector2, WebGLRenderer,
} from "three";
import {
  createHandStarGeometry, HAND_STARS, handStarFragment, handStarVertex,
} from "@/lib/motion/hand-stars";

const vertexShader = `
  uniform vec2 pointer;     // CSS px, origin top-left
  uniform vec2 size;        // CSS px
  uniform float time;
  uniform float ratio;
  uniform float entry;     // 0 settled/away .. transition in progress
  uniform float sweep;     // CSS px from band top: the arrival front
  attribute float depth;    // 0 far .. 1 near
  attribute float seed;
  varying float vGlow;
  varying float vTwinkle;
  ${handStarVertex}
  void main() {
    float near;
    vec2 p = handStarPart(position.xy * size, pointer, depth, near);
    // THE ARRIVAL (user, 14 Sep 2026): while the band rises over the shelter
    // the field lights on its own — a front travelling down from the crest,
    // with a quieter wash behind it — and hands back to the pointer once the
    // sky has landed.
    float front = 1.0 - smoothstep(0.0, 140.0, abs(p.y - sweep));
    float wash = step(p.y, sweep) * 0.35;
    float arrive = entry * max(front, wash) * (0.5 + 0.5 * seed);
    vGlow = max(near, arrive);
    vTwinkle = handStarTwinkle(time, seed);
    gl_Position = vec4(p.x / size.x * 2.0 - 1.0, 1.0 - p.y / size.y * 2.0, 0.0, 1.0);
    gl_PointSize = handStarSize(depth, vGlow) * ratio;
  }
`;

const fragmentShader = `
  varying float vGlow;
  varying float vTwinkle;
  ${handStarFragment}
  void main() {
    gl_FragColor = handStarLight(gl_PointCoord, vGlow, vTwinkle);
  }
`;

export function GalaxyField() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const band = host?.parentElement;
    if (!host || !band) return;
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      return;
    }
    const ratio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(ratio);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
    host.appendChild(renderer.domElement);

    const geometry = createHandStarGeometry();

    const uniforms = {
      pointer: { value: new Vector2(-9999, -9999) },
      size: { value: new Vector2(1, 1) },
      time: { value: 0 },
      ratio: { value: ratio },
      entry: { value: 0 },
      sweep: { value: 0 },
    };
    const material = new ShaderMaterial({
      uniforms, vertexShader, fragmentShader,
      transparent: true, depthTest: false, blending: AdditiveBlending,
    });
    const scene = new Scene();
    scene.add(new Points(geometry, material));
    const camera = new OrthographicCamera();

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      uniforms.size.value.set(Math.max(width, 1), Math.max(height, 1));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Eased toward on each frame; `inside` decides whether the pointer counts.
    const glowAt = new Vector2(-9999, -9999);
    let inside = false;
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) return;
      glowAt.set(e.clientX - r.left, e.clientY - r.top);
    };
    const onLeave = () => { inside = false; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    let visible = false;
    let raf = 0;
    const start = performance.now();
    const frame = () => {
      raf = 0;
      if (!visible) return;
      uniforms.time.value = (performance.now() - start) / 1000;
      // Progress of the cover, read from the band's own box (transforms
      // included, so the deck's slide counts): 0 when its top is at the
      // viewport foot, 1 when it reaches the crown.
      const box = host.getBoundingClientRect();
      const vh = window.innerHeight;
      const cover = Math.min(Math.max(1 - box.top / vh, 0), 1);
      const live = cover > 0.001 && cover < 0.999 ? Math.sin(Math.PI * cover) : 0;
      uniforms.entry.value += (live - uniforms.entry.value) * 0.12;
      uniforms.sweep.value = cover * vh;
      const p = uniforms.pointer.value;
      if (!inside) p.set(-9999, -9999);
      else if (p.x < -9000) p.copy(glowAt);
      else p.lerp(glowAt, HAND_STARS.follow);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
