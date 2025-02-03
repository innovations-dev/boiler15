/**
 * @module lib/auth/actions/session
 * @description Handles session token management and retrieval for server-side authentication
 */

import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

/**
 * Caches and formats the session token for Better-Auth authentication.
 * Uses Next.js cache to optimize performance and reduce database calls.
 *
 * @param {string} sessionToken - The raw session token to be sanitized and cached
 * @param {string} [sessionData] - Optional additional session data to be included
 * @returns {Promise<string>} A formatted cookie string containing the session token
 *
 * @example
 * ```ts
 * const token = await serverGetSessionToken("abc123", "userData");
 * // Returns: "better-auth.session_token=abc123; better-auth.session_data=userData"
 * ```
 */
export const serverGetSessionToken = unstable_cache(
  async (sessionToken: string, sessionData?: string) => {
    // Sanitize the token to prevent SQL injection and parsing issues
    const sanitizedToken = sessionToken.replace(/['"]/g, "");
    return [
      `better-auth.session_token=${sanitizedToken}`,
      sessionData ? `better-auth.session_data=${sessionData}` : "",
    ]
      .filter(Boolean)
      .join("; ");
  },
  ["session-token"],
  {
    revalidate: 60,
    tags: ["session"],
  }
);

/**
 * Retrieves and validates the session token from cookies.
 * Used for server-side authentication checks and session management.
 *
 * @throws {Error} If no session token is found in cookies
 * @returns {Promise<string>} The formatted session token string
 *
 * @example
 * ```ts
 * try {
 *   const sessionToken = await getSessionTokenFromCookies();
 *   // Use token for authentication
 * } catch (error) {
 *   // Handle missing session token
 * }
 * ```
 */
export async function getSessionTokenFromCookies(): Promise<string> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");
  const sessionData = cookieStore.get("better-auth.session_data");

  if (!sessionToken?.value) {
    console.error("Session token missing:", {
      allCookies: cookieStore.getAll().map((c) => c.name),
    });
    throw new Error("No session token found");
  }

  return serverGetSessionToken(sessionToken.value, sessionData?.value);
}
