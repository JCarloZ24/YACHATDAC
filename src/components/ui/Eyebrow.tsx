import type { ReactNode } from "react";

/**
 * Small-caps label above a headline. Build doc §5: small caps,
 * letter-spacing ~0.12em, accent colour per section.
 */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
