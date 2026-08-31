# Motion & effects wishlist

Running list of the animations and effects we want on the site. Add to it freely —
this is the input list, not the approved list.

**2026-08-29 — the immersive mandate (F7).** The client directed cinematic motion
site-wide; the budget/tier gate that used to close this list is superseded. Ideas
now graduate straight into page motion scripts, checked only against the Loud
Channel rule, the vh/perf budgets, and the subject-matter table below. The
reference set behind the v2 build: lumen-artspace.webflow.io (GSAP + Flip +
Barba), danu.ventures (the 3D arc), pear.no (scrubbed film, print texture),
GSAP Showreel 2025.

**Template**

```
### Title
`what to search on Google for a gif/photo reference`
- used for
```

Status lines are added by whoever builds the thing, not by whoever asks for it.

---

## Asked for so far

### 1. Loading screen with real progress
`webflow preloader percentage counter 100 percent enter site button dark`
- Site entry. Background video of Country, logo centred, progress counting up,
  "View site" appears at 100%.
- **Built.** Progress is measured from real font bytes, not a fake counter —
  sketch X1 is explicit: *"never fake the number"*. Video slot is empty until
  footage lands; it must be Country/landscape, never a cultural site.

### 2. "Turning time back" entry
`night to sunrise timelapse crossfade transition`
- The moment between the loader lifting and the hero landing. Winds the clock
  backwards, then the hero arrives.
- **Built.** Runs on Marc's two hero frames: opens on the night shot, dawn
  breaks into the sunset shot. One constant (`HERO_NIGHT_ENTRY`) turns it off
  if the two frames are meant as two options rather than a sequence.

### 3. Background colour bleed between sections
`scroll background color change section transition website gsap`
- Signals you've moved from one beat to the next without a hard cut.
  Wonder → Truth → Belonging on the homepage.
- **Built** — this is the sky clock (A2). Midnight → Oxide → Roasted across one
  pinned screen, 250vh.

### 4. Scattered images converging into a grid
`images scatter assemble into grid scroll animation gsap`
*(reference: Lumen screenshots 2–5)*
- **The Invitation** on the homepage. Images fly in from off-screen and resolve
  into a grid behind the heading.
- **Built,** behind the heading only. Behind the cards it read as two competing
  grids — see the note in `Invitation.tsx` for why, so it doesn't get
  re-attempted.

### 5. Giant ghost letterforms + receding 3D grid
`oversized background typography parallax scroll`
`3d perspective grid images receding scroll website`
*(reference: Lumen screenshots 6–9)*
- Homepage, split across two beats: ghost type on Truth, the receding planes on
  Living Work.
- **Built.** The blur-to-sharp half of the reference can't be done — `filter` is
  banned in the per-frame path — so it cross-fades a soft layer against a sharp
  one instead. Looks the same, cheaper.

### 6. Something on every scroll
`scroll triggered animation showcase website awwwards`
- A rule rather than a single effect: every section gets something, text or
  image.
- **Partly.** Every section has entry motion; the four moments above carry the
  weight.

### 7. Hand-drawn "↓ Scroll" cue
`hand drawn scroll down text website hero`
- Bottom of the hero copy block. GoodDog Plain in Warm/Yellow Gold, gentle bob,
  dies permanently on first scroll.
- **Built.** Font is installed and is Fonthead freeware, so no licence question
  on this one.

### 8. Hero background photo + artwork path
`hero section full bleed photo overlay line art`
*(reference: Marc's hi-fi frames)*
- The hero. Photograph full-bleed, the dotted path vector low and right.
- **Built.** The path **never moves** — see the constraint below.

---

## Two things to check an idea against before adding it

### The gate is the Loud Channel rule (F7 — was: a budget of two)

The old rule — F4's two signature moments, Tier 1 homepage-only — is superseded
by **F7, the immersive mandate** (client directive, 2026-08-29). Motion is the
default on every page. What replaces the budget as the gate:

- one loud channel per screen — media, type, or transition, never all three;
- every span documented in vh in the page's motion script;
- the 60fps and media budgets in the motion skill's `tokens.md`.

The `data-tier1-exception` flags in v1 code are historical — they reference the
superseded F4 and remain only where the v1 pages do.

### Some effects are closed by subject matter, not by taste

This is the one that will save the most wasted design time. Whether something
can move is a property of **what it shows**, not of how good the motion is.

| Material | Can it move? |
|---|---|
| Country, landscape, sky, water | ✅ yes |
| People working — rangers, fire, seed, the towers | ✅ yes |
| Leonard Mickelo's artwork | ❌ static only — no motion permission recorded |
| Cultural sites — Marra Wonga, engravings, the escarpment | ❌ never, standing rule |
| Story-wall imagery | ❌ unavailable entirely — build typographically |

One more that applies regardless of subject:

- **No generated Aboriginal iconography in code.** No concentric circles, dot
  fields, meandering waypoint paths, U-shapes or animal tracks. Artwork comes
  from the artist as a supplied asset. Using Leonard's exported vector is fine;
  drawing something that resembles it is not.

---

## Where the rules live

⚠ **Superseded by F8 (31 Aug 2026).** The `yachatdac-motion` skill, its sketch
library, permissions board and token reference were removed; the ❌/permission
gating above no longer applies. The team builds freely and the work is reviewed
by Steve (FNAN) and the Elder Advisory Group at presentation. See
`docs/decisions-and-risks.md` F8 for the two lines that survive (no heritage
coordinates in source; no generated Aboriginal iconography). Tokens now live in
`src/lib/motion/tokens.ts` and `src/app/motion-tokens.css`; the motion system is
documented in `docs/motion/`.
