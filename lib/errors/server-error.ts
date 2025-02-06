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
        path: typeof window !== "undefined" ? window.location.pathname : "",
      },
    };

    await errorLogger.log(betterAuthError, ErrorSource.AUTH, metadata);

    // Add specific handling for state mismatch
    if (betterAuthError.message.includes("State Mismatch")) {
      console.error("Authentication state mismatch:", {
        error: "Verification token expired or invalid",
        code: "STATE_MISMATCH",
        timestamp: new Date().toISOString(),
      });
      throw new BetterAuthAPIError("BAD_REQUEST", {
        message:
          "Verification link has expired or is invalid. Please request a new one.",
        statusCode: 400,
      });
    }

    // Handle other specific BetterAuth error codes
    switch (betterAuthError.code) {
      case "SESSION_EXPIRED":
        console.error("Session expired");
        return;
      case "INVALID_CREDENTIALS":
        console.error("Invalid credentials");
        return;
      case "EMAIL_NOT_VERIFIED":
        console.error("Email not verified");
        return;
      case "ACCOUNT_LOCKED":
        console.error("Your account has been locked. Please contact support.");
        return;
      default:
        console.error(betterAuthError.message);
        return;
    }
  }
};
