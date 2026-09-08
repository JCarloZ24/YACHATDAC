# Project skills

Skills scoped to this repo. Claude Code picks them up automatically from
`.claude/skills/<name>/SKILL.md`.

The `gsap-*` skills are the official GSAP references (core, timelines,
ScrollTrigger, plugins, React, frameworks, utils, performance).

The `threejs-*` skills (fundamentals, geometry, materials, lighting, textures,
animation, loaders, shaders, post-processing, interaction) are the
CloudAI-X/threejs-skills bundle, installed 8 September 2026 for the `/the-record`
handprint portal — the first scene in this build that runs a WebGL renderer
rather than GSAP over the DOM. Source:
https://github.com/CloudAI-X/threejs-skills (via agenticskills.io). They are a
Three.js API reference only: motion still cites a row of
`docs/motion/motion-grammar.md`, still registers through
`src/lib/motion-controller.ts`, and still honours the per-slot motion grade.

The same ten are installed for Codex in `.agents/skills/` — repo-level, the
convention `AGENTS.override.md` sets for this repo, alongside the `gsap-*` and
`yachatdac-typography` copies already there. `.agents/skills/` and
`.codex/skills/` are both valid Codex roots; run `codex debug prompt-input` to
print the resolved root table rather than trusting either doc.

A second global copy lives in `~/.codex/skills/`. Codex does **not** de-duplicate
by skill name — it lists every root, so each `threejs-*` skill currently appears
twice in the model-visible skill listing. That is noise, not breakage. If it
bothers you, `rm -rf ~/.codex/skills/threejs-*` and keep the repo copy, which is
the one that travels with the checkout.

`yachatdac-typography` is the type system — the three licensed families, and
the Figma→code repoint that means a correctly built page never matches the
frame's letterforms (the file draws in Archivo and Baloo 2; the site ships
Bantayog Sans and Block Berthold). Read it before writing markup for a hi-fi
section, and whenever a page "looks wrong" typographically — it usually is
this, correctly implemented. `npm run check:type` enforces the parts a script
can enforce.

`yachatdac-motion` was removed under decision **F8** (31 Aug 2026, see
`docs/decisions-and-risks.md`): the team builds freely and the work is
reviewed by Steve (FNAN) and the Elder Advisory Group at presentation. The
motion system itself is documented in `docs/motion/`; the skill's grants and
the two surviving lines (no heritage coordinates in source, no generated
Aboriginal iconography — supplied artwork only) are recorded in F8.

Ports that outlived the skill and now stand on their own:

| File | What it is |
| --- | --- |
| `src/app/motion-tokens.css` | Motion palette, aliased onto the Tailwind theme |
| `src/lib/motion-controller.ts` | Tier 1 GSAP registry |
| `src/lib/motion.ts` | Entry stagger and reduced-motion primitives |
