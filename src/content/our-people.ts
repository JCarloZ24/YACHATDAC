/**
 * Our People.
 *
 * Source of truth: docs/content/drafts/our-people/YACHATDAC-OurPeople-Copy-v1.md
 * (D5). First draft of this page; the old page-specs file had no entry for it.
 *
 * ⚠ Governance circle: **shared with care**. Blocked on names, roles,
 * photographs and — the part that is not a content gap — **consent to be
 * named**. Rangers are the heart of Living Work and are unnamed across the
 * whole site. Nobody goes on this page because it would look better with more
 * faces on it.
 *
 * ⚠ CULTURAL ADVICE. The draft opens with a warning that this page contains
 * images and names of people who have passed away. It renders first, above
 * everything, and it is not a dismissible banner — see the page.
 *
 * ⚠ CR4 — ruled 7 Sep: this line KEEPS "settler". Graham Ambridge's
 * biography describes himself, in his own word, and FNAN raised CR4 against
 * Suzanne's quotation on Truth, not against this line. The same principle
 * that protects her words protects his. Not an oversight — a decision.
 *
 * ⚠ Placeholder people are modelled with `name: null` rather than with the
 * string "[ Name ]". A placeholder that renders as a name is one careless
 * commit away from being published as one.
 */

export const ourPeopleHero = {
  eyebrow: "Iningai custodians, Rangers and Elders",
  title: "Our people",
  standfirst:
    "YACHATDAC is run by Iningai Traditional Custodians, with Rangers doing the work on Country and Elders guiding what can be shared.",
} as const;

/**
 * Rendered before the page content, always. Australian cultural protocol, and
 * the draft puts it first for that reason.
 */
export const culturalAdvice =
  "Aboriginal and Torres Strait Islander readers are advised that this page contains images and names of people who have passed away.";

export const suzanneProfile = {
  name: "Suzanne Thompson",
  role: "Iningai custodian · Founder and Managing Director",
  image: "Portrait — Suzanne.",
  body: [
    "Suzanne founded YACHATDAC and runs it. Her great-great-great grandmother was Polly and her great-great-great grandfather was Billy, and that is how she knows where to hunt on this Country and which springs to go to.",
    "Her father spent his life fencing and protecting the sites out here, and holding two families together. When she came back after he died in 2003, nothing had been done since. Getting Turraburra back was his dream before it was hers.",
  ],
  quote: "History said we didn't exist. We have no rights. Well, we're still here.",
  /**
   * The operative sentence on this whole site. It is the reason the Truth page
   * is held by community and the reason CR4 and CR10 are on hold.
   */
  authority:
    "Anything to do with culture, knowledge, or what gets shared is her decision.",
  pending:
    "Add external roles — national emissions reduction board and any others. Needs confirming.",
} as const;

export type Person = {
  /** null while the person is a placeholder. Never a bracketed string. */
  name: string | null;
  role: string;
  /** null while the biography is unwritten. */
  bio?: string | null;
  /** True where the role itself is still to be confirmed. */
  roleUnconfirmed?: boolean;
};

export const team = {
  title: "The team",
  lede: "Placeholder roles below. Names, titles and photographs to be confirmed.",
  people: [
    {
      name: "Graham Ambridge",
      role: "Role to confirm",
      roleUnconfirmed: true,
      /** ⚠ CR4 — "settler". His own word about himself. Held. */
      bio: "Graham came out from England as a boy and describes himself as an inside-outsider. He works alongside Suzanne on the building, the systems and the partnerships, and he speaks to the settler side of this history, which is his own.",
    },
    { name: null, role: "Iningai Ranger", bio: null },
    { name: null, role: "Iningai Ranger", bio: null },
    { name: null, role: "Operations", bio: null },
    { name: null, role: "Cultural heritage", bio: null },
    { name: null, role: "Guesting and visitors", bio: null },
  ] satisfies Person[],
  pending:
    "Rangers are the heart of Living Work and are currently unnamed across the site. Full list needed, with consent to be named and photographed.",
} as const;

export const governance = {
  title: "Board and cultural governance",
  body: [
    "The board holds accountability for performance, direction and cultural integrity. It is made up of 80% Aboriginal and 20% non-Aboriginal members under our constitution and ORIC requirements, and includes a formal Iningai Nation representative.",
    "An Elder Advisory Group is being established to guide everything touching cultural integrity. Once it is sitting, no program involving the sharing of Iningai cultural knowledge, stories or sacred information will proceed without its endorsement.",
  ],
  people: [
    { name: null, role: "Board member", bio: null },
    { name: null, role: "Board member", bio: null },
    { name: null, role: "Iningai Nation representative", bio: null },
  ] satisfies Person[],
  pending:
    "TENSE — the Elder Advisory Group is not yet sitting. Keep this in the future tense until it is. Board member names and photographs to be confirmed.",
} as const;

/**
 * "The ones who got us here".
 *
 * ⚠ Some of these people have passed away, which is what the cultural advice
 * at the top of the page is about. Two entries carry unresolved identity
 * questions in the draft and both are kept as written — guessing at a name on
 * a memorial list is not a tidy-up.
 */
export type Acknowledgement = {
  name: string;
  detail: string;
  /**
   * An identity question the draft could not settle. Kept against the entry
   * rather than resolved by guessing — see the warning above.
   */
  unconfirmed?: string;
};

export const acknowledgements = {
  title: "The ones who got us here",
  lede: "Three generations of families walked with ours to keep this Country reachable when we did not own an acre of it. Some of these people are gone. We name them because that is how the record stays straight.",
  people: [
    {
      name: "David Thompson",
      detail:
        "Suzanne's father. Fenced and protected the sites, held the Thompson and Fraser families together, and taught what he knew.",
    },
    {
      name: "Uncle Vincent Forrester",
      detail:
        "Has visited Marra Wonga for many years and works closely with Iningai custodians.",
      unconfirmed:
        "Confirm — may be the same person recorded elsewhere as Uncle Winston Forrester.",
    },
    {
      name: "Robin Adams",
      detail:
        "Gave Suzanne access to her Country and her property, and let the first women's camps happen there before we had our own.",
    },
    {
      name: "Trish Buck and Steve Smith",
      detail:
        "Championed the acquisition through the Indigenous Land and Sea Corporation.",
      unconfirmed: "Roles to confirm.",
    },
    {
      name: "Mark, and the cousins who camped",
      detail:
        "Came out for three months to fence and protect the sites, through an Aboriginal works project.",
      unconfirmed: "Full names to confirm.",
    },
  ] satisfies Acknowledgement[],
  outstanding:
    "Elders and family to add — Suzanne to complete. Names of people who have passed need her decision on inclusion.",
  pending:
    "Every name here needs checking. The buyback recording garbles most of them — see the verification list.",
} as const;
