import { ShaderMaterial, Texture, Vector2 } from "three";

/** Home hero dissolve / 9 September 2026, F8.
 * Reveals original pixels from the supplied painting. The mask travels outward
 * from its central rosette; no line geometry or replacement motifs are authored.
 * A clip-space plate uses the existing renderer and canvas, independent of gaze.
 */
export function createPaintingMaterial(texture: Texture, width: number, height: number): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: {
      painting: { value: texture },
      progress: { value: 0 },
      portal: { value: 0 },
      wonder: { value: 0 },
      landscapeReady: { value: 0 },
      landscape: { value: texture },
      sky: { value: texture },
      landscapeCrop: { value: new Vector2(1, 1) },
      cropScale: { value: new Vector2(1, 1) },
      imageAspect: { value: width / height },
    },
    vertexShader: `
      varying vec2 imageUv;
      varying vec2 screenUv;
      uniform vec2 cropScale;
      void main() {
        imageUv = (uv - 0.5) * cropScale + 0.5;
        screenUv = uv;
        gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D painting;
      uniform float progress;
      uniform float portal;
      uniform float wonder;
      uniform float landscapeReady;
      uniform sampler2D landscape;
      uniform sampler2D sky;
      uniform vec2 landscapeCrop;
      uniform float imageAspect;
      varying vec2 imageUv;
      varying vec2 screenUv;
      void main() {
        // Approach the original rosette, preserving its actual painted border.
        vec2 centre = vec2(0.483, 0.546);
        float zoom = exp(portal * log(40.0));
        // SCR-09, 9 September: bow the painting around the viewer during the
        // approach. A radial lens stretches peripheral marks without moving
        // the landscape UVs. The envelope is exactly zero at either endpoint.
        float bend = pow(sin(clamp(portal, 0.0, 1.0) * 3.14159265), 2.0);
        vec2 offset = imageUv - centre;
        vec2 lensPosition = offset * vec2(imageAspect, 1.0);
        float lensRadiusSquared = dot(lensPosition, lensPosition);
        float lensScale = mix(1.0, 1.0 / (1.0 + 1.2 * lensRadiusSquared), bend);
        vec2 paintingUv = centre + offset * lensScale / zoom;
        vec4 source = texture2D(painting, paintingUv);
        vec2 delta = (paintingUv - centre) * vec2(imageAspect, 1.0);
        float radius = length(delta);
        float reveal = 1.0 - smoothstep(progress * 1.1 - 0.035, progress * 1.1, radius);
        // White/gold original marks emerge first; the photographed ground follows.
        float marks = smoothstep(0.30, 0.55, source.g / max(source.r, 0.001));
        float ground = smoothstep(0.12, 1.0, progress);
        // Keep unrevealed marks out of the ground pass: no ghost of the whole
        // painting underneath the drawing. At completion every source pixel is shown.
        float alpha = mix(ground, reveal, marks) * smoothstep(0.0, 0.035, progress);
        // 9 September: the centre is already open while the first rings draw.
        float hole = (1.0 - smoothstep(0.035, 0.038, radius)) * smoothstep(0.0, 0.035, progress) * landscapeReady;
        vec2 landscapeUv = (screenUv - 0.5) * landscapeCrop + 0.5;
        vec4 terrain = texture2D(landscape, landscapeUv);
        // User reference, 9 September: sample the supplied sky's pale daylight
        // band behind the original transparent treeline, rather than deep blue.
        float skyY = mix(0.855, 0.94, clamp((landscapeUv.y - 0.52) / 0.48, 0.0, 1.0));
        vec3 daylight = texture2D(sky, vec2(landscapeUv.x, skyY)).rgb;
        float luminance = dot(daylight, vec3(0.2126, 0.7152, 0.0722));
        daylight = mix(vec3(luminance), daylight, 0.65) * 0.8;
        vec3 blueSky = texture2D(sky, vec2(landscapeUv.x, mix(0.94, 0.99, landscapeUv.y))).rgb * 0.8;
        // 9 September: one daylight value drives sky and land together. Grade
        // in linear colour so night dims light rather than painting a flat veil.
        float daylightAmount = clamp(wonder, 0.0, 1.0);
        float terrainLuma = dot(terrain.rgb, vec3(0.2126, 0.7152, 0.0722));
        vec3 nightTerrain = mix(vec3(terrainLuma), terrain.rgb, 0.72)
          * vec3(0.75, 0.86, 1.0) * 0.22;
        vec3 litTerrain = mix(nightTerrain, terrain.rgb, daylightAmount);
        vec3 view = mix(mix(blueSky, daylight, daylightAmount), litTerrain, terrain.a);
        gl_FragColor = vec4(mix(source.rgb, view, hole), max(alpha, hole));
        #include <colorspace_fragment>
      }
    `,
  });
}
