import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { generateMetadata } from "@/config/meta.config";
import { ErrorHandler } from "@/lib/auth/errors";
import { cn } from "@/lib/utils";
import { SiteFooter } from "./_components/layout/footer";
import { ThemeToggle } from "./_components/theme-toggle";
import { QueryProvider } from "./_providers/query-client-provider";
import { ThemeProvider } from "./_providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = await generateMetadata({
  title: "Nextjs v15 Test App",
  description: "Testing Build for Boilerplate",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable}`,
          "min-h-dvh bg-background font-sans antialiased",
          "scroll-smooth"
        )}
      >
        <NuqsAdapter>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main className="relative flex min-h-dvh flex-col">
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4"
                >
                  Skip to main content
                </a>
                <div id="main-content" className="flex-1">
                  {children}
                </div>
                <div className="fixed bottom-4 right-4">
                  <ThemeToggle />
                </div>
                <SiteFooter />
              </main>
            </ThemeProvider>
          </QueryProvider>
        </NuqsAdapter>
        <Toaster richColors />
        <ErrorHandler />
      </body>
    </html>
  );
}
