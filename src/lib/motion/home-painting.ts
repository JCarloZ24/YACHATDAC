import { Color, ShaderMaterial, Texture, Vector2 } from "three";

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
      truth: { value: 0 },
      belonging: { value: 0 },
      truthSkyOffset: { value: 1422 },
      truthLightOffset: { value: 464 },
      breezePhase: { value: 0 },
      landscapeReady: { value: 0 },
      landscape: { value: texture },
      sky: { value: texture },
      truthSkyMap: { value: texture },
      truthLightMap: { value: texture },
      landscapeCrop: { value: new Vector2(1, 1) },
      landscapeAnchor: { value: 0.5 },
      legacyScale: { value: 1 },
      landscapeZoom: { value: 1 },
      // How far up the screen the whole land scene has travelled, in screen
      // heights, and what is behind it when it goes. See the lift note in the
      // fragment shader. `beyond` is charcoal, handed in from the token.
      lift: { value: 0 },
      beyond: { value: new Color(0, 0, 0) },
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
      uniform float truth;
      uniform float belonging;
      uniform float truthSkyOffset;
      uniform float truthLightOffset;
      uniform float breezePhase;
      uniform float landscapeReady;
      uniform sampler2D landscape;
      uniform sampler2D sky;
      uniform sampler2D truthSkyMap;
      uniform sampler2D truthLightMap;
      uniform vec2 landscapeCrop;
      uniform float landscapeAnchor;
      uniform float legacyScale;
      uniform float landscapeZoom;
      uniform float lift;
      // How much of the canvas height the land takes to go out of focus and
      // into charcoal at the lift's trailing edge. Turn this, not the fade
      // inside main -- the blur width and the fade span are both read off it.
      const float liftEdge = 0.11;
      uniform vec3 beyond;
      uniform float imageAspect;
      varying vec2 imageUv;
      varying vec2 screenUv;
      // Figma's soft-light blend operates on display RGB, not linear light.
      vec3 softLight(vec3 base, vec3 blend) {
        vec3 d = mix(sqrt(base), ((16.0 * base - 12.0) * base + 4.0) * base,
          step(base, vec3(0.25)));
        return mix(base - (1.0 - 2.0 * blend) * base * (1.0 - base),
          base + (2.0 * blend - 1.0) * (d - base), step(vec3(0.5), blend));
      }
      // User-requested procedural decorative sky, 9 September 2026.
      // Deterministic cells keep stars fixed while brightness changes gently.
      vec2 starHash(vec2 p) {
        vec3 h = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
        h += dot(h, h.yzx + 33.33);
        return fract((h.xx + h.yz) * h.zy);
      }
      // AMB-05: three quiet meteor passes per 24-second ambient cycle.
      float shootingStar(vec2 uv) {
        float seconds = breezePhase * (24.0 / 6.28318530718);
        float pass = floor(seconds / 8.0);
        float flight = (mod(seconds, 8.0) - 1.0) / 1.4;
        float visible = smoothstep(0.0, 0.12, flight)
          * (1.0 - smoothstep(0.7, 1.0, flight));
        vec2 seed = starHash(vec2(pass + 41.0, 7.0));
        // Correct aspect ratio keeps the head round at every viewport size.
        float aspect = fwidth(uv.y) / max(fwidth(uv.x), 0.00001);
        vec2 start = vec2(mix(0.24, 0.58, seed.x) * aspect, mix(0.84, 0.96, seed.y));
        vec2 direction = normalize(vec2(0.85, -0.53));
        vec2 head = start + direction * clamp(flight, 0.0, 1.0) * 0.48;
        vec2 delta = uv * vec2(aspect, 1.0) - head;
        float along = dot(delta, direction);
        float across = abs(dot(delta, vec2(-direction.y, direction.x)));
        float pixel = max(fwidth(across), 0.0007);
        float taper = smoothstep(-0.16, 0.0, along) * (1.0 - smoothstep(0.0, 0.004, along));
        float trail = (1.0 - smoothstep(0.0005, 0.0015 + pixel, across)) * taper;
        float glow = exp(-dot(delta, delta) / 0.000018);
        return visible * (trail * 0.55 + glow * 0.85);
      }
      vec3 nightStars(vec2 uv) {
        vec2 grid = uv * vec2(480.0, 300.0);
        vec2 cell = floor(grid);
        vec2 seed = starHash(cell);
        vec2 centre = 0.25 + 0.5 * starHash(cell + 17.3);
        float distanceToStar = length(fract(grid) - centre);
        float radius = mix(0.045, 0.19, pow(seed.y, 3.0));
        float edge = max(fwidth(distanceToStar), 0.025);
        float point = 1.0 - smoothstep(radius - edge, radius + edge, distanceToStar);
        float selected = step(0.978, seed.x);
        float twinkle = 0.78 + 0.22 * sin(breezePhase * 3.0 + seed.y * 62.83);
        float brightness = mix(0.025, 0.42, pow(seed.y, 2.0));
        vec3 night = mix(vec3(0.0006, 0.0018, 0.0048),
          vec3(0.0012, 0.0038, 0.010), clamp(uv.y, 0.0, 1.0));
        return night + vec3(0.78, 0.88, 1.0) * point * selected * brightness * twinkle;
      }
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
        // 9 September 2026, user direction. Wider viewports crop this plate
        // vertically, and the crop used to be centred -- taking the trim off
        // both ends and losing the near ground, which is what the last beat
        // hands to The Invitation. landscapeAnchor is where the window sits
        // in the photograph: 0.5 is the old centred crop, higher pulls the
        // image's bottom edge into frame, and the Invitation beat lowers it
        // again to drift the land down the screen. Texture v runs top to
        // bottom here -- home-hero.ts owns that axis and both signs; see the
        // warning there before changing either. Horizontal stays centred.
        // Every threshold below reads landscapeUv as image space
        // (treeline at .52, canopy .40-.57, the sky bands), so they keep
        // pointing at the same pixels; only the window onto them moves.
        // landscapeZoom narrows the window to push into the land (grammar:
        // "being drawn in" / pushIn, scrubbed). It divides the crop on both
        // axes, so the anchor stays the point the window is held to and the
        // land magnifies about it rather than sliding. home-hero.ts computes
        // the anchor from the ZOOMED half-height for the same reason.
        // 9 September 2026, user direction: The Invitation lifts the whole
        // land scene up the screen and leaves charcoal behind it, the way a
        // scrolled page carries its background off the top. This is a screen
        // shift, not a sampling drift -- the window on the photograph is
        // unchanged, so the plate keeps its bottom-anchored crop and the edge
        // that rises into view is the photograph's own speckled dissolve
        // rather than a cut. Below it there is no photograph at all, and the
        // fragment ends as beyond (see the end of main).
        //
        // screenUv.y is 0 at the bottom of the canvas, so a pixel now shows
        // what used to sit lift below it -- hence the subtraction, and hence
        // a negative sUv.y meaning "off the bottom of the plate".
        vec2 sUv = vec2(screenUv.x, screenUv.y - lift);
        // The lift used to end on a ruled line across the canvas. The land now
        // goes soft into the dark over the last liftEdge of screen height:
        // out of focus first, then out of light. Gated on lift itself, or the
        // same band would blur the bottom of every beat before this one.
        float soften = liftEdge * smoothstep(0.0, 0.03, lift);
        float edgeBand = 1.0 - smoothstep(0.0, max(soften, 0.0001), max(sUv.y, 0.0));
        vec2 landscapeUv = vec2(
          (sUv.x - 0.5) * landscapeCrop.x / landscapeZoom + 0.5,
          (sUv.y - 0.5) * landscapeCrop.y / landscapeZoom + landscapeAnchor);
        // The photograph is now its full 1440x1500. Every threshold below was
        // calibrated against the old top-900 crop, so map into that space
        // rather than re-tuning each beat: legacyY is where this pixel sat in
        // the 900-row crop. Past its bottom edge legacyY exceeds 1 -- the new
        // near ground -- where the smoothsteps simply saturate, which is the
        // right reading of "nearer than anything the old crop contained".
        // Sampling of the taller texture still uses landscapeUv itself.
        float legacyY = landscapeUv.y * legacyScale;
        // Texture lookups keyed to the old crop must stay inside it.
        float legacyBand = clamp(legacyY, 0.0, 1.0);
        vec4 terrain = texture2D(landscape, landscapeUv);
        // AMB-05: the road widens from the vanishing point toward the viewer.
        // Keep its whole corridor still; colour/luminance suppress bark and soil.
        float foreground = 1.0 - smoothstep(0.0, 0.52, legacyY);
        float roadWidth = mix(0.012, 0.14, foreground);
        float roadside = smoothstep(roadWidth, roadWidth + 0.035, abs(landscapeUv.x - 0.5));
        float vegetation = smoothstep(0.45, 0.85, terrain.g / max(terrain.r, 0.001));
        float foliageLight = smoothstep(0.015, 0.12, dot(terrain.rgb, vec3(0.2126, 0.7152, 0.0722)));
        float edgeHold = smoothstep(0.0, 0.02, min(landscapeUv.x, 1.0 - landscapeUv.x));
        // AMB-05, latest user direction: gentle motion across all vegetation.
        // The spatial road mask and dark-trunk suppression remain in place.
        float windMask = roadside * mix(0.4, 1.0, vegetation) * foliageLight * edgeHold;
        float canopy = smoothstep(0.40, 0.57, legacyY);
        float sway = sin(breezePhase * 3.0 + landscapeUv.x * 13.0)
          * 0.7 + sin(breezePhase * 5.0 + landscapeUv.y * 19.0) * 0.3;
        float ripple = sin(breezePhase * 6.0 + landscapeUv.x * 55.0 + landscapeUv.y * 30.0);
        float arrival = smoothstep(0.65, 1.0, portal);
        vec2 wind = vec2(mix(ripple * 0.0009, sway * 0.00065, canopy),
          ripple * 0.00012 * (1.0 - canopy)) * windMask * arrival;
        terrain = texture2D(landscape, clamp(landscapeUv + wind, 0.001, 0.999));
        // Five-tap cross, widening as the departing edge approaches. Cheap,
        // and it only has to read as depth of field over a tenth of a screen.
        // Applied to the terrain sample rather than to the composed frame, so
        // the sky, the Truth layers and the road corridor stay sharp and only
        // the ground the lift is carrying away loses its edges.
        vec2 blurStep = vec2(0.0, 0.005) * edgeBand;
        vec4 blurred = (texture2D(landscape, clamp(landscapeUv + wind + blurStep, 0.001, 0.999))
          + texture2D(landscape, clamp(landscapeUv + wind - blurStep, 0.001, 0.999))
          + texture2D(landscape, clamp(landscapeUv + wind + blurStep.yx, 0.001, 0.999))
          + texture2D(landscape, clamp(landscapeUv + wind - blurStep.yx, 0.001, 0.999))) * 0.25;
        terrain = mix(terrain, blurred, edgeBand);
        // User reference, 9 September: sample the supplied sky's pale daylight
        // band behind the original transparent treeline, rather than deep blue.
        float skyY = mix(0.855, 0.94, clamp((legacyBand - 0.52) / 0.48, 0.0, 1.0));
        vec3 daylight = texture2D(sky, vec2(landscapeUv.x, skyY)).rgb;
        float luminance = dot(daylight, vec3(0.2126, 0.7152, 0.0722));
        daylight = mix(vec3(luminance), daylight, 0.65) * 0.8;
        vec3 blueSky = texture2D(sky, vec2(landscapeUv.x, mix(0.94, 0.99, legacyBand))).rgb * 0.8;
        // 9 September: one daylight value drives sky and land together. Grade
        // in linear colour so night dims light rather than painting a flat veil.
        float daylightAmount = clamp(wonder, 0.0, 1.0);
        float terrainLuma = dot(terrain.rgb, vec3(0.2126, 0.7152, 0.0722));
        vec3 nightTerrain = mix(vec3(terrainLuma), terrain.rgb, 0.72)
          * vec3(0.75, 0.86, 1.0) * 0.22;
        vec3 litTerrain = mix(nightTerrain, terrain.rgb, daylightAmount);
        // Exact 3371:44774 stack: sky, transparent land, full-scene 25% black,
        // then the supplied soft-light layer masked to the foreground alpha.
        vec3 truthSky = texture2D(truthSkyMap, vec2(landscapeUv.x, 1.0 - (truthSkyOffset + (1.0 - legacyBand) * 900.0) / 6996.0)).rgb;
        // Terrain compositing below keeps every star behind the treeline.
        truthSky = mix(truthSky, nightStars(vec2(landscapeUv.x, legacyBand)), belonging);
        truthSky += vec3(0.72, 0.86, 1.0) * shootingStar(sUv) * smoothstep(0.9, 1.0, belonging);
        vec3 truthBase = sRGBTransferOETF(vec4(mix(truthSky, terrain.rgb, terrain.a), 1.0)).rgb * 0.75;
        vec3 light = sRGBTransferOETF(texture2D(truthLightMap, vec2(landscapeUv.x, 1.0 - (truthLightOffset + (1.0 - legacyBand) * 900.0) / 7619.0))).rgb;
        vec3 truthView = sRGBTransferEOTF(vec4(mix(truthBase,
          softLight(truthBase, light), terrain.a), 1.0)).rgb;
        vec3 view = mix(mix(mix(blueSky, daylight, daylightAmount), litTerrain, terrain.a), truthView, truth);
        gl_FragColor = vec4(mix(source.rgb, view, hole), max(alpha, hole));
        // What the lift uncovers. Opaque, so it covers the renderer's own
        // clear colour -- by this beat that has already warmed to oxide, and
        // the ground below the land has to read as charcoal, not as red.
        // The hand-off is a fade across the lower part of the blurred band,
        // never a step: below the edge there is only charcoal, above it the
        // land arrives already soft, and the two meet without a line.
        float edge = smoothstep(-soften * 0.35, max(soften * 0.55, 0.0001), sUv.y);
        gl_FragColor = vec4(mix(beyond, gl_FragColor.rgb, edge), max(alpha, hole));
        #include <colorspace_fragment>
      }
    `,
  });
}
