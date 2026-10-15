import React from "react";

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

const DURATION_OPTIONS = ["1 Month", "2 Months", "3 Months", "6 Months"];

const MODE_OPTIONS = ["Remote", "Hybrid", "On-site"];

const STIPEND_OPTIONS = ["Performance Based — Up to ₹6,000", "UnPaid"];

const DEFAULT_EMAIL_SUBJECT =
  "Congratulations! You Have Been Shortlisted – Internship Offer Letter Attached";

const inputClass =
  "mt-2 block min-h-11 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-500/70 hover:border-ink-500/40 focus:border-brand-600 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-ink-500";

const labelClass = "block text-xs font-bold tracking-wide text-ink-700";

function Field({ label, name, required = false, hint, error, children }) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="min-w-0">
      <label className={labelClass} htmlFor={name}>
        {label}
        {required && (
          <span className="ml-1 text-brand-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {React.cloneElement(children, {
        id: name,
        name,
        required,
        "aria-invalid": Boolean(error),
        "aria-describedby":
          [hintId, errorId].filter(Boolean).join(" ") || undefined,
      })}

      {hint && (
        <p id={hintId} className="mt-1.5 text-[11px] leading-5 text-ink-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-1.5 text-xs font-medium text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="col-span-full flex items-center gap-3 border-b border-line pb-3 pt-1">
      <span className="h-5 w-1 rounded-full bg-brand-600" />
      <h3 className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink-800">
        {children}
      </h3>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "secondary",
  type = "button",
}) {
  const styles = {
    primary:
      // "border border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/15 hover:border-brand-700 hover:bg-brand-700",
      " inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-orange-600 bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-700 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50",
    secondary:
      // "border border-line bg-white text-ink-800 hover:border-ink-500/40 hover:bg-canvas",
      "inline-flex min-h-11 w-full items-center mb-6 justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-900 hover:bg-emerald-900 hover:text-white hover:shadow-xl hover:shadow-emerald-900/30 active:translate-y-0 active:scale-95 active:border-emerald-700 active:bg-emerald-700 active:text-white active:shadow-inner focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm",
    dark:
      // "border border-ink-950 bg-ink-950 text-white hover:bg-ink-800",
      "ms-2  inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-800 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-950 hover:bg-blue-950 hover:text-white hover:shadow-xl hover:shadow-blue-950/30 active:translate-y-0 active:scale-95 active:border-blue-700 active:bg-blue-700 active:text-white active:shadow-inner focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm",
    danger:
      "inline-flex min-h-11 w-full items-center mb-6  justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-800 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-rose-950 hover:bg-rose-950 hover:text-white hover:shadow-xl hover:shadow-rose-950/30 active:translate-y-0 active:scale-95 active:border-rose-700 active:bg-rose-700 active:text-white active:shadow-inner focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm",
    // "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${styles[variant] || styles.secondary}`}
    >
      {children}
    </button>
  );
}

export default function OfferForm({
  data,
  onChange,
  onAssignId,
  onGenerate,
  onSend,
  onDownload,
  onDiscard,
  busy = false,
  isOfferGenerated = false,
  requiredFieldsFilled = false,
  error = "",
  success = "",
}) {
  const locked = Boolean(data.internId) || isOfferGenerated;

  const update = (key, value) => {
    onChange(key, value);
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(data.email || "").trim(),
  );

  const whatsappValid = (() => {
    try {
      const url = new URL(String(data.whatsappLink || "").trim());

      return (
        url.protocol === "https:" &&
        [
          "chat.whatsapp.com",
          "www.chat.whatsapp.com",
          "wa.me",
          "www.wa.me",
          "api.whatsapp.com",
        ].includes(url.hostname.toLowerCase()) &&
        !url.username &&
        !url.password
      );
    } catch {
      return false;
    }
  })();

  return (
    <form
      className="space-y-7"
      onSubmit={(event) => {
        event.preventDefault();
        if (!busy) onGenerate();
      }}
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <SectionLabel>Recipient information</SectionLabel>

        <Field
          label="Intern full name"
          name="intern-name"
          required
          hint="The name will appear on the offer letter."
        >
          <input
            type="text"
            autoComplete="name"
            value={data.name}
            onChange={(event) =>
              update("name", event.target.value.toUpperCase())
            }
            placeholder="Enter full name"
            className={inputClass}
            disabled={locked || busy}
          />
        </Field>

        <Field
          label="Recipient email"
          name="intern-email"
          required
          error={
            data.email && !emailValid ? "Enter a valid email address." : ""
          }
        >
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={data.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="intern@example.com"
            className={inputClass}
            disabled={locked || busy}
          />
        </Field>

        <SectionLabel>Internship details</SectionLabel>

        <Field label="Position / domain" name="intern-position" required>
          <select
            value={data.position}
            onChange={(event) => update("position", event.target.value)}
            className={inputClass}
            disabled={locked || busy}
          >
            <option value="">Select a position</option>
            {DOMAIN_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Intern ID"
          name="intern-id"
          hint="Assigned by the backend and saved with the intern record."
        >
          <div className="mt-2 flex gap-2">
            <input
              id="intern-id"
              name="intern-id"
              value={data.internId}
              readOnly
              placeholder="Not assigned yet"
              className={`${inputClass} mt-0 min-w-0 flex-1 bg-canvas font-mono text-xs`}
            />

            <button
              type="button"
              onClick={onAssignId}
              disabled={busy || Boolean(data.internId) || isOfferGenerated}
              className="shrink-0 rounded-xl border border-line bg-white px-3 text-xs font-bold text-ink-800 transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-50"
            >
              Assign ID
            </button>
          </div>
        </Field>

        <Field label="Issue date (IST)" name="issue-date">
          <input
            type="date"
            value={data.issueDate || ""}
            readOnly
            className={`${inputClass} bg-canvas`}
          />
        </Field>

        <Field label="Internship start date" name="start-date" required>
          <input
            type="date"
            value={data.startDate || ""}
            onChange={(event) => update("startDate", event.target.value)}
            className={inputClass}
            disabled={locked || busy}
          />
        </Field>

        <Field label="Internship duration" name="intern-duration" required>
          <select
            value={data.duration}
            onChange={(event) => update("duration", event.target.value)}
            className={inputClass}
            disabled={locked || busy}
          >
            {DURATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Work mode" name="intern-mode" required>
          <select
            value={data.mode}
            onChange={(event) => update("mode", event.target.value)}
            className={inputClass}
            disabled={locked || busy}
          >
            {MODE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Stipend policy" name="intern-stipend">
          <select
            value={data.stipend}
            onChange={(event) => update("stipend", event.target.value)}
            className={inputClass}
            disabled={locked || busy}
          >
            {STIPEND_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <SectionLabel>Email configuration</SectionLabel>

        <div className="col-span-full">
          <Field
            label="Email subject"
            name="email-subject"
            hint="The default subject is retained for the official offer email."
          >
            <input
              type="text"
              value={data.subject || DEFAULT_EMAIL_SUBJECT}
              readOnly
              className={`${inputClass} bg-canvas`}
            />
          </Field>
        </div>

        <div className="col-span-full">
          <Field
            label="WhatsApp community link"
            name="whatsapp-link"
            required
            hint="Use an HTTPS invite link from chat.whatsapp.com, wa.me, or api.whatsapp.com."
            error={
              data.whatsappLink && !whatsappValid
                ? "Enter a valid HTTPS WhatsApp link."
                : ""
            }
          >
            <input
              type="url"
              inputMode="url"
              autoComplete="url"
              value={data.whatsappLink}
              onChange={(event) => update("whatsappLink", event.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className={inputClass}
              disabled={busy || isOfferGenerated}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M12 3.75 19 6.5v5.1c0 4.15-2.9 7.1-7 8.65-4.1-1.55-7-4.5-7-8.65V6.5l7-2.75Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div>
            <p className="text-xs font-extrabold text-ink-900">
              Review before sending
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-700">
              Confirm the intern details and preview the generated PDF. The
              email is submitted only when you select Send Offer Letter.
            </p>
          </div>
        </div>
      </div>

      <div className=" border-t border-line pt-5 ">
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-md sm:px-6">
          <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3">
            {/* Keep your existing Generate offer letter button here */}
            <ActionButton
              variant="primary"
              type="submit"
              disabled={busy || !requiredFieldsFilled || isOfferGenerated}
            >
              {busy && !isOfferGenerated ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating…
                </>
              ) : (
                <>
                  <span aria-hidden="true">✦</span>
                  Generate offer letter
                </>
              )}
            </ActionButton>

            <ActionButton
              variant="dark"
              onClick={onSend}
              disabled={busy || !isOfferGenerated || !requiredFieldsFilled}
            >
              {busy && isOfferGenerated ? "Sending…" : "Send offer letter"}
              <span aria-hidden="true">→</span>
            </ActionButton>
            {/* Keep your existing Send offer letter button here */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ActionButton
            onClick={onDownload}
            disabled={busy || !isOfferGenerated}
          >
            Download PDF
          </ActionButton>

          <ActionButton
            variant="danger"
            onClick={onDiscard}
            disabled={busy || !isOfferGenerated}
          >
            Discard preview
          </ActionButton>
        </div>

        {isOfferGenerated && (
          <p className="text-xs leading-5 text-ink-500">
            The PDF is ready. Review the preview before downloading or sending.
          </p>
        )}

        {!requiredFieldsFilled && (
          <p className="text-xs leading-5 text-ink-500">
            Complete the required fields, including a valid email and WhatsApp
            community link, to generate the offer.
          </p>
        )}

        {error && (
          <p className="text-xs leading-5 text-red-700" role="status">
            Review the message above and correct any missing information.
          </p>
        )}

        {success && (
          <p className="text-xs leading-5 text-emerald-700" role="status">
            Your latest operation completed. Review the message above for
            details.
          </p>
        )}
      </div>
    </form>
  );
}
