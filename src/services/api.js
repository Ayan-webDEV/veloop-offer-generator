import { getAdminHeaders, clearAdminSession } from "../hooks/useAdminAuth.js";

function normalizeApiBaseUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function getRequestUrl(path) {
  const requestPath = String(path || "");

  if (/^https?:\/\//i.test(requestPath)) {
    return requestPath;
  }

  const normalizedPath = requestPath.startsWith("/")
    ? requestPath
    : `/${requestPath}`;

  return `${API_BASE_URL}${normalizedPath}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  const text = await response.text().catch(() => "");

  if (text && /(?:application\/[^;]+\+json|text\/json)/i.test(contentType)) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

function getErrorMessage(payload, status) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  }

  if (status === 401) {
    return "Your session is invalid or has expired. Please log in again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 404) {
    return "The requested resource was not found.";
  }

  if (status === 429) {
    return "Too many requests. Please wait and try again.";
  }

  if (status >= 500) {
    return "The server encountered an error. Please try again later.";
  }

  return `Request failed with status ${status}.`;
}

function handleUnauthorized(path, status) {
  if (status !== 401 && status !== 403) {
    return;
  }

  // A failed login attempt must not clear an existing admin session.
  if (String(path).includes("/api/admin/login")) {
    return;
  }

  let hadToken = false;

  try {
    hadToken = Boolean(window.localStorage.getItem("veloop_admin_token"));
  } catch {
    hadToken = false;
  }

  if (!hadToken) {
    return;
  }

  try {
    clearAdminSession();
  } catch {
    // Still notify the application if storage is unavailable.
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("veloop:admin-unauthorized", {
        detail: {
          message:
            "Your admin session has expired or is no longer authorized. Please log in again.",
        },
      }),
    );
  }
}

/**
 * General API request helper.
 *
 * Supports JSON requests, plain-text bodies, and FormData.
 * Adds the admin authorization header when a token exists.
 */
export async function apiRequest(path, options = {}) {
  const { headers: customHeaders = {}, body, ...requestOptions } = options;

  const headers = {
    ...getAdminHeaders(),
    ...customHeaders,
  };

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const contentTypeHeader =
    headers["Content-Type"] ?? headers["content-type"] ?? "";

  if (
    body !== undefined &&
    body !== null &&
    !isFormData &&
    typeof body !== "string" &&
    !contentTypeHeader
  ) {
    headers["Content-Type"] = "application/json";
  }

  let requestBody = body;

  if (
    body !== undefined &&
    body !== null &&
    !isFormData &&
    typeof body !== "string" &&
    String(headers["Content-Type"] ?? headers["content-type"] ?? "")
      .toLowerCase()
      .includes("application/json")
  ) {
    requestBody = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(getRequestUrl(path), {
      ...requestOptions,
      headers,
      body: requestBody,
    });
  } catch (error) {
    throw new ApiError(
      error?.message ||
        "Unable to connect to the server. Check your internet connection and API URL.",
    );
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    handleUnauthorized(path, response.status);

    throw new ApiError(
      getErrorMessage(payload, response.status),
      response.status,
      payload,
    );
  }

  return payload;
}

export function apiGet(path, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "GET",
  });
}

export function apiPost(path, body, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "POST",
    body,
  });
}

export function apiPatch(path, body, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "PATCH",
    body,
  });
}

export function apiDelete(path, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "DELETE",
  });
}

/**
 * Downloads a protected file, such as the interns CSV export.
 * Returns { blob, filename }.
 */
export async function apiDownload(path, options = {}) {
  let response;

  try {
    response = await fetch(getRequestUrl(path), {
      ...options,
      method: "GET",
      headers: {
        ...getAdminHeaders(),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new ApiError(error?.message || "Unable to connect to the server.");
  }

  if (!response.ok) {
    const payload = await parseResponse(response);

    handleUnauthorized(path, response.status);

    throw new ApiError(
      getErrorMessage(payload, response.status),
      response.status,
      payload,
    );
  }

  const disposition = response.headers.get("content-disposition") || "";

  const utf8FilenameMatch = disposition.match(/filename\*=UTF-8''([^;\n]+)/i);

  const standardFilenameMatch = disposition.match(/filename="?([^";\n]+)"?/i);

  let filename = "veloop-interns.csv";

  try {
    if (utf8FilenameMatch) {
      filename = decodeURIComponent(utf8FilenameMatch[1].trim());
    } else if (standardFilenameMatch) {
      filename = standardFilenameMatch[1].trim();
    }
  } catch {
    filename = standardFilenameMatch?.[1]?.trim() || filename;
  }

  return {
    blob: await response.blob(),
    filename,
  };
}

export default apiRequest;
