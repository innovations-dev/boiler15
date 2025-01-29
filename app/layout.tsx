import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { generateMetadata } from "@/config/meta.config";
import { ThemeProvider } from "./_providers/theme-provider";
import { ThemeToggle } from "./_components/theme-toggle";
import { QueryProvider } from "./_providers/query-client-provider";
import { cn } from "@/lib/utils";

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
          "antialiased min-h-screen relative",
        )}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="relative w-full">{children}</main>
            <div className="absolute bottom-4 right-4">
              <ThemeToggle />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
