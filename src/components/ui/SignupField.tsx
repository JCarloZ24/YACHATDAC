"use client";

import { useId } from "react";

/**
 * Minimal underline-style input with a text-only arrow CTA (build doc §5).
 *
 * ⚠ Not wired up. The newsletter list is an external service and the
 * email/comms system is Phase 2, built from the ImHereTravels reference
 * (build doc §10). Submitting currently does nothing but prevent default —
 * deliberately, so no address is silently collected before there is a privacy
 * policy in place (§11: legal pages must exist before any form goes live).
 */
export function SignupField({
  label,
  placeholder,
  cta,
  note,
  tone = "dark",
}: {
  label: string;
  placeholder: string;
  cta: string;
  note: string;
  /** "dark" for light-on-dark grounds (default); "light" for bone/canvas. */
  tone?: "dark" | "light";
}) {
  const id = useId();
  const ink =
    tone === "light"
      ? {
          label: "text-evergreen",
          rule: "border-charcoal/25",
          input: "text-charcoal placeholder:text-charcoal/40",
          note: "text-charcoal/50",
        }
      : {
          label: "text-canvas/70",
          rule: "border-canvas/30",
          input: "text-canvas placeholder:text-canvas/40",
          note: "text-canvas/50",
        };

  return (
    <form
      className="max-w-md space-y-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor={id} className={`eyebrow block ${ink.label}`}>
        {label}
      </label>

      <div className={`flex items-center gap-4 border-b ${ink.rule} pb-2 focus-within:border-ochre`}>
        <input
          id={id}
          type="email"
          name="email"
          placeholder={placeholder}
          className={`w-full bg-transparent focus:outline-none ${ink.input}`}
        />
        <button
          type="submit"
          className="eyebrow shrink-0 text-ochre transition-transform duration-300 hover:translate-x-1"
        >
          {cta} &rarr;
        </button>
      </div>

      <p className={`text-xs ${ink.note}`}>{note}</p>
    </form>
  );
}
