"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(username, password);
    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    height: "3rem",
    padding: "0 1rem",
    background: "var(--secondary)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
    fontFamily: "var(--font-sans)",
    fontSize: "0.9375rem",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="w-full max-w-sm">
        {/* Masthead-style header */}
        <div className="mb-10">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--primary)" }}
          >
            Owner Directory
          </p>
          <h1
            className="font-display font-black leading-none mb-2"
            style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", color: "var(--foreground)", letterSpacing: "-0.03em" }}
          >
            Sign In
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Access the directory management panel
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "var(--border)", marginBottom: "2rem" }} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={fieldStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...fieldStyle, paddingRight: "3rem" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"; }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="text-sm px-4 py-3"
              style={{
                backgroundColor: "oklch(0.97 0.02 27)",
                color: "var(--destructive)",
                border: "1px solid oklch(0.88 0.06 27)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest transition-opacity disabled:opacity-60"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            {isLoading ? (
              <div
                className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--primary-foreground)", borderTopColor: "transparent" }}
              />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "2rem 0 1.5rem" }} />

        {/* Demo credentials */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--muted-foreground)" }}
          >
            Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setUsername("admin"); setPassword("admin123"); setError(""); }}
              className="flex items-center gap-2.5 p-3 text-left transition-colors"
              style={{
                backgroundColor: "var(--secondary)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Admin</p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>admin / admin123</p>
              </div>
            </button>
            <button
              onClick={() => { setUsername("user"); setPassword("user123"); setError(""); }}
              className="flex items-center gap-2.5 p-3 text-left transition-colors"
              style={{
                backgroundColor: "var(--secondary)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              <User className="h-4 w-4 shrink-0" style={{ color: "var(--muted-foreground)" }} />
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>User</p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>user / user123</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
