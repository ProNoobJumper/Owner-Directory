"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LayoutDashboard, Home, LogIn, LogOut, ShieldCheck, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const isAdminPage = pathname?.startsWith("/admin");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="bg-blue-600 p-2 rounded-xl shadow-inner">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Owner Directory
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant={!isAdminPage && pathname !== "/login" ? "default" : "ghost"}
                size="sm"
                className={`gap-2 rounded-full px-5 transition-all ${!isAdminPage && pathname !== "/login" ? "shadow-md shadow-blue-600/20" : "text-slate-600 hover:text-slate-900"}`}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Directory</span>
              </Button>
            </Link>

            {isAuthenticated && (
              <Link href="/admin">
                <Button
                  variant={isAdminPage ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 rounded-full px-5 transition-all ${isAdminPage ? "shadow-md shadow-blue-600/20" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Admin</span>
                </Button>
              </Link>
            )}

            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-2 ml-1">
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-sm">
                      {isAdmin ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-slate-500" />
                      )}
                      <span className="font-semibold text-slate-700">{user?.displayName}</span>
                      <span className="text-slate-400 text-xs">({user?.role})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="gap-2 rounded-full px-4 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">Logout</span>
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button
                      variant={pathname === "/login" ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 rounded-full px-5 transition-all ${pathname === "/login" ? "shadow-md shadow-blue-600/20" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline font-medium">Login</span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
