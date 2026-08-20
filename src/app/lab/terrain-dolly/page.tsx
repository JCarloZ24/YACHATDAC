import type { Metadata } from "next";
import { LabHeader, LabNote } from "@/components/lab/LabChrome";
import { TerrainDollyLab } from "@/components/lab/TerrainDollyLab";

export const metadata: Metadata = { title: "E1 — Terrain dolly" };

export default function TerrainDollyPage() {
  return (
    <>
      <LabHeader
        sketch="E1"
        title="Terrain dolly"
        standfirst="Elevation as a wireframe mesh with the camera flown low across it. The mesh never animates — only the camera moves, which is both cheaper and the honest version: the land is not performing, you are moving across it."
        status="On hold · approved in principle for About and Research, land-detail level unconfirmed"
      />

      <TerrainDollyLab />

      <div className="mx-auto max-w-4xl space-y-6 px-6 py-24 lg:px-16">
        <LabNote title="What you are looking at" tone="flag">
          <p>
            This is not Turraburra. The landform is generated from seeded noise,
            so there is no georeference to strip — a stronger guarantee than
            shipping a DEM and trusting a converter to clean it. Swapping in real
            elevation data is one function in{" "}
            <code className="text-ochre">src/lib/terrain/generic-field.ts</code>,
            once the detail question comes back.
          </p>
        </LabNote>

        <LabNote title="The decision this page is for">
          <p>
            Marc&rsquo;s open question was whether to show the land and how
            detailed to make it. The detail control moves exactly that. Watch
            what changes between Generalised and Survey: at Survey you can read
            drainage lines, and the drawing starts to be about a specific place
            rather than about country in general. That is the point where the
            question stops being aesthetic.
          </p>
          <p>
            Each preset also names the GDAL settings that would produce the
            equivalent from real elevation data, so the answer transfers directly
            to the build.
          </p>
        </LabNote>

        <LabNote title="Why wireframe">
          <p>
            Wireframe reads as survey data, which is what it is. A textured
            photoreal version reads as a video game and invites the
            Game-of-Thrones comparison the team already rejected in the briefing.
            Vertex colour runs eucalyptus on low ground to ochre on the ridges.
          </p>
        </LabNote>

        <LabNote title="Constraints it already meets">
          <p>
            Three.js is lazy-imported, so nothing 3D blocks first paint. Device
            pixel ratio is capped at 1.5. The render loop is paused by an
            IntersectionObserver whenever the section is off-screen, and geometry,
            material and renderer are all disposed on teardown along with the
            ScrollTrigger.
          </p>
          <p>
            Under reduced motion the scene is never built at all — turn the
            setting on and reload to see the fallback. The same fallback covers no
            WebGL, Save-Data and a lost context. It needs a real composed poster
            frame before this goes near the site; the panel you see is a
            stand-in that says so rather than a grey box that reads as broken.
          </p>
        </LabNote>

        <LabNote title="Still open">
          <p>
            This is the single WebGL section the site is budgeted for. If E1
            ships, T6 and E3 do not. Worth settling before either gets scoped.
          </p>
        </LabNote>
      </div>
    </>
  );
}
