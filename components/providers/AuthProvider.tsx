"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createDemoSession, type AuthSession } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

const STORAGE_KEY = "rentdirect_auth_session";

interface AuthContextValue {
  session: AuthSession | null;
  loaded: boolean;
  signInAs: (role: UserRole) => AuthSession;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSession(JSON.parse(saved) as AuthSession);
    } catch {
      setSession(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, [session, loaded]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    loaded,
    signInAs: (role) => {
      const nextSession = createDemoSession(role);
      setSession(nextSession);
      return nextSession;
    },
    signOut: () => setSession(null),
  }), [session, loaded]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
