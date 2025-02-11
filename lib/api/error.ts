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
 * Handles errors specifically for API Routes.
 * Converts various error types into standardized Response objects with appropriate status codes.
 *
 * @param {unknown} error - The error to be handled
 * @param {string} [path="unknown"] - API route path where the error occurred
 * @returns {Promise<Response>} HTTP Response with standardized error format
 *
 * @example
 * // In an API route
 * export async function POST(req: Request) {
 *   try {
 *     const result = await processRequest(req);
 *     return Response.json(result);
 *   } catch (error) {
 *     return handleApiError(error, "/api/users/create");
 *   }
 * }
 *
 * @see {@link ErrorSource.API} For API-specific error source
 */
export async function handleApiError(
  error: unknown,
  path = "unknown"
): Promise<Response> {
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
}
