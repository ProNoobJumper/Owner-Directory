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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-violet-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-md">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
              Owner Directory
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant={!isAdminPage && pathname !== "/login" ? "default" : "ghost"}
                size="sm"
                className={`gap-2 rounded-full px-5 transition-all ${!isAdminPage && pathname !== "/login" ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-500/30 text-white hover:from-violet-700 hover:to-indigo-700" : "text-slate-600 hover:text-violet-700 hover:bg-violet-50"}`}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Main Menu</span>
              </Button>
            </Link>

            {isAuthenticated && (
              <Link href="/admin">
                <Button
                  variant={isAdminPage ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 rounded-full px-5 transition-all ${isAdminPage ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-500/30 text-white hover:from-violet-700 hover:to-indigo-700" : "text-slate-600 hover:text-violet-700 hover:bg-violet-50"}`}
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
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-sm border border-violet-100">
                      {isAdmin ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-violet-400" />
                      )}
                      <span className="font-semibold text-violet-700">{user?.displayName}</span>
                      <span className="text-violet-400 text-xs">({user?.role})</span>
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
                      className={`gap-2 rounded-full px-5 transition-all ${pathname === "/login" ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-500/30 text-white hover:from-violet-700 hover:to-indigo-700" : "text-slate-600 hover:text-violet-700 hover:bg-violet-50"}`}
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
