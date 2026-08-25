# Decisions, Risks & Issues — paste-ready

*Last updated: 24 August 2026*

Everything here is written to be **copied straight into Proyekto**:

- **Decisions** → Management → Decisions → *Record a decision*
- **Risks & Issues** → Management → Risks & Issues

## Why this is a file and not already in Proyekto

The Proyekto MCP connector exposes projects, the roadmap (epics, features,
tasks, milestones), chat, members and comments. It has **no tools for
Decisions, Risks & Issues or Change Requests**, so those three sections cannot
be written to programmatically — they have to be entered through the web UI.

Roadmap tasks *can* be created and assigned through MCP. Where an item below is
really a piece of work rather than a decision or a risk, it is marked
**→ task** and can be created on request.

## Owners

| Name | Role on this project |
| --- | --- |
| **Marc** (Marc Dungog) | Design system, brand direction, UI — and the route to the client |
| **Ivy** (Jasmin Ivy C. Fedilo) | Web design, layout, wireframes |
| **JC** (Juan Carlos Gan) | Front end, 3D and animation |
| **David** (David Bato-bato) | Backend / development lead |
| **Joshua** (Joshua Mistal) | Image editing |
| **August** (August Teleg) | Project owner |
| **ven** | Video editing |

Client side and approvers:

| Name | Role |
| --- | --- |
| **Suzanne Thompson** | Traditional Owner. The authority on cultural content and on her own words. Approves the Welcome to Country and the Truth timeline. |
| **Steve** | **FNAN** (First Nations Action Network) — the organisation that brought YACHATDAC to us. Reviews, and is the route in; **not** the owner of the words. |
| **Leo** | Secretary / intermediary. Holds a CMS account and enters approvals on behalf of people who do not log in. **A different person from Leonard Mickelo.** |
| **Leonard Mickelo** | Artist. Supplied the vectorised artwork. No motion permission recorded — see R10. |

Field names below match the Decision modal exactly. The Risks & Issues form has
not been seen, so those entries use a plain shape — remap as needed.

**Ownership rule (19 Aug):** every risk or issue owned by Marc is co-owned by
August. `→ someone` means the owner is the route to that person, not that the
person is accountable in Proyekto.

**Walkthrough (20 Aug):** JC ran the open list with the client side and closed
seven items — D1, D3, D6, D7 and R2, plus two new decisions, D13 and D14 — with
partial answers on D4 and D9. The numbering used in that walkthrough drifts
from this file from R4 onward. Answers are recorded below against **this file's** numbers; the map
is here so the transcript can still be read against it.

| Said in the walkthrough | Means, in this file |
| --- | --- |
| D1, D2, D3, D4, D6, D7 | the same items |
| "D8/D9 — motion guidelines" | **D9** only. D8 here is backend build priority and was not discussed. |
| "D10 — copy ownership and CMS source of truth" | restates **D5** and **D12**. D10 itself — a named copy owner per page — is still unanswered. |
| R1, R2, R3 | the same items |
| "R4 — Suzanne's approvals" | **R5**. R4 here is the Bantayog Sans licence and is still open. |
| "R5 — DGR" | **R8** |
| "R6 — cultural permissions for media" | **R10** |

**Mapping confirmed by August (20 Aug).** Use this file's numbers from here on.

**v2 copy uploaded (20 Aug, later the same day):** homepage, Wonder, Living Work
and Truth. Per D5 these documents govern copy, so they move three items on this
board — **R2 is reversed**, **D6 is superseded**, **D7 is satisfied** — and add
R13–R15. Full read in `docs/content/STATUS.md`.

**v3 copy uploaded (24 Aug), as coded HTML prototypes:** the same four pages
plus **Resources, About and Our People**. Converted to Markdown and filed under
`docs/content/drafts/`; the prototypes themselves stay in the Drive export. What
it moves on this board:

- **R1 downgrades from High to Medium** — the Northern Territory acknowledgement
  is gone. What is left is a placeholder awaiting Suzanne's words.
- **R13's cost half closes** — Wonder now states plainly that there is no
  published pricing and every stay is arranged with the guest. Inclusions are
  written but still unconfirmed.
- **D5 gains a clause** — a prototype's *design* is a suggestion to the
  wireframes, not a decision. Its *words* still govern copy.
- **D2 gains evidence, again** — a real header nav with no Connect in it, plus
  three routes (`/about`, `/our-people`, `/partnerships`) that exist nowhere in
  the IA.
- **R14 and R15 unchanged** — the Rainbow Credits card, the regulatory status
  labels and the ORIC spelling are all still open, now for a third round.

Full read in `docs/content/STATUS.md`, notes 1, 2b, 5, 7, 8, 9, 10, 11, 12, 13.

## Index

| | Decision | Status | Owner |
| --- | --- | --- | --- |
| D1 | Blog and Resources: one thing or two? | **Final** (20 Aug) — one page, labelled **Resources** | Marc, Ivy |
| D2 | Does Connect survive as a nav item? | Proposed — held until Marc reviews the lo-fi | Marc |
| D3 | FAQs: scope, ownership, CMS or static | **Final** (20 Aug) — CMS-managed. Author still unnamed | Marc, David |
| D4 | Legal page naming and Cookie Policy | Proposed — **pending**, no source documents yet | David |
| D5 | Draft documents are the source of truth for copy | **Final** | Marc, August |
| D6 | Keep or cut the Living Work failure section | **Superseded** by the v2 draft — cut | Marc, August |
| D7 | Where fee-for-service land management lives | **Final** (20 Aug) — under Living Work, **done in v2** | Marc, August |
| D8 | Backend build priority | Proposed — **not** covered on 20 Aug | David |
| D9 | Who signs off motion decisions | Proposed — motion character set, approver still open | Marc, August |
| D10 | Copy ownership per page | **Final** (20 Aug) — August, every page | August |
| D11 | Hosting and database accounts | Proposed | David |
| D12 | Homepage copy is CMS-editable | **Final** | August |
| D13 | Donations are deferred out of launch scope | **Final** (20 Aug) | David, August |
| D14 | CMS roles, and how approvals reach the CMS | **Final** (20 Aug) — route only, not the approver | David, Marc |
| D19 | Living Work's closing CTA: newsletter, or the draft's two endings | Proposed | Marc, Ivy |
| D20 | What follows the Truth descent | Proposed | Marc, Ivy |
| D21 | The Record's taxonomy: two facet axes | Proposed | Marc, David |
| D22 | Does `/partnerships` exist as a destination? | Proposed | Marc, August |
| D23 | Is `/our-people` a route? | Proposed | Marc |
| D24 | Persistent homepage navbar, or no nav until block 6? | Proposed | Marc, Ivy |
| D25 | Where the empty state's "ask us what exists" goes | Proposed | Marc |
| F1 | Homepage copy lives in the repo | **Superseded** by D12 | August |
| F2 | Homepage thread is a plain vertical rule | **On hold** | August, Ivy, JC |
| F3 | Homepage Truth beat is typographic | **On hold** | August, Ivy |
| F4 | Motion tiers, two signature moments | **Final** | JC |
| F5 | Only Work Sans is tracked in git | **Final** | August |
| F6 | Local dev runs on port 3001 | **Final** | August |

Risks and issues are in Part 4: R1–R15 and R22–R23 here; R16–R21 are in
`docs/change-requests.md`.

---

# Part 1 — Decisions still open

Twelve open. Record each as **Proposed**; when it is answered, change the status
to **Final** and write the answer into *The decision* rather than starting a new
entry — the point is that the reasoning stays attached to the outcome. D1, D3,
D6, D7 and D10 were answered on 20 Aug and have moved to Part 2 with their
reasoning intact.

**D19 now has its write-up.** It was claimed by a note on the Living Work lo-fi
frame (Figma node `13:100`) and carried for a while as a number with no entry.
That is exactly how decisions get lost, so it is written up below.

**D24 came out of a readout file, not a decision log.** It had been sitting in
`docs/design/hifi-figma-readout.md` §2 marked *"unresolved, and a genuine design
decision rather than an error. Flagged for the team"* — flagged, but never given
an ID or an owner, and it changes the header on every page.

**D19–D25 were renumbered on 25 Aug.** They were first written as D13–D19 on a
branch, while `docs/change-requests.md` independently took D13–D18 for the FNAN
review. That file is written to be pasted into Proyekto, so its numbering stands
and these moved. D15–D18 live there, not here.

---

## D2 — Does Connect survive as a navigation item?

- **Category** — Information architecture
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **Held until (20 Aug)** — Marc reviews the lo-fi wireframes. This is a
  deliberate deferral, not a stalled item: the case for keeping or retiring
  Connect is easier to make against drawn pages than against a sitemap slide.
  Note it inverts the advice in R6, which was to settle D2 *before* wireframing
  because it changes page structure — so Ivy should draw the lo-fi with Connect
  present and structurally liftable, rather than baking in either answer.
  August is briefing the team on this (20 Aug), so the holding position is
  stated rather than assumed.
- **Evidence from v2, not an answer** — Homepage v2's footer nav reads *About /
  Wonder / Truth / Living Work / Resources*: no Connect, no Contact. But Truth
  v2 links a partnerships card to **`/connect`**, and another to
  **`/partnerships/#research-opportunities`** — a route in neither the nav nor
  the sitemap. So the drafts suggest Connect survives as a *destination* even
  where it is absent from the nav. D5 gives drafts authority over copy, not IA,
  so take this to the lo-fi review as input rather than treating the nav line as
  a decision.
- **More of the same from v3 (24 Aug)** — the homepage prototype now has a
  working header nav: **Wonder / Truth / Living Work / The Record / About**,
  with *Get in touch* as a button rather than a nav item. Connect is linked from
  five places and is in none of them. Two independent drafting rounds have now
  landed on the same shape, which is worth weighing — but it is still copy
  evidence, not IA. v3 also links `/about`, `/our-people` and `/partnerships`,
  none of which exist in `src/content/site.ts` or the sitemap, so whatever D2
  decides has to account for **Our People** as well as About and Contact.
  Separately, every v3 page labels the hub **The Record** where the repo says
  **Resources** — same route, different word, and D1 settled on *Resources*.
- **The decision** — Whether **Connect** remains in the navigation now that
  **About** and **Contact** have been lifted out of it to top level.
- **Context** — Connect was the utility hub holding About YACHATDAC, the team,
  Suzanne, Turraburra and Resources. The sitemap promotes About and Contact to
  the navbar, which leaves Connect holding a thinner set.
- **Why it matters** — Affects the primary navigation and the footer, both of
  which appear on every page. Cheap to settle now, expensive once wireframes
  and hi-fi mockups are built around it.
- **Options considered**
  1. Retire Connect; About and Contact stand alone, Resources goes top level.
  2. Keep Connect as the container and drop About/Contact back inside it.
  3. Keep all three, with Connect reduced to team and Turraburra.

---

## D4 — Legal page naming and the missing Cookie Policy

- **Category** — Legal / compliance
- **Status** — Proposed · **Visibility** — Shared · **Owner** — David
- **The decision** — Confirm the final labels and routes for the legal pages.
- **Context** — Three different namings are now in circulation across three
  documents:

  | Source | Terms | Cookies |
  | --- | --- | --- |
  | Build documentation | Terms of Use | cookie/consent notice |
  | Sitemap (uploaded) | Terms & Conditions | Cookie Policy |
  | Homepage copy draft footer | Terms of Service | Cookie Settings |

  The repo currently has `/legal/privacy` and `/legal/terms` ("Terms of Use")
  and no cookie route. Note "Cookie **Settings**" in the draft implies a consent
  preferences dialog, not a policy page — those are different things and may
  both be wanted.
- **Why it matters** — Renaming a legal page's URL after launch breaks inbound
  links and any reference from a Stripe receipt or email footer. It costs
  nothing to settle before the routes are built.
- **Options considered**
  1. Adopt the sitemap: `/legal/terms-and-conditions` + `/legal/cookies`.
  2. Keep `/legal/terms` and fold cookies into the Privacy Policy.
- **Status (20 Aug) — pending, and blocked on documents that do not exist yet**
  — There is no legal documentation for this site. The working intent is
  interim text taken from the existing YACHATDAC website, or from a generic
  Australian website policy where the existing site has nothing; analytics
  setup is also still pending, so the cookie wording cannot be finalised.
  Neither the source documents nor the final labels exist today.
- **Still open** — the labels and routes, which is what this decision is
  actually about. Three namings remain in circulation and nothing has chosen
  between them.
- **Carried into R9** — copy "from the existing site or a generic Australian
  policy" is placeholder-grade, and R9 says these need legal review rather than
  internal drafting alone. Both can hold: ship a visibly-marked placeholder to
  unblock the routes, and do not switch on any form that collects personal data
  until the reviewed version lands.
- **Not blocking wireframes** — this is labels and routes, not page structure.

---

## D8 — Backend build priority

- **Category** — Delivery
- **Status** — Proposed · **Visibility** — Shared · **Owner** — David
- **The decision** — Build the user-facing front end first, or build the
  CMS/backend in parallel with it.
- **Context** — Raised at the 18 August briefing and deferred to a follow-up
  meeting that has not happened. Already on the roadmap as an urgent Phase 0
  task. The 20 Aug walkthrough said "D8/D9" but discussed motion only — this
  item was **not** covered and is unchanged.
- **Why it matters** — Launch is 14 September. The answer determines whether
  David starts the content model now or waits for the front end to settle.

---

## D9 — Who signs off motion decisions

- **Category** — Governance
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc and August
- **The decision** — Whether motion sign-off sits with Marc, the board, or the
  Elder Advisory Group — and at which milestone.
- **Context** — The motion skill's permissions board lists this as unresolved.
  Several behaviours are already on hold waiting for a named approver.
- **Why it matters** — Without a named approver, blocked items stay blocked and
  nobody is wrong for not deciding. This unblocks the artwork-motion and
  land-detail questions rather than being a separate ask.
- **Settled on 20 Aug — the character, not the approver** — Motion follows the
  documentation sent to Marc, and should feel **grounded**: weighted, settled,
  deliberate. Not playful, not bouncy, no overshoot or elastic easing. That is
  a constraint on the work and it is consistent with F4 — two signature
  moments, everything else Tier 2 — so nothing built so far has to change.
- **Still open** — who signs off. A character brief does not name an approver,
  so R10's three cultural permissions stay blocked behind this.

---

## D11 — Hosting and database accounts

- **Category** — Infrastructure
- **Status** — Proposed · **Visibility** — Shared · **Owner** — David
- **The decision** — Use one shared project account for hosting and database
  services, or individual accounts.
- **Context** — Raised at the briefing and noted without detail.
- **Why it matters** — Handover to the client at the end of the project is far
  simpler if the services were never tied to a personal account.

---

## D20 — What follows the Truth descent

- **Category** — Information architecture / content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with Ivy
- **The decision** — Whether the five structured blocks below the Truth timeline
  — *The browsable record · What's been researched · Open research opportunities
  · Partnership opportunities · Partner with us* — stay on that page, move to
  Resources / The Record, or are replaced by something shorter.
- **Context** — Four things now point the same way.

  1. **The copy was never commissioned.** `src/content/truth.ts` has said so on
     its own face since it was written: *"NO SOURCE COPY EXISTS. The copy
     document ends at the Wattanuri entry, so roughly a fifth of this page is
     uncommissioned … Retaining it is a decision."*
  2. **The sitemap already dropped half of it.** STATUS.md note 6: the uploaded
     sitemap gives Truth only Open Research Opportunities. Partnership
     opportunities is gone.
  3. **The Record draft (21 Aug) writes real copy for the same content, on
     Resources.** *Everything in the record* is the browsable record, with a
     filter bar and twelve written entries. *What we do not know* is the research
     opportunities section, with four written gaps — and its CTA points at
     `/partnerships/#research-opportunities`, routing them off Truth entirely.
  4. **It reads badly, which is what the 21 Aug lo-fi walkthrough caught.** The
     Truth lo-fi frame is 14,205px. The descent's last entry is Wattanuri,
     closing on *"Lore is not a date. It is the floor everything above has been
     resting on the whole way down."* Roughly 313vh of card grids and a form then
     follow it. The layout puts four filterable grids underneath the floor the
     copy has just declared.

- **Why it matters** — This is a fifth of the longest page on the site, and it is
  the page's ending. It also moves the navigation: `src/content/site.ts` currently
  lists `/truth#researched` and `/truth#opportunities` as Truth's nav children, so
  answering this retargets two primary nav items. And it decides whether David
  models this content once or twice.
- **The constraint that does not move** — **`#partner` stays on Truth.** The About
  draft's own contact router sends *"Research or partnership — universities,
  funders, brands"* to `/truth#partner`, and Living Work links the same anchor.
  The enquiry form is Truth's job; the browsable archive is not.
- **Options considered**
  1. **Recommended — one closing band, roughly 120vh instead of 313vh.** After
     Wattanuri: a quiet outbound line to The Record (one line, not a grid), two
     or three *named* open opportunities as a compact list, and the `#partner`
     enquiry form. Then the footer. The descent ends where its copy says it ends,
     and nothing is duplicated across two pages.
  2. **Keep the tail, commission the copy.** Honest, but it means writing a fifth
     of the page from scratch against a 14 September launch, and maintaining two
     browse interfaces over one collection — which is D1's problem again.
  3. **Cut everything including `#partner`.** Cleanest page, but it strands two
     inbound links and removes the site's only research-enquiry route.
- **Drawn, not built** — the proposed version is wireframed as
  `Truth — v2 PROPOSED` on the lo-fi canvas, below the reviewed row. The signed-off
  frame above it is untouched. No `src/` change until this is Final.

---

## D21 — The Record's taxonomy: two facet axes, and what happens to Event

- **Category** — Content model
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with David
- **The decision** — Whether the Resources collection is filtered on one axis or
  two, and whether `Event`, `Activity` and `Update` survive as content types.
- **Context** — `resourcesHub.contentTypes` in `src/content/site.ts` is one flat
  list: History · Research · Publication · Event · Activity · Story · Update. The
  Record draft uses a different type list — Stories · Historical accounts ·
  Research · Documentation · Recordings — **plus a source axis that does not exist
  in the code at all**: Iningai knowledge · Colonial record · Published research.
- **Why it matters** — Two things, of different sizes.

  The small one: `Event` is dropped, which collides with the settled position
  *"no separate Events page; Event is a content type inside Resources."* If Event
  goes, events have nowhere to live.

  The large one: the source axis is an epistemology, not a format. *Who says so* —
  the community, the coloniser, or the journal — is the exact distinction the
  whole Truth page is built on, and offering it as a filter over the record is a
  stronger idea than the flat type list currently modelled. It is also a second
  required field on every entry and a second filter control in the UI, so it is
  David's content model and Ivy's layout, not a copy tweak.
- **Options considered**
  1. Adopt both axes as drafted, and re-add Event/Activity/Update to the type list.
  2. Adopt both axes exactly as drafted, and find another home for events.
  3. Keep one axis and express source as ordinary tags — cheapest, and loses the
     idea that makes the record worth browsing.

---

## D22 — Does `/partnerships` exist as a destination?

- **Category** — Information architecture
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc and August
- **The decision** — Whether to create a partnerships page, or keep research and
  partnership opportunities where build documentation §4 puts them, on Truth.
- **Context** — The Record draft's *What we do not know* section links
  `/partnerships/#research-opportunities`. No such route exists in
  `src/content/site.ts` or in the build documentation. It is the first appearance
  of a partnerships destination anywhere in the project.
- **Why it matters** — It is the same question as **D20** seen from the other
  end, and the two should be answered together rather than separately. It also
  bears on **D7** — fee-for-service land management has no home in the sitemap
  and its audience is landholders, which is closer to a partnerships page than to
  any of the three pillars.

---

## D23 — Is `/our-people` a route?

- **Category** — Information architecture
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **The decision** — Whether the About draft's *"Meet the people →"* link
  (`/our-people`) is a new combined page, or Connect's existing team and Suzanne
  sections under a new name.
- **Context** — Build documentation §4 has *The YACHATDAC Team* and *About
  Suzanne Thompson* as two separate items under Connect. The About draft names
  Suzanne, the Iningai Rangers and the families in one paragraph and sends the
  reader to a single destination.
- **Why it matters** — Small on its own, but it is the third item pulling
  material out of Connect, after About and Contact. Answer it alongside **D2**
  rather than on its own; if Connect ends up holding only the team, that is the
  answer to both.

---

## D19 — Living Work's closing CTA

- **Category** — Content / conversion
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with Ivy
- **The decision** — Whether Living Work ends on the build specification's
  **newsletter signup**, or on the two closing blocks the copy draft actually
  ends with — **"Talk to us →"** and **"Come on Country →"**.
- **Context** — The build specification names newsletter signup as this page's
  confirmed CTA. The copy draft ends somewhere else entirely, on a section headed
  *"Come and see it, or ask us."* — *"Communities working through the same
  questions are welcome here. It is easier to show than to write down, and most
  of what matters is not on this page."* The lo-fi is built to the draft, with the
  divergence flagged rather than silently resolved.
- **Why it matters** — This pillar's audience is other Indigenous communities, and
  the draft's two endings offer them a conversation. A newsletter signup offers
  them a mailing list. Those are different propositions, and the page's whole tone
  is peer-to-peer rather than broadcast.
- **Options considered**
  1. **Recommended — keep the draft's two endings primary**, and let the
     newsletter live in the footer band, which every page already carries.
  2. Newsletter as the page CTA, per the build specification, with the two
     endings demoted or cut.
  3. Both, stacked — most likely outcome is that neither gets used.
- **Note** — Do **not** refer to this as "D3" in motion or design panels. D3 is
  the FAQs decision, and it is also a Tier 1 sketch ID (depth-map parallax), which
  is dangerously ambiguous in any panel that lists sketch IDs alongside decisions.

---

## D24 — Persistent homepage navbar, or no navigation until block 6?

- **Category** — Information architecture / design
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc, with Ivy
- **The decision** — Whether the homepage carries a persistent navigation bar from
  the first screen, or no navigation at all until block 6, *The Invitation*.
- **Context** — Three sources disagree.

  | Source | Says |
  | --- | --- |
  | Homepage copy draft | No navigation until block 6. Blocks 1–5 are pure immersion, and the three invitation cards are the first navigation choice offered. |
  | Marc's hi-fi | A `Navbar / 1 /` frame at `y=0`, above the hero, carrying WONDER · TRUTH · LIVING WORK · CONNECT. |
  | Uploaded sitemap | A persistent navbar. |

  The lo-fi is built to the copy draft, with a note on the frame saying so. The
  divergence was recorded in `docs/design/hifi-figma-readout.md` §2 on 20 Aug as
  *"unresolved, and a genuine design decision rather than an error"* — but it was
  never given an ID, an owner or a place in this file.
- **Why it matters** — It changes the header on **every page**, not just the
  homepage, so it touches all seven wireframes and the shared component that
  carries it. It is also a real argument rather than an oversight: the draft's
  position is that withholding navigation for five blocks *is* the homepage's
  argument. Overriding that should be a decision someone made, not a default that
  arrives with a component library.
- **Options considered**
  1. No nav until block 6, per the copy draft — strongest version of the page's
     own argument; unconventional, and some visitors will scroll looking for a menu.
  2. Persistent navbar from `y=0`, per the hi-fi and the sitemap — conventional and
     safe; costs the immersion the first five blocks are built for.
  3. Navbar that appears on scroll, after block 5 — keeps the argument and gives
     the reader a way out. Not in any source document; would need drawing.

---

## D25 — Where the empty state's "ask us what exists" goes

- **Category** — Information architecture / content
- **Status** — Proposed · **Visibility** — Shared · **Owner** — Marc
- **The decision** — What the offer in The Record's empty state actually links to.
- **Context** — The Record draft writes its own empty state, which is unusual:
  *"Nothing here yet under that. Try another subject, or ask us what exists."*
  The second half is a genuine offer, and it currently has no destination.
- **Why it matters** — Small, but it is the only empty state on the site that
  invites a conversation instead of apologising, and it fits the page's own
  argument that the record is incomplete. Left unanswered it will ship as
  unlinked text, which turns a good line into a dead one. Candidates are the
  general contact form on Connect and the *"Do you hold something?"* block further
  down the same page.

---

# Part 2 — Decisions made

Settled. Recorded so the reasoning survives the people who were in the room.
Record as **Final**, except F1 which is **Superseded**.

---

## D1 — Blog and Resources are one page · **RESOLVED**

- **Category** — Information architecture
- **Status** — **Final** (20 Aug) · **Visibility** — Shared · **Owner** — Marc, with Ivy
- **The decision** — One editorial collection on **one page**, holding several
  resource types inside it — posts, guides, events, downloads — separated by
  filters rather than by page. Blog is **not** a second browse interface and
  does not get its own top-level area.
- **Context** — The build documentation always described one unified collection
  with a single filterable hub; the uploaded sitemap had added a parallel Blog
  area with overlapping contents. The walkthrough confirmed the documentation.
- **Why** — Two browse interfaces over the same posts confuse editors (which
  one do I publish to?) and visitors (why are there two archives?). One page
  with filters gives the same reach with one content model.
- **The label** — **Resources.** August's rule (20 Aug) is that the page takes
  a parent term broad enough to hold every kind of thing inside it — media,
  blog posts, articles, guides, events, downloads. "Blog" names one of those
  children and cannot sit above the others; "Resources" already satisfies the
  rule, and is the word used in both the build documentation and the client's
  own sitemap slide, so it costs no churn. `src/content/site.ts` keeps its
  current nav string.
- **Note** — This closes the largest open question in the IA.

---

## D3 — FAQs are CMS-managed · **RESOLVED**

- **Category** — Content
- **Status** — **Final** (20 Aug) · **Visibility** — Shared · **Owner** — Marc, with David
- **The decision** — The FAQs page is a **CMS-managed collection**, not a
  static page. The client edits questions and answers without a deploy.
- **Context** — FAQs appear in the uploaded sitemap and nowhere in the build
  documentation. There was no spec, no content model and no named author.
- **Why** — FAQs change constantly and are exactly the kind of content a
  non-technical team should own. It is a cheap content type: question, answer,
  category, order.
- **Still to settle** — Nobody is named to *write* it, and there is still no
  scope for what it covers. Being CMS-managed answers where the words live, not
  where they come from. Ties back to D10.
- **Note** — → task for David: model FAQs as a collection (question, answer,
  category, sort order) in Phase 6.

---

## D6 — The Living Work failure section · **SUPERSEDED BY v2**

- **Category** — Content
- **Status** — **Superseded** (20 Aug, same day) · **Visibility** — Shared · **Owner** — Marc and August, with the client
- **What happened** — Recorded as **keep** in the morning; the v2 draft uploaded
  later the same day **does not contain the section**. Under D5 the document
  governs copy, so the document wins and this decision is closed as superseded
  rather than reversed by an argument.
- **What replaced it** — An expandable **Our challenges** list of thirteen
  items: overgrazing, degraded springs, soil carbon loss, wrong-way fire, weeds
  and ferals, heat and drought, distance from town, no phone reception, water
  security, site damage, unidentified species, ranger funding ahead of income,
  natural-capital market volatility.
- **Why that is a different thing** — The challenges list describes the
  condition of the Country and the organisation's exposure. The failure section
  described work this organisation tried that did not work — the broken grader,
  the failed bore pump. The candour survives in places (the spring that took a
  thousand litres carted twice a day for eight days; rangers "learning the job
  as it went") but as detail inside success stories, not as a section that names
  failures.
- **One confirmation wanted** — that the cut was deliberate rather than lost in
  the rewrite, given "keep" was recorded hours earlier. If it was deliberate,
  nothing more to do; the reasoning below is kept for the record.

The reasoning as it stood when this was Final:
- **The decision** — Living Work keeps the content written for other Indigenous
  communities, including the failure section — the broken grader, the failed
  bore pump. It stays on the public page.
- **Context** — The Living Work text was written to answer other Indigenous
  communities asking how the system was actually built. That is the section's
  reason for existing, and it is the audience the pillar names.
- **Why** — Practitioners find failures more useful than successes. Cutting the
  section to sit more comfortably with a government funder reading the same
  page would weaken it for the reader it was written for.
- **Read with care** — The walkthrough confirmed the *audience and the
  content*; it did not name "The parts that are not in the annual report" in as
  many words. Keeping it is the only reading consistent with a section written
  for communities asking how it was built, so it is recorded as **keep**. If
  that is wrong it reverses in one move, as the draft itself says.
- **Pending (20 Aug)** — August is uploading the authoritative page
  content/copy document. **Keep** is the working position until it lands; if
  that document drops the section, it is the document that wins, per D5.
- **Note** — The Living Work draft is `shared with care` in
  `docs/content/STATUS.md`; that circle is unchanged by this.

---

## D7 — Fee-for-service land management sits under Living Work · **RESOLVED**

- **Category** — Information architecture
- **Status** — **Final** (20 Aug) · **Visibility** — Shared · **Owner** — Marc and August
- **The decision** — Fee-for-service land management and cultural advisory live
  under **Living Work**. The page is **informational** and ends in a call to
  **book a consultation**. **No fees are published on the site.**
- **Context** — The Ten-Year Strategic Plan names this as a real revenue stream
  (Goal 3.5) at Year 4. The sitemap marked it NOT YET PLACED and the Living
  Work draft left it off. Its audience is neighbouring and regional
  landholders.
- **Why** — Living Work is where the land-management practice is already
  described, so a landholder arriving there is already reading about the
  capability being offered. Keeping prices off the page avoids anchoring a
  quote before the scope of a job is known, and keeps a consultation as the
  first contact.
- **Done in v2 (20 Aug)** ✅ — Living Work v2 carries it twice, as specified. A
  *Being developed* card under **What the work produces**: "Ranger skills
  offered to neighbouring properties — right-way fire, land management and
  cultural heritage advice." And a **Land management services** pathway under
  **Get involved**: "Right-way fire, cultural heritage advice and Country
  management for properties in the district", with an **Enquire** call to
  action. No prices published; informational; ends in an enquiry.
- **One word to settle** — this decision says "book a consultation", the draft
  says "Enquire". Not a conflict, but the button needs one label.
- **Note** — Supersedes note 4 in `docs/content/STATUS.md`, which still records
  this as unplaced.

---

## D10 — August owns the copy on every page · **RESOLVED**

- **Category** — Content
- **Status** — **Final** (20 Aug) · **Visibility** — Shared · **Owner** — August
- **The decision** — **August has final say on content and copy for every
  page.** Not one owner per page — one owner, all pages.
- **Context** — Raised at the 18 August briefing and left open; four page
  drafts existed with no recorded author. August wrote the Living Work text
  (the walkthrough's "Speaker A") and is uploading the authoritative
  content/copy documents.
- **Why** — Approval routing needs a name, and a per-page split across a team
  this size would have produced four routes and four people to chase. One
  owner is simpler and matches who is actually writing.
- **What it does not override** — Cultural content. Suzanne Thompson's words,
  the Truth timeline and the Welcome to Country are hers to approve, not
  August's to sign off (R1, R5). Copy ownership is editorial authority, not
  cultural authority.
- **Reads with D5** — the draft documents govern the words; August governs the
  drafts.

---

## D5 — The draft documents are the source of truth for copy · **RESOLVED**

- **Category** — Content
- **Status** — **Final** · **Visibility** — Shared · **Owner** — Marc, with August
- **The decision** — The draft documents in `docs/content/drafts/` govern page
  **copy and content**. They do **not** govern web design — the lo-fi and hi-fi
  wireframes are the source of truth for that.
- **Context** — The copy in `src/content/homepage.ts` had been reconstructed
  from the build documentation before the drafts existed, and the two had
  drifted apart — different hero subhead, and Invitation cards titled
  *Experience Country / Research Together / Learn from Living Work* rather than
  *Wonder / Truth / Living Work*.
- **Why** — Two versions of the homepage copy were in circulation with no rule
  for which won. Splitting it by artefact type — drafts own words, wireframes
  own design — means neither has to arbitrate the other.
- **Done** — `src/content/homepage.ts` was matched to
  `YACHATDAC-Homepage-Copy-v2.md` on 20 Aug, with one deliberate exception: the
  draft's Acknowledgement of Country named the Northern Territory and was
  **not** copied across. See risk R1.
- **Now stale (24 Aug)** — the drafts moved to **v3**
  (`docs/content/drafts/homepage/YACHATDAC-Homepage-Copy-v3.md`), which changes
  the homepage from seven beats to six and replaces the Truth beat outright.
  The file has **not** been re-synced; that is its own change, not a wording
  refresh. See `docs/content/STATUS.md` note 11.
- **Applies to converted prototypes too (24 Aug)** — the v3 drafts arrived as
  coded HTML pages. D5 still splits them the same way: the **words** in the
  prototype govern copy, the **layout, styling, scroll behaviour and
  interaction** in it do not. A prototype that implies a design is a suggestion
  to the wireframes, not an instruction. This matters more with a prototype
  than with a document, because the design is executed rather than described
  and reads as settled when it is not.

---

## F1 — Homepage copy lives in the repo, not the CMS · **SUPERSEDED**

- **Category** — Architecture · **Status** — **Superseded** by D12 · **Owner** — August
- **What it said** — Homepage copy lives in `src/content/homepage.ts` and
  changes only by pull request, because the homepage is one authored narrative
  rather than a collection of entries.
- **Why it was replaced** — Confirmed with August that homepage copy will be
  CMS-editable like every other page. The reasoning behind the original call
  (protecting a carefully written narrative from casual edits) is real, but it
  is an editorial-permissions problem, not an architectural one — the CMS
  already has a draft → review → approved workflow for exactly that.

---

## D12 — Homepage copy is CMS-editable · **RESOLVED**

- **Category** — Architecture
- **Status** — **Final** · **Visibility** — Shared · **Owner** — August
- **The decision** — Homepage **copy** is editable in the CMS. **Design,
  animation, motion and section structure are not** — those stay in code.
- **Context** — Supersedes F1. Confirmed with August.
- **Why** — The client's team is small and non-technical. Making them raise a
  pull request to fix a typo on the most-read page of the site is the wrong
  trade. Editorial safety comes from the CMS approval workflow instead.
- **Build implication** — The homepage becomes a CMS content type (a singleton
  page with one entry per beat), not a hardcoded module.
  `src/content/homepage.ts` is now the **seed/default** the CMS is populated
  from, and is marked as such in the file. Nothing downstream should assume
  those strings are compile-time constants.
- **Note** — → task for David: add the homepage to the CMS content model
  (Phase 6). Not blocking anything today.

---

## D13 — Donations are deferred out of launch scope · **RESOLVED**

- **Category** — Legal / compliance
- **Status** — **Final** (20 Aug) · **Visibility** — Shared · **Owner** — David, with August and the client
- **The decision** — No donations feature at launch. Donation flows, receipt
  logic and any tax-deductibility copy come out of the 14 September build and
  wait on confirmed DGR status.
- **Context** — DGR status is unverified. Earlier information said YACHATDAC is
  a registered DGR; the Ten-Year Strategic Plan lists securing it as a Year 1
  goal. Donations had been live scope at launch. See risk R8.
- **Why** — Asking the public for money on a page that implies deductibility
  the organisation cannot yet offer is a compliance problem, not a wording
  preference. Deferring is reversible; a wrong receipt is not.
- **One precision worth keeping** — the walkthrough put this as "cannot legally
  receive donations until DGR approval". DGR governs whether a gift is **tax
  deductible**, not whether a charity may receive gifts at all — an
  incorporated charity can generally accept donations without it, subject to
  state fundraising rules. The deferral is the safe call either way and is
  recorded as given; but if the client later wants a plain donate button with
  no deductibility claim before DGR lands, that is a live option rather than
  the legal impossibility this currently reads as. Worth putting back to them.
- **Confirmed (20 Aug)** — August confirms the deferral stands as written. DGR
  is expected eventually rather than never — "sooner or later" — so this is a
  *not yet*, not a *never*. Build nothing that assumes it, and leave the door
  open: when DGR lands, donations come back as scope with the receipt logic
  written against a confirmed status.
- **Build implication** — The earlier settled position ("donations: both
  one-time and recurring") describes the eventual shape, not launch scope. Any
  donation-related roadmap work moves out of the launch phase.

---

## D14 — CMS roles, and how approvals reach the CMS · **RESOLVED**

- **Category** — Governance
- **Status** — **Final** (20 Aug) · **Visibility** — Shared · **Owner** — David, with Marc
- **The decision** — The CMS carries three roles — **admin**, **editor**,
  **viewer**. Elders and older community members will not log in themselves;
  approvals are relayed by a secretary/intermediary — recorded as **Leo** — who
  holds an account and enters what has been approved.
- **Context** — Cultural permissions for media have to be given by people who
  do not use the CMS. Without a route, approvals either stall or get applied by
  whoever happens to be at a keyboard.
- **Why** — Naming the relay makes the path visible. It is also consistent with
  the build documentation's position that the CMS Admin role is the *technical
  enforcement layer* for the Elder Advisory Group's decisions, not an
  independent judgment call.
- **What this does not settle** — Leo is the **route**, not the **authority**.
  The person who approves a cultural permission is still unnamed (D9), and
  R10's three open permissions are unchanged by this. A proxy-entered approval
  also needs a trail — who approved, when, and on what — or the CMS records
  only that the intermediary pressed the button.
- **Confirmed (20 Aug)** — Leo and **Leonard Mickelo** are **different
  people**. Leo is the secretary relaying approvals; Leonard is the artist. The
  artwork-motion permission in R10 is therefore still an approval to be sought
  from someone else, not one Leo can enter on his own authority.
- **Note** — → task for David: an approval-attribution field (approver name,
  date, basis of approval) on every culturally-governed content type, plus role
  permissions matching admin / editor / viewer.

---

## F4 — Motion tiers, and a budget of two signature moments

- **Category** — Motion · **Status** — Final · **Owner** — JC
- **The decision** — Tier 1 (pinning, scrubbing, parallax, WebGL, signature
  moments) is homepage-only. Everything else, including every CMS-generated
  page, is Tier 2: entry staggers and hover states. Two signature moments on
  the homepage, total.
- **Why** — A CMS template must not be able to produce Tier 1 motion, or the
  site's motion vocabulary drifts every time an editor publishes. In code the
  split is enforced by keeping Tier 2 on IntersectionObserver and CSS with no
  GSAP dependency.

---

## F5 — Only Work Sans is tracked in git

- **Category** — Legal / compliance · **Status** — Final · **Owner** — August
- **The decision** — Work Sans (SIL OFL 1.1) is committed. Block Berthold and
  Bantayog Sans are gitignored and distributed through the Proyekto resources
  section.
- **Why** — Block Berthold carries an Adobe / H. Berthold AG copyright. A
  commercial font binary is far easier to keep out of a repository than to
  remove from its history later. Reversing this is one line in `.gitignore`
  once licences are confirmed.

---

## F6 — Local dev runs on port 3001

- **Category** — Tooling · **Status** — Final · **Owner** — August
- **The decision** — `npm run dev` is pinned to port 3001.
- **Why** — Port 3000 is occupied by a local Proyekto instance. Next.js will
  report "Ready" on 3000 when its own earlier process holds the port, so a
  browser check can silently land on the wrong app — which happened once during
  setup.

---

# Part 3 — Decisions on hold

Deliberately not settled yet. There is no final homepage design, and the lo-fi
and hi-fi wireframes are the source of truth for web design — so these wait.

Each entry separates the **interim position** (what is built today, and what
would change) from **what does not change with the design** — the cultural
constraints underneath, which a wireframe cannot clear. Those lift when a
permission is recorded, not when a design is drawn.

---

## F2 — The homepage thread is a plain vertical rule · **ON HOLD**

- **Category** — Motion / cultural governance · **Status** — Proposed (on hold)
  · **Owner** — August, with Ivy and JC
- **On hold because** — There is no final homepage design yet. The lo-fi and
  hi-fi wireframes are the source of truth for web design, so this is not
  recorded as Final until they land.
- **The interim position** — What is built today: a straight vertical progress
  rule, no meander, no waypoint nodes.
- **What does not change with the design** — Sketch C1 (continuous line with
  lit waypoints) is on **hold** in the motion skill because a meandering line
  with waypoints reads as Aboriginal iconography and needs sign-off. That is a
  cultural constraint, not a design preference, so a wireframe drawing a
  meandering path does not clear it — decision D9 (who signs off motion) does.
  Until then the plain rule is the only cleared option.

---

## F3 — The homepage Truth beat is typographic · **ON HOLD**

- **Category** — Content / cultural governance · **Status** — Proposed (on
  hold) · **Owner** — August, with Ivy
- **On hold because** — Same as F2: the wireframes decide the visual treatment
  of this beat, and they do not exist yet.
- **The interim position** — What is built today: typography and ground colour
  alone, no imagery.
- **What does not change with the design** — Story-wall imagery permission is
  unresolved and is treated as unavailable, and the motion skill forbids
  animating cultural-site imagery in any form. A wireframe specifying a photo
  of the engravings would not unblock it; the permission would. See risk R10.

---

# Part 4 — Risks & Issues

**Issue** = already true. **Risk** = might become true.

---

## R1 · ISSUE · High — Acknowledgement of Country names the wrong jurisdiction

- **Owner** — Marc and August → Suzanne Thompson
- **What is happening** — The homepage copy draft acknowledges *"the Aboriginal
  people of the Northern Territory."* YACHATDAC is on **Iningai Country,
  Central Western Queensland** — Turraburra sits 120km north of Barcaldine. It
  reads as boilerplate carried over from another organisation's site.
- **Impact** — For an organisation whose entire proposition is that the Iningai
  were written out of the record, an acknowledgement naming the wrong Country
  is the single worst copy error available on this site. It would be noticed,
  and it would be quoted.
- **Next step** — Do not fix by substitution. Suzanne is an actual Traditional
  Owner, so a genuine **Welcome to Country** in her own words is possible here,
  which is rarer than the Acknowledgement most sites carry. Her wording is
  already outstanding — this is the same ask.
- **Current mitigation** — The footer renders a visibly marked placeholder that
  cannot ship unnoticed.
- **Who approves (confirmed 20 Aug)** — Both, in order. **Steve** is from
  **FNAN** (First Nations Action Network), the organisation that brought
  YACHATDAC to us; he reviews the wording and the jurisdiction. **Suzanne
  Thompson remains the owner** — as a Traditional Owner she is the one who can
  give a genuine Welcome to Country in her own words, and hers is the approval
  that lets it publish. Steve's review does not substitute for it.
- **Practical order** — Steve first, on the jurisdiction, which is the error
  that must not ship. Suzanne second, on the words themselves, as part of the
  same conversation as R5.
- **Downgrade to Medium (24 Aug)** — the v3 homepage draft **drops the Northern
  Territory paragraph**. The footer now reads *"Turraburra is Iningai Country.
  We are its Traditional Custodians, and we are still here,"* and marks itself
  *"[ DRAFT for Suzanne to correct or replace ]"*, adding that it is written as
  a statement of custodianship and welcome, **not** an Acknowledgement — an
  acknowledgement being something visitors make on Country that is not their
  own. That distinction is correct and is what open decision 3 was circling.
  The jurisdiction error is gone; what remains is a placeholder awaiting
  Suzanne's words, which is the ordinary risk, not the severe one. Steve's
  review is no longer blocking. Re-title this issue accordingly when it is
  copied into Proyekto.

---

## R2 · ISSUE · **RE-ANSWERED BY v2** — the site has never been dated

> **Superseded within the day.** The 20 Aug answer below was **55,000 years**.
> The v2 drafts uploaded later that day say the site has **never been
> scientifically dated**, and say it consistently across all three. Under D5 the
> documents govern copy, so the v2 position stands. The original entry is kept
> underneath because the reasoning matters — this is the second time this claim
> has moved.

- **The answer that now stands (v2)** — The site has **never been scientifically
  dated**. The pecked designs are **likely more than 5,000 years old on regional
  style sequences**. Mud wasp nests over some engravings **could give minimum
  ages if they are ever sampled** — a method available, not a dating done.
- **Now sourced** — Truth v2 carries the full citation: *Marra Wonga:
  Archaeological and contemporary First Nations interpretations of one of
  central Queensland's largest rock art sites*, Australian Archaeology, 2022,
  with DOI. That closes the "confirmed but unattributed" gap — against a
  different figure from the one it was opened against.
- **Consistent across v2** — Homepage: "Nobody has dated it." Wonder: "Never
  scientifically dated." Truth: as quoted above. No contradiction left.
- **Where 55,000 came from** — the v1 homepage sentence, "A wasp nest built over
  the story wall's markings let researchers date them — at least 55,000 years
  old, by the most conservative estimate." On the v2 reading that describes a
  dating that never happened. It looks like the error was in v1 all along, and
  the Truth timeline's caution was right.
- **Highest-priority code change in the repo** — `src/content/homepage.ts` still
  carries the 55,000 sentence, synced from v1 under D5. It is a public claim
  about cultural heritage that the source of truth now contradicts. Replace it
  with the v2 wording, and delete the ⚠ comment above it, which describes the
  old 55,000-vs-5,000 conflict.
- **Two things to confirm with August** — that the reversal is deliberate rather
  than a drafting slip; and the v2 homepage sentence itself, which does not
  parse: *"The wasp nests that could be still sitting over the engravings,
  waiting for someone to ask."*

<details>
<summary>The 20 Aug entry, superseded</summary>

## R2 · ISSUE · **RESOLVED (superseded)** — Story wall dating is at least 55,000 years

- **Owner** — Marc and August → client / researchers
- **What was happening** — Homepage and Wonder both said the engravings are at
  least **55,000** years old. The Truth timeline said at least **5,000**, and
  carried its own "dating under review" note. A factor of ten apart, in a
  public claim about cultural heritage, on a page whose argument is that the
  record has been got wrong before.
- **The answer (20 Aug)** — **At least 55,000 years.** Homepage and Wonder were
  right; the Truth timeline is the outlier.
- **Still to do**
  1. The Truth timeline draft carries the wrong figure and its own "dating
     under review" note. August is re-uploading it with the page content/copy
     — the corrected figure needs to be in that upload, and it needs to be
     right *before* the draft goes to Suzanne (R5), not after.
  2. `src/content/homepage.ts` already reads 55,000 and is correct, but the ⚠
     comment above the Truth beat still describes the conflict as unresolved.
     Stale — clear it when the file is next touched.
  3. `docs/content/STATUS.md` note 2 is likewise stale.
  4. The number is confirmed but **not yet attributed**. The 2022 Marra Wonga
     study is still the obvious citation, and a heritage claim this specific
     should carry its source.

</details>

---

## R3 · RISK · High — Block Berthold has no confirmed webfont licence

- **Owner** — Marc and August → brand team
- **What could go wrong** — Block Berthold ships an Adobe / H. Berthold AG
  copyright. It is a commercial retail typeface, and a desktop licence does not
  cover serving the file over the web; `@font-face` distribution needs a
  separate webfont licence, usually priced by pageviews or domain.
- **Impact** — Serving it without one exposes YACHATDAC to a licensing claim.
  Discovering this after launch means either buying a licence under pressure or
  re-typesetting every headline on the site.
- **Next step** — Confirm whether the brand team or YACHATDAC holds a webfont
  licence. If not, price one or choose a replacement headline face **before**
  hi-fi mockups lock the typography.
- **Current mitigation** — Installed and working locally; kept out of git.
- **Update (20 Aug)** — Confirmed still open, with the ask sharpened: **ask
  Marc whether the fonts have already been purchased.** Recorded in the
  walkthrough as "Blackber", which is the transcript's rendering of **Block
  Berthold**. A purchase alone is not the answer — the question is specifically
  whether the licence held covers **webfont** use, since a desktop licence
  usually does not.

---

## R4 · RISK · Medium — Bantayog Sans licence unknown

- **Owner** — Marc and August
- **What could go wrong** — Bantayog Sans arrived with no licence file at all.
  Terms are simply unknown.
- **Impact** — Same class of exposure as R3, on the subheadline and eyebrow
  face.
- **Next step** — Ask whoever supplied it for the licence, and file it beside
  `WorkSans-OFL.txt`. Fold it into the same question to Marc as R3 — one
  conversation, two fonts.
- **Note** — The 20 Aug walkthrough used "R4" to mean Suzanne's approvals,
  which is **R5** in this file. This risk was not discussed and is unchanged.

---

## R5 · RISK · High — Suzanne's approvals are on the critical path

- **Owner** — Marc and August
- **What could go wrong** — Two items need Suzanne Thompson personally: the
  Welcome to Country wording, and the Truth timeline, which carries her words
  from the Unfinished Business and Yacadak Framework recordings and states on
  its own face that nothing publishes until she has signed it off.
- **Impact** — Neither can be worked around, delegated, or drafted on her
  behalf. Launch is 14 September. If these are left until content load, they
  become the thing that moves the date.
- **Next step** — Get both in front of her early, as one conversation. Note the
  Truth draft also asks her a specific question — whether re-ordering her story
  so the count of thirty-five comes before the blankets is acceptable, or
  whether it wants telling forwards.
- **Update (20 Aug)** — Reconfirmed as critical path (called "R4" in the
  walkthrough; **R5** here). Spelling confirmed: **Suzanne** Thompson, not
  Susan. Use that everywhere.
- **Now also in scope for her** — the Truth timeline's dating correction from
  R2. Send the corrected draft, not the current one.

---

## R6 · RISK · High — Lo-fi wireframes are due 21 August with the IA still open

- **Owner** — Ivy, with Marc and August
- **What could go wrong** — Lo-fi wireframes are due in two days, but the
  sitemap raises four unanswered structural questions (D1–D4) and the roadmap
  task "Define the site map and information architecture" is still open.
  Wireframing an IA that then changes means redrawing.
- **Impact** — Slips into the hi-fi window (28–31 August), which is already
  tight against a 14 September launch.
- **Next step** — Answer D1 and D2 first; they are the two that change page
  structure. D3 and D4 can trail without blocking wireframes.
- **Update (20 Aug)** — Largely mitigated. **D1 is answered** (one page,
  filtered) and **D3 is answered** (FAQs are CMS-managed). **D2 was
  deliberately deferred until Marc reviews the lo-fi** — the exact inversion of
  the advice above. Workable, but it puts the burden on the drawing: draw
  Connect as present and structurally liftable rather than baking in either
  answer. D4 is naming only and never blocked wireframes. Downgrade to
  **Medium**.

---

## R7 · RISK · Medium — Wireframes may omit scroll spans and motion tiers

- **Owner** — Ivy and JC
- **What could go wrong** — Motion is structural on this site. If wireframes do
  not state scroll spans in `vh` and mark which sections are Tier 1, pinning
  gets retrofitted into a layout that has no room for it.
- **Impact** — Rework at the front-end stage, and pins that land in the wrong
  place.
- **Next step** — Express spans in `vh` (standard section 100vh; pinned
  step-through ~320vh for four steps; pinned panorama ~250vh) and name
  behaviours by their sketch ID from the motion skill's library.

---

## R8 · RISK · Medium (was High) — DGR status is unverified

- **Owner** — David, with the client
- **What could go wrong** — Earlier information said YACHATDAC is a registered
  DGR. The Ten-Year Strategic Plan lists securing DGR status as a *Year 1
  goal*, which reads as not yet secured.
- **Impact** — Donation copy or an emailed receipt claiming tax-deductibility
  without DGR status is a compliance problem, not a wording preference.
- **Mitigated (20 Aug)** — Confirmed unverified, and **donations are deferred
  out of launch scope** — decision D13. That removes the launch exposure; it
  does not remove the risk, which now sits on whenever donations are built.
- **Next step** — Verify directly against the organisation's actual ACNC and
  state charity registration. Do not rely on either prior answer. Nothing on
  the site should claim or imply deductibility until it is confirmed in
  writing, and no donation copy should be drafted against an assumed status.
- **Scope consequence** — Donation flows come out of the 14 September build.
  Check whether the roadmap still carries donation tasks in a launch phase; if
  it does, they move.

---

## R9 · RISK · Medium — Legal pages must exist before any form goes live

- **Owner** — David
- **What could go wrong** — Newsletter signup, donations, merch orders and
  every enquiry form collect personal data. The Privacy Policy, Terms and
  cookie notice are currently route stubs with no content.
- **Impact** — Collecting personal data without a privacy policy is an
  Australian Privacy Act exposure. GA4 sets tracking cookies, which the notice
  must cover.
- **Next step** — Draft, then have them legally reviewed rather than only
  drafted internally. The newsletter field on the homepage is deliberately
  inert until this lands.

---

## R10 · RISK · Medium — Cultural permissions are unresolved and unowned

- **Owner** — Marc and August → Elder Advisory Group
- **What could go wrong** — Three permissions are open on the motion skill's
  board: artwork motion (vectorised artwork received, no motion permission
  recorded), land and terrain detail level, and story-wall imagery. None has a
  named approver, because D9 is itself unresolved.
- **Impact** — Work proceeds against placeholders indefinitely, or somebody
  makes the call informally — which is the specific failure the Elder Advisory
  Group exists to prevent.
- **Next step** — Settle D9 first, then take all three to whoever it names.
- **Current mitigation** — Artwork is static-only, terrain is abstracted with
  no real elevation data or place names, and the Truth beat is typographic.
- **Update (20 Aug) — a route, not an approver** — CMS roles are settled as
  admin / editor / viewer, and because elders and older community members will
  not log in, approvals are relayed by a secretary/intermediary recorded as
  **Leo** (decision D14). That is real progress on *how* an approval reaches
  the site. It is **not** progress on *who gives it* — this risk stays open at
  Medium and the three permissions are still unrecorded.
- **New sub-risk** — A proxy-entered approval with no attribution is
  indistinguishable from an approval nobody gave. Whatever David builds should
  capture who approved, when, and on what basis, so the record survives the
  people who were in the room. See D14.

---

## R11 · RISK · Medium — Media pipeline has no size or compression targets

- **Owner** — David, with ven and Joshua
- **What could go wrong** — Client video runs to 2GB per file and images are
  TIFF/RAW. No maximum file sizes or compression targets have been set, and the
  storage service has not been chosen.
- **Impact** — The homepage is video-led. Without targets, the above-the-fold
  payload budget (under 2.5MB) is decided by whoever exports last.
- **Next step** — Set targets before the homepage video is graded. Transcode
  background loops to roughly 1.2MB; never ship masters.

---

## R13 · RISK · High — Wonder's inclusions and cost are unwritten, and the draft says why that matters

- **Owner** — August, with the client
- **What could go wrong** — Wonder v2 flags two gaps on its own face. The
  *What's included / Guiding / Camping / Transfers* block carries **"NEEDS
  CONFIRMATION — every line above. This section is the most common reason an
  enquiry does not happen."** And cost is marked **"still undecided — publish a
  from-price, or state plainly that it is quoted per group."**
- **Impact** — The page is built around a sticky enquiry panel; these two blocks
  sit directly on its only conversion. A visitor deciding whether to drive 120km
  of dirt road wants to know what a stay includes and roughly what it costs.
  Shipping the page with either unresolved wastes the page.
- **Next step** — Two answers from the client: the actual inclusions, line by
  line; and cost as either a from-price or an explicit "quoted per group". The
  second is a decision, not a lookup — record it when it lands.
- **Note** — "No fixed dates, no pricing on this page" is already the draft's
  stated approach, which is consistent with the settled no-booking-flow
  position. Saying *why* there is no price is the part still missing.
- **Half resolved in v3 (24 Aug) — downgrade to Medium.** Cost is answered, in
  the draft's own words: *"No fixed dates and no pricing on this page — every
  stay is arranged with you."* That is the second option this risk offered,
  stated plainly, and it says why. **Inclusions are not answered**: the section
  is now written out — Meals, Guiding, Camping, Transfers, with Suzanne, Graham
  Ambridge and the Iningai Rangers named as hosts — but still carries *"NEEDS
  CONFIRMATION — every line above needs Suzanne or Steve to confirm before
  publishing."* Two lines are placeholders in substance too: *"What we provide
  and what you bring"* does not say what is provided, and transfers are
  *"available … for an extra cost"* with no cost. Re-scope this risk to
  inclusions only.

---

## R14 · RISK · Medium — Living Work publishes regulatory status labels nobody has confirmed

- **Owner** — August, with the client
- **What could go wrong** — Living Work v2's *What the work produces* section
  labels each stream **Registration underway**, **Building the record**, **In
  progress** and **Being developed**, and carries the note **"Status labels to
  be confirmed before publishing."** Separately the **Rainbow Credits** card is
  marked **"FOR YACHATDAC TO WRITE"** — what it is, what is measured, who it is
  for, and where it sits with the Rainbow Foundation.
- **Impact** — These are public claims about carbon registration, biodiversity
  credit work, IPA designation and Native Title. Getting a status label wrong on
  a page aimed partly at funders and credit buyers is a credibility problem, and
  potentially a representation one. The unwritten card is a hole in a section
  that otherwise reads as complete.
- **Next step** — Have the client confirm each label against the actual
  registration state, and write the Rainbow Credits card. Neither is a design
  question; both block publishing that section.
- **Also noted** — the draft's own "Consider a fourth card for donations if DGR
  status is in place" is consistent with D13, and is a useful marker for what
  gets switched on when DGR lands.

---

## R15 · ISSUE · Medium — The organisation's legal name is unconfirmed and hardcoded sitewide

- **Owner** — August, with Marc → Suzanne Thompson
- **What is happening** — Homepage v2's footer carries "[ … confirm spelling
  against ORIC registration ]", and the About draft says why there is a doubt on
  its own face: *"Confirm spelling: Yambangku or Yumbangku — the logo and the
  published research differ."* `src/content/site.ts` asserts **Yambangku** in
  `org.legalName`, and that string renders in the footer and in page metadata on
  **every route**. ICN and ABN are both still blank.
- **Impact** — Getting an organisation's registered name wrong across an entire
  site is a small error with a bad shape here: this is a client whose own
  argument is that they were recorded wrongly by other people. It would be
  quoted back.
- **Next step** — Check against the ORIC register, which is authoritative and
  public, rather than against the logo. Collect ICN and ABN in the same ask.
- **Current mitigation** — None. The name is a plain constant today and reads as
  settled to anyone who opens the file. Worth marking unconfirmed in the code
  while someone is chasing it.

---

## Note — draft imagery is placeholder direction (20 Aug)

Confirmed by August: the image, gallery and carousel blocks in the v2 documents
are **placeholders**. They describe what a shot should carry; none names an
asset that exists. Treat every slot as swap-in-ready and do not build layout
that depends on a particular crop. This is consistent with the settled
"commissioned artwork is not blocking — placeholder-first, swap-in-ready"
position, and it does **not** soften R11: placeholders are the cheapest moment
to set size and compression targets, not a reason to defer them.

---

## R12 · RISK · Low — Brand assets outstanding

- **Owner** — Marc and August
- **What could go wrong** — Logo vector files (SVG/EPS) and the Good Dog Cool
  callout face have not been supplied.
- **Impact** — Low. The header renders a marked text placeholder and the
  callout face has a reserved slot; neither blocks the build.
- **Next step** — Supply when convenient. Do **not** recreate the logo in code
  in the meantime.

---

## R22 · RISK · Medium — Ngapartji-Ngapartji is Western Desert language, not Iningai

- **Owner** — Marc and August → Suzanne Thompson
- **What could go wrong** — The client's Ten-Year Strategic Plan frames
  reciprocity as the *Ngapartji-Ngapartji* principle. The About draft flags that
  this is Western Desert language and asks for it to be confirmed.
  `src/content/truth.ts` currently *recommends* framing the Truth enquiry form
  with it.
- **Impact** — Truth's entire argument is that the record was got wrong about
  these people by outsiders who used the wrong names. Framing that page's
  reciprocity ask in another nation's language is the specific error the page
  indicts, and researchers are the audience most likely to notice.
- **Next step** — Ask Suzanne. The client's own plan uses the term, so this is a
  question, not a correction to make unilaterally — there may be a deliberate
  reason, or an Iningai word that belongs there instead.
- **Current mitigation** — It is a spec note in `truth.ts`, not rendered copy. The
  cost of settling it is zero until the enquiry form is written.

---

## R23 · ISSUE · Low — Four copy details are unanswered and unowned

- **Owner** — Marc and August → the copy owner (which is **D10**, still open)
- **What is happening** — Four small questions are marked on the wireframes and
  belong to nobody:

  | # | Detail | Where |
  | --- | --- | --- |
  | 1 | Turraburra has no reliable mobile coverage. If a phone number is published, which hours is it answered? | About, *Get in touch* |
  | 2 | The "on request" gate has no stated response time and no contact point. | The Record, *Items marked on request* |
  | 3 | Five-Year Review shows `2031` as both its meta line and its status pill — the export collapsed two fields into `20312031`. Every other row is `<meta>` + `<status>`, so the status probably wants to read *Committed*. | The Record, *Documents and reports* |
  | 4 | The Cultural Knowledge Precinct is tagged **Written record** in the copy draft, but it is a building that does not exist yet — *"master planning is underway"*. An evidence tag on a future facility reads as a PDF-extraction artefact. | Truth, *Ahead* |

- **Impact** — Individually trivial. Together they are the reason **D10** matters:
  four questions that any copy owner could answer in ten minutes have been sitting
  on wireframes because no page has a named owner. Items 1 and 2 are the ones that
  reach the public as a broken promise — a phone number nobody answers, and a
  request process with no stated response.
- **Next step** — Answer them in the same pass as D10, rather than as four
  separate asks.
- **Current mitigation** — All four are marked on the frames and none is invented
  copy; the drafts' own bracketed notes are preserved where they exist.

---

# Part 5 — Roadmap housekeeping

Small, and doable through MCP on request.

| Item | Action |
| --- | --- |
| "Set up the front-end project with fonts and design tokens" *(assigned JC)* | Substantially done — repo, tokens and fonts all landed. Move to **in_review**. |
| "Upload font assets (**Black Berto, Good Dog, Work Sense**)" | Meeting-transcript garble. Should read **Block Berthold, Good Dog Cool, Work Sans**. |
| "Lo-fi wireframes for inner pages (About, **Forums**, informational)" | There is no forum on this project. Likely "forms" or a mishearing — confirm and retitle. |
| "Define the site map and information architecture" *(urgent, open)* | Blocked on D1–D4. Consider marking **blocked** so the reason is visible. |
| **New task needed** — David, Phase 6 | Add the homepage to the CMS content model as a singleton page, one entry per beat. Follows from D12. Not blocking today. |
| **New task needed** — Marc/August | Confirm the legal page labels (D4) before the routes are built, so no URL has to change after launch. |

Added after the 20 Aug walkthrough:

| Item | Action |
| --- | --- |
| ~~Update the Living Work draft for fee-for-service~~ | **Done in v2** (D7). |
| ~~Upload the authoritative page content/copy~~ | **Done** — v2 uploaded 20 Aug. It answered R2 the other way; see below. |
| ~~Replace the 55,000 sentence in `src/content/homepage.ts`~~ | ✅ **Done 20 Aug.** Withdrawn claim replaced with the v2 wording, stale ⚠ comment gone. The v2 fragment is transcribed verbatim with the probable repair noted but not applied — the rewrite is August's, not the repo's. |
| ~~Re-sync the Invitation card eyebrows~~ | ✅ **Done 20 Aug**, along with *Indigenous* → **Iningai** in card 2 and the capitalised **Ranger** in card 3. `tsc --noEmit` clean. |
| **New task** — Ivy/JC | Decide whether v2's tagline — "Ancient traditions walking together with contemporary visions" — renders in The Way Forward. It is in `homepage.ts` as a field but `WayForward.tsx` does not draw it, deliberately: it is a design call for the wireframes. |
| **New task** — Ivy/JC | Reconcile `src/content/page-specs.ts` with v2: Truth is a reverse chronology, not a section stack; the "2 Night, 3 Day" guesting experience no longer exists — Wonder v2 runs stages and says "we do not run a set itinerary". |
| **New task** — August | Confirm with the client: the dating reversal (R2), the cut failure section (D6), Wonder's inclusions and cost (R13), the Living Work status labels and Rainbow Credits card (R14), and the ORIC spelling (R15). |
| **New task** — August | Rewrite the v2 homepage Truth sentence, which does not parse: "The wasp nests that could be still sitting over the engravings, waiting for someone to ask." |
| **New task** — David | Wonder v2 specifies its story feed as *three most recent Resources posts tagged #lore/#country/#guesting, editor can pin the first slot, falls back to most recent*. The build documentation's settled position is hand-picked, not query-driven. Model the hybrid deliberately. |
| **New task** — August | Brief the team on the IA position before lo-fi: Resources is one page (D1), Connect stays drawn but liftable pending Marc's review (D2). |
| **New task** — David, Phase 6 | Model FAQs as a CMS collection: question, answer, category, sort order (D3). |
| **New task** — David, Phase 6 | CMS roles (admin / editor / viewer) plus an approval-attribution field on culturally-governed content types (D14). |
| **Scope change** — David | Donations are out of launch scope (D13). Move any donation tasks out of the launch phase rather than leaving them open against 14 September. |
| **Note on the lo-fi task** — Ivy | Connect stays drawn but structurally liftable, pending Marc's review (D2). |
| **Stale docs** | `docs/content/STATUS.md` notes 2, 3 and 4 are superseded by R2, D6 and D7. The ⚠ comment above the Truth beat in `src/content/homepage.ts` is superseded by R2. |
