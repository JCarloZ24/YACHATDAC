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
        {/* Preload only the faces above the fold. The audience this site is
            most for is often on the worst connection to it, so every extra
            face is a real cost — do not add more without checking. */}
        <link
          rel="preload"
          href="/fonts/BlockBerthold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/BantayogSans-Bold.woff2"
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
