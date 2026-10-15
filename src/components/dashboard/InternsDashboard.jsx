import React, { useCallback, useEffect, useState } from "react";
import {
  exportInterns,
  getInternDetails,
  getInterns,
} from "../../services/dashboardService.js";

const PAGE_SIZE = 10;

const FILTER_DEFAULTS = {
  search: "",
  domain: "",
  duration: "",
  mode: "",
  status: "",
};

const DOMAIN_OPTIONS = [
  "Frontend Development Intern",
  "Backend Development Intern",
  "Full Stack Development Intern",
  "UI/UX Design Intern",
  "Graphic Design Intern",
  "Digital Marketing Intern",
  "Content Writing Intern",
  "SEO Intern",
  "Data Analysis Intern",
];

const DURATION_OPTIONS = ["1 Month", "3 Months", "6 Months"];
const MODE_OPTIONS = ["Remote", "Hybrid", "On-site"];
const STATUS_OPTIONS = ["sent", "pending", "failed"];

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
}

function getInternId(intern) {
  return (
    intern?.internId ??
    intern?.internID ??
    intern?.applicationId ??
    intern?._id ??
    ""
  );
}

function getInternName(intern) {
  return (
    intern?.name ?? intern?.fullName ?? intern?.internName ?? "Unnamed intern"
  );
}

function getInternEmail(intern) {
  return intern?.email ?? intern?.emailAddress ?? "—";
}

function getOfferStatus(intern) {
  return String(
    intern?.offerStatus ?? intern?.emailStatus ?? intern?.status ?? "pending",
  )
    .trim()
    .toLowerCase();
}

function getStatusLabel(status) {
  const labels = {
    sent: "Sent",
    success: "Sent",
    successful: "Sent",
    accepted: "Accepted by provider",
    delivered: "Delivered",
    pending: "Pending",
    queued: "Pending",
    failed: "Failed",
    error: "Failed",
    draft: "Draft",
    processing: "Processing",
  };

  return labels[status] ?? String(status || "Unknown").replace(/[_-]/g, " ");
}

function getStatusClasses(status) {
  if (
    ["sent", "success", "successful", "accepted", "delivered"].includes(status)
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (["failed", "error"].includes(status)) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (status === "processing") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(status)}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {getStatusLabel(status)}
    </span>
  );
}

function getListFromResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.records)) return response.records;
  if (Array.isArray(response?.interns)) return response.interns;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.records)) return response.data.records;
  if (Array.isArray(response?.data?.interns)) return response.data.interns;

  return [];
}

function getPagination(response, currentPage, pageSize, recordCount) {
  const pagination = response?.pagination ?? response?.meta ?? {};
  const total = Number(
    pagination.total ??
      pagination.totalRecords ??
      response?.total ??
      recordCount,
  );

  return {
    page: Number(pagination.page) || currentPage,
    limit: Number(pagination.limit) || pageSize,
    total,
    totalPages:
      Number(pagination.totalPages) || Math.max(1, Math.ceil(total / pageSize)),
  };
}

function DetailField({ label, value }) {
  const displayValue =
    value === undefined || value === null || value === "" ? "—" : String(value);

  return (
    <div className="min-w-0 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-medium leading-6 text-slate-800">
        {displayValue}
      </dd>
    </div>
  );
}

function SectionHeading({ children, count }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-sm font-semibold text-slate-900">{children}</h3>
      {count !== undefined && (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {count}
        </span>
      )}
    </div>
  );
}

function InternDetailsModal({ internId, onClose }) {
  const [intern, setIntern] = useState(null);
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError("");

      try {
        const response = await getInternDetails(internId);

        if (cancelled) return;

        setIntern(response?.intern ?? response?.data?.intern ?? null);
        setEmailHistory(
          Array.isArray(response?.emailHistory)
            ? response.emailHistory
            : Array.isArray(response?.data?.emailHistory)
              ? response.data.emailHistory
              : [],
        );
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError?.message || "Unable to load intern details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [internId]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const name = getInternName(intern || {});
  const email = getInternEmail(intern || {});
  const status = getOfferStatus(intern || {});

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-white/50 bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intern-detail-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-white px-5 py-5 sm:px-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-700">
              Intern record
            </p>
            <h2
              id="intern-detail-title"
              className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950"
            >
              Intern details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Profile information and email activity.
            </p>
          </div>

          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
            onClick={onClose}
            aria-label="Close intern details"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7">
          {loading ? (
            <div
              className="flex min-h-64 flex-col items-center justify-center text-center"
              role="status"
            >
              <span className="size-9 animate-spin rounded-full border-[3px] border-orange-100 border-t-orange-600" />
              <p className="mt-4 text-sm font-semibold text-slate-800">
                Loading intern details…
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Retrieving profile and email history.
              </p>
            </div>
          ) : error ? (
            <div
              className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800"
              role="alert"
            >
              <p className="font-semibold">Unable to load intern details</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : !intern ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <p className="text-sm font-semibold text-slate-800">
                No intern details were returned.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Close this window and try opening the record again.
              </p>
            </div>
          ) : (
            <div className="space-y-7">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-xl font-bold text-orange-700 ring-1 ring-inset ring-orange-200">
                    {name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-lg font-semibold text-slate-900">
                      {name}
                    </h3>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {email}
                    </p>
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      {getInternId(intern)}
                    </p>
                  </div>

                  <StatusBadge status={status} />
                </div>
              </section>

              <section>
                <SectionHeading>Internship information</SectionHeading>

                <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailField label="Intern ID" value={getInternId(intern)} />
                  <DetailField
                    label="Domain"
                    value={intern.domain ?? intern.appliedDomain}
                  />
                  <DetailField label="Duration" value={intern.duration} />
                  <DetailField
                    label="Internship mode"
                    value={intern.mode ?? intern.internshipMode}
                  />
                  <DetailField
                    label="Created on"
                    value={formatDate(
                      intern.offerCreatedAt ?? intern.createdAt,
                    )}
                  />
                  <DetailField
                    label="Start date"
                    value={formatDate(
                      intern.startDate ?? intern.internshipStartDate,
                    )}
                  />
                  <DetailField
                    label="Issue date"
                    value={formatDate(intern.issueDate)}
                  />
                  <DetailField label="Stipend" value={intern.stipend} />
                  <DetailField
                    label="Last offer email"
                    value={formatDateTime(intern.offerSentAt)}
                  />
                  <DetailField
                    label="Email provider"
                    value={intern.emailProvider}
                  />
                  <DetailField
                    label="Email attempts"
                    value={intern.emailSendCount}
                  />
                  <DetailField
                    label="Provider message ID"
                    value={intern.resendMessageId ?? intern.brevoMessageId}
                  />
                  <DetailField
                    label="Phone"
                    value={intern.phone ?? intern.phoneNumber}
                  />
                  <DetailField
                    label="LinkedIn"
                    value={intern.linkedin ?? intern.linkedinUrl}
                  />
                  <DetailField
                    label="Last email error"
                    value={intern.lastEmailError}
                  />
                </dl>
              </section>

              <section>
                <SectionHeading count={emailHistory.length}>
                  Email history
                </SectionHeading>

                {emailHistory.length === 0 ? (
                  <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      No email events recorded
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Recorded email attempts for this intern will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    {emailHistory.map((event, index) => (
                      <article
                        className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
                        key={
                          event._id ??
                          event.messageId ??
                          `${event.sentAt}-${index}`
                        }
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {getStatusLabel(
                                String(event.status ?? "unknown").toLowerCase(),
                              )}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDateTime(event.sentAt)}
                            </p>
                          </div>

                          <StatusBadge
                            status={String(
                              event.status ?? "unknown",
                            ).toLowerCase()}
                          />
                        </div>

                        <p className="mt-3 break-all text-xs leading-5 text-slate-600">
                          Provider: {event.provider || "—"}
                          {event.messageId
                            ? ` · Message ID: ${event.messageId}`
                            : ""}
                        </p>

                        {event.errorMessage && (
                          <div className="mt-3 rounded-lg border border-rose-100 bg-rose-50 p-3">
                            <p className="text-xs font-semibold text-rose-800">
                              Error details
                            </p>
                            <p className="mt-1 break-words text-xs leading-5 text-rose-700">
                              {event.errorMessage}
                            </p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                <p className="mt-3 rounded-lg bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-800">
                  A “sent” status means the email provider accepted the request;
                  it does not guarantee inbox delivery.
                </p>
              </section>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
          >
            Close details
          </button>
        </div>
      </section>
    </div>
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

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M4 7h16M7 12h10m-7 5h4" />
    </svg>
  );
}

function InternsDashboard() {
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [appliedFilters, setAppliedFilters] = useState(FILTER_DEFAULTS);
  const [page, setPage] = useState(1);
  const [interns, setInterns] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedInternId, setSelectedInternId] = useState("");

  const loadInterns = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await getInterns({
        ...appliedFilters,
        page,
        limit: PAGE_SIZE,
      });

      const records = getListFromResponse(response);
      setInterns(records);
      setPagination(getPagination(response, page, PAGE_SIZE, records.length));
    } catch (requestError) {
      setInterns([]);
      setPagination({
        page,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 1,
      });
      setError(requestError?.message || "Unable to load intern records.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page]);

  useEffect(() => {
    loadInterns();
  }, [loadInterns]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function applyFilters(event) {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({ ...filters });
  }

  function clearFilters() {
    setFilters({ ...FILTER_DEFAULTS });
    setAppliedFilters({ ...FILTER_DEFAULTS });
    setPage(1);
  }

  async function handleExport() {
    if (exporting) return;

    setExporting(true);
    setError("");
    setNotice("");

    let objectUrl = "";

    try {
      const { blob, filename } = await exportInterns(appliedFilters);
      objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename || "veloop-interns.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setNotice("The CSV export has been prepared.");
    } catch (requestError) {
      setError(requestError?.message || "Unable to export intern records.");
    } finally {
      if (objectUrl) {
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
      setExporting(false);
    }
  }

  const firstRecord = pagination.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastRecord = Math.min(page * PAGE_SIZE, pagination.total);
  const totalPages = Math.max(1, pagination.totalPages);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            <span className="size-1.5 rounded-full bg-orange-500" />
            Internship management
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Intern records
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Search applications, review offer status, inspect email history, and
            export records for reporting.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleExport}
          disabled={exporting || loading}
        >
          {exporting ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M12 3v12m-5-5 5 5 5-5" />
              <path d="M5 16v4h14v-4" />
            </svg>
          )}
          {exporting ? "Preparing CSV…" : "Export CSV"}
        </button>
      </header>

      <form
        className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
        onSubmit={applyFilters}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <FilterIcon />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Search and filters
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Apply filters to narrow down the records.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
            onClick={clearFilters}
          >
            Clear all
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="min-w-0 xl:col-span-1">
            <label
              htmlFor="intern-search"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Search interns
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <SearchIcon />
              </span>
              <input
                id="intern-search"
                type="search"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Name, email, or intern ID"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="intern-domain"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Internship domain
            </label>
            <select
              id="intern-domain"
              value={filters.domain}
              onChange={(event) => updateFilter("domain", event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">All domains</option>
              {DOMAIN_OPTIONS.map((domain) => (
                <option value={domain} key={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="intern-duration"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Duration
            </label>
            <select
              id="intern-duration"
              value={filters.duration}
              onChange={(event) => updateFilter("duration", event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">All durations</option>
              {DURATION_OPTIONS.map((duration) => (
                <option value={duration} key={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="intern-mode"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Work mode
            </label>
            <select
              id="intern-mode"
              value={filters.mode}
              onChange={(event) => updateFilter("mode", event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">All modes</option>
              {MODE_OPTIONS.map((mode) => (
                <option value={mode} key={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="intern-status"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Offer status
            </label>
            <select
              id="intern-status"
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option value={status} key={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Changes to filters are applied when you select Apply filters.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SearchIcon />
            Apply filters
          </button>
        </div>
      </form>

      {error && (
        <div
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <div>
            <p className="text-sm font-semibold text-rose-900">
              Something went wrong
            </p>
            <p className="mt-1 break-words text-sm leading-5 text-rose-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 disabled:opacity-50"
            onClick={loadInterns}
            disabled={loading}
          >
            {loading ? "Retrying…" : "Retry"}
          </button>
        </div>
      )}

      {notice && (
        <div
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          role="status"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold">
            ✓
          </span>
          <p className="pt-0.5">{notice}</p>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-4 py-5 sm:flex-row sm:items-center sm:px-5">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              All interns
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading records…"
                : `${formatNumber(pagination.total)} total records`}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {loading
              ? "Loading"
              : `${formatNumber(firstRecord)}–${formatNumber(lastRecord)} of ${formatNumber(pagination.total)}`}
          </div>
        </div>

        {loading && (
          <div
            className="h-1 overflow-hidden bg-orange-50"
            role="status"
            aria-label="Loading intern records"
          >
            <div className="h-full w-1/3 animate-pulse rounded-full bg-orange-500" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                {[
                  "Intern",
                  "Intern ID",
                  "Domain",
                  "Duration",
                  "Created",
                  "Offer status",
                  "Action",
                ].map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14">
                    <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                      <span className="size-5 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
                      Loading intern records…
                    </div>
                  </td>
                </tr>
              ) : interns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14">
                    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <SearchIcon />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-800">
                        No matching intern records
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Try adjusting your filters or clearing them to see more
                        records.
                      </p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                interns.map((intern, index) => {
                  const internId = getInternId(intern);
                  const status = getOfferStatus(intern);
                  const name = getInternName(intern);
                  const initials =
                    name
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase() || "I";

                  return (
                    <tr
                      key={intern._id ?? internId ?? index}
                      className="transition-colors hover:bg-orange-50/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 text-sm font-bold text-orange-700 ring-1 ring-inset ring-orange-200/70">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-56 truncate text-sm font-semibold text-slate-900">
                              {name}
                            </p>
                            <p className="mt-1 max-w-56 truncate text-xs text-slate-500">
                              {getInternEmail(intern)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-700">
                          {internId || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="block max-w-56 text-sm leading-5 text-slate-700">
                          {intern.domain ?? intern.appliedDomain ?? "—"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {intern.duration ?? "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDate(intern.offerCreatedAt ?? intern.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={status} />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="inline-flex min-h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => setSelectedInternId(String(internId))}
                          disabled={!internId}
                        >
                          View details
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-3.5"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-center text-xs text-slate-500 sm:text-left sm:text-sm">
            Page <span className="font-semibold text-slate-800">{page}</span>
            {" of "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true">←</span>
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={loading || page >= totalPages}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      {selectedInternId && (
        <InternDetailsModal
          internId={selectedInternId}
          onClose={() => setSelectedInternId("")}
        />
      )}
    </div>
  );
}

export default InternsDashboard;
