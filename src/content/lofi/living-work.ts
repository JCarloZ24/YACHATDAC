/**
 * Living Work — "Caring for Country".
 *
 * Source of truth: docs/content/drafts/living-work/YACHATDAC-LivingWork-Copy-v1.pdf
 * (decision D5). Copy is verbatim.
 *
 * ⚠ Copy status: draft, not approved. Governance circle: **shared with care**.
 * See docs/content/STATUS.md.
 *
 * Audience: other Indigenous communities worldwide. Peer-to-peer tone —
 * generous with method, not a pitch. This is a working record, not a summary
 * of achievements, and the failures are the most useful part of it for the
 * reader it is written for.
 *
 * THE GOVERNANCE COLUMNS ARE THE POINT
 * ------------------------------------
 * Every step carries WHAT TRAVELS (the model and the sequence, shared freely)
 * and WHAT STAYS HERE (knowledge that belongs to this Country). Both get equal
 * visual weight — the right-hand column is where the cultural governance line
 * is drawn in public, and rendering it as a footnote would undercut the whole
 * page. Three steps read "nothing restricted here"; that is a deliberate
 * statement and a real component state, not an empty cell.
 */

export type Step = {
  number: string;
  title: string;
  body: string[];
  travels: string;
  /** `null` renders the explicit "nothing restricted here" state. */
  stays: string | null;
};

export const livingWorkHero = {
  eyebrow: "Caring for Country",
  headline: "We got the keys in 2019. This is what we did with them, in order.",
  body: "Turraburra is 8,870 hectares that had been run as a grazing station for a century. What follows is the sequence we worked in, what each step cost us, and which parts of it would travel to somebody else’s Country.",
  /**
   * The draft's image note, moved into a slot label rather than reproduced as
   * page copy: "[ Image — full-bleed, work in progress. Machinery, smoke or
   * water. Not a landscape. ]"
   */
  mediaNote:
    "full-bleed, work in progress. Machinery, smoke or water. NOT a landscape. X5 scrim required.",
} as const;

export const whyPublishing = {
  headline: "Why we are publishing this.",
  body: [
    "Communities keep asking us how it was done. Not the vision — the order. Which thing first, what it cost, what we got wrong.",
    "So this page is the working record rather than a summary of our achievements. We share the model and the sequence freely. The knowledge that belongs to this Country stays on this Country, and we have marked which is which as we go.",
  ],
} as const;

export const stepsHeading = "Eight things, in the order they had to happen.";

export const steps: Step[] = [
  {
    number: "01",
    title: "Water, before anything else",
    body: [
      "A property with no reliable water cannot be worked, restored, or stayed on. Everything else waited on this.",
      "We drilled at Lancewood Ridge, the oldest land type here, and went 480 metres down before we hit water. We asked the drillers to keep a soil sample every six metres on the way down, because we wanted to know what was in the ground and not only what was under it. Those samples went to QUT. Sixty metres down, there was pollen.",
      "The bore now runs the property. The samples turned into a research relationship we had not set out to create.",
    ],
    travels:
      "Keep the cores. You are paying to make the hole either way, and the ground you bring up is a record nobody else has. Ask before the rig arrives, not after.",
    stays:
      "The depth, the geology and what the pollen means here. Every Country answers a drill differently.",
  },
  {
    number: "02",
    title: "Roads, so anyone could get in",
    body: [
      "We could not bring materials, buses or visitors onto the property safely. Nothing could scale past what one vehicle could carry.",
      "We put about twenty hours of grader time into the road up to Yumba. Where the road went was decided by what it had to avoid — the routes work around sites, not through them.",
    ],
    travels:
      "Do the roads before you invite anybody. And set the alignment from your cultural mapping first, because a road is very hard to move once it is cut.",
    stays: "Our alignments, and the reasons behind them.",
  },
  {
    number: "03",
    title: "Fences, to make the land manageable",
    body: [
      "Stock moved wherever they liked, over regrowth and over sites.",
      "We built new fencing across the property, corner assembly by corner assembly, mostly with our own people learning the job as it went. It gave us paddocks we could treat differently from one another.",
      "That turned out to matter more than we expected. Without separate paddocks we could not have run the comparison that came later.",
    ],
    travels:
      "Fence lines are management units. You cannot demonstrate that your practice works until you can hold one piece of country to a different standard than the piece beside it.",
    stays: null,
  },
  {
    number: "04",
    title: "Fire, put back the right way",
    body: [
      "The soil testing told us what a century of the wrong fire had done. Carbon did not start until thirty centimetres down. The country above that was not holding anything.",
      "We burned cool, at the right time, reading the season rather than the calendar. We look for black ash, which is a biochar in its own right, not scorched ground. We ran it as workshops as well as work, so more people came out of it able to do it.",
      "Within eight to nine months, our monitoring recorded that paddock working as a carbon sink.",
    ],
    travels:
      "Test your soil before you burn, so you have a baseline to argue from later. And teach it while you do it — a burn that trains five people is worth more than a burn that trains none.",
    stays:
      "When to burn. That is read off this Country, by people who know it. A calendar will not carry across.",
  },
  {
    number: "05",
    title: "The spring",
    body: [
      "The spring had been trampled and silted by a hundred years of stock. It held nothing.",
      "We cleaned the waterhole out, planted grasses around it, and carted a thousand litres to it twice a day. It was drought — there was nothing else to give it. Eight days in, it held a puddle. The next morning there was a koala standing at it.",
    ],
    travels:
      "The sequence, and the patience. Clear it, plant it, then water it every day until it gets through its first dry on its own. Most restoration funding assumes you plant and walk away.",
    stays:
      "Which grasses, and where they go. That is particular to this Country.",
  },
  {
    number: "06",
    title: "Seed, when the seed is on",
    body: [
      "Revegetation needs seed, and seed is only available when Country decides it is.",
      "We collect when it is on rather than when a work plan says so, hold it, and put it back into replanting. It means the year is organised around the season instead of the other way round.",
    ],
    travels:
      "Build your work plan loose enough to drop everything for a week when the seed comes on. Funders will want fixed milestones; this is the one to argue about.",
    stays: "The species list, and the ground each one belongs to.",
  },
  {
    number: "07",
    title: "Measuring what we already knew",
    body: [
      "We did not need instruments to tell us that right-way fire works. But carbon credits, biodiversity credits and government funding all run on the other system’s evidence, so we decided to produce it.",
      "Two flux towers stand on the property — one on Country we manage our way, one on grazed land — and each is read against the other. Four acoustic recorders log birds and frogs. Cameras on the towers photograph five hundred metres around, tracking vegetation and flowering through the year.",
      "The result is that our practice can now be argued for in the language that holds the money.",
    ],
    travels:
      "Set up the control before you start the work, not after. The unmanaged paddock beside you is the most valuable thing you own, and only for as long as you leave it alone.",
    stays: null,
  },
  {
    number: "08",
    title: "People, all the way through",
    body: [
      "Every job above could have been contracted out. Most of them were not.",
      "The rangers learned fencing by fencing, burning by burning, and machinery by keeping it running. Traineeships and training partnerships are being set up so the work here can be filled from community rather than flown in.",
      "It is slower. It is also the only version of this that is worth doing, because the point was never the property.",
    ],
    travels:
      "Do the work with your own people even when buying it in would be faster. The skills stay, and so do the wages.",
    stays: null,
  },
];

/**
 * ⚠ REMOVABLE SECTION — decision **D6** is open.
 *
 * The draft carries its own note: written for the practitioner audience, who
 * find failures more useful than successes, and it "may sit badly with a
 * government funder reading the same page. Cut in one move if so."
 *
 * Built as one section with one export so it can be cut in a single move, as
 * the draft asks. Owner: Marc and August, with the client. The pillar's stated
 * audience is other Indigenous communities, not funders, and this is the most
 * useful section on the page for that reader.
 */
export const removableFailures = {
  headline: "The parts that are not in the annual report.",
  body: [
    "The grader broke partway through building the road, with the job unfinished and people already booked to come. The bore pump has failed, or been found already failed, on most visits — a high-quality pump, 480 metres down, in a place where the nearest replacement is hours away.",
    "We are including this because remote infrastructure fails, and any community planning work like ours should budget for the failure rather than the machine. A grader you cannot repair on site is not a grader you own.",
  ],
} as const;

export const comeAndSee = {
  headline: "Come and see it, or ask us.",
  body: "Communities working through the same questions are welcome here. It is easier to show than to write down, and most of what matters is not on this page.",
  ctas: [
    { label: "Talk to us", href: "/truth#partner" },
    { label: "Come on Country", href: "/wonder" },
  ],
} as const;
