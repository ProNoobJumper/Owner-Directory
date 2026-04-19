import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Owner Directory",
    default: "Owner Directory — Discover Exceptional Indian Professionals",
  },
  description:
    "Connect with verified businesses and exceptional proprietors across India.",
};

export const viewport: Viewport = {
  themeColor: "#fafaf7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <SessionProviderWrapper>
          <AuthProvider>
            <Header />
            <main className="flex-grow w-full">
              {children}
            </main>
            <footer className="border-t border-[var(--border)] bg-[var(--card)]">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col md:flex-row items-start justify-between gap-6">
                <div>
                  <p className="font-display text-lg font-bold text-[var(--foreground)]">BGS</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-xs leading-relaxed">
                    India&apos;s trusted directory of verified businesses and exceptional proprietors.
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
                  <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms of Service</a>
                  <span>© {new Date().getFullYear()} BGS</span>
                </div>
              </div>
            </footer>
            <Toaster />
          </AuthProvider>
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
