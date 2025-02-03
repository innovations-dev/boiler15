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
import { createApiResponse, type ApiErrorCode } from "@/lib/schemas/api-types";

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
        const data = await queryFn();
        return schema.parse(data);
      } catch (error) {
        logError(error, `useApiQuery:${key.join(":")}`);
        errorLogger.log(error, ErrorSource.QUERY, {
          context: `useApiQuery:${key.join(":")}`,
        });

        if (error instanceof ApiError) {
          throw createApiResponse(null, {
            message: error.message,
            code: error.code as ApiErrorCode,
            status: error.status,
          });
        }
        if (error instanceof z.ZodError) {
          throw createApiResponse(null, {
            message: "Validation error",
            code: "VALIDATION_ERROR",
            status: 400,
            details: { errors: error.errors },
          });
        }
        throw error;
      }
    },
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "An unexpected error occurred";
        toast.error(message);
      },
    },
    ...options,
  });
}
