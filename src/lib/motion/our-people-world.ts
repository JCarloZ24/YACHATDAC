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
  Texture, Vector2, WebGLRenderer,
} from "three";
import type { PeopleState } from "./effects/people";

export type PeopleSection = { element: HTMLElement; top: number; height: number; color: string };
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
  uniform vec2 crop;
  uniform vec2 offset;
  uniform vec2 size;
  uniform float radius;
  uniform float masked;
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
    if (masked > 0.5) alpha *= texture2D(mask, vUv).a;
    gl_FragColor = vec4(ink.rgb, ink.a * alpha);
    #include <colorspace_fragment>
  }
`;

function material(width: number, height: number, blank: Texture, radius = 0) {
  return new ShaderMaterial({
    uniforms: {
      picture: { value: blank }, mask: { value: blank },
      crop: { value: new Vector2(1, 1) }, offset: { value: new Vector2() },
      size: { value: new Vector2(width, height) },
      radius: { value: radius }, masked: { value: 0 },
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
 * Font families are never named here, and no text is split into characters.
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
  let node: Node | null;
  while ((node = walker.nextNode())) {
    for (const word of (node.textContent ?? "").matchAll(/\S+/g)) {
      const range = document.createRange();
      range.setStart(node, word.index);
      range.setEnd(node, word.index + word[0].length);
      const rect = range.getBoundingClientRect();
      const ink = style.textTransform === "uppercase" ? word[0].toUpperCase() : word[0];
      const metrics = context.measureText(ink);
      const ascent = metrics.fontBoundingBoxAscent;
      const fontHeight = ascent + metrics.fontBoundingBoxDescent;
      context.fillText(ink, rect.left - origin.left,
        rect.top - origin.top + (rect.height - fontHeight) / 2 + ascent);
    }
  }
  const texture = new CanvasTexture(bitmap);
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function createPeopleWorld(
  canvas: HTMLCanvasElement,
  track: HTMLElement,
  sections: PeopleSection[],
  width: number,
  height: number,
  invalidate: () => void,
) {
  const renderer = new WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
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
  let titleTexture: CanvasTexture | null = null;
  let titleMesh: Mesh<PlaneGeometry, ShaderMaterial> | null = null;
  if (title && hero) {
    const box = peopleBox(title, track);
    titleTexture = titleMask(title, box.width, box.height);
    if (titleTexture) {
      const ink = material(box.width, box.height, blank);
      ink.uniforms.mask.value = titleTexture;
      ink.uniforms.masked.value = 1;
      (ink.uniforms.crop.value as Vector2).set(0.92, 0.245);
      titleMesh = new Mesh(geometry, ink);
      titleMesh.position.set(box.left + box.width / 2, -box.top - box.height / 2, 2);
      titleMesh.scale.set(box.width, box.height, 1);
      titleMesh.renderOrder = 2;
      titleMesh.visible = false;
      scene.add(titleMesh);
    }
  }

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
    if (titleMesh && hero?.texture && title) {
      titleMesh.visible = true;
      titleMesh.material.uniforms.picture.value = hero.texture;
      (titleMesh.material.uniforms.offset.value as Vector2).set(0, 0.16 * (1 - state.knockout));
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
    titleTexture?.dispose();
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
  return { render, destroy };
}
