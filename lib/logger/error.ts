import { ApiError } from "../api/error";
import { HttpError } from "../query/error";

interface ErrorLogData {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
  stack?: string;
  context?: string;
  timestamp?: string;
  userId?: string;
  requestId?: string;
}

/**
 * Centralized error logging utility
 * @param error - The error object to log
 * @param context - Context where the error occurred (e.g., "AuthClient", "ApiQuery")
 * @param metadata - Additional error metadata
 *
 * @example
 * ```ts
 * try {
 *   await fetchData();
 * } catch (error) {
 *   logError(error, "DataFetch", { userId: "123" });
 * }
 * ```
 */
export function logError(
  error: unknown,
  context?: string,
  metadata?: Partial<ErrorLogData>
) {
  const errorData: ErrorLogData = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  if (error instanceof ApiError) {
    errorData.code = error.code;
    errorData.status = error.status;
  } else if (error instanceof HttpError) {
    errorData.code = error.code;
    errorData.status = error.statusCode;
  }

  // Add to error reporting service
  console.error(`[${context}]`, errorData);

  // TODO: Integrate with error reporting service
  // reportError(errorData);
}
