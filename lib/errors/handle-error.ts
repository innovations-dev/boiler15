/**
 * @fileoverview Central error handling utility for API responses
 * @module lib/errors/handle-error
 */

// used for general application error handling

import { nanoid } from "nanoid";

import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";
import { HttpError } from "@/lib/query/error";
import { API_ERROR_CODES } from "@/lib/schemas/api-types";

/**
 * Handles and standardizes error responses across the application.
 * This utility function logs errors and transforms them into consistent API responses.
 *
 * @async
 * @param {unknown} error - The error to be handled. Can be HttpError, Error, or any unknown error type
 * @param {string} [path="unknown"] - The path where the error occurred (e.g., route path or function name)
 * @returns {Promise<Response>} A standardized API response with error details
 *
 * @example
 * // Handling an HTTP error
 * try {
 *   throw new HttpError(404, "User not found", "NOT_FOUND");
 * } catch (error) {
 *   return await handleError(error, "/api/users/[id]");
 *   // Returns: Response with status 404 and JSON body containing error details
 * }
 *
 * @example
 * // Handling a standard Error
 * try {
 *   throw new Error("Database connection failed");
 * } catch (error) {
 *   return await handleError(error, "dbConnect");
 *   // Returns: Response with status 500 and JSON body containing error details
 * }
 */
export async function handleError(
  error: unknown,
  path = "unknown"
): Promise<Response> {
  await errorLogger.log(error, ErrorSource.UNKNOWN, {
    path,
    requestId: nanoid(),
  });

  if (error instanceof HttpError) {
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code,
          status: error.statusCode,
        },
      }),
      {
        status: error.statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
          status: 500,
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: {
        message: "An unexpected error occurred",
        code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        status: 500,
      },
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
