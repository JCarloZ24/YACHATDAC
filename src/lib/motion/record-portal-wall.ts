"use client";

import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LinearFilter,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Vector2,
} from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { createWallCarvings } from "./record-portal-carvings";
import {
  createPigmentField,
  createStencilAtlas,
  createWallStencils,
} from "./record-portal-pigment";

/**
 * F7/F8 / handprintPortal / SCR-11, user correction 2026-09-08.
 * One supplied ink impression: every black area is empty, every white area
 * remains sandstone. A thresholded texture preserves the small creases;
 * marching squares gives the connected entry opening a deep rim and the
 * finger pads and other openings a shallower rim, per the latest correction.
 * Origin of the assets: public/artwork/record-portal-provenance.md.
 */
const HAND_HEIGHT = 4.1;
// User refinement, 2026-09-08: deep stone edges only around the entry opening.
// Shared with the camera so it clears the full wall before the card approach.
export const PORTAL_WALL_DEPTH = 0.65;
// Latest user refinement: secondary openings are 2x the original 0.18 depth.
const DETAIL_WALL_DEPTH = 0.36;
const THRESHOLD = 0.5;
// Weak keys let the bounded image cache evict both image and derived samples.
const impressionCache = new WeakMap<HTMLImageElement, { width: number; height: number; samples: Float32Array }>();

function readImpression(image: HTMLImageElement) {
  const cached = impressionCache.get(image);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  const { naturalWidth: width, naturalHeight: height } = image;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Handprint mask unavailable");
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, width, height);
  const samples = new Float32Array(width * height);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = data[i * 4] / 255;
  }
  canvas.width = canvas.height = 1;
  const result = { width, height, samples };
  impressionCache.set(image, result);
  return result;
}

export function buildPortalWall(
  hand: Texture<HTMLImageElement>,
  stone: Texture<HTMLImageElement>,
  pigmentColour: Color,
  stencilSheet: HTMLImageElement | null,
) {
  const { width, height, samples } = readImpression(hand.image);
  const handWidth = (HAND_HEIGHT * width) / height;
  const toWorld = (x: number, y: number) =>
    new Vector2(
      ((x + 0.5) / width - 0.5) * handWidth,
      (0.5 - (y + 0.5) / height) * HAND_HEIGHT,
    );

  // No mipmaps on the mask: averaging would seal small openings as the
  // camera pulls back. Linear sampling matches the contour interpolation.
  hand.generateMipmaps = false;
  hand.minFilter = hand.magFilter = LinearFilter;
  hand.needsUpdate = true;
  stone.colorSpace = SRGBColorSpace;
  stone.needsUpdate = true;

  // Aim through the widest inked area in the lower palm, never through the
  // white palm centre. A distance field keeps this valid for a replaced mask.
  const distance = Float32Array.from(samples, (value) =>
    value < THRESHOLD ? width + height : 0,
  );
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      distance[i] = Math.min(
        distance[i],
        x ? distance[i - 1] + 1 : 0,
        y ? distance[i - width] + 1 : 0,
      );
    }
  }
  let best = 0;
  let bestDistance = 0;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const i = y * width + x;
      distance[i] = Math.min(
        distance[i],
        x < width - 1 ? distance[i + 1] + 1 : 0,
        y < height - 1 ? distance[i + width] + 1 : 0,
      );
      if (y > height * 0.62 && x < width * 0.65 && distance[i] > bestDistance) {
        best = i;
        bestDistance = distance[i];
      }
    }
  }
  if (bestDistance < 2)
    throw new Error("Handprint has no passable palm opening");
  const openingCenter = toWorld(best % width, Math.floor(best / width));

  // Ink connected to the camera's entry point gets the full depth. The other
  // openings receive a shallow rim so the fingers retain a crisp impression.
  // This also adapts to a replaced impression mask.
  const entryRegion = new Uint8Array(samples.length);
  const pending = [best];
  entryRegion[best] = 1;
  const visit = (index: number) => {
    if (entryRegion[index] || samples[index] >= THRESHOLD) return;
    entryRegion[index] = 1;
    pending.push(index);
  };
  while (pending.length) {
    const index = pending.pop()!;
    const x = index % width;
    if (x > 0) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (index >= width) visit(index - width);
    if (index < samples.length - width) visit(index + width);
  }

  type Crossing = { point: Vector2; entry: boolean };
  const vertices: number[] = [];
  const cutDepths: number[] = [];
  const edge = (start: Crossing, end: Crossing) => {
    const depth =
      start.entry || end.entry ? PORTAL_WALL_DEPTH : DETAIL_WALL_DEPTH;
    const a = start.point,
      b = end.point;
    vertices.push(
      a.x,
      a.y,
      0,
      b.x,
      b.y,
      0,
      b.x,
      b.y,
      -depth,
      a.x,
      a.y,
      0,
      b.x,
      b.y,
      -depth,
      a.x,
      a.y,
      -depth,
    );
    cutDepths.push(depth, depth, depth, depth, depth, depth);
  };
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const corners = [
        { x, y, index: y * width + x },
        { x: x + 1, y, index: y * width + x + 1 },
        { x: x + 1, y: y + 1, index: (y + 1) * width + x + 1 },
        { x, y: y + 1, index: (y + 1) * width + x },
      ];
      const crossings: Crossing[] = [];
      for (let i = 0; i < 4; i++) {
        const a = corners[i],
          b = corners[(i + 1) % 4];
        const av = samples[a.index],
          bv = samples[b.index];
        if (av < THRESHOLD === bv < THRESHOLD) continue;
        const t = (THRESHOLD - av) / (bv - av);
        crossings.push({
          point: toWorld(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t),
          entry: Boolean(entryRegion[av < THRESHOLD ? a.index : b.index]),
        });
      }
      if (crossings.length === 2) edge(crossings[0], crossings[1]);
      if (crossings.length === 4) {
        const centre =
          corners.reduce((sum, corner) => sum + samples[corner.index], 0) / 4;
        const offset =
          centre < THRESHOLD === samples[corners[0].index] < THRESHOLD ? 0 : 1;
        edge(crossings[offset], crossings[(offset + 1) % 4]);
        edge(crossings[(offset + 2) % 4], crossings[(offset + 3) % 4]);
      }
    }
  }
  const sideFaces = new BufferGeometry();
  sideFaces.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  sideFaces.setAttribute("cutDepth", new Float32BufferAttribute(cutDepths, 1));
  // Share contour vertices so each raster segment does not light as a
  // separate vertical strip after the user's increase in wall depth.
  const sides = mergeVertices(sideFaces, 0.000001);
  sideFaces.dispose();
  sides.computeVertexNormals();
  const pigment = createPigmentField(samples, width, height, HAND_HEIGHT);
  const atlas = stencilSheet ? createStencilAtlas(stencilSheet, HAND_HEIGHT) : null;
  const stencils = createWallStencils(HAND_HEIGHT);
  const carvings = createWallCarvings();

  const uniforms = {
    uCarvings: { value: carvings.texture },
    uCarvingSize: { value: carvings.size },
    uCarvingTexel: { value: carvings.texel },
    uHand: { value: hand },
    uStone: { value: stone },
    uPigment: { value: pigment.texture },
    uPigmentSize: { value: pigment.size },
    uPigmentColour: { value: pigmentColour },
    uStencilAtlas: { value: atlas?.texture ?? pigment.texture },
    uStencilSize: { value: atlas?.size ?? pigment.size },
    uStencilGrid: { value: atlas?.grid ?? new Vector2(1, 1) },
    uStencilPlacements: { value: stencils.placements },
    uStencilFinishes: { value: stencils.finishes },
    uHandSize: { value: new Vector2(handWidth, HAND_HEIGHT) },
    uStoneTexel: {
      value: new Vector2(1 / stone.image.width, 1 / stone.image.height),
    },
  };
  const vertexShader = `
    varying vec3 vSurface;
    varying vec3 vNormal;
    #ifdef OPENING_EDGE
      attribute float cutDepth;
      varying float vCutDepth;
    #endif
    void main() {
      vSurface = position;
      vNormal = normal;
      #ifdef OPENING_EDGE
        vCutDepth = cutDepth;
      #endif
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    uniform sampler2D uHand, uStone, uPigment;
    uniform vec2 uHandSize, uStoneTexel, uPigmentSize;
    uniform vec3 uPigmentColour;
    #ifndef OPENING_EDGE
      uniform sampler2D uCarvings;
      uniform vec2 uCarvingSize, uCarvingTexel;
      uniform sampler2D uStencilAtlas;
      uniform vec2 uStencilSize, uStencilGrid;
      uniform vec4 uStencilPlacements[WALL_STENCIL_COUNT];
      uniform vec4 uStencilFinishes[WALL_STENCIL_COUNT];
    #endif
    varying vec3 vSurface;
    varying vec3 vNormal;
    #ifdef OPENING_EDGE
      varying float vCutDepth;
    #endif
    float maskAt(vec2 uv) {
      if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return 1.0;
      return texture2D(uHand, uv).r;
    }
    vec2 stoneUV(vec2 p) {
      // Mirror outside the first tile; the opening viewport sees one full
      // photograph, with continuous material on the larger surrounding wall.
      return 1.0 - abs(mod(p / vec2(17.0, 11.333) + 0.5, 2.0) - 1.0);
    }
    float heightAt(vec2 uv) { return dot(texture2D(uStone, uv).rgb, vec3(0.299, 0.587, 0.114)); }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
                 mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
    }
    float weatheredPigment(vec2 field, vec2 stonePoint) {
      // Broad, uneven deposits resemble pigment spread across the rock.
      // Larger patches vary coverage; fine grain leaves the stone visible.
      float patches = noise(stonePoint * 2.1) * 0.65 + noise(stonePoint * 6.5) * 0.35;
      float weather = noise(stonePoint * 18.0);
      float reach = mix(0.55, 1.0, patches);
      float stain = (1.0 - smoothstep(0.18, reach, field.r)) * field.g;
      float speckle = smoothstep(0.2, 0.7, noise(stonePoint * 145.0));
      return stain * (0.65 + patches * 0.35) * (0.8 + weather * 0.2) * (0.75 + speckle * 0.25);
    }
    float pigmentAt(vec2 localPoint, vec2 stonePoint) {
      vec2 uv = localPoint / uPigmentSize + 0.5;
      if (any(lessThanEqual(uv, vec2(0.0))) || any(greaterThanEqual(uv, vec2(1.0)))) return 0.0;
      return weatheredPigment(texture2D(uPigment, uv).rg, stonePoint);
    }
    #ifndef OPENING_EDGE
      float stencilAt(vec2 localPoint, vec2 stonePoint, float variant) {
        vec2 uv = localPoint / uStencilSize + 0.5;
        if (any(lessThanEqual(uv, vec2(0.0))) || any(greaterThanEqual(uv, vec2(1.0)))) return 0.0;
        float index = mod(variant, uStencilGrid.x * uStencilGrid.y);
        vec2 tile = vec2(mod(index, uStencilGrid.x), floor(index / uStencilGrid.x));
        return weatheredPigment(texture2D(uStencilAtlas, (uv + tile) / uStencilGrid).rg, stonePoint);
      }
    #endif
    void main() {
      vec2 maskUV = vSurface.xy / uHandSize + 0.5;
      #ifndef OPENING_EDGE
        if (maskAt(maskUV) < 0.5) discard;
      #endif
      vec2 uv = stoneUV(vSurface.xy);
      vec3 colour = texture2D(uStone, uv).rgb;
      vec3 n = normalize(vNormal);
      #ifdef OPENING_EDGE
        // User sharpness correction, 2026-09-08: a front projection samples
        // one texel all the way through the thick wall, producing streaks.
        // Project onto both vertical planes so texture varies with depth.
        // The finer scale gives the newly exposed stone its own mineral detail.
        vec2 weights = abs(n.xy);
        weights /= max(weights.x + weights.y, 0.0001);
        vec3 cutStone = texture2D(uStone, stoneUV(vSurface.zy * 3.0)).rgb * weights.x
                      + texture2D(uStone, stoneUV(vSurface.xz * 3.0)).rgb * weights.y;
        colour = mix(colour, cutStone, smoothstep(0.0, 0.035, -vSurface.z));
      #endif
      // A second, fixed material scale retains mineral grain during the
      // approach without increasing the photographic asset's resolution.
      vec2 grainUV = stoneUV(vSurface.xy * 7.0);
      #ifdef OPENING_EDGE
        grainUV = stoneUV(vec2(vSurface.x + vSurface.y, vSurface.z) * 12.0);
      #endif
      float grain = heightAt(grainUV) - (heightAt(grainUV + uStoneTexel * 3.0) + heightAt(grainUV - uStoneTexel * 3.0)) * 0.5;
      colour *= 1.0 + grain * 0.32;
      #ifndef OPENING_EDGE
        // Additional prints only stain solid stone. The sole discard above
        // still samples the central hand, so no surrounding stencil is a hole.
        float stain = pigmentAt(vSurface.xy, vSurface.xy) * 0.85;
        for (int i = 0; i < WALL_STENCIL_COUNT; i++) {
          vec4 placement = uStencilPlacements[i];
          vec4 finish = uStencilFinishes[i];
          vec2 p = vSurface.xy - placement.xy;
          vec2 localPoint = vec2(p.x * finish.x + p.y * finish.y,
                               -p.x * finish.y + p.y * finish.x) * placement.zw;
          stain = max(stain, stencilAt(localPoint, vSurface.xy, finish.w) * finish.z);
        }
        float mineral = dot(colour, vec3(0.299, 0.587, 0.114));
        vec3 ochre = uPigmentColour * (0.7 + mineral * 0.8);
        colour = mix(colour, ochre, min(stain * 1.22, 0.88));
        float dx = heightAt(uv + vec2(uStoneTexel.x, 0.0)) - heightAt(uv - vec2(uStoneTexel.x, 0.0));
        float dy = heightAt(uv + vec2(0.0, uStoneTexel.y)) - heightAt(uv - vec2(0.0, uStoneTexel.y));
        n = normalize(n + vec3(-dx * 0.6, -dy * 0.6, 0.0));
        // User direction 2026-09-09: shallow incisions in the solid face.
        // The negative height makes one lip catch light and the other shade.
        vec2 carveUV = vSurface.xy / uCarvingSize + 0.5;
        float cut = texture2D(uCarvings, carveUV).r;
        float cutX = texture2D(uCarvings, carveUV + vec2(uCarvingTexel.x, 0.0)).r
                   - texture2D(uCarvings, carveUV - vec2(uCarvingTexel.x, 0.0)).r;
        float cutY = texture2D(uCarvings, carveUV + vec2(0.0, uCarvingTexel.y)).r
                   - texture2D(uCarvings, carveUV - vec2(0.0, uCarvingTexel.y)).r;
        float wear = 0.72 + noise(vSurface.xy * 56.0) * 0.28;
        // Broad cuts need stronger relief: their height changes across more
        // texels, so the original narrow-groove lighting all but disappeared.
        n = normalize(n + vec3(cutX, cutY, 0.0) * 8.0 * wear);
        colour *= 1.0 - cut * 0.52 * wear;
        colour *= 1.0 + clamp(-cutX * 0.5 + cutY * 0.8, -0.4, 0.4) * 1.2;
      #endif
      float light = 0.78 + max(dot(n, normalize(vec3(-0.5, 0.8, 1.4))), 0.0) * 0.24;
      #ifdef OPENING_EDGE
        // The cut has a lit front lip and a shaded interior, not a painted
        // outline. The photo texture stays fixed across the front and edges.
        light *= mix(0.28, 0.82, smoothstep(-vCutDepth, 0.0, vSurface.z));
      #else
        float nearHole = 1.0 - maskAt(maskUV + vec2(-0.002, 0.003));
        light *= 1.0 + nearHole * 0.12;
      #endif
      gl_FragColor = vec4(colour * light, 1.0);
      #include <colorspace_fragment>
    }
  `;
  const faceMaterial = new ShaderMaterial({
    defines: { WALL_STENCIL_COUNT: stencils.placements.length },
    uniforms,
    vertexShader,
    fragmentShader,
  });
  const sideMaterial = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    defines: {
      OPENING_EDGE: 1,
      WALL_STENCIL_COUNT: stencils.placements.length,
    },
    side: DoubleSide,
  });
  const face = new PlaneGeometry(40, 24);
  const back = face.clone();
  back.rotateY(Math.PI);
  back.translate(0, 0, -PORTAL_WALL_DEPTH);
  const group = new Group();
  group.add(
    new Mesh(face, faceMaterial),
    new Mesh(back, faceMaterial),
    new Mesh(sides, sideMaterial),
  );

  return {
    group,
    openingCenter,
    dispose: () => {
      face.dispose();
      back.dispose();
      sides.dispose();
      faceMaterial.dispose();
      sideMaterial.dispose();
      pigment.texture.dispose();
      atlas?.texture.dispose();
      carvings.texture.dispose();
    },
  };
}
