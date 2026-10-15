const DEFAULT_METRICS = [
  {
    key: "totalInterns",
    label: "Total interns",
    description: "All registered internship records",
    icon: "users",
    accent: "orange",
  },
  {
    key: "sentInterns",
    label: "Offers sent",
    description: "Internship offers successfully submitted",
    icon: "check",
    accent: "emerald",
  },
  {
    key: "pendingInterns",
    label: "Pending offers",
    description: "Records awaiting processing",
    icon: "clock",
    accent: "amber",
  },
  {
    key: "failedInterns",
    label: "Failed offers",
    description: "Records requiring attention",
    icon: "alert",
    accent: "rose",
  },
];

const ACCENTS = {
  orange: {
    icon: "bg-orange-50 text-orange-600 ring-orange-100",
    bar: "bg-orange-500",
    label: "text-orange-700",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    bar: "bg-emerald-500",
    label: "text-emerald-700",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    bar: "bg-amber-500",
    label: "text-amber-700",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600 ring-rose-100",
    bar: "bg-rose-500",
    label: "text-rose-700",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600 ring-blue-100",
    bar: "bg-blue-500",
    label: "text-blue-700",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 ring-violet-100",
    bar: "bg-violet-500",
    label: "text-violet-700",
  },
};

function MetricIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" {...common}>
      {name === "users" && (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      )}

      {name === "check" && (
        <>
          <path d="M20 7 10 17l-5-5" />
          <circle cx="12" cy="12" r="9" />
        </>
      )}

      {name === "clock" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}

      {name === "alert" && (
        <>
          <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4m0 4h.01" />
        </>
      )}

      {name === "calendar" && (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </>
      )}

      {name === "mail" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      )}

      {name === "trending" && (
        <>
          <path d="m3 17 6-6 4 4 8-8" />
          <path d="M15 7h6v6" />
        </>
      )}

      {name === "send" && (
        <>
          <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          <path d="M22 2 11 13" />
        </>
      )}
    </svg>
  );
}

function formatMetric(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toLocaleString("en-IN") : "—";
  }

  return value;
}

function getStatsObject(stats) {
  if (!stats || typeof stats !== "object" || Array.isArray(stats)) {
    return {};
  }

  // Supports both a direct stats object and a full API response.
  if (stats.stats && typeof stats.stats === "object") {
    return stats.stats;
  }

  if (stats.data?.stats && typeof stats.data.stats === "object") {
    return stats.data.stats;
  }

  return stats;
}

function StatsCards({ stats = {}, cards, className = "" }) {
  const normalizedStats = getStatsObject(stats);
  const metrics = cards || DEFAULT_METRICS;

  return (
    <div
      className={[
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {metrics.map((metric) => {
        const accent = ACCENTS[metric.accent] || ACCENTS.orange;

        // Preserve valid zero values rather than treating them as missing.
        const value =
          normalizedStats[metric.key] !== undefined &&
          normalizedStats[metric.key] !== null
            ? normalizedStats[metric.key]
            : metric.value;

        return (
          <article
            key={metric.key || metric.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-6"
          >
            <div
              aria-hidden="true"
              className={[
                "absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100",
                accent.bar,
              ].join(" ")}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {metric.label}
                </p>

                <p
                  aria-live="polite"
                  className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 tabular-nums"
                >
                  {formatMetric(value)}
                </p>
              </div>

              <div
                className={[
                  "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                  accent.icon,
                ].join(" ")}
              >
                <MetricIcon name={metric.icon} />
              </div>
            </div>

            {metric.description && (
              <p className="mt-4 text-xs leading-5 text-slate-500">
                {metric.description}
              </p>
            )}

            {metric.trend !== undefined && metric.trend !== null && (
              <div className="mt-3 flex items-center gap-1.5">
                <MetricIcon name="trending" />

                <span
                  className={["text-xs font-semibold", accent.label].join(" ")}
                >
                  {metric.trend}
                </span>

                {metric.trendLabel && (
                  <span className="text-xs text-slate-500">
                    {metric.trendLabel}
                  </span>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default StatsCards;
