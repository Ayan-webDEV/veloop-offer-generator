import { useMemo } from "react";

const CHART_WIDTH = 720;
const CHART_HEIGHT = 260;

const PADDING = {
  top: 20,
  right: 16,
  bottom: 42,
  left: 42,
};

const SENT_COLOR = "#059669";
const FAILED_COLOR = "#e11d48";

function formatShortDate(value) {
  if (!value) return "—";

  const raw = String(value);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? new Date(`${raw}T00:00:00`)
    : new Date(raw);

  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString("en-IN");
}

function normalizeRows(data, dailyTrend) {
  let source = Array.isArray(data)
    ? data
    : Array.isArray(dailyTrend)
      ? dailyTrend
      : Array.isArray(data?.dailyTrend)
        ? data.dailyTrend
        : Array.isArray(data?.data?.dailyTrend)
          ? data.data.dailyTrend
          : [];

  return source.map((item, index) => ({
    date: String(
      item?.date ??
        item?.day ??
        item?.label ??
        item?._id?.date ??
        item?._id ??
        `Day ${index + 1}`,
    ),
    sent: Math.max(
      0,
      Number(item?.sent ?? item?.emailsSent ?? item?.sentCount ?? 0) || 0,
    ),
    failed: Math.max(
      0,
      Number(item?.failed ?? item?.emailsFailed ?? item?.failedCount ?? 0) || 0,
    ),
  }));
}

function LegendItem({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
      <span
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function EmptyChart({ loading, error, onRetry }) {
  return (
    <div className="px-5 py-14 text-center sm:px-6">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {loading ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-6 animate-pulse"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-6"
            aria-hidden="true"
          >
            <path d="M3 3v18h18" />
            <path d="m7 14 4-4 4 3 5-7" />
          </svg>
        )}
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800">
        {loading
          ? "Loading email activity…"
          : error
            ? "Email activity could not be loaded"
            : "No activity to display"}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {loading
          ? "Please wait while the dashboard retrieves your data."
          : error
            ? typeof error === "string"
              ? error
              : error.message || "An unexpected error occurred."
            : "Daily email activity will appear here when data is available."}
      </p>

      {!loading && error && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-100"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function MonthlyEmailChart({
  data,
  dailyTrend,
  loading = false,
  error,
  onRetry,
  className = "",
}) {
  const rows = useMemo(
    () => normalizeRows(data, dailyTrend),
    [data, dailyTrend],
  );

  const chart = useMemo(() => {
    const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const maxValue = Math.max(
      1,
      ...rows.map((row) => Math.max(row.sent, row.failed)),
    );

    const tickStep = Math.max(1, Math.ceil(maxValue / 4));
    const maxTick = Math.ceil(maxValue / tickStep) * tickStep;

    const x = (index) =>
      rows.length <= 1
        ? PADDING.left + plotWidth / 2
        : PADDING.left + (index / (rows.length - 1)) * plotWidth;

    const y = (value) =>
      PADDING.top + plotHeight - (value / maxTick) * plotHeight;

    const sentPoints = rows
      .map((row, index) => `${x(index)},${y(row.sent)}`)
      .join(" ");

    const failedPoints = rows
      .map((row, index) => `${x(index)},${y(row.failed)}`)
      .join(" ");

    const ticks = [];

    for (let value = 0; value <= maxTick; value += tickStep) {
      ticks.push(value);
    }

    const labelIndexes = new Set();

    if (rows.length > 0) {
      labelIndexes.add(0);
      labelIndexes.add(rows.length - 1);

      const desiredLabels = Math.min(6, rows.length);
      const interval = (rows.length - 1) / Math.max(1, desiredLabels - 1);

      for (let index = 0; index < desiredLabels; index += 1) {
        labelIndexes.add(Math.round(index * interval));
      }
    }

    return {
      maxTick,
      ticks,
      x,
      y,
      sentPoints,
      failedPoints,
      labelIndexes: [...labelIndexes].sort((a, b) => a - b),
    };
  }, [rows]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (result, row) => ({
          sent: result.sent + row.sent,
          failed: result.failed + row.failed,
        }),
        { sent: 0, failed: 0 },
      ),
    [rows],
  );

  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Email activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Daily sending results over the available reporting period.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LegendItem color={SENT_COLOR} label="Sent" />
          <LegendItem color={FAILED_COLOR} label="Failed" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pt-5 sm:px-6">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
          <p className="text-xs font-medium text-emerald-700">Total sent</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-emerald-800 tabular-nums">
            {formatNumber(totals.sent)}
          </p>
        </div>

        <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3.5">
          <p className="text-xs font-medium text-rose-700">Total failed</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-rose-800 tabular-nums">
            {formatNumber(totals.failed)}
          </p>
        </div>
      </div>

      {loading || error || rows.length === 0 ? (
        <EmptyChart loading={loading} error={error} onRetry={onRetry} />
      ) : (
        <div className="px-3 pb-5 pt-4 sm:px-5">
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              role="img"
              aria-label={`Email activity chart. ${formatNumber(
                totals.sent,
              )} sent and ${formatNumber(
                totals.failed,
              )} failed across ${rows.length} days.`}
              className="h-auto w-full min-w-[520px]"
            >
              {chart.ticks.map((tick) => {
                const tickY = chart.y(tick);

                return (
                  <g key={tick}>
                    <line
                      x1={PADDING.left}
                      x2={CHART_WIDTH - PADDING.right}
                      y1={tickY}
                      y2={tickY}
                      stroke="#e2e8f0"
                      strokeDasharray="4 5"
                    />
                    <text
                      x={PADDING.left - 10}
                      y={tickY + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="#64748b"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              <line
                x1={PADDING.left}
                x2={CHART_WIDTH - PADDING.right}
                y1={CHART_HEIGHT - PADDING.bottom}
                y2={CHART_HEIGHT - PADDING.bottom}
                stroke="#cbd5e1"
              />

              <polyline
                points={chart.sentPoints}
                fill="none"
                stroke={SENT_COLOR}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <polyline
                points={chart.failedPoints}
                fill="none"
                stroke={FAILED_COLOR}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {rows.map((row, index) => (
                <g key={`${row.date}-${index}`}>
                  <circle
                    cx={chart.x(index)}
                    cy={chart.y(row.sent)}
                    r="3.5"
                    fill={SENT_COLOR}
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <title>
                      {formatShortDate(row.date)}: {row.sent} sent
                    </title>
                  </circle>

                  <circle
                    cx={chart.x(index)}
                    cy={chart.y(row.failed)}
                    r="3.5"
                    fill={FAILED_COLOR}
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <title>
                      {formatShortDate(row.date)}: {row.failed} failed
                    </title>
                  </circle>
                </g>
              ))}

              {chart.labelIndexes.map((index) => (
                <text
                  key={`label-${index}`}
                  x={chart.x(index)}
                  y={CHART_HEIGHT - 16}
                  textAnchor={
                    index === 0
                      ? "start"
                      : index === rows.length - 1
                        ? "end"
                        : "middle"
                  }
                  fontSize="10"
                  fill="#64748b"
                >
                  {formatShortDate(rows[index].date)}
                </text>
              ))}
            </svg>
          </div>

          <p className="mt-2 text-center text-xs text-slate-400">
            Counts are based on the activity data returned by the server. Sent
            means the provider accepted the sending request; it does not
            guarantee inbox delivery.
          </p>
        </div>
      )}
    </section>
  );
}

export default MonthlyEmailChart;
