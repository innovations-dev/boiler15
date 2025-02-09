/**
 * @fileoverview Centralized API error handling utilities for Next.js applications.
 * Provides standardized error classes and handlers for API routes.
 */

import { z } from "zod";

import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";
import { API_ERROR_CODES } from "@/lib/schemas/api-types";

/**
 * Custom error class for API-specific errors with status codes and error codes.
 * Extends the native Error class with additional API-specific properties.
 *
 * @class
 * @extends {Error}
 *
 * @example
 * ```ts
 * // Basic usage
 * throw new ApiError("User not found", "NOT_FOUND", 404);
 *
 * // With default internal error
 * throw new ApiError("Database connection failed");
 * ```
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string = API_ERROR_CODES.INTERNAL_SERVER_ERROR,
    public status: number = 500
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Handles API errors and converts them into standardized Response objects.
 * Automatically logs errors and provides consistent error responses.
 *
 * @param {unknown} error - The error to handle
 * @param {string} [path="unknown"] - The API route path where the error occurred
 * @returns {Promise<Response>} A formatted JSON response with appropriate status code
 *
 * @example
 * ```ts
 * // In an API route
 * export async function POST(req: Request) {
 *   try {
 *     const data = await validateAndProcessRequest(req);
 *     return Response.json({ data });
 *   } catch (error) {
 *     return handleApiError(error, "/api/users");
 *   }
 * }
 *
 * // Custom error handling
 * try {
 *   await db.users.create({ data });
 * } catch (error) {
 *   throw new ApiError("Failed to create user", "USER_CREATE_ERROR", 400);
 * }
 * ```
 *
 * @throws {never} This function always returns a Response and never throws
 */
export const handleApiError = async (
  error: unknown,
  path = "unknown"
): Promise<Response> => {
  await errorLogger.log(error, ErrorSource.API, {
    path,
    requestId: crypto.randomUUID(),
  });

  if (error instanceof ApiError) {
    return Response.json(
      { code: error.code, message: error.message },
      { status: error.status }
    );
  }

  if (error instanceof z.ZodError) {
    return Response.json(
      {
        code: API_ERROR_CODES.BAD_REQUEST,
        message: "Invalid request data",
        errors: error.errors,
      },
      { status: 400 }
    );
  }

  return Response.json(
    {
      code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    },
    { status: 500 }
  );
};
