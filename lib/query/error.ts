/**
 * @fileoverview HTTP Error handling utilities for standardized API error management
 * @module lib/query/error
 */

import { API_ERROR_CODES } from "@/lib/schemas/api-types";

/**
 * Base HTTP Error class for handling API errors with status codes
 * @class
 * @extends Error
 */
export class HttpError extends Error {
  /**
   * Creates a new HttpError instance
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {string} [code=API_ERROR_CODES.INTERNAL_ERROR] - Error code from API_ERROR_CODES
   */
  constructor(
    public statusCode: number,
    message: string,
    public code: string = API_ERROR_CODES.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/**
 * 401 Unauthorized Error
 * @class
 * @extends HttpError
 */
export class UnauthorizedError extends HttpError {
  /**
   * Creates a new UnauthorizedError instance
   * @param {string} message - Error message
   */
  constructor(message: string) {
    super(401, message, API_ERROR_CODES.UNAUTHORIZED);
    this.name = "UnauthorizedError";
  }
}

/**
 * 403 Forbidden Error
 * @class
 * @extends HttpError
 */
export class ForbiddenError extends HttpError {
  /**
   * Creates a new ForbiddenError instance
   * @param {string} message - Error message
   */
  constructor(message: string) {
    super(403, message, API_ERROR_CODES.FORBIDDEN);
    this.name = "ForbiddenError";
  }
}

/**
 * 404 Not Found Error
 * @class
 * @extends HttpError
 */
export class NotFoundError extends HttpError {
  /**
   * Creates a new NotFoundError instance
   * @param {string} message - Error message
   */
  constructor(message: string) {
    super(404, message, API_ERROR_CODES.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

/**
 * 400 Bad Request Error
 * @class
 * @extends HttpError
 */
export class BadRequestError extends HttpError {
  /**
   * Creates a new BadRequestError instance
   * @param {string} message - Error message
   */
  constructor(message: string) {
    super(400, message, API_ERROR_CODES.BAD_REQUEST);
    this.name = "BadRequestError";
  }
}

/**
 * 429 Rate Limit Error
 * @class
 * @extends HttpError
 */
export class RateLimitError extends HttpError {
  /**
   * Creates a new RateLimitError instance
   * @param {string} [message="Too many requests. Please try again later."] - Error message
   */
  constructor(message: string = "Too many requests. Please try again later.") {
    super(429, message, API_ERROR_CODES.TOO_MANY_REQUESTS);
    this.name = "RateLimitError";
  }
}

/**
 * Utility to convert unknown errors to typed HTTP errors
 * @param {unknown} error - Unknown error to be converted
 * @returns {Error} Typed HttpError instance
 *
 * @example
 * // Basic error handling in an API route
 * try {
 *   const response = await fetch('/api/data');
 *   if (!response.ok) {
 *     throw handleHttpError(await response.json());
 *   }
 * } catch (error) {
 *   if (error instanceof UnauthorizedError) {
 *     // Handle 401 - redirect to login
 *   } else if (error instanceof ForbiddenError) {
 *     // Handle 403 - show permission denied message
 *   } else if (error instanceof NotFoundError) {
 *     // Handle 404 - show not found message
 *   }
 * }
 *
 * @example
 * // Using with React Query
 * const query = useQuery({
 *   queryKey: ['data'],
 *   queryFn: async () => {
 *     const response = await fetch('/api/data');
 *     if (!response.ok) {
 *       throw handleHttpError(await response.json());
 *     }
 *     return response.json();
 *   },
 *   onError: (error) => {
 *     if (error instanceof RateLimitError) {
 *       // Show rate limit exceeded message
 *     }
 *   }
 * });
 *
 * @example
 * // Server-side API route error handling
 * export async function GET() {
 *   try {
 *     // Some operation that might fail
 *     throw new Error('Database connection failed');
 *   } catch (error) {
 *     const httpError = handleHttpError(error);
 *     return Response.json(
 *       { message: httpError.message },
 *       { status: httpError instanceof HttpError ? httpError.statusCode : 500 }
 *     );
 *   }
 * }
 */
export function handleHttpError(error: unknown): Error {
  if (error instanceof HttpError) return error;

  if (error instanceof Error) {
    if ("status" in error) {
      const status = (error as { status: number }).status;
      const message = error.message;

      switch (status) {
        case 400:
          return new BadRequestError(message);
        case 401:
          return new UnauthorizedError(message);
        case 403:
          return new ForbiddenError(message);
        case 404:
          return new NotFoundError(message);
        case 429:
          return new RateLimitError(message);
        default:
          return new HttpError(status, message);
      }
    }
    return error;
  }

  return new HttpError(500, "An unexpected error occurred");
}
