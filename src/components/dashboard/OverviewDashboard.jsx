import { useMemo } from "react";
import StatsCards from "./StatsCards";
import MonthlyEmailChart from "./MonthlyEmailChart";

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
  }).format(date);
}

function ActivityIcon({ type }) {
  const iconClass = "size-4";

  if (type === "failed") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={iconClass}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6m0-6-6 6" />
      </svg>
    );
  }

  if (type === "sent") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={iconClass}
        aria-hidden="true"
      >
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={iconClass}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function ActivityStatus({ status }) {
  const normalized = String(status || "unknown").toLowerCase();

  const styles =
    normalized === "sent" || normalized === "success"
      ? "bg-emerald-50 text-emerald-700"
      : normalized === "failed" || normalized === "error"
        ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
}

function OverviewDashboard({
  stats = {},
  dailyTrend = [],
  recentActivity = [],
  loading = false,
  error,
  onRetry,
  onViewAll,
  className = "",
}) {
  const activities = useMemo(
    () => (Array.isArray(recentActivity) ? recentActivity : []),
    [recentActivity],
  );

  const trend = Array.isArray(dailyTrend) ? dailyTrend : [];

  return (
    <div
      className={["mx-auto w-full max-w-[1600px] space-y-6", className]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            <span className="size-1.5 rounded-full bg-orange-500" />
            Admin workspace
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Dashboard overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor internship records, offer processing, and email activity
            from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600 shadow-sm sm:self-auto">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-4 text-slate-400"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span>India Standard Time</span>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-rose-900">
              Dashboard data could not be loaded
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

      {loading && (
        <div
          className="h-1 overflow-hidden rounded-full bg-orange-100"
          role="status"
          aria-label="Loading dashboard data"
        >
          <div className="h-full w-1/3 animate-pulse rounded-full bg-orange-500" />
        </div>
      )}

      <section aria-label="Internship statistics" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Performance snapshot
          </h2>
          <span className="text-xs text-slate-500">
            Based on the latest dashboard response
          </span>
        </div>

        <StatsCards stats={stats} />
      </section>

      <section aria-label="Email activity chart">
        <MonthlyEmailChart dailyTrend={trend} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Recent email activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest email events available to this dashboard.
            </p>
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
            >
              View all activity
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <ActivityIcon type="default" />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-800">
              No recent activity
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Email activity will appear here when records are available.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.slice(0, 8).map((activity, index) => {
              const status = String(
                activity.status || activity.emailStatus || "unknown",
              ).toLowerCase();

              const key =
                activity._id ||
                activity.messageId ||
                `${activity.internId || "activity"}-${activity.sentAt || index}`;

              const name =
                activity.recipientName ||
                activity.name ||
                activity.internId ||
                "Unknown recipient";

              return (
                <article
                  key={key}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={[
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                        status === "sent" || status === "success"
                          ? "bg-emerald-50 text-emerald-600"
                          : status === "failed" || status === "error"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >
                      <ActivityIcon
                        type={
                          status === "sent" || status === "success"
                            ? "sent"
                            : status === "failed" || status === "error"
                              ? "failed"
                              : "default"
                        }
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {name}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-500">
                        {activity.recipientEmail ||
                          activity.email ||
                          "No recipient email"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateTime(activity.sentAt || activity.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pl-12 sm:pl-0">
                    {activity.provider && (
                      <span className="text-xs text-slate-500">
                        {activity.provider}
                      </span>
                    )}
                    <ActivityStatus status={status} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default OverviewDashboard;
