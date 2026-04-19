"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { AuthUser, authenticate, getStoredUser, storeUser, clearUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const stored = getStoredUser();
    setLocalUser(stored);
    setLoading(false);
  }, []);

  // Derive effective user: OAuth session takes precedence when no local user
  const oauthUser: AuthUser | null =
    session?.user && !localUser
      ? {
          username: session.user.email ?? "google-user",
          role: "user",
          displayName: session.user.name ?? session.user.email ?? "Google User",
        }
      : null;

  const user = localUser ?? oauthUser;

  const login = useCallback((username: string, password: string) => {
    const result = authenticate(username, password);
    if (!result) {
      return { success: false, error: "Invalid username or password" };
    }
    storeUser(result);
    setLocalUser(result);
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await nextAuthSignIn("google", { callbackUrl: "/admin" });
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setLocalUser(null);
    if (session) {
      nextAuthSignOut({ callbackUrl: "/login" });
    }
  }, [session]);

  const sessionLoading = status === "loading";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || sessionLoading,
        login,
        loginWithGoogle,
        logout,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
