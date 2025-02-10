import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: readonly string[];
  popular?: boolean;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  popular = false,
}: PricingCardProps) {
  return (
    <Card className={cn(popular && "border-primary")}>
      <CardHeader>
        {popular && (
          <div className="mb-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Popular
            </span>
          </div>
        )}
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Free" && (
            <span className="ml-1 text-muted-foreground">/mo</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ul className="grid gap-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={popular ? "default" : "outline"}>
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}
