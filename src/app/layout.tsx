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
      <body className="flex min-h-svh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
