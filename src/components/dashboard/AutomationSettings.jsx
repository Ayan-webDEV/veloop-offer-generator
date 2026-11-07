import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPut } from "../../services/api.js";
import EmailUsagePanel from "./EmailUsagePanel.jsx";

const field =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

const DEFAULT_REMINDER_SETTINGS = {
  enabled: true,
  delayMinutes: 150,
  senderName: "",
  senderEmail: "",
  replyTo: "",
  subject: "",
  html: "",
};

function isValidInternId(value) {
  return /^VLRINT\d{9}$/.test(
    String(value || "")
      .trim()
      .toUpperCase(),
  );
}

export default function AutomationSettings() {
  const [settings, setSettings] = useState(null);
  const [nextInternId, setNextInternId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const [reminder, sequence] = await Promise.all([
          apiGet("/api/admin/reminder-settings"),
          apiGet("/api/admin/offer-sequence"),
        ]);

        if (!active) return;

        setSettings({
          ...DEFAULT_REMINDER_SETTINGS,
          ...(reminder.settings || {}),
        });

        setNextInternId(
          String(sequence.nextInternId || "")
            .trim()
            .toUpperCase(),
        );
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load system settings.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const update = (key, value) => {
    setSettings((old) => ({
      ...old,
      [key]: value,
    }));

    setError("");
    setMessage("");
  };

  const updateInternId = (value) => {
    setNextInternId(
      String(value || "")
        .toUpperCase()
        .replace(/\s/g, ""),
    );

    setError("");
    setMessage("");
  };

  const internIdValid = isValidInternId(nextInternId);

  const sequencePreview = useMemo(() => {
    if (!internIdValid) return "Enter a valid 15-character Intern ID";

    return nextInternId;
  }, [internIdValid, nextInternId]);

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!internIdValid) {
        throw new Error(
          "Enter a valid complete Intern ID, for example VLRINT202700001.",
        );
      }

      if (
        !Number.isInteger(Number(settings.delayMinutes)) ||
        Number(settings.delayMinutes) < 1 ||
        Number(settings.delayMinutes) > 10080
      ) {
        throw new Error("Reminder delay must be between 1 and 10080 minutes.");
      }

      // Save Brevo reminder settings.
      await apiPut("/api/admin/reminder-settings", settings);

      // Save the complete Intern ID.
      await apiPut("/api/admin/offer-sequence", {
        nextInternId: nextInternId.trim().toUpperCase(),
      });

      setMessage("Email settings and Intern ID sequence saved successfully.");
    } catch (err) {
      setError(err.message || "Could not save system settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl bg-slate-100 p-8 text-sm text-slate-500">
        Loading system settings…
      </div>
    );
  }

  if (!settings) {
    return (
      <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
        {error || "Settings unavailable."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <EmailUsagePanel />

      {/* INTERN ID SEQUENCE */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-600">
            Offer letter identity
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-950">
            Intern ID sequence
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Enter the complete next Intern ID. You can manually change the year
            whenever your numbering system changes.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
          <label className="text-xs font-bold text-slate-600">
            Next Intern ID
            <input
              className={`${field} font-mono font-bold uppercase`}
              type="text"
              value={nextInternId}
              onChange={(e) => updateInternId(e.target.value)}
              placeholder="VLRINT202700001"
              maxLength={15}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="mt-2 block text-[11px] font-medium text-slate-400">
              Format: VLRINT + 4-digit year + 5-digit sequence
            </span>
          </label>

          <div className="rounded-xl bg-blue-50 p-3">
            <p className="text-xs font-bold text-blue-700">
              Next generated ID preview
            </p>

            <p className="mt-2 break-all font-mono text-lg font-black text-slate-900">
              {sequencePreview}
            </p>

            <p
              className={`mt-2 text-[11px] font-semibold ${
                internIdValid ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {internIdValid
                ? "Valid Intern ID format"
                : "Invalid Intern ID format"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-6 text-amber-800">
          Changing this value updates the next ID generated by the backend.
          Existing intern IDs are not changed. Make sure the selected ID has not
          already been assigned.
        </div>
      </section>

      {/* BREVO REMINDER SETTINGS */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-600">
            Brevo automation
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-950">
            WhatsApp joining reminder
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Automatically send an onboarding reminder after the configured delay
            for eligible new interns.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(settings.enabled)}
              onChange={(e) => update("enabled", e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            Enable reminder automation
          </label>

          <label className="text-xs font-bold text-slate-600">
            Delay in minutes
            <input
              className={field}
              type="number"
              min="1"
              max="10080"
              value={settings.delayMinutes}
              onChange={(e) => update("delayMinutes", Number(e.target.value))}
            />
          </label>

          <label className="text-xs font-bold text-slate-600">
            Brevo sender name
            <input
              className={field}
              value={settings.senderName}
              onChange={(e) => update("senderName", e.target.value)}
            />
          </label>

          <label className="text-xs font-bold text-slate-600">
            Verified Brevo sender email
            <input
              className={field}
              type="email"
              value={settings.senderEmail}
              onChange={(e) => update("senderEmail", e.target.value)}
              placeholder="noreply@velooprewards.in"
            />
          </label>

          <label className="text-xs font-bold text-slate-600 sm:col-span-2">
            Reply-to email
            <input
              className={field}
              type="email"
              value={settings.replyTo || ""}
              onChange={(e) => update("replyTo", e.target.value)}
            />
          </label>

          <label className="text-xs font-bold text-slate-600 sm:col-span-2">
            Email subject
            <input
              className={field}
              value={settings.subject}
              onChange={(e) => update("subject", e.target.value)}
            />
          </label>
        </div>

        <label className="mt-4 block text-xs font-bold text-slate-600">
          HTML email template
          <span className="font-medium text-slate-400">
            {" "}
            · Variables: {"{{name}}"}, {"{{email}}"}, {"{{internId}}"},{" "}
            {"{{whatsappLink}}"}
          </span>
          <textarea
            className={`${field} min-h-[340px] resize-y font-mono text-xs leading-6`}
            value={settings.html}
            onChange={(e) => update("html", e.target.value)}
          />
        </label>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="border-b border-slate-200 px-4 py-3">
            <p className="text-xs font-bold text-slate-700">
              Live email preview
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Sample values are substituted for template variables.
            </p>
          </div>

          <iframe
            title="WhatsApp reminder email preview"
            sandbox=""
            srcDoc={String(settings.html || "")
              .replaceAll("{{name}}", "Ayan Alam")
              .replaceAll("{{email}}", "intern@example.com")
              .replaceAll("{{internId}}", "VLRINT202700001")
              .replaceAll(
                "{{whatsappLink}}",
                "https://chat.whatsapp.com/example",
              )}
            className="h-[520px] w-full bg-white"
          />
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-6 text-blue-800">
          Brevo API keys stay on the backend only. Add{" "}
          <code>BREVO_API_KEY</code> to your backend environment. This page
          stores the sender, subject, delay and HTML template in MongoDB. New
          reminder scheduling excludes existing interns.
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </p>
        )}

        <button
          type="button"
          disabled={saving || !internIdValid}
          onClick={save}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Saving…
            </>
          ) : (
            "Save all settings"
          )}
        </button>
      </section>
    </div>
  );
}
