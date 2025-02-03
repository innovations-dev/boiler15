"use client";

import { useEffect } from "react";

import { RouteError } from "@/lib/errors/route-error";
import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";

export default function DashboardError({
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
      variant="card"
      title="Dashboard Error"
      description="An error occurred while loading the dashboard"
    />
  );
}
