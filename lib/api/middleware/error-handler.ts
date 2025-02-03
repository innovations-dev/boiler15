/**
 * @fileoverview Error handling middleware for Next.js API routes that automatically catches and processes errors.
 */

import { NextApiHandler } from "next";

import { handleApiError } from "../error";

/**
 * Higher-order function that wraps Next.js API handlers with error handling capabilities.
 * This middleware catches any errors thrown within the API route and processes them using
 * the handleApiError utility.
 *
 * @param {NextApiHandler} handler - The Next.js API route handler to wrap
 * @returns {NextApiHandler} A wrapped handler with error handling
 *
 * @example
 * // Basic usage in an API route
 * export default withErrorHandler(async function handler(req, res) {
 *   // Your API logic here
 * });
 *
 * @example
 * // Usage with multiple middleware
 * export default withErrorHandler(
 *   withAuth(
 *     async function handler(req, res) {
 *       // Protected API route logic here
 *     }
 *   )
 * );
 *
 * @example
 * // The middleware will catch and process various error types:
 * // - Validation errors
 * // - Authentication errors
 * // - Database errors
 * // - Custom application errors
 * // And return appropriate error responses with correct status codes
 */
export function withErrorHandler(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const response = handleApiError(error);
      return response;
    }
  };
}
