/** Our People image delivery, 11 September 2026 — user sharpness refinement.
 * F8 / R11 / P4. These are larger exports of the same three supplied photos;
 * their subjects, placeholders and permissions remain those recorded in kit.
 * Origin: YACHATDAC-V2, original image fills at the Figma nodes below.
 * Credit: photographer unconfirmed; no new identity or clearance is implied.
 * Original PNGs live in brand/photography/our-people-originals (gitignored).
 * WebP derivatives retain the whole frame, with no enlargement or retouching.
 */
import { photoById } from "./kit";

function largerPhoto(id: string, filename: string, height: number) {
  const photo = photoById(id);
  return photo ? { ...photo, src: `/media/library/our-people/${filename}-3840.webp`, width: 3840, height } : undefined;
}

export const ourPeopleMedia = {
  // Origin: batch 3, crew-walking-burnt, Figma 2756:34638 (4096 × 3072).
  hero: largerPhoto("op-hero", "crew-walking-burnt", 2880),
  // Origin: batch 3, country-wide-track, Figma 2756:34656 (4096 × 3072).
  breathTeam: largerPhoto("op-breath-01", "country-wide-track", 2880),
  // Origin: batch 3, burn-pano-sunset, Figma 2756:34618 (4096 × 906).
  breathPivot: largerPhoto("op-breath-02", "burn-pano-sunset", 849),
  // The ordinary HTML fallback keeps the small existing title background.
  // The canvas title reuses the larger hero texture without another request.
  titleFallback: photoById("op-hero")?.src,
};
