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

  vec3 nightStars(vec2 uv, float horizon, vec3 skyRadiance) {
    // The same aspect-correct sky plane as the sun. No reseeding at a year
    // boundary, no background-image scroll, and round points on tall screens.
    vec2 sky = vec2((uv.x - 0.5) * solarAspect, uv.y - horizon);
    vec2 grid = sky * 130.0;
    vec2 cell = floor(grid);
    vec2 seed = starHash(cell);
    vec2 centre = 0.3 + 0.4 * starHash(cell + 17.3);
    vec2 delta = fract(grid) - centre;
    float selected = step(0.956, seed.x);
    float luminosity = pow(seed.y, 3.0);
    float magnitude = mix(6.0, 0.5, luminosity);
    float altitude = max(sky.y, 0.0);
    float horizonHaze = 1.0 - smoothstep(0.02, 0.26, altitude);

    float visible = stellarVisibility(skyRadiance, luminosity);
    float transmission = exp(-0.035 / max(altitude, 0.015))
      * smoothstep(0.0, 0.035, altitude);

    // Energy-normalised Gaussian point spread: a subpixel star fades in
    // coverage instead of growing into a large dot on a low-DPR phone.
    float radius = mix(0.035, 0.080, luminosity);
    float pixel = max(fwidth(grid.x), fwidth(grid.y));
    float variance = radius * radius + pixel * pixel * 0.18;
    float point = exp(-dot(delta, delta) / (2.0 * variance))
      * radius * radius / variance;
    float flux = 0.65 * exp(-0.8 * (magnitude - 1.0));
    // Integer harmonics keep the existing 24-second phase seamless. The
    // independent phases avoid a synchronised pulse, and never wink off.
    float scintillation = sin(breezePhase * 7.0 + seed.y * 62.83) * 0.65
      + sin(breezePhase * 11.0 + seed.x * 91.17) * 0.35;
    float twinkle = 1.0 + scintillation * mix(0.045, 0.12, horizonHaze);
    vec3 colour = mix(vec3(0.76, 0.86, 1.0), vec3(1.0, 0.88, 0.72),
      starHash(cell + 51.7).x);
    return colour * point * selected * flux * visible * transmission * twinkle;
  }
`;
