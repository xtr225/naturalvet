import { useCallback, useEffect, useMemo, useState } from "react";
import { AUTH_STORAGE_KEY, authApi } from "../api/api";
import { AuthContext } from "./AuthContextStore";

function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY));
  } catch {
    return null;
  }
}

function persistSession(session) {
  if (session) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const storedSession = getStoredSession();

      if (!storedSession?.token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        await authApi.me();
        setSession(storedSession);
      } catch {
        persistSession(null);
        setSession(null);
      } finally {
        setIsBootstrapping(false);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);

    try {
      const nextSession = await authApi.login(credentials);
      persistSession(nextSession);
      setSession(nextSession);

      return nextSession;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authApi.logout();
      persistSession(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const nextSession = await authApi.refresh();
    persistSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const hasRole = useCallback(
    (role) => {
      if (!role) {
        return true;
      }

      return session?.user?.roles?.includes(role) ?? false;
    },
    [session]
  );

  const hasPermission = useCallback(
    (permission) => {
      if (!permission) {
        return true;
      }

      return session?.user?.permissions?.includes(permission) ?? false;
    },
    [session]
  );

  const value = useMemo(
    () => ({
      expiresAt: session?.expiresAt ?? null,
      hasPermission,
      hasRole,
      isAuthenticated: Boolean(session?.token),
      isBootstrapping,
      isLoading,
      login,
      logout,
      refreshSession,
      token: session?.token ?? null,
      user: session?.user ?? null,
    }),
    [
      hasPermission,
      hasRole,
      isBootstrapping,
      isLoading,
      login,
      logout,
      refreshSession,
      session,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
