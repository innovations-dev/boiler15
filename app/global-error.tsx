"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    errorLogger.log(error, ErrorSource.ROUTE, {
      path: window.location.pathname,
    });
  }, [error]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground">
          {error.message || "An error occurred. Please try again later."}
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
