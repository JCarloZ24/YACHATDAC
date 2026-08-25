"use client";

/**
 * X1 — honest loader progress.
 *
 * The sketch spec is one line long and one word of it is doing all the work:
 * "Progress from real asset decode. Hard cap 2.5s, once per session.
 *  build — **never fake the number**."
 *
 * So this measures actual bytes off actual responses. Each asset contributes
 * an equal share of the total; within an asset, a known content-length gives
 * fractional progress and an unknown one steps 0 → 1 on completion.
 *
 * ON SMOOTHING
 * ------------
 * The displayed number is eased toward the measured one (see Preloader), which
 * is not the same as inventing it: the target is always the real value and the
 * display never leads it, only lags. A number that has never been higher than
 * the truth is not a faked number.
 *
 * ON A WARM CACHE THIS FINISHES ALMOST INSTANTLY, AND THAT IS CORRECT.
 * The loader is gated to once per session, so the visit where it runs is the
 * visit where the assets are genuinely cold. Padding it to look impressive is
 * exactly what the spec forbids.
 */

/** Hard ceiling. Past this the loader releases regardless of asset state. */
export const HARD_CAP_MS = 2500;

type Watcher = { cancel: () => void };

/**
 * Streams `urls`, reporting combined progress 0 → 1.
 *
 * `onProgress` is called with monotonically non-decreasing values, and is
 * always called once with 1 — on completion, on error, or at the hard cap.
 * A loader that can hang is worse than no loader.
 */
export function trackAssets(
  urls: string[],
  onProgress: (progress: number) => void,
): Watcher {
  const controller = new AbortController();
  const shares = new Map<string, number>();
  let settled = false;
  let highWater = 0;

  const report = () => {
    if (settled) return;
    let sum = 0;
    for (const share of shares.values()) sum += share;
    const next = urls.length ? sum / urls.length : 1;
    // Monotonic: a re-measured content-length must never rewind the bar.
    highWater = Math.max(highWater, Math.min(next, 1));
    onProgress(highWater);
  };

  const finish = () => {
    if (settled) return;
    settled = true;
    onProgress(1);
  };

  const capTimer = window.setTimeout(finish, HARD_CAP_MS);

  const readOne = async (url: string) => {
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        credentials: "same-origin",
      });
      const declared = Number(response.headers.get("content-length"));
      const total = Number.isFinite(declared) && declared > 0 ? declared : 0;

      if (!response.body) {
        await response.arrayBuffer();
        shares.set(url, 1);
        report();
        return;
      }

      const reader = response.body.getReader();
      let loaded = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        loaded += value?.byteLength ?? 0;
        // Without a content-length there is nothing honest to divide by, so
        // the asset simply stays at 0 until it completes.
        if (total) {
          shares.set(url, Math.min(loaded / total, 1));
          report();
        }
      }
      shares.set(url, 1);
      report();
    } catch {
      // A failed asset must not strand the bar. It counts as resolved —
      // the page is going to render without it either way.
      shares.set(url, 1);
      report();
    }
  };

  Promise.all(urls.map(readOne))
    .then(async () => {
      // Fonts are the assets that actually move layout, so the loader should
      // not lift before they are usable. This is real decode state.
      await document.fonts?.ready;
    })
    .catch(() => undefined)
    .finally(finish);

  return {
    cancel: () => {
      window.clearTimeout(capTimer);
      controller.abort();
      settled = true;
    },
  };
}
