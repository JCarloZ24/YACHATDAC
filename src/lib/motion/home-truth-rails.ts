import {
  CanvasTexture, CatmullRomCurve3, InstancedBufferAttribute, InstancedBufferGeometry, Mesh,
  NormalBlending, PlaneGeometry, ShaderMaterial, SRGBColorSpace, Vector2, Vector3,
} from "three";
import { homeTruthArtwork } from "@/content/home-truth-scenes";
import { truthAcrossScale } from "./home-truth-layout";

/**
 * Home Truth's two rails, drawn dot by dot — user direction, 15 September 2026.
 *
 * The single dotted path under the Iningai introduction (Figma 3371:45366, a
 * DOM image that faded in) is replaced by the PAIR from Truth's "05 · TODAY"
 * frame (2048:11158): Rail A 2048:12273 and Rail B 2048:11629, exported
 * untouched to public/media/home/derivatives. The user wanted two lines,
 * wandering unevenly against each other, the old fade on both ends, and an
 * arrival that travels left to right instead of fading.
 *
 * Drawn in the hero canvas, not the DOM, so each dot can arrive on its own:
 *   - Both SVGs are rasterised ONCE into one texture, turned −90° so the top
 *     of Truth's vertical frame becomes the left of the homepage's line and
 *     Rail A (left in the frame) becomes the lower rail. The artist's dots are
 *     sampled as drawn; nothing is redrawn or approximated.
 *   - ⚑ FINER DOTS, same day, user direction ("way more smaller … add more
 *     dots"). Each rail's wave is kept — a centripetal Catmull-Rom through the
 *     artist's own dot centres — and re-spaced evenly along its arc at
 *     DOT_SCALE of the drawn size, so the line is the same line in finer,
 *     denser stitches (~250 a rail rather than 112). Every new dot is one of
 *     that rail's own drawn dots, cut from the texture by its SVG bounding
 *     box and cycled in a fixed permutation, so the hand-made irregularity
 *     survives the resampling. One instanced quad, one draw call.
 *   - The scroll-scrubbed `draw` sends a head along each rail; each dot pops
 *     in (scale with a small overshoot, then light) as it passes. ⚑ THE CHASE,
 *     same day, user direction: Rail A leads and Rail B sets off CHASE behind
 *     it, closing only at the end, so one reads as in front and the other as
 *     following. Scrolling back retracts them the same way.
 *
 * Colour: both rails in the old path's canvas off-white #FCF7F0 (user choice,
 * 15 Sep 2026). The files' own alpha is kept — Rail B's 75% dots stay 75% —
 * so only the hue is overridden, in the shader, not in the files.
 *
 * Placement follows the retired `.home-truth-path` rule exactly: sized by the
 * canvas WIDTH only (the 14 September "never size on both axes" correction in
 * home-hero.css), left 0.625%, anchored at 81.02% of the height with the pair
 * centred on the old path's centre line. Each rail is scaled to the old
 * path's 1778px length, so the dots are the size they were.
 *
 * ⚑ Below 1024 only (15 September 2026, user direction, desktop untouched):
 * the wave height, rail gap and dot size follow the marker's fixed compact
 * size rather than the width, and every Nth dot is kept so they don't stack.
 * home-truth-layout.ts carries the rule and the reasoning.
 *
 * Grammar row: "Country carries the years", 15 September 2026 amendment.
 */

/** Frame units: the homepage's 1440×901 Figma frame. */
const FRAME_WIDTH = 1440;
const PATH_LEFT = 9;
const PATH_TOP = 730;
const PATH_CENTRE = 752.5;
const PATH_LENGTH = 1778;
/** Where each rail sits in the Truth frame (2048:11158), in its own px. */
const RAILS = [
  { left: 73, top: -29, width: 27.57, height: 1087.66 },
  { left: 111, top: -20, width: 27.5722, height: 1087.79 },
] as const;
/** One rail's length scaled to the old path: the dots keep their size. */
const SCALE = PATH_LENGTH / RAILS[0].height;
/** How big a dot is against the artist's drawing; spacing scales with it,
 *  so a smaller dot means proportionally more of them. The one dial for
 *  "too big" / "too small". */
const DOT_SCALE = 0.55;
/** Texture px per rail px: 2× the layout scale, crisp at HiDPI. */
const ATLAS = SCALE * 2;
const PAD = 2;

/** The old path's baked gradient stops, as fractions of the line's length. */
const FADE_IN = 0.0673;
const FADE_OUT_START = 0.7019;
const FADE_OUT_END = 0.8173;
/** Share of the line a dot takes to arrive, and how far behind Rail A's head
 *  Rail B's runs (a share of the line) until the scrub closes it at the end. */
const ARRIVAL = 0.05;
const CHASE = 0.22;

async function readRail(src: string) {
  const text = await (await fetch(src)).text();
  const svg = new DOMParser().parseFromString(text, "image/svg+xml").documentElement as unknown as SVGSVGElement;
  // One layout read, at build: the bounding box of every dot as drawn.
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none";
  host.appendChild(svg);
  document.body.appendChild(host);
  const boxes = Array.from(svg.querySelectorAll("path"), (path) => path.getBBox());
  host.remove();
  return { text, boxes };
}

function rasterise(text: string, width: number, height: number) {
  // Re-declare the SVG's own size at atlas scale, so the browser rasterises
  // the vectors at that resolution instead of stretching a 27px bitmap.
  const scaled = text.replace(/<svg([^>]*?)\swidth="[^"]*"\s+height="[^"]*"/,
    `<svg$1 width="${width * ATLAS}" height="${height * ATLAS}"`);
  const image = new Image();
  image.src = URL.createObjectURL(new Blob([scaled], { type: "image/svg+xml" }));
  return image.decode().then(() => image);
}

export function createHomeTruthRails() {
  const quad = new PlaneGeometry(1, 1);
  const geometry = new InstancedBufferGeometry();
  geometry.index = quad.index;
  geometry.setAttribute("position", quad.getAttribute("position"));
  const uniforms = {
    atlas: { value: null as CanvasTexture | null },
    viewport: { value: new Vector2(1, 1) },
    draw: { value: 0 },
    opacity: { value: 1 },
    /** Canvas px per frame px across the line; see home-truth-layout.ts. */
    across: { value: 1 },
    /** Keep every Nth dot of each rail — 1 on desktop; thins the rail where
     *  the compact across-scale would otherwise stack dots on each other. */
    stride: { value: 1 },
  };
  const material = new ShaderMaterial({
    uniforms,
    transparent: true, depthTest: false, depthWrite: false, blending: NormalBlending,
    vertexShader: /* glsl */ `
      uniform vec2 viewport;   // canvas CSS px
      uniform float draw;
      attribute vec2 aCenter;  // frame px
      attribute vec2 aSize;    // frame px
      attribute vec4 aUv;      // atlas rect: x, y, w, h (0..1, top-down)
      attribute float aAlong;  // 0..1 along the pair
      attribute float aLine;   // 0 Rail A, 1 Rail B
      attribute float aIndex;  // position along its own rail
      uniform float across;
      uniform float stride;
      varying vec2 vUv;
      varying float vLight;
      void main() {
        // Rail A's head leads; Rail B's runs CHASE behind it and arrives last.
        float head = draw * ${(FADE_OUT_END + ARRIVAL + CHASE).toFixed(4)} - aLine * ${CHASE.toFixed(3)};
        float t = clamp((head - aAlong) / ${ARRIVAL.toFixed(3)}, 0.0, 1.0);
        float pop = t * t * (3.0 - 2.0 * t);
        float grow = mix(0.25, 1.0, pop) + 0.12 * sin(3.14159265 * t);
        float fade = smoothstep(0.0, ${FADE_IN.toFixed(4)}, aAlong)
          * (1.0 - smoothstep(${FADE_OUT_START.toFixed(4)}, ${FADE_OUT_END.toFixed(4)}, aAlong));
        float keep = 1.0 - step(0.5, mod(aIndex, stride));
        vLight = pop * fade * keep;
        // PlaneGeometry's y runs up; screen px run down.
        vec2 corner = vec2(position.x, -position.y);
        vUv = aUv.xy + (corner + 0.5) * aUv.zw;
        // Along the line by width; across it (and the dots) by the across
        // scale, which IS the width scale on desktop. Anchored where the old path's
        // top sat.
        float s = viewport.x / ${FRAME_WIDTH.toFixed(1)};
        vec2 px = vec2(aCenter.x * s,
          viewport.y * ${(PATH_TOP / 901).toFixed(5)} + (aCenter.y - ${PATH_TOP.toFixed(1)}) * across)
          + corner * aSize * grow * across * keep;
        gl_Position = vec4(px.x / viewport.x * 2.0 - 1.0, 1.0 - px.y / viewport.y * 2.0, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D atlas;
      uniform float opacity;
      varying vec2 vUv;
      varying float vLight;
      void main() {
        float alpha = texture2D(atlas, vUv).a * vLight * opacity;
        if (alpha < 0.002) discard;
        gl_FragColor = vec4(vec3(0.98824, 0.96863, 0.94118), alpha);
      }
    `,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  // After the land plate and the hand-stars.
  mesh.renderOrder = 2;
  mesh.visible = false;

  /** Rail B — the top rail — as drawn, frame px, sorted along the line. */
  let topRail: { x: number; y: number }[] = [];
  /** The pair's length in frame px, which the end fades are fractions of. */
  let lineLength = PATH_LENGTH;

  const load = async () => {
    const rails = await Promise.all(homeTruthArtwork.rails.map((rail) => readRail(rail.src)));
    const images = await Promise.all(rails.map((rail, i) => rasterise(rail.text, RAILS[i].width, RAILS[i].height)));
    // The pair in the Truth frame, turned −90°: along = frame y, across = −frame x.
    const alongStart = Math.min(...RAILS.map((r) => r.top));
    const alongEnd = Math.max(...RAILS.map((r) => r.top + r.height));
    const acrossEnd = Math.max(...RAILS.map((r) => r.left + r.width));
    const acrossStart = Math.min(...RAILS.map((r) => r.left));
    const pairLength = alongEnd - alongStart;
    const pairTop = PATH_CENTRE - (acrossEnd - acrossStart) * SCALE / 2;

    // Atlas: each rail rotated into its own row.
    const rows = RAILS.map((r) => Math.ceil(r.width * ATLAS) + PAD * 2);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(Math.max(...RAILS.map((r) => r.height)) * ATLAS) + PAD * 2;
    canvas.height = rows[0] + rows[1];
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Truth rails: no 2D context");
    // Sprites: every drawn dot's rectangle in the atlas, per rail.
    const pad = PAD / ATLAS;
    const sprites = rails.map((rail, i) => {
      const r = RAILS[i];
      const rowTop = i ? rows[0] : 0;
      // X = y, Y = rowTop + PAD + (width − x): the top of the rail at the left.
      ctx.setTransform(0, -1, 1, 0, PAD, rowTop + PAD + r.width * ATLAS);
      ctx.drawImage(images[i], 0, 0, r.width * ATLAS, r.height * ATLAS);
      return rail.boxes.map((box) => ({
        along: (box.height + pad * 2) * SCALE * DOT_SCALE,
        across: (box.width + pad * 2) * SCALE * DOT_SCALE,
        uv: [
          (box.y * ATLAS) / canvas.width,
          (rowTop + (r.width - box.x - box.width) * ATLAS) / canvas.height,
          ((box.height + pad * 2) * ATLAS) / canvas.width,
          ((box.width + pad * 2) * ATLAS) / canvas.height,
        ],
      }));
    });
    images.forEach((image) => URL.revokeObjectURL(image.src));

    // Each rail's wave, in pair px (along, across), resampled at finer spacing.
    const strands = rails.map((rail, i) => {
      const r = RAILS[i];
      const centres = rail.boxes
        .map((box) => new Vector3(
          r.top + box.y + box.height / 2 - alongStart,
          acrossEnd - (r.left + box.x + box.width / 2), 0))
        .sort((a, b) => a.x - b.x);
      const curve = new CatmullRomCurve3(centres, false, "centripetal");
      const drawnSpacing = curve.getLength() / (centres.length - 1);
      const count = Math.round(curve.getLength() / (drawnSpacing * DOT_SCALE)) + 1;
      return curve.getSpacedPoints(count - 1);
    });

    const count = strands[0].length + strands[1].length;
    const center = new Float32Array(count * 2);
    const size = new Float32Array(count * 2);
    const uv = new Float32Array(count * 4);
    const along = new Float32Array(count);
    const line = new Float32Array(count);
    const index = new Float32Array(count);
    let i = 0;
    strands.forEach((points, rail) => {
      const own = sprites[rail];
      points.forEach((point, n) => {
        // A fixed permutation (37 is coprime with 112): neighbours never
        // repeat the artist's sequence, and every load draws the same line.
        const sprite = own[(n * 37) % own.length];
        center[i * 2] = PATH_LEFT + point.x * SCALE;
        center[i * 2 + 1] = pairTop + point.y * SCALE;
        size[i * 2] = sprite.along;
        size[i * 2 + 1] = sprite.across;
        uv.set(sprite.uv, i * 4);
        along[i] = point.x / pairLength;
        line[i] = rail;
        index[i] = n;
        i++;
      });
    });
    topRail = strands[1].map((point) => ({ x: PATH_LEFT + point.x * SCALE, y: pairTop + point.y * SCALE }));
    lineLength = pairLength * SCALE;
    geometry.setAttribute("aCenter", new InstancedBufferAttribute(center, 2));
    geometry.setAttribute("aSize", new InstancedBufferAttribute(size, 2));
    geometry.setAttribute("aUv", new InstancedBufferAttribute(uv, 4));
    geometry.setAttribute("aAlong", new InstancedBufferAttribute(along, 1));
    geometry.setAttribute("aLine", new InstancedBufferAttribute(line, 1));
    geometry.setAttribute("aIndex", new InstancedBufferAttribute(index, 1));
    geometry.instanceCount = count;

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
    uniforms.atlas.value = texture;
  };

  return {
    mesh,
    load,
    /**
     * The top rail's centre line at frame x (1440-wide frame px), for the year
     * marker to ride. Held flat past either end of the rail.
     */
    topRailY(x: number) {
      if (!topRail.length) return PATH_CENTRE;
      if (x <= topRail[0].x) return topRail[0].y;
      for (let n = 1; n < topRail.length; n++) {
        const b = topRail[n];
        if (b.x < x) continue;
        const a = topRail[n - 1];
        return a.y + (b.y - a.y) * (x - a.x) / (b.x - a.x);
      }
      return topRail[topRail.length - 1].y;
    },
    /**
     * The rails' own end fade at frame x, 0..1 — the same stops the vertex
     * shader applies to every dot — so anything riding the line can take the
     * line's opacity where it stands.
     */
    fadeAt(x: number) {
      const along = (x - PATH_LEFT) / lineLength;
      const step = (a: number, b: number, v: number) => {
        const t = Math.min(Math.max((v - a) / (b - a), 0), 1);
        return t * t * (3 - 2 * t);
      };
      return step(0, FADE_IN, along) * (1 - step(FADE_OUT_START, FADE_OUT_END, along));
    },
    setLayout(width: number, height: number) {
      uniforms.viewport.value.set(Math.max(width, 1), Math.max(height, 1));
      const across = truthAcrossScale(width);
      uniforms.across.value = across;
      // Dots are sized by the across scale but spaced by width. Where it outgrows
      // the width scale (phones, small tablets) keep every Nth dot so the gap
      // between neighbours stays about what the drawing has at desktop.
      const along = width / FRAME_WIDTH;
      uniforms.stride.value = Math.max(1, Math.ceil((across / along) * 0.9 - 1e-6));
    },
    setDraw(draw: number, opacity: number) {
      uniforms.draw.value = draw;
      uniforms.opacity.value = opacity;
      mesh.visible = draw > 0.0001 && opacity > 0.0001;
    },
    dispose() {
      quad.dispose();
      geometry.dispose();
      material.dispose();
      uniforms.atlas.value?.dispose();
    },
  };
}
