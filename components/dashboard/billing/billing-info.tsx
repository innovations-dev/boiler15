"use client";

import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BillingInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>You are currently on the free plan</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-background">
            <CreditCard className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Free Plan</p>
            <p className="text-sm text-muted-foreground">
              Basic features with limited usage
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => alert("Upgrade functionality coming soon!")}
        >
          Upgrade Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
