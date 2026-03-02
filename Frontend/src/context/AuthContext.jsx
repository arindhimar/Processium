// ============================================================
//  AuthContext.jsx  –  Processium Auth State Management
//  Wraps authService and exposes auth state + actions to the
//  entire React tree via Context + useReducer.
// ============================================================

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import {
  login     as apiLogin,
  logout    as apiLogout,
  register  as apiRegister,
  getMe,
  refreshToken,
  isAuthenticated,
} from "../services/authService";

// ── State shape ──────────────────────────────────────────────
//  { user: User|null, loading: boolean, error: string|null, initialized: boolean }

const initialState = {
  user:        null,
  loading:     false,
  error:       null,
  initialized: false,   // true once the initial /me check completes
};

// ── Reducer ──────────────────────────────────────────────────

function authReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return { ...state, loading: false, error: null, user: action.payload, initialized: true };
    case "ERROR":
      return { ...state, loading: false, error: action.payload, initialized: true };
    case "LOGOUT":
      return { ...initialState, initialized: true };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────

const AuthContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount: restore session if a token exists
  useEffect(() => {
    async function restoreSession() {
      if (!isAuthenticated()) {
        dispatch({ type: "LOGOUT" });   // marks initialized without a user
        return;
      }
      dispatch({ type: "LOADING" });
      try {
        const user = await getMe();     // will auto-refresh on 401
        dispatch({ type: "SUCCESS", payload: user });
      } catch {
        // Token invalid/expired and refresh failed — clear state
        dispatch({ type: "LOGOUT" });
      }
    }
    restoreSession();
  }, []);

  // ── Actions ──────────────────────────────────────────────

  const login = useCallback(async ({ email, password }) => {
    dispatch({ type: "LOADING" });
    try {
      const data = await apiLogin({ email, password });
      dispatch({ type: "SUCCESS", payload: data.user });
      return data;
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      throw err;
    }
  }, []);

  const register = useCallback(async ({ full_name, email, password, is_admin = false }) => {
    dispatch({ type: "LOADING" });
    try {
      const data = await apiRegister({ full_name, email, password, is_admin });
      // Auto-login after registration: fetch user via /me (tokens not returned by register)
      // If your backend returns tokens on register, swap the line below for apiLogin logic.
      dispatch({ type: "SUCCESS", payload: data.user });
      return data;
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      await refreshToken();
      const user = await getMe();
      dispatch({ type: "SUCCESS", payload: user });
    } catch (err) {
      dispatch({ type: "LOGOUT" });
      throw err;
    }
  }, []);

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  // ── Context value ─────────────────────────────────────────

  const value = {
    // State
    user:           state.user,
    loading:        state.loading,
    error:          state.error,
    initialized:    state.initialized,
    isAuthenticated: Boolean(state.user),

    // Actions
    login,
    logout,
    register,
    refresh,
    clearError,
  };

  // Don't render children until the session check is done
  // (prevents a flash of unauthenticated UI)
  if (!state.initialized) {
    return null; // or replace with a <Spinner /> component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ─────────────────────────────────────────────────────

/**
 * useAuth()
 * Must be used inside <AuthProvider>.
 *
 * @example
 * const { user, login, logout, loading, error } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}

export default AuthContext;