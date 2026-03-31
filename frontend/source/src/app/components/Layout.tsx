import { Link, Outlet, useLocation } from "react-router";
import { Building2, LayoutDashboard, Home } from "lucide-react";
import { Button } from "./ui/button";

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
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
              <Link to="/">
                <Button
                  variant={!isAdmin ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 rounded-full px-5 transition-all ${!isAdmin ? "shadow-md shadow-blue-600/20" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">
                    Directory
                  </span>
                </Button>
              </Link>
              <Link to="/admin">
                <Button
                  variant={isAdmin ? "default" : "ghost"}
                  size="sm"
                  className={`gap-2 rounded-full px-5 transition-all ${isAdmin ? "shadow-md shadow-blue-600/20" : "text-slate-600 hover:text-slate-900"}`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Admin</span>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} Owner Directory. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
