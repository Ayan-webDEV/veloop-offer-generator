const FILTER_OPTIONS = {
  status: [
    { value: "", label: "All statuses" },
    { value: "sent", label: "Sent" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ],
  duration: [
    { value: "", label: "All durations" },
    { value: "1", label: "1 month" },
    { value: "2", label: "2 months" },
    { value: "3", label: "3 months" },
    { value: "6", label: "6 months" },
  ],
  mode: [
    { value: "", label: "All work modes" },
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "On-site", label: "On-site" },
  ],
};

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

function InternFilters({
  filters = {},
  onFilterChange,
  onChange,
  onClear,
  loading = false,
  className = "",
}) {
  const updateFilter = onFilterChange || onChange;
  const currentFilters = {
    q: filters.q || "",
    status: filters.status || "",
    domain: filters.domain || "",
    duration: filters.duration || "",
    mode: filters.mode || "",
  };

  const hasActiveFilters = Object.values(currentFilters).some(
    (value) => String(value).trim() !== "",
  );

  function handleChange(key, value) {
    if (typeof updateFilter === "function") {
      updateFilter(key, value);
    }
  }

  function handleClear() {
    if (typeof onClear === "function") {
      onClear();
      return;
    }

    if (typeof updateFilter === "function") {
      Object.keys(currentFilters).forEach((key) => {
        updateFilter(key, "");
      });
    }
  }

  const inputClass =
    "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <section
      aria-label="Filter intern records"
      className={[
        "rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <FilterIcon />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Search and filters
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Narrow down your intern records
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          disabled={loading || !hasActiveFilters}
          className="inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="relative sm:col-span-2 xl:col-span-1">
          <label
            htmlFor="intern-search"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Search records
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <SearchIcon />
            </span>

            <input
              id="intern-search"
              name="q"
              type="search"
              value={currentFilters.q}
              onChange={(event) => handleChange("q", event.target.value)}
              placeholder="Name, ID, email..."
              disabled={loading}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="intern-status-filter"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Email status
          </label>

          <select
            id="intern-status-filter"
            name="status"
            value={currentFilters.status}
            onChange={(event) => handleChange("status", event.target.value)}
            disabled={loading}
            className={inputClass}
          >
            {FILTER_OPTIONS.status.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="intern-domain-filter"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Internship domain
          </label>

          <select
            id="intern-domain-filter"
            name="domain"
            value={currentFilters.domain}
            onChange={(event) => handleChange("domain", event.target.value)}
            disabled={loading}
            className={inputClass}
          >
            <option value="">All domains</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Web Development">Web Development</option>
            <option value="Full Stack Development">
              Full Stack Development
            </option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Backend Development">Backend Development</option>
            <option value="Java Development">Java Development</option>
            <option value="SEO">SEO</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Content Writing">Content Writing</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="intern-duration-filter"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Duration
          </label>

          <select
            id="intern-duration-filter"
            name="duration"
            value={currentFilters.duration}
            onChange={(event) => handleChange("duration", event.target.value)}
            disabled={loading}
            className={inputClass}
          >
            {FILTER_OPTIONS.duration.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="intern-mode-filter"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Work mode
          </label>

          <select
            id="intern-mode-filter"
            name="mode"
            value={currentFilters.mode}
            onChange={(event) => handleChange("mode", event.target.value)}
            disabled={loading}
            className={inputClass}
          >
            {FILTER_OPTIONS.mode.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs font-medium text-slate-500">
            Active filters
          </span>

          {Object.entries(currentFilters)
            .filter(([, value]) => String(value).trim() !== "")
            .map(([key, value]) => (
              <button
                key={key}
                type="button"
                disabled={loading}
                onClick={() => handleChange(key, "")}
                className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-800 transition hover:border-orange-200 hover:bg-orange-100 disabled:opacity-50"
                aria-label={`Remove ${key} filter`}
              >
                <span className="max-w-48 truncate">
                  {key === "q"
                    ? `Search: ${value}`
                    : `${key.charAt(0).toUpperCase()}${key.slice(1)}: ${value}`}
                </span>
                <span aria-hidden="true">×</span>
              </button>
            ))}
        </div>
      )}
    </section>
  );
}

export default InternFilters;
