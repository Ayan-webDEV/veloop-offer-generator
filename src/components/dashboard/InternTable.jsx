const STATUS_STYLES = {
  sent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatus(record) {
  return String(
    record?.emailStatus ??
      record?.status ??
      record?.emailSendStatus ??
      "pending",
  ).toLowerCase();
}

function StatusBadge({ status }) {
  const styles =
    STATUS_STYLES[status] || "border-slate-200 bg-slate-50 text-slate-600";

  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

function TableIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      {name === "eye" && (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}

      {name === "chevron" && <path d="m9 18 6-6-6-6" />}

      {name === "mail" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      )}
    </svg>
  );
}

function InternTable({
  records = [],
  interns,
  loading = false,
  onView,
  onSelect,
  onViewDetails,
  className = "",
}) {
  const rows = Array.isArray(records)
    ? records
    : Array.isArray(interns)
      ? interns
      : [];

  const viewHandler = onView || onSelect || onViewDetails;

  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Intern records
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Review offer details and email status.
          </p>
        </div>

        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          {rows.length.toLocaleString()}{" "}
          {rows.length === 1 ? "record" : "records"}
        </span>
      </div>

      {loading && (
        <div className="h-1 overflow-hidden bg-orange-50">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-orange-500" />
        </div>
      )}

      {rows.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <TableIcon name="mail" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            {loading ? "Loading records…" : "No intern records found"}
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            {loading
              ? "Please wait while the records are retrieved."
              : "Try adjusting your filters or search terms to find matching records."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th
                  scope="col"
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Intern
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Intern ID
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Domain
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Email status
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.map((record, index) => {
                const id =
                  record.internId ||
                  record.id ||
                  record._id ||
                  `intern-${index}`;

                const name =
                  record.name ||
                  record.fullName ||
                  record.candidateName ||
                  "Unnamed intern";

                const email =
                  record.email ||
                  record.emailAddress ||
                  record.recipientEmail ||
                  "";

                const duration = record.duration
                  ? `${record.duration} ${String(record.duration) === "1" ? "month" : "months"}`
                  : "—";

                const status = getStatus(record);

                return (
                  <tr
                    key={id}
                    className="group transition-colors hover:bg-orange-50/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 text-sm font-bold text-orange-700 ring-1 ring-inset ring-orange-200/70">
                          {name
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase() || "I"}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-56 truncate text-sm font-semibold text-slate-900">
                            {name}
                          </p>
                          <p className="mt-0.5 max-w-56 truncate text-xs text-slate-500">
                            {email || "No email recorded"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-700">
                        {record.internId || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="block max-w-48 truncate text-sm text-slate-700">
                        {record.domain || record.internshipDomain || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {duration}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {formatDate(
                        record.createdAt ||
                          record.createdOn ||
                          record.issueDate,
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={!viewHandler}
                        onClick={() => viewHandler?.(record)}
                        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`View details for ${name}`}
                      >
                        <TableIcon name="eye" />
                        <span>View</span>
                        <TableIcon name="chevron" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default InternTable;
