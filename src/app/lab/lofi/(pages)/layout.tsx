import Link from "next/link";

/**
 * Chrome for the lo-fi walkthrough.
 *
 * Deliberately not `LabHeader`: these are whole pages rather than one
 * behaviour, and a header in the document flow would change the frame the
 * page is being judged in — the same reason the sketch pages put their
 * controls in a floating panel. So the only chrome is a back link, floated
 * clear of the layout, sitting under the loader's z-index so it cannot show
 * through the panel.
 */
export default function LofiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Link
        href="/lab/lofi"
        className="eyebrow fixed top-4 left-4 z-40 rounded-sm border border-canvas/25 bg-charcoal/80 px-3 py-2 text-canvas/70 backdrop-blur-sm transition-colors duration-(--dur-small) ease-quiet hover:border-ochre/60 hover:text-ochre print:hidden"
      >
        ← Lo-fi
      </Link>
      {children}
    </>
  );
}
