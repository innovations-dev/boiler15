"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { errorLogger } from "@/lib/logger/enhanced-logger";
import { ErrorSource } from "@/lib/logger/types";

export default function TeamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    errorLogger.log(error, ErrorSource.ROUTE, {
      context: "TeamError",
    });
  }, [error]);

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading team members</AlertTitle>
      <AlertDescription className="flex items-center gap-x-2">
        An error occurred. Please try again.
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
