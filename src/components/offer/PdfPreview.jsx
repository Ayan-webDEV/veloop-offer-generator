import React from "react";

function DocumentIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 3.75h7l4.25 4.5v12A.75.75 0 0 1 17.5 21h-10a.75.75 0 0 1-.75-.75V4.5A.75.75 0 0 1 7.5 3.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 4v5h4M9 13h6M9 16h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 3.75v11m0 0 4-4m-4 4-4-4M4.75 16v3.25c0 .55.45 1 1 1h12.5c.55 0 1-.45 1-1V16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PdfPreview({
  pdfUrl,
  filename = "Offer-Letter.pdf",
  isGenerated = false,
  onDownload,
}) {
  const hasPdf = Boolean(pdfUrl && isGenerated);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border border-line bg-canvas p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600">
            <DocumentIcon className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">
              {hasPdf ? filename : "Offer letter PDF"}
            </p>

            <p className="mt-1 text-xs text-ink-500">
              {hasPdf
                ? "PDF document · Ready for review"
                : "Your generated document will appear here"}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${
            hasPdf
              ? "bg-emerald-50 text-emerald-700"
              : "bg-white text-ink-500 ring-1 ring-line"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              hasPdf ? "bg-emerald-500" : "bg-ink-400"
            }`}
          />
          {hasPdf ? "Generated" : "Awaiting PDF"}
        </span>
      </div>

      <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-line bg-slate-100 sm:min-h-[520px] lg:min-h-[660px]">
        {hasPdf ? (
          <iframe
            key={pdfUrl}
            title="VELoop Rewards offer letter PDF preview"
            src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            className="absolute inset-0 h-full min-h-[360px] w-full border-0 bg-white sm:min-h-[520px] lg:min-h-[660px]"
          />
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[520px] lg:min-h-[660px]">
            <div className="relative mb-6">
              <div className="absolute inset-0 scale-125 rounded-3xl bg-brand-100/60 blur-xl" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white bg-white text-brand-600 shadow-card">
                <DocumentIcon className="h-10 w-10" />
              </div>

              <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-100 bg-brand-600 text-xs font-black text-white">
                PDF
              </span>
            </div>

            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-600">
              Live document preview
            </p>

            <h3 className="mt-3 text-lg font-extrabold tracking-tight text-ink-950">
              Your offer letter starts here
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-ink-500">
              Complete the required offer details and select Generate Offer
              Letter to review the finished document.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-lg border border-line bg-white px-3 py-2 text-[10px] font-bold text-ink-700">
                A4 document
              </span>
              <span className="rounded-lg border border-line bg-white px-3 py-2 text-[10px] font-bold text-ink-700">
                PDF format
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
            i
          </span>

          <p className="text-xs leading-5 text-ink-500">
            Review the recipient name, intern ID, position, and dates before
            sending. The original PDF template remains separate from the
            application styling.
          </p>
        </div>

        <button
          type="button"
          onClick={onDownload}
          disabled={!hasPdf}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink-800 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <DownloadIcon />
          Download PDF
        </button>
      </div>
    </div>
  );
}
