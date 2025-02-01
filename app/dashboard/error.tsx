"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log to your error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Dashboard Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {error.message || "An error occurred while loading the dashboard"}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Overview
        </Button>
      </CardFooter>
    </Card>
  );
}
