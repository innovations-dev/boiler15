// hooks/action/use-server-action.ts
"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { errorLogger } from "@/lib/logger/enhanced-logger";
import { ErrorSeverity, ErrorSource } from "@/lib/logger/types";
import {
  API_ERROR_CODES,
  type ApiError,
  type ApiResponse,
} from "@/lib/schemas/api-types";

// Better-Auth specific response types
type BetterAuthErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMIT"
  | "INTERNAL_ERROR"
  | "UNKNOWN_ERROR"
  | "FETCH_ERROR";

type BetterAuthError = {
  code?: BetterAuthErrorCode;
  message?: string;
  statusCode?: number;
};

type Data<T> = T & { status: boolean };
type Error$1<T> = { error: T };
export type BetterAuthResponse<T> = Data<T> | Error$1<BetterAuthError>;

interface UseServerActionOptions<TData, TInput> {
  // The server action to execute
  action: (
    input: TInput
  ) => Promise<ApiResponse<TData> | BetterAuthResponse<TData>>;
  // Optional success callback
  onSuccess?: (data: TData) => void | Promise<void>;
  // Optional error callback
  onError?: (error: Error) => void | Promise<void>;
  // Optional validation schema for input
  schema?: z.ZodType<TInput>;
  // Context for error logging
  context?: string;
  // Custom success message
  successMessage?: string;
  // Custom error message
  errorMessage?: string;
  // Optional form reset function
  resetForm?: () => void;
}

function isBetterAuthResponse<T>(
  response: unknown
): response is BetterAuthResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    !("success" in response) &&
    ("error" in response || "status" in response)
  );
}

function mapBetterAuthErrorToApiError(error: BetterAuthError): ApiError {
  let errorCode: keyof typeof API_ERROR_CODES = "BAD_REQUEST";
  let status = error.statusCode || 400;

  if (error.code) {
    switch (error.code.toUpperCase()) {
      case "UNAUTHORIZED":
        errorCode = "UNAUTHORIZED";
        status = 401;
        break;
      case "FORBIDDEN":
        errorCode = "FORBIDDEN";
        status = 403;
        break;
      case "NOT_FOUND":
        errorCode = "NOT_FOUND";
        status = 404;
        break;
      case "VALIDATION_ERROR":
        errorCode = "BAD_REQUEST";
        status = 400;
        break;
      case "RATE_LIMIT":
        errorCode = "TOO_MANY_REQUESTS";
        status = 429;
        break;
      case "INTERNAL_ERROR":
        errorCode = "INTERNAL_SERVER_ERROR";
        status = 500;
        break;
      default:
        errorCode = "BAD_REQUEST";
        status = 400;
    }
  }

  return {
    code: errorCode,
    message: error.message || "An error occurred",
    status,
  };
}

function normalizeResponse<T>(
  response: ApiResponse<T> | BetterAuthResponse<T>
): ApiResponse<T> {
  if (isBetterAuthResponse(response)) {
    const isError = "error" in response;

    if (isError && response.error) {
      return {
        success: false,
        data: {} as T,
        error: mapBetterAuthErrorToApiError(response.error),
      };
    }

    return {
      success: true,
      data: response as T,
    };
  }
  return response;
}

/**
 * A reusable hook for handling server actions with proper loading states,
 * error handling, and toast notifications.
 *
 * @example
 * ```tsx
 * const { execute, isPending } = useServerAction({
 *   action: createFeature,
 *   schema: createFeatureSchema,
 *   context: "createFeature",
 *   successMessage: "Feature created successfully",
 * });
 *
 * // Usage
 * await execute({ name: "New Feature" });
 * ```
 */
export function useServerAction<TData, TInput>({
  action,
  onSuccess,
  onError,
  schema,
  context = "serverAction",
  successMessage,
  errorMessage = "An error occurred",
  resetForm,
}: UseServerActionOptions<TData, TInput>) {
  const [isPending, startTransition] = useTransition();

  const execute = async (input: TInput) => {
    try {
      // Validate input if schema is provided
      if (schema) {
        input = schema.parse(input);
      }

      // Wrap in transition for better UX
      await new Promise<void>((resolve) => {
        startTransition(async () => {
          try {
            // Execute action and normalize response
            const rawResponse = await action(input);
            const response = normalizeResponse(rawResponse);

            if (!response.success) {
              const error = new Error(response.error?.message || errorMessage);
              const severity =
                response.error && response.error.status >= 500
                  ? ErrorSeverity.ERROR
                  : ErrorSeverity.WARNING;

              // Log error with proper severity and context
              errorLogger.log(error, ErrorSource.ACTION, {
                code: response.error?.code,
                severity,
                context,
                details: {
                  input,
                  error: response.error,
                },
              });

              toast.error(response.error?.message || errorMessage);
              await onError?.(error);
              resolve();
              return;
            }

            // Handle success
            if (successMessage || response.message) {
              toast.success(successMessage || response.message);
            }

            // Reset form if provided
            resetForm?.();

            await onSuccess?.(response.data);
            resolve();
          } catch (actionError) {
            // Handle thrown errors (network errors, etc.)
            const error = actionError as Error & BetterAuthError;
            const apiError = mapBetterAuthErrorToApiError(error);

            errorLogger.log(error, ErrorSource.ACTION, {
              code: apiError.code,
              severity:
                apiError.status >= 500
                  ? ErrorSeverity.ERROR
                  : ErrorSeverity.WARNING,
              context,
              details: {
                input,
                error: apiError,
              },
            });

            toast.error(error.message || errorMessage);
            await onError?.(error);
            resolve();
          }
        });
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => e.message).join(", ");
        toast.error(message);
        await onError?.(error);
        return;
      }

      // Log unexpected errors
      errorLogger.log(error, ErrorSource.ACTION, {
        severity: ErrorSeverity.ERROR,
        context,
        details: { input },
      });

      toast.error(errorMessage);
      await onError?.(error as Error);
    }
  };

  return {
    execute,
    isPending,
  };
}
