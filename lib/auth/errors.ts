/**
 * @fileoverview Global error handler for client-side authentication errors
 * @module lib/auth/errors
 */

"use client";

// used for client side error handling
import React, { useEffect } from "react";
import { APIError as BetterAuthAPIError } from "better-auth/api";
import { toast } from "sonner";

/**
 * Global error handler component for catching and handling authentication errors
 * on the client side. Prevents default error behavior and displays user-friendly
 * toast notifications for authentication-related errors.
 *
 * @component
 * @example
 * // In your root layout or app component:
 * import { ErrorHandler } from '@/lib/auth/errors';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <>
 *       <ErrorHandler />
 *       {children}
 *     </>
 *   );
 * }
 *
 * @example
 * // The error handler will catch Better-Auth API errors:
 * try {
 *   await authClient.signIn.credentials({
 *     email: "user@example.com",
 *     password: "password"
 *   });
 * } catch (error) {
 *   // ErrorHandler will automatically catch this and show a toast
 *   throw error;
 * }
 *
 * @returns {null} Renders nothing, only handles errors
 */
export const ErrorHandler: React.FC = () => {
  useEffect(() => {
    /**
     * Handles both synchronous errors and promise rejections
     *
     * @param {ErrorEvent | PromiseRejectionEvent} event - The error event
     * @returns {Error | undefined} The handled error
     */
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      event.preventDefault();
      const error = "error" in event ? event.error : event.reason;

      if (error instanceof BetterAuthAPIError) {
        const message = error.message || "An authentication error occurred";
        toast.error(message);
        return error;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  return null;
};
