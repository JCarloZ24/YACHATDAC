import {
  Data3DTexture, HalfFloatType, LinearFilter, LinearMipmapLinearFilter, Mesh, NoBlending,
  OrthographicCamera, PlaneGeometry, RepeatWrapping, RGFormat, Scene,
  ShaderMaterial, Vector2, WebGLRenderer, WebGLRenderTarget,
} from "three";

/**
 * "Clouds carry the passing hours", user direction 13 September 2026.
 * Generated scenic weather, not photography or a weather record of Country.
 * A bounded cloud deck is integrated in linear light at half resolution,
 * then composed behind the supplied woodland by home-land.ts. Shape noise
 * is generated once on the CPU: no downloaded texture, new renderer or clock.
 * Technique reference: Guerrilla's Real-Time Volumetric Cloudscapes (2015),
 * https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn
 * This is an independent, small scenic approximation, not their renderer.
 */
const NOISE_SIZE = 64;
let noiseBytes: Uint8Array | undefined;

function createNoise(): Data3DTexture {
  if (!noiseBytes) {
    const hash = (x: number, y: number, z: number) => {
      let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1442695041);
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
    };
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const mix = (a: number, b: number, t: number) => a + (b - a) * t;
    const value = (x: number, y: number, z: number, period: number) => {
      x *= period; y *= period; z *= period;
      const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
      const fx = smooth(x - ix), fy = smooth(y - iy), fz = smooth(z - iz);
      const at = (dx: number, dy: number, dz: number) =>
        hash((ix + dx) % period, (iy + dy) % period, (iz + dz) % period);
      return mix(mix(mix(at(0, 0, 0), at(1, 0, 0), fx), mix(at(0, 1, 0), at(1, 1, 0), fx), fy),
        mix(mix(at(0, 0, 1), at(1, 0, 1), fx), mix(at(0, 1, 1), at(1, 1, 1), fx), fy), fz);
    };
    const features = new Float32Array(8 * 8 * 8 * 3);
    for (let z = 0; z < 8; z++) for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const i = ((z * 8 + y) * 8 + x) * 3;
      features[i] = hash(x + 17, y, z);
      features[i + 1] = hash(x, y + 31, z);
      features[i + 2] = hash(x, y, z + 47);
    }
    noiseBytes = new Uint8Array(NOISE_SIZE ** 3 * 2);
    for (let z = 0; z < NOISE_SIZE; z++) for (let y = 0; y < NOISE_SIZE; y++) for (let x = 0; x < NOISE_SIZE; x++) {
      const px = x / NOISE_SIZE, py = y / NOISE_SIZE, pz = z / NOISE_SIZE;
      const ix = Math.floor(px * 8), iy = Math.floor(py * 8), iz = Math.floor(pz * 8);
      let nearest = 3;
      for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const cx = ix + dx, cy = iy + dy, cz = iz + dz;
        const i = ((((cz + 8) % 8) * 8 + (cy + 8) % 8) * 8 + (cx + 8) % 8) * 3;
        const vx = cx + features[i] - px * 8;
        const vy = cy + features[i + 1] - py * 8;
        const vz = cz + features[i + 2] - pz * 8;
        nearest = Math.min(nearest, vx * vx + vy * vy + vz * vz);
      }
      const i = ((z * NOISE_SIZE + y) * NOISE_SIZE + x) * 2;
      noiseBytes[i] = Math.round(255 * (value(px, py, pz, 4) * 0.55
        + value(px, py, pz, 8) * 0.3 + value(px, py, pz, 16) * 0.15));
      noiseBytes[i + 1] = Math.round(255 * Math.max(0, 1 - Math.sqrt(nearest)));
    }
  }
  const texture = new Data3DTexture(noiseBytes, NOISE_SIZE, NOISE_SIZE, NOISE_SIZE);
  texture.format = RGFormat;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = true;
  texture.wrapS = texture.wrapT = texture.wrapR = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

export function createCloudPass(renderer: WebGLRenderer, land: ShaderMaterial) {
  const noise = createNoise();
  // Half floats retain night radiance below 1/255. The caller omits clouds
  // if float colour buffers are unavailable, leaving the existing sky intact.
  const target = new WebGLRenderTarget(1, 1, {
    type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter,
    depthBuffer: false, stencilBuffer: false,
  });
  const material = new ShaderMaterial({
    depthTest: false, depthWrite: false, blending: NoBlending,
    uniforms: {
      cloudNoise: { value: noise }, cloudTime: { value: 0 },
      cloudHorizon: { value: 0.5 },
      solarAspect: land.uniforms.solarAspect,
      solarDaylight: land.uniforms.solarDaylight,
      sunDirection: land.uniforms.sunDirection,
    },
    vertexShader: `
      varying vec2 cloudUv;
      void main() {
        cloudUv = uv;
        gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp sampler3D;
      uniform sampler3D cloudNoise;
      uniform float cloudTime;
      uniform float cloudHorizon;
      uniform float solarAspect;
      uniform float solarDaylight;
      uniform vec3 sunDirection;
      varying vec2 cloudUv;

      float density(vec3 p) {
        float height = (p.y - 0.48) / 0.38;
        if (height <= 0.0 || height >= 1.0) return 0.0;
        // Coherent wind through a seamless volume; a much slower vertical
        // evolution changes the billows without boiling or a loop crossfade.
        vec3 q = p + vec3(cloudTime, cloudTime * 0.025, cloudTime * 0.22);
        float weather = smoothstep(0.35, 0.66,
          textureLod(cloudNoise, q * 0.055 + vec3(0.18, 0.43, 0.62), 0.0).r);
        float shape = textureLod(cloudNoise, q * vec3(0.30, 0.44, 0.30), 0.0).r;
        float profile = smoothstep(0.0, 0.15, height)
          * (1.0 - smoothstep(0.35, 1.0, height));
        // Explicit LOD is essential in the divergent density/shadow branches;
        // implicit derivatives can average away all the billow detail.
        vec2 erosion = textureLod(cloudNoise, q * 0.65 + vec3(0.31), 0.0).rg;
        float detailLod = log2(max(1.0, length(p.xz) * 0.15));
        vec2 fine = textureLod(cloudNoise,
          q * 1.65 + vec3(0.17, 0.53 + cloudTime * 0.008, 0.29), detailLod).rg;
        float body = (shape * 0.4 + erosion.r * 0.35 + fine.r * 0.25
          - mix(0.58, 0.44, weather) - (1.0 - profile) * 0.18) * 18.0;
        float detail = erosion.g * 0.65 + fine.g * 0.35;
        // The height profile changes the density threshold; clipping the
        // body before applying it would produce uniformly smooth undersides.
        return clamp(body - (1.0 - detail) * 0.6, 0.0, 1.0)
          * smoothstep(0.0, 0.05, height) * (1.0 - smoothstep(0.9, 1.0, height));
      }

      void main() {
        vec3 ray = normalize(vec3((cloudUv.x - 0.5) * solarAspect * 0.9,
          (cloudUv.y - cloudHorizon) * 0.9, 1.0));
        if (ray.y <= 0.012) { gl_FragColor = vec4(0.0); return; }
        float nearT = 0.48 / ray.y;
        float farT = min(0.86 / ray.y, 38.0);
        if (farT <= nearT) { gl_FragColor = vec4(0.0); return; }
        float stepSize = (farT - nearT) / 56.0;
        vec3 lightDirection = normalize(vec3(sunDirection.x,
          max(sunDirection.y, 0.07), sunDirection.z));
        float sunlight = smoothstep(-0.14, 0.07, sunDirection.y);
        float warmth = 1.0 - smoothstep(0.015, 0.32, sunDirection.y);
        vec3 sunColour = mix(vec3(1.0, 0.97, 0.90), vec3(1.0, 0.36, 0.12), warmth);
        float forward = pow(max(dot(ray, sunDirection), 0.0), 12.0);
        vec3 radiance = vec3(0.0);
        float transmission = 1.0;
        // Enough fixed samples to resolve the thin edges without screen-space
        // dithering, which read as a checkerboard in high-DPR phone crops.
        for (int i = 0; i < 56; i++) {
          float t = nearT + (float(i) + 0.5) * stepSize;
          vec3 p = ray * t;
          float d = density(p);
          if (d > 0.001) {
            float shadow = density(p + lightDirection * 0.075) * 0.15
              + density(p + lightDirection * 0.18) * 0.32
              + density(p + lightDirection * 0.55) * 0.65;
            float direct = exp(-shadow * 9.0);
            float height = clamp((p.y - 0.48) / 0.38, 0.0, 1.0);
            vec3 ambient = mix(vec3(0.00012, 0.00020, 0.00032),
              vec3(0.09, 0.13, 0.19), solarDaylight) * mix(0.65, 1.3, height);
            vec3 lighting = ambient + sunColour * sunlight
              * (direct * (0.55 + forward * 0.4) + 0.13);
            // Distant clouds disappear into air rather than a ruled deck edge.
            float distanceHaze = exp(-t * 0.065);
            float alpha = (1.0 - exp(-d * stepSize * 35.0)) * distanceHaze;
            radiance += transmission * alpha * lighting;
            transmission *= 1.0 - alpha;
            if (transmission < 0.015) break;
          }
        }
        float horizonFade = smoothstep(0.012, 0.055, ray.y);
        // Premultiplied radiance, deliberately no output colour conversion:
        // the full-resolution compositor applies that exactly once.
        gl_FragColor = vec4(radiance, 1.0 - transmission) * horizonFade;
      }
    `,
  });
  const scene = new Scene();
  const geometry = new PlaneGeometry(1, 1);
  const quad = new Mesh(geometry, material);
  quad.frustumCulled = false;
  scene.add(quad);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  land.uniforms.cloudMap.value = target.texture;
  land.uniforms.cloudReady.value = 1;

  return {
    resize(width: number, height: number) {
      const scale = Math.min(renderer.getPixelRatio() * 0.5, 900 / Math.max(width, height));
      target.setSize(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)));
    },
    render(skyOffset: number, elapsed: number) {
      const crop = land.uniforms.landscapeCrop.value as Vector2;
      material.uniforms.cloudHorizon.value = (0.7 - land.uniforms.landscapeAnchor.value)
        * land.uniforms.landscapeZoom.value / crop.y + 0.5;
      // Reuse the controller's pausable elapsed time, not breezePhase: that
      // phase wraps every 24s and would visibly teleport translating clouds.
      material.uniforms.cloudTime.value = skyOffset * 0.003 + elapsed * 0.018;
      if (land.uniforms.lift.value >= 1) return;
      const previous = renderer.getRenderTarget();
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.setRenderTarget(previous);
    },
    dispose() {
      land.uniforms.cloudReady.value = 0;
      land.uniforms.cloudMap.value = null;
      scene.clear();
      geometry.dispose(); material.dispose(); noise.dispose(); target.dispose();
    },
  };
}
