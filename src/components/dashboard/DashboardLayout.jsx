import React, { useCallback, useEffect, useState } from "react";

import OverviewDashboard from "./OverviewDashboard.jsx";
import InternsDashboard from "./InternsDashboard.jsx";
import EmailHistoryDashboard from "./EmailHistoryDashboard.jsx";
import AnalyticsDashboard from "./AnalyticsDashboard.jsx";

import { getDashboardStats } from "../../services/dashboardService.js";

const NAVIGATION = [
  {
    id: "overview",
    label: "Overview",
    icon: "▦",
    description: "Hiring overview and activity",
  },
  {
    id: "interns",
    label: "Interns",
    icon: "♙",
    description: "Search and manage intern records",
  },
  {
    id: "email-history",
    label: "Email History",
    icon: "✉",
    description: "Offer letter email activity",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "▥",
    description: "Hiring trends and performance",
  },
];

function getIndiaDate() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function NavigationIcon({ icon }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg transition-colors"
    >
      {icon}
    </span>
  );
}

export default function DashboardLayout({
  onLogout,
  onBackToOffers,
  onSessionExpired,
}) {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Dashboard API data
  const [dashboardStats, setDashboardStats] = useState({});
  const [dailyTrend, setDailyTrend] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const activeNavigation =
    NAVIGATION.find((item) => item.id === activePage) || NAVIGATION[0];

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Load statistics from the backend.
  const loadDashboardStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");

    try {
      const response = await getDashboardStats();

      if (response?.ok === false) {
        throw new Error(
          response.message ||
            response.error ||
            "Could not load dashboard statistics.",
        );
      }

      const stats = response?.stats ?? response?.data?.stats ?? {};

      const trend = response?.dailyTrend ?? response?.data?.dailyTrend ?? [];

      if (!stats || typeof stats !== "object" || Array.isArray(stats)) {
        throw new Error(
          "The dashboard API returned an invalid statistics object.",
        );
      }

      setDashboardStats(stats);
      setDailyTrend(Array.isArray(trend) ? trend : []);
    } catch (error) {
      console.error("Dashboard statistics loading failed:", error);

      setStatsError(
        error?.message ||
          "Could not load dashboard statistics. Please try again.",
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  // Handle expired admin sessions.
  useEffect(() => {
    function handleUnauthorized(event) {
      const message =
        event?.detail?.message ||
        "Your admin session has expired. Please log in again.";

      setSidebarOpen(false);
      onSessionExpired?.(message);
    }

    window.addEventListener("veloop:admin-unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener(
        "veloop:admin-unauthorized",
        handleUnauthorized,
      );
    };
  }, [onSessionExpired]);

  // Close the mobile sidebar with Escape.
  useEffect(() => {
    if (!sidebarOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeSidebar();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen, closeSidebar]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await onLogout?.();
    } finally {
      setLoggingOut(false);
    }
  }

  function navigateTo(page) {
    if (!NAVIGATION.some((item) => item.id === page)) return;

    setActivePage(page);
    closeSidebar();
  }

  function handleBackToOffers() {
    closeSidebar();
    onBackToOffers?.();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Mobile navigation backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-dashboard-sidebar"
        aria-label="Admin sidebar"
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col",
          "border-r border-slate-200/80 bg-white",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 text-xl font-black text-white shadow-lg shadow-orange-500/20">
              V
            </div>

            <div className="leading-tight">
              <p className="text-lg font-black tracking-[0.14em] text-slate-900">
                VELOOP
              </p>
              <p className="mt-1 text-[10px] font-bold tracking-[0.28em] text-orange-600">
                REWARDS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation"
            className="grid h-9 w-9 place-items-center rounded-xl text-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1.5" aria-label="Admin dashboard navigation">
            {NAVIGATION.map((item) => {
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  title={item.description}
                  className={[
                    "group relative flex w-full items-center gap-3",
                    "rounded-2xl px-3 py-2.5 text-left",
                    "transition-all duration-200",
                    isActive
                      ? "bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full bg-orange-500"
                    />
                  )}

                  <NavigationIcon icon={item.icon} />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">
                      {item.label}
                    </span>
                    <span
                      className={[
                        "mt-0.5 block truncate text-[11px]",
                        isActive ? "text-orange-600/80" : "text-slate-400",
                      ].join(" ")}
                    >
                      {item.description}
                    </span>
                  </span>

                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1" />

        {/* Sidebar actions */}
        <div className="space-y-3 border-t border-slate-100 p-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5">
            <div className="flex items-start gap-3">
              <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Admin workspace
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Management console
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBackToOffers}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-left text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-base">
              ↗
            </span>
            <span>Offer Letter Generator</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-base">
              ⇥
            </span>

            <span>{loggingOut ? "Signing out…" : "Sign out"}</span>

            {loggingOut && (
              <span className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
            )}
          </button>
        </div>

        <div className="px-5 pb-4 text-center text-[10px] text-slate-400">
          VELOOP REWARDS · ADMIN
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:pl-[280px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-9">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              aria-controls="admin-dashboard-sidebar"
              disabled={sidebarOpen}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 lg:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
                <span>Admin</span>
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span className="truncate font-semibold text-slate-800">
                  {activeNavigation.label}
                </span>
              </div>

              <p className="mt-1 hidden text-[11px] text-slate-400 sm:block">
                VELOOP Rewards administration
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-700">
                Admin Console
              </span>
            </div>

            <div
              title="VELOOP Rewards administrator"
              aria-label="Administrator"
              role="img"
              className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-sm font-bold text-white shadow-md shadow-slate-900/10 ring-2 ring-white"
            >
              A
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-[1800px] flex-col">
          <section
            aria-label={activeNavigation.label}
            className="flex-1 px-4 pb-8 pt-7 sm:px-6 sm:pt-9 lg:px-9 lg:pt-10"
          >
            {/* Page heading */}
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-700">
                    VELOOP Rewards · Administration
                  </p>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-[34px]">
                  {activeNavigation.label}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  {activeNavigation.description}
                </p>
              </div>

              <div className="inline-flex w-fit shrink-0 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-900/[0.02]">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-lg text-orange-600">
                  ◷
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Today · IST
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-slate-800">
                    {getIndiaDate()}
                  </p>
                </div>
              </div>
            </div>

            {/* Overview */}
            {activePage === "overview" && (
              <OverviewDashboard
                stats={dashboardStats}
                dailyTrend={dailyTrend}
                loading={statsLoading}
                error={statsError}
                onRetry={loadDashboardStats}
                onViewAll={() => navigateTo("email-history")}
              />
            )}

            {/* Intern records */}
            {activePage === "interns" && <InternsDashboard />}

            {/* Email history */}
            {activePage === "email-history" && <EmailHistoryDashboard />}

            {/* Analytics */}
            {activePage === "analytics" && (
              <AnalyticsDashboard
                stats={dashboardStats}
                dailyTrend={dailyTrend}
              />
            )}
          </section>

          {/* Footer */}
          <footer className="flex flex-col gap-2 border-t border-slate-200/80 bg-white/60 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-9">
            <span>
              © {new Date().getFullYear()} VELOOP Rewards. All rights reserved.
            </span>

            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              Internal Administration
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
