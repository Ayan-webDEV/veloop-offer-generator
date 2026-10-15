import { useMemo, useState } from "react";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 10;

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatusBadge({ status }) {
  const normalized = String(status || "unknown").toLowerCase();

  const styles =
    normalized === "sent" || normalized === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : normalized === "failed" || normalized === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : normalized === "pending"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function EmailHistoryDashboard({
  events = [],
  records,
  loading = false,
  error,
  onRetry,
  className = "",
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const source = Array.isArray(events)
    ? events
    : Array.isArray(records)
      ? records
      : [];

  const providers = useMemo(
    () =>
      [
        ...new Set(source.map((event) => event.provider).filter(Boolean)),
      ].sort(),
    [source],
  );

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return source.filter((event) => {
      const status = String(event.status || "unknown").toLowerCase();

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const matchesProvider =
        providerFilter === "all" || event.provider === providerFilter;

      const searchableText = [
        event.internId,
        event.recipientName,
        event.recipientEmail,
        event.provider,
        event.status,
        event.messageId,
        event.errorMessage,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        matchesProvider &&
        (!query || searchableText.includes(query))
      );
    });
  }, [source, search, statusFilter, providerFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const visibleEvents = filteredEvents.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const counts = useMemo(() => {
    return source.reduce(
      (result, event) => {
        const status = String(event.status || "unknown").toLowerCase();

        result.total += 1;

        if (status === "sent" || status === "success") {
          result.sent += 1;
        } else if (status === "failed" || status === "error") {
          result.failed += 1;
        } else if (status === "pending") {
          result.pending += 1;
        }

        return result;
      },
      { total: 0, sent: 0, failed: 0, pending: 0 },
    );
  }, [source]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("all");
    setProviderFilter("all");
    setPage(1);
  }

  return (
    <div
      className={["mx-auto w-full max-w-[1600px] space-y-6", className]
        .filter(Boolean)
        .join(" ")}
    >
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          <span className="size-1.5 rounded-full bg-orange-500" />
          Email operations
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Email history
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Inspect recorded email attempts, provider responses, and errors.
          Search across recipient details and event identifiers.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-rose-900">
              Could not load email history
            </p>
            <p className="mt-1 text-sm leading-5 text-rose-700">{error}</p>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
            >
              Try again
            </button>
          )}
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: "Total events",
            value: counts.total,
            accent: "text-slate-900",
          },
          {
            label: "Sent",
            value: counts.sent,
            accent: "text-emerald-700",
          },
          {
            label: "Failed",
            value: counts.failed,
            accent: "text-rose-700",
          },
          {
            label: "Pending",
            value: counts.pending,
            accent: "text-amber-700",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
          >
            <p className="text-xs font-medium text-slate-500">{item.label}</p>
            <p
              className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${item.accent}`}
            >
              {item.value.toLocaleString("en-IN")}
            </p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-5 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Recorded events
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredEvents.length.toLocaleString("en-IN")} matching events
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              disabled={
                !search && statusFilter === "all" && providerFilter === "all"
              }
              className="inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear filters
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <label
                htmlFor="email-history-search"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Search events
              </label>

              <span className="pointer-events-none absolute bottom-0 left-3 flex h-11 items-center text-slate-400">
                <SearchIcon />
              </span>

              <input
                id="email-history-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Name, email, intern ID..."
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="email-history-status"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Status
              </label>

              <select
                id="email-history-status"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                <option value="all">All statuses</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="email-history-provider"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Provider
              </label>

              <select
                id="email-history-provider"
                value={providerFilter}
                onChange={(event) => {
                  setProviderFilter(event.target.value);
                  setPage(1);
                }}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                <option value="all">All providers</option>
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div
            role="status"
            aria-label="Loading email events"
            className="h-1 overflow-hidden bg-orange-50"
          >
            <div className="h-full w-1/3 animate-pulse rounded-full bg-orange-500" />
          </div>
        )}

        {visibleEvents.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <SearchIcon />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              {loading ? "Loading email events…" : "No matching events"}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
              {loading
                ? "Please wait while email history is retrieved."
                : "Try a different search term or remove one or more filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  {[
                    "Recipient",
                    "Intern ID",
                    "Provider",
                    "Status",
                    "Timestamp",
                    "Details",
                  ].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleEvents.map((event, index) => {
                  const key =
                    event._id ||
                    event.messageId ||
                    `${event.internId || "event"}-${event.sentAt || index}`;

                  const recipientName =
                    event.recipientName || "Unknown recipient";

                  return (
                    <tr
                      key={key}
                      className="transition-colors hover:bg-orange-50/30"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {recipientName}
                        </p>
                        <p className="mt-1 max-w-64 break-all text-xs text-slate-500">
                          {event.recipientEmail || "No email recorded"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-slate-600">
                          {event.internId || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {event.provider || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={event.status} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        {formatDateTime(event.sentAt)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredEvents.length > 0 && (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            total={filteredEvents.length}
            limit={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </section>

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedEvent(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-event-detail-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5">
              <div>
                <h2
                  id="email-event-detail-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Email event details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Provider response and event metadata
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close event details"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <dl className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              {[
                ["Recipient", selectedEvent.recipientName],
                ["Email address", selectedEvent.recipientEmail],
                ["Intern ID", selectedEvent.internId],
                ["Provider", selectedEvent.provider],
                ["Message ID", selectedEvent.messageId],
                ["Timestamp", formatDateTime(selectedEvent.sentAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                >
                  <dt className="text-xs font-medium text-slate-500">
                    {label}
                  </dt>
                  <dd className="mt-1.5 break-words text-sm text-slate-800">
                    {value || "—"}
                  </dd>
                </div>
              ))}

              <div className="sm:col-span-2">
                <dt className="mb-2 text-xs font-medium text-slate-500">
                  Status
                </dt>
                <dd>
                  <StatusBadge status={selectedEvent.status} />
                </dd>
              </div>

              {selectedEvent.errorMessage && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 sm:col-span-2">
                  <dt className="text-xs font-semibold text-rose-800">
                    Error message
                  </dt>
                  <dd className="mt-2 break-words text-sm leading-6 text-rose-700">
                    {selectedEvent.errorMessage}
                  </dd>
                </div>
              )}
            </dl>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs leading-5 text-slate-500">
                A successful provider request does not independently confirm
                inbox delivery.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default EmailHistoryDashboard;
