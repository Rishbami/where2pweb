"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hasRequiredFirebaseEnv } from "@/lib/firebase/client";
import {
  loginWithEmail,
  logout,
  registerWithEmail,
  subscribeToAuth,
  waitForInitialAuthState,
} from "@/lib/firebase/auth";
import type { User } from "firebase/auth";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isConfigured = hasRequiredFirebaseEnv();
  const [authState, setAuthState] = useState<User | null | undefined>(
    isConfigured ? undefined : null,
  );

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    let isCancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (!isCancelled) {
        // If Firebase auth bootstrap stalls, fail open to the signed-out state.
        setAuthState(null);
      }
    }, 4000);

    void waitForInitialAuthState()
      .then(() => {
        if (!isCancelled) {
          window.clearTimeout(timeoutId);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          window.clearTimeout(timeoutId);
          setAuthState(null);
        }
      });

    const unsubscribe = subscribeToAuth((nextUser) => {
      window.clearTimeout(timeoutId);
      setAuthState(nextUser);
    });

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [isConfigured]);

  const user = isConfigured ? (authState ?? null) : null;
  const isLoading = isConfigured && authState === undefined;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isConfigured,
      async login(email, password) {
        await loginWithEmail(email, password);
      },
      async register(email, password) {
        await registerWithEmail(email, password);
      },
      async signOutUser() {
        await logout();
      },
    }),
    [isConfigured, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
