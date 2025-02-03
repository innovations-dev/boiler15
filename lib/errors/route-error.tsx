"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { errorLogger, ErrorSource } from "../logger/enhanced-logger";

/**
 * Props for the RouteError component
 * @interface RouteErrorProps
 */
interface RouteErrorProps {
  /** The error object to display and log */
  error: Error & { digest?: string };
  /** Callback function to reset/retry the action that caused the error */
  resetAction: () => void;
  /** Custom title for the error message (defaults to "Something went wrong!") */
  title?: string;
  /** Custom description for the error message (defaults to "An error occurred. Please try again.") */
  description?: string;
  /** Visual variant of the error component
   * - 'default': Shows as an alert banner
   * - 'card': Displays as a card with shadow
   * - 'full': Full-screen centered error message
   */
  variant?: "default" | "card" | "full";
}

/**
 * A flexible error boundary component for displaying route errors with different visual styles.
 * Automatically logs errors to the enhanced logger system.
 *
 * @component
 * @example
 * // Basic usage in error.tsx (Next.js error boundary)
 * export default function ErrorBoundary({
 *   error,
 *   reset,
 * }: {
 *   error: Error & { digest?: string };
 *   reset: () => void;
 * }) {
 *   return <RouteError error={error} resetAction={reset} />;
 * }
 *
 * @example
 * // Custom error message with card variant
 * <RouteError
 *   error={error}
 *   resetAction={handleReset}
 *   title="Payment Failed"
 *   description="Unable to process your payment. Please try again."
 *   variant="card"
 * />
 *
 * @example
 * // Full-screen error message
 * <RouteError
 *   error={error}
 *   resetAction={handleReset}
 *   variant="full"
 * />
 */
export function RouteError({
  error,
  resetAction,
  title = "Something went wrong!",
  description = "An error occurred. Please try again.",
  variant = "default",
}: RouteErrorProps) {
  useEffect(() => {
    errorLogger.log(error, ErrorSource.ROUTE, {
      path: window.location.pathname,
    });
  }, [error]);

  if (variant === "full") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            {error.message || description}
          </p>
          <Button onClick={() => resetAction()}>Try again</Button>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">
            {error.message || description}
          </p>
          <Button onClick={() => resetAction()}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center gap-x-2">
        {error.message || description}
        <Button variant="outline" size="sm" onClick={() => resetAction()}>
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
