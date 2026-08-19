/**
 * Scroll-linked section without pinning — the common case.
 * Copy this for parallax, push-ins, grade shifts, colour ramps.
 */
import gsap from 'gsap';

export default function createScrubSection(root) {
  const mm = gsap.matchMedia();
  const layers = root.querySelectorAll('[data-layer]');
  const media  = root.querySelector('[data-media]');

  function init() {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Uneven ratios read as landscape; even ones read as a slider.
      layers.forEach(l => {
        gsap.to(l, {
          yPercent: -22 * parseFloat(l.dataset.layer),
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      });

      if (media) {
        gsap.fromTo(media,
          { scale: 1 },
          { scale: 1.14, yPercent: -4, ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
      // matchMedia reverts everything created inside this scope automatically.
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([...layers, media].filter(Boolean), { clearProps: 'all' });
    });
  }

  function destroy() { mm.revert(); }

  return { init, destroy };
}
