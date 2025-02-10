import { type Metadata } from "next";

import { PricingCard } from "./_components/pricing-card";
import { pricingPlans } from "./_components/pricing-data";

export const metadata: Metadata = {
  title: "Pricing | Modern Next.js Boilerplate",
  description: "Simple, transparent pricing plans for projects of any size",
};

export default function PricingPage() {
  return (
    <div className="container mx-auto mt-[var(--header-height)] max-w-7xl px-4 py-16">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the perfect plan for your project
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
