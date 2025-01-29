import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { generateMetadata } from "@/config/meta.config";
import { ThemeProvider } from "./_providers/theme-provider";
import { ThemeToggle } from "./_components/theme-toggle";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative w-full">{children}</main>
          <div
            className="absolute bottom-4 right-4 border-2 border-red-500 p-1 bg-background rounded-lg shadow-lg"
            style={{
              transform: "translateX(0)",
              right: "16px",
              left: "auto",
            }}
          >
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
