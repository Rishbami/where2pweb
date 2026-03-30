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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    const unsubscribe = subscribeToAuth((nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [isConfigured]);

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
