"use client";

import {
  DataTexture,
  LinearFilter,
  RGBAFormat,
  Vector2,
  Vector4,
} from "three";

/**
 * F8, user direction 2026-09-08: weathered red ochre around the handprint.
 * This field controls generated interface pigment, not the aperture geometry.
 * Closing tiny ink cracks and filling the palm keeps the pigment outside the
 * whole impression instead of colouring its internal white patches.
 */
function distanceTo(
  mask: Uint8Array,
  width: number,
  height: number,
  value: number,
) {
  const field = Float32Array.from(mask, (pixel) =>
    pixel === value ? 0 : width + height,
  );
  const diagonal = Math.SQRT2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (x) field[i] = Math.min(field[i], field[i - 1] + 1);
      if (y) {
        field[i] = Math.min(field[i], field[i - width] + 1);
        if (x) field[i] = Math.min(field[i], field[i - width - 1] + diagonal);
        if (x < width - 1)
          field[i] = Math.min(field[i], field[i - width + 1] + diagonal);
      }
    }
  }
  for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      const i = y * width + x;
      if (x < width - 1) field[i] = Math.min(field[i], field[i + 1] + 1);
      if (y < height - 1) {
        field[i] = Math.min(field[i], field[i + width] + 1);
        if (x) field[i] = Math.min(field[i], field[i + width - 1] + diagonal);
        if (x < width - 1)
          field[i] = Math.min(field[i], field[i + width + 1] + diagonal);
      }
    }
  }
  return field;
}

function pigmentPixels(
  samples: Float32Array,
  imageWidth: number,
  imageHeight: number,
  handHeight: number,
  fillPalm = true,
) {
  // Latest user refinement, 2026-09-08: broad pigment deposits around every
  // stencil, rather than a narrow outline. Keep enough padding for the wash.
  const spread = imageHeight * 0.26;
  const padding = Math.ceil(spread) + 2;
  const width = imageWidth + padding * 2;
  const height = imageHeight + padding * 2;
  const ink = new Uint8Array(width * height);
  for (let y = 0; y < imageHeight; y++) {
    for (let x = 0; x < imageWidth; x++) {
      ink[(y + padding) * width + x + padding] =
        samples[y * imageWidth + x] < 0.5 ? 1 : 0;
    }
  }
  const closingRadius = imageHeight * 0.014;
  const inkDistance = distanceTo(ink, width, height, 1);
  const expanded = Uint8Array.from(inkDistance, (d) =>
    d <= closingRadius ? 1 : 0,
  );
  const exteriorDistance = distanceTo(expanded, width, height, 0);
  const footprint = Uint8Array.from(exteriorDistance, (d) =>
    d > closingRadius ? 1 : 0,
  );

  // The aperture's enclosed palm stays clean. Decorative impressions retain
  // the reference sheet's larger gaps as pigment, giving each its own wear.
  const outside = new Uint8Array(width * height);
  const pending = [0];
  outside[0] = 1;
  const visit = (index: number) => {
    if (outside[index] || footprint[index]) return;
    outside[index] = 1;
    pending.push(index);
  };
  while (pending.length) {
    const index = pending.pop()!;
    const x = index % width;
    if (x) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (index >= width) visit(index - width);
    if (index < outside.length - width) visit(index + width);
  }
  if (!fillPalm) {
    for (let i = 0; i < outside.length; i++) outside[i] = 1 - footprint[i];
  }
  const filled = Uint8Array.from(outside, (pixel) => (pixel ? 0 : 1));
  const distance = distanceTo(filled, width, height, 1);
  const pixels = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const source = y * width + x;
      // DataTexture rows start at the bottom; the source impression starts at
      // the top. Store the orientation explicitly rather than flipping the mask.
      const target = ((height - 1 - y) * width + x) * 4;
      pixels[target] = Math.min(
        255,
        Math.round((distance[source] / spread) * 255),
      );
      pixels[target + 1] = outside[source] * 255;
      pixels[target + 3] = 255;
    }
  }
  return {
    pixels,
    width,
    height,
    size: new Vector2(
      (width / imageHeight) * handHeight,
      (height / imageHeight) * handHeight,
    ),
  };
}

function fieldTexture(pixels: Uint8Array, width: number, height: number) {
  const texture = new DataTexture(pixels, width, height, RGBAFormat);
  texture.minFilter = texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function createPigmentField(
  samples: Float32Array,
  imageWidth: number,
  imageHeight: number,
  handHeight: number,
) {
  const field = pigmentPixels(samples, imageWidth, imageHeight, handHeight);
  return {
    texture: fieldTexture(field.pixels, field.width, field.height),
    size: field.size,
  };
}

/**
 * F8, user refinement 2026-09-08: eight distinct supplied impressions replace
 * repeated copies of the aperture. Read the unchanged 4-by-2 reference sheet
 * in a canvas and pack padded pigment fields into one GPU texture. Their
 * masks are material-only and never participate in the central hole geometry.
 */
export function createStencilAtlas(image: HTMLImageElement, handHeight: number) {
  const columns = 4;
  const rows = 2;
  const sourceWidth = image.naturalWidth / columns;
  const sourceHeight = image.naturalHeight / rows;
  const width = Math.ceil(sourceWidth);
  const height = Math.ceil(sourceHeight);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Handprint variations unavailable");
  const fields = Array.from({ length: columns * rows }, (_, index) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.drawImage(
      image,
      (index % columns) * sourceWidth,
      Math.floor(index / columns) * sourceHeight,
      sourceWidth,
      sourceHeight,
      0, 0, width, height,
    );
    const { data } = context.getImageData(0, 0, width, height);
    const samples = new Float32Array(width * height);
    for (let i = 0; i < samples.length; i++) samples[i] = data[i * 4] / 255;
    return pigmentPixels(samples, width, height, handHeight, false);
  });
  canvas.width = canvas.height = 1;
  const tile = fields[0];
  const atlasWidth = tile.width * columns;
  const atlasHeight = tile.height * rows;
  const pixels = new Uint8Array(atlasWidth * atlasHeight * 4);
  fields.forEach((field, index) => {
    const x = (index % columns) * tile.width;
    const y = Math.floor(index / columns) * tile.height;
    for (let row = 0; row < tile.height; row++) {
      const start = row * tile.width * 4;
      pixels.set(
        field.pixels.subarray(start, start + tile.width * 4),
        ((y + row) * atlasWidth + x) * 4,
      );
    }
  });
  return {
    texture: fieldTexture(pixels, atlasWidth, atlasHeight),
    size: tile.size,
    grid: new Vector2(columns, rows),
  };
}

/**
 * Latest F8 user direction, 2026-09-08: surrounding handprints are pigment
 * stencils on solid stone. Positions are composed in the wall's local space;
 * they never enter the aperture mask or generate geometry. Latest correction:
 * all hands point upright (90 degrees to the horizon), with almost the same
 * size as the central hand. Shapes, handedness and fading still vary.
 */
export function createWallStencils(handHeight: number) {
  // x, y, height, angle, mirror, opacity, width proportion, reference variant.
  // The supplied sheet already points upward: zero added rotation is upright,
  // not Math.PI / 2, which would put the fingers sideways. Heights stay within
  // roughly 3% of the central 4.1-unit hand, per user direction 2026-09-08.
  // Latest placement correction: leave the lower-left heading area and the
  // middle-right area clear where the user removed two surrounding prints.
  const prints = [
    [-4.3, 1.0, 4.1, 0, 1, 0.72, 0.99, 0],
    [-7.0, -0.4, 4.2, 0, -1, 0.57, 1.02, 4],
    [-6.0, -3.6, 4.1, 0, 1, 0.48, 1.01, 2],
    [-2.7, -5.0, 4.0, 0, 1, 0.4, 0.98, 5],
    [3.85, 1.0, 4.05, 0, -1, 0.78, 1.0, 3],
    [6.5, 2.0, 4.0, 0, 1, 0.54, 1.02, 7],
    [3.35, -4.1, 4.05, 0, -1, 0.51, 1.0, 4],
    [7.35, -4.0, 4.1, 0, -1, 0.59, 0.98, 6],
    [-1.35, 4.1, 4.0, 0, 1, 0.44, 1.02, 2],
    [-9.7, 1.6, 4.1, 0, -1, 0.6, 0.99, 0],
    [9.55, 0.1, 4.15, 0, 1, 0.56, 1.0, 5],
    [0.7, -7.4, 4.0, 0, -1, 0.43, 1.0, 7],
  ];
  return {
    placements: prints.map(
      ([x, y, height, , mirror, , proportion]) =>
        new Vector4(
          x,
          y,
          (mirror * handHeight) / (height * proportion),
          handHeight / height,
        ),
    ),
    finishes: prints.map(
      ([, , , angle, , opacity, , variant]) =>
        new Vector4(Math.cos(angle), Math.sin(angle), opacity, variant),
    ),
  };
}
