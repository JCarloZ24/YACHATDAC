import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { IntroGate } from "@/components/layout/IntroGate";
import { TransitionProvider } from "@/components/motion/TransitionProvider";
import { RouteBlink } from "@/components/motion/RouteBlink";
import { RouteLoader } from "@/components/layout/RouteLoader";
import { ClickBloom } from "@/components/motion/ClickBloom";
import { org } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${org.name} — ${org.legalName}`,
    template: `%s — ${org.name}`,
  },
  description: org.coreNarrative,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* lang="en-AU": the site is Australian and the copy is Australian English. */
    <html lang="en-AU">
      <head>
        {/* Block Berthold is served from Adobe Fonts (kit qqn2php) — that is
            its web licence. The self-hosted woff2 stays only as the fallback
            face in the stack; see public/fonts/README.md. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/qqn2php.css" />
        {/* Preload only the faces above the fold. The audience this site is
            most for is often on the worst connection to it, so every extra
            face is a real cost — do not add more without checking. */}
        <link
          rel="preload"
          href="/fonts/BantayogSans-ExtraBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/WorkSans-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-svh flex-col">
        {/* The click answer, site-wide — grammar `the waterline, click cut`.
            Renders nothing; see ClickBloom for why the page answers a click
            rather than the cursor. */}
        <ClickBloom />
        {/* Spends the homepage's opening film once the reader is demonstrably
            inside the site — see IntroGate. Renders nothing. */}
        <IntroGate />
        {/* X7 route transitions, for EVERY route (August, 11 September 2026).
            This used to be mounted in the about, living-work and truth
            layouts only — so six of the nine pages
            never opened the route-entry gate, never reset scroll on a
            navigation, and fell through to the browser's own crossfade. The
            about layout's own comment always said this belonged at the root
            "when more pages promote"; they have. Renders nothing. */}
        <TransitionProvider />
        {/* The blink itself — the panel that covers the swap. Mounted beside
            the provider, which owns the scroll reset and the entrance gate
            that happen behind it. */}
        <RouteBlink />
        {/* The site's one loading panel, announcing whichever page it covers
            (user direction 11 September 2026). Hard loads only, gated on the
            motion pass having built rather than on connection speed — see
            RouteLoader for the measurements. Sits above the header so it
            covers the whole document, and mounted here rather than per page so
            its once-per-page-load flag keeps working across navigations. */}
        <RouteLoader />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
