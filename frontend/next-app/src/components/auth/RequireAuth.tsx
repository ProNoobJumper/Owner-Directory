"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/auth";

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackMessage?: string;
}

export function RequireAuth({ children, requiredRole, fallbackMessage }: RequireAuthProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100">
          <div className="bg-red-100 text-red-600 p-3 rounded-2xl inline-flex mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Access Denied</h2>
          <p className="text-slate-500 mb-8">
            {fallbackMessage || "You don't have permission to access this page. Admin privileges are required."}
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-md shadow-blue-600/20 hover:-translate-y-0.5 transition-transform"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
