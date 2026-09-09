# Red painting — homepage canvas

*Last updated: 9 September 2026*

Origin: `brand/artwork/paintings/painting-03-red.jpg`, supplied photograph of an
original work. Artist attribution remains unconfirmed; see
`brand/photo-notes/paintings.md`. F8 permits artwork masking and reveal.

`painting-03-red-crop.webp` is a 1130 × 800 crop at left 180, top 145, encoded
with Sharp as lossless WebP (9 September exact-match refinement). This preserves
the decoded source pixels without another lossy encode and excludes the binding and photographed
surroundings. No resizing, tracing, recolouring, generation or upscaling.

The homepage uses the existing Three.js canvas to reveal original white/gold
pixels outward from the central rosette as the red ground appears. The original
painted ground follows, leaving the complete cropped photograph at the end.

9 September sharpness refinement: a bounded luminance sharpening filter runs
in the canvas shader at display time. It emphasises existing edges without
editing the lossless source texture or generating additional image detail.
