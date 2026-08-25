import type { Metadata } from "next";
import { Band, BandHeading } from "@/components/layout/Band";
import { PageHero } from "@/components/layout/PageHero";
import { RecordBrowser } from "@/components/resources/RecordBrowser";
import { CtaLink } from "@/components/ui/CtaLink";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SignupField } from "@/components/ui/SignupField";
import {
  browserCopy,
  documents,
  knowledgeGaps,
  onRequest,
  recordGrows,
  recordHero,
  recordItems,
  recordSources,
  recordTypes,
} from "@/content/resources";

export const metadata: Metadata = {
  title: "The Record",
  description: recordHero.standfirst,
};

/**
 * Resources — "The Record".
 *
 * Route and nav label stay `Resources` per D1; the page titles itself "The
 * Record", which is what every v3 page calls it when it links here.
 *
 * Incoming links arrive with filters already set — `/resources?type=story`
 * from the site nav, `/resources?tag=lore` from Wonder — so the query is read
 * here and handed to the browser as its initial state.
 */

/**
 * Query values arrive lowercase from the nav (`?type=story`) while the filter
 * vocabulary is title-case ("Story"). Matched case-insensitively rather than
 * by lowering the vocabulary, so the select still shows the label the draft
 * wrote. Anything unrecognised falls through to no filter — a bad query string
 * should show the whole record, not an empty page.
 */
function match(value: string | undefined, options: readonly string[]): string {
  if (!value) return "";
  return options.find((o) => o.toLowerCase() === value.toLowerCase()) ?? "";
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return (
    <>
      <PageHero
        eyebrow={recordHero.eyebrow}
        title={recordHero.title}
        standfirst={recordHero.standfirst}
        tone="charcoal"
      />

      <Band id="research-and-discovery" tone="canvas">
        <BandHeading title={browserCopy.title} tone="canvas" />

        <div className="mt-10">
          <RecordBrowser
            items={recordItems}
            initialType={match(first("type"), recordTypes)}
            initialSource={match(first("source"), recordSources)}
            initialTag={first("tag") ?? ""}
          />
        </div>

        <div className="mt-14 max-w-2xl">
          <EditorialNote label="Not built — the articles do not exist yet">
            <p>
              The record&rsquo;s index is real; none of the articles behind it
              have been written. Each link resolves to a marked placeholder
              carrying that item&rsquo;s own title and summary rather than a
              404.
            </p>
            <p>
              Sort offers record order and A–Z. The draft also asks for newest
              and oldest first, which needs a published date the items do not
              carry — see the note in RecordBrowser.
            </p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="evergreen">
        <BandHeading
          title={knowledgeGaps.title}
          lede={knowledgeGaps.lede}
          tone="evergreen"
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {knowledgeGaps.gaps.map((gap, index) => (
            <Reveal key={gap.question} index={index}>
              <div className="border-t border-canvas/20 pt-5">
                <h3 className="headline text-xl text-canvas">{gap.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-canvas/75">
                  {gap.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal index={4}>
          <div className="mt-12">
            <CtaLink href={knowledgeGaps.cta.href} tone="evergreen">
              {knowledgeGaps.cta.label}
            </CtaLink>
          </div>
        </Reveal>
      </Band>

      {/* #documents — the Wonder nav's "Downloads" child points here. */}
      <Band id="documents" tone="canvas">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <BandHeading title="Documents and reports" tone="canvas" />
          <p className="text-sm text-evergreen/60">{documents.length} items</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((document, index) => (
            <Reveal key={document.title} index={index}>
              <article className="h-full border-t border-evergreen/20 pt-5">
                <h3 className="headline text-lg text-evergreen">
                  {document.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-evergreen/75">
                  {document.summary}
                </p>
                <p className="mt-4 text-xs text-evergreen/55">
                  {document.meta}
                </p>
                <Eyebrow
                  className={`mt-3 ${
                    document.state === "available"
                      ? "text-oxide"
                      : "text-evergreen/45"
                  }`}
                >
                  {document.state === "available"
                    ? "Published"
                    : "In preparation"}
                </Eyebrow>
              </article>
            </Reveal>
          ))}
        </div>

        {/*
          Four of these are marked published and there is no PDF in the repo
          for any of them. Titles render without download links until an asset
          exists — the same rule the Wonder brochure follows.
        */}
        <div className="mt-14 max-w-2xl">
          <EditorialNote label="No assets — download links cannot be built yet">
            <p>
              Four documents are marked published in the draft — the Ten Year
              Strategic Plan, Governance, the research bibliography and the
              financial statements. None of the files are in the repo, so none
              of them render as a download.
            </p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="roasted">
        <BandHeading title={onRequest.title} tone="roasted" />

        <div className="mt-8 max-w-2xl space-y-5">
          {onRequest.body.map((paragraph, index) => (
            <Reveal key={paragraph} index={index}>
              <p className="text-base leading-relaxed text-canvas/75">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 max-w-2xl">
          <EditorialNote>
            <p>{onRequest.pending}</p>
          </EditorialNote>
        </div>
      </Band>

      <Band tone="charcoal">
        <BandHeading
          eyebrow={recordGrows.eyebrow}
          title={recordGrows.title}
          lede={recordGrows.body}
          tone="charcoal"
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-2">
          <Reveal>
            <SignupField {...recordGrows.signup} />
          </Reveal>

          <Reveal index={1}>
            <div>
              <h3 className="headline text-2xl text-canvas">
                {recordGrows.contribute.title}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-canvas/75">
                {recordGrows.contribute.body}
              </p>
              <ul className="mt-6 space-y-2">
                {recordGrows.contribute.items.map((item) => (
                  <li
                    key={item}
                    className="border-l border-ochre/40 pl-4 text-sm leading-relaxed text-canvas/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CtaLink
                  href={recordGrows.contribute.cta.href}
                  tone="charcoal"
                >
                  {recordGrows.contribute.cta.label}
                </CtaLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Band>
    </>
  );
}
