import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";
import { generateMetadata } from "@/config/meta.config";
import { cn } from "@/lib/utils";
import { SiteHeader } from "./_components/layout/header";
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
          "relative min-h-screen antialiased"
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
              <SiteHeader />
              <main className="relative w-full">{children}</main>
              <div className="absolute bottom-4 right-4">
                <ThemeToggle />
              </div>
            </ThemeProvider>
          </QueryProvider>
        </NuqsAdapter>
        <Toaster richColors />
      </body>
    </html>
  );
}
