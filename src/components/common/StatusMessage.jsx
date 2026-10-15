const VARIANTS = {
  success: {
    container: "border-emerald-200 bg-emerald-50 text-emerald-900",
    icon: "text-emerald-600",
    title: "text-emerald-900",
    message: "text-emerald-800",
    symbol: "✓",
    role: "status",
  },
  error: {
    container: "border-rose-200 bg-rose-50 text-rose-900",
    icon: "text-rose-600",
    title: "text-rose-900",
    message: "text-rose-800",
    symbol: "!",
    role: "alert",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    icon: "text-amber-600",
    title: "text-amber-900",
    message: "text-amber-800",
    symbol: "!",
    role: "status",
  },
  info: {
    container: "border-blue-200 bg-blue-50 text-blue-900",
    icon: "text-blue-600",
    title: "text-blue-900",
    message: "text-blue-800",
    symbol: "i",
    role: "status",
  },
};

function StatusMessage({
  type = "info",
  variant,
  title,
  message,
  children,
  className = "",
  onDismiss,
}) {
  const selectedType = variant || type;
  const styles = VARIANTS[selectedType] || VARIANTS.info;
  const content = children ?? message;

  if (!content && !title) {
    return null;
  }

  return (
    <div
      role={styles.role}
      aria-live={selectedType === "error" ? "assertive" : "polite"}
      className={[
        "flex items-start gap-3 rounded-xl border p-4 shadow-sm",
        styles.container,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "flex size-7 shrink-0 items-center justify-center rounded-full bg-white/80 text-sm font-bold shadow-sm",
          styles.icon,
        ].join(" ")}
      >
        {styles.symbol}
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        {title && (
          <p className={["text-sm font-semibold", styles.title].join(" ")}>
            {title}
          </p>
        )}

        {content && (
          <div
            className={[
              "text-sm leading-6",
              title ? "mt-1" : "",
              styles.message,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {content}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-current/70 transition hover:bg-white/70 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.22 4.22a.75.75 0 0 1 1.06 0L10 8.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L11.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 1 1-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default StatusMessage;
