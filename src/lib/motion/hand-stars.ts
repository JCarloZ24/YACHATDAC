import { BufferGeometry, Float32BufferAttribute } from "three";

/**
 * "The sky answers the hand" — the one star field both skies share.
 *
 * Truth's Wattanuri floor (GalaxyField.tsx, 13 September 2026) set the look:
 * a layer of generated points over the sky where the stars nearest a fine
 * pointer part, swell, brighten and warm, and the rest of the field holds
 * still apart from a slow twinkle. The homepage night sky took the same field
 * on 15 September 2026 (user direction: "the same style as the one on Truth").
 *
 * Extracted rather than copied so the two cannot drift: the geometry, the
 * parting lens, the twinkle, the point size and the colour of a star all live
 * here. What each host adds around them — Truth's arrival sweep, the
 * homepage's woodland occlusion and daylight fade — stays with the host.
 *
 * Grammar row: "the sky answers the hand", docs/motion/motion-grammar.md.
 */
export const HAND_STARS = {
  count: 1400,
  /** CSS px from the pointer at which a star stops answering. */
  reach: 170,
  /** CSS px a star at the pointer is pushed, before the depth weighting. */
  parting: 18,
  /** Share of the remaining distance the glow travels toward the pointer per 60Hz frame. */
  follow: 0.18,
} as const;

/**
 * Positions are 0..1 of the host box, origin top-left, overscanned by 6% so
 * parting never walks an empty edge into frame. `depth` is 0 far .. 1 near
 * (skewed far, so most stars are small), `seed` drives each star's twinkle.
 */
export function createHandStarGeometry(count: number = HAND_STARS.count): BufferGeometry {
  const positions = new Float32Array(count * 3);
  const depth = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.random() * 1.12 - 0.06;
    positions[i * 3 + 1] = Math.random() * 1.12 - 0.06;
    depth[i] = Math.pow(Math.random(), 2.2);
    seed[i] = Math.random();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("depth", new Float32BufferAttribute(depth, 1));
  geometry.setAttribute("seed", new Float32BufferAttribute(seed, 1));
  return geometry;
}

/** Vertex-stage helpers. `p` and `pointer` in CSS px, same origin. */
export const handStarVertex = /* glsl */ `
  vec2 handStarPart(vec2 p, vec2 pointer, float depth, out float near) {
    vec2 d = p - pointer;
    near = 1.0 - smoothstep(0.0, ${HAND_STARS.reach.toFixed(1)}, length(d));
    return p + normalize(d + 0.0001) * near * near
      * ${HAND_STARS.parting.toFixed(1)} * (0.4 + depth);
  }
  float handStarTwinkle(float time, float seed) {
    return 0.65 + 0.35 * sin(time * (0.6 + seed * 1.8) + seed * 40.0);
  }
  float handStarSize(float depth, float glow) {
    return mix(1.0, 2.8, depth) + glow * 2.5;
  }
`;

/** Fragment-stage colour of one star: cool at rest, warm under the hand. */
export const handStarFragment = /* glsl */ `
  vec4 handStarLight(vec2 coord, float glow, float twinkle) {
    float r = length(coord - 0.5) * 2.0;
    float disc = 1.0 - smoothstep(0.2, 1.0, r);
    float alpha = disc * (0.35 * twinkle + glow * 0.9);
    return vec4(mix(vec3(0.78, 0.86, 1.0), vec3(1.0, 0.86, 0.62), glow), alpha);
  }
`;
