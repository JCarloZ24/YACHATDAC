/**
 * /homepagev2 fork, 10 September 2026, user direction.
 *
 * A copy of the HOME_* entries of src/content/kit.ts, owned by /homepagev2 alone. The two
 * pages share NOTHING but the framework and the site chrome: edit this
 * freely and the live homepage is untouched, and vice versa.
 *
 * The cost of that is the usual one -- a fix made on one page does not
 * reach the other. Whichever page wins, delete the loser rather than
 * leaving both; `src/components/lofi` and `src/components/v2` are the
 * standing record of what two divergent copies turn into.
 */

/* Only the three the canvas reads. The rest of the manifest -- artwork,
   photography, credits -- stays shared: it is a record of what exists and
   who it belongs to, not a design decision, and forking it would mean two
   places to record a permission. */

/**
 * Homepage loader, user reference 8 September 2026; reused by The Record's
 * readiness loader at user direction on 9 September 2026. Origin: existing supplied
 * vectors, dots-wave (2051:3365) gold instance and ring-b (2051:4024).
 * F8 artwork-motion permission: reveal the wave, hold the ring. No new artwork.
 */
export const HOME_LOADER_ARTWORK = {
  wave: "/artwork/dots-wave-gold.svg",
  ring: "/artwork/ring-b.svg",
};

/** User-supplied replacement, 9 September 2026; same-canvas reveal.
 * Origin: public/media/home/painting.png. Authorship/production method unconfirmed;
 * do not attribute this replacement to the artist of the earlier photograph.
 * User requested the SVG source: it embeds the PNG rather than vector paths.
 * No cropping, sharpening or resizing of the source. */
export const HOME_PAINTING = {
  src: "/artwork/paintings/red-radial-painting.svg",
  origin: "User-supplied public/media/home/painting.svg (embedded painting.png); renamed without changes",
  width: 1656, height: 950,
  credit: "Artist unconfirmed",
};

/** 9 September 2026: exact Figma woodland road throughout the portal.
 * Original layers retained; credit/production method unconfirmed.
 * AMB-05: user permits local vegetation wind on this landscape only.
 *
 * ⚑ FULL-HEIGHT FOREGROUND, 9 September 2026, user direction. The Figma
 * source at 3371:41347 is 1440×1500. The previous derivative kept only its
 * top 1440×900, which is why every attempt to reach the near road landed on
 * treeline instead: the ground was not in the file. The whole photograph is
 * now carried — 600 more rows of real near road, ending in the speckled
 * charcoal dissolve the homepage frame shows above The Invitation. 350 KB
 * against the old crop's 328 KB, so R11's above-fold budget is unaffected.
 *
 * This SUPERSEDES the `extend` outpaint strip that stood here (a screen
 * capture, cropped and colour-corrected by a measured per-channel gain to
 * meet the photograph's bottom edge). None of it was wired into the canvas
 * yet, and it is no longer needed: the real pixels exist, so nothing has to
 * be generated or colour-matched to a join that no longer occurs.
 * public/media/home/derivatives/red-earth-track.webp is now unreferenced.
 *
 * `legacyHeight` is that old 900px crop. Every threshold in home-painting.ts
 * — treeline, canopy, the sky bands, and the Truth sequence offsets that
 * multiply by a literal 900 — was calibrated against it, so the shader remaps
 * into that space rather than being re-tuned beat by beat. Do not change
 * either number without reading the legacyY note in that file. */
export const HOME_PORTAL = {
  src: "/media/home/derivatives/woodland-road-full.webp",
  sky: "/media/home/derivatives/road-sky.webp",
  truthSky: "/media/home/derivatives/truth-sky-sequence.webp",
  truthLight: "/media/home/derivatives/truth-light-sequence.webp",
  width: 1440, height: 1500, legacyHeight: 900,
  grade: "full",
  credit: "Unconfirmed",
  origin: "Figma 7XBvi0Mdbtmym10nkF9IGp, background 3371:41346 and foreground 3371:41347; foreground re-extracted at its full 1440×1500 on 9 September 2026",
};
