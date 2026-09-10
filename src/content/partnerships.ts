/**
 * /partnerships — the copy the FRAME governs.
 *
 * ⚑ WHY THIS FILE EXISTS AT ALL, and why it did not until 10 September 2026.
 *
 * Every other route in `src/content/` names a draft as its source of truth,
 * because D5 says drafts govern copy. This page has no draft and never had
 * one: it exists because D22 made `/partnerships` a destination when four live
 * links already pointed at it, so it got a route before it got any words. Every
 * string on it was therefore BORROWED from a page that does have a draft —
 * About, Living Work, The Record, Truth — and the section modules still import
 * most of them.
 *
 * On 10 September 2026 August directed that the page "follow the content on
 * wireframe". That settles a question that had been open since the build: with
 * no draft to govern this route, the HI-FI FRAME IS ITS SOURCE OF TRUTH. This
 * file is where that source lives, because CLAUDE.md is explicit — where a
 * frame carries copy a draft does not, it goes in the content module with a
 * hi-fi flag rather than being typed into markup.
 *
 * ⚠ NOTHING HERE MAY BE PUSHED BACK INTO THE SHARED MODULES. The strings below
 * REPLACE imported ones at the point of render only. `knowledgeGaps.title` is
 * still "What we do not know" in `the-record.ts`, and it must stay that way:
 * The Record has a draft (Resources v1) that governs it, and editing a shared
 * module to satisfy this page's frame would silently rewrite a page whose copy
 * is properly sourced. Local override, never upstream edit.
 *
 * ⚠ AND §04 IS STILL AN INVERSION. The Record §03 states the same four
 * questions as ABSENCE — "What we do not know". Here the frame titles them
 * "Four open questions" and puts them as an OFFER. The two pages now differ in
 * their words as well as their treatment, which is the argument the section was
 * built on rather than a drift away from it.
 *
 * D12 applies: these are CMS-editable at launch. Nothing may assume they are
 * compile-time constants.
 */

/** Where a string here came from, so a reviewer can tell at a glance. */
export type CopySource =
  /** Read off the hi-fi frame. No draft carries it. */
  | "frame"
  /** In the frame AND in a draft, agreeing. The safest kind. */
  | "frame+draft";

export const partnershipsHiFi = {
  /**
   * §03. The three disciplines are LOWERCASE, and that is not a slip.
   *
   * Truth v3 (`drafts/truth/YACHATDAC-Truth-Copy-v3.md:310`) carries them
   * inside a running sentence — "…looking for researchers in palaeontology and
   * archaeology, ecology and biodiversity, and medicinal botany" — and the
   * frame sets that same sentence's tail as three rows, still lowercase. The
   * build had title-cased them, which is the one reading BOTH sources
   * disagree with. Frame and draft agree here, so this is the settled kind.
   */
  disciplines: {
    source: "frame+draft" as CopySource,
    items: [
      "palaeontology and archaeology",
      "ecology and biodiversity",
      "medicinal botany",
    ],
  },

  /**
   * §04's eyebrow and title, replacing `knowledgeGaps.title`.
   *
   * "Four open questions" is corroborated inside this repo twice over: it is
   * already the label on the hero's own quiet link to this section, and the
   * accessible name on the card rail. The frame, the cross-link and the rail
   * label all said it; only the heading did not.
   */
  openQuestions: {
    source: "frame" as CopySource,
    eyebrow: "Open research",
    title: "Four open questions",
    /**
     * Shorter than `knowledgeGaps.lede`, which reads "Most of this Country has
     * never been studied. These are the gaps we would like filled, and the
     * reason we keep the record in the first place."
     *
     * The Record needs that tail — the gaps are its argument for keeping a
     * record at all. This page is making an offer to a researcher, so the
     * frame drops both the preamble and the record clause and states the
     * gaps plainly. The four words that survive are the draft's own.
     */
    lede: "These are the gaps we would like filled.",
  },

  /**
   * §03's photo caption.
   *
   * The build had "Working a pestle in a stone mortar — the only research
   * frame in the collection." The second clause is an asset-log fact about
   * OUR collection, not about the picture, and it is the same thing the
   * stand-in badges were removed for on 9 and 10 September: a visitor should
   * not be reading our production notes. The frame describes what is in the
   * photograph.
   *
   * ⚠ THE CONSENT QUESTION IS UNAFFECTED. `pt-research` still shows an
   * identifiable face with use cleared and identification never asked (R24),
   * and that is still recorded in kit.ts against the entry. Removing the
   * caption's editorialising does not answer it.
   */
  researchCaption: {
    source: "frame" as CopySource,
    text: "A bench and jars. Science on Country.",
  },

  /** §05's eyebrow. The build had "Already here". */
  partners: { source: "frame" as CopySource, eyebrow: "Partners" },

  /**
   * §07's eyebrow. The build had "How work is agreed".
   *
   * ⚠ IT REPEATS THE BADGE INSIDE THE DASHED BOX, and the frame draws it that
   * way deliberately — the eyebrow names the state of the whole section, the
   * badge marks the container that never fills. Left as the frame has it. If a
   * reviewer reads the repetition as an error, that is a change request, not a
   * thing to quietly de-duplicate.
   */
  protocol: {
    source: "frame" as CopySource,
    eyebrow: "In preparation",
    /**
     * The dashed container's note, and the third of the three strings I could
     * not read off the full-page wireframe on 10 September — the section
     * capture at 100% resolves it.
     *
     * The build had assembled its own version ("No page anywhere explains how
     * research here is agreed…") which ended by splicing in
     * `onRequest.pending` from The Record. That sentence was never sourced
     * from anywhere; it was written in the markup, which is the one thing this
     * page's own header says not to do. The frame's note is used instead, and
     * its layer name calls it "the honest note, verbatim".
     *
     * ⚠ IT NAMES THE RECORD ON PURPOSE. The note's argument is that this page
     * and that document are the same piece of unwritten work, so the
     * cross-reference is the content, not a stray internal detail to tidy out.
     */
    note:
      "Everything a partnerships page would normally carry — what a " +
      "partnership involves, what is expected of a partner, the research " +
      "protocol, who to approach and how — is unwritten. The protocol is " +
      "already listed as “in preparation” in The Record, so this " +
      "page and that document want writing together.",
  },
} as const;
