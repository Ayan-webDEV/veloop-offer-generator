function LoadingState({
  title = "Loading your workspace",
  message = "Please wait while we prepare everything for you.",
  fullScreen = false,
  className = "",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex items-center justify-center",
        fullScreen ? "min-h-screen bg-slate-50 px-4 py-10" : "w-full py-12",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative flex size-16 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-orange-100" />

          <div className="relative flex size-10 items-center justify-center rounded-xl bg-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-6 text-orange-600"
              aria-hidden="true"
            >
              <path
                d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <span className="absolute -right-1 -top-1 size-4 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
        </div>

        <h2 className="mt-5 text-base font-semibold tracking-tight text-slate-900">
          {title}
        </h2>

        {message && (
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
            {message}
          </p>
        )}

        <div className="mt-5 h-1 w-36 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-orange-500" />
        </div>

        <span className="sr-only">Loading, please wait.</span>
      </div>
    </div>
  );
}

export default LoadingState;
