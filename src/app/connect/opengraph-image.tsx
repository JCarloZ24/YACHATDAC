import { BANNER_CONTENT_TYPE, BANNER_SIZE, renderBanner } from "@/lib/og/banner";
import { org } from "@/content/site";

/** Link-preview banner for this route — see src/lib/og/banner.tsx. */
export const alt = `Connect with ${org.name}`;
export const size = BANNER_SIZE;
export const contentType = BANNER_CONTENT_TYPE;

export default function Image() {
  return renderBanner({
    eyebrow: "Connect",
    title: "Get in touch",
    standfirst: `Guesting, research and partnerships, ranger exchange, and material for the record. ${org.name}, Barcaldine, Central Western Queensland.`,
    ground: "canvas",
    path: "/connect",
  });
}
