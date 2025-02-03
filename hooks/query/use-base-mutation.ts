/**
 * @fileoverview Provides a base mutation hook that wraps React Query's useMutation with error handling,
 * logging, and toast notifications.
 */

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError, handleApiError } from "@/lib/api/error";
import { errorLogger, ErrorSource } from "@/lib/logger/enhanced-logger";
import { logError } from "@/lib/logger/error";

/**
 * Configuration options for the base mutation hook
 * @template TData The type of data returned by the mutation
 * @template TError The type of error that can occur
 * @template TVariables The type of variables passed to the mutation
 */
interface MutationConfig<TData, TError, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void | Promise<void>;
  onMutate?: (variables: TVariables) => Promise<unknown>;
  onError?: (error: TError, variables: TVariables, context: unknown) => void;
  errorMessage?: string;
  context?: string;
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "mutationFn" | "onSuccess" | "onError" | "onMutate"
  >;
}

/**
 * A base mutation hook that provides error handling, logging, and toast notifications.
 *
 * @template TData The type of data returned by the mutation
 * @template TError The type of error that can occur (defaults to unknown)
 * @template TVariables The type of variables passed to the mutation (defaults to void)
 *
 * @example
 * // Basic usage
 * const mutation = useBaseMutation({
 *   mutationFn: async (data: FormData) => {
 *     const response = await api.post('/endpoint', data);
 *     return response.data;
 *   },
 *   onSuccess: (data) => {
 *     // Handle success
 *   },
 *   context: 'createUser'
 * });
 *
 * // Usage with type parameters
 * interface UserData {
 *   name: string;
 *   email: string;
 * }
 *
 * const createUser = useBaseMutation<UserData, Error, UserData>({
 *   mutationFn: (userData) => api.post('/users', userData),
 *   errorMessage: 'Failed to create user',
 *   context: 'userCreation'
 * });
 *
 * @returns A React Query mutation object with enhanced error handling
 */
export function useBaseMutation<TData, TError = unknown, TVariables = void>({
  mutationFn,
  onSuccess,
  errorMessage = "An error occurred",
  context = "mutation",
  options = {},
}: MutationConfig<TData, TError, TVariables>) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        logError(error, `${context}:mutation`);
        errorLogger.log(error, ErrorSource.MUTATION, {
          code: "MUTATION_ERROR",
          context,
        });
        throw handleApiError(error);
      }
    },
    onSuccess: async (data) => {
      await onSuccess?.(data);
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : errorMessage;
      toast.error(message);
    },
    ...options,
  });
}
