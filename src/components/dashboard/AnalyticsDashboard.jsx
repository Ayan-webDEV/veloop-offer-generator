import { useMemo } from "react";
import StatsCards from "./StatsCards";
import MonthlyEmailChart from "./MonthlyEmailChart";

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString("en-IN");
}

function normalizeStats(input) {
  if (!input || typeof input !== "object") return {};

  // Supports both the direct stats object and wrapped API responses.
  return input.stats ?? input.data?.stats ?? input.data?.data?.stats ?? input;
}

function normalizeTrend(input, fallback = []) {
  if (Array.isArray(input)) return input;

  if (Array.isArray(input?.dailyTrend)) return input.dailyTrend;
  if (Array.isArray(input?.data?.dailyTrend)) {
    return input.data.dailyTrend;
  }

  return Array.isArray(fallback) ? fallback : [];
}

function AnalyticsMetric({
  label,
  value,
  description,
  icon,
  accent = "orange",
}) {
  const accents = {
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
            {value}
          </p>
        </div>

        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            accents[accent] || accents.orange
          }`}
        >
          {icon}
        </div>
      </div>

      {description && (
        <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
      )}
    </article>
  );
}

function AnalyticsDashboard({
  stats: statsInput = {},
  dailyTrend: trendInput = [],
  loading = false,
  error,
  onRetry,
  className = "",
}) {
  const stats = normalizeStats(statsInput);
  const trend = normalizeTrend(trendInput, statsInput?.dailyTrend);

  const analytics = useMemo(() => {
    const sentToday = Number(stats.emailsSentToday) || 0;
    const failedToday = Number(stats.emailsFailedToday) || 0;
    const sentMonth = Number(stats.emailsSentThisMonth) || 0;

    const sentInTrend = trend.reduce(
      (sum, item) => sum + (Number(item?.sent) || 0),
      0,
    );

    const failedInTrend = trend.reduce(
      (sum, item) => sum + (Number(item?.failed) || 0),
      0,
    );

    const totalTrendEvents = sentInTrend + failedInTrend;

    return {
      sentToday,
      failedToday,
      sentMonth,
      sentInTrend,
      failedInTrend,
      totalTrendEvents,
      successRate:
        totalTrendEvents > 0 ? (sentInTrend / totalTrendEvents) * 100 : null,
      failureRate:
        totalTrendEvents > 0 ? (failedInTrend / totalTrendEvents) * 100 : null,
    };
  }, [stats, trend]);

  const successWidth =
    analytics.successRate === null ? 0 : analytics.successRate;

  const failureWidth =
    analytics.failureRate === null ? 0 : analytics.failureRate;

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
            Performance insights
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Email analytics
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Understand email activity, sending outcomes, and performance across
            the available reporting period.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600 shadow-sm sm:self-auto">
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
          Reporting in IST
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-rose-900">
              Analytics could not be loaded
            </p>
            <p className="mt-1 text-sm leading-5 text-rose-700">
              {typeof error === "string"
                ? error
                : error.message || "An unexpected error occurred."}
            </p>
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
          role="status"
          aria-label="Loading analytics"
          className="h-1 overflow-hidden rounded-full bg-orange-100"
        >
          <div className="h-full w-1/3 animate-pulse rounded-full bg-orange-500" />
        </div>
      )}

      <section aria-label="Overall statistics">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Overall snapshot
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Current totals supplied by the dashboard API.
          </p>
        </div>

        <StatsCards stats={stats} />
      </section>

      <section
        aria-label="Email sending metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <AnalyticsMetric
          label="Emails sent today"
          value={formatNumber(analytics.sentToday)}
          description="Provider-accepted sending requests reported for today."
          accent="emerald"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-5"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          }
        />

        <AnalyticsMetric
          label="Email failures today"
          value={formatNumber(analytics.failedToday)}
          description="Failed email attempts reported for today."
          accent="rose"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m9 9 6 6m0-6-6 6" />
            </svg>
          }
        />

        <AnalyticsMetric
          label="Emails sent this month"
          value={formatNumber(analytics.sentMonth)}
          description="Monthly total returned by the dashboard API."
          accent="blue"
          icon={
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
          }
        />
      </section>

      <section>
        <MonthlyEmailChart dailyTrend={trend} />
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Trend-period outcomes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Summary calculated from the daily trend data currently available.
            </p>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {trend.length} {trend.length === 1 ? "day" : "days"} of data
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-medium text-slate-500">Sent in trend</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700 tabular-nums">
              {formatNumber(analytics.sentInTrend)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-medium text-slate-500">
              Failed in trend
            </p>
            <p className="mt-2 text-2xl font-semibold text-rose-700 tabular-nums">
              {formatNumber(analytics.failedInTrend)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-medium text-slate-500">
              Total recorded events
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">
              {formatNumber(analytics.totalTrendEvents)}
            </p>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Sent vs. failed
            </h3>

            <span className="text-xs text-slate-500">
              {analytics.successRate === null
                ? "No trend events available"
                : `${analytics.successRate.toFixed(1)}% sent`}
            </span>
          </div>

          <div
            className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
            role="img"
            aria-label={
              analytics.successRate === null
                ? "No email trend data available"
                : `${analytics.successRate.toFixed(1)} percent sent, ${analytics.failureRate.toFixed(1)} percent failed`
            }
          >
            {analytics.successRate !== null && (
              <>
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${successWidth}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${failureWidth}%` }}
                />
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              Sent:{" "}
              {analytics.successRate === null
                ? "—"
                : `${analytics.successRate.toFixed(1)}%`}
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-500" />
              Failed:{" "}
              {analytics.failureRate === null
                ? "—"
                : `${analytics.failureRate.toFixed(1)}%`}
            </span>
          </div>
        </div>

        <p className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs leading-5 text-blue-800">
          These percentages describe the available daily trend records, not
          guaranteed inbox delivery. Provider acceptance does not confirm that a
          recipient received or opened an email.
        </p>
      </section>
    </div>
  );
}

export default AnalyticsDashboard;
