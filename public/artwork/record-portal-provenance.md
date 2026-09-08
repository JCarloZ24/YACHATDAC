# The Record portal assets

*Last updated: 9 September 2026*

## Shallow carvings — procedural material

Origin: user direction on 9 September 2026, using three supplied wall images
as references for recessed grooves. Generated in `record-portal-carvings.ts`:
uneven downward arrow-like cuts, paired scratches and shallow bent grooves.
A runtime height texture supplies recessed shading and worn edges in the
Three.js wall material. These marks are generated interface decoration, not
traces of the supplied rock art, cultural records, or work attributed to any
supplied artist. The sandstone bitmap and central handprint aperture are unchanged.

## Handprint mask — handprint-impression.png

Origin: Image #5 supplied by the user on 8 September 2026, copied unchanged
from `orca-paste-1788869285908-267f89cd-eb0c-4a59-8fb3-6255345844f1.png`.
357 × 360 pixels. Used at the user's explicit direction: black areas are holes,
white areas remain stone. The separate finger pads, palm creases and white palm
centre are preserved. Creator not supplied; no attribution to Leonard Mickelo.
This is interface furniture, not a cultural record or a trace of supplied rock art.

## Red-ochre pigment — procedural material

Origin: user direction on 8 September 2026 to add red pigment around the
handprint, with `orca-paste-1788878631444-ce7413e0-435c-44a4-8b10-b421d554b347.png`
as the colour and weathering reference. Implemented in Three.js using the
existing oxide and roasted palette tokens, a field around the supplied ink
impression, and fixed grain variation. Pigment sits outside the impression;
the enclosed white palm centre and the holes retain their existing treatment.
The source mask and sandstone bitmap are unchanged. This is generated interface
decoration, not a cultural record or an artwork attributed to a supplied artist.

The latest user direction on 8 September 2026 adds other red-ochre hand stencils,
using `orca-paste-1788879602058-bccd7352-1650-4c52-a3c8-4a66073392f7.png` as a
placement and pigment reference. The interface footprints are transformed
and weathered in the wall material, with varied shapes, handedness and fading.
The latest correction on 8 September 2026 keeps every print upright (fingers
pointing up, 90 degrees to the horizon) and almost the same size as the central
hand: surrounding heights range from 4.0 to 4.2 against its 4.1 world units.
The already-upright reference sheet receives no added rotation.
These surrounding prints have no holes or extrusion; the central hand remains
the only aperture. No marks are traced from the supplied wall photograph.

A further placement correction on 8 September 2026 removes the impression
behind the lower-left heading and the middle-right impression, as indicated
in the user's two cropped screenshots. The remaining placements stay upright.

A further user refinement on 8 September 2026 broadens and strengthens the
pigment around every impression. The material uses large irregular deposits,
faded edges and mineral grain, following reference
`orca-paste-1788880179224-a940e946-56e6-4ee6-84e6-94487fd599fb.png`.

## Surrounding stencil masks — handprint-variations.png

Origin: the eight-print reference sheet supplied by the user on 8 September
2026, copied unchanged from
`orca-paste-1788880448960-b18ec2b2-84e6-48db-8b36-d8d2b3884090.png`.
615 × 350 pixels, four columns and two rows. Used at the user's explicit
direction to give the surrounding impressions different finger shapes,
palms and wear. A runtime canvas reads the eight cells into a single padded
pigment atlas; their larger internal gaps admit pigment onto solid stone.
The central aperture continues to use `handprint-impression.png` exclusively.
Creator not supplied; these are interface masks, not cultural records or
artwork attributed to Leonard Mickelo. No surrounding stencil cuts the wall.

## Sandstone material — record-sandstone.webp

Origin: generated with the built-in image-generation tool on 8 September 2026,
then encoded as WebP at the original 1536 × 1024 resolution. Generated source:
`exec-2fbc2b16-6ac4-4c97-95d3-ae02f61304ef.png`. The supplied wall references
informed the brief; none of their painted or engraved marks were reproduced.
Generic sandstone, not a photograph of a cultural heritage site. Generated
artwork authorised by the user on 8 September 2026; not attributed to a supplied
artist. Three.js renders the material, opening edges and camera perspective.

Final generation prompt (built-in mode):

> Create a photorealistic natural sandstone rock-face MATERIAL TEXTURE, landscape 3:2 composition, orthographic straight-on close view of a continuous dry weathered sandstone wall. Warm dusty terracotta, muted pink ochre, buff and pale tawny sandstone, realistic mineral pores and fine gritty grain, softly eroded rounded rock surfaces, a few irregular long shallow horizontal and diagonal fissures and thin sediment layers. Natural stone texture at human scale, not masonry blocks. Flat soft daylight, no strong cast shadows, no dark vignette, consistent exposure and detail across the entire image, edge-to-edge rock surface suitable for a 3D material with subtle bump. No people, no hands, NO HANDPRINTS, no painted marks, no stencils, no carvings, no symbols, no artwork, no logos, no words, no frame, no objects, no scenery, no recognisable place. This is a new generic geological texture for a fictional 3D website wall, not documentation of any actual cultural heritage site. High detail, photographic tactile sandstone, never cloudy plaster or concrete.
