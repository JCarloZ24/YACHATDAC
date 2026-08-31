# Project skills

Skills scoped to this repo. Claude Code picks them up automatically from
`.claude/skills/<name>/SKILL.md`.

The `gsap-*` skills are the official GSAP references (core, timelines,
ScrollTrigger, plugins, React, frameworks, utils, performance).

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
