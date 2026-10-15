import { cloneElement, isValidElement, useId } from "react";

function Field({
  label,
  name,
  htmlFor,
  id,
  required = false,
  error,
  hint,
  children,
  className = "",
}) {
  const generatedId = useId();
  const fieldId = id || htmlFor || name || generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: children.props.id || fieldId,
        name: children.props.name || name,
        required: children.props.required ?? required,
        "aria-invalid": error ? "true" : children.props["aria-invalid"],
        "aria-describedby":
          [children.props["aria-describedby"], describedBy]
            .filter(Boolean)
            .join(" ") || undefined,
        className: [
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
          "focus:border-orange-400 focus:ring-4 focus:ring-orange-100",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 hover:border-slate-300",
          children.props.className,
        ]
          .filter(Boolean)
          .join(" "),
      })
    : children;

  return (
    <div className={`min-w-0 space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700"
        >
          {label}
          {required && (
            <span className="text-rose-500" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {control}

      {hint && !error && (
        <p id={hintId} className="text-xs leading-5 text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs leading-5 text-rose-600"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 size-3.5 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-11a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 7Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default Field;
