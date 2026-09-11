# The Record article revisions

*Last updated: 11 September 2026*

The user requested all revisions in this folder, including the linked images,
on 11 September 2026. The eleven source PDFs remain unchanged. Their text is
transcribed into `docs/content/drafts/the-record/articles/` and implemented in
`src/content/record-articles.ts` (D5/F8). Catalogue titles and summaries follow
the revised titles and standfirsts. No new routes are introduced.

## Applied

- All eleven article bodies, including headings, emphasis, law passages,
  testimony, acknowledgements and supplied source notes.
- PDF page wraps joined into continuous paragraphs; recorded words and the
  buyback's bracketed name queries preserved.
- Existing CR3/D17 terminology applied to the fire article's title and
  narration, retaining its current route and redirect. CR4 changes George
  Porter to “colonist”; Mitchell narration uses “Country”.
- Wattanuri's revised title “Wattanuri, and the ones he followed.” now matches
  its existing route. Other supplied title punctuation is retained.
- Five photographs downloaded from the supplied Drive links, converted into
  metadata-free WebP at a maximum 2000 px without cropping or upscaling.
  Masters are unchanged in ignored `brand/photography/record-revisions/`.
- Buyback and markings catalogue thumbnails follow the supplied photographs;
  article figures appear where specified, including the repeated close-up.
- The deed image retains the supplied caption: “Signing the deed of grant,
  12:15pm, Friday 26 June 2026.”

Asset origins, actual visual descriptions, permissions and dimensions are in
`src/content/record-media.ts` and `brand/photo-notes/record-revisions.md`.

## Outstanding source details

- The footprint image, Drive ID `1QZe4o4Sm-_mFT5_otZDn6jZnzOcmRwOV`, redirects
  to Google sign-in. An explicit image placeholder occupies its supplied position.
  Access or a local copy was requested during implementation.
- The link labelled “a mud wasp nest built over part of an engraving” actually
  supplies a red hand-stencil photograph. The supplied image is used with
  accurate alt text; no nest caption is invented.
- Gracevale's supplied renaming paragraph calls Turraburra the name written
  on the 1884 map, whereas the earlier paragraph and terminology sheet specify
  Terraburra as the clan name. Both supplied spellings remain, with this drift
  recorded for the copy review.
- `[Cheryl?]`, `[Ed Wood?]`, `[Steve?]` and `[Trish?]` remain unconfirmed in
  the buyback article.
- Claims and references remain those supplied by the author. This import does
  not assert independent scientific verification or cultural approval. Sources
  with no URL remain text; the supplied DOI is linked.

There are no supplied bodies for “A day with the Rangers”, “When they called
it The Art Gallery”, or “The Cultural Knowledge Precinct”; these existing
routes retain explicit stubs. The hub's reports/downloads are a separate set.

## Verification — 11 September 2026

`npm run typecheck`, `npm run lint`, `npm run check:type` and `npm run build`
passed. All eleven supplied article routes returned HTTP 200 with full bodies.
A token comparison against each PDF found only the documented terminology
changes, casing and conversion of image directions into figures. Quotations
were retained. Desktop (1440 px) and mobile (375 px) image/layout checks passed;
all five available images decoded and the mobile article had no horizontal
overflow. Web derivatives were checked for absent EXIF metadata.

## Buyback opening — screenshot amendment, 11 September 2026

The user requested the grass-photo treatment shown in their first screenshot
at the article opening shown in their second. The buyback article now uses
the original `therecord-story1.webp` behind an evergreen media scrim, with a
gold Story badge, source label, title, revised standfirst, subject label and
the existing gold dot-cluster artwork. The image and text remain still.
The deed-signing photograph remains in the body and catalogue card. The
revised PDF wording continues to govern copy; the screenshot governs this
opening's layout and treatment (D5/F8).

## All article openings — follow-up, 11 September 2026

The user extended this treatment to every article, requesting equal heights,
individual images and the catalogue's different colours. All 14 existing
article routes now use the same opening: 720 px at the 1440 desktop viewport
and 800 px at the 375 mobile viewport, verified with the supplied copy. These
are minimum heights so future CMS copy and enlarged text can grow safely.

Each article uses its own assigned catalogue photograph; buyback retains the
explicitly requested grass image. Iningai knowledge uses Evergreen, Colonial
record uses Roasted Brown, and Published research uses Midnight Navy. Missing
photographs remain matching tonal fields, including Pollen and Mitchell.
The Cultural Knowledge Precinct stub uses the shared layout on Evergreen.
All 28 desktop/mobile route checks returned the expected height and no
horizontal overflow. No narrative copy or catalogue layout changed.

**Height reduction, 11 September 2026:** the user requested shorter openings.
The shared minimum is now 560 px on desktop and 640 px on mobile, reduced
from 720/800 px. Vertical spacing and the corner cluster are tighter, while
type sizes, assigned images and source colours remain unchanged. Longer
content and enlarged text can still grow the opening without clipping.

**Navigation fade, 11 September 2026:** catalogue links now fade through a
loading state until the article and its hero image are ready, replacing the
circular reveal. Hero images also fade in on direct visits. Failed or absent
images release to the source-colour field; loading has an eight-second ceiling.
The existing “Loading the record” interface label is reused. Motion is recorded
as NAV-06 in the motion grammar and scene ledger.

Verified at 1440 and 375: a delayed image holds the cover until decoded, failed
and absent images release it, keyboard navigation works with reduced motion,
and browser Back leaves no cover. No circular View Transition is invoked.
Build, typecheck, lint and typography checks passed.
