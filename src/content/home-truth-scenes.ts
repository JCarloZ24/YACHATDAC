/** SCR-10, user direction 9 September 2026. Measured from Figma file
 * 7XBvi0Mdbtmym10nkF9IGp, Homepage Prototype. Years are supplied display labels;
 * paragraphs are resolved from the editable homepage Beat, never duplicated here.
 * Sky/light offsets are pixels within Figma's 6996/7619px image layers.
 */
/*
 * ⚑ `y` RE-MEASURED 15 September 2026, when the single path gave way to two
 * rails (see homeTruthArtwork below). The marker rides the TOP rail, Rail B
 * (user choice). Each year keeps the small offset its Figma anchor had from
 * the old path's dot centres (−2.2 to +2.7 px) and takes it onto Rail B's
 * dot centres at the same x, measured from home-truth-rails.ts's own layout.
 * Previous values, against the single path: 740, 771, 738, 769, 740, 769, 735.
 */
export const homeTruthScenes = [
  { year: "1861", node: "3371:45208", sky: 1800, light: 685, x: 220, y: 741 },
  { year: "1871", node: "3371:45418", sky: 2337, light: 961, x: 368, y: 707 },
  { year: "1881", node: "3371:45628", sky: 2543, light: 2187, x: 540, y: 740 },
  { year: "1891", node: "3371:45839", sky: 2817, light: 2459, x: 732, y: 706 },
  { year: "1896", node: "3371:46050", sky: 3273, light: 3479, x: 908, y: 738 },
  { year: "1902", node: "3371:46261", sky: 3948, light: 3864, x: 1084, y: 706 },
  { year: "2026", node: "3371:46472", sky: 4879, light: 4879, x: 1244, y: 734 },
] as const;

/**
 * ⚑ TWO RAILS, 15 September 2026, user direction. The single dotted path
 * (3371:45366, `truth-dotted-path.svg`, still on disk, unreferenced) is
 * replaced by the pair from Truth's "05 · TODAY" frame (2048:11158), drawn
 * dot by dot in the hero canvas by src/lib/motion/home-truth-rails.ts, which
 * holds their placement in that frame. Exact exports; both recoloured there,
 * in the shader, to the old path's off-white.
 */
export const homeTruthArtwork = {
  rails: [
    { src: "/media/home/derivatives/truth-rail-a.svg", node: "2048:12273" },
    { src: "/media/home/derivatives/truth-rail-b.svg", node: "2048:11629" },
  ],
  marker: "/media/home/derivatives/truth-year-marker.svg",
  origin: "Figma 2048:12273 and 2048:11629 (rails, 15 September 2026) and 3371:45367 (marker); exact exports, recoloured to canvas off-white at user direction, credit unconfirmed",
};
