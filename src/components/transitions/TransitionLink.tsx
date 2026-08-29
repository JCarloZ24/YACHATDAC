"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * A <Link> that declares its direction so X7 can pick the right animation.
 * Forward is the default; pass direction="back" on links that go up the
 * hierarchy (breadcrumbs, "back to" links). Untyped browser back/forward
 * falls through to the quiet crossfade on its own — that is correct, do not
 * try to type it.
 */
type TransitionLinkProps = ComponentProps<typeof Link> & {
  direction?: "forward" | "back";
};

export function TransitionLink({
  direction = "forward",
  ...props
}: TransitionLinkProps) {
  return <Link {...props} transitionTypes={[`nav-${direction}`]} />;
}
