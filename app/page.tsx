import Link from "next/link";
import {
  ArrowRight,
  Box,
  Database,
  FileText,
  RotateCcw,
  Search,
  Zap,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Add metadata export for better SEO
export const metadata = {
  title: "Next.js 15 Boilerplate for Modern Web Apps",
  description:
    "Production-ready template with everything you need to build fast, modern, and scalable web applications.",
};

export default function Page() {
  return (
    <main className="my-24">
      <section className="container mx-auto px-4 pb-16 pt-20 text-center">
        <h1 className="mx-auto mb-6 max-w-[800px] text-4xl font-bold tracking-tight sm:text-6xl">
          Next.js 15 Boilerplate for Modern Web Apps
        </h1>
        <p className="mx-auto mb-8 max-w-[600px] text-lg text-gray-400">
          Production-ready template with everything you need to build fast,
          modern, and scalable web applications.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="https://github.com/innovations-dev/boiler15"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star project on GitHub"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            Star on GitHub
          </Link>
          <Link
            href="/docs"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2"
            )}
          >
            Documentation
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section
        className="container mx-auto max-w-6xl px-4 py-16"
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" className="sr-only">
          Features
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <Zap className="mb-4 h-10 w-10 text-white" />
            <h3 className="mb-2 text-xl font-semibold">
              Next.js 15 + TypeScript
            </h3>
            <p className="text-gray-400">
              Latest Next.js features with full type safety and App Router
            </p>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <Box className="mb-4 h-10 w-10 text-white" />
            <h3 className="mb-2 text-xl font-semibold">Authentication Ready</h3>
            <p className="text-gray-400">
              Multi-tenant auth with Better-Auth integration
            </p>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <Database className="mb-4 h-10 w-10 text-white" />
            <h3 className="mb-2 text-xl font-semibold">Database Setup</h3>
            <p className="text-gray-400">
              Drizzle ORM with Turso (SQLite) for scalable data management
            </p>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <FileText className="mb-4 h-10 w-10 text-white" />
            <h3 className="mb-2 text-xl font-semibold">Built-in MDX Support</h3>
            <p className="text-gray-400">
              Write documentation and blog posts using MDX with full TypeScript
              support
            </p>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <Search className="mb-4 h-10 w-10 text-white" />
            <h3 className="mb-2 text-xl font-semibold">SEO Optimization</h3>
            <p className="text-gray-400">
              Automated sitemap generation and type-safe metadata handling
            </p>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50 p-6">
            <RotateCcw className="mb-4 h-10 w-10 text-white" />
            <h3 className="mb-2 text-xl font-semibold">
              Type-Safe Development
            </h3>
            <p className="text-gray-400">
              End-to-end type safety with TypeScript and Zod validation
            </p>
          </Card>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section
        className="container mx-auto mt-20 max-w-5xl text-center"
        aria-labelledby="tech-stack-heading"
      >
        <h2 id="tech-stack-heading" className="text-3xl font-bold">
          Built With Modern Stack
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <TechItem title="Next.js 15" />
          <TechItem title="TypeScript" />
          <TechItem title="Tailwind CSS" />
          <TechItem title="Shadcn UI" />
          <TechItem title="React Query" />
          <TechItem title="Better-Auth" />
          <TechItem title="Drizzle ORM" />
          <TechItem title="Turso DB" />
          <TechItem title="MDX" />
          <TechItem title="React-Email" />
          <TechItem title="Resend" />
          <TechItem title="Nuqs" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 text-center" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="text-3xl font-bold">
          Ready to Get Started?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Clone the repository and start building your next project.
        </p>
        <div className="mt-8">
          <Link
            href="/docs/getting-started"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            Get Started
            <ArrowRight className="ml-2" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function TechItem({ title }: { title: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg border bg-muted p-4"
      role="listitem"
    >
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}
