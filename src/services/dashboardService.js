import { apiGet } from "./api.js";

const DASHBOARD_ENDPOINT = "/api/dashboard/stats";
const INTERNS_ENDPOINT = "/api/interns";
const EXPORT_ENDPOINT = `${INTERNS_ENDPOINT}/export`;

const CSV_COLUMNS = [
  { key: "internId", label: "Intern ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "domain", label: "Domain" },
  { key: "startDate", label: "Start Date" },
  { key: "duration", label: "Duration" },
  { key: "mode", label: "Mode" },
  { key: "stipend", label: "Stipend" },
  { key: "issueDate", label: "Issue Date" },
  { key: "offerCreatedAt", label: "Record Created At" },
  { key: "offerSent", label: "Offer Sent" },
  { key: "offerSentAt", label: "Offer Sent At" },
  { key: "offerStatus", label: "Offer Status" },
  { key: "emailProvider", label: "Email Provider" },
  { key: "emailSendCount", label: "Email Send Count" },
  { key: "lastEmailError", label: "Last Email Error" },
  { key: "resendMessageId", label: "Resend Message ID" },
  { key: "brevoMessageId", label: "Brevo Message ID" },
];

/**
 * Convert frontend filters to the query parameters accepted by the backend.
 *
 * Frontend uses "search"; the server expects "q".
 */
function normalizeFilters(filters = {}, { includePagination = true } = {}) {
  const normalized = { ...filters };

  if (normalized.q === undefined && normalized.search !== undefined) {
    normalized.q = normalized.search;
  }

  delete normalized.search;

  if (!includePagination) {
    delete normalized.page;
    delete normalized.limit;
  }

  return normalized;
}

function buildQueryString(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value).trim());
    }
  });

  return params.toString();
}

function buildEndpoint(base, filters = {}) {
  const queryString = buildQueryString(filters);

  return queryString ? `${base}?${queryString}` : base;
}

/**
 * Fetch dashboard overview statistics.
 *
 * Backend response:
 * {
 *   ok: true,
 *   stats: { totalInterns, sentInterns, pendingInterns, ... },
 *   dailyTrend: [...]
 * }
 */
export async function getDashboardStats() {
  return apiGet(DASHBOARD_ENDPOINT);
}

/**
 * Fetch paginated intern records.
 *
 * Supported filters:
 * search/q, domain, duration, mode, status, page, limit.
 */
export async function getInterns(filters = {}) {
  const normalizedFilters = normalizeFilters(filters);

  return apiGet(buildEndpoint(INTERNS_ENDPOINT, normalizedFilters));
}

/**
 * Fetch one intern record and its email history.
 */
export async function getInternDetails(internId) {
  const normalizedId = String(internId ?? "").trim();

  if (!normalizedId) {
    throw new Error("An intern ID is required.");
  }

  return apiGet(`${INTERNS_ENDPOINT}/${encodeURIComponent(normalizedId)}`);
}

/**
 * Protect CSV values from spreadsheet formula injection.
 *
 * Values beginning with formula characters are prefixed with an apostrophe
 * before being exported.
 */
function normalizeCsvValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    value = value.join("; ");
  } else if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  let text = String(value);

  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return text;
}

function escapeCsvCell(value) {
  const text = normalizeCsvValue(value);

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function recordsToCsv(records) {
  const header = CSV_COLUMNS.map((column) => escapeCsvCell(column.label)).join(
    ",",
  );

  const rows = records.map((record) =>
    CSV_COLUMNS.map((column) => escapeCsvCell(record?.[column.key])).join(","),
  );

  // UTF-8 BOM helps spreadsheet applications recognize UTF-8 correctly.
  return `\uFEFF${[header, ...rows].join("\r\n")}\r\n`;
}

/**
 * Export filtered intern records as a real CSV file.
 *
 * The current backend returns JSON from /api/interns/export, so this service
 * converts its records into CSV in the browser.
 *
 * Returns { blob, filename }, matching InternsDashboard.jsx.
 */
export async function exportInterns(filters = {}) {
  const normalizedFilters = normalizeFilters(filters, {
    includePagination: false,
  });

  const response = await apiGet(
    buildEndpoint(EXPORT_ENDPOINT, normalizedFilters),
  );

  const records = Array.isArray(response?.records)
    ? response.records
    : Array.isArray(response?.data?.records)
      ? response.data.records
      : [];

  if (response?.ok === false) {
    throw new Error(
      response?.message || "The server could not export intern records.",
    );
  }

  const csv = recordsToCsv(records);

  return {
    blob: new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    }),
    filename: "veloop-interns.csv",
  };
}

export default {
  getDashboardStats,
  getInterns,
  getInternDetails,
  exportInterns,
};
