import { useMemo } from "react";

const ALLOWED_WHATSAPP_HOSTS = new Set([
  "wa.me",
  "api.whatsapp.com",
  "chat.whatsapp.com",
]);

function getSafeWhatsAppUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const url = new URL(value.trim());

    if (
      url.protocol !== "https:" ||
      !ALLOWED_WHATSAPP_HOSTS.has(url.hostname.toLowerCase()) ||
      url.username ||
      url.password
    ) {
      return "";
    }

    return url.toString();
  } catch {
    return "";
  }
}

function EmailBodyPreview({ name = "", whatsappLink = "" }) {
  const safeName = useMemo(() => {
    const trimmedName = typeof name === "string" ? name.trim() : "";
    return trimmedName || "Candidate Name";
  }, [name]);

  const safeWhatsAppUrl = useMemo(
    () => getSafeWhatsAppUrl(whatsappLink),
    [whatsappLink],
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-5"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              Email body preview
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Candidate-facing message
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Preview
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-700">
              VELoop Rewards
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Internship communication
            </p>
          </div>

          <div className="space-y-5 px-5 py-6 text-sm leading-7 text-slate-600 sm:px-8 sm:py-8">
            <p className="font-medium text-slate-800">Dear {safeName},</p>

            <p>
              Congratulations! We are pleased to share your internship offer
              from{" "}
              <strong className="font-semibold text-slate-900">
                VELoop Rewards
              </strong>
              . Your offer letter is attached to this email. Please review the
              document carefully for the details of your internship.
            </p>

            <p>
              Please keep your offer letter for your records. If you have any
              questions or need assistance with the onboarding process, use the
              official communication channel provided below.
            </p>

            {safeWhatsAppUrl ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
                <p className="font-semibold text-slate-900">Need assistance?</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Contact the team through the WhatsApp link below.
                </p>

                <a
                  href={safeWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.1A8.5 8.5 0 1 1 20 11.5Z" />
                    <path d="M8.5 8.5c.3-.7.6-.7.9-.7h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .7.5.8 1.2 1.5 2 2 .3.2.5.2.7 0l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .3-.1 1-.6 1.4-.5.5-1.2.7-1.8.6-1-.2-2.1-.7-3.3-1.7-1.1-1-1.9-2.1-2.3-3.1-.4-.9-.4-1.7-.2-2.3Z" />
                  </svg>
                  Contact on WhatsApp
                </a>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">
                  WhatsApp contact link
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Enter a valid HTTPS WhatsApp link in the form to display the
                  contact button in this preview.
                </p>
              </div>
            )}

            <p>
              We wish you success in your internship and look forward to your
              contributions.
            </p>

            <div className="border-t border-slate-100 pt-5">
              <p className="font-medium text-slate-800">Best regards,</p>
              <p className="mt-1 font-semibold text-slate-900">Ayan Alam</p>
              <p className="text-slate-500">Chief Executive Officer</p>
              <p className="font-medium text-orange-700">VELoop Rewards</p>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-8">
            <p className="text-center text-xs leading-5 text-slate-500">
              Official internship communication · Please keep this email for
              your records.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmailBodyPreview;
