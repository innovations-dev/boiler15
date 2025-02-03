/**
 * @fileoverview Client-side authentication configuration and error handling using Better-Auth.
 * This module sets up the authentication client with proper error handling, logging, and user feedback.
 */

import { APIError as BetterAuthAPIError } from "better-auth/api";
import {
  adminClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { errorLogger } from "../logger/enhanced-logger";
import { ErrorSeverity, ErrorSource } from "../logger/types";
import { baseURL } from "../utils";

/**
 * Extended interface for Better-Auth API errors with additional properties
 * @interface EnhancedBetterAuthAPIError
 * @extends {BetterAuthAPIError}
 */
interface EnhancedBetterAuthAPIError extends BetterAuthAPIError {
  code: string;
  statusCode: number;
}

/**
 * Creates and configures the authentication client with error handling and plugins
 *
 * @example
 * ```typescript
 * // Using the auth client in a component
 * import { useSession } from '@/lib/auth/auth-client';
 *
 * function MyComponent() {
 *   const { session } = useSession();
 *   if (!session) return <div>Not authenticated</div>;
 *   return <div>Welcome {session.user.email}</div>;
 * }
 * ```
 */
export const authClient = createAuthClient({
  baseURL: baseURL.toString(),
  trustedOrigins: [baseURL.toString()],
  fetchOptions: {
    credentials: "include",
    onError: async (error) => {
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
            toast.error(
              "Your account has been locked. Please contact support."
            );
            return;
          default:
            // Handle other BetterAuth errors
            toast.error(betterAuthError.message);
            return;
        }
      }

      // Handle regular errors (existing code)
      const metadata = {
        code: error.error.status === 429 ? "RATE_LIMIT_EXCEEDED" : "AUTH_ERROR",
        severity:
          error.error.status >= 500
            ? ErrorSeverity.ERROR
            : ErrorSeverity.WARNING,
        details: {
          status: error.error.status,
          message: error.error.message,
          path: window.location.pathname,
        },
      };

      await errorLogger.log(error.error, ErrorSource.AUTH, metadata);

      // Show user-friendly toast messages
      if (error.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
        return;
      }

      if (error.error.status === 401) {
        toast.error("Session expired. Please sign in again.");
        return;
      }

      if (error.error.status >= 500) {
        toast.error("An unexpected error occurred. Please try again later.");
        return;
      }

      // For other errors, throw to be handled by error boundaries
      throw new Error(error.error.message);
    },
  },
  plugins: [
    magicLinkClient(),
    multiSessionClient(),
    adminClient(),
    organizationClient(),
  ],
});

/**
 * Export commonly used authentication functions
 * @example
 * ```typescript
 * import { signIn } from '@/lib/auth/auth-client';
 *
 * // Sign in with magic link
 * await signIn.magicLink({ email: 'user@example.com' });
 *
 * // Sign in with credentials
 * await signIn.credentials({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export const { signOut, signIn, signUp, useSession } = authClient;
