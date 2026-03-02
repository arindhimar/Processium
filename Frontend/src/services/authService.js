// ============================================================
//  authService.js  –  Processium Auth API Integration
//  Base URL is read from VITE_API_BASE_URL env var.
//  Falls back to http://localhost:8000 for local dev.
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// ── Token helpers ────────────────────────────────────────────

const TOKEN_KEY   = "access_token";
const REFRESH_KEY = "refresh_token";

export const tokenStorage = {
  getAccess:      ()      => localStorage.getItem(TOKEN_KEY),
  getRefresh:     ()      => localStorage.getItem(REFRESH_KEY),
  setTokens:      (access, refresh) => {
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clearTokens:    ()      => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Internal fetch wrapper ───────────────────────────────────

/**
 * Thin wrapper around fetch that:
 *   - Prepends BASE_URL
 *   - Sets Content-Type: application/json
 *   - Optionally injects the Authorization header
 *   - Throws a structured error on non-2xx responses
 */
async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = tokenStorage.getAccess();
    if (!token) throw new AuthError("No access token found. Please log in.", 401);
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new AuthError(message, response.status, data);
  }

  return data;
}

// ── Custom error class ───────────────────────────────────────

export class AuthError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name    = "AuthError";
    this.status  = status;
    this.data    = data;
  }
}

// ── Auth API methods ─────────────────────────────────────────

/**
 * POST /api/auth/register
 * @param {{ full_name: string, email: string, password: string, is_admin?: boolean }} params
 * @returns {{ message: string, user: User }}
 */
export async function register({ full_name, email, password, is_admin = false }) {
  return request("/api/auth/register", {
    method: "POST",
    body: { full_name, email, password, is_admin },
  });
}

/**
 * POST /api/auth/login
 * Stores tokens automatically on success.
 * @param {{ email: string, password: string }} params
 * @returns {{ access_token: string, refresh_token: string, expires_in: number, user: User }}
 */
export async function login({ email, password }) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  tokenStorage.setTokens(data.access_token, data.refresh_token);
  return data;
}

/**
 * POST /api/auth/refresh
 * Exchanges a refresh token for a new access token and stores it.
 * @param {string} [refreshToken]  Defaults to the stored refresh token.
 * @returns {{ access_token: string, expires_in: number }}
 */
export async function refreshToken(refreshToken) {
  const token = refreshToken ?? tokenStorage.getRefresh();
  if (!token) throw new AuthError("No refresh token available.", 401);

  const data = await request("/api/auth/refresh", {
    method: "POST",
    body: { refresh_token: token },
  });

  // Update stored access token (keep existing refresh token)
  tokenStorage.setTokens(data.access_token, null);
  return data;
}

/**
 * POST /api/auth/logout
 * Sends the refresh token to invalidate the session, then clears local tokens.
 * @param {string} [refreshToken]  Defaults to the stored refresh token.
 * @returns {{ message: string }}
 */
export async function logout(refreshToken) {
  const token = refreshToken ?? tokenStorage.getRefresh();

  try {
    if (token) {
      await request("/api/auth/logout", {
        method: "POST",
        body: { refresh_token: token },
      });
    }
  } finally {
    // Always clear local tokens, even if the server call fails
    tokenStorage.clearTokens();
  }

  return { message: "Logged out successfully." };
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Automatically attempts a token refresh on 401 and retries once.
 * @returns {User}
 */
export async function getMe() {
  try {
    return await request("/api/auth/me", { auth: true });
  } catch (err) {
    if (err.status === 401) {
      // Try to refresh and retry once
      await refreshToken();
      return request("/api/auth/me", { auth: true });
    }
    throw err;
  }
}

// ── Convenience helpers ──────────────────────────────────────

/** Returns true if an access token is currently stored. */
export function isAuthenticated() {
  return Boolean(tokenStorage.getAccess());
}

// ── JSDoc types ──────────────────────────────────────────────

/**
 * @typedef {{ id: string|number, full_name: string, email: string, is_active: boolean, created_at: string }} User
 */