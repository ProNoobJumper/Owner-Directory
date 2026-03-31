"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { AuthUser, authenticate, getStoredUser, storeUser, clearUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback((username: string, password: string) => {
    const result = authenticate(username, password);
    if (!result) {
      return { success: false, error: "Invalid username or password" };
    }
    storeUser(result);
    setUser(result);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
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
