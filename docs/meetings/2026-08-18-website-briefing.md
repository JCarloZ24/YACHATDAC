# Website briefing — 18 August 2026, 7.30pm

*Last updated: 19 August 2026*

## Decisions

- **Brand identity approved by the client** — colour, typography and logo.
  Typography: Block Berthold (headline), Bantayog Sans (subhead), Good Dog Cool
  (callouts), Work Sans (body). Motiva is scrapped.
- **Solid colours over gradients.**
- **WebP** is the final image format for the site.
- **Homepage is a hybrid**: visually rich and animation-forward, with an intro
  video / loading sequence; inner pages stay simpler.
- **Lo-fi wireframes first**, despite the timeline. Useful for big-picture
  content structure and section management, even though animation behaviour is
  better sketched on a whiteboard.
- **Relume Figma kit** as a fast route to the design system — component-based,
  uniform margins and spacing.
- **Sprint cadence**: twice-weekly meetings.

## Timeline

| Date | Deliverable |
| --- | --- |
| 21 Aug | Lo-fi wireframes |
| 28–31 Aug | Hi-fi mockups |
| 14 Sep | Project deadline |

## Roles

| Person | Responsibility |
| --- | --- |
| Marc | Design system, brand direction, UI design |
| Ivy | Web design, layout and presentation, front end |
| JC | Front end — 3D and animation |
| David | Backend / development lead |
| Ben | Video editing and colour grading |
| Joshua | Image editing |

## Media

Client-supplied images are TIFF, JPEG and RAW; some videos run to 2GB per file.
Marc has ~80% of the images downloaded and takes responsibility for sorting,
selecting and editing them into upload-ready WebP. Large files do not preview
reliably in Google Drive — converting the extension resolves it.

Overlaying text on video needs careful handling of opacity and readability
without diminishing the imagery.

## Design direction

Ivy sourced **Heritage** and **No Art Music** from the GSAP showcase as
references; Marc confirmed both. The client's Game-of-Thrones-style 3D map
concept was judged too extreme.

Agreed approach: static foreground with a moving/changing background on scroll,
fade in/out rather than drastic effects. JC suggested a day-to-night video loop
on scroll; Ivy suggested a 0–100% video loader before the site appears, which
Marc agreed to. David flagged the UX point that scrolling must advance **both**
background and content — changing only the sky is poor UX.

## Backend

The site gets a CMS so the client can manage resources, articles, blogs and
videos — long-format content pages are new, they did not exist on the old site.
Blog/article pages are a straightforward two-page structure: a catalog listing
and an individual article page. Research and guest-related pages are harder to
visualise and need further discussion.

Open from this meeting: backend build priority (user-facing first vs CMS in
parallel), maximum media file sizes for storage planning, a specification for
all CMS-managed content types, and who owns page copy.

## Action noted

Marc asked the team to research the YACHATDAC organisation — its history,
culture and context — to improve their design perspective. Worth doing before
touching the homepage copy.
