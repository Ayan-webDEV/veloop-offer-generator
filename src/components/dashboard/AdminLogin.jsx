import React, { useState } from "react";

export default function AdminLogin({ onLogin, error = "", onBack }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setLocalError("");

    if (!password.trim()) {
      setLocalError("Please enter your admin password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onLogin(password);
    } catch (err) {
      setLocalError(
        err?.message || "Login failed. Please check your password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const visibleError = localError || error;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-900 selection:bg-orange-200 selection:text-orange-950 sm:px-6">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-orange-500/15 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400/10 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.5) 0.7px, transparent 0.7px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-[460px]">
        {/* Brand */}
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 text-2xl font-black text-white shadow-xl shadow-orange-500/25 ring-1 ring-white/15">
            V
          </div>

          <div className="leading-tight">
            <p className="text-xl font-black tracking-[0.15em] text-white">
              VELOOP
            </p>
            <p className="mt-1 text-[10px] font-bold tracking-[0.32em] text-orange-400">
              REWARDS
            </p>
          </div>
        </div>

        {/* Login card */}
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl shadow-black/30">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />

          <div className="p-6 sm:p-9">
            {/* Security badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                Restricted access
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-[34px]">
              Welcome back.
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to review hiring activity, monitor offer letters, and
              manage intern records.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Admin password
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-orange-500">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <rect x="4" y="10" width="16" height="11" rx="2.5" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                      <path d="M12 14v3" strokeLinecap="round" />
                    </svg>
                  </div>

                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setLocalError("");
                    }}
                    placeholder="Enter your admin password"
                    autoComplete="current-password"
                    required
                    autoFocus
                    disabled={isSubmitting}
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-16 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    disabled={isSubmitting}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-xs font-bold text-slate-500 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400 disabled:opacity-50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error feedback */}
              {visibleError && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-rose-800"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-100 text-sm font-black">
                    !
                  </span>

                  <p className="pt-0.5 text-sm leading-5">{visibleError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !password.trim()}
                className="group flex min-h-13 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition duration-200 hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Verifying access…
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                >
                  <path
                    d="M12 3 19 6v5c0 4.6-2.9 7.7-7 10-4.1-2.3-7-5.4-7-10V6l7-3Z"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m9 12 2 2 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Secure administrator access
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your password is verified by the backend and is not stored in
                  this component.
                </p>
              </div>
            </div>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span aria-hidden="true">←</span>
                Back to offer generator
              </button>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-7 text-center">
          <p className="text-xs font-medium text-slate-400">
            © {new Date().getFullYear()} VELOOP Rewards
          </p>
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Administration Console
          </p>
        </footer>
      </div>
    </main>
  );
}
