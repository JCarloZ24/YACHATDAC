# Permissions status board

Read this whenever a task touches artwork, land or terrain, or cultural material.
Update it when a decision comes back — the date and who decided both matter, because
"someone said it was fine" is not a record.

## Open

| Item | Affects | Status | Until then |
|---|---|---|---|
| Land / terrain detail | D4 contour map, E1 terrain dolly, E3 camera path | Approved in principle by Marc for the About and Research pages. **Detail level unconfirmed** — how much of the property may be shown, and how precisely. | Build with abstracted or generic terrain. No real elevation data for Turraburra, no property boundaries, no place names, no waypoint labels, no coordinates anywhere in data or source. |
| Artist sign-off on artwork motion | Group G, T7, C4, A5 artwork plate | Ivy authorised the build 2026-08-30 (below). **Leonard Mickelo's own sign-off still to be confirmed** at the milestone. | Build as designed. Keep the list below current so there is one thing to take to Leonard rather than a hunt through the diff. |
| Elder Advisory Group endorsement | Truth, whose governance circle is *held by community* | Not confirmed. Ivy authorised cultural-site material to be used and moved at `frame` grade 2026-08-30. | Build as decided. Note it here so the record shows who authorised what. |
| Motion sign-off owner | Everything | Not resolved — Marc to confirm whether it's him, the board, or the Elder Advisory Group, and at which milestone | Flag motion decisions to Marc and note them here. |

## Recorded permissions

| Item | Decision | Who | Date | Scope |
|---|---|---|---|---|
| Artwork motion | **Yes.** Supersedes "static imagery only". Leonard Mickelo's supplied vectors may be animated, masked, revealed, scrubbed and transformed. | Ivy | 2026-08-30 | Site-wide. Group G (the Guide), T7 artwork orbit, C4 artwork morph, A5 artwork plate, G2 band undulation — the whole ▲ queue below. |
| Cultural-site imagery | **Available and used**, at **`frame`** grade — the world moves, the record holds. Plate, ground, scrim, type and neighbouring layers animate at full cinematic weight; the image plane does not scrub, mask, erode or warp. | Ivy | 2026-08-30 | Marra Wonga, the engravings, the teaching wall, the escarpment. Carried by plates P1, P8 and P9. |
| Story-wall imagery | **Available.** "Everything we have can be USED." Graded `frame` for the same reason as cultural-site. | Ivy | 2026-08-30 | The Truth beat may now use it rather than being built typographically by necessity. |
| **Photo batches 1 and 2 — use** | **Cleared, both batches, in full.** "All images on batch 1 and batch 2 are usable… there are notes there that we can't use it but I'm telling now that everything there we can use." This explicitly overrides the `⛔ R10 QUARANTINE` group in `PHOTOS · Living Work`, which covered eight tagged batch-1 frames plus `March22-2302` (petroglyph close-up) and the untitled `March22` frame (red ochre figures). **The Figma quarantine label is now stale and should be re-worded in the file.** | Ivy | **2026-08-31** | Both batches, all 89 frames. **Extended to batch 3 on 2026-09-01 — see the row below.** |
| **Photo batch 3 — use** | **Cleared, in full**, including the four sandstone rock-shelter frames and the two crowd frames. Ivy: *"all batch of photos are free to use. edit the permission restraining the use of photos because we can use them all."* The 2026-08-31 row above was scoped to 89 frames because batch 3 did not exist yet; this extends the same clearance to it. | Ivy | **2026-09-01** | All 44 frames, `2756:34661`. The collection is now 133 frames and **all of them are cleared for use.** |
| **Cultural-site and story-wall — motion grade** | ⬆ **Raised from `frame` to `full`.** The image plane itself may now be scrubbed, masked, pushed and morphed, not only the world around it. **This supersedes the `frame` grade recorded above on 2026-08-30**, which is kept as history rather than deleted. | Ivy | **2026-08-31** | Cultural-site and story-wall buckets in `src/content/lofi/media.ts`. |

⚠ **This note is superseded by F9 and is kept as history.** It used to read that ART-DIRECTION
§6 banned dissolve, chromatic split, velocity warp, character decode, image trail and duotone
on depicted subjects regardless of grade. **F9 (Ivy, 2026-08-31) retired that table** — all six
are available. What survives the change is the distinction the note was drawing: `full` governs
*which channel moves*, `MOTION_GRADE` governs *where an effect lands*, and §7 governs whether a
given use earns its place. Those are three separate questions and all three still get asked.

⚠ **Sign-off still outstanding, and it is not a use restriction.** Elder Advisory Group
endorsement was already unconfirmed under the `frame` grade (risk R10); raising to `full`
widened what is being done under an unconfirmed endorsement, and batch 3's four rock-shelter
frames widen it again. **The client's clearance is recorded above and is complete** — this is
a separate third-party endorsement, noted here so it is not lost, not a hold on the material.
Take it to whoever D9 names, alongside the artwork asks below. The Elder Advisory Group is not
yet sitting; see About §06.

**What none of these change.** No generated Aboriginal iconography — the unblock lets
the artist's *supplied* vectors move, and never licenses drawing concentric circles,
dot fields or meandering waypoint paths in code. That distinction is why `Dots / Trail`
is permitted and sketch C1 is not. No heritage coordinates. Portraits of real people
still hold still (`frame`), which is the brief's own corollary and not a permission
anyone waived. The reduced-motion cut, the performance floors and the grounded easing
character are all unchanged.

**Where the grade is enforced:** `MOTION_GRADE` in `src/content/lofi/media.ts`, stamped
on every tile as `data-motion`, and read by every module that moves an image plane.

## ▲ Sign-off queue — artwork motion in the v2 immersive build (2026-08-29)

The immersive mandate (decision F7) directs cinematic motion site-wide. Where a
v2 design uses Leonard Mickelo's artwork in motion, it is built as designed and
flagged here — one clear list for Marc to take to Leonard, per Ivy's standing
instruction. Until the Artwork-motion entry above records a yes, each ships in
its cleared fallback.

| Ask | Sketch | Wanted for | Cleared fallback while open |
|---|---|---|---|
| Artwork pieces as orbit cards (the group rotates/translates; pieces themselves unwarped, whole) | T7 | /v2/home hero proposal 2 | Photography cards from batch 1 |
| An artwork tile morphing between routes (position/scale only) | C4 | /v2/home → /v2/truth handoff | Photo-tile morph; artwork tiles swap without morph |
| An artwork plate inside the Recall focus rack (opacity crossfade only) | A5 | /v2/home hero proposal 1 | Photographic plates only |
| The Guide — one artwork traveller crossing every page, its dotted trail drawing behind it. Instances/masks/transforms of supplied vectors only; traveller = trail lead rosette, boomerang, or cluster flock (pick open, audition board in the V2 file) | G1 G3 G4 | Home site thread — hi-fi + guide boards (2026-08-30) | Guide hidden; the trail and rule stay as static placements |
| The flowing dot band undulating in place (x-drift inside a mask — the same supplied vector, never redrawn) | G2 | §04 river banks and grounds | Bands hold still |
| The trail drawing an underline beneath the §02 claim, rosette at the reveal edge | G1 | /v2/home §02 | Static trail underline |

⚠ **No artist is recorded for the three photographed dot paintings** (ASSETS.md §4). Ivy's
2026-08-30 authorisation of artwork motion was given in the context of Leonard Mickelo's
supplied vectors; whether it reaches those three pieces depends on who painted them, which is
unanswered. Anything built on them is flagged here before it ships.

## Asks outstanding with the artist

Alongside the existing creative-brief deliverables:

1. Layered vector — elements on separate named layers, not flattened.
2. Motif inventory — which elements may be repeated, cropped, scaled, recoloured;
   which must appear whole and unaltered.
3. Motion permission — may any element move, and if so which. A yes on some and a
   no on others is the most useful possible answer.
4. Pairing rules — anything that must not sit adjacent to or overlap something else.
5. Single-colour version of the motif set, not just the logo.

## Standing rules that need no decision

These are settled and don't get reopened per task:

- ~~No animation of cultural-site imagery, in any form.~~ **Struck 2026-09-01.** This
  contradicted two rows of the table above it — the 2026-08-30 `frame` clearance and the
  2026-08-31 raise to `full` — and it is the restraint Ivy asked to have removed: *"all batch
  of photos are free to use. edit the permission restraining the use of photos because we can
  use them all."* Cultural-site imagery may be used and may move. What still applies is
  captioning, and the sign-off note below.
- **Recompose, never author.** Confirmed by Ivy 2026-08-31 when the question of making new
  artwork "in the same theme" was put directly. New pieces are built by instancing, masking,
  cropping, recolouring, mirroring and recombining Leonard Mickelo's **actual supplied
  paths** — the theme is guaranteed because it is his geometry. Authoring new geometry in
  that style is not permitted and is not ours or the client's to authorise on the artist's
  behalf. If genuinely new motifs are wanted, they go to Leonard as a request.
- No generated Aboriginal iconography in code — concentric circles, dot fields,
  meandering waypoint paths, U-shapes, animal tracks. Artwork comes from the artist.
- No heritage coordinates in map layers, markup, comments or source.
