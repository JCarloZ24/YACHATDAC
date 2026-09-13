/**
 * "The stars emerge as daylight leaves", SCR-09 / SCR-10 / AMB-05, user
 * direction 13 September 2026. Generated scenic stars, not a star catalogue
 * or a depiction of cultural astronomy. One field survives every night;
 * visibility responds to the local sky light, never to a section's entrance.
 *
 * Screenshot follow-up: no whole-sky solar-depression fade. A star becomes
 * detectable as the actual sky behind it darkens. Bright stars tolerate more
 * background light; faint stars wait for a darker patch of sky. These are
 * scenic display thresholds, not physical photometric calibration.
 * Horizon extinction and restrained scintillation suggest atmosphere, not
 * blinking lights. The existing pausable breeze phase owns all twinkle.
 *
 * Milky Way follow-up, 13 September 2026: the user's photograph informs a
 * generated stellar band, warm core and absorbing dust lanes, not a copied
 * image or a claim about the sky photographed over this Country. Faint
 * galactic radiance needs deeper local darkness than the prominent stars.
 * All structure is fixed: no boiling noise, cloud layer or second clock.
 * Three-reference realism revision: granular stellar concentrations and
 * clumped absorption replace the two smooth ribbons. Three independently
 * seeded magnitude populations resolve as tiny optical points, not bokeh.
 * Sunrise-overlap amendment: the later user reference deliberately holds
 * the Milky Way beside a low sun. Keep this photographic-style composite
 * through twilight, releasing into daylight rather than claiming naked-eye
 * astronomy. Local glare, the existing sun clock and all seeds remain shared.
 */
export const nightAtmosphere = /* glsl */ `
  vec3 nightSky(vec2 uv, float horizon) {
    float haze = exp(-max(uv.y - horizon, 0.0) * 7.0);
    return mix(vec3(0.0006, 0.0018, 0.0048),
      vec3(0.0012, 0.0038, 0.010), haze);
  }

  float stellarVisibility(vec3 skyRadiance, float luminosity) {
    // Linear sky-only luminance: not the terrain, text, or a panel's black.
    // One moment can therefore contain visible stars on the dark side and
    // none around the bright sunset, without a separately animated mask.
    float luminance = dot(skyRadiance, vec3(0.2126, 0.7152, 0.0722));
    float skyLimit = mix(0.0012, 0.0182, luminosity);
    return 1.0 - smoothstep(skyLimit * 0.45, skyLimit * 1.5, luminance);
  }

  float galacticVisibility(vec3 skyRadiance) {
    // "Sunrise overlap", 13 September 2026: the user wants the galaxy held
    // over the amber atmosphere, not erased when welcome reaches twilight.
    // Retain detail outside the brightest glare until the sun is well up.
    // This is an exposure choice for the reference, not physical visibility.
    float luminance = dot(skyRadiance, vec3(0.2126, 0.7152, 0.0722));
    float daylightRelease = 1.0 - smoothstep(4.0, 16.0, -solarDepression);
    // A phone shows mostly the bright horizon. Do not mistake that entire
    // amber field for the solar core and erase the requested overlap there.
    float outsideGlare = 1.0 - smoothstep(0.16, 0.70, luminance);
    return max(stellarVisibility(skyRadiance, 0.08), outsideGlare * daylightRelease);
  }

  float galacticNoise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(starHash(cell).x, starHash(cell + vec2(1.0, 0.0)).x, f.x),
      mix(starHash(cell + vec2(0.0, 1.0)).x,
        starHash(cell + vec2(1.0)).x, f.x), f.y);
  }

  float galacticFbm(vec2 p) {
    float sum = 0.0;
    float weight = 0.48;
    // Fixed octave rotation breaks up the grid without an evolving cloud
    // simulation. Bounded work, with no texture requests or render passes.
    for (int octave = 0; octave < 5; octave++) {
      sum += galacticNoise(p) * weight;
      p = mat2(1.6, -1.2, 1.2, 1.6) * p + vec2(13.1, 7.7);
      weight *= 0.53;
    }
    return sum;
  }

  vec3 galacticStars(vec2 sky, float scale, float density, vec2 fluxRange,
    float prominence, vec3 skyRadiance, float haze, float retainedDetail) {
    vec2 grid = sky * scale;
    vec2 cell = floor(grid);
    vec2 seed = starHash(cell + scale);
    vec2 delta = fract(grid) - (0.14 + 0.72 * starHash(cell + scale + 31.7));
    float luminosity = pow(seed.y, 3.8);
    // The angular core is small even for bright stars. More flux, rather
    // than a much bigger disc, distinguishes the sparse foreground stars.
    float radius = mix(0.045, 0.075, luminosity);
    float pixel = max(fwidth(grid.x), fwidth(grid.y));
    float variance = radius * radius + pixel * pixel * 0.12;
    float point = exp(-dot(delta, delta) / (2.0 * variance))
      * radius * radius / variance;
    float temperature = starHash(cell + 71.9).y;
    vec3 colour = mix(vec3(0.60, 0.77, 1.0), vec3(0.92, 0.94, 1.0),
      smoothstep(0.0, 0.75, temperature));
    colour = mix(colour, vec3(1.0, 0.74, 0.48), smoothstep(0.78, 1.0, temperature));
    float visible = stellarVisibility(skyRadiance,
      mix(0.075, prominence, luminosity));
    visible = max(visible, retainedDetail * mix(0.45, 1.0, luminosity));
    float twinkle = 1.0 + (sin(breezePhase * 7.0 + seed.y * 62.83) * 0.65
      + sin(breezePhase * 11.0 + seed.x * 91.17) * 0.35)
      * mix(0.025, 0.075, haze) * prominence;
    // Only rare bright points get a tiny optical skirt, never flare crosses.
    float skirt = exp(-dot(delta, delta) / (variance * 10.0))
      * pow(luminosity, 5.0) * prominence * 0.012;
    return colour * (point + skirt) * step(1.0 - density, seed.x)
      * mix(fluxRange.x, fluxRange.y, luminosity) * visible * twinkle;
  }

  vec3 milkyWay(vec2 sky, out float concentration) {
    // An inclined band measured in viewport-height units, not stretched UVs.
    // Desktop leaves the left reading area quiet; the continuous aspect
    // adjustment brings the core into a narrow phone's field of view.
    float centre = min(solarAspect, 1.35) * 0.25;
    vec2 p = vec2(sky.x - centre + sky.y * 0.48, sky.y);
    vec2 warp = vec2(galacticFbm(p * 5.0 + vec2(8.4, 17.1)),
      galacticFbm(p * 5.0 + vec2(31.7, 4.2)));
    vec2 q = p + (warp - 0.5) * vec2(0.19, 0.12);
    float across = q.x;
    float core = exp(-pow((p.y - 0.12) / 0.18, 2.0));
    float width = mix(0.095, 0.16, core);
    float band = exp(-pow(across / width, 2.0));
    float halo = exp(-pow(across / (width * 2.8), 2.0));
    float clouds = galacticFbm(q * vec2(24.0, 20.0) + vec2(4.2, 13.7));
    float fine = galacticFbm(q * 93.0 + vec2(31.5, 9.2));
    // The Great Rift-like silhouette has varying width and detached clumps,
    // not two parallel Gaussian stripes. No geographically identified sky.
    float riftWidth = 0.018 + 0.065 * warp.y * warp.y;
    float rift = exp(-pow((across + (clouds - 0.5) * 0.1) / riftWidth, 2.0));
    float clumps = smoothstep(0.45, 0.73, clouds + rift * 0.18);
    float absorption = exp(-(rift * 2.8 + clumps * 1.1)
      * (0.45 + fine * 1.4));
    float mottling = pow(max(clouds * 1.7, 0.0), 2.2);
    float structure = band * mottling * absorption
      * mix(0.55, 1.65, smoothstep(0.25, 0.72, fine));
    // Fine, fixed stellar grain gives the diffuse light a photographic
    // texture. Filter its highest frequency on low-resolution viewports.
    vec2 grainUv = sky * 620.0;
    float grainFilter = 1.0 - smoothstep(0.6, 1.4,
      max(fwidth(grainUv.x), fwidth(grainUv.y)));
    float grain = mix(1.0, 0.55 + galacticNoise(grainUv) * 1.15, grainFilter);
    concentration = clamp(structure * 4.8 + halo * 0.10, 0.0, 1.0);
    vec3 colour = mix(vec3(0.57, 0.65, 0.88), vec3(1.0, 0.74, 0.49), core * 0.8);
    colour = mix(colour, vec3(0.79, 0.63, 0.74), smoothstep(0.51, 0.70, fine) * 0.28);
    // Unresolved light supports, rather than replaces, the pin-point stars.
    return colour * structure * mix(0.075, 0.23, core) * grain
      + vec3(0.48, 0.58, 0.79) * halo * (0.008 + fine * 0.018);
  }

  vec3 nightStars(vec2 uv, float horizon, vec3 skyRadiance) {
    // The same aspect-correct sky plane as the sun. No reseeding at a year
    // boundary, no background-image scroll, and round points on tall screens.
    vec2 sky = vec2((uv.x - 0.5) * solarAspect, uv.y - horizon);
    float altitude = max(sky.y, 0.0);
    float horizonHaze = 1.0 - smoothstep(0.02, 0.26, altitude);

    float transmission = exp(-0.035 / max(altitude, 0.015))
      * smoothstep(0.0, 0.035, altitude);

    float concentration;
    vec3 galaxy = milkyWay(sky, concentration);
    float diffuseVisible = galacticVisibility(skyRadiance);
    // Fine stars stay with the retained galactic structure, without turning
    // the whole sky into a uniform layer of daytime points.
    float retainedDetail = diffuseVisible * concentration;
    // Distinct scales and seeds remove the old evenly spaced, soft-dot look.
    // Foreground stars may lie in front of galactic dust; distant populations
    // follow the absorbing band, making genuine dark gaps between clusters.
    vec3 stars = galacticStars(sky, 95.0, 0.035, vec2(0.18, 2.4),
      1.0, skyRadiance, horizonHaze, 0.0);
    stars += galacticStars(sky + vec2(17.8, 3.1), 230.0,
      0.18 + concentration * 0.26, vec2(0.12, 1.15), 0.42, skyRadiance, horizonHaze,
      retainedDetail);
    stars += galacticStars(sky + vec2(5.2, 9.6), 470.0,
      0.095 + concentration * 0.44, vec2(0.08, 0.7), 0.18, skyRadiance, horizonHaze,
      retainedDetail);
    // The same band takes the warmth of the requested low-sun composite.
    // Night stays cool; exposure rises only through dawn/dusk, before the
    // retained layer releases into daylight. No section-triggered switch.
    float goldenHour = smoothstep(-14.0, 0.0, -solarDepression)
      * (1.0 - smoothstep(4.0, 16.0, -solarDepression));
    galaxy *= mix(vec3(1.0), vec3(1.28, 1.08, 0.72) * 2.3, goldenHour);
    // Restrained long-exposure stellar background, inside the sky only.
    // Excluded from the contrast test, like the galaxy's own emitted light.
    vec3 background = vec3(0.0045, 0.0075, 0.014)
      * stellarVisibility(skyRadiance, 0.08);
    return (stars + galaxy * diffuseVisible + background) * transmission;
  }
`;
