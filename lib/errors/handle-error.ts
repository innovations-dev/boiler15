/**
 * @fileoverview Central error handling utility for API responses
 * @module lib/errors/handle-error
 */

// used for general application error handling

import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";
import { HttpError } from "@/lib/query/error";
import {
  API_ERROR_CODES,
  createApiResponse,
  type ApiResponse,
} from "@/lib/schemas/api-types";

/**
 * Handles and standardizes error responses across the application.
 * This utility function logs errors and transforms them into consistent API responses.
 *
 * @async
 * @param {unknown} error - The error to be handled. Can be HttpError, Error, or any unknown error type
 * @param {string} [path="unknown"] - The path where the error occurred (e.g., route path or function name)
 * @returns {Promise<ApiResponse<null>>} A standardized API response with error details
 *
 * @example
 * // Handling an HTTP error
 * try {
 *   throw new HttpError(404, "User not found", "NOT_FOUND");
 * } catch (error) {
 *   const response = await handleError(error, "/api/users/[id]");
 *   // Returns: { data: null, error: { message: "User not found", code: "NOT_FOUND", status: 404 } }
 * }
 *
 * @example
 * // Handling a standard Error
 * try {
 *   throw new Error("Database connection failed");
 * } catch (error) {
 *   const response = await handleError(error, "dbConnect");
 *   // Returns: { data: null, error: { message: "Database connection failed", code: "INTERNAL_ERROR", status: 500 } }
 * }
 *
 * @throws {never} This function handles all errors and always returns an ApiResponse
 */
export async function handleError(
  error: unknown,
  path = "unknown"
): Promise<ApiResponse<null>> {
  await errorLogger.log(error, ErrorSource.UNKNOWN, {
    path,
    requestId: crypto.randomUUID(),
  });

  if (error instanceof HttpError) {
    return createApiResponse(null, {
      message: error.message,
      code: error.code as keyof typeof API_ERROR_CODES,
      status: error.statusCode,
    });
  }

  if (error instanceof Error) {
    return createApiResponse(null, {
      message: error.message,
      code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      status: 500,
    });
  }

  return createApiResponse(null, {
    message: "An unexpected error occurred",
    code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
    status: 500,
  });
}
