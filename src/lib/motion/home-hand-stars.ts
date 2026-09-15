import { AdditiveBlending, Points, ShaderMaterial, Vector2 } from "three";
import { createHandStarGeometry, HAND_STARS, handStarFragment, handStarVertex } from "./hand-stars";

/**
 * The homepage night sky answers the hand — user direction, 15 September 2026.
 *
 * Truth's Wattanuri field (hand-stars.ts), drawn in the hero's own canvas as a
 * second object after the land plate: same renderer, same frame, no second GL
 * context. A first pass that bent the shader's generated stars under the
 * pointer was rejected the same day as "just morphing the photo"; this is the
 * layer of separate, living points the user asked for instead.
 *
 * What Truth's field never had to do, this one does, because the homepage sky
 * is not a photograph of night: it is one clock running from night, through
 * day, back to night, under a woodland that stands in front of it.
 *   - The land occludes. Each star reads the photograph's alpha at its own
 *     position through the plate's exact crop (`landscapeUv` in home-land.ts),
 *     so a star behind a branch is hidden whole, as a star is.
 *   - Daylight clears it. `solarDepression` fades the field in between 3° of
 *     sun and 4° below the horizon: the opening night (~20°) and the welcome's
 *     dawn (~2°, the Milky Way over amber) carry it, Wonder's sunrise does not,
 *     and it returns with the afterglow into the 2026 and Belonging nights.
 *   - The lift carries it. The stars ride the scene off the top of the canvas
 *     with the land and are gone over the charcoal it leaves.
 *
 * Every uniform the plate already owns is SHARED by reference, not copied, so
 * the crop, zoom, lift and sun the scroll writes to the land reach these stars
 * in the same frame with no second bookkeeping path.
 *
 * Grammar row: "the sky answers the hand", Home night sky.
 */
export function createHomeHandStars(land: ShaderMaterial, ratio: number) {
  const geometry = createHandStarGeometry();
  const uniforms = {
    pointer: { value: new Vector2(-9999, -9999) },
    size: { value: new Vector2(1, 1) },
    time: { value: 0 },
    ratio: { value: ratio },
    landscape: land.uniforms.landscape,
    landscapeCrop: land.uniforms.landscapeCrop,
    landscapeAnchor: land.uniforms.landscapeAnchor,
    landscapeZoom: land.uniforms.landscapeZoom,
    landscapeReady: land.uniforms.landscapeReady,
    lift: land.uniforms.lift,
    solarDepression: land.uniforms.solarDepression,
  };
  const material = new ShaderMaterial({
    uniforms,
    transparent: true, depthTest: false, depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform vec2 pointer;   // CSS px, origin top-left
      uniform vec2 size;      // CSS px
      uniform float time;
      uniform float ratio;
      uniform float lift;
      attribute float depth;
      attribute float seed;
      varying float vGlow;
      varying float vTwinkle;
      varying vec2 vSky;
      ${handStarVertex}
      void main() {
        // The lift carries the whole scene up the canvas, stars included.
        vec2 p = position.xy * size - vec2(0.0, lift * size.y);
        float near;
        p = handStarPart(p, pointer, depth, near);
        vGlow = near;
        vTwinkle = handStarTwinkle(time, seed);
        // The land's own sUv at this star: bottom-left origin, lift removed.
        vSky = vec2(p.x / size.x, 1.0 - p.y / size.y - lift);
        gl_Position = vec4(p.x / size.x * 2.0 - 1.0, 1.0 - p.y / size.y * 2.0, 0.0, 1.0);
        gl_PointSize = handStarSize(depth, vGlow) * ratio;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D landscape;
      uniform vec2 landscapeCrop;
      uniform float landscapeAnchor;
      uniform float landscapeZoom;
      uniform float landscapeReady;
      uniform float solarDepression;
      varying float vGlow;
      varying float vTwinkle;
      varying vec2 vSky;
      ${handStarFragment}
      void main() {
        // ⚠ The plate's crop, verbatim (home-land.ts). Change one, change both.
        vec2 landscapeUv = vec2(
          (vSky.x - 0.5) * landscapeCrop.x / landscapeZoom + 0.5,
          (vSky.y - 0.5) * landscapeCrop.y / landscapeZoom + landscapeAnchor);
        float land = texture2D(landscape, clamp(landscapeUv, 0.001, 0.999)).a;
        // Row 450 of the plate is its opaque horizon (home-land.ts); the
        // stars thin out just above it rather than stopping on a line.
        float horizon = (0.70 - landscapeAnchor) * landscapeZoom / landscapeCrop.y + 0.5;
        float sky = (1.0 - land) * smoothstep(horizon, horizon + 0.06, vSky.y);
        float night = smoothstep(-3.0, 4.0, solarDepression);
        vec4 light = handStarLight(gl_PointCoord, vGlow, vTwinkle);
        gl_FragColor = vec4(light.rgb, light.a * sky * night * landscapeReady);
      }
    `,
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  // After the plate: the stars add light over the sky the land has drawn.
  points.renderOrder = 1;

  // Eased toward each frame, as on Truth. Normalised to 60Hz so a scroll
  // render landing in the same frame as the breeze does not speed it up.
  const target = new Vector2(-9999, -9999);
  let inside = false;
  let last = 0;
  const start = performance.now();

  return {
    points,
    /** Pointer in CSS px relative to the hero's top-left, or null when it leaves. */
    setPointer(x: number | null, y = 0) {
      inside = x !== null;
      if (inside) target.set(x as number, y);
    },
    setSize(width: number, height: number) {
      uniforms.size.value.set(Math.max(width, 1), Math.max(height, 1));
    },
    update() {
      const now = performance.now();
      const frames = last ? Math.min((now - last) / (1000 / 60), 4) : 1;
      last = now;
      uniforms.time.value = (now - start) / 1000;
      const pointer = uniforms.pointer.value;
      if (!inside) pointer.set(-9999, -9999);
      else if (pointer.x < -9000) pointer.copy(target);
      else pointer.lerp(target, 1 - Math.pow(1 - HAND_STARS.follow, frames));
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
