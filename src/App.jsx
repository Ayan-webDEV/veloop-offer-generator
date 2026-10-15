import React, { useCallback, useState } from "react";

import OfferGenerator from "./components/offer/OfferGenerator.jsx";
import AdminLogin from "./components/dashboard/AdminLogin.jsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.jsx";
import { useAdminAuth } from "./hooks/useAdminAuth.js";

function LoadingScreen() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas px-6 text-ink-500"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 shadow-card">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600" />
      </div>

      <div className="text-center">
        <p className="text-lg font-bold tracking-tight text-ink-900">
          VELOOP <span className="text-brand-600">REWARDS</span>
        </p>
        <p className="mt-1 text-sm text-ink-500">Preparing your workspace…</p>
      </div>
    </main>
  );
}

function AppNavigation({ onHome, onDashboard }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10"
        aria-label="Application navigation"
      >
        <button
          type="button"
          onClick={onHome}
          className="group flex min-w-0 items-center gap-3 rounded-xl text-left"
          aria-label="Go to offer generator"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-sm font-black tracking-tight text-black shadow-sm transition-transform duration-200 group-hover:scale-105">
            V<span className="text-brand-500">.</span>
          </span>

          <span className="min-w-0">
            <span className="block text-sm font-extrabold tracking-[0.12em] text-ink-950 sm:text-base">
              VELOOP <span className="text-brand-600">REWARDS</span>
            </span>
            <span className="mt-0.5 hidden text-[11px] font-medium tracking-wide text-ink-500 sm:block">
              INTERNSHIP MANAGEMENT
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Workspace
          </span>

          <button
            type="button"
            onClick={onDashboard}
            // className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-ink-950 px-3.5 py-2.5 text-xs font-bold text-black shadow-sm transition duration-200 hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:px-4 sm:text-sm"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/20 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
            >
              <rect
                x="3.5"
                y="3.5"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <rect
                x="13.5"
                y="3.5"
                width="7"
                height="4"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <rect
                x="13.5"
                y="11.5"
                width="7"
                height="9"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <rect
                x="3.5"
                y="13.5"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>

            <span>Admin Dashboard</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("offer");

  const {
    isAuthenticated,
    isCheckingAuth,
    login,
    logout,
    authError,
    handleUnauthorized,
  } = useAdminAuth();

  const goToOffers = useCallback(() => {
    setActiveView("offer");
  }, []);

  const goToDashboard = useCallback(() => {
    setActiveView("dashboard");
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      setActiveView("offer");
    }
  }, [logout]);

  const handleSessionExpired = useCallback(() => {
    handleUnauthorized();
    setActiveView("dashboard");
  }, [handleUnauthorized]);

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  if (activeView === "dashboard" && !isAuthenticated) {
    return <AdminLogin onLogin={login} error={authError} onBack={goToOffers} />;
  }

  if (activeView === "dashboard" && isAuthenticated) {
    return (
      <DashboardLayout
        onLogout={handleLogout}
        onBackToOffers={goToOffers}
        onSessionExpired={handleSessionExpired}
      />
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink-900">
      <AppNavigation onHome={goToOffers} onDashboard={goToDashboard} />

      <main className="min-h-[calc(100vh-72px)]">
        <OfferGenerator />
      </main>
    </div>
  );
}
