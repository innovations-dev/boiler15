"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function OrganizationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading organizations</AlertTitle>
      <AlertDescription className="flex items-center gap-x-2">
        An error occurred. Please try again.
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
