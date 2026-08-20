import type { Metadata } from "next";
import { LabHeader, LabNote } from "@/components/lab/LabChrome";
import { ContourMapLab } from "@/components/lab/ContourMapLab";

export const metadata: Metadata = { title: "D4 — Contour map" };

export default function ContourMapPage() {
  return (
    <>
      <LabHeader
        sketch="D4"
        title="Contour map with waypoints"
        standfirst="The same landform as E1, drawn as vector contours that reveal themselves on scroll, with waypoints lighting in sequence. No WebGL, no shoot, no dependency to argue about — and it scales to any screen because it is vector."
        status="On hold · approved in principle for About and Research, land-detail level unconfirmed"
      />

      <ContourMapLab />

      <div className="mx-auto max-w-4xl space-y-6 px-6 py-24 lg:px-16">
        <LabNote title="What you are looking at" tone="flag">
          <p>
            Same synthetic landform as E1, contoured with marching squares
            instead of GDAL. The path data is in an arbitrary 1000&times;640
            viewBox: not degrees, not metres, and not convertible to either.
            Waypoints are positioned as percentages of that viewBox.
          </p>
          <p>
            Waypoint names are placeholders, and stay placeholders. permissions.md
            blocks place names until the land-detail question is answered, and
            inventing plausible-looking ones is exactly how a placeholder survives
            into a build.
          </p>
        </LabNote>

        <LabNote title="One thing to look at deliberately" tone="flag">
          <p>
            Nested closed curves can read as iconography even when they are honest
            cartography. The field is built without any radial falloff for that
            reason — a dome-shaped landform produces neat concentric rings, an
            irregular one clipped by the frame reads as a crop of a landscape.
          </p>
          <p>
            That is a mitigation, not a clearance. This should get a look from
            Marc, and from whoever ends up owning motion sign-off, before it goes
            on a page.
          </p>
        </LabNote>

        <LabNote title="The decision this page is for">
          <p>
            The detail control is the same one as on E1 and means the same thing,
            so an answer can be given once and applied to both. Generalised is
            roughly a 40m contour interval; Survey is roughly 10m and reads as a
            survey drawing.
          </p>
        </LabNote>

        <LabNote title="Constraints it already meets">
          <p>
            Contours draw by <code className="text-ochre">stroke-dashoffset</code>{" "}
            with <code className="text-ochre">pathLength=&quot;1&quot;</code>, so
            every contour is normalised and the stagger is about level order
            rather than how long each squiggle happens to be. That is the
            sanctioned stroke-reveal technique for B1 and D4; nothing per-frame
            touches width, height, top, left or filter.
          </p>
          <p>
            Waypoints are real buttons — focusable, readable, reachable by
            keyboard whether or not scroll has lit them, and visible immediately
            under reduced motion. Nothing is pinned, so there is no keyboard trap
            and nothing to unwind.
          </p>
        </LabNote>

        <LabNote title="Build order">
          <p>
            Build D4 before E1. It is half a day, it needs no dependency, and it
            will tell us whether showing the land reads the way the team hopes —
            before anyone spends two days on the WebGL version.
          </p>
        </LabNote>
      </div>
    </>
  );
}
