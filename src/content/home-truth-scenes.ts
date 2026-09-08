/** SCR-10, user direction 9 September 2026. Measured from Figma file
 * 7XBvi0Mdbtmym10nkF9IGp, Homepage Prototype. Years are supplied display labels;
 * paragraphs are resolved from the editable homepage Beat, never duplicated here.
 * Sky/light offsets are pixels within Figma's 6996/7619px image layers.
 */
export const homeTruthScenes = [
  { year: "1861", node: "3371:45208", sky: 1800, light: 685, x: 220, y: 740 },
  { year: "1871", node: "3371:45418", sky: 2337, light: 961, x: 368, y: 771 },
  { year: "1881", node: "3371:45628", sky: 2543, light: 2187, x: 540, y: 738 },
  { year: "1891", node: "3371:45839", sky: 2817, light: 2459, x: 732, y: 769 },
  { year: "1896", node: "3371:46050", sky: 3273, light: 3479, x: 908, y: 740 },
  { year: "1902", node: "3371:46261", sky: 3948, light: 3864, x: 1084, y: 769 },
  { year: "2026", node: "3371:46472", sky: 4879, light: 4879, x: 1244, y: 735 },
] as const;

export const homeTruthArtwork = {
  path: "/media/home/derivatives/truth-dotted-path.svg",
  marker: "/media/home/derivatives/truth-year-marker.svg",
  origin: "Figma 3371:45366 and 3371:45367; exact exports, credit unconfirmed",
};
