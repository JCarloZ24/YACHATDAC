import { ShaderMaterial, Vector3, Vector4 } from "three";

/**
 * SCR-09 / SCR-10, "Country carries the day", user direction 13 September
 * 2026. Generated scenic lighting: these are composition/timeline values,
 * not geographic bearings or an astronomical reconstruction of Country.
 *
 * The existing sky-offset clock drives one solar arc. Daylight passes above
 * the frame, leaving the reading area clear; dawn and dusk meet the actual
 * woodland alpha. The tall crop has its own field of view, keeping the two
 * horizon crossings in view without stretching the solar disc.
 */
const SOLAR_STOPS = [
  [0, -0.07],       // Opening night.
  [316, -0.012],    // Welcome: dawn twilight.
  [600, 0.018],     // Wonder: sunrise.
  [1422, 0.30],     // Truth introduction: late morning.
  [1800, 0.47],     // 1861: near solar noon.
  [2337, 0.66],     // 1871: afternoon.
  [2543, 0.77],     // 1881: late afternoon.
  [2817, 0.88],     // 1891: golden hour.
  [3273, 0.988],    // 1896: sundown at the treeline.
  [3948, 1.035],    // 1902: afterglow.
  [4879, 1.13],     // 2026: night.
  [5822, 1.18],     // Belonging: stars.
] as const;

const slope = (i: number) => {
  const a = SOLAR_STOPS[i];
  const b = SOLAR_STOPS[i + 1];
  return (b[1] - a[1]) / (b[0] - a[0]);
};
const tangent = (i: number) => {
  if (i === 0) return slope(0);
  if (i === SOLAR_STOPS.length - 1) return slope(i - 1);
  const before = slope(i - 1), after = slope(i);
  return 2 * before * after / (before + after);
};

/** Monotone Hermite interpolation: no solar jumps or reversals at a year. */
export function solarPhase(offset: number): number {
  if (offset <= SOLAR_STOPS[0][0]) return SOLAR_STOPS[0][1];
  for (let i = 0; i < SOLAR_STOPS.length - 1; i++) {
    const a = SOLAR_STOPS[i], b = SOLAR_STOPS[i + 1];
    if (offset > b[0]) continue;
    const span = b[0] - a[0], t = (offset - a[0]) / span;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * a[1]
      + (t3 - 2 * t2 + t) * span * tangent(i)
      + (-2 * t3 + 3 * t2) * b[1]
      + (t3 - t2) * span * tangent(i + 1);
  }
  return SOLAR_STOPS[SOLAR_STOPS.length - 1][1];
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Solar-only work runs when the reading clock/aspect changes, not per breeze tick. */
export function createSunUpdater(material: ShaderMaterial) {
  let previousOffset = NaN, previousAspect = NaN;
  return (offset: number, aspect: number) => {
    if (offset === previousOffset && aspect === previousAspect) return;
    previousOffset = offset;
    previousAspect = aspect;
    const phase = solarPhase(offset);
    const elevation = Math.sin(phase * Math.PI) * (50 * Math.PI / 180);
    const x = (0.8 - 0.6 * Math.max(0, Math.min(1, phase)) - 0.5) * aspect * 0.9;
    const direction = material.uniforms.sunDirection.value as Vector3;
    direction.set(x, Math.tan(elevation) * Math.sqrt(1 + x * x), 1).normalize();
    material.uniforms.sunEnergy.value = 1000 * Math.max(0,
      1 - Math.exp(-(1.6110731557 - Math.acos(direction.y)) / 1.5));
    // Rejoin the supplied night only after the sunset colour has drained.
    material.uniforms.solarNight.value = smooth(4250, 4879, offset);
    material.uniforms.solarReadShade.value = smooth(600, 1422, offset)
      * (1 - smooth(3948, 4879, offset));
    material.uniforms.solarDaylight.value = smooth(-0.06, 0.24, elevation);
    material.uniforms.solarWarmth.value = (1 - smooth(0.025, 0.3, elevation))
      * smooth(-0.045, 0.015, elevation);
    material.uniforms.solarAspect.value = aspect;
    // "Country carries the day", 13 September 2026 follow-up: atmosphere
    // changes the disc's appearance continuously, without per-year switches.
    const horizonWeight = 1 - smooth(0, 0.14, Math.max(0, elevation));
    const zenith = Math.PI / 2 - Math.max(0, elevation);
    const airMass = 1 / (Math.cos(zenith)
      + 0.15 * Math.pow(93.885 - zenith * 180 / Math.PI, -1.253));
    material.uniforms.sunTransmission.value = Math.exp(
      -(5.804543e-6 * 1.7 * 8400 + 0.8e-6 * 1250) * airMass);
    (material.uniforms.sunDisc.value as Vector4).set(
      0.00465 * (2 + 0.5 * horizonWeight),
      1 - 0.16 * horizonWeight,
      0.00008 + 0.0005 * horizonWeight,
      (2.3 + 21 * smooth(0.03, 0.35, elevation)) * smooth(-0.018, 0.015, elevation),
    );
  };
}

/**
 * Analytic Rayleigh/Mie scattering, adapted for our photo composite from the
 * MIT-licensed Three.js Sky shader (three/addons/objects/Sky.js). All values
 * are linear radiance until the shared output conversion. No cloud noise,
 * extra texture, render target or animation loop. User direction, 13 September
 * 2026: retain the larger horizon sun but let its appearance follow the hour.
 * The 2–2.5× display scale is scenic; extinction, subtle flattening, limb
 * darkening and derivative antialiasing make the disc read as light.
 */
export const solarAtmosphere = /* glsl */ `
  uniform vec3 sunDirection;
  uniform float sunEnergy;
  uniform float solarNight;
  uniform float solarReadShade;
  uniform float solarDaylight;
  uniform float solarWarmth;
  uniform float solarAspect;
  uniform vec4 sunDisc; // angular radius, vertical compression, edge, exposure
  uniform float sunTransmission;

  vec3 solarSky(vec2 uv, float horizon, out float discHighlight) {
    vec3 ray = normalize(vec3((uv.x - 0.5) * solarAspect * 0.9,
      (uv.y - horizon) * 0.9, 1.0));
    const vec3 betaR = vec3(5.804543e-6, 1.356291e-5, 3.026590e-5) * 1.7;
    const vec3 betaM = vec3(0.8e-6);
    float zenith = acos(max(0.0, ray.y));
    float airMass = 1.0 / (cos(zenith)
      + 0.15 * pow(93.885 - degrees(zenith), -1.253));
    vec3 extinction = exp(-(betaR * 8400.0 + betaM * 1250.0) * airMass);
    float cosine = clamp(dot(ray, sunDirection), -1.0, 1.0);
    float rayleigh = 0.0596831 * (1.0 + cosine * cosine);
    float mie = 0.0795775 * (1.0 - 0.8 * 0.8)
      / pow(max(0.001, 1.0 - 1.6 * cosine + 0.8 * 0.8), 1.5);
    vec3 scattering = sunEnergy * (betaR * rayleigh + betaM * mie) / (betaR + betaM);
    vec3 light = pow(max(vec3(0.0), scattering * (1.0 - extinction)), vec3(1.5));
    light *= mix(vec3(1.0), sqrt(max(vec3(0.0), scattering * extinction)),
      clamp(pow(1.0 - sunDirection.y, 5.0), 0.0, 1.0));
    // Exposure closes as daylight strengthens, as in a timelapse camera.
    // This also keeps the existing cream headings readable across solar noon.
    light *= mix(0.035, 0.0023, solarDaylight);

    // A tangent plane keeps the disc round away from the horizon and makes
    // refraction compress it vertically, rather than distorting the sun path.
    vec3 sunRight = normalize(cross(vec3(0.0, 1.0, 0.0), sunDirection));
    vec3 sunUp = cross(sunDirection, sunRight);
    vec2 discUv = vec2(dot(ray, sunRight), dot(ray, sunUp) / sunDisc.y);
    float angularDistance = length(discUv);
    float aa = max(fwidth(angularDistance), sunDisc.z);
    float disc = 1.0 - smoothstep(sunDisc.x - aa, sunDisc.x + aa, angularDistance);
    discHighlight = disc;
    float limb = sqrt(max(0.0, 1.0 - pow(angularDistance / sunDisc.x, 2.0)));
    float horizonWeight = (1.0 - sunDisc.y) / 0.16;
    float haze = exp(-pow(angularDistance / (sunDisc.x * 2.8), 1.4))
      * mix(0.012, 0.09, horizonWeight);
    // Normalise exposure by the centre's red transmission, not by each
    // channel: the longer atmospheric path still removes blue/green, and
    // the bottom limb reddens before the top. This avoids clipping every
    // low sun to the same white circle. Terrain occludes the whole result.
    vec3 directSun = extinction / max(sunTransmission, 0.0001) * sunDisc.w;
    light += directSun * (disc * (0.45 + 0.55 * limb) + haze);
    // A gentle photographic shoulder holds colour in the bright circumsolar sky.
    vec3 atmosphere = vec3(1.0) - exp(-light * 0.85);
    // Approximate multiple scattering below the horizon: a narrow afterglow
    // remains after the direct-light analytic model reaches zero energy.
    float twilightLight = smoothstep(-0.18, 0.015, sunDirection.y);
    float horizonHaze = exp(-max(ray.y, 0.0) * 18.0);
    float towardSun = pow(max(0.0, cosine), 12.0);
    vec3 twilight = vec3(0.0015, 0.004, 0.012) * mix(0.25, 1.0, twilightLight)
      + vec3(0.16, 0.048, 0.012) * horizonHaze * twilightLight * towardSun;
    return mix(twilight, atmosphere, smoothstep(-0.035, 0.02, sunDirection.y));
  }

  vec3 solarTerrain(vec3 photograph, vec2 uv) {
    // A still plate has no relightable normals: preserve its existing shadows.
    // Only exposure/white balance and a restrained distance haze change.
    vec3 balance = mix(vec3(0.66, 0.76, 0.93), vec3(1.0), solarDaylight);
    balance *= mix(vec3(1.0), vec3(1.16, 0.86, 0.62), solarWarmth);
    float exposure = mix(0.16, 0.78, solarDaylight);
    vec3 ground = photograph * balance * exposure;
    float distanceHaze = exp(-abs(uv.y - 0.70) * 34.0) * 0.055 * solarDaylight;
    return mix(ground, vec3(0.35, 0.41, 0.48), distanceHaze);
  }
`;
