# The motion grammar

**Shared loading amendment — 11 September 2026, user direction (X7 / SYS-02).**
The following row supersedes the hard-load-only page panel, quiet lift and
separate route/article covers described below.

| Meaning | Behaviour | Timing | Authority | Implementation |
| --- | --- | --- | --- | --- |
| **the page is ready**, every public route | One charcoal cover shows the supplied wordmark and dot sweep, then “You're viewing” and the destination name. Runs on link navigation, browser history, direct arrival, refresh and hard refresh. Waits for fonts, opening image decoding, video frame readiness, the motion build and stable layout; lower-page lazy media loads as needed. Entrances wait until the cover clears. | 200ms dim on navigation; readiness-paced count; 700ms name dwell; 260ms fade out. 12s readiness ceiling, Escape/Tab release and CSS backstop. Reduced motion retains a static readiness cover without animated transitions. | August, 11 September 2026 | `RouteLoader`, `PageLoader`; owned CSS transition, no cross-route GSAP timeline |

*Last updated: 12 September 2026*

| Our People — single canvas, user direction 11 September 2026 | Behaviour | Timing | Reference | Effect |
| --- | --- | --- | --- | --- |
| **the page gathers**, one continuous stage | One pinned viewport, one Three.js renderer and one reading clock carry all ten existing sections. The camera and accessible text track travel together; measured content determines the distance. The footer follows in ordinary flow. | Travel: 100vh per viewport; short holds at the title, portrait, decision, card rows, ratio and names. Reverse scroll retraces the same route. | SCR-02 / SCR-09; same architecture as `/`, explicit user direction | `peopleJourney` |
| **the photograph gathers into the word** | The hero photograph holds its screen position while its window closes into the headline's large initial. That aperture gathers into the initial's final position; the rest of the photograph-filled title and its supporting copy appear around it. The image pixels stay registered throughout: no magnification or distortion of people. The H1 remains one unsplit, CMS-editable element; only its measured font silhouette becomes a texture. | 35vh photo hold; 220vh closing, aperture flight and title reveal; 60vh title hold. One reversible sequence inside the page clock. | Y1 / P4; Figma 2841:25360; user reference to Living Work's **Our challenges** handoff, 11 September 2026 | `peopleKnockout` inside `peopleJourney` |
| **people gather on equal ground** | Card frames arrive from either side into their existing grid. Portrait pixels stay registered to their resting position while the frame travels around them. Every card receives the same treatment. | 65vh per row; `country`; 8vh spacing | P4 / L3; Figma 2841:25363 | `peopleGather` |
| **a person speaking**, Our People | The track stops while Suzanne's words brighten in place, then holds the complete quotation before continuing. No moving or character-split testimony. | 85vh read + 30vh hold, per-word opacity only | Y2; Figma 2841:25361 | `dim` inside `peopleJourney` |
| **a change of ground**, Our People | Existing wave crests rise from their baseline to carry each incoming solid palette ground across the shared canvas. The constitution's bar opens to its existing 80/20 proportions; headings and names settle by line. | 50vh crest rise; 50vh ratio reveal; 40vh line settlement | X7 / B5; Figma 2841:25362–25368 | `peopleGround`, `settle` |
| **places held, doors offered**, Our People | The existing board seats and contact choices arrive quietly within their ground, using the site's shared 16px entrance. Their contents and order stay intact. | 45vh seats; 40vh doors with 6vh spacing; `country` | X4; Figma 2841:25365 / 2841:25368 | `arrive` |

This supersedes the earlier static Our People implementation. No new copy or
artwork is introduced. Reduced motion, JavaScript off, renderer failure, print
and Escape retain the complete existing document. Resize and font changes
rebuild the measured journey; anchor and keyboard focus seek to the same clock.

| Record interaction | Behaviour | Timing | Reference | Effect |
| --- | --- | --- | --- | --- |
| **lifts**, catalogue card | Inner contents lift 6px on hover/focus; the photo stays undistorted. Title underlines. | 0.25s | INT-05, user direction 9 September 2026 | `recordCardHover` |
| **surfaces**, catalogue article | Fade through charcoal, hold a loading label until the route commits and its hero image decodes, then fade into the article. Failed or absent images release to the source-colour field; an eight-second ceiling prevents a stuck cover. | 0.2s out, readiness hold, 0.45s in; no fade under reduced motion | NAV-06, user direction 11 September 2026 | `record-article-fade`, owned CSS opacity transition (same lifecycle exception as the global route blink; no GSAP timeline) |
| **surfaces**, article photograph | The hero photograph fades in after decoding, including direct visits and images arriving after the navigation ceiling. Pixels stay still. | 0.45s; immediate under reduced motion | NAV-06 / frame grade, user direction 11 September 2026 | `record-image-fade`, readiness-driven CSS opacity transition |

| Interactive addition | Behaviour | Input | Reference | Effect |
| --- | --- | --- | --- | --- |
| **turns**, Record boomerang | A generated wooden mesh turns with drag or arrow keys, gently following the pointer while idle. No automatic spin; reduced motion renders on input without easing. | Drag, pointer, keyboard; transform only | INT-04 / user direction 9 September 2026 | `recordBoomerang` Three.js module |

SCR-16 / `recordDocumentsGround`: after the document traverse, hold the final
card for 40vh, then release the pin on cream. Change the shelf and following
on-request section together from cream to charcoal over 50vh, starting when
the next section's top reaches 65% of the viewport and ending at 15%. No wave at either
document boundary. Reverse scroll restores cream; reduced motion stays static.

SCR-15 / user direction, 9 September 2026: `recordDocumentsTraverse` pins the
document shelf while downward scroll translates its track to the final card.
Each viewport of horizontal travel takes 100vh of vertical scroll (minimum
100vh). Reverse scroll retraces the shelf. Reduced motion and viewports too
short to show the shelf retain native horizontal scrolling.

*Decided 30 August 2026. The second artefact, and the one the code answers to.*

Parallax, dissolves and text effects are not the design. They are the alphabet. The design is
what each one **means**, used consistently enough that the reader learns it without being told.

> **The hard rule: every animation in the codebase must cite a row of this table.
> One that cites nothing is decoration — delete it.**

This table is not a description of the code. It is the code's source: each row names a
registered effect in `src/lib/motion/effects/`, and each effect's doc comment names its row
back. Adding a behaviour means adding it to a row here first.

The row count should stay near ten — a twentieth *role* is what this document exists to refuse.
The effect count is free to grow, because several effects can serve one role at different
volumes. See Variants below.

---

| Narrative role | What it does on screen | Easing / duration | Sketch | Plate | Effect |
|---|---|---|---|---|---|
| **the doors answer**, About enquiry cards | The four cards open down from their top edges in reading order, with a short upward settle. Entry waits until the contact section is seated (within 1vh) and the card row is inside 78vh, so the deck hand-off cannot spend the entrance off-screen. Restored positions and keyboard focus reveal the full cards; reduced motion keeps the static layout. | 0.82s; 0.09s stagger; `country` for the aperture, `catch` for 24px travel | About §09 / F9; user revision 11 September 2026 | — | `doorsOpen` |
| **the page opens on Country**, Home hero | A black beat lifts off a scene that is already drawn, and the scene is night: the road under a dark sky, held on its own for a beat. Then the light comes up into the welcome frame — the sky sequence and its light layer travel together, so the sky lightens and the land lights with it — and the words fade on. Nothing arrives, nothing travels, and the mouse moves nothing. AMB-05 vegetation wind runs from the first frame. | black lifts from 0.14s over 1.1s sine.inOut; scene from Figma 3371:41344 to 3371:41275 over 2.4s sine.inOut from 1.3s; headline fades in together over 0.9s at 1.7s, no stagger; eyebrow, body and scroll cue 0.45s with 0.12 stagger from 2.15s | User direction 10 September 2026, prototype deck slides 1-2 and the measured frames. SUPERSEDES the SCR-11 / B5 photo collage entrance, which now runs only at /homepagev2 | P3 | `homeHeroOpen` |
| **a change of ground**, Home hero dissolve | The welcome fades off the photograph and the day goes on without it: the scene travels from the welcome frame to Wonder's, which sits 600 rows further into the sky sequence and carries half its black. Nothing is laid over the land to darken it — the frame's own black is in the canvas. Reverse scroll restores the welcome and its hour. | 80vh per timeline unit, scrub 0.8s; copy out 0.5 units sine.in from 0; scene and Wonder's rise together over 0.8 units from 0.8, holding to 1.6 | User direction 10 September 2026 / SCR-09. SUPERSEDES the collage dissolve, the charcoal-to-oxide ground warm and the painting reveal, which run at /homepagev2 | P3 | `homeHeroDissolve` |
| **the world opening**, homepage loading cut | A 39-second film of Country **loops** full-bleed under a graded charcoal scrim (20% through the middle, 86% at the foot); the supplied gold dot wave reveals left to right and the 0–100 percentage is scrubbed from the film's own `currentTime` across the FIRST pass only, so that pass's last frame IS 100% and every later loop is wallpaper behind an open door. The cover then HOLDS — it does not dismiss itself. A blob button ("Walk with us") enters the homepage; a quiet `Skip` fills the count to 100 without entering. Media is the loud channel here, not transition: a reveal stretched from 0.78s to 39s is by definition quiet. | count and wave scrubbed to `video.currentTime / duration` for one pass, no wall clock; `loop` suppresses `ended`, so the pass ends on a currentTime test a frame early rather than after the wrap, or the count would flick to 0 as it lands; art fades in at 0.14s over 0.4s; film fades up over 0.8s; blob in 0.45s `power2.out` at 100; cover out 0.6s on press, tied to the audio fade that runs under it; sound in over 1.0s and out over 0.6s, interpolated in perceived-loudness space (amplitude^1/1.7, travel, ^1.7) because a straight line in `video.volume` is heard as a switch | User direction 10 September 2026 / SYS-02. **SUPERSEDES** the timed one-second prototype of 8–9 September, which counted `timeline.time() / 0.78` and exited on its own `onComplete` plus a 1.5s `setTimeout` — both of which would now cut the film off. Held for a data-saver/2g link and for reduced motion, which fetch no film at all. **Once per browser session** — `sessionStorage` written on the press, read by a parse-time script inside the cover so a gated visit never flashes; `?intro=1` forces it. | P3 | `homeLoaderFilm` |
| **what endures** | A line rises from behind an edge and never exits. Masked at the line. | `country` · 0.82s · 0.09 stagger | B5 | — | `settle` |
| **what endures**, Home closing statement | The page ends on an empty black screen. One full screen of scroll raises the sentence from behind its own edge; half a screen more brings the dotted spirals outward from the centre it sits on ("what radiates from a source"). Pinned, scrubbed, nothing exits. | 1.5 screens pinned; 1.0 line, 0.5 pattern; scrub 0.6 | user direction 9 September 2026 | — | `homeWayForward` |
| **what endures**, display cut | A short heading resolves character by character. Six words at most. | `country` · 0.82s · 0.028 stagger | B6 | — | `display` |
| **what endures**, wave clamp | A chapter heading travels with its incoming Wave / Divider until its crown reaches the viewport crown; it holds there while the divider covers it. | `machine`, scrubbed | Truth · Today | — | `waveClamp` |
| **what endures**, the name resolves | ENT-07. A name arrives as noise and resolves into itself, letter by letter, keeping its word lengths and its spaces so the reader can see it is a name before they can read it. The loudest cut of this row, and it is spent ONCE on the site: About §02's legal name, because the copy is already the joke — the draft sets "Yambangku Aboriginal Cultural Heritage and Tourism Development Aboriginal Corporation" and then says "Most people say YACHATDAC", so the name resolving and collapsing is the sentence's own argument rather than an effect laid over it. The one place a name genuinely IS a loading state, because the sentence says it is. **The six-word cap on `display` does not apply and must not be borrowed**: `display` splits, and the length guard exists because a character split of a long line reads as a gimmick and wrecks the measure. This splits nothing — it rewrites the text in place — so it is length-agnostic, and an 85-character legal name is exactly the target. **Never on a person's name** (ART-DIRECTION §6), and never on testimony: this is for names of organisations, headings and interface text, which is where F9 licenses it. Accessibility is not free — rewriting text means assistive tech can read noise, so the scrambling run is `aria-hidden` inside an element carrying the real string as its `aria-label`, the same contract SplitText's `aria: "auto"` gives the other rows here. | `machine`, scrubbed across the resolve; word lengths and spaces preserved, mixed case | About §02 · sketch ENT-07, released by F9 · Figma 2632:19655 frames 01–02 | P3 | `decode` |
| **the screen clears** | A sentence that has been read LEAVES upward, line by line behind its own mask, fading as it goes, while the heading it was measured against stands perfectly still. The deliberate counterpart of `settle`: what endures rises and never exits, and what has been answered exits and does not come back. Reserved for a screen that must ask something on ground the page has emptied on purpose — a claim dimming in place is still on the screen, and the whole argument of About §03 is that by the time the question is asked, nothing else is. Never used on a person's recorded words: testimony is read in stillness (`dim`), and testimony does not get taken off the screen. | `country` · 0.82s · 0.09 stagger, masked at the line, opacity to 0 across the same span | About §03 · Figma 2665:20272 and 2665:20273, both named "LEAVES upward" · user direction 12 September 2026 | **P9** | `vacate` |
| **emerging from the ground** | An element brightens from a visible dim state without moving. Truth scrubs it in both directions; the descent supplies all travel. | `machine`, scrubbed · dim 0.4 | M1 · Truth | — | `brighten` |
| **emerging from the ground**, laid by hand | A montage's frames brighten on DELIBERATELY UNEVEN offsets — "like a hand laid them down" — rather than on one stagger value. Evenly spaced arrivals read as a slideshow, which is the one thing a field of Country must not read as. Offsets are fixed constants, never generated per load. | `machine`, scrubbed · starts .10/.17/.21/.30 of the read span, each .18 long | M1 + L3 · Truth §05, §18 | — | `brighten` |
| **the world opening**, the site's page panel | Charcoal panel, the wordmark, the artist's dots-wave filling dot by dot along its own flow, and a count. On EVERY route on a hard load or refresh — one component, `RouteLoader`, in the root layout, announcing whichever page it covers from `site.ts`'s own labels. It exists for a settling window that is not about bandwidth: measured on the production build, `/` paints at 5,139px with zero pin spacers and only reaches its true 23,303px at roughly 890ms, and until then every pinned screen is stacked in the same place. Reaches 100% inside 1.4s and it lifts in silence; slower than that and it says "You're viewing <page>" first, because by then the reader has been looking at it long enough to be told what arrived. NOT on client-side navigations (the route transition covers those), and not on `/` while the opening film still has a first arrival to serve. | ramp 0.7s and sweep 0.65s, or 1.6s/1.5s on a `saveData`/2g-3g link; lift `--dur-large`; dwell 1.2s before an announced lift | User direction 11 September 2026, replacing the per-page Living Work and Wonder panels and The Record's cover | — | `PageLoader` (React, not a GSAP effect) |
| **the world opening**, the panel's two ceilings | The panel can never strand a reader, and it took two mechanisms to mean it. A wall-clock `setTimeout` lifts it at `hardCap + dwell + 1.5s` — needed because every other exit is evaluated inside a rAF loop, and rAF is exactly what a saturated main thread stops servicing: measured under Slow 3G with 4x CPU throttling, the panel stood past twenty seconds with its 3.2s cap long gone. Beneath that, a CSS keyframe in `globals.css` lifts it at 8s with NO JavaScript at all, because the panel is server-rendered and therefore exists before any script does — on a slow link the reader was otherwise held until hydration, which inverts the whole point of it. | 3.2s cap (4.5s on a slow link), then the scripted ceiling, then CSS at 8s | Measured 11 September 2026; the rule is PageLoader's own — a loading screen that can strand the reader is worse than none | — | `y-page-loader-bail` (CSS) |
| ~~**the world opening**, Record loading cut~~ **RETIRED 11 September 2026** | Homepage gold wave and ring covered the page until portal textures, the first catalogue photos and the first canvas frame were ready. **Removed by user direction 11 September 2026: the homepage's opening film is the site's only loading screen.** The portal itself is unchanged — it never depended on the cover, which only ever observed `data-portal-state`. `LoadingCover.tsx`, `record-loader.ts` and the `recordLoader` effect are deleted; the 20s startup timeout, the abort path and the static fallback all still stand. | — | SYS-02 / user direction 9 September 2026, retired 11 September 2026 | — | — |
| **arriving quietly** | 16px and a fade. The baseline is a single entrance; Wonder's entrances follow scroll progress and reverse on return, per user direction 9 September 2026. Variant: `homeWayForward` scrubs the same 16px-and-a-fade across 1.5 pinned viewports. | `country` · 0.55s · 0.06 stagger; Wonder: viewport entry to top 20%, reversible scrub | X4 | P5 | `arrive`, `homeWayForward` |
| **arriving quietly**, the page has finished talking | Footer links fade up ONCE, all together, NO stagger. A stagger here would restart a rhythm the page has just put down. Not scrubbed and not reversible — the descent is over. | `country` · 0.55s · 16px · stagger 0 | X4 · Truth §21 | P5 | `arrive` |
| **what radiates from a source** | Elements arrive in order of distance from a chosen origin, not DOM order, with seeded hand jitter. | `country` · 0.55s · 0.045/unit | L1 + L3 | P4 | `emanate` |
| **what radiates**, layout cut | Three arrival tiers — anchor, mid, detail — each with its own micro-stagger. | `country` · 0.55s · at 0 / .25 / .45 | L2 | P4 | `triad` |
| **the world opening** | A frame's clip opens while the image counter-scales. The Record uses a sandstone wall with separate openings for every inked area of one supplied handprint; the camera passes through a palm opening to approach distant image-card planes. Wonder's itinerary opens a native disclosure: its clip reveals held media, the chevron turns, and following rows settle into their measured positions. | `machine`, scrubbed; Record: 200vh; `disclose`: `country` · 0.55s, chevron `quiet` · 0.32s | M2 / SCR-11 | P3 | `frameOpen`, `handprintPortal`, `disclose` |
| **what has not happened yet** | IMG-04, and the only place on the site it is spent. One sentence carries a faint chromatic split — two ghost copies of itself, one oxide and one turquoise, held a couple of pixels off it at low opacity and drifting about a pixel on a slow cycle that never lands. Every other line on the page settles; this one does not, because what it describes has not happened. About §06's Elder Advisory Group sentence is the page's only future-tense claim, and the instability is a TENSE MARKER rather than a texture: it says *not yet* about a body that is not sitting, in the one register a page has for saying it without adding a word the draft does not have. ⚠ **IT HAS A REMOVAL CONDITION, AND THE CONDITION IS THE POINT.** When the Elder Advisory Group sits, the sentence loses `data-ab6-unsettled` and the copy loses its future tense — one attribute and one draft edit, and the marker is gone. An effect that cannot be switched off by an event in the world is decoration; this one is named by the event that ends it. ⚠ **NEVER ON A PERSON, NEVER ON TESTIMONY, NEVER ON A FIGURE OF LOSS.** Chromatic split is released by F9 on depicted subjects, not on people's recorded words, and a wavering number reads as a rendering fault. This is for a claim the page makes about its own future. The ghosts are `aria-hidden` copies behind the real sentence, so the accessible name is one node and assistive tech never reads the text twice. **Written as CSS, not as a registered effect**, and the reason is mechanical rather than stylistic: an unresolving loop cannot live in a scrubbed timeline — a scrub freezes it — and the drift must be absent under reduced motion, which a `@keyframes` pair inside an already-gated block gives for free. The static offset is painted in every build; only the drift is held back to the held screen. | 2px offset, opacity 0.5 on the ghosts · ~1px drift, 2.6s, `ease-in-out`, `infinite alternate` — no end state, deliberately | About §06 · Figma 2707:21402 frame 03 ("the clause that will not resolve", chromatic ghosts in oxide and turquoise) · IMG-04 released by F9 · user decision 12 September 2026 | — | CSS `ab6-drift`; no GSAP effect |
| **the world opening**, the frame opens and the picture does not move | About §05's photograph. The frame's clip opens downward and the heading and the column beneath travel into the space it takes, so the band reads as arriving from the top — but the image plane is NEVER transformed. What opens is the frame; what is revealed was always there. The distinction is the whole row: `frameOpen` above opens a clip WHILE the image counter-scales, and §02's road counter-travels its plane so a chosen edge stays in view. This one may do neither. The layer is annotated "P1 full-bleed hold: the ground and the type move around it, the image plane NEVER does", the photograph is `frame` grade, and the photo notes record four people cropped to hands, one of them a child — so the grade is not a preference here, it is the reason the frame can be used at all. One custom property drives the clip, the caption's opacity (`1 − fold`) and the travel of everything below, and deliberately does not appear in the plane's transform. The fold runs ONCE and stays: the picture is the rest the last value is read against, so nothing gives the height back. | `country`, scrubbed · fold 1 → 0 over .09 of the read · 34svh held against the flow build's 40/56 | About §05 · Figma 2653:19672 (band layer `2738:25353`) · CLAUDE.md's motion-grade rule · user direction 12 September 2026 | **P1** | module fold; no plate effect |
| **the world opening**, itinerary rule | The dotted rule under the open stop is Wonder's scroll indicator: its dots fill left to right in burnt ochre across that stop's reading span, stand full at the handover, and empty again on reverse scroll. The same supplied artwork is the mask, so nothing new is drawn. The chevron's turn moves with it, as a CSS transition so the held screen and the manual accordion turn identically. | scrubbed, linear; chevron `quiet` · 0.32s | user direction 10 September 2026 | — | `stageRule` |
| **the world opening**, About timeline rule | §06's thread acquires its date: the dotted wave draws left to right across the board's three beats at reading pace and STOPS on the last of them rather than running to the column's edge — it ends on 2031, which is the date the page is accountable to and the thing the thread has been travelling towards; and each beat seats with a short catch as the draw reaches it. The thread is dotted here and nowhere else on /about: every other rule the THREAD draws (§02's seam-out, §03's quote, §05's value, §07's) stays a solid ochre bar, and the one that acquires a date is the one that changes. Not to be confused with `DottedRule`, the artist's straight gold divider §08 sets between partner groups — different object, different job, and they are not to be reconciled. Mechanically it is Wonder's itinerary rule above: a generated 216px tile of /truth's strand geometry (`public/artwork/wave-dots-rule.svg`) masks a solid ochre field, so the colour stays a token and nothing new is drawn. Amplitude is ±2, not TrailRail's ±8: the beats are placed as percentages of a fluid column, so the wave's phase under each one moves with the viewport and the amplitude is simply the worst-case distance a beat can sit off the line. ±4 visibly missed the third beat. The mask REPEATS at its natural size rather than stretching to the element, which is what keeps the dots round at any viewport — and is why the draw is a `clip-path` inset and not the `scaleX` it replaced: scaling pulled every dot into a growing ellipse. Reverse scroll retracts it. | scrubbed `machine` over `top 80%` → `top 45%`; beats `catch` · `--dur-small`, 0.18 stagger, played once (overshoot on a scrub jitters) | About §06 / F9; user direction 11 September 2026, replacing the 2px bar | — | `boardHandoff` |
| **being drawn in** | A slow scrubbed push toward the subject. Transform-origin points at what matters. | `machine`, scrubbed | M1 | P2 | `pushIn` |
| **being drawn in**, Wonder landscapes | Turraburra and What it is like out here share a viewport landscape, shallow scroll approach and mouse-driven tilt/drift. Turraburra also sits behind Getting here's outgoing charcoal wave. Once seated, the photograph and text hold for another 80vh of scrolling before releasing; the approach finishes before the hold. Pointer exit recentres. Touch has scroll only; reduced motion and no JavaScript use a static full-bleed section. Content too tall for the viewport uses ordinary reading flow. | 100vh screen + 80vh reading hold; reversible scrub 0.8s; scale 1.035→1; pointer ±1.2% travel, ±1° tilt, power3.out 0.8s | SCR-01 / AMB-04 / the rest, user direction 9 September 2026 | P2 | `landscapeApproach`, `landscapeGyroscope` |
| **being drawn in**, pull-back cut | The camera withdraws instead of approaching: the plane opens oversized and settles to rest. Truth's hero "breathes rather than sits still". **Its two breaks no longer take it** (11 September 2026): §14's photographs were withdrawn, and §08's scale was ruled out by the ERA DISSOLVE reference's "nothing scales during the dissolve (P9's rule)", which was taken over that break's own note asking for a slow withdrawal. The effect stays registered for whoever wants it; Truth's only use of the row is now the hero. | `machine`, scrubbed · hero 1.04→1.00 over read + cover | M1 · Truth §01 | P2 | `pullBack` |
| **being drawn in**, the strip pulled across | Six frames arrive left to right fast enough to read as ONE strip being pulled, then the whole strip drifts left as the reading continues — the evidence carrying on past the edge of what is being said about it. | `machine`, scrubbed · ~.012 of the span apart, then 40px over the remainder | Truth §07 | evidence strip A | `brighten`, module drift |
| **a change of ground** | The new ground sweeps over the old as a scaleY wipe. | `machine`, scrubbed | X7 lineage | P7 | `ground` |
| **a change of ground**, between pages | The lights go down, the page changes, the lights come up — a blink. The whole viewport dims to charcoal over 200ms, the navigation is HELD until that panel is opaque, and it brightens over 260ms once the new route has painted. It is the one transition that hides rather than reveals, which is what makes it the answer to flicker: the scroll reset, ScrollTrigger re-measuring every pin, the header re-rendering and any image still decoding all happen behind the dark. Nothing moves and nothing is captured, so nothing can travel against itself. Browser back and forward CUT — by the time `popstate` arrives the browser has already navigated, and dimming then would mean showing the new page, covering it and showing it again. | 200ms linear down, 260ms `quiet` up; the swap is held to the dark | X7 · user direction 11 September 2026 | every route | `RouteBlink` |
| **a change of ground**, the light going out | A section's ground changes COLOUR across its own reading span, and its type crosses over with it. Truth's 1950s walks egg white → charcoal so the reader reaches the hard stop already in the dark. The ground is scrubbed LINEARLY, one-for-one with scroll — an eased version held still for the first third of the section and then lurched, which reads as broken rather than eased. The ink STEPS at the luminance crossover rather than tweening: walked across, it meets the ground in the mid-greys and the copy disappears (measured 1.05:1). The warm accent is dropped for the duration — burnt-deep needs a near-white ground, gold a near-black one, and the band spends its middle between them, so the labels take the ink and the colour drains as the light goes. | `machine`, scrubbed · ink steps at .53 · 17.83:1 at both ends, 4.67:1 at its worst | Truth §13 · D26 | ⟡ held doc slot | module ramp, `groundRamp` lineage |
| **a change of ground**, the ground goes out under the question | About §03's ramp, and the second use of the row above — but this one RISES. The dark comes up from the foot of the held screen and climbs past its head, so the ground is taken out from UNDER the section rather than recoloured around it (the frame's own name for it: *"the ground goes out under it"*). One front travels: evergreen is its leading edge, charcoal fills in behind it, and canvas is simply what the front has not reached yet — so the light goes out of the bottom of the photograph first. Green is therefore the CROSSING and never the destination; a ramp that stopped on it would leave the question sitting on a colour, and the argument needs it on nothing. Scrubbed LINEARLY for the reason Truth's is: eased, it stands still through the first third and then lurches. ⚠ **IT RUNS ON AN EMPTY SCREEN, AND THAT ORDERING IS THE RULE.** The claims are dark ink and the front is evergreen into charcoal, so any overlap is dark on dark: run under the claims, the last line of the second one sits as an unreadable smudge on near-charcoal while still half opaque, which reads as a rendering fault rather than as an effect (measured, 12 September 2026). So the beats are sequential — every claim is read on the photograph, the ground changes with nothing on it, and the question is read on charcoal. The heading leaves ON the ground's first frame rather than standing through it (user direction, 12 September 2026), which is also what retired the ink step this row used to carry: `--color-burnt-deep` is a light-ground token, and now nothing crosses. Mechanically it is ONE custom property — the front's position — read by a gradient whose stops are `calc()` offsets from it, so the per-frame write is a single CSS variable and never a rebuilt gradient string. | `machine`, scrubbed linearly · the front travels 130% → −30% of the screen across .58–.76 of the read, reaching the cleared copy's band at ≈.71 · plate dissolves with it over .58–.74 | About §03 · Figma 2665:20268 ("ground ramp — canvas → evergreen → charcoal, scrubbed across the 300vh pin") and 2665:20270 ("the coming-apart — the ground takes the photograph as the pin advances") · scenes.md:1122 · bottom-to-top direction and the heading's exit by user direction, 12 September 2026 | **P9** | module ramp, `groundRamp` lineage; `dissolve` on the plate |
| **the page holding its ground** | Scroll reaches a section's end and stops visibly until the reader commits through a short buffer; the next section then covers it and seats whole. | held, then `country` · 0.9s | About deck · Truth rail | — | `coverSeams`, `createGatedDeck` |
| **the page holding its ground**, the hand-off scrolls | The outgoing section travels out as the next arrives, foot against head, so the join plays as ordinary scrolling. The hold and the gate remain — the page still stops at the end of a section — but the transition is no longer an overlay. On a page of one ground a cover is invisible: nothing distinguishes "covered" from "nothing happened", and the old section's half-covered lines sit behind the new heading. Capped every frame at the incoming's measured penetration, so the two can never separate and show bare page. | `machine`, scrubbed · both surfaces travel one viewport | Truth · D26 | — | `createGatedDeck` (`exitVh`, default 100) |
| **the page holding its ground**, the interior scrub | A pinned section animates against ITS OWN reading span, not against the viewport. On a deck the two are not the same thing: a pinned slide's contents never cross the viewport, so a `top 88%` trigger is consumed while the section is still hidden behind the slide covering it — the beat plays where nobody can see it, and then nothing moves for the 125vh the section is actually read. `onSlideSpans` hands each read clock out and every beat is authored as a fraction of it. | `machine`, scrubbed across `read.start`→`read.end` | SCR-02 · Truth §01–§20 | — | `createGatedDeck`, module recipes |
| **the page holding its ground**, the interior scrub without a read clock | The same law on About, which runs `coverSeams` rather than `createGatedDeck` and therefore hands no read clock out. There the slide becomes a CSS **sticky span** instead: the section is given the pin's full height, one `position: sticky` screen inside it does the holding, and the interior binds to the section's own top-to-foot span. No second ScrollTrigger pins anything — the deck already pins that section at its foot, and two triggers pinning one node do not work. The sticky screen releases exactly where the deck's pin engages, so the two abut rather than overlap, and the interior's end is set to the gate: section height − one viewport − `BUFFER`. Below `deck:` (1024 × 820) the sticky never applies and the section is ordinary flow, which is also the reduced-motion and JavaScript-off document. §06 shows the sharp edge of this: its dotted thread and its three beats were triggered from the THREAD's own viewport crossings (`top 80%`, `top 65% once`), and inside a sticky screen the thread never crosses anything — both triggers resolve at a moment the reader cannot see. An interior bound to a viewport crossing has to be re-bound to the section's read when that section is held, and a beat that must stay played-once rather than scrubbed is fired from the read clock with a guard, never re-run on the way back. | scrubbed across `top top` → `+=(height − 100vh − BUFFER)`; About §03 is 300vh tall and reads 180 | SCR-02 · About §03 · the `/wonder` §02 and §04 precedent | — | `composition`, `theQuestion` |
| **time handing over** | Two stacked plates cross-dissolve. One whole frame hands to another. | `country` · 0.82s | A5 | **P9** | `dissolve` |
| **time handing over**, Truth's break ⚠ NOT RENDERED — §08 was withdrawn by the client on 11 September 2026, the day this row was written; the behaviour is built and kept, the section is not on the page | "Two shots of the same Country, and you never see the join." The first holds full screen while the page stops moving under you; the second comes up through it until the first is gone. Nothing slides and nothing scales — it is purely one image becoming another, which is P9's rule stated twice. The next era's colour then rises over the bottom of the shot as a wave before the page releases you. Shot A undelivered means the attribute is absent and the delivered photograph simply holds. | `machine`, scrubbed · opacity 1→0 linear across the read; the crest `waveHandoff` one wave-height from .70 | Figma 2051:5464 + REF 2309:4172 · Truth §08 | **P9** | `dissolve`, `waveHandoff` |
| **the guide leading the eye** | The traveller flies a leg; its trail draws behind by mask reveal. | `country` · 2.0s | G1 + G3 | — | `guide` ¹ |
| **the guide leading the eye**, Truth's rewind cue | Touch and narrow screens only. "Start from the beginning ↓" stops being an anchor jump and becomes travel: the whole descent runs past under the reader in one fast pass and settles on the Wattanuri floor, which is the oldest thing on the page — the reader is carried back through the time the page is made of rather than teleported past it. It lands on a full-width gold arrow at the head of that band pointing back up the way they came, because from the floor the story is read UPWARD. The arrow clears itself on the reader's own first scroll, or after eight seconds; it never waits to be dismissed. Reduced motion takes the position without the travel and still gets the arrow — absent, not slowed. | travel 1.15s through the shared glide's cubic ease-out (`smoothScrollTo`), interruptible; arrow `arrive` on landing, out on 0.4s `power2.out` | user direction 11 September 2026 / SCR-09 | — | `truthRewind` module, `arrive` |
| **the waterline**, click cut | A click lands like a drop: one gold ring blooms from the exact point of contact and fades, and does not follow the pointer afterwards. Site-wide, primary button only, fine pointers only. The pointer itself cannot answer a click — browsers latch the cursor image while the button is held, so `:active` never repaints it (verified 10 September 2026) — so the page answers instead. | `power2.out` · 0.5s | user direction 10 September 2026 | — | `clickBloom` |
| **a person speaking** | Words undim as they are spoken. No movement at all. Dim state 0.28. | `quiet` · 0.55s · 0.045 stagger | Y2 | P6 | `dim` |
| **a person speaking**, the attribution waits | The speaker is named only after the last word has landed. Naming them while they are still talking puts the caption ahead of the testimony. The portrait beside them is held — the permission a bucket grants is not the instruction the frame gives. | `machine`, scrubbed · words .10–.75 of the read span, attribution .78–.88 | Y2 · Truth §12 | P6 | `dim` |
| **accumulating** | Things add up: a count advances, a mark fills, an index lights. | `country` / `machine` | X3 | — | `stepCounter` `splitFlap` `vesselFill` `flattenReveal` |
| **accumulating**, the loop closes | About §04. The section's claim is that four things hold each other up, and the section DRAWS it rather than asserting it: the lede is a chain of three clauses, each clause arrives at reading size, folds down onto its place on the artist's spiral, and the card that clause names seats there on a short overshoot — "a thing that holds has to catch". The fourth position is drawn and left empty, because the draft's sentence has three clauses and a fourth would be invented. When all four stand the loop is closed, and that is **the only state in which the section's claim is true**; it holds there, nothing moving, before contracting. ⚠ ONE CARD IS WHOLE AT A TIME. A card carries a photograph, a title, a body and a label; at the scale four of them fit on the spiral its body lands near 8px, so a card is read whole and then becomes a compact version of itself — plate and title only, which is exactly what the board seats on the ring — as the next arrives. The card is never rendered twice for this: a second copy of a link is a second tab stop, and `aria-hidden` does not take an element out of the tab order. The clause is not duplicated either; the element that was read IS the one that folds. ⚠ POSITION-SCRUBBED, NOT VELOCITY-DRIVEN. The board asks for the turn to take the reader's scroll velocity and be parkable mid-turn (IMG-01, released by F9); it is bound to scroll position instead so the section retraces exactly on the way back, which is the contract the other two held screens on this page keep. Never on the photographs inside the cards — they are `frame` grade and hold still while their place on the ring travels. | `machine`, scrubbed across the read · cards seat on `catch` (`back.out(1.4)`), the site's first overshoot · clauses `settle` · one quarter turn per card · the contraction transform-only, NOT C2 | About §04 · Figma 2695:21396 (`REF · 05 ABOUT §04 THE LOOP — each clause builds the card it names`) · F9 for the overshoot; user direction 12 September 2026 for the hold, the position scrub and the compacting | P4 | `theLoop`, `settle`, module orbit |
| **the rest** | Nothing moves, for a stated duration. | — | brief §3 | **P1, P8** | `hold` |
| **a change of ground**, Record questions | The catalogue and question section, including their crests, change together from cream to midnight blue as the questions enter; text changes from charcoal to cream. Both remain blue through reading. | 70vh question entrance, scrub 0.4s | SCR-13 / user reference 9 September 2026 | — | `recordKnowledgeGround` |
| **attaches**, Record question panels | Each panel surfaces from below with a slight tilt and transparency, then squares up against its neighbours. Holds still for reading; reverses on upward scroll. | 70vh entrance, 12vh travel, scrub 0.8s | SCR-14 / user reference 9 September 2026 | — | `recordQuestionAttach` |
| **being drawn in**, Record masonry | Whole photos, icons and captions drift at different rates in each desktop column and fade at the viewport edges. The centre stays fully readable; reverse scroll retraces the motion. | native card passage, 6/14/9/18vh travel, scrub 0.45s; mobile fade only | SCR-12 / user reference 9 September 2026 | — | `recordMasonryPass` |
| **a change of ground**, rolling wave | The cream divider swells from 60% height and rolls sideways by 15% of the shared two-tile strip, as on About. It settles into its original shape as the incoming section reaches the top. About's crest motion ONLY — never its seam deck, which is /about's own verb. Carried by The Record's catalogue seam and, from 11 September 2026, the §01 → §02 join on /wonder and /living-work — on both, the hero is full bleed at rest and the incoming section's first band is transparent, so the crest rides up over the picture instead of carving into it. | the incoming section's approach (top bottom → top top), scrub 0.3s, power2.inOut | SCR-11 / user direction 9 September 2026, extended to /wonder 11 September 2026 | — | `recordWaveRoll` |
| **what radiates**, Record question ground | The two supplied dotted rings follow cursor position with opposing drift and slight tilt behind stationary questions. Return to centre on pointer leave; touch and reduced motion remain still. | power3.out, 0.8s horizontal / 1.05s vertical smoothing, 30px / 46px travel and 3.5° / 5° tilt | AMB-04 / user direction 9 September 2026 | — | `recordPatternDrift` |

¹ `guide` was dropped from the first build on Ivy's call, 2026-08-30: the traveller was a fix
for flatness, and flatness was being fixed by density instead. It is now built only on Truth's
chronology rail by user direction, 8 September 2026: one sticky `trail-point` samples the real
SVG strand at the reading line, rather than multiplying static pointers at every era.

**Back in build, 31 Aug 2026 — About.** Density is the right fix for a page whose argument is
accumulation, and the wrong one for a page whose argument is a single question. On `05 · About`
the traveller and the page's thread are the same object: the question travels down the page and
settles at each thing it measures, so the Guide is carrying meaning rather than covering for
flatness. `G1` travel + trail draw-on, `G3` waypoint settle, `G4` hand-off at the seams;
traveller is the trail lead rosette. Every placement ▲ flagged for Leonard Mickelo.

**`The page holding its ground` entered the grammar on 9 September 2026 by direct user
direction for Truth.** About established the deck mechanism; Truth makes the chronology rail's
traveller its visible read-and-buffer instrument. Marc's Wave / Divider root remains structural,
while its reusable inner ink pulls on ScrollTrigger before the buffer. The shared law,
route-specific instruments and accessibility cuts are recorded in [`deck.md`](deck.md).

## Variants — more effects, same rows

A row is a **meaning**, and several effects can serve one meaning at different volumes. This is
how the vocabulary grows without the grammar diluting — the brief caps the table at six to eight
roles and it is right to.

| Row | Quiet | Loud |
|---|---|---|
| the world opening | `frameOpen` (in its frame) | `breakOut` (frame gone), `aperture` (through a letterform), `escape` (a grid cell becomes the screen, and comes back), `surface` (The Record's pre-rendered screen opens from its cell), `reflow` (a filtered collection rearranges) |
| emerging from the ground | `brighten` | `brighten` on uneven seeded offsets (a montage laid by hand) |
| the page holding its ground | `createGatedDeck` (Truth rail + scroll-pulled wave ink), interior recipes bound to each slide's read span (`SCR-02`) | `coverSeams` (About buffer-pulled wave ink) |
| being drawn in | `pushIn` (one plane), `pullBack` (the camera withdraws instead); shared wheel inertia (`SCR-09`, `createSmoothScroll`) | `plateParallax` (layers inside one frame), `bleed` (past the edge) |
| a change of ground | `ground` (one sweep) | `groundRamp` (across four screens), `waveHandoff`, `overlap`, `stickyIndex` |
| a person speaking | `dim` (testimony — Truth §12 and §15C, dim state 0.28) | the same word-by-word undim on the count's SOURCED lines, Truth §15B only. Not testimony: these are the published figures her account is about, so the page reads them at her pace rather than stating them at its own. The one non-testimony use of this row, added 10 September 2026 on user direction — if a reviewer disagrees, this is the line to take it out at. **The figures themselves never move** (see the figures-of-loss ban below). |
| what endures | `settle` (lines) | `display` (chars), `waveClamp` (travels then holds), `ghostType` (behind everything), `knockout` (as a window) |
| what radiates | `arrive` | `emanate`, `triad`, `scatterResolve`, `mosaic`, `handoff` |
| the guide leading the eye, Truth cut | one sticky `trail-point` sampling the strand's real geometry, **tilted to ±2° of its ±13.2° tangent** — at 96px long the arrow read the full tangent as wobble rather than as tracking (10 Sep 2026). **The dot always remains; the ARROW belongs to the era.** On a section that names one the tail is drawn out of the rosette left to right by a `clip-path` inset (`● · ●- · ●-->`) and retracts the same way, with the label fading just behind it — both scrubbed on that section's own read and both finished before the cover, since a label crossing a seam belongs to neither section. A section naming no era keeps the dot and grows no tail. Derived from scroll every frame, never tweened: `paintRail` re-sets these properties each frame and would overwrite a tween. | `createGatedDeck` |
| the guide leading the eye | `routeDraw` (a drawn map surfaces out of short segments that start at seeded-random points and join until the whole shape stands — the D4 contour-map read — scrubbed across a sticky span; the line is the guide, there is no traveller. **Nothing synthetic is drawn:** these maps are filled ribbons, not stroked lines, so the segments are white strokes inside a MASK and what appears is the artist's own shape at the artist's own weight. Stroking a copy over the top was the first cut and it drew a doubled, bloated line that then had to fade out and hand over — the thickening-and-thinning the user reported on 9 Sep 2026. Wonder §02 and §04, `src/lib/motion/route-map.ts`), `brushFill` (a shape is coloured in: ONE continuous stroke entering at the top left and working down and up across it, never lifting, with the gap to the next stripe, the ends and the middle of every stripe all seeded-jittered so nothing in it is straight or evenly spaced — "imperfect, like a child colouring the area", 9 Sep 2026. Wonder §02) | `guide` |

`scrimRamp` belongs to no row on its own: X5 is a legibility requirement that travels with
whatever media effect it accompanies, and it is non-negotiable wherever copy sits on a picture.

**Wonder itinerary restoration — 9 September 2026, latest user direction.**
Figma `2033:5889` replaces the six-screen film with the canvas accordion, first
stop open. `arrive` introduces the heading and row furniture once. `disclose`
reveals or closes the panel by clip, fades its copy, turns the supplied chevron,
and translates following rows from their old positions after one layout change.
The photograph never scales or drifts. No pin, snap, timed opening or colour
ramp remains in this section. Reduced motion and no JavaScript use the same
native disclosures with immediate state changes. Desktop reference: 1440 × 900.

**Later scroll direction — 9 September 2026, supersedes the manual-only cut.**
The restored accordion now holds in a viewport at desktop sizes that can fit
its longest stop. Six 100vh reading spans advance the open stop automatically,
forward or backward. `itineraryStep` is a `disclose` variant in **the world
opening** row: one native layout change, then measured row translations so the
active heading always lands at the same viewport position. `stageArrival`
composes **what endures** (`settle`, whole lines) and **arriving quietly**
(`arrive`) for both the copy blocks and the photograph. These are
the treatments reviewed in the live effects lab. No photograph scales or warps.

**The phone is the frame's accordion — 10 September 2026, user direction.**
The held reading screen stays desktop only. The 375 frame (`2576:23040`) draws
the itinerary as one list: six stops, the first open, a 335 x 200 picture at 24
radius, 40px section padding, 20px viewport margins and 48px between the
heading block and the list. The build follows those measurements but not the
frame's fixed 1047px height — the section's height follows whichever stop is
open, so opening and closing is the ordinary `disclose`. The rule fill and the
chevron's CSS turn apply in this cut as well, and the fill is what advances the
list: `stageRule` scrubs the rule under a stop as it rises through the
viewport, and at a full fill the next day opens by itself. Nothing closes on
the way down — a stop opening below the reader adds height below them, so the
page never jumps under the thumb — and scrolling back up past the same rule
closes that day again. The closing rule is skipped; the last day has no next
one. A stop opened in this cut does not re-reveal its own
heading: the heading was on screen and read before the tap, so `stageArrival`
takes `title: false` and only the copy and the picture arrive. The held
reading screen keeps its heading `settle`, where the heading really is new to
the view. The 375 frame's own 335 x 7 rule artwork is used below `lg` (supplied
10 September 2026); the 1040 cut is unchanged above it.

**Itinerary rule as scroll indicator — 10 September 2026, user direction.**
The dotted rule below the open stop fills with burnt ochre (`--color-burnt`)
in step with that stop's span and is full when the list advances to the next
stop; earlier rules stay full, later ones stay empty, and reverse scroll
retraces the fill. In the held reading screen the controller writes
`--stage-fill` per frame; in the manual accordion `stageRule` scrubs it as the
stop passes the viewport. The chevron no longer turns through GSAP: it is a
CSS `rotate` transition on the glyph, so an automatic advance turns as smoothly
as a click. Reduced motion and no JavaScript keep the plain black rules.

**Stage picture entrance — 10 September 2026, user direction.** The stop's
photograph leaves **the world opening** and joins the copy in **arriving
quietly**: the same 16px rise and fade on the same `country` ease, started at
the same offset, so text and picture land together instead of the picture
opening its own clip 0.08 ahead. `frameOpen` is no longer part of
`stageArrival`. The photo is still held — `arrive` moves the frame, not the
image plane, so the slot's `frame` grade is unchanged.
The heading enters on scroll, and each stop's text and picture enter when that
stop is reached. No wheel lock or velocity snap. Short viewports, mobile,
reduced motion and no JavaScript keep the ordinary document; motion-capable
mobile disclosures still reveal text and pictures. Viewport correction,
9 September 2026: load the closed panels' fonts before measuring. Desktop
stops taller than their reading window add their overflow to the existing
100vh leg; after a 20vh seat, the track translates through the excess text,
then holds for the remaining 80vh. This is the same `itineraryStep` reading
track, in both directions, with no nested scroller or photo deformation.
Only mobile, reduced motion and windows too short to show a heading plus a
readable strip use native disclosures; the former 880px height gate is removed.

`escape` is `handoff` made reversible. `handoff` reparents the element, which is right for a
one-way continuity cut and wrong for anything a reader can scroll back out of; `escape` flies a
clone and leaves the real cell in place at opacity 0, so the grid behind it never reflows and the
card returns to exactly where it was. Both are Flip, and neither may be scrubbed — Flip measures
at trigger time, so a scrubbed Flip computed at one viewport width lands wrong at another. Pin
for a screen, run on enter, reverse on leave-back.

**The Record opening — 8 September 2026, latest user direction.**
9 September handoff correction: the hero retains its charcoal ground and fog.
The catalogue's cream WaveDivider provides the boundary, matching About.

9 September photo-lens refinement: `handprintPortal` / SCR-11 also applies the
Home painting zoom's sine-squared radial envelope to photo-plane projection.
Peripheral frames bow and tilt during approach, with fixed image UVs; reverse
scroll retraces the effect and the lens is neutral at both endpoints.

`handprintPortal` supersedes the static hero with one Three.js aperture scene
(200vh of scroll, transition channel). One supplied ink impression
defines the openings: black is empty, white remains sandstone, including the
palm's white centre and gaps between finger pads. The latest user direction adds
surrounding red-ochre hand stencils as pigment on solid stone; only the central
hand is cut through. The wall has a generated photographic sandstone material
and extruded cut edges in Three.js. Cards are
textured planes at different depths well behind the wall. The camera passes
through the hand while the cards approach immediately at different speeds.
They continue beyond the screen edges and fade near the camera, without an
arrived gallery or picture captions. Latest user direction: accelerate picture
approach from the first scroll, let side frames extend outside the viewport,
and fade the remaining upper pictures as the catalogue rises over the final
viewport of the 200vh hero. Whole card frames grow through
perspective; their image UVs remain fixed (no independent photo warp or drift).
Only camera/card transforms, card material opacity and intro copy opacity change. The
opening reverses on scroll back. The user explicitly permits generated artwork
for this direction, replacing the earlier iconography restriction. The supplied
ink mask and generated stone are interface assets, not records of rock art.
Reduced motion, unavailable WebGL or missing assets use the static hero and
ordinary catalogue. A native skip link bypasses the scene at every position.

**Earlier static direction — 8 September 2026 (F7 exception).**
The route no longer mounts page or grid motion and has no animated headings,
hover effects, count fades or route transition. The `surface` and `reflow` work
below remains in source as an earlier design; it is not active on `/the-record`.
**Scroll-feel amendment, 8 September 2026:** user direction adds the shared
`SCR-09` Lenis scroller (`lerp: 0.12`, the Living Work settings) to this route.
This is the input behaviour for the "being drawn in" row above; it creates no
section timeline. Content stays still. Touch and reduced motion use native
scrolling, and the scroller is destroyed when the catalogue page unmounts.
See [the scene ledger](scenes.md#the-record--static-by-direction-8-september-2026).

**Earlier measured cut — 8 September 2026, F7/F8 motion refinement.** `surface`
uses the existing screen plate rather than a DOM clone. Its image counter-scale is the
reciprocal of the plate's **current** scale on each axis, so the picture stays undistorted
throughout the flight. The rectangular corner mask uses `clip-path`; copy arrives 0.15s
after the plate lands. No new artwork is drawn. The scroll-driven return requested on
5 September remains a local exception to the unscrubbed `escape` above: measure inside
the held frame, rebuild after resize while preserving progress, and keep clicks timed.
`reflow` measures cards by their stable content ids, transforms the new layout for 0.55s,
and fades incoming cards. React retains ownership of every node. Both cuts revert when
the grid changes, the route unmounts, or reduced motion is enabled.

## Compositions — the sentences

Effects are the vocabulary; **compositions** are how a screen is actually built. Lumen is not
dense because it has forty effects, it is dense because every screen runs three or four at once,
and the Living Work hi-fi's §02 proves the point: pin, aperture, figure cycling, progress rail,
break-out and a Flip handoff, all on one screen.

`src/lib/motion/compose.ts` makes that a named thing with a declared loud channel and a span in
vh, asserted in development. `src/lib/motion/recipes.ts` holds the seven built so far. A screen
that reaches for loud effects from two channels fails the build rather than shipping as noise.

---

## Why `hold` is a real row

The brief is explicit that *"a rest scene is a real scene, not padding"*, and heaviness only
reads as heavy next to stillness. An unnamed pause is indistinguishable from a section somebody
forgot to animate; a `hold` in a timeline is a decision any reviewer can read.

The kit had already worked this out independently — `P8 · CINEMATIC HOLD` and `P1 · full-bleed
hold` are drawn as plates in `KIT · Truth`. Naming the effect just lets the code say what the
design already said.

## Why `dissolve` is the one effect permitted on held material

Most of this vocabulary deforms an image: scrubs it, masks it, pushes into it, opens a frame
over it. A dissolve does none of that. It hands one whole frame to another, which is how film
has always moved between two records, and it is why `P9 · DISSOLVE PAIR` is a `frame`-grade
plate while `P3` is not.

## The corollary that governs faces and records

> **Portraits of real people hold still. The world moves around them.**

No parallax drift on a face, no hover-scale on an archival photograph, no ken-burns on a person
who did not consent to being animated. Motion applied to a person turns them into an asset.

The same shape governs cultural-site material — Marra Wonga, the engravings, the teaching wall.
Ivy's decision of 30 August 2026 is that these are **available and used**, at `frame` grade: the
plate, the ground, the scrim, the type and every neighbouring layer move at full cinematic
weight, and the image plane inside them holds. That is not a smaller ration. P1 and P8 are the
heaviest plates in the kit and both are frame plates.

The grade is enforced in `src/content/lofi/media.ts` and stamped on every tile as
`data-motion`, so a held photograph dropped into a scrubbing grid keeps its image still rather
than quietly inheriting whatever the component does.

## Bans, restated because they are grammar too

- ~~**No overshoot.**~~ **Lifted by F8 (31 Aug 2026).** `back`, `elastic` and `bounce` are
  allowed; the dev-mode guard in `effects/shared.ts` is a no-op. Character is a design choice.
- ~~The §6 excluded-techniques table~~ is retired by the same decision. Dissolve, chromatic
  split, velocity warp, character decode, image trail and duotone are available on depicted
  subjects. See `ART-DIRECTION.md` §6 and F9.
- **No count-up on figures of loss.** A number describing people who died or land taken is
  stated and held, never ticked upward like a sales metric.
- **Testimony is split by line or word, not by character.** Note what this is and is not:
  `ENT-07` decode is available everywhere under F9 — on headings, on names of organisations, on
  interface text. This one line is about a *content type*, not a technique. Anything a person
  actually said keeps its words intact as words.
- **No layout properties, ever.** Transform, opacity and `clip-path` only. Animating
  `width`/`height`/`top`/`left` is what makes an "immersive" site stutter, and one janky frame
  costs more reverence than any effect buys.


Home central aperture correction, 9 September 2026 (now /homepagev2 only -- the homepage has no painting to open through): the woodland road appears inside the inner ring as soon as the painting begins revealing, before the zoom. It remains opaque while the red ground draws around it. If the landscape fails to load, the centre retains the painting.


| **the landscape opens to Wonder** | The Wonder copy rises from below the viewport onto the road it is already standing on, and the land reaches its own hour as it comes: sky 316 → 600 rows into the sequence, light 263 → 510, the frame black 0.4 → 0.2. Reversing scroll lowers the copy and takes the hour back with it. | same homeHeroDissolve timeline; both over 0.8 units from 0.8, holding to 1.6; 80vh per unit; scrub 0.8s | Figma 3371:41413, user direction 10 September 2026 / SCR-09 | P3 | `homeHeroDissolve` |


| **the painting bends open** (/homepagev2 only) | During the portal approach, a radial lens curve stretches the supplied painting toward the viewport edges. The centre and landscape stay stable; curvature settles to zero on arrival and reverses with scroll. | existing portal span 1.18-2.18; smooth envelope, zero distortion at both ends | user reference 9 September 2026 / SCR-09; left the homepage 10 September 2026 with the rest of the painting opening | P3 | `homeV2HeroDissolve` |


| **the woodland breathes** | AMB-05: a gentle local wind displaces grass and canopy pixels in the Home road layer; a widening exclusion holds the road still and dark trunks receive minimal motion. | 24s seamless ambient phase, running from the photograph's decode on `/` and from portal arrival at /homepagev2; paused offscreen/hidden, absent with reduced motion | user direction 9 September 2026, regated 10 September 2026 | media only | `homeLandscapeBreeze` |


AMB-05 correction, 9 September 2026: user found the distortion too obvious. Restrict wind to three feathered grass patches in source-image UV space, remove canopy sway, reduce grass displacement by 80%, and slow the ripple from nine to four cycles per 24-second phase. Unselected pixels remain still. This supersedes the broad vegetation mask above.


AMB-05 visibility tuning, 9 September 2026: the reduced pass was too faint. Keep the same three grass selections and stationary trees/road, but increase horizontal displacement from 0.00015 to 0.0006 UV and vertical displacement to 0.00012 UV. Six cycles per 24-second phase give a visible four-second ripple; no broader vegetation warp is restored.


AMB-05 stronger breeze, 9 September 2026: user still could not see the ripple. Increase horizontal displacement fourfold to 0.0024 UV, vertical to 0.00045 UV, broaden the three foreground selections, and use three-second cycles. Reduce colour-mask suppression of dry yellow grass. The road exclusion and stationary horizon remain. This supersedes the previous amplitude tuning.


AMB-05 viewport correction, 9 September 2026: checking the 2048-by-758 landscape confirmed the cover crop removes most of the low grass selections. Add three mid-ground grass selections higher in the source image, retaining the original foreground selections for taller viewports. No amplitude increase; the road exclusion and horizon remain fixed.


AMB-05 final scope correction, 9 September 2026: user requests all vegetation to ripple gently. Remove the six patch selections. Apply a broad vegetation mask with road exclusion and dark-trunk suppression, with 0.0009 UV grass ripple and 0.00065 UV canopy sway. This supersedes the patch-selection approach and its viewport workaround. Sky, road, pause behaviour and reduced-motion fallback remain unchanged.


| **the landscape introduces Truth** | SCR-09: after Wonder holds, its copy rises away; the same two sequence layers travel on to Truth's frame (sky 600 → 1422, light 510 → 464, black 0.2 → 0.25), so the saturated blue is a later hour of one day rather than a second composition. Truth, Iningai Nation and the first existing subject-detail paragraph rise into a centred upper block. | homeHeroDissolve 3.4-4.2; hold to 4.6; total pin 552vh; reversible scrub 0.8s | user screenshot 9 September 2026 | quiet type over held landscape with AMB-05 breeze | `homeHeroDissolve` |


| **Country carries the years** | SCR-10: Home Truth continues on the same canvas. Figma sky/light layers travel through their measured offsets; the supplied dotted path enters, year marker follows its seven anchors, prose crossfades in stillness. Reverse scroll restores every state. | 120vh per timeline unit; 0.4-unit transitions, 0.6-unit reading holds; final 0.9-unit hold; reduced motion uses static Truth | user screenshots and Figma 3371:45208-46472, 9 September 2026 | transition leads; quiet type, existing AMB-05 breeze | `homeHeroDissolve` |


| **the painting speaks after opening** (/homepagev2 only) | SCR-09 refinement: finish the painting reveal at 0.95 before introducing its three text blocks, in order, with slow opacity fades. Hold the complete copy before fading it out and entering the portal. | text at 1.08/1.62/2.18, durations 0.50/0.50/0.55; clear at 3.03; portal at 3.18; 120vh per unit, reversible scrub | user direction 9 September 2026; left the homepage 10 September 2026 with the rest of the painting opening | media first, quiet type second | `homeV2HeroDissolve` |


SCR-10 smooth-scroll refinement, 9 September 2026: year-to-year marker travel and sky/light interpolation now fill each entire 120vh leg with linear scroll progress, removing the previous 0.6-unit stop after every 0.4-unit move. Prose and year labels use slower 0.3-unit fades, with a short separation to keep text legible. The final scene retains its 0.9-unit reading hold. Shared Lenis and the existing 0.8s scrub provide input smoothing; reverse scroll follows the same path.


| **the night welcomes Belonging** | SCR-10 continuation: after the final year holds, fade out all Truth copy and timeline; move the supplied sky/light layers to Figma offset 5822 and fade/rise the Belonging block into place. AMB-05 phase gently varies existing star brightness only, masked out by terrain. | exit 0.45 units; sky 1.2; copy rise 1 unit after 0.45; hold 1.2; reversible, 120vh/unit; ambient pauses offscreen/hidden, absent in reduced motion | user screenshot and Figma 3371:41578, 9 September 2026 | quiet type arrival, subtle supplied-star twinkle | `homeHeroDissolve`, `homeLandscapeBreeze` |


Belonging stars amendment, 9 September 2026: user requests our own Three.js implementation. The supplied star-image sky is replaced during Belonging by a procedural GLSL star field within the existing canvas. Seeded sparse stars vary in radius, brightness and twinkle phase; no constellations are traced. Terrain alpha occludes stars. The registered AMB-05 phase drives subtle twinkling, paused offscreen/hidden and absent in reduced motion.


| **a star crosses the night** | AMB-05 Belonging refinement: one procedural shooting star roughly every eight seconds, travelling diagonally with a tapered trail and soft head. Fade in/out over its 1.4-second flight; no overlapping meteors. Screen-relative paths remain visible on mobile, terrain alpha hides the trail behind trees. | existing 24-second registered ambient phase, three varied paths; visible only in settled Belonging; pause offscreen/hidden and disable with reduced motion | user direction 9 September 2026 | subtle ambient sky | `homeLandscapeBreeze` |

| **the road opens into an invitation** | SCR-09 / ENT-05: Belonging fades after its reading hold; a bottom media scrim darkens the road. The Invitation is a panel on the pinned canvas, not a section below it: the whole block travels up one viewport and the land scene lifts with it, slower, charcoal following it in, so the held canvas reads as the page scrolling on. | 0.6-unit exit; 1.3-unit yPercent panel travel from `invitationAt + 0.2`, sine.out, then a 1.1-unit reading hold; 0.62-screen `lift` of the canvas scene over 1.6 units; static layout for reduced motion | Figma 3371:41740, user direction 9 September 2026 | transition; photographs stay still within their cards | homeHeroDissolve |
| **the page ends on a line** | SCR-09: the closing statement is the last panel on the same pinned canvas. The Invitation leaves the way it came, the lift finishes carrying the land off the top, and the line resolves in place — a fade, not a travel, because it is the page's last word and is read still. | Cards out on `yPercent` -100 over 1 unit, sine.in; `lift` to 1.15 over 1.2; empty canvas held, then panel in on opacity alone over 1.2 from `wayAt + 1.5`, sine.inOut; spirals rise `yPercent` 100 → 0 over 1.9 units at 0.28 opacity, sine.out, then hold; 1.2-unit reading hold before the pin releases | Prototype deck slide 20, user direction 9 September 2026 | type; the canvas is still and empty behind it | homeHeroDissolve |
| **the offer is set down around the words** | SCR-09: the closing line clears and its paragraph takes the same middle band, then four photographs arrive around it, two above and two below, none of them touching the copy. The spirals stay: one screen, not two. | Line out 0.7 units; body in on opacity over 0.9 from `offerAt + 0.6`; plates in from 7% of canvas height, 0.9 units, 0.18 stagger, sine.out, from `offerAt + 1.4`; 1.3-unit hold before the pin releases | Prototype deck slides 22-23, user direction 9 September 2026 | media; frame grade, the plates hold still once placed | homeHeroDissolve |
| **the page closes on its choices** | SCR-09: the offer and the spirals clear and the four pathways come up a viewport, the same arrival The Invitation makes, so the page ends on the movement it opened the choices with. The cards settle corner to corner, then the scroll carries the row right to bring the last one in. | Offer and spirals out 0.7 units; panel in on `yPercent` 100 -> 0 over 1.2 from `pathAt + 0.25`, sine.out; cards from 6% of canvas height, 0.8 units, 0.12 stagger, from `pathAt + 0.9`; track carried right to its measured end over 1.8 units linear from `pathAt + 1.9`; 1.2-unit hold before the pin releases | Prototype deck slide 24, user direction 9 September 2026 | transition; frame grade, the photographs hold still | homeHeroDissolve |
