"use client";

import Link from "next/link";
import { useWaterFill } from "@/components/layout/use-water-fill";

/**
 * A nav link that fills with gold from the point the cursor entered it —
 * the CONNECT blob's hover, carried onto the words (10 September 2026, user
 * direction: "do the same animation on connect button to nav bar text").
 *
 * The gesture is the blob's, beat for beat: the fill spreads from the entry
 * point, keyboard focus runs it from the centre, and leaving drains it back
 * toward the exit point — so a cursor crossing a link left-to-right pulls the
 * gold across and lets it fall away behind. Same gold, same durations, same
 * eases as `ConnectButton`, because it has to read as one behaviour and not
 * two that happen to share a colour.
 *
 * What does NOT carry across is the roughened waterline. On the blob that is
 * an SVG displacement filter on the fill layer; a CSS filter applies to the
 * whole element before its background is clipped to the text, so the same
 * trick here would ripple the letterforms rather than the edge. See the
 * `water-fill` utility in globals.css. The glyphs do the ragged edge instead.
 *
 * The painting is all in that utility, and the three custom properties it
 * reads are moved by `useWaterFill` — shared with the About disclosure's
 * trigger since 11 September 2026, so both render through one code path and
 * cannot drift apart. This stays a thin wrapper around `Link` and leaves the
 * type, colour and layout classes to the call site.
 */

export function WaterNavLink({
  href,
  className = "",
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const { ref, handlers } = useWaterFill<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={href}
      className={`water-fill ${className}`}
      {...handlers}
      {...rest}
    >
      {children}
    </Link>
  );
}
