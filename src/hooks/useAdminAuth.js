import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "veloop_admin_token";

function normalizeApiBaseUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

function getStoredToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function saveToken(token) {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    throw new Error("Unable to save the admin session in this browser.");
  }
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result?.message || `Request failed with status ${response.status}.`,
    );
  }

  return result;
}

export function getAdminToken() {
  return getStoredToken();
}

export function getAdminHeaders(extraHeaders = {}) {
  const token = getStoredToken();

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function clearAdminSession() {
  saveToken("");
}

export function useAdminAuth() {
  const [token, setToken] = useState(() => getStoredToken());
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Restore the local token. The protected dashboard endpoints
    // validate it when the dashboard loads.
    setToken(getStoredToken());
    setIsCheckingAuth(false);
  }, []);

  const login = useCallback(async (password) => {
    setAuthError("");

    const cleanPassword = String(password || "");

    if (!cleanPassword.trim()) {
      const message = "Enter the admin password.";
      setAuthError(message);
      throw new Error(message);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: cleanPassword,
        }),
      });

      const result = await readResponse(response);
      const newToken = result?.token;

      if (!newToken || typeof newToken !== "string") {
        throw new Error("The server did not return an admin session token.");
      }

      saveToken(newToken);
      setToken(newToken);
      setAuthError("");

      return true;
    } catch (error) {
      const message = error?.message || "Admin login failed. Please try again.";

      setAuthError(message);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const currentToken = getStoredToken();

    try {
      if (currentToken) {
        await fetch(`${API_BASE_URL}/api/admin/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
      }
    } catch {
      // Local logout must still work if the server is unreachable.
    } finally {
      try {
        clearAdminSession();
      } catch {
        // Continue resetting React state if browser storage is unavailable.
      }

      setToken("");
      setAuthError("");
    }
  }, []);

  const handleUnauthorized = useCallback(() => {
    try {
      clearAdminSession();
    } catch {
      // Reset in-memory authentication even if storage cannot be cleared.
    }

    setToken("");
    setAuthError("Your admin session has expired. Please log in again.");
  }, []);

  return {
    token,
    isAuthenticated: Boolean(token),
    isCheckingAuth,
    authError,
    login,
    logout,
    handleUnauthorized,
  };
}

export default useAdminAuth;
