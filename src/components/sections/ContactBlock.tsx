import Link from "next/link";
import { Band, BandHeading } from "@/components/layout/Band";
import { EditorialNote } from "@/components/ui/EditorialNote";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import {
  contactDetails,
  contactNote,
  contactRoutes,
} from "@/content/contact";
import { org } from "@/content/site";
import { toneInk, type Tone } from "@/lib/tone";

/**
 * The shared "Get in touch" band. About, Our People and Connect all end on it,
 * because all three drafts do.
 *
 * Pending details render as struck-through-in-spirit muted text with an
 * explicit "to be confirmed" label rather than as links. See the warning at
 * the top of src/content/contact.ts — the email address in the draft looks
 * real and is not, so nothing here becomes a mailto: until someone clears the
 * `pending` flag.
 */
export function ContactBlock({
  id = "contact",
  tone = "charcoal",
}: {
  id?: string;
  tone?: Tone;
}) {
  const ink = toneInk[tone];

  return (
    <Band id={id} tone={tone}>
      <BandHeading eyebrow="Get in touch" title={org.name} tone={tone} />

      <div className="mt-14 grid gap-14 lg:grid-cols-2">
        <Reveal>
          <dl className="space-y-6">
            {contactDetails.map((detail) => (
              <div
                key={detail.label}
                className={`border-t pt-4 ${ink.border}`}
              >
                <dt className={`eyebrow ${ink.accent}`}>{detail.label}</dt>
                <dd
                  className={`mt-2 text-sm leading-relaxed ${
                    detail.pending ? ink.muted : ink.body
                  }`}
                >
                  {detail.value}
                  {detail.pending ? (
                    <span className={`ml-2 text-xs italic ${ink.muted}`}>
                      — to be confirmed
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="space-y-8">
          <Reveal index={1}>
            <div>
              <h3 className={`headline text-2xl ${ink.heading}`}>
                {contactRoutes.title}
              </h3>
              <p className={`mt-3 max-w-md text-sm leading-relaxed ${ink.body}`}>
                {contactRoutes.lede}
              </p>
            </div>
          </Reveal>

          <ul className="space-y-3">
            {contactRoutes.routes.map((route, index) => (
              <li key={route.title}>
                <Reveal index={2 + index}>
                  <Link
                    href={route.href}
                    className={`group block rounded-sm border p-5 transition-colors duration-(--dur-small) ease-quiet ${ink.border} hover:border-ochre`}
                  >
                    <Eyebrow className={ink.accent}>{route.title}</Eyebrow>
                    <p className={`mt-2 text-sm ${ink.body}`}>
                      {route.description}
                    </p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 max-w-2xl">
        <EditorialNote>
          <p>{contactNote}</p>
        </EditorialNote>
      </div>
    </Band>
  );
}
