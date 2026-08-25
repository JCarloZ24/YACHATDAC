/**
 * Living Work — Caring for Country.
 *
 * Source of truth:
 * docs/content/drafts/living-work/YACHATDAC-LivingWork-Copy-v3.md (D5).
 *
 * ⚠ Governance circle: **shared with care**.
 *
 * ⚠ Two live risks sit on this page and both render in place:
 *
 *   R14 — the five status labels under "What the work produces" are public
 *   claims about carbon registration, biodiversity credit work, IPA
 *   designation and Native Title, and nobody has confirmed them. The draft
 *   carries its own "[ Status labels to be confirmed before publishing ]"
 *   note. It is rendered, not dropped. The Rainbow Credits card is still
 *   "[ For YACHATDAC to write ]".
 *
 *   R19 — CR5 asks for SWER and on-site fuel tanks to be added to the Power
 *   block, supported only by a pasted general definition of how SWER works.
 *   Nothing states what Turraburra actually has, so nothing has been added.
 *   See docs/change-requests.md.
 *
 * ⚠ CR3 (pending) replaces "cool burn"/"cool burning" and "right-way fire"
 * with "fire-stick farming" throughout. NOT applied. Note when it is that
 * several lines here use "cool burning" and "burn right way" to describe
 * manner rather than to name a practice — "Rangers burn right way and look for
 * black ash" does not survive a substitution and needs rewriting.
 *
 * ⚠ CR1 (pending) renames "cultural sites" to "cultural heritage sites". The
 * one occurrence is the challenge titled "Damage and access to cultural
 * sites", below. NOT applied — the draft governs until the request is
 * answered.
 */

export const livingWorkHero = {
  eyebrow: "Living Work · Caring for Country",
  title: "Field notes from Turraburra",
  standfirst:
    "YACHATDAC manages Turraburra, 8,870 hectares of Iningai Country 120km north of Barcaldine in Central Western Queensland. The property was bought back for the Iningai people in 2019.",
  secondary:
    "Iningai Rangers deliver the work: fire-stick farming, land restoration and management, wildlife conservation and site protection, on a property that runs on its own water, power and communications.",
} as const;

export type Challenge = {
  title: string;
  /** What the problem is. */
  problem: string;
  /** What is being done about it. The draft always gives both. */
  response: string;
};

/**
 * Thirteen challenges, in the draft's order.
 *
 * Ordered from the oldest damage to the newest exposure, ending on the two
 * that are about money rather than land. That order is the draft's and it is
 * an argument — do not re-sort it alphabetically or by severity.
 */
export const challenges: readonly Challenge[] = [
  {
    title: "A century of overgrazing",
    problem:
      "Turraburra was run as a sheep and cattle station from the 1880s. Continuous grazing strips groundcover, compacts soil and stops native grasses setting seed, so Country loses its ability to hold water and recover on its own.",
    response:
      "Fencing lets us rest paddocks and manage them separately. Seed collection and replanting rebuild what grazing removed.",
  },
  {
    title: "Degraded springs and waterholes",
    problem:
      "Springs are the most valuable water on a property like this and the first thing stock destroy. Hooves break down the edges, silt fills the hole, and the vegetation that shades and holds it disappears.",
    response:
      "Restoration is slow: clear the hole, plant around it, and keep water up to it through the first dry until it holds on its own.",
  },
  {
    title: "Soil carbon loss and erosion",
    problem:
      "Carbon in healthy soil starts at the surface. Testing here found it beginning only 30 centimetres down, which means the top of the profile has been stripped over time.",
    response:
      "Groundcover, right-way fire and rested paddocks build it back. It is also the basis of any carbon project, so it is worth measuring before you start work rather than after.",
  },
  {
    title: "Wrong-way fire and wildfire risk",
    problem:
      "Without regular cool burning, fuel builds up and the fire that eventually comes through is hot enough to kill trees, sterilise soil and damage sites.",
    response:
      "Cool burns at the right time of year, read off the season, break the country into a patchwork so a wildfire has nowhere to run.",
  },
  {
    title: "Weeds and feral animals",
    problem:
      "Feral animals foul and collapse waterholes, eat regrowth and damage rock shelters by sheltering in them. Weeds move in wherever ground is disturbed — roads, yards, watering points.",
    response:
      "Control is continuous rather than a one-off, and targeted at the places doing the most damage.",
  },
  {
    title: "Extreme heat, drought and flood",
    problem:
      "Climate variability is the highest-likelihood risk on this property. Drought stops restoration and shuts down water; flood cuts access; heat closes down field work and visitor operations.",
    response:
      "Workplans are built loose enough to move around the season, and every budget carries contingency for weather delays.",
  },
  {
    title: "Distance from town",
    problem:
      "Barcaldine is 120 kilometres south and Aramac is the last town. Fuel, feed, wire, parts and contractors all carry a freight cost and a waiting time that properties closer in do not pay.",
    response:
      "Machinery is serviced and rebuilt on site. Town runs are planned to carry as much as possible in one trip.",
  },
  {
    title: "No reliable phone reception",
    problem:
      "There is no dependable mobile coverage on the property, apart from patches on top of the escarpment. That is a safety issue before it is an inconvenience.",
    response: "See Infrastructure below for how the property stays connected.",
  },
  {
    title: "Water security across 8,870 hectares",
    problem:
      "Stock water, camp water, nursery water and firefighting water all come off one system: a 480-metre bore, tanks, pumps and lines spread across the property.",
    response:
      "When something fails out here it gets fixed here. Water security is a standing priority rather than a project with an end date.",
  },
  {
    /** ⚠ CR1 renames this to "cultural heritage sites". Pending, not applied. */
    title: "Damage and access to cultural sites",
    problem:
      "Marra Wonga carries historic graffiti from visitors going back over a century, and artefacts near the shelter have been removed by station owners and tourists since the late 1800s. Stock and feral animals damage sites simply by sheltering at them.",
    response:
      "Roads are aligned to go around sites rather than through them, and access is controlled and guided.",
  },
  {
    title: "Species we have not yet identified",
    problem:
      "Nobody has a full list of what lives here. That matters practically: you cannot protect or claim credit for what you have not recorded.",
    response:
      "Acoustic recorders and camera monitoring are building that record, with plenty still unidentified.",
  },
  {
    title: "Ranger funding ahead of income",
    problem:
      "Ranger work is currently grant funded, and grant cycles are shorter than the work. Losing ranger funding before commercial income is established is the single biggest risk to everything on this page.",
    response:
      "Guesting, native foods, natural capital and fee-for-service land management are being built to carry the Rangers independently of grant rounds.",
  },
  {
    title: "Natural capital market volatility",
    problem:
      "Carbon and biodiversity credit prices move and methodologies change. A land management programme built on a single market is exposed to decisions made a long way from here.",
    response:
      "The approach is to work across several natural capital products rather than depend on one.",
  },
];

export const rangers = {
  title: "Iningai Rangers",
  body: "Rangers run the cool burns, the fencing, the seed collection, the spring and wetland restoration, the weed and feral control, the machinery and the site protection. Ranger workplans set the year's work across the property. Training partnerships are being built so the jobs here can be filled from community.",
  /**
   * The prototype ran these as a carousel with numbered controls. Rendered as
   * a grid instead: a carousel hides six of seven photographs behind an
   * interaction, and these are the only pictures of the people doing the work.
   * Layout is the wireframes' call (D5) — this is the honest default until
   * then.
   */
  gallery: [
    "Rangers out on Country.",
    "Showing plants to a visiting group.",
    "Working along the escarpment.",
    "Morning briefing by the water.",
    "Seed collecting in the scrub.",
    "At the shelter wall.",
    "On top of the escarpment.",
  ],
} as const;

export type WorkStream = {
  /** The draft numbers these 01–07 and the numbers carry the sequence. */
  number: string;
  title: string;
  lede: string;
  detail: string;
};

export const workStreams: readonly WorkStream[] = [
  {
    number: "01",
    title: "Fire-stick farming",
    lede: "Low-intensity cool burning at the right time of year — reducing fuel loads, encouraging germination and breaking Country into a patchwork that carries more life than unburnt or hot-burnt ground.",
    detail:
      "Rangers burn right way and look for black ash rather than scorched ground. Burns run as workshops as well as work, so more people come off them able to do it. Soil is tested before and after: carbon here began only 30 centimetres down, and one paddock was recorded working as a carbon sink within eight to nine months of a cool burn.",
  },
  {
    number: "02",
    title: "Springs and waterholes",
    lede: "Bringing cultural wetlands and spring networks back to holding water on their own.",
    detail:
      "One spring had been trampled flat by a century of stock. Rangers cleaned the waterhole out, planted grasses around it and carted a thousand litres to it twice a day through drought. Eight days in it held a puddle. The next morning there was a koala standing at it.",
  },
  {
    number: "03",
    title: "Seed and groundcover",
    lede: "Collecting seed when Country produces it, holding it, and putting it back into revegetation.",
    detail:
      "Seed is available when the season decides, not when a work plan says so, which is why the year is organised around the country rather than the other way round.",
  },
  {
    number: "04",
    title: "Fencing and paddocks",
    lede: "New fencing built corner assembly by corner assembly, giving paddocks that can be managed separately.",
    detail:
      "Rangers built it themselves, learning the job as it went. It turned out to matter more than expected — without separate paddocks the flux tower comparison would not have been possible.",
  },
  {
    number: "05",
    title: "Weeds and feral animals",
    lede: "Continuous control targeted at the places doing the most damage — waterholes, regrowth and rock shelters.",
    detail:
      "Control is ongoing rather than a one-off campaign, and it runs alongside the restoration work rather than separately from it.",
  },
  {
    number: "06",
    title: "Sites and access",
    lede: "Protecting Marra Wonga and the other recorded sites, and controlling how people reach them.",
    detail:
      "Road alignments were set from cultural mapping so routes work around sites rather than through them. Access is guided. Ecological and cultural mapping of the property tells us what is where and what must not be disturbed.",
  },
  {
    number: "07",
    title: "Monitoring",
    lede: "Recording what is here and what changes, so management decisions and credit claims both rest on evidence.",
    detail:
      "Four acoustic recorders log birds and frogs into a database held with QUT, two of them down at the springs. Cameras on the towers photograph five hundred metres around, tracking vegetation and flowering through the year. Soil samples from the bore are held by QUT.",
  },
];

export type InfrastructureBlock = {
  title: string;
  points: readonly string[];
  /** The line the draft sets below the bullets, where it gives one. */
  note?: string;
};

/**
 * ⚠ R19 / CR5. The client has asked for Single-Wire Earth Return and on-site
 * petrol and diesel tanks to be added to Power. Nothing has been added,
 * because what was supplied is a generic definition of SWER rather than a
 * statement of what is on this property. Ask, then write. Do not paraphrase
 * the definition — this block is read by funders and neighbouring properties.
 */
export const infrastructure: readonly InfrastructureBlock[] = [
  {
    title: "Communications",
    points: [
      "Starlink uplink bridged to an external router",
      "Wifi mesh — three extenders plus one in the campground",
      "UHF radio in the house, the shed and nearly every vehicle",
      "About ten UHF handhelds, roughly 5km range from the house",
    ],
    note: "Direct-to-handset satellite messaging is expected to change this within a couple of years.",
  },
  {
    title: "Water",
    points: [
      "480-metre bore at Lancewood Ridge",
      "Tanks, pumps and lines across the property",
      "Filters on a six-month replacement cycle",
      "Stock, camp, nursery and firefighting water off one system",
    ],
  },
  {
    title: "Power",
    points: [
      "Solar with wifi-enabled regulators",
      "Data can be pulled off the regulators remotely",
      "240 volt supply to the mesh network",
    ],
    note: "Renewable self-sufficiency is a Stage 4 goal.",
  },
  {
    title: "Monitoring gear",
    points: [
      "Two flux towers — managed Country and grazed control",
      "Four acoustic recorders, two at the springs",
      "Cameras on the towers, 500m radius",
      "Soil samples every six metres from the bore, held with QUT",
    ],
  },
  {
    title: "Machinery",
    points: [
      "Grader, buggies, vehicles and heavy plant",
      "Serviced, repaired and rebuilt on site",
      "Register down to serial and filter numbers",
      "Service history with hours and kilometres, updated every visit",
    ],
    note: "The register is the reason a town run can be planned in one trip.",
  },
  {
    title: "Coming",
    points: [
      "Secure Ranger Base",
      "Research facilities and nurseries",
      "Walking tracks and camping facilities",
      "Staff housing",
    ],
  },
];

export type Output = {
  title: string;
  /** ⚠ R14 — every one of these is unconfirmed. */
  status: string;
  body: string;
  /** True where the card itself is still to be written by the client. */
  unwritten?: boolean;
};

/**
 * ⚠ R14. These five labels are public claims about registration and legal
 * status. None is confirmed. The draft's own note is carried as
 * `outputsNote` and renders under the grid.
 *
 * ⚠ CR2 (pending) retitles "Carbon" to "Biological Sequestration". NOT
 * applied — it should be confirmed in the same pass as the status labels
 * rather than separately, and "biological sequestration" is a broader claim
 * than "carbon".
 */
export const outputs: readonly Output[] = [
  {
    title: "Carbon",
    status: "Registration underway",
    body: "Two flux towers and soil testing underpin a carbon farming project. Cool burning done right way is the practice being measured.",
  },
  {
    title: "Biodiversity credits",
    status: "Building the record",
    body: "Species of significance are being identified and monitored. The same data that guides management underpins any credit work.",
  },
  {
    title: "IPA designation",
    status: "In progress",
    body: "Indigenous Protected Area status for Turraburra, alongside National and World Heritage applications and the Four Rivers People Native Title claim.",
  },
  {
    title: "Fee-for-service",
    status: "Being developed",
    body: "Ranger skills offered to neighbouring properties — right-way fire, land management and cultural heritage advice.",
  },
  {
    title: "Rainbow Credits",
    status: "For YACHATDAC to write",
    body: "Integrating environmental and traditional land management into a single natural-capital product. Needs describing in your words: what it is, what is measured, who it is for, and where it sits with the Rainbow Foundation.",
    unwritten: true,
  },
];

export const outputsNote = "Status labels to be confirmed before publishing.";

export const getInvolved = {
  eyebrow: "Get involved",
  title: "Ancient traditions walking together with contemporary visions",
  image: "People walking through woodland toward the escarpment.",
  paths: [
    {
      title: "Ranger exchange",
      body: "On-Country training camps and exchanges with other First Nations ranger groups.",
      cta: { label: "Get in touch", href: "/connect" },
    },
    {
      title: "Fund the work",
      body: "Ranger wages, water infrastructure, monitoring equipment and restoration. What is needed is specific and can be costed.",
      cta: { label: "Partner with us", href: "/connect" },
    },
    {
      title: "Land management services",
      body: "Right-way fire, cultural heritage advice and Country management for properties in the district.",
      cta: { label: "Enquire", href: "/connect" },
    },
  ],
  signup: {
    label: "Get the work in your inbox",
    placeholder: "Your email address",
    cta: "Subscribe",
    note: "Occasional updates from Country. No more than that.",
  },
} as const;
