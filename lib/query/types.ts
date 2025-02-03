/**
 * @fileoverview Type definitions and utilities for handling query results and errors
 * in a consistent way across the application.
 */

/**
 * Represents an error that occurred during a query operation.
 * @interface QueryError
 * @property {string} message - Human-readable error message
 * @property {string} [code] - Optional error code for programmatic handling
 * @property {number} [status] - Optional HTTP status code
 *
 * @example
 * const error: QueryError = {
 *   message: "User not found",
 *   code: "USER_NOT_FOUND",
 *   status: 404
 * };
 */
export type QueryError = {
  message: string;
  code?: string;
  status?: number;
};

/**
 * Generic type for wrapping query results with error handling.
 * @template T - The type of data being returned
 * @property {T} data - The query result data
 * @property {QueryError} [error] - Optional error information if the query failed
 *
 * @example
 * type UserResult = QueryResult<typeof userSelectSchema>;
 *
 * const result: UserResult = {
 *   data: { id: 1, name: "John" },
 *   error: undefined
 * };
 */
export type QueryResult<T> = {
  data: T;
  error?: QueryError;
};

/**
 * Generic type for paginated query results with cursor-based pagination.
 * @template T - The type of items in the result set
 * @property {T[]} items - Array of items in the current page
 * @property {string} [nextCursor] - Optional cursor for fetching the next page
 * @property {number} totalCount - Total number of items across all pages
 *
 * @example
 * type PaginatedUsers = PaginatedResult<typeof userSelectSchema>;
 *
 * const users: PaginatedUsers = {
 *   data: {
 *     items: [{ id: 1, name: "John" }],
 *     nextCursor: "cursor_123",
 *     totalCount: 100
 *   }
 * };
 */
export type PaginatedResult<T> = QueryResult<{
  items: T[];
  nextCursor?: string;
  totalCount: number;
}>;

/**
 * Type guard to safely check if an unknown error is a QueryError.
 * Use this function when handling errors to ensure type safety.
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a QueryError
 *
 * @example
 * try {
 *   // Some operation that might fail
 * } catch (error) {
 *   if (isQueryError(error)) {
 *     console.error(error.message); // TypeScript knows this is safe
 *   }
 * }
 */
export function isQueryError(error: unknown): error is QueryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as QueryError).message === "string"
  );
}
