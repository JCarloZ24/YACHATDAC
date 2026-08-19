/**
 * Frame-scrubbed image sequence (D2) and scrubbed video (M6).
 *
 * Never set src per frame and never tween currentTime directly — animate a proxy
 * and assign in onUpdate. Preload the first frames, stream the rest.
 */
import gsap from 'gsap';

export function createImageSequence(root, { frames, src }) {
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const images = new Array(frames);
  const proxy = { frame: 0 };
  const mm = gsap.matchMedia();

  // Slow connection: fewer frames rather than a slower experience.
  const count = navigator.connection?.saveData ? Math.min(frames, 12) : frames;
  const idx = i => Math.round((i / (count - 1)) * (frames - 1));

  function load(i, priority) {
    if (images[i]) return images[i];
    const img = new Image();
    img.fetchPriority = priority ? 'high' : 'low';
    img.src = src(i);
    images[i] = img;
    return img;
  }

  function draw() {
    const img = images[idx(Math.round(proxy.frame))];
    if (img?.complete) {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    }
  }

  function init() {
    for (let i = 0; i < Math.min(12, count); i++) load(i, true);
    requestIdleCallback?.(() => { for (let i = 12; i < count; i++) load(i, false); });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tw = gsap.to(proxy, {
        frame: count - 1, ease: 'none', snap: 'frame',
        scrollTrigger: { trigger: root, scrub: 0.5, start: 'top bottom', end: 'bottom top' },
        onUpdate: draw
      });
      return () => tw.kill();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => { proxy.frame = 0; draw(); });
  }

  function destroy() { mm.revert(); images.length = 0; }

  return { init, destroy };
}

export function createScrubbedVideo(root) {
  const video = root.querySelector('video');
  const proxy = { t: 0 };
  const mm = gsap.matchMedia();

  function init() {
    // iOS needs all three or it refuses to decode inline.
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tw = gsap.to(proxy, {
        t: () => video.duration || 0, ease: 'none',
        scrollTrigger: { trigger: root, scrub: 0.4, start: 'top bottom', end: 'bottom top' },
        onUpdate: () => { if (video.readyState >= 2) video.currentTime = proxy.t; }
      });
      return () => tw.kill();
    });

    // Poster frame, full stop.
    mm.add('(prefers-reduced-motion: reduce)', () => { video.removeAttribute('src'); video.load(); });
  }

  function destroy() { mm.revert(); }

  return { init, destroy };
}
