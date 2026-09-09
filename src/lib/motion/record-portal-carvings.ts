"use client";

import { CanvasTexture, Vector2 } from "three";

/**
 * F8, user direction 2026-09-09: shallow arrow-like cuts and worn scratches.
 * Generated interface decoration, not traced rock art or a cultural record.
 * A fixed height field keeps the cuts attached to the stone during the journey.
 */
let carvingCanvas: HTMLCanvasElement | undefined;
export function createWallCarvings() {
  if (carvingCanvas) return {
    texture: new CanvasTexture(carvingCanvas), size: new Vector2(20, 15),
    texel: new Vector2(1 / carvingCanvas.width, 1 / carvingCanvas.height),
  };
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1536;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Stone carving surface unavailable");
  const size = new Vector2(20, 15);
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.translate(canvas.width / 2, canvas.height / 2);
  context.scale(canvas.width / size.x, -canvas.height / size.y);
  context.lineCap = "round";
  context.lineJoin = "round";

  type Point = [number, number];
  const cut = (points: Point[], width = 0.055, strength = 1) => {
    // Nested strokes form a rounded trough, not a hard painted line.
    for (let layer = 0; layer < 48; layer++) {
      const t = layer / 47;
      const shade = Math.round((0.08 + Math.sin(t * Math.PI / 2) * 0.82) * 255 * strength);
      context.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;
      context.lineWidth = width * (1 - t * 0.88);
      context.beginPath();
      points.forEach(([x, y], i) => {
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.stroke();
    }
  };
  const arrow = (x: number, y: number, scale: number, angle: number, broad = false) => {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.scale(scale, scale);
    // User refinement: twice-wide grooves with a visible stone gap between
    // the straight stem and chevron, including their rounded stroke ends.
    cut([[-0.03, 0.64], [0.015, 0.24], [0, broad ? 0.04 : -0.08]], broad ? 0.18 : 0.13);
    cut([[-0.42, 0.03], [-0.23, -0.19], [0, -0.42], [0.22, -0.17], [0.39, 0.08]], broad ? 0.20 : 0.144);
    context.restore();
  };

  // Uneven spacing and different cuts leave the central aperture unobstructed.
  // Selected cuts are approximately 4 units tall, matching the 4.1-unit hands.
  // Their broader troughs keep the stem separated from the arrowhead.
  arrow(-3.6, 0.85, 3.25, -0.18, true);
  arrow(5.55, 2.0, 0.85, -0.33);
  arrow(-5.5, 2.65, 1.05, 0.28);
  arrow(3.9, -0.7, 3.25, -0.14, true);
  arrow(-1.0, 3.25, 0.72, 0.14);
  cut([[-4.5, 0.8], [-4.32, 0.42], [-4.15, 0.05], [-3.91, -0.18]], 0.05, 0.72);
  cut([[-4.18, 0.85], [-4.01, 0.46], [-3.78, 0.09]], 0.065, 0.85);
  cut([[2.4, 2.9], [2.65, 2.72], [2.93, 2.8], [3.27, 3.1]], 0.065);
  cut([[4.04, 0.8], [4.36, 0.53], [4.65, 0.43], [5.12, 0.57]], 0.045, 0.8);
  cut([[4.22, 0.24], [4.65, 0.03], [5.09, 0.15]], 0.055, 0.75);
  cut([[-6.8, -0.55], [-6.44, -0.32], [-6.21, 0.08]], 0.075, 0.8);
  cut([[2.62, -2.25], [2.81, -2.04], [3.2, -1.92]], 0.05, 0.75);
  cut([[2.95, -2.5], [3.14, -2.23], [3.5, -2.11]], 0.055, 0.85);

  carvingCanvas = canvas;
  const texture = new CanvasTexture(canvas);
  // Height data stays linear; the existing wall material supplies the colour.
  return { texture, size, texel: new Vector2(1 / canvas.width, 1 / canvas.height) };
}
