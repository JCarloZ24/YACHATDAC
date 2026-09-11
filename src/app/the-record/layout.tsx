import type { ReactNode } from "react";
import { RecordNavigation } from "./_components/RecordNavigation";
import "./_components/navigation.css";

/** NAV-06: persistent navigation host spans catalogue and article routes. */
export default function RecordLayout({ children }: { children: ReactNode }) {
  return <><RecordNavigation />{children}</>;
}
