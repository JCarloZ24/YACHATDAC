import { Color, ShaderMaterial, Texture, Vector2 } from "three";

/**
 * The homepage's land plate — a clip-space full-screen quad carrying the
 * woodland road, the sky and light sequence layers that put it at a time of
 * day, and the lift that takes the whole scene off the top for the closing
 * beats.
 *
 * ⚠ 10 September 2026, user direction. This was home-painting.ts, and its
 * first job was the opening: it drew the supplied red painting outward from
 * its central rosette, then zoomed forty times into that rosette to arrive on
 * the road. The homepage now opens ON the road and holds there, so the
 * painting reveal, the portal zoom, the radial lens that bowed the painting
 * during the approach, and the night grade the land wore before Wonder are
 * all gone from this file. Nothing here is dormant: what is left is drawn.
 *
 * The whole of the old opening survives, running, at /homepagev2 — that route
 * is an independent fork with its own copy of this file. Read it there rather
 * than reconstructing it from git.
 *
 * 10 September 2026, second pass: the page opens at night and lightens into
 * the welcome, and every beat now composites the way its Figma frame does --
 * sky sequence, land, the frame's black, the light layer soft-lit through the
 * land. There is no longer a separate daylight path, and no `truth` mix: the
 * Truth sequence is simply further along the same day. See HOME_SCENE.
 */
export function createLandMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: {
      // The time of day, exactly as Figma states it: how far each of the two
      // sequence layers is pushed up behind the frame, and the black the
      // frame lays over the whole composition. Four measured states, one per
      // beat -- see HOME_SCENE in effects/home.ts for the node ids and the
      // numbers. Defaults are the night the page opens on.
      skyOffset: { value: 0 },
      lightOffset: { value: 0 },
      // The light layer is placed at a different height in different frames
      // (8028 across the two welcome frames, 7619 from Wonder on), so its
      // denominator has to travel with its offset.
      lightHeight: { value: 8028 },
      shade: { value: 0.4 },
      belonging: { value: 0 },
      breezePhase: { value: 0 },
      // Nothing paints until the photograph is decoded: this is the plate's
      // alpha, so an undecoded texture shows the DOM still rather than a
      // sheet of smeared first-row pixels.
      landscapeReady: { value: 0 },
      // All three maps are handed in by home-hero.ts once their images decode.
      landscape: { value: null as Texture | null },
      skyMap: { value: null as Texture | null },
      lightMap: { value: null as Texture | null },
      landscapeCrop: { value: new Vector2(1, 1) },
      landscapeAnchor: { value: 0.5 },
      legacyScale: { value: 1 },
      // The photograph's own height in Figma, which is also the height of the
      // frame the sequence layers are placed against: one image row is one
      // layer row, which is what makes the offsets above readable.
      sceneHeight: { value: 1500 },
      landscapeZoom: { value: 1 },
      // How far up the screen the whole land scene has travelled, in screen
      // heights, and what is behind it when it goes. See the lift note in the
      // fragment shader. `beyond` is charcoal, handed in from the token.
      lift: { value: 0 },
      beyond: { value: new Color(0, 0, 0) },
    },
    vertexShader: `
      varying vec2 screenUv;
      void main() {
        screenUv = uv;
        gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform float belonging;
      uniform float skyOffset;
      uniform float lightOffset;
      uniform float lightHeight;
      uniform float shade;
      uniform float breezePhase;
      uniform float landscapeReady;
      uniform sampler2D landscape;
      uniform sampler2D skyMap;
      uniform sampler2D lightMap;
      uniform vec2 landscapeCrop;
      uniform float landscapeAnchor;
      uniform float legacyScale;
      uniform float sceneHeight;
      uniform float landscapeZoom;
      // The sky sequence is the same 6996-row layer in every frame, so this
      // one does not travel. Its companion does -- see lightHeight.
      const float skyHeight = 6996.0;
      uniform float lift;
      // How much of the canvas height the land takes to go out of focus and
      // into charcoal at the lift's trailing edge. Turn this, not the fade
      // inside main -- the blur width and the fade span are both read off it.
      const float liftEdge = 0.11;
      uniform vec3 beyond;
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
        // landscapeAnchor is where the cover crop's window sits in the
        // photograph on a viewport that crops it vertically: 0.5 is a centred
        // crop, higher pulls the image's bottom edge into frame. Texture v
        // runs top to bottom here -- home-hero.ts owns that axis and its
        // sign; see the warning there before changing it. Horizontal stays
        // centred. Every threshold below reads landscapeUv as image space
        // (treeline at .52, canopy .40-.57, the sky bands), so they keep
        // pointing at the same pixels; only the window onto them moves.
        // landscapeZoom narrows the window to push into the land (grammar:
        // "being drawn in" / pushIn, scrubbed). It divides the crop on both
        // axes, so the anchor stays the point the window is held to and the
        // land magnifies about it rather than sliding. home-hero.ts computes
        // the anchor from the ZOOMED half-height for the same reason.
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
        // The wind used to wait for the portal to arrive. The land is now the
        // page's first screen, so it is alive as soon as it is decoded.
        vec2 wind = vec2(mix(ripple * 0.0009, sway * 0.00065, canopy),
          ripple * 0.00012 * (1.0 - canopy)) * windMask * landscapeReady;
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
        // 10 September 2026, user direction: every beat of this page is the
        // same Figma composition read at a different point in the day, so
        // there is one stack here and no separate daylight path. The nodes,
        // in order: 3371:41344 (night), 3371:41275 (the welcome), 3371:41413
        // (Wonder), 3371:44759 (Truth), then the seven dated frames.
        //
        // Where a frame sits in the day is where its two sequence layers sit
        // behind it. Both are placed against the 1500-row scene at one image
        // row to one layer row, so a pixel's row in the photograph plus that
        // frame's offset IS its row in the sequence.
        //
        // !! This row used to come from legacyBand, which saturates at 1 over
        // everything above the treeline -- so the whole sky was a single flat
        // colour and only the offset moved it. Every reference frame is a
        // gradient from the top of the sky down to the horizon, so the row is
        // now read from the photograph directly. legacyBand still owns the
        // thresholds calibrated against the old 900-row crop -- the road
        // corridor, the canopy -- it just no longer owns this.
        float sceneRow = (1.0 - landscapeUv.y) * sceneHeight;
        vec3 skyBand = texture2D(skyMap, vec2(landscapeUv.x, 1.0 - (skyOffset + sceneRow) / skyHeight)).rgb;
        // Terrain compositing below keeps every star behind the treeline.
        skyBand = mix(skyBand, nightStars(vec2(landscapeUv.x, 1.0 - landscapeUv.y)), belonging);
        skyBand += vec3(0.72, 0.86, 1.0) * shootingStar(sUv) * smoothstep(0.9, 1.0, belonging);
        // The frame stack in display RGB: sky, the transparent land over it,
        // the frame's full-scene black, then the light layer soft-lit through
        // the land's own alpha. The shade uniform is that black -- 0.4 through
        // the two welcome frames, 0.2 at Wonder, 0.25 across Truth.
        vec3 base = sRGBTransferOETF(vec4(mix(skyBand, terrain.rgb, terrain.a), 1.0)).rgb * (1.0 - shade);
        vec3 light = sRGBTransferOETF(texture2D(lightMap, vec2(landscapeUv.x, 1.0 - (lightOffset + sceneRow) / lightHeight))).rgb;
        vec3 view = sRGBTransferEOTF(vec4(mix(base,
          softLight(base, light), terrain.a), 1.0)).rgb;
        // What the lift uncovers. Opaque, so it covers the renderer's own
        // clear colour. The hand-off is a fade across the lower part of the
        // blurred band, never a step: below the edge there is only charcoal,
        // above it the land arrives already soft, and the two meet without a
        // line.
        float edge = smoothstep(-soften * 0.35, max(soften * 0.55, 0.0001), sUv.y);
        gl_FragColor = vec4(mix(beyond, view, edge), landscapeReady);
        #include <colorspace_fragment>
      }
    `,
  });
}
