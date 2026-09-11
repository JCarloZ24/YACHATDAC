/**
 * Truth — the hi-fi wireframe's photography, slot by slot.
 *
 * Same contract as src/content/lofi/media.ts: the bucket (and with it the
 * motion grade) travels with the asset, and a null src renders an honest
 * tonal field, never a faked photograph.
 *
 * Every slot now draws from the dedicated Truth batch (2026-09-02) — the
 * earlier living-work reuse for the Today era was replaced when its montage
 * frame landed. All people-at-work material is the open `work` bucket.
 *
 * Everything cultural (the shelter wall, the engravings) stays null until a
 * graded asset lands — cultural-site material renders at `frame` grade when
 * it does (Ivy, 2026-08-30).
 */

import type { MediaAlternate, MediaSlot } from "@/content/lofi/media";

const TRUTH = "/media/library/truth";

/**
 * ⚠ SWAP-IN OPTIONS — RECORDED AS MISSING, NOT AS NONE.
 *
 * The Truth motion brief states that six sections carry four documented image
 * alternates each, "all designed for the same slot dimensions and motion
 * behaviors, just different editorial tone". That list is not in this repo:
 * nothing in `docs/` mentions alternates, and every one of the 34 files in
 * `public/media/library/truth/` is already referenced below, so there are no
 * spare frames on disk either.
 *
 * Rather than invent filenames, the six slots that fit the description carry
 * an explicit empty `alternates` array. They are the page's six FULL-BLEED
 * frames — the hero, the two entry plates, the Country now break, the
 * escarpment and the closing shot — which are the only slots that share one
 * set of dimensions and one motion behaviour, which is what the brief says
 * the alternates were designed against.
 *
 * ⚠ That identification is INFERRED. If the real six turn out to be different
 * sections, move the arrays; do not quietly fill these in to match. Raised in
 * docs/open-questions.md.
 */
const AWAITING_ALTERNATES: readonly MediaAlternate[] = [];

/**
 * The hero — Country at dusk, trees against the last light. Batch delivered
 * 2026-09-02 (Downloads → public/media/library/truth). Country bucket: sky,
 * trees, grass — no cultural site, no people.
 */
export const truthHeroSlot: MediaSlot = {
  id: "truth-hero",
  bucket: "country",
  expects: "Country at dusk — the hi-fi hero frame",
  src: `${TRUTH}/truth-hero.webp`,
  tone: "charcoal",
  alternates: AWAITING_ALTERNATES,
};

/**
 * The Today entry plate — the hi-fi's 04 · ENTRY TODAY full-viewport frame
 * (1440×900 spec, 2026-09-02): a flame line working through timber, light
 * shafts in the smoke. The spec notes the earlier cut (1.40.3) served four
 * other pages; this is the dedicated fire-line frame. Work bucket — the burn
 * is the rangers' work, no cultural site in frame.
 */
export const truthTodayPlateSlot: MediaSlot = {
  id: "truth-today-plate",
  bucket: "work",
  expects:
    "A flame line working through timber, light shafts in the smoke — fire-stick farming",
  src: `${TRUTH}/truth-theworkgoingon.webp`,
  tone: "burnt",
  alternates: AWAITING_ALTERNATES,
};

/**
 * The 2026 entry plate (09 · ENTRY 2026, 1440×1044 spec, 2026-09-02): the
 * frame's 1.82.1 — standing before the escarpment at golden hour. The deed
 * entry's whole record (body, coda, source, CTA) sits on this plate under a
 * deepened scrim. Work bucket — a person on Country, not a cultural site.
 */
export const truthDeedPlateSlot: MediaSlot = {
  id: "truth-deed-plate",
  bucket: "work",
  expects: "Standing before the escarpment at golden hour — the deed of grant",
  src: `${TRUTH}/truth-boughtback.webp`,
  tone: "roasted",
  alternates: AWAITING_ALTERNATES,
};

/** Media strips keyed by TruthEntry id. Order within a strip is layout order. */
export const truthEntryMedia: Record<string, MediaSlot[]> = {
  /**
   * The hi-fi frame (1440×1078 SVG, 2026-09-02) dresses the precinct with
   * photographs, not the render: the elder at the seedling trays on the left,
   * the gathering ground at dusk on the right. The render slot returns when a
   * concept render actually exists — do not fake it (the batch rule).
   */
  precinct: [
    {
      id: "precinct-people",
      bucket: "work",
      expects: "The something worth building it for — an elder at the seedling trays",
      src: `${TRUTH}/truth-writtenrecord1.webp`,
      tone: "evergreen",
    },
    {
      id: "precinct-country",
      bucket: "country",
      expects: "The gathering ground the precinct will stand on, at dusk",
      src: `${TRUTH}/truth-writtenrecord2.webp`,
      tone: "roasted",
    },
  ],
  /**
   * The Today montage (05 · TODAY montage — GROUND, 2026-09-02): the era's
   * dedicated batch replaced the living-work reuse. Order is the frame's
   * layout order — lead, top right, small bottom-left, bottom right.
   */
  "today-fire": [
    {
      id: "today-grinding",
      bucket: "work",
      expects: "An elder grinding seed at the ute tray, dusk light",
      src: `${TRUTH}/truth-livingmemory1.webp`,
      tone: "roasted",
    },
    {
      id: "today-seedlings",
      bucket: "work",
      expects: "Checking seedling trays under the shade tunnel",
      src: `${TRUTH}/truth-livingmemory2.webp`,
      tone: "evergreen",
    },
    {
      id: "today-seed-hand",
      bucket: "work",
      expects: "A hand collecting seed in the grass, close",
      src: `${TRUTH}/truth-livingmemory3.webp`,
      tone: "eucalyptus",
    },
    {
      id: "today-picking",
      bucket: "work",
      expects: "Picking from the trees, bowl in hand",
      src: `${TRUTH}/truth-livingmemory4.webp`,
      tone: "evergreen",
    },
  ],
  /**
   * Research & discovery's six-up filmstrip (the 2022 frame, 2026-09-02):
   * the rd batch in delivery order — grinding bowl, seed pod, sap on bark,
   * canopy, flower on the stump, seedling tray. All open work/country
   * material, square crops.
   */
  "research-discovery": [1, 2, 3, 4, 5, 6].map((n) => ({
    id: `rd-${n}`,
    bucket: "work" as const,
    expects: "Research & discovery on Turraburra — the rd batch",
    src: `${TRUTH}/truth-rd${n}.webp`,
    tone: "evergreen" as const,
  })),
  /**
   * study-2022 carries NO media — the 06 frame (2026-09-02) is marked
   * ⛔ SILENT · typographic only: the story wall is withheld, and the beat
   * renders as copy alone. Do not re-add a strip here without the frame
   * changing first.
   */
  deed: [
    {
      id: "deed-signing",
      bucket: "work",
      expects:
        "Two people at a table on a timber deck, each at a laptop, a dog asleep beside them",
      src: null,
      tone: "roasted",
    },
  ],
  /**
   * The 2020 diptych (10 · ENTRY 2020 — GROUND · brown + DIPTYCH,
   * 2026-09-03): "the walk in, and the light on it". Two images, 60/40,
   * unequal heights, the right one dropped — deliberately unbalanced. The
   * frame's 1.74.1 and 1.42.1 are writtenrecord3 and writtenrecord4 in the
   * delivered batch. Work bucket — people on Country, no cultural site.
   */
  renamed: [
    {
      id: "renamed-walk-in",
      bucket: "work",
      expects: "The walk in — an elder coming down the rocky slope through the grass",
      src: `${TRUTH}/truth-writtenrecord3.webp`,
      tone: "roasted",
    },
    {
      id: "renamed-light",
      bucket: "work",
      expects: "The light on it — standing in the long grass among the trees at dusk",
      src: `${TRUTH}/truth-writtenrecord4.webp`,
      tone: "burnt",
    },
  ],
  /**
   * The 2019 diptych (11 · ENTRY 2019 — GROUND · brown + DIPTYCH · this beat
   * is private, 2026-09-03): "the drive in, and the listening". Same stage
   * as 2020. The frame's 1.1.2 and 1.77.5 are livingmemory5 and
   * livingmemory6 in the delivered batch. The listening frame is shot from
   * inside a rock overhang — graded cultural-site (frame): no depth drift,
   * the record holds.
   */
  "just-us": [
    {
      id: "just-us-drive-in",
      bucket: "work",
      expects: "The drive in — turned in the passenger seat, laughing, Country in the mirror",
      src: `${TRUTH}/truth-livingmemory5.webp`,
      tone: "charcoal",
    },
    {
      id: "just-us-listening",
      bucket: "cultural-site",
      expects: "The listening — from under the overhang, looking out over Country at dusk",
      src: `${TRUTH}/truth-livingmemory6.webp`,
      tone: "roasted",
    },
  ],
  /**
   * The 2003 portrait (12 · ENTRY 2003 — GROUND · brown + PORTRAIT,
   * 2026-09-03): the frame's 1.42.5 is livingmemory7 in the delivered batch —
   * the elder, head bowed, in black and white. Portrait 294×386 left, the
   * testimony right. Work bucket per the batch; the frame's "push in, slowest
   * on the page" rides [data-v2-portrait]. ⚠ The archive slot (photographs
   * and envelopes, story-wall) is superseded by the frame and dropped.
   */
  father: [
    {
      id: "father-portrait",
      bucket: "work",
      expects: "The elder, head bowed, hat on — black and white, the shade of the trees behind",
      /* HELD BLANK, client direction 11 September 2026. The delivered
         livingmemory7 is withdrawn and no replacement has been supplied, so
         the slot renders its honest tonal field rather than the wrong man:
         this is the one photograph on the page OF the person being spoken
         about. Restore a src here when the replacement arrives. */
      src: null,
      tone: "charcoal",
    },
  ],
  /**
   * The 1950s frame (13 · ENTRY 1950s — GROUND · brown, dimmed · the light is
   * going out, 2026-09-03): a visitor at the site — the frame's 378A7604 /
   * 1.80.1 is writtenrecord5 in the delivered batch, an elder in a hat under
   * the escarpment at dusk. Shot against the rock face, so graded
   * cultural-site (frame): the spec's own note is "dead still, no push".
   * The second slot is the DOCUMENT slot — the archival write-up wants a
   * scan, not a photograph, and stays null until one is supplied.
   */
  "art-gallery": [
    {
      id: "art-gallery-visitor",
      bucket: "cultural-site",
      expects: "A visitor at the site — an elder in a hat under the escarpment, looking out at dusk",
      src: `${TRUTH}/truth-writtenrecord5.webp`,
      tone: "roasted",
    },
    {
      id: "art-gallery-writeup",
      bucket: "story-wall",
      expects: "Document — archival 1950s write-up of the site",
      src: null,
      tone: "charcoal",
    },
  ],
  /**
   * 16 · ENTRY 1840s — GROUND · navy (2026-09-03): the Country he described
   * (the frame's 1.27.1 — writtenrecord6 in the delivered batch, trees over
   * the plain under a blue sky) at 920×320, then the DOCUMENT slot: a scan
   * of the journal page, NOT a photograph. Held — nothing has been
   * supplied yet, and the frame says so in the slot itself.
   */
  mitchell: [
    {
      id: "mitchell-country",
      bucket: "country",
      expects: "The Country he described — trees over the plain, blue sky",
      src: `${TRUTH}/truth-writtenrecord6.webp`,
      tone: "midnight",
    },
    {
      id: "mitchell-journal",
      bucket: "story-wall",
      expects: "Document — a scan of the journal page, not a photograph",
      src: null,
      tone: "midnight",
    },
  ],
  engraving: [
    {
      id: "engraving-wall",
      bucket: "cultural-site",
      expects: "Marra Wonga — the wall, at frame grade when it lands",
      src: null,
      tone: "midnight",
    },
  ],
  /**
   * 18 · CARD Still to be found — evidence strip B (P5): a different six
   * from the Research & discovery strip. Open work/country material,
   * square crops, deliberately unglamorous — this is evidence.
   */
  opportunities: [1, 2, 3, 4, 5, 6].map((n) => ({
    id: `open-research-${n}`,
    bucket: "work" as const,
    expects: "Open research on Turraburra — the openresearch batch",
    src: `${TRUTH}/truth-openresearch${n}.webp`,
    tone: "midnight" as const,
  })),
  /**
   * 19 · ABOUT 100 MILLION YEARS AGO — P7 strata stack: surface, tree line,
   * stone. The layout itself is a cross-section. The frame's 1.28.1, 1.76.2
   * and 1.91.1 are the theeromangasea batch in delivery order — the deepest
   * is the same escarpment seen at the top of the page, now as bedrock.
   * Country bucket: no people in any layer, no cultural site (R10).
   */
  seabed: [
    {
      id: "seabed-surface",
      bucket: "country",
      expects: "Stratum 1 · surface — the plain under sky",
      src: `${TRUTH}/truth-theeromangasea1.webp`,
      tone: "charcoal",
    },
    {
      id: "seabed-treeline",
      bucket: "country",
      expects: "Stratum 2 · the tree line at last light",
      src: `${TRUTH}/truth-theeromangasea2.webp`,
      tone: "charcoal",
    },
    /* STRATUM 3 WITHDRAWN, client direction 11 September 2026. The seabed
       now builds in two layers, not three. The stack renders whatever it is
       given, so nothing else moves; the motion module's third window simply
       has no layer to drive. */
  ],
};

/**
 * §15A · the portrait beside "Told by" on the count's opening screen.
 *
 * Supplied 11 September 2026 (client direction) against a slot that had stood
 * dashed since the band was built — her words were wired from the draft while
 * her photograph was a separate permission with no file behind it.
 *
 * HELD, not movable, whatever the bucket allows: the frame carries it
 * `data-v2-static`, because this is the person whose testimony the next two
 * screens are and the grammar's "a person speaking" row is no movement at all.
 *
 * ⚠ R5 IS UNCHANGED. What is settled here is the file, not the approval.
 */
export const truthCountPortrait: MediaSlot = {
  id: "count-portrait",
  bucket: "work",
  expects: "Suzanne Thompson, Iningai custodian",
  src: `${TRUTH}/truth-openresearch6.webp`,
  tone: "charcoal",
};

/**
 * The two full-bleed breaks, each a DISSOLVE PAIR. Country bucket only — see
 * truthBreaks in truth.ts (R10).
 *
 * §08's Figma note ("BREAK · Country Now — you never see the join", 2051:5464)
 * has always asked for two shots rather than one: "Two shots of the same
 * country, and you never see the join. The first shot holds full screen while
 * the page stops moving under you. As you keep scrolling, the second shot comes
 * up through the first until the first is gone."
 *
 * The delivered file has carried the words "the 08 break's shot B" since the
 * batch landed — it is the INCOMING half, and shot A was never supplied. So the
 * pair is declared here with `outgoing.src = null` and the mechanism is built
 * around it (user direction, 11 September 2026): an undelivered shot A simply
 * means the incoming photograph holds, which is what the page does today. Drop
 * a file in and the dissolve turns itself on.
 */
export const truthBreakMedia: Record<
  "countryNow" | "duskCountry",
  { outgoing: MediaSlot; incoming: MediaSlot }
> = {
  countryNow: {
    outgoing: {
      id: "break-country-now-a",
      bucket: "country",
      expects:
        "Shot A — the same Country as shot B, held first while the page stops. Not yet delivered.",
      src: null,
      tone: "roasted",
    },
    incoming: {
      /* The section id the rail knows. It stays on the INCOMING slot because
         that is the photograph the break resolves to — and because
         truthBreaks.countryNow.id, railHiddenSlides and the anchor all name it. */
      id: "break-country-now",
      bucket: "country",
      expects: "Sunset over the plains from the outcrop — the 08 break's shot B. No caption.",
      src: `${TRUTH}/truth-break1.webp`,
      tone: "roasted",
      alternates: AWAITING_ALTERNATES,
    },
  },
  duskCountry: {
    outgoing: {
      id: "break-dusk-a",
      bucket: "country",
      expects: "Open Country at dusk — shot A. Not yet delivered.",
      src: null,
      tone: "charcoal",
    },
    incoming: {
      id: "break-dusk",
      bucket: "country",
      expects: "Open Country at dusk. No people, no caption, edge to edge.",
      src: null,
      tone: "charcoal",
    },
  },
};

/**
 * 14 · BREAK The Escarpment — DISSOLVE PAIR (2026-09-03): "held, pull back,
 * no people". Shot A (the frame's 1.85.1, bare tree against a grey sky) is
 * truth-thecount in the delivered batch and dissolves out over the scroll;
 * shot B (1.87.1, dead trees on white sand) is NOT in the batch — every
 * Truth photograph is accounted for — so it renders as the tonal field
 * until it lands, and A holds rather than dissolving into nothing.
 * Country bucket, both: no people, no cultural site (R10).
 *
 * ⚠ NOT RENDERED ANYWHERE AS OF 11 SEPTEMBER 2026. The client withdrew the
 * escarpment break's photographs, so §14 is now charcoal ground and a wave and
 * this pair has no consumer. Kept rather than deleted because both slots and
 * their reasoning are still the record of what that break was specified to be
 * — and because `truth-thecount.webp` is still in the library, unreferenced,
 * if it is ever wanted elsewhere. Do not read this as live.
 */
export const truthDissolveMedia: { outgoing: MediaSlot; incoming: MediaSlot } = {
  outgoing: {
    id: "dissolve-bare-tree",
    bucket: "country",
    expects: "Bare tree against a grey dusk sky — shot A, outgoing",
    src: `${TRUTH}/truth-thecount.webp`,
    tone: "charcoal",
    alternates: AWAITING_ALTERNATES,
  },
  incoming: {
    id: "dissolve-white-sand",
    bucket: "country",
    expects: "Dead trees on white sand — shot B, incoming (1.87.1, not yet delivered)",
    src: null,
    tone: "charcoal",
  },
};

/**
 * 20 · UNDERNEATH ALL OF IT — DISSOLVE PAIR: the descent ends, looking up.
 * Shot A (the frame's 1.3.1, dusk plains — truth-wattanurisisters in the
 * batch) dissolves 1 → 0 over the band's travel; shot B beneath it is 1.1.1,
 * the opening shot returning — the same frame the hero holds. Country
 * bucket, both: sky, trees, grass — no people, no cultural site (R10).
 */
export const truthWattanuriMedia: { outgoing: MediaSlot; incoming: MediaSlot } = {
  outgoing: {
    id: "wattanuri-dusk-plains",
    bucket: "country",
    expects: "Dusk plains under a clouded sky — shot A, outgoing",
    src: `${TRUTH}/truth-wattanurisisters.webp`,
    tone: "charcoal",
    alternates: AWAITING_ALTERNATES,
  },
  incoming: {
    id: "wattanuri-opening-shot",
    bucket: "country",
    expects: "The opening shot returning — Country at dusk, shot B",
    src: truthHeroSlot.src,
    tone: "charcoal",
  },
};
