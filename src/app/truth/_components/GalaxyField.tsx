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
 */
import { useEffect, useRef } from "react";
import {
  AdditiveBlending, BufferGeometry, Float32BufferAttribute, OrthographicCamera,
  Points, Scene, ShaderMaterial, Vector2, WebGLRenderer,
} from "three";

const COUNT = 1400;

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
  void main() {
    vec2 p = position.xy * size;
    vec2 d = p - pointer;
    float dist = length(d);
    float reach = 170.0;
    float near = 1.0 - smoothstep(0.0, reach, dist);
    p += normalize(d + 0.0001) * near * near * 18.0 * (0.4 + depth);
    // THE ARRIVAL (user, 14 Sep 2026): while the band rises over the shelter
    // the field lights on its own — a front travelling down from the crest,
    // with a quieter wash behind it — and hands back to the pointer once the
    // sky has landed.
    float front = 1.0 - smoothstep(0.0, 140.0, abs(p.y - sweep));
    float wash = step(p.y, sweep) * 0.35;
    float arrive = entry * max(front, wash) * (0.5 + 0.5 * seed);
    vGlow = max(near, arrive);
    vTwinkle = 0.65 + 0.35 * sin(time * (0.6 + seed * 1.8) + seed * 40.0);
    gl_Position = vec4(p.x / size.x * 2.0 - 1.0, 1.0 - p.y / size.y * 2.0, 0.0, 1.0);
    gl_PointSize = (mix(1.0, 2.8, depth) + vGlow * 2.5) * ratio;
  }
`;

const fragmentShader = `
  varying float vGlow;
  varying float vTwinkle;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float disc = 1.0 - smoothstep(0.2, 1.0, r);
    float alpha = disc * (0.35 * vTwinkle + vGlow * 0.9);
    vec3 warm = vec3(1.0, 0.86, 0.62);
    vec3 cool = vec3(0.78, 0.86, 1.0);
    gl_FragColor = vec4(mix(cool, warm, vGlow), alpha);
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

    const positions = new Float32Array(COUNT * 3);
    const depth = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // Overscan by 6% so parallax never walks an empty edge into frame.
      positions[i * 3] = Math.random() * 1.12 - 0.06;
      positions[i * 3 + 1] = Math.random() * 1.12 - 0.06;
      depth[i] = Math.pow(Math.random(), 2.2);
      seed[i] = Math.random();
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("depth", new Float32BufferAttribute(depth, 1));
    geometry.setAttribute("seed", new Float32BufferAttribute(seed, 1));

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
      else p.lerp(glowAt, 0.18);
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
