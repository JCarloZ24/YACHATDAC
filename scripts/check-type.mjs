#!/usr/bin/env node
/**
 * Typography check — see .claude/skills/yachatdac-typography/SKILL.md.
 *
 * Three failures this catches, all of which have happened or nearly happened:
 *
 *   1. A face the site does not ship. The Figma file draws in Archivo and
 *      Baloo 2; the build repoints those to Bantayog Sans and Block Berthold.
 *      Copying a family name out of `get_design_context` imports a font that
 *      does not exist here, and the browser silently serves a fallback.
 *   2. An inline or component-level `font-family`, which routes around the
 *      utilities and the tokens behind them.
 *   3. A heading-sized element with no font utility, so it renders in Work
 *      Sans at 96px.
 *
 * Body copy legitimately carries no utility — body IS Work Sans, set on
 * <body>. So (3) only fires above a size threshold, and it is a WARNING. This
 * is a lint, not a judge: read what it says rather than driving it to zero.
 *
 * Usage:  node scripts/check-type.mjs [path ...]      (default: src)
 * Exit:   1 if any ERROR, 0 otherwise (warnings never fail the run).
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
const CWD = process.cwd();

/**
 * Faces the Figma file draws in that this project deliberately does not ship.
 * `match` is one pattern per family — Figma writes Baloo 2 as both "Baloo 2"
 * and "Baloo_2" depending on the export, and reporting each separately named
 * the same line twice.
 */
const REPOINTED = [
  { name: "Archivo", match: "Archivo", use: ".eyebrow (Bantayog Sans)" },
  { name: "Baloo 2", match: "Baloo[ _]2", use: ".headline (Block Berthold)" },
];

/**
 * Above this, an element with no font utility is probably a heading that lost
 * its class. Tailwind's text-3xl is 1.875rem; ledes and standfirsts sit below.
 */
const HEADING_REM = 1.875;
const NAMED = { "3xl": 1.875, "4xl": 2.25, "5xl": 3, "6xl": 3.75, "7xl": 4.5, "8xl": 6, "9xl": 8 };

const files = [];
const walk = (p) => {
  let s;
  try {
    s = statSync(p);
  } catch {
    return;
  }
  if (s.isDirectory()) {
    if (/node_modules|\.next|\.git/.test(p)) return;
    for (const e of readdirSync(p)) walk(join(p, e));
  } else if (/\.(tsx|jsx)$/.test(p)) files.push(p);
};
ROOTS.forEach(walk);

const errors = [];
const warns = [];

/** Line number of a character offset, for a clickable path:line. */
const lineAt = (src, idx) => src.slice(0, idx).split("\n").length;

for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const rel = relative(CWD, file).replace(/\\/g, "/");

  // Comments explain the repoint by name, so strip them before scanning.
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

  for (const { name, match, use } of REPOINTED) {
    const re = new RegExp(`['"\`\\[]${match}[:'"\`\\]]`, "g");
    const seen = new Set();
    let m;
    while ((m = re.exec(src))) {
      const line = lineAt(src, m.index);
      if (seen.has(line)) continue;
      seen.add(line);
      errors.push(
        `${rel}:${line}  "${name}" is not shipped by this project — use ${use}`,
      );
    }
  }

  const fam = /font-?[Ff]amily\s*[:=]/g;
  let m;
  while ((m = fam.exec(src))) {
    errors.push(
      `${rel}:${lineAt(src, m.index)}  inline font-family — set type through .headline / .eyebrow / body instead`,
    );
  }

  const cls = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g;
  while ((m = cls.exec(src))) {
    const c = m[1] ?? m[2] ?? "";
    if (/\bheadline\b|\beyebrow\b|\bcallout\b/.test(c)) continue;

    let biggest = 0;
    for (const s of c.matchAll(/(?:^|\s|:)text-\[([\d.]+)rem\]/g)) {
      biggest = Math.max(biggest, parseFloat(s[1]));
    }
    for (const s of c.matchAll(/(?:^|\s|:)text-(3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/g)) {
      biggest = Math.max(biggest, NAMED[s[1]]);
    }
    if (biggest >= HEADING_REM) {
      warns.push(
        `${rel}:${lineAt(src, m.index)}  ${biggest}rem text with no font utility — heading, or intentional body?`,
      );
    }
  }
}

const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
if (errors.length) {
  console.log(`\nERRORS (${errors.length})`);
  for (const e of errors) console.log("  " + e);
}
if (warns.length) {
  console.log(`\nWARNINGS (${warns.length}) — check each, do not blanket-fix`);
  for (const w of warns) console.log("  " + w);
}
console.log(
  `\n${files.length} files · ${plural(errors.length, "error")} · ${plural(warns.length, "warning")}`,
);
process.exit(errors.length ? 1 : 0);
