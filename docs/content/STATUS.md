# Content status board

One row per document. Update it in the same commit that moves a file between
folders.

**Circle** is the internal governance tag (build documentation §12) — `open`,
`shared with care`, or `held by community`. It is never shown to visitors, but
it decides who has to sign off.

## Documents

| Document | Page | State | Circle | Blocked on |
| --- | --- | --- | --- | --- |
| `YACHATDAC-Homepage-Copy-v1.pdf` | Homepage | 📥 draft uploaded | open | Acknowledgement names the wrong jurisdiction — note 1 |
| `YACHATDAC-Wonder-Copy-v1.pdf` | Wonder | 📥 draft uploaded | open | Story wall dating — note 2 |
| `YACHATDAC-LivingWork-Copy-v1.pdf` | Living Work | 📥 draft uploaded | shared with care | Practitioner-audience "what we got wrong" section — note 3 |
| `YACHATDAC-Truth-Timeline-v1.pdf` | Truth | 📥 draft uploaded | **held by community** | **Suzanne Thompson's approval — stated on the document itself** |
| `YACHATDAC-Sitemap-v1.png` | Site-wide | 📥 draft uploaded | open | Diverges from the build documentation IA — note 6 |

All five uploaded 19 Aug 2026. Nothing here is approved; nothing here has been
built from.

## Notes to resolve

These came out of reading the drafts. None of them block uploading — they block
publishing.

### 1. Acknowledgement of Country names the wrong jurisdiction

The homepage draft footer reads *"…the Aboriginal people of the **Northern
Territory**…"*. YACHATDAC is on **Iningai Country, Central Western Queensland**
— Turraburra sits 120km north of Barcaldine. This reads as boilerplate carried
over from another organisation's site.

For an organisation whose entire proposition is that the Iningai were written
out of the record, an acknowledgement naming the wrong Country is the single
worst copy error available on this site. It must not ship.

Related: open decision 3 — Suzanne is an actual Traditional Owner, so a genuine
**Welcome to Country** in her own words is possible here, which is rarer than
the Acknowledgement most sites carry. Her wording is still outstanding.

### 2. Story wall dating is inconsistent across drafts

| Draft | Claim |
| --- | --- |
| Homepage | "at least 55,000 years old, by the most conservative estimate" |
| Wonder | "marked at least 55,000 years ago" |
| Truth timeline | "AT LEAST 5,000 YEARS AGO — the engraving starts" (carries its own "dating under review" note) |

A factor-of-ten difference in a public claim about cultural heritage, on a page
whose argument is that the record has been got wrong before. Needs one number,
sourced, used everywhere. The Truth timeline already flags it, so this is
tracking it rather than discovering it.

### 3. "The parts that are not in the annual report"

The Living Work draft carries its own decision note: the failure section is
written for practitioners, who find failures more useful than successes, and may
sit badly with a government funder reading the same page. The draft says it can
be cut in one move.

Worth a deliberate answer rather than a default — the pillar's stated audience
is other Indigenous communities, not funders, and the section is the most
useful thing on the page for that reader.

### 4. Fee-for-service land management

Still has no home in the sitemap. The Living Work draft notes it sits at Year 4
in the Ten-Year Strategic Plan and leaves it off for now. That is a reasonable
holding position, not a resolution — see `docs/open-questions.md` item 8.

### 5. Truth page structure is a reverse chronology

The Truth draft is a scroll from *ahead* → *today* → back to *before people*,
with lore framed as the floor underneath rather than the oldest entry. That is a
stronger structure than the section outline currently in
`src/content/page-specs.ts`, which lists Truth as a conventional stack of
sections. Reconcile the two once the draft is approved.

### 6. Sitemap diverges from the build documentation IA

The uploaded sitemap is not the same information architecture as build
documentation §2, which is what `src/content/site.ts` is currently built from.
The differences are structural, not cosmetic, so the code has deliberately
**not** been changed — this needs a decision first.

**New top-level areas**

| In the sitemap | Build documentation says | Question |
| --- | --- | --- |
| **Blog** — Bookmarks, Categories, Archives, Search Blog, Blog Interior | One unified Blog/Editorial collection, surfaced through Resources/Explore. §4 is explicit that Resources *is* the content hub. | Are Blog and Resources two areas, or one collection surfaced twice? Two browse interfaces over the same posts will confuse both editors and visitors. If they are one thing, which name wins? |
| **Contact** — its own page with a contact form | The Connect index carries the general contact form, distinct from Truth's partner enquiry and Wonder's register-interest. | Is Contact replacing the Connect index, or sitting beside it? |
| **About** promoted into the navbar, separate from Connect | About YACHATDAC sits under Connect. | Does Connect survive as a nav item if About is lifted out of it? |
| **FAQs** in the footer | Not mentioned anywhere in the build documentation. | New content type with no spec — who writes it, and is it CMS-managed? |

**Things the sitemap drops**

- **Partnership opportunities** on Truth. §4 has this as a section distinct from
  research opportunities, aimed at the ESG/brand-buyer audience rather than
  researchers. The sitemap's Truth has only Open Research Opportunities.
- **Donations** and **Merch**. §7 has donations as live scope at launch and
  merch built-but-feature-flagged. Neither appears anywhere in the sitemap.
- **Site search** as a destination. §15 calls for in-site search across posts,
  opportunities, jobs and experiences; the sitemap has "Search Blog" scoped to
  Blog only.
- **Living Work** from the footer, though the other pillars are there.
- **The Cultural Knowledge Precinct** from the footer's Truth column.

**Probable errors in the diagram rather than decisions**

- Footer parent list reads About, Wonder, **Turth**, Resources, FAQs, Policies —
  "Truth" is misspelt.
- The footer's parent list and its child boxes do not line up: **FAQs** has no
  child box, and there is a **Connect** child box with no parent entry.
- That footer **Connect** column is character-for-character identical to the
  Resources column — Stories, News / Updates, Downloads, Videos / Podcasts.
  Reads as a copy-paste rather than an intent.

**Legend**

Green, orange and amber are used throughout with no key on the diagram. Adding
one would make the next review much faster — and if the colours encode build
status, that belongs in this status board too.

**Naming**

The sitemap says **Terms & Conditions** and adds a **Cookie Policy**; the repo
currently has `/legal/privacy` and `/legal/terms` ("Terms of Use") and no cookie
policy route. §11 does call for a cookie/consent notice, so the sitemap is
likely right — worth confirming the label before the routes are renamed, since
changing a legal page's URL after launch is avoidable churn.
