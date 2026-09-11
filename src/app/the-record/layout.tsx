import type { ReactNode } from "react";
import "./_components/navigation.css";

/** X7 / SYS-02, 11 September 2026: RouteLoader now covers article navigation
 * and image decoding. Keep the article image fade in this segment. */
export default function RecordLayout({ children }: { children: ReactNode }) {
  return children;
}
