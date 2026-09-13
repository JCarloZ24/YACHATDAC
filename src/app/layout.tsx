import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { skipLinks } from "@/content/site";
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
        {/* X7: request the shared loading cover before following a link. */}
        <RouteBlink />
        {/* X7 / SYS-02, 11 September 2026: the named readiness cover for every
            public route, link navigation, refresh and hard refresh. */}
        <RouteLoader />
        {/* ⚠ FIRST FOCUSABLE ELEMENT ON EVERY ROUTE, and it has to stay
            first — `sr-only` until it is focused, then a real visible control.
            MOTION-SYSTEM.md requires a skip mechanism of any page that jacks
            scroll, and the site had none: measured on /about, a keyboard user
            tabbing from the top reached the four footer links and nothing else
            (13 September 2026). /about carries a second one past its deck; see
            `AboutSkip`. */}
        <a
          href="#content"
          className="eyebrow sr-only rounded-xs bg-charcoal px-4 py-2 text-xs tracking-[0.08em] text-canvas focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100"
        >
          {skipLinks.content}
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
