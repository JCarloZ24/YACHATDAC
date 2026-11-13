import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { org } from "@/content/site";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = `${org.name} — ${org.legalName}`;
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: "Welcome to Turraburra", // GA1/GA13, 13 Nov 2026
    title: org.legalName,
    standfirst: org.coreNarrative,
    ground: "canvas",
    path: "/",
  });
}
