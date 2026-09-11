"use client";

/** F7 / Y1 / P4, 11 September 2026. The photographic world for Our People.
 * A single orthographic scene shares CSS pixels with the accessible HTML
 * track. Fonts and geometry are measured at build/resize, never every frame.
 * The original next/image elements supply decoded, optimised WebP textures;
 * there is no second photo request and no screenshot of the written content.
 */
import gsap from "gsap";
import {
  CanvasTexture, Color, DataTexture, LinearFilter, Mesh, MeshBasicMaterial,
  OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, SRGBColorSpace,
  Texture, Vector2, Vector4, WebGLRenderer,
} from "three";
import type { PeopleState } from "./effects/people";

export type PeopleSection = { element: HTMLElement; top: number; height: number; color: string };
export type PeopleHeroFlight = { frameTravel: number; titleTravel: number };
type Box = { left: number; top: number; width: number; height: number };
type Photo = {
  element: HTMLImageElement;
  box: Box;
  frame: HTMLElement | null;
  mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  texture?: Texture;
  bitmap?: ImageBitmap;
  version: number;
  originalLoading: string;
  load: () => void;
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  uniform sampler2D picture;
  uniform sampler2D mask;
  uniform sampler2D aperture;
  uniform vec2 crop;
  uniform vec2 offset;
  uniform vec2 size;
  uniform float radius;
  uniform float masked;
  uniform vec4 apertureBox;
  uniform float closing;
  uniform vec4 prefixBox;
  uniform float prefixHidden;
  uniform float letterReveal;
  varying vec2 vUv;
  void main() {
    vec2 sampleUv = (vUv - 0.5) * crop + 0.5 + offset;
    // An aperture may cross the edge of the held photograph while gathering.
    // Reveal the ground there instead of stretching the edge pixels.
    if (any(lessThan(sampleUv, vec2(0.0))) || any(greaterThan(sampleUv, vec2(1.0)))) discard;
    vec4 ink = texture2D(picture, sampleUv);
    float alpha = 1.0;
    // Top corners of the existing portrait card. Its body supplies the
    // bottom corners in HTML; the photo must not acquire four round corners.
    vec2 p = vec2(vUv.x, 1.0 - vUv.y) * size;
    if (p.y < radius && (p.x < radius || p.x > size.x - radius)) {
      vec2 centre = vec2(p.x < radius ? radius : size.x - radius, radius);
      alpha *= 1.0 - smoothstep(radius - 1.0, radius, length(p - centre));
    }
    if (closing > 0.0) {
      vec2 apertureUv = (p - apertureBox.xy) / apertureBox.zw;
      float inside = step(0.0, apertureUv.x) * step(apertureUv.x, 1.0)
        * step(0.0, apertureUv.y) * step(apertureUv.y, 1.0);
      float silhouette = texture2D(aperture, vec2(apertureUv.x, 1.0 - apertureUv.y)).a * inside;
      alpha *= mix(1.0, silhouette, closing);
    }
    if (masked > 0.5) {
      alpha *= texture2D(mask, vUv).a;
      vec2 prefixUv = (p - prefixBox.xy) / prefixBox.zw;
      float initial = step(0.0, prefixUv.x) * step(prefixUv.x, 1.0)
        * step(0.0, prefixUv.y) * step(prefixUv.y, 1.0);
      alpha *= mix(letterReveal, 1.0 - prefixHidden, initial);
    }
    gl_FragColor = vec4(ink.rgb, ink.a * alpha);
    #include <colorspace_fragment>
  }
`;

function material(width: number, height: number, blank: Texture, radius = 0) {
  return new ShaderMaterial({
    uniforms: {
      picture: { value: blank }, mask: { value: blank }, aperture: { value: blank },
      crop: { value: new Vector2(1, 1) }, offset: { value: new Vector2() },
      size: { value: new Vector2(width, height) },
      radius: { value: radius }, masked: { value: 0 },
      apertureBox: { value: new Vector4(0, 0, 1, 1) }, closing: { value: 0 },
      prefixBox: { value: new Vector4(0, 0, 1, 1) }, prefixHidden: { value: 0 },
      letterReveal: { value: 1 },
    },
    vertexShader, fragmentShader, transparent: true,
    depthTest: false, depthWrite: false,
  });
}

export function peopleBox(element: Element, track: HTMLElement): Box {
  const rect = element.getBoundingClientRect();
  const origin = track.getBoundingClientRect();
  return { left: rect.left - origin.left, top: rect.top - origin.top, width: rect.width, height: rect.height };
}

/** Y1: rasterise only the headline silhouette, from the utility's actual
 * loaded font. Word ranges preserve browser wrapping and CMS-edited titles.
 * Font families are never named here, and the HTML is never split. The user-
 * requested Living Work handoff also measures the first glyph as an aperture;
 * this is one continuous silhouette, not a character-staggered text effect.
 */
function titleMask(element: HTMLElement, width: number, height: number) {
  const bitmap = document.createElement("canvas");
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  bitmap.width = Math.ceil(width * scale);
  bitmap.height = Math.ceil(height * scale);
  const context = bitmap.getContext("2d");
  if (!context) return null;
  context.scale(scale, scale);
  const style = getComputedStyle(element);
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  context.letterSpacing = style.letterSpacing;
  context.fillStyle = "white";
  context.textBaseline = "alphabetic";
  const origin = element.getBoundingClientRect();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let initial: { ink: string; box: Box; x: number; baseline: number } | undefined;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    for (const word of (node.textContent ?? "").matchAll(/\S+/g)) {
      const range = document.createRange();
      range.setStart(node, word.index);
      range.setEnd(node, word.index + word[0].length);
      const rect = range.getBoundingClientRect();
      const ink = style.textTransform === "uppercase" ? word[0].toUpperCase() : word[0];
      const metrics = context.measureText(ink);
      const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
      const fontHeight = ascent + (metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent);
      const x = rect.left - origin.left;
      const baseline = rect.top - origin.top + (rect.height - fontHeight) / 2 + ascent;
      context.fillText(ink, x, baseline);
      if (!initial) {
        const glyph = new Intl.Segmenter(undefined, { granularity: "grapheme" })
          .segment(ink)[Symbol.iterator]().next().value?.segment;
        if (glyph) {
          const bounds = context.measureText(glyph);
          initial = { ink: glyph, x, baseline, box: {
            left: x - bounds.actualBoundingBoxLeft - 1,
            top: baseline - bounds.actualBoundingBoxAscent - 1,
            width: bounds.actualBoundingBoxLeft + bounds.actualBoundingBoxRight + 2,
            height: bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent + 2,
          } };
        }
      }
    }
  }
  const texture = new CanvasTexture(bitmap);
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  let aperture: CanvasTexture | null = null;
  if (initial) {
    const glyphBitmap = document.createElement("canvas");
    // The initial starts almost a viewport tall. Give that silhouette its own
    // resolution budget instead of magnifying the small final-heading mask.
    const glyphScale = Math.min(16, Math.max(2,
      Math.min(window.innerHeight * 2, 2048) / initial.box.height));
    glyphBitmap.width = Math.ceil(initial.box.width * glyphScale);
    glyphBitmap.height = Math.ceil(initial.box.height * glyphScale);
    const glyphContext = glyphBitmap.getContext("2d");
    if (glyphContext) {
      glyphContext.scale(glyphBitmap.width / initial.box.width, glyphBitmap.height / initial.box.height);
      glyphContext.font = context.font;
      glyphContext.letterSpacing = context.letterSpacing;
      glyphContext.fillStyle = "white";
      glyphContext.fillText(initial.ink, initial.x - initial.box.left, initial.baseline - initial.box.top);
      aperture = new CanvasTexture(glyphBitmap);
      aperture.minFilter = LinearFilter;
      aperture.generateMipmaps = false;
    }
  }
  return { texture, aperture, initial: initial?.box };
}

function phase(start: number, end: number, value: number) {
  const progress = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

export function createPeopleWorld(
  canvas: HTMLCanvasElement,
  track: HTMLElement,
  sections: PeopleSection[],
  width: number,
  height: number,
  invalidate: () => void,
  flight?: PeopleHeroFlight,
) {
  const renderer = new WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: "low-power" });
  // User sharpness refinement, 11 September 2026: retain native retina detail
  // up to 2×, with a cap so large/high-density screens keep a bounded buffer.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color(sections[0].color), 1);
  const scene = new Scene();
  const camera = new OrthographicCamera(0, width, 0, -height, 0.1, 100);
  camera.position.z = 10;
  const geometry = new PlaneGeometry(1, 1);
  const blank = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  blank.needsUpdate = true;
  const grounds: MeshBasicMaterial[] = [];
  const photos: Photo[] = [];
  let disposed = false;

  for (const section of sections) {
    const ground = new MeshBasicMaterial({ color: new Color(section.color), depthTest: false, depthWrite: false });
    grounds.push(ground);
    const plane = new Mesh(geometry, ground);
    plane.position.set(width / 2, -section.top - section.height / 2, 0);
    // One extra CSS pixel closes fractional layout seams without a colour wash.
    plane.scale.set(width, section.height + 1, 1);
    plane.renderOrder = 0;
    scene.add(plane);
  }

  for (const element of track.querySelectorAll<HTMLImageElement>("[data-media] img")) {
    const box = peopleBox(element, track);
    if (!box.width || !box.height) continue;
    const frame = element.closest<HTMLElement>("[data-people-card]");
    const surface = material(box.width, box.height, blank, frame ? 24 : 0);
    const mesh = new Mesh(geometry, surface);
    mesh.scale.set(box.width, box.height, 1);
    mesh.position.set(box.left + box.width / 2, -box.top - box.height / 2, 1);
    mesh.renderOrder = 1;
    mesh.visible = false;
    scene.add(mesh);
    const photo: Photo = { element, box, frame, mesh, version: 0, originalLoading: element.loading, load: () => {} };
    photo.load = async () => {
      if (disposed || !element.complete || !element.naturalWidth) return;
      const version = ++photo.version;
      // A fill-positioned HTMLImageElement reports its CSS width to Three's
      // allocator, but texSubImage uploads its intrinsic width. ImageBitmap
      // carries the decoded dimensions, and shares the existing image request.
      let bitmap: ImageBitmap;
      try { bitmap = await createImageBitmap(element, { imageOrientation: "flipY", premultiplyAlpha: "none" }); }
      catch { return; }
      if (disposed || version !== photo.version) { bitmap.close(); return; }
      photo.texture?.dispose();
      photo.bitmap?.close();
      photo.bitmap = bitmap;
      const texture = new Texture(bitmap);
      texture.flipY = false;
      texture.colorSpace = SRGBColorSpace;
      texture.minFilter = LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      photo.texture = texture;
      surface.uniforms.picture.value = texture;
      const aspect = element.naturalWidth / element.naturalHeight;
      const boxAspect = box.width / box.height;
      (surface.uniforms.crop.value as Vector2).set(Math.min(1, boxAspect / aspect), Math.min(1, aspect / boxAspect));
      mesh.visible = true;
      element.dataset.peopleTexture = "true";
      invalidate();
    };
    element.addEventListener("load", photo.load);
    photos.push(photo);
    photo.load();
  }

  const title = track.querySelector<HTMLElement>("[data-people-title]");
  const hero = photos.find(photo => photo.element.closest('[data-people-scene="hero"]'));
  const titleBox = title ? peopleBox(title, track) : null;
  let masks: ReturnType<typeof titleMask> = null;
  let titleMesh: Mesh<PlaneGeometry, ShaderMaterial> | null = null;
  if (title && hero && titleBox) {
    const box = titleBox;
    masks = titleMask(title, box.width, box.height);
    if (masks) {
      const ink = material(box.width, box.height, blank);
      ink.uniforms.mask.value = masks.texture;
      ink.uniforms.masked.value = 1;
      (ink.uniforms.crop.value as Vector2).set(0.92, 0.245);
      titleMesh = new Mesh(geometry, ink);
      titleMesh.position.set(box.left + box.width / 2, -box.top - box.height / 2, 2);
      titleMesh.scale.set(box.width, box.height, 1);
      titleMesh.renderOrder = 2;
      titleMesh.visible = false;
      scene.add(titleMesh);
      if (masks.aperture && masks.initial && flight) {
        hero.mesh.material.uniforms.aperture.value = masks.aperture;
        const initial = masks.initial;
        (ink.uniforms.prefixBox.value as Vector4).set(initial.left, initial.top, initial.width, initial.height);
      }
    }
  }
  const hasPortal = Boolean(flight && masks?.aperture && masks.initial);

  function render(state: PeopleState) {
    if (disposed || document.hidden) return;
    camera.position.y = -state.travel;
    for (const photo of photos) {
      const nearby = photo.box.top < state.travel + height * 3 && photo.box.top + photo.box.height > state.travel - height;
      // Loading stays incremental even though the text track is pinned.
      if (nearby && !photo.texture && photo.element.loading !== "eager") photo.element.loading = "eager";
      photo.mesh.visible = Boolean(photo.texture) && nearby;
      if (!photo.mesh.visible) continue;
      const x = photo.frame ? Number(gsap.getProperty(photo.frame, "x")) || 0 : 0;
      photo.mesh.position.x = photo.box.left + photo.box.width / 2 + x;
      const crop = photo.mesh.material.uniforms.crop.value as Vector2;
      // P4 frame grade: the aperture moves, the pixels inside it stay held.
      (photo.mesh.material.uniforms.offset.value as Vector2).set(x / photo.box.width * crop.x, 0);
    }
    if (titleMesh && hero?.texture && title && titleBox) {
      titleMesh.visible = true;
      titleMesh.material.uniforms.picture.value = hero.texture;
      const ink = titleMesh.material.uniforms;
      if (hasPortal && flight && masks?.initial) {
        const k = state.knockout;
        const photo = hero.box;
        const initial = masks.initial;
        const heldTop = photo.top - flight.frameTravel;
        const moving = k > 0 && k < 1;
        titleMesh.position.y = -titleBox.top - titleBox.height / 2
          - (moving ? state.travel - flight.titleTravel : 0);
        hero.mesh.visible = Boolean(hero.texture) && (k < 1);
        hero.mesh.position.y = -photo.top - photo.height / 2
          - (k > 0 ? Math.min(state.travel, flight.titleTravel) - flight.frameTravel : 0);
        const aperture = hero.mesh.material.uniforms;
        aperture.closing.value = phase(0, 0.22, k);
        const gather = phase(0.22, 0.78, k);
        const initialHeight = Math.min(Math.min(height, photo.height) * 0.82,
          photo.width * 0.9 * initial.height / initial.width);
        const apertureHeight = initialHeight + (initial.height - initialHeight) * gather;
        const apertureWidth = apertureHeight * initial.width / initial.height;
        const fromX = photo.left + photo.width / 2;
        const fromY = Math.max(0, heldTop) + Math.min(height, photo.height) / 2;
        const toX = titleBox.left + initial.left + initial.width / 2;
        const toY = titleBox.top + initial.top + initial.height / 2 - flight.titleTravel;
        (aperture.apertureBox.value as Vector4).set(
          fromX + (toX - fromX) * gather - apertureWidth / 2 - photo.left,
          fromY + (toY - fromY) * gather - apertureHeight / 2 - heldTop,
          apertureWidth, apertureHeight,
        );
        // P4: both windows sample the same held photograph in screen space.
        // The glyph shrinks, but the people inside it never change scale.
        const crop = aperture.crop.value as Vector2;
        const titleScreenTop = titleBox.top - flight.titleTravel;
        (ink.crop.value as Vector2).set(titleBox.width / photo.width * crop.x, titleBox.height / photo.height * crop.y);
        (ink.offset.value as Vector2).set(
          (titleBox.left + titleBox.width / 2 - photo.left - photo.width / 2) / photo.width * crop.x,
          (heldTop + photo.height / 2 - titleScreenTop - titleBox.height / 2) / photo.height * crop.y,
        );
        ink.prefixHidden.value = k < 1 ? 1 : 0;
        ink.letterReveal.value = phase(0.76, 0.96, k);
      } else {
        (ink.offset.value as Vector2).set(0, 0.16 * (1 - state.knockout));
      }
      if (!title.hasAttribute("data-people-knockout")) title.dataset.peopleKnockout = "true";
    }
    renderer.render(scene, camera);
  }

  function destroy() {
    disposed = true;
    for (const photo of photos) {
      photo.element.removeEventListener("load", photo.load);
      photo.element.removeAttribute("data-people-texture");
      photo.element.loading = photo.originalLoading as "eager" | "lazy";
      photo.texture?.dispose();
      photo.bitmap?.close();
      photo.mesh.material.dispose();
    }
    title?.removeAttribute("data-people-knockout");
    masks?.texture.dispose();
    masks?.aperture?.dispose();
    titleMesh?.material.dispose();
    grounds.forEach(ground => ground.dispose());
    geometry.dispose();
    blank.dispose();
    // The next renderer reuses this canvas's context after a resize. Three's
    // empty 3D texture allocation expects default unpack flags; CanvasTexture
    // can leave flipY enabled from the title mask on the previous renderer.
    const gl = renderer.getContext();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    renderer.dispose();
    scene.clear();
  }
  return { render, destroy, hasPortal };
}
