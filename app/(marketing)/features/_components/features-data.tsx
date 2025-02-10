import {
  Blocks,
  Database,
  Gauge,
  Globe2,
  Lock,
  Palette,
  Search,
  Shield,
  Zap,
} from "lucide-react";

export const features = [
  {
    title: "Type-Safe Development",
    description:
      "End-to-end type safety with TypeScript, Zod, and Drizzle ORM for robust applications.",
    icon: Blocks,
  },
  {
    title: "Performance Optimized",
    description:
      "Built-in performance optimization with React Server Components and automatic code splitting.",
    icon: Gauge,
  },
  {
    title: "Modern Authentication",
    description:
      "Secure authentication with Better-Auth, supporting multiple providers and session management.",
    icon: Lock,
  },
  {
    title: "Edge-Ready Database",
    description:
      "Lightning-fast database operations with Turso and Drizzle ORM at the edge.",
    icon: Database,
  },
  {
    title: "Beautiful UI Components",
    description:
      "Pre-built accessible components using Shadcn UI, Radix, and Tailwind CSS.",
    icon: Palette,
  },
  {
    title: "Internationalization",
    description:
      "Built-in i18n support with type-safe translations using i18next.",
    icon: Globe2,
  },
  {
    title: "Data Management",
    description:
      "Efficient data fetching and caching with Tanstack React Query.",
    icon: Zap,
  },
  {
    title: "SEO Optimized",
    description:
      "Built-in SEO optimization with Next.js metadata API and dynamic OG images.",
    icon: Search,
  },
  {
    title: "Security First",
    description:
      "Security best practices with CSRF protection, input validation, and secure headers.",
    icon: Shield,
  },
];
