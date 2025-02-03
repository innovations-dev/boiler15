"use client";

import { useEffect } from "react";

import { RouteError } from "@/lib/errors/route-error";
import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";

export default function RootError({
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
    <RouteError
      error={error}
      resetAction={reset}
      variant="full"
      title="Application Error"
      description="An unexpected error occurred. Our team has been notified."
    />
  );
}
