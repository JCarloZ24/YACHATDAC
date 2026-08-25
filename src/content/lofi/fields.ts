/**
 * Content fields that stand in for facts which are not settled.
 *
 * These render as visible tokens on the page. That is deliberate: a visible
 * placeholder cannot ship by accident, and it keeps an unresolved question in
 * front of whoever is reading the page instead of burying it in a tracker.
 */

/**
 * Age of the story wall engravings. **Never write a literal number here.**
 *
 * Risk R2: the homepage and Wonder drafts say "at least 55,000 years old"; the
 * Truth timeline says "at least 5,000 years ago" and carries its own
 * "dating under review" note. A factor of ten apart, in a public claim about
 * cultural heritage, on a site whose argument is that the record has been got
 * wrong before.
 *
 * One sourced number, used everywhere — the 2022 Marra Wonga study is the
 * obvious source. Until that lands, this token appears in all three places the
 * dating is referenced: the homepage Truth beat, Wonder's Escarpment card, and
 * the Truth timeline's engraving entry.
 */
export const STORY_WALL_DATING = "{ story-wall-dating }";
