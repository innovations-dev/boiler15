/**
 * @fileoverview Client-side error handling for Better-Auth integration
 *
 * Better-Auth Error Codes:
 * - UNAUTHORIZED: Authentication required or token invalid
 * - FORBIDDEN: User lacks permissions for the action
 * - NOT_FOUND: Requested resource not found
 * - VALIDATION_ERROR: Invalid input data
 * - RATE_LIMIT: Too many requests
 * - INTERNAL_ERROR: Server-side error
 * - UNKNOWN_ERROR: Unspecified error
 * - FETCH_ERROR: Network or request error
 */

import { APIError as BetterAuthAPIError } from "better-auth/api";
import { toast } from "sonner";

import { EnhancedBetterAuthAPIError } from "../auth/auth-client";
import { errorLogger, ErrorSeverity } from "../logger/enhanced-logger";
import { ErrorSource } from "../logger/types";

type BetterAuthErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMIT"
  | "INTERNAL_ERROR"
  | "UNKNOWN_ERROR"
  | "FETCH_ERROR";

interface ErrorWithStatus extends Error {
  status?: number;
}

/**
 * Maps HTTP status codes to Better-Auth error codes
 */
function mapStatusToBetterAuthError(status?: number): BetterAuthErrorCode {
  switch (status) {
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 422:
      return "VALIDATION_ERROR";
    case 429:
      return "RATE_LIMIT";
    case 500:
      return "INTERNAL_ERROR";
    default:
      return "UNKNOWN_ERROR";
  }
}

/**
 * Handles client-side errors from Better-Auth and other sources
 * @param error - The error object containing the original error
 */
export const clientOnError = async (error: { error: ErrorWithStatus }) => {
  // Handle BetterAuthAPIError specifically
  if (error.error instanceof BetterAuthAPIError) {
    const betterAuthError = error.error as EnhancedBetterAuthAPIError;
    const metadata = {
      code: betterAuthError.code as BetterAuthErrorCode,
      severity:
        betterAuthError.statusCode >= 500
          ? ErrorSeverity.ERROR
          : ErrorSeverity.WARNING,
      details: {
        status: betterAuthError.statusCode,
        message:
          typeof betterAuthError.message === "object"
            ? JSON.stringify(betterAuthError.message)
            : betterAuthError.message,
        code: betterAuthError.code,
        path: window.location.pathname,
      },
    };

    await errorLogger.log(betterAuthError, ErrorSource.AUTH, metadata);

    // Handle verification-specific errors
    if (
      (typeof betterAuthError.message === "string" &&
        betterAuthError.message.includes("State Mismatch")) ||
      betterAuthError.code === "VALIDATION_ERROR"
    ) {
      toast.error(
        "Verification link has expired or is invalid. Please request a new one."
      );
      return;
    }

    // Handle specific BetterAuth error codes
    switch (betterAuthError.code) {
      case "UNAUTHORIZED":
        toast.error("Your session has expired. Please sign in again.");
        return;
      case "VALIDATION_ERROR":
        toast.error("Invalid credentials provided.");
        return;
      case "FORBIDDEN":
        toast.error("You don't have permission to perform this action.");
        return;
      case "RATE_LIMIT":
        toast.error("Too many attempts. Please try again later.");
        return;
      default:
        // Handle other BetterAuth errors
        toast.error(
          typeof betterAuthError.message === "object"
            ? "An unexpected error occurred"
            : betterAuthError.message
        );
        return;
    }
  }

  // Handle regular errors
  const betterAuthCode = mapStatusToBetterAuthError(error.error?.status);
  const metadata = {
    code: betterAuthCode,
    severity:
      error.error?.status && error.error?.status >= 500
        ? ErrorSeverity.ERROR
        : ErrorSeverity.WARNING,
    details: {
      status: error.error?.status,
      message:
        typeof error.error.message === "object"
          ? JSON.stringify(error.error.message)
          : error.error.message,
      path: window.location.pathname,
    },
  };

  await errorLogger.log(error.error, ErrorSource.AUTH, metadata);

  // Show user-friendly toast messages based on Better-Auth error codes
  switch (betterAuthCode) {
    case "RATE_LIMIT":
      toast.error("Too many requests. Please try again later.");
      return;
    case "UNAUTHORIZED":
      toast.error("Session expired. Please sign in again.");
      return;
    case "INTERNAL_ERROR":
      toast.error("An unexpected error occurred. Please try again later.");
      return;
    default:
      // For other errors, show a generic message
      toast.error("An error occurred. Please try again.");
      return;
  }
};
