export const INDIA_TIME_ZONE = "Asia/Kolkata";

/**
 * Returns the current date in YYYY-MM-DD format using India time.
 * Suitable for HTML date inputs and the offer issue date.
 */
export function todayISTISO(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

/**
 * Formats an HTML date-input value (YYYY-MM-DD) as a readable
 * date in the Indian format, for example: 14 October 2026.
 *
 * Parsing the date components separately prevents timezone-related
 * date shifts that can occur with new Date("YYYY-MM-DD").
 */
export function formatDateInput(value) {
  if (!value) return "";

  const match = String(value)
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) return "";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  // Reject impossible calendar dates such as 2026-02-31.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: INDIA_TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Formats a timestamp for dashboard and email-history displays.
 * Invalid or missing timestamps return an em dash.
 */
export function formatDateTimeIST(value) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: INDIA_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Validates a YYYY-MM-DD date-input value.
 */
export function isValidDateInput(value) {
  if (!value) return false;

  const match = String(value)
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
