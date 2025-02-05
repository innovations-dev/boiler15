import { APIError as BetterAuthAPIError } from "better-auth/api";
import { toast } from "sonner";

import { EnhancedBetterAuthAPIError } from "../auth/auth-client";
import { errorLogger, ErrorSeverity } from "../logger/enhanced-logger";
import { ErrorSource } from "../logger/types";

interface ErrorWithStatus extends Error {
  status?: number;
}

export const clientOnError = async (error: { error: ErrorWithStatus }) => {
  // Handle BetterAuthAPIError specifically
  if (error.error instanceof BetterAuthAPIError) {
    const betterAuthError = error.error as EnhancedBetterAuthAPIError;
    const metadata = {
      code: betterAuthError.code,
      severity:
        betterAuthError.statusCode >= 500
          ? ErrorSeverity.ERROR
          : ErrorSeverity.WARNING,
      details: {
        status: betterAuthError.statusCode,
        message: betterAuthError.message,
        code: betterAuthError.code,
        path: window.location.pathname,
      },
    };

    await errorLogger.log(betterAuthError, ErrorSource.AUTH, metadata);

    // Handle specific BetterAuth error codes
    switch (betterAuthError.code) {
      case "SESSION_EXPIRED":
        toast.error("Your session has expired. Please sign in again.");
        return;
      case "INVALID_CREDENTIALS":
        toast.error("Invalid email or password.");
        return;
      case "EMAIL_NOT_VERIFIED":
        toast.error("Please verify your email address.");
        return;
      case "ACCOUNT_LOCKED":
        toast.error("Your account has been locked. Please contact support.");
        return;
      default:
        // Handle other BetterAuth errors
        toast.error(betterAuthError.message);
        return;
    }
  }

  // Handle regular errors
  const metadata = {
    code: error.error?.status === 429 ? "RATE_LIMIT_EXCEEDED" : "AUTH_ERROR",
    severity:
      error.error?.status && error.error?.status >= 500
        ? ErrorSeverity.ERROR
        : ErrorSeverity.WARNING,
    details: {
      status: error.error?.status,
      message: error.error.message,
      path: window.location.pathname,
    },
  };

  await errorLogger.log(error.error, ErrorSource.AUTH, metadata);

  // Show user-friendly toast messages
  if (error.error?.status === 429) {
    toast.error("Too many requests. Please try again later.");
    return;
  }

  if (error.error?.status === 401) {
    toast.error("Session expired. Please sign in again.");
    return;
  }

  if (error.error?.status === 500) {
    toast.error("An unexpected error occurred. Please try again later.");
    return;
  }

  // For other errors, throw to be handled by error boundaries
  throw new Error(error.error.message);
};
