# Content

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
│   ├── connect/
│   └── resources/
├── in-review/       with the client / Elder Advisory Group
├── approved/        signed off, safe to build from
└── sitemap/         sitemaps, IA diagrams, navigation trees
```

Move a file between folders as its state changes, and update
[`STATUS.md`](STATUS.md) in the same commit. The folder is the state — that is
the whole point of splitting them, so nobody has to guess whether a document
has been signed off.

Any format is fine: `.docx`, `.pdf`, `.md`, image exports. Markdown is easiest
to diff, so prefer it where the source allows.

## Naming

```
YACHATDAC-<Page>-<Kind>-v<n>.<ext>

YACHATDAC-Homepage-Copy-v1.docx
YACHATDAC-Truth-Timeline-v2.pdf
YACHATDAC-Sitemap-v1.png
```

Keep the version number in the filename rather than overwriting. Git holds the
history, but reviewers reading a Drive link or a Slack message need the version
visible on the face of the file.

## Approval is not a formality here

Two gates apply, and they are different from each other:

1. **Editorial sign-off** — is the copy right, on-brand, and accurate?
2. **Cultural governance** — the client's Ten-Year Strategic Plan names a formal
   **Elder Advisory Group** with binding authority: *no program involving the
   sharing of Iningai cultural knowledge, stories, or sacred information
   proceeds without Elder Advisory Group endorsement.*

Content carrying cultural knowledge needs the second gate, not just the first.
Tag each document in `STATUS.md` with its governance circle — **open**, **shared
with care**, or **held by community** — the same three circles the CMS uses
internally (build documentation §12).

Where a document says on its face that it is awaiting someone's approval — the
Truth timeline carries *"DRAFT — Suzanne's words, awaiting her approval"* — that
is binding. It does not go into `approved/`, into the CMS, or onto a staging
URL until she has seen it and said yes.

## Getting approved copy into the site

Most pages are **CMS-managed**: approved copy is entered by an editor, not
committed as code. This folder is the source and the record, not the delivery
mechanism.

The exceptions live in the repo, so they need a PR:

| Content | Lives in |
| --- | --- |
| Homepage copy | `src/content/homepage.ts` |
| Navigation, org identity, IA | `src/content/site.ts` |
| Page section outlines | `src/content/page-specs.ts` |

When homepage copy is approved, update `src/content/homepage.ts` in a commit
that references the approved file — that link between the record and the code is
what makes the copy auditable later.

## Sitemap

`sitemap/` holds the IA source of truth as diagrams. The machine-readable
version — the one the site's navigation is actually built from — is
`src/content/site.ts`. If the two disagree, the diagram is right and the code
needs updating; raise it rather than letting them drift.
