"use client";

import { useId } from "react";
import { recordGrows } from "@/content/the-record";

/**
 * 06 · the signup, to the hi-fi's own shape: a labelled box field with the
 * blob button beside it, rather than the lo-fi's underline + arrow.
 *
 * ⚠ Not wired up, exactly as SignupField is not. The newsletter list is an
 * external service and the comms system is Phase 2; submitting prevents
 * default and nothing else, deliberately, so no address is collected before
 * there is a privacy policy to collect it under (build doc §11).
 */
export function RecordSignup() {
  const id = useId();
  const { signup } = recordGrows;

  /* The frame sets the last sentence of the note apart, small and under the
     field. Derived from the one content string rather than retyped, so the
     copy still has exactly one home (src/content/the-record.ts). */
  const sentences = signup.note.match(/[^.]+\./g) ?? [signup.note];
  const privacy = sentences.at(-1)?.trim() ?? "";
  const blurb = sentences.slice(0, -1).join(" ").trim();

  return (
    <form
      className="max-w-xl"
      onSubmit={(event) => event.preventDefault()}
      data-record-arrive
    >
      <p className="text-2xl leading-snug font-semibold text-canvas">
        {signup.label}
      </p>
      <p className="mt-3 text-base leading-relaxed text-canvas/70">
        {blurb}
      </p>

      <label htmlFor={id} className="eyebrow mt-8 block text-[0.6875rem] text-canvas/55">
        Email
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <input
          id={id}
          type="email"
          name="email"
          placeholder={signup.placeholder}
          className="h-13 w-full max-w-105 rounded border border-canvas/28 bg-canvas/6 px-4 text-canvas placeholder:text-canvas/40 focus:border-ochre focus:outline-none"
        />
        {/* The blob, as a submit control rather than a link — same shape, same
            tone as BlobButton; a <button> cannot be a <Link>. */}
        <button
          type="submit"
          className="relative inline-flex h-14 w-[17.25rem] max-w-full items-center justify-center px-6 transition-transform duration-(--dur-small) ease-quiet hover:-translate-y-0.5"
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-burnt"
            style={{
              maskImage: "url(/artwork/blob-button.svg)",
              WebkitMaskImage: "url(/artwork/blob-button.svg)",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
          <span className="eyebrow relative text-xs text-canvas">
            {signup.cta}
          </span>
        </button>
      </div>

      <p className="mt-6 text-sm text-canvas/55">{privacy}</p>
    </form>
  );
}
