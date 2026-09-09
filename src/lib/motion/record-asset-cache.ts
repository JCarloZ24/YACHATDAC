"use client";

/** Record session cache, user direction 2026-09-09.
 * Cache decoded CPU images, never renderer-owned GPU textures. URL keys retain
 * Next image size/version parameters. Failed loads can retry on the next visit.
 */
const MAX_BYTES = 48 * 1024 * 1024;
const MAX_ENTRIES = 24;
const images = new Map<string, { image: HTMLImageElement; bytes: number }>();
const pending = new Map<string, Promise<HTMLImageElement>>();
let bytes = 0;

export function loadRecordImage(src: string): Promise<HTMLImageElement> {
  const cached = images.get(src);
  if (cached) {
    images.delete(src); images.set(src, cached);
    return Promise.resolve(cached.image);
  }
  const inflight = pending.get(src);
  if (inflight) return inflight;
  const task = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = async () => {
      try {
        await image.decode();
        const cost = image.naturalWidth * image.naturalHeight * 4;
        if (cost <= MAX_BYTES) {
          while (images.size && (bytes + cost > MAX_BYTES || images.size >= MAX_ENTRIES)) {
            const oldest = images.keys().next().value!;
            bytes -= images.get(oldest)!.bytes; images.delete(oldest);
          }
          images.set(src, { image, bytes: cost }); bytes += cost;
        }
        resolve(image);
      } catch (error) { reject(error); }
      finally { image.onload = null; image.onerror = null; }
    };
    image.onerror = () => {
      image.onload = null; image.onerror = null;
      reject(new Error(`Record image unavailable: ${src}`));
    };
    image.src = src;
  }).finally(() => { pending.delete(src); });
  pending.set(src, task);
  return task;
}
