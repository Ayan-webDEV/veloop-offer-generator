import React, { useCallback, useEffect, useState } from "react";
import { apiGet } from "../../services/api.js";

function ChannelCard({ title, count, active, color }) {
  const percentage = Math.min(100, Math.round((Number(count || 0) / 100) * 100));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{count || 0}<span className="ml-1 text-sm font-semibold text-slate-400">/ 100</span></p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${active ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{active ? "Active channel" : "Standby / full"}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">{100 - (count || 0)} attempts remaining today</p>
    </div>
  );
}

export default function EmailUsagePanel({ compact = false }) {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try {
      const result = await apiGet("/api/email-usage");
      setUsage(result?.usage || null);
      setError("");
    } catch (err) { setError(err.message || "Unable to load email usage."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); const timer = window.setInterval(refresh, 30000); return () => window.clearInterval(timer); }, [refresh]);

  return (
    <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/50 to-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-600">Email infrastructure</p>
          <h2 className="mt-1 text-lg font-black tracking-tight text-slate-950">Resend channel usage</h2>
          <p className="mt-1 text-xs text-slate-500">Daily attempt quota · resets at midnight IST · pending and failed attempts count</p>
        </div>
        <button onClick={refresh} type="button" className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50">Refresh</button>
      </div>
      {loading ? <div className="animate-pulse rounded-xl bg-slate-100 p-6 text-sm text-slate-500">Loading channel usage…</div> : error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <ChannelCard title="Channel 1 · Resend API 1" count={usage?.channel1} active={usage?.activeChannel === 1} color="bg-blue-500" />
            <ChannelCard title="Channel 2 · Resend API 2" count={usage?.channel2} active={usage?.activeChannel === 2} color="bg-indigo-500" />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-white">
            <div><p className="text-xs text-slate-300">Total daily attempts</p><p className="mt-0.5 text-xl font-black">{usage?.total || 0} <span className="text-sm font-semibold text-slate-400">/ 200</span></p></div>
            <p className="text-xs font-semibold text-slate-300">{usage?.exhausted ? "Daily sending limit reached" : `Next: ${usage?.activeChannel === 2 ? "Channel 2" : "Channel 1"}`}</p>
          </div>
        </>
      )}
    </section>
  );
}
