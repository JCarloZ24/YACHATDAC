/**
 * Pinned step-through (X3) — one per page, never under reduced motion.
 * Budget ~320vh of scroll span for four steps and say so in the wireframe.
 */
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function createPinnedSteps(root) {
  const mm    = gsap.matchMedia();
  const steps = [...root.querySelectorAll('[data-step]')];
  const bar   = root.querySelector('[data-progress]');

  function init() {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          pin: true,
          scrub: 0.8,
          end: '+=' + steps.length * 80 + '%',
          invalidateOnRefresh: true,
          snap: steps.length > 1
            ? { snapTo: 1 / (steps.length - 1), duration: 0.3, ease: 'power2.inOut' }
            : false,
          onUpdate: self => bar && gsap.set(bar, { scaleX: self.progress })
        }
      });

      steps.forEach((step, i) => {
        if (i > 0) tl.fromTo(step, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'expo.out' }, i);
        if (i < steps.length - 1) tl.to(step, { opacity: 0, y: -24, ease: 'power2.in' }, i + 0.8);
      });

      return () => tl.kill();
    });

    // Pinned content becomes stacked content. Focus order is unaffected either way.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(steps, { clearProps: 'all', position: 'relative', opacity: 1 });
    });
  }

  function destroy() { mm.revert(); }

  return { init, destroy };
}
