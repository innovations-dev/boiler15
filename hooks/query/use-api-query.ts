/**
 * Custom hook that combines React Query with Zod schema validation and error handling for API requests.
 *
 * @template T - Extends z.ZodType for runtime type validation
 *
 * @param key - React Query cache key array used for query identification and caching
 * @param queryFn - Async function that performs the API request
 * @param schema - Zod schema used to validate the API response
 * @param options - Additional React Query options (excluding queryKey and queryFn)
 *
 * @returns React Query result object containing data, error, and status information
 *
 * @throws {ApiError} When the API request fails
 * @throws {z.ZodError} When response validation fails
 *
 * @example
 * // Example usage with a user profile endpoint
 * const userSchema = z.object({
 *   id: z.string(),
 *   name: z.string(),
 *   email: z.string().email()
 * });
 *
 * function useUserProfile(userId: string) {
 *   return useApiQuery(
 *     ['user', userId],
 *     () => fetch(`/api/users/${userId}`).then(res => res.json()),
 *     userSchema
 *   );
 * }
 *
 * // In your component:
 * const { data, isLoading, error } = useUserProfile('123');
 *
 * @example
 * // Example with custom options
 * const { data } = useApiQuery(
 *   ['posts'],
 *   () => fetch('/api/posts').then(res => res.json()),
 *   postsSchema,
 *   {
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *     refetchOnWindowFocus: false
 *   }
 * );
 *
 * @features
 * - Automatic error handling and logging
 * - Runtime type validation using Zod
 * - Toast notifications for errors
 * - Integration with custom error logging system
 * - Type-safe API responses
 */
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { ApiError } from "@/lib/api/error";
import { errorLogger } from "@/lib/logger/enhanced-logger";
import { logError } from "@/lib/logger/error";
import { ErrorSource } from "@/lib/logger/types";
import { isQueryError } from "@/lib/query/types";

/**
 * Custom hook that combines React Query with Zod schema validation and error handling for API requests.
 * Expects raw data from queryFn and handles validation/error wrapping internally.
 */
export function useApiQuery<T extends z.ZodType>(
  key: readonly unknown[],
  queryFn: () => Promise<z.infer<T>>,
  schema: T,
  options?: Omit<UseQueryOptions<z.infer<T>>, "queryKey" | "queryFn">
) {
  return useQuery<z.infer<T>>({
    queryKey: key,
    queryFn: async () => {
      try {
        // Get raw data from query function
        const rawData = await queryFn();

        // Validate data against schema
        const validatedData = schema.parse(rawData);

        return validatedData;
      } catch (error) {
        // Log the error with context
        logError(error, `useApiQuery:${key.join(":")}`);
        errorLogger.log(error, ErrorSource.QUERY, {
          context: `useApiQuery:${key.join(":")}`,
        });

        // Handle specific error types
        if (error instanceof ApiError) {
          throw error; // Let React Query handle API errors directly
        }

        if (error instanceof z.ZodError) {
          throw new ApiError("Validation error", "VALIDATION_ERROR", 400);
        }

        // For unknown errors, throw a generic error
        throw new ApiError(
          "An unexpected error occurred",
          "INTERNAL_SERVER_ERROR",
          500
        );
      }
    },
    meta: {
      onError: (error: unknown) => {
        const message =
          error instanceof ApiError
            ? error.message
            : "An unexpected error occurred";
        toast.error(message);
      },
    },
    ...options,
  });
}
