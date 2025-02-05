import { BetterAuthOptions } from "better-auth";
import { APIError as BetterAuthAPIError } from "better-auth/api";

import { EnhancedBetterAuthAPIError } from "../auth/auth-client";
import { errorLogger, ErrorSeverity } from "../logger/enhanced-logger";
import { ErrorSource } from "../logger/types";

export const serverOnError = async (error: BetterAuthAPIError) => {
  if (error instanceof BetterAuthAPIError) {
    const betterAuthError = error as EnhancedBetterAuthAPIError;
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
        console.error("Your session has expired. Please sign in again.");
        return;
      case "INVALID_CREDENTIALS":
        console.error("Invalid email or password.");
        return;
      case "EMAIL_NOT_VERIFIED":
        console.error("Please verify your email address.");
        return;
      case "ACCOUNT_LOCKED":
        console.error("Your account has been locked. Please contact support.");
        return;
      default:
        // Handle other BetterAuth errors
        console.error(betterAuthError.message);
        return;
    }
  }
};
