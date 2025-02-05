import { type Metadata } from "next";

import { FeatureCard } from "./_components/feature-card";
import { features } from "./_components/features-data";

export const metadata: Metadata = {
  title: "Features | Modern Next.js Boilerplate",
  description:
    "Explore the powerful features and capabilities of our Modern Next.js Boilerplate",
};

export default function FeaturesPage() {
  return (
    <div className="container mx-auto mt-[var(--header-height)] max-w-7xl px-4 py-16">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Powerful Features for Modern Web Development
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Everything you need to build production-ready applications with
            Next.js 15
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}
