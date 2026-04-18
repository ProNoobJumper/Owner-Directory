"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut, ShieldCheck, User, Sun, Moon, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdminPage = pathname?.startsWith("/admin");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: "var(--card)", borderBottom: "1px solid var(--border)" }}
    >
      {/* Top editorial bar */}
      <div
        className="h-0.5 w-full"
        style={{ backgroundColor: "var(--primary)" }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Main header row */}
        <div className="flex items-center justify-between h-16">
          {/* Masthead */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            style={{ textDecoration: "none" }}
          >
            <div className="flex flex-col leading-none">
              <span
                className="font-display font-black tracking-tight"
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  color: "var(--foreground)",
                  letterSpacing: "-0.04em",
                }}
              >
                BGS
              </span>
              <span
                className="uppercase tracking-[0.2em] font-sans"
                style={{ fontSize: "0.5rem", color: "var(--muted-foreground)", fontWeight: 600 }}
              >
                Owner Directory
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" active={!isAdminPage && pathname !== "/login"}>
              Main Menu
            </NavLink>

            {isAuthenticated && (
              <NavLink href="/admin" active={isAdminPage}>
                Admin
              </NavLink>
            )}

            {/* Divider */}
            <div
              className="w-px h-5 mx-2"
              style={{ backgroundColor: "var(--border)" }}
            />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded transition-colors"
              style={{ color: "var(--muted-foreground)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--secondary)";
                (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
              }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-2 ml-1">
                    <div
                      className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--secondary-foreground)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {isAdmin ? (
                        <ShieldCheck className="h-3 w-3" style={{ color: "var(--primary)" }} />
                      ) : (
                        <User className="h-3 w-3" style={{ color: "var(--muted-foreground)" }} />
                      )}
                      <span>{user?.displayName}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "var(--destructive)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
                      }}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ml-1"
                    style={{
                      backgroundColor: pathname === "/login" ? "var(--primary)" : "transparent",
                      color: pathname === "/login" ? "var(--primary-foreground)" : "var(--foreground)",
                      border: "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) => {
                      if (pathname !== "/login") {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--primary)";
                        (e.currentTarget as HTMLElement).style.color = "var(--primary-foreground)";
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pathname !== "/login") {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      }
                    }}
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center"
              style={{ color: "var(--muted-foreground)" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center"
              style={{ color: "var(--foreground)" }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            <MobileNavLink href="/" active={!isAdminPage && pathname !== "/login"} onClick={() => setMobileOpen(false)}>
              Main Menu
            </MobileNavLink>
            {isAuthenticated && (
              <MobileNavLink href="/admin" active={isAdminPage} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </MobileNavLink>
            )}
            {!loading && (
              isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-left transition-colors"
                  style={{ color: "var(--destructive)" }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <MobileNavLink href="/login" active={pathname === "/login"} onClick={() => setMobileOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  Login
                </MobileNavLink>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors"
      style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
      }}
    >
      {children}
      {active && (
        <span
          className="absolute bottom-0 left-3 right-3 h-0.5"
          style={{ backgroundColor: "var(--primary)" }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors"
      style={{
        color: active ? "var(--primary)" : "var(--foreground)",
        backgroundColor: active ? "var(--secondary)" : "transparent",
      }}
    >
      {children}
    </Link>
  );
}
