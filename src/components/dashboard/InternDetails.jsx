const STATUS_STYLES = {
  sent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function StatusBadge({ status }) {
  const normalized = String(status || "unknown").toLowerCase();
  const styles =
    STATUS_STYLES[normalized] || "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
}

function DetailItem({ label, value, mono = false }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd
        className={[
          "mt-1.5 wrap-break text-sm font-medium text-slate-800",
          mono ? "font-mono" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value === null || value === undefined || value === "" ? "—" : value}
      </dd>
    </div>
  );
}

function SectionTitle({ children, count }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-semibold text-slate-900">{children}</h3>
      {count !== undefined && (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {count}
        </span>
      )}
    </div>
  );
}

function InternDetails({
  intern,
  emailHistory = [],
  loading = false,
  onClose,
  error,
  className = "",
}) {
  if (!intern && !loading && !error) {
    return null;
  }

  const history = Array.isArray(emailHistory) ? emailHistory : [];
  const name =
    intern?.name ||
    intern?.fullName ||
    intern?.candidateName ||
    "Unnamed intern";

  const email =
    intern?.email || intern?.emailAddress || intern?.recipientEmail || "";

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "I";

  return (
    <section
      aria-labelledby="intern-details-title"
      className={[
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-linear-to-r from-orange-50/80 via-white to-white px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-base font-bold text-orange-700 ring-1 ring-inset ring-orange-200">
            {initials}
          </div>

          <div className="min-w-0">
            <h2
              id="intern-details-title"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              {loading && !intern ? "Loading intern details…" : name}
            </h2>
            {email && (
              <p className="mt-1 break-all text-sm text-slate-500">{email}</p>
            )}
            {intern?.internId && (
              <p className="mt-1 font-mono text-xs text-orange-700">
                {intern.internId}
              </p>
            )}
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close intern details"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.22 4.22a.75.75 0 0 1 1.06 0L10 8.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L11.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"
          >
            {error}
          </div>
        )}

        {loading && !intern ? (
          <div className="flex items-center gap-3 py-8 text-sm text-slate-500">
            <span className="size-5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
            Retrieving intern information…
          </div>
        ) : intern ? (
          <>
            <div>
              <SectionTitle>Internship information</SectionTitle>

              <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <DetailItem label="Intern ID" value={intern.internId} mono />
                <DetailItem label="Full name" value={name} />
                <DetailItem label="Email address" value={email} />
                <DetailItem
                  label="Internship domain"
                  value={intern.domain || intern.internshipDomain}
                />
                <DetailItem
                  label="Duration"
                  value={
                    intern.duration
                      ? `${intern.duration} ${
                          String(intern.duration) === "1" ? "month" : "months"
                        }`
                      : "—"
                  }
                />
                <DetailItem
                  label="Work mode"
                  value={intern.mode || intern.workMode}
                />
                <DetailItem label="Stipend" value={intern.stipend} />
                <DetailItem
                  label="Created at"
                  value={formatDateTime(intern.createdAt)}
                />
                <DetailItem
                  label="Start date"
                  value={formatDateTime(intern.startDate)}
                />
              </dl>
            </div>

            <div>
              <SectionTitle count={history.length}>Email history</SectionTitle>

              {history.length === 0 ? (
                <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-8 text-center">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
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
                  <p className="mt-3 text-sm font-medium text-slate-800">
                    No email events recorded
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Email activity for this intern will appear here when
                    available.
                  </p>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {history.map((event, index) => {
                    const eventId =
                      event._id ||
                      event.messageId ||
                      `${event.internId || "event"}-${event.sentAt || index}`;

                    return (
                      <article
                        key={eventId}
                        className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-all text-sm font-semibold text-slate-900">
                              {event.recipientEmail ||
                                email ||
                                "Unknown recipient"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDateTime(event.sentAt)}
                            </p>
                          </div>

                          <StatusBadge status={event.status} />
                        </div>

                        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <dt className="text-xs font-medium text-slate-500">
                              Provider
                            </dt>
                            <dd className="mt-1 text-sm text-slate-700">
                              {event.provider || "—"}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-xs font-medium text-slate-500">
                              Message ID
                            </dt>
                            <dd className="mt-1 break-all font-mono text-xs text-slate-600">
                              {event.messageId || "—"}
                            </dd>
                          </div>
                        </dl>

                        {event.errorMessage && (
                          <div className="mt-4 rounded-lg border border-rose-100 bg-rose-50 p-3">
                            <p className="text-xs font-semibold text-rose-800">
                              Error details
                            </p>
                            <p className="mt-1 wrap-break text-xs leading-5 text-rose-700">
                              {event.errorMessage}
                            </p>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}

              <p className="mt-3 text-xs leading-5 text-slate-500">
                A “sent” event indicates that the email provider accepted the
                request; it does not independently confirm inbox delivery.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default InternDetails;
