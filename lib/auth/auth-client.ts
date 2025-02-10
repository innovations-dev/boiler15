/**
 * @fileoverview Client-side authentication configuration and error handling using Better-Auth.
 * This module sets up the authentication client with proper error handling, logging, and user feedback.
 */

import { APIError as BetterAuthAPIError } from "better-auth/api";
import {
  adminClient,
  customSessionClient,
  magicLinkClient,
  multiSessionClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "../auth";
import { clientOnError } from "../errors/client-error";
import { baseURL } from "../utils";

/**
 * Extended interface for Better-Auth API errors with additional properties
 * @interface EnhancedBetterAuthAPIError
 * @extends {BetterAuthAPIError}
 */
export interface EnhancedBetterAuthAPIError extends BetterAuthAPIError {
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
    onError: clientOnError,
  },
  plugins: [
    magicLinkClient(),
    multiSessionClient(),
    adminClient(),
    organizationClient(),
    customSessionClient<typeof auth>(),
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
