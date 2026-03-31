"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LogIn, Eye, EyeOff, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (isAuthenticated) {
    router.replace("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small delay to feel more realistic
    await new Promise((r) => setTimeout(r, 400));

    const result = login(username, password);
    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20 mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Sign in to access the Owner Directory
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/40 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 transition-colors placeholder:text-slate-400"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 transition-colors pr-12 placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-semibold text-base shadow-md shadow-blue-600/20 gap-2 transition-transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm font-semibold text-slate-700 mb-3 text-center">
            Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setUsername("admin");
                setPassword("admin123");
                setError("");
              }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors text-left group"
            >
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Admin</p>
                <p className="text-xs text-blue-600">admin / admin123</p>
              </div>
            </button>
            <button
              onClick={() => {
                setUsername("user");
                setPassword("user123");
                setError("");
              }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left group"
            >
              <div className="bg-slate-600 p-1.5 rounded-lg shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">User</p>
                <p className="text-xs text-slate-600">user / user123</p>
              </div>
            </button>
          </div>
          <div className="mt-3 text-xs text-slate-500 text-center space-y-0.5">
            <p><strong>Admin</strong> — Full access: view, add, edit, and delete</p>
            <p><strong>User</strong> — Read-only: view directory only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
