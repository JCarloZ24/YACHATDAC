/**
 * Y2's dim state, in one place.
 *
 * The spec fixes it: "Per-word opacity ramp, dim state 0.28 not
 * near-invisible." Both the component that renders the words and the module
 * that ramps them need this number, and tokens.md is explicit that shared
 * timing and state values do not get written down twice.
 */
export const Y2_DIM = 0.28;
