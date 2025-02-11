import { nanoid } from "nanoid";

import { errorLogger, ErrorSource } from "../logger/enhanced-logger";
import { HttpError } from "../query/error";
import { API_ERROR_CODES } from "../schemas/api-types";

interface ErrorResponse {
  message: string;
  code: string;
  status: number;
}

/**
 * Handles errors specifically for Server Actions.
 * This utility standardizes error responses for server-side actions and ensures proper error logging.
 *
 * @param {unknown} error - The error to be handled
 * @param {string} [path="unknown"] - Context path where the error occurred
 * @returns {Promise<ErrorResponse>} Standardized error response object
 *
 * @example
 * // In a Server Action
 * try {
 *   const result = await db.users.create({ data });
 *   return { success: true, data: result };
 * } catch (error) {
 *   const { message, code, status } = await handleActionError(error, "createUser");
 *   return {
 *     success: false,
 *     error: { message, code, status }
 *   };
 * }
 *
 * @see {@link createAction} For the recommended way to create server actions
 * @see {@link ErrorSource} For available error sources
 */
export async function handleActionError(
  error: unknown,
  path = "unknown"
): Promise<ErrorResponse> {
  await errorLogger.log(error, ErrorSource.UNKNOWN, {
    path,
    requestId: nanoid(),
  });

  if (error instanceof HttpError) {
    return {
      message: error.message,
      code: error.code,
      status: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      status: 500,
    };
  }

  return {
    message: "An unexpected error occurred",
    code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
    status: 500,
  };
}
