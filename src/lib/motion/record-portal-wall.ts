"use client";

import {
  BufferGeometry,
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

/**
 * F7/F8 / handprintPortal / SCR-11, user correction 2026-09-08.
 * One supplied ink impression: every black area is empty, every white area
 * remains sandstone. A thresholded texture preserves the small creases;
 * marching squares extrudes the same contour into physical opening edges.
 * Origin of both assets: public/artwork/record-portal-provenance.md.
 */
const HAND_HEIGHT = 4.1;
const THICKNESS = 0.18;
const THRESHOLD = 0.5;

function readImpression(image: HTMLImageElement) {
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
  return { width, height, samples };
}

export function buildPortalWall(
  hand: Texture<HTMLImageElement>,
  stone: Texture<HTMLImageElement>,
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

  const vertices: number[] = [];
  const edge = (a: Vector2, b: Vector2) => {
    vertices.push(
      a.x,
      a.y,
      0,
      b.x,
      b.y,
      0,
      b.x,
      b.y,
      -THICKNESS,
      a.x,
      a.y,
      0,
      b.x,
      b.y,
      -THICKNESS,
      a.x,
      a.y,
      -THICKNESS,
    );
  };
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const corners = [
        { x, y, value: samples[y * width + x] },
        { x: x + 1, y, value: samples[y * width + x + 1] },
        { x: x + 1, y: y + 1, value: samples[(y + 1) * width + x + 1] },
        { x, y: y + 1, value: samples[(y + 1) * width + x] },
      ];
      const crossings: Vector2[] = [];
      for (let i = 0; i < 4; i++) {
        const a = corners[i],
          b = corners[(i + 1) % 4];
        if (a.value < THRESHOLD === b.value < THRESHOLD) continue;
        const t = (THRESHOLD - a.value) / (b.value - a.value);
        crossings.push(toWorld(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
      }
      if (crossings.length === 2) edge(crossings[0], crossings[1]);
      if (crossings.length === 4) {
        // Resolve a diagonal pair around the same side as the cell centre.
        const centre = corners.reduce((sum, point) => sum + point.value, 0) / 4;
        const offset =
          centre < THRESHOLD === corners[0].value < THRESHOLD ? 0 : 1;
        edge(crossings[offset], crossings[(offset + 1) % 4]);
        edge(crossings[(offset + 2) % 4], crossings[(offset + 3) % 4]);
      }
    }
  }
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
  const sides = new BufferGeometry();
  sides.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  sides.computeVertexNormals();

  const uniforms = {
    uHand: { value: hand },
    uStone: { value: stone },
    uHandSize: { value: new Vector2(handWidth, HAND_HEIGHT) },
    uStoneTexel: {
      value: new Vector2(1 / stone.image.width, 1 / stone.image.height),
    },
  };
  const vertexShader = `
    varying vec3 vSurface;
    varying vec3 vNormal;
    void main() {
      vSurface = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    uniform sampler2D uHand, uStone;
    uniform vec2 uHandSize, uStoneTexel;
    varying vec3 vSurface;
    varying vec3 vNormal;
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
    void main() {
      vec2 maskUV = vSurface.xy / uHandSize + 0.5;
      #ifndef OPENING_EDGE
        if (maskAt(maskUV) < 0.5) discard;
      #endif
      vec2 uv = stoneUV(vSurface.xy);
      vec3 colour = texture2D(uStone, uv).rgb;
      // A second, fixed material scale retains mineral grain during the
      // approach without increasing the photographic asset's resolution.
      vec2 grainUV = stoneUV(vSurface.xy * 7.0);
      float grain = heightAt(grainUV) - (heightAt(grainUV + uStoneTexel * 3.0) + heightAt(grainUV - uStoneTexel * 3.0)) * 0.5;
      colour *= 1.0 + grain * 0.32;
      float dx = heightAt(uv + vec2(uStoneTexel.x, 0.0)) - heightAt(uv - vec2(uStoneTexel.x, 0.0));
      float dy = heightAt(uv + vec2(0.0, uStoneTexel.y)) - heightAt(uv - vec2(0.0, uStoneTexel.y));
      vec3 n = normalize(vNormal + vec3(-dx * 0.6, -dy * 0.6, 0.0));
      float light = 0.78 + max(dot(n, normalize(vec3(-0.5, 0.8, 1.4))), 0.0) * 0.24;
      #ifdef OPENING_EDGE
        // The cut has a lit front lip and a shaded interior, not a painted
        // outline. The photo texture stays fixed across the front and edges.
        light *= mix(0.28, 0.82, smoothstep(-0.18, 0.0, vSurface.z));
      #else
        float nearHole = 1.0 - maskAt(maskUV + vec2(-0.002, 0.003));
        light *= 1.0 + nearHole * 0.12;
      #endif
      gl_FragColor = vec4(colour * light, 1.0);
      #include <colorspace_fragment>
    }
  `;
  const faceMaterial = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });
  const sideMaterial = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    defines: { OPENING_EDGE: 1 },
    side: DoubleSide,
  });
  const face = new PlaneGeometry(40, 24);
  const back = face.clone();
  back.rotateY(Math.PI);
  back.translate(0, 0, -THICKNESS);
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
    },
  };
}
