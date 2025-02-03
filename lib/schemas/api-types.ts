/**
 * @fileoverview API type definitions and utilities for handling API responses, errors, and pagination
 * @module lib/schemas/api-types
 */

import { z } from "zod";

/**
 * Standardized API error codes used throughout the application
 * @constant
 */
export const API_ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMIT: "RATE_LIMIT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  FETCH_ERROR: "FETCH_ERROR",
} as const;

export type ApiErrorCode = keyof typeof API_ERROR_CODES;

/**
 * Base schema for API errors
 * @example
 * const error = {
 *   code: "NOT_FOUND",
 *   message: "Resource not found",
 *   status: 404,
 *   details: ["Item with ID 123 does not exist"]
 * };
 */
export const apiErrorSchema = z.object({
  code: z.enum([
    "UNAUTHORIZED",
    "FORBIDDEN",
    "NOT_FOUND",
    "VALIDATION_ERROR",
    "RATE_LIMIT",
    "INTERNAL_ERROR",
    "UNKNOWN_ERROR",
    "FETCH_ERROR",
  ]),
  message: z.string(),
  status: z.number(),
  details: z.union([z.array(z.any()), z.record(z.unknown())]).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

/**
 * Generic interface for API responses
 * @template T - The type of data contained in the response
 * @property {T} data - The response payload
 * @property {ApiError} [error] - Error information if the request failed
 */
export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

/**
 * Creates a standardized API response object
 * @template T - The type of data to be included in the response
 * @param {T} data - The response payload
 * @param {Partial<ApiError>} [error] - Optional error information
 * @returns {ApiResponse<T>} Formatted API response
 *
 * @example
 * // Success response
 * const response = createApiResponse({ user: { id: 1, name: 'John' } });
 *
 * // Error response
 * const errorResponse = createApiResponse(null, {
 *   code: 'NOT_FOUND',
 *   message: 'User not found',
 *   status: 404
 * });
 */
export function createApiResponse<T>(
  data: T,
  error?: Omit<ApiError, "status"> & { status?: number }
): ApiResponse<T> {
  return {
    data,
    error: error
      ? {
          code: error.code ?? API_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message,
          status: error.status ?? 500,
          details: error.details,
        }
      : undefined,
  };
}

/**
 * Creates a Zod schema for validating API responses
 * @template T - The Zod schema type for the data
 * @param {T} dataSchema - Zod schema for validating the response data
 * @returns {z.ZodType<ApiResponse<z.infer<T>>>} Combined API response schema
 *
 * @example
 * const userSchema = z.object({ id: z.number(), name: z.string() });
 * const userResponseSchema = createApiResponseSchema(userSchema);
 */
export function createApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    error: apiErrorSchema.optional(),
  }) as z.ZodType<ApiResponse<z.infer<T>>>;
}

/**
 * Schema for pagination metadata
 * @property {unknown[]} items - Array of paginated items
 * @property {number} totalCount - Total number of items
 * @property {number} currentPage - Current page number
 * @property {number} totalPages - Total number of pages
 * @property {boolean} hasNextPage - Whether there is a next page
 * @property {boolean} hasPreviousPage - Whether there is a previous page
 * @property {string} [nextCursor] - Cursor for fetching the next page
 */
export const paginationSchema = z.object({
  items: z.array(z.unknown()),
  totalCount: z.number().int().min(0),
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  nextCursor: z.string().optional(),
});

export type PaginationMeta = z.infer<typeof paginationSchema>;

/**
 * Schema for pagination request parameters
 * @property {number} page - Page number (min: 1, default: 1)
 * @property {number} limit - Items per page (min: 1, max: 100, default: 10)
 * @property {string} [cursor] - Cursor for pagination
 */
export const paginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  cursor: z.string().optional(),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

/**
 * Creates a schema for paginated API responses
 * @template T - The Zod schema type for individual items
 * @param {T} itemSchema - Schema for validating individual items
 * @returns {z.ZodType} Combined schema for paginated response
 *
 * @example
 * const userSchema = z.object({ id: z.number(), name: z.string() });
 * const paginatedUsersSchema = createPaginatedResponseSchema(userSchema);
 */
export function createPaginatedResponseSchema<T extends z.ZodType>(
  itemSchema: T
) {
  return createApiResponseSchema(
    paginationSchema.extend({
      items: z.array(itemSchema),
    })
  );
}

/**
 * Type guard to check if a value is an API response
 * @template T - The expected data type
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value matches ApiResponse structure
 *
 * @example
 * if (isApiResponse(response)) {
 *   console.log(response.data);
 * }
 */
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    (!("error" in value) ||
      (typeof value.error === "object" && value.error !== null))
  );
}

/**
 * Creates an error response object
 * @param {Partial<ApiError> & { message: string }} error - Error information
 * @returns {ApiResponse<never>} Formatted error response
 *
 * @example
 * return createErrorResponse({
 *   code: 'VALIDATION_ERROR',
 *   message: 'Invalid input',
 *   status: 400,
 *   details: ['Name is required']
 * });
 */
export function createErrorResponse(
  error: Partial<ApiError> & { message: string }
): ApiResponse<never> {
  return {
    data: null as never,
    error: {
      code: error.code ?? API_ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
      status: error.status ?? 500,
      details: error.details,
    },
  };
}

/**
 * Schema for creating organization requests
 * @property {string} name - Organization name (2-100 characters)
 * @property {string} slug - Organization slug (2-100 characters)
 */
export const createOrganizationRequestSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
});

export const updateOrganizationRequestSchema =
  createOrganizationRequestSchema.partial();
