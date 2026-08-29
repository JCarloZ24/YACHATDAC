/**
 * Unlocks the React canary type surface under strict TS — ViewTransition,
 * addTransitionType and Link's transitionTypes all live behind it. The App
 * Router ships React canary at runtime regardless of package.json, so the
 * types and the runtime agree (see node_modules/next/dist/docs/01-app/
 * 02-guides/view-transitions.md).
 */
/// <reference types="react/canary" />
