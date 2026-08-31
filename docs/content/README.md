# Content

*Last updated: 24 August 2026*

Page copy, sitemaps and IA documents — **upload here**.

Nothing in this folder is live. It is where written content sits while it moves
from draft to approved, before any of it reaches the site.

## Where to put things

```
docs/content/
├── drafts/          ← upload here by default
│   ├── homepage/
│   ├── wonder/
│   ├── truth/
│   ├── living-work/
│   ├── connect/     also About and Our People — see below
│   └── resources/   the hub the v3 drafts call "The Record"
├── in-review/       with the client / Elder Advisory Group
├── approved/        signed off, safe to build from
└── sitemap/         sitemaps, IA diagrams, navigation trees
```

There is no `about/` or `our-people/` folder. Both drafts sit in `connect/`
because build documentation §2 and `src/content/site.ts` put About and the team
under Connect. That is a filing choice — the v3 prototypes link to `/about` and
`/our-people` as top-level routes, which is evidence for **D2**, not a
resolution of it. If D2 lifts them out, move the files then.

Move a file between folders as its state changes, and update
[`STATUS.md`](STATUS.md) in the same commit. The folder is the state — that is
the whole point of splitting them, so nobody has to guess whether a document
has been signed off.

Any format is fine to *send*: `.docx`, `.pdf`, `.html`, image exports. What
lands in this folder is Markdown wherever the source allows, because Markdown
is the only format here that diffs — and a copy draft that cannot be diffed
cannot be reviewed a second time.

## Coded prototypes get converted, not committed

The v3 upload (24 Aug 2026) arrived as seven self-contained HTML pages rather
than documents. The rule that came out of it:

1. **Convert the page to Markdown** and file that as the draft, under the
   naming convention below.
2. **Record the provenance in the file** — a header block naming the source
   file, the export it came from, and the date. The converted drafts carry one;
   copy its shape.
3. **Keep the copy, drop the design.** Words, headings, link destinations,
   bracketed editorial notes and image *direction* survive. Layout, CSS, scroll
   behaviour and interaction do not — under D5 they are the wireframes' to
   decide, and a prototype's layout is a suggestion, not a spec.
4. **Do not import embedded media.** The v3 prototypes carried 61 base64 JPEGs,
   about 12 MB. Base64 in a draft makes the file undiffable and dresses
   placeholder art up as an asset manifest. Record each slot as
   `[ Image — … ]`, leave the binaries in the source export, and extract real
   assets into `public/` properly if any turn out to be real.
5. **Keep the original.** The prototype stays in the Drive export it arrived
   in. It is the thing the client actually approved the look of, and the
   conversion is lossy by design.

A prototype is still a **copy draft** for governance purposes. The same two
gates apply.

A Google Docs export inlines every image as base64 on one enormous line, which
defeats the point of choosing markdown. Split those out into an `assets/` folder
beside the draft and rewrite the link definitions to relative paths, leaving the
prose untouched — see the About and The Record drafts for the shape. Check the
weight of what comes out: a photograph exported as PNG is roughly ten times the
size it needs to be, and a repository is much easier to keep light than to make
light again.

## Naming

```
YACHATDAC-<Page>-<Kind>-v<n>.<ext>

YACHATDAC-Homepage-Copy-v3.md
YACHATDAC-LivingWork-Copy-v3.md
YACHATDAC-OurPeople-Copy-v1.md
YACHATDAC-Sitemap-v1.png
```

`<Page>` is one token in PascalCase — `Homepage`, `Truth`, `LivingWork`,
`OurPeople`, `Resources` — not the page's display title. Rename an incoming
file to match; the name it arrived with is recorded inside the file, not on it.

Keep the version number in the filename rather than overwriting. Git holds the
history, but reviewers reading a Drive link or a Slack message need the version
visible on the face of the file.

Version numbers count **that page's drafts**, not upload rounds. A page whose
first draft arrives in the third upload is still `v1`.

## Approval is review-at-presentation (F8, 31 Aug)

**Decision F8** replaced the two-gate pre-approval model. All copy and content
is authored by August as working copy — provisional by design — and the built
site is **presented to Steve (FNAN) and the Elder Advisory Group, who review
and request changes**. Corrections come back through the change-request
process (D18). Approval no longer blocks drafting, building, or front-end
implementation.

The governance-circle tags in `STATUS.md` (**open**, **shared with care**,
**held by community**) are kept as labels — they tell a reviewer what to look
hardest at — but they no longer gate the build. Changes requested inside
Suzanne's recorded words are routed to her at review, since the words are hers
regardless of process (see F8 and R17).

## These drafts are the source of truth for copy

Decision **D5**: the draft documents in this folder govern page copy and
content. They do **not** govern web design — the lo-fi and hi-fi wireframes are
the source of truth for that. Where a draft implies a layout, treat it as a
suggestion; where it states the words, treat it as the text.

## Getting approved copy into the site

**Copy is CMS-managed, including the homepage** (decision D12). Approved copy is
entered by an editor, not committed as code. This folder is the source and the
record, not the delivery mechanism.

What still lives in the repo and needs a PR:

| Content | Lives in | Note |
| --- | --- | --- |
| Homepage copy | `src/content/homepage.ts` | Seed/default only — the CMS is populated from it and then owns it |
| Navigation, org identity, IA | `src/content/site.ts` | Structure, not copy |
| Page section outlines | `src/content/page-specs.ts` | Build spec, never rendered as content |

Design, motion and section structure stay in code either way. The CMS edits
words, not layout.

## Sitemap

`sitemap/` holds the IA source of truth as diagrams. The machine-readable
version — the one the site's navigation is actually built from — is
`src/content/site.ts`. If the two disagree, the diagram is right and the code
needs updating; raise it rather than letting them drift.
