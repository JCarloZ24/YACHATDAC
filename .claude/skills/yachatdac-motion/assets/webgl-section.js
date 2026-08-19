/**
 * The one WebGL section on the site (E1 / E3 / T6).
 * Lazy-imported after first paint, paused off-screen, disposed on teardown,
 * poster-frame fallback that looks deliberate rather than broken.
 *
 * Before building anything terrain-based, check references/permissions.md —
 * land detail level is not yet confirmed. Use generic terrain until it is.
 */
export default function createWebGLSection(root) {
  const canvas = root.querySelector('canvas');
  const poster = root.querySelector('[data-poster]');

  let renderer, scene, camera, raf = null, io = null, trigger = null, disposed = false;

  const unsupported = () => {
    try {
      return !document.createElement('canvas').getContext('webgl2');
    } catch { return true; }
  };

  const shouldFallback = () =>
    unsupported() ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    navigator.connection?.saveData === true;

  function showPoster() {
    poster?.removeAttribute('hidden');
    canvas?.setAttribute('hidden', '');
  }

  async function init() {
    if (shouldFallback()) return showPoster();

    // Lazy: nothing 3D blocks the hero.
    const THREE = await import('three');
    const { default: gsap } = await import('gsap');
    const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
    if (disposed) return;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));   // hard cap
    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);

    // ... build geometry here ...

    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); showPoster(); });

    const proxy = { t: 0 };
    trigger = gsap.to(proxy, {
      t: 1, ease: 'none',
      scrollTrigger: { trigger: root, scrub: 1, start: 'top bottom', end: 'bottom top' },
      onUpdate: () => updateCamera(proxy.t)
    });

    // A scroll site spends most of its life not looking at the 3D.
    io = new IntersectionObserver(([entry]) => entry.isIntersecting ? play() : pause());
    io.observe(root);

    resize();
    window.addEventListener('resize', resize);
  }

  function updateCamera(/* t */) { /* position + lookAt from the scrubbed value */ }

  function play()  { if (!raf) raf = requestAnimationFrame(tick); }
  function pause() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  function tick() { renderer.render(scene, camera); raf = requestAnimationFrame(tick); }

  function resize() {
    const { width, height } = root.getBoundingClientRect();
    renderer?.setSize(width, height, false);
    if (camera) { camera.aspect = width / height; camera.updateProjectionMatrix(); }
  }

  function destroy() {
    disposed = true;
    pause();
    io?.disconnect();
    trigger?.scrollTrigger?.kill();
    trigger?.kill();
    window.removeEventListener('resize', resize);
    scene?.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); });
    renderer?.dispose();
    renderer = scene = camera = null;
  }

  return { init, destroy };
}
