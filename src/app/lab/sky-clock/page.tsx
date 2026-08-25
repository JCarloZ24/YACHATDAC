import type { Metadata } from "next";
import { LabHeader, LabNote } from "@/components/lab/LabChrome";
import { SkyClockLab } from "@/components/lab/SkyClockLab";

export const metadata: Metadata = { title: "A2 — Sky clock" };

export default function SkyClockPage() {
  return (
    <>
      <LabHeader
        sketch="A2"
        title="Sky clock"
        standfirst="Marc's homepage mockup, built for real. Time of day and narrative beat advance on the same clock: a fixed atmosphere behind the page whose sky, sun and stars are driven by where the visitor is in the story."
        status="Signature moment · one of the two the homepage is budgeted"
      />

      <SkyClockLab />

      <div className="mx-auto max-w-4xl space-y-6 px-6 py-24 lg:px-16">
        <LabNote title="Two things from the mockup I did not build" tone="flag">
          <p>
            <strong>The Truth &ldquo;story wall&rdquo; graphic.</strong> The
            mockup draws it in SVG — a bordered panel of ruled lines with two
            circles and a zigzag. That is generated iconography standing in for
            rock engravings, and it runs into two separate rules: no generated
            Aboriginal iconography in code, and story-wall imagery is
            unresolved in permissions.md and treated as unavailable. The beat is
            typographic instead, which is also exactly what the copy file asks
            for: <em>&ldquo;No imagery. Typographic beat until story-wall
            permission is resolved. Carry it on the words and the ground colour
            alone.&rdquo;</em>
          </p>
          <p>
            <strong>The &ldquo;Marra Wonga&rdquo; tag.</strong> The mockup lists
            it among the Truth tags. That is a named heritage site, and site
            names do not go in markup. Dropped rather than renamed, because a
            plausible substitute is worse than an absence.
          </p>
          <p>
            Neither is a criticism of a quick mockup — both are exactly the kind
            of thing that gets through in an hour and is very hard to remove
            later, once it is in a deck and everyone has seen it.
          </p>
        </LabNote>

        <LabNote title="The decision this page is for">
          <p>
            <strong>Scrubbed or phased.</strong> The mockup snaps to a phase per
            beat and eases there on a timer. Scrubbed instead ties the sky to
            scroll position continuously, so the visitor sets the pace — which
            is the &ldquo;human&rdquo; attribute, and what the sketch library
            specifies for A2. It also has no duration to argue about. Phased has
            a real advantage though: each beat has one settled look, so the
            colour behind the copy is a known quantity rather than a moving one.
          </p>
          <p>
            Switch between them at the top and scroll the same stretch twice.
          </p>
        </LabNote>

        <LabNote title="Framing">
          <p>
            Each beat is a full viewport with the real page&rsquo;s symmetric
            padding — nothing is reserved for prototype chrome, so the
            composition you are judging is the composition the homepage gets.
            The atmosphere behind it is fixed to the viewport, which is the
            whole trick: the sky belongs to the screen and the copy scrolls
            through it.
          </p>
        </LabNote>

        <LabNote title="Measured in the full frame: the sun crosses the copy" tone="flag">
          <p>
            Sampling the composited background behind each headline at
            1440&times;900, off-white copy measures <strong>2.45:1</strong> over
            the sun on Truth, <strong>3.23:1</strong> on Belonging and{" "}
            <strong>4.03:1</strong> on Living work. The floor is 4.5:1. Only
            Wonder clears it, at 5.17:1.
          </p>
          <p>
            This is not something the full-viewport framing introduced — at the
            old framing the same three measured 2.59, 7.96 and 2.28, so it moved
            the failure around rather than causing it. The sky layers are fine
            and always were: every one of them carries off-white at 10:1 or
            better. It is the sun disc that copy crosses, and at{" "}
            <code className="text-ochre">sunScale</code> 0.9–1.4 the disc is
            wider than the column the headline sits in.
          </p>
          <p>
            Three ways out, all design calls rather than lab ones: move the sun
            off the copy column per beat, shrink the disc, or accept that the
            copy has to sit clear of it and compose each beat that way. Worth
            settling before A2 is judged on look, because the fix changes the
            look.
          </p>
        </LabNote>

        <LabNote title="Truth holds still">
          <p>
            The atmosphere stops entirely across the Truth beat and starts again
            on the way out. That is not a performance saving — it is the sketch
            library&rsquo;s note that Truth is the one section where time stops,
            and the standing rule that truth-telling sections move less than the
            rest of the site rather than more. Watch the sun through that beat
            in scrubbed mode: it does not drift.
          </p>
        </LabNote>

        <LabNote title="What changed under the hood">
          <p>
            The mockup transitions <code className="text-ochre">top</code>,{" "}
            <code className="text-ochre">width</code>,{" "}
            <code className="text-ochre">height</code>,{" "}
            <code className="text-ochre">margin-left</code> and{" "}
            <code className="text-ochre">box-shadow</code> on the sun, plus{" "}
            <code className="text-ochre">background-color</code> on a
            full-screen layer. That lays out and repaints the entire viewport on
            every frame of a 1.6s transition.
          </p>
          <p>
            Rebuilt as transform and opacity only: the sky is a stack of opaque
            colour layers that cross-fade, the sun is one transformed element
            carrying a stack of cross-fading discs with its glow baked into each
            gradient, and stars are opacity alone. One scalar drives all of it,
            so both clocks are the same code path.
          </p>
        </LabNote>

        <LabNote title="Copy and colour">
          <p>
            Copy comes from <code className="text-ochre">src/content/homepage.ts</code>,
            which tracks the approved draft, not from the mockup — the mockup
            predates the v2 sync, so its Belonging headline is the old wording
            and its Truth beat carries framing that v2 withdrew.
          </p>
          <p>
            Sky colours are each beat&rsquo;s own declared{" "}
            <code className="text-ochre">tone</code> from that same file rather
            than the mockup&rsquo;s tints, which sit outside the brand palette.
            That is also what keeps contrast legal: off-white on burnt ochre
            measures 3.4:1 and fails, which is why Wonder is midnight.
          </p>
        </LabNote>

        <LabNote title="Still open">
          <p>
            This is a signature moment, and the homepage is budgeted two. If the
            sky clock ships, there is one left for the whole rest of the page.
          </p>
          <p>
            The mockup&rsquo;s fonts (Fraunces, Space Grotesk) are not the brand
            faces. This uses the project&rsquo;s own type tokens.
          </p>
        </LabNote>
      </div>
    </>
  );
}
