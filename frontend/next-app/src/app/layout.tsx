import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Owner Directory",
    default: "Owner Directory - Discover Exceptional Local Professionals",
  },
  description:
    "Connect with verified businesses and exceptional proprietors in your community.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col`}
      >
        <AuthProvider>
        <Header />
        <main className="max-w-6xl mx-auto py-8 w-full flex-grow">
          {children}
        </main>
        <footer className="mt-auto border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
            <p>© {new Date().getFullYear()} BGS. All rights reserved.</p>
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
        <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
