import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
