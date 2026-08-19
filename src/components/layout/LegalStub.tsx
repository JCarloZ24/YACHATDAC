/**
 * Placeholder for a legal document.
 *
 * Build documentation §11: Privacy Policy, Terms of Use and a cookie/consent
 * notice must all exist before any form goes live, and should be legally
 * reviewed rather than only drafted internally. The routes exist now so the
 * footer links resolve; the content is not ours to invent.
 */
export function LegalStub({ title, note }: { title: string; note: string }) {
  return (
    <div className="bg-canvas">
      <div className="mx-auto max-w-3xl px-6 pt-36 pb-28 lg:px-16">
        <p className="eyebrow text-oxide">Legal</p>
        <h1 className="headline mt-5 text-4xl text-evergreen sm:text-5xl">
          {title}
        </h1>
        <div className="mt-10 rounded-sm border border-oxide/30 bg-oxide/5 p-5">
          <p className="eyebrow text-oxide">Awaiting content</p>
          <p className="mt-2 text-sm leading-relaxed text-evergreen/80">
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}
