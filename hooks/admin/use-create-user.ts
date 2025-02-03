import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

/**
 * Zod schema for validating user creation input
 * @remarks
 * Ensures the input data meets the required format before creating a user
 */
export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Hook for creating new users in the admin context
 *
 * @returns {Object} Mutation object with the following properties:
 * - mutate: Function to trigger the user creation
 * - isLoading: Boolean indicating if the mutation is in progress
 * - error: Any error that occurred during the mutation
 * - isSuccess: Boolean indicating if the mutation was successful
 *
 * @example
 * ```tsx
 * function CreateUserForm() {
 *   const { mutate, isLoading } = useCreateUser();
 *
 *   const onSubmit = (data: CreateUserInput) => {
 *     mutate(data, {
 *       onSuccess: () => {
 *         // Handle success
 *       },
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       // Form fields
 *     </form>
 *   );
 * }
 * ```
 *
 * @remarks
 * - This hook automatically invalidates the users list query on successful creation
 * - Uses the base mutation configuration from cacheConfig
 * - Requires admin privileges to execute
 *
 * @throws Will throw an error if:
 * - User creation fails on the server
 * - Input validation fails
 * - User lacks admin permissions
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: async (data: CreateUserInput) => {
      return await authClient.admin.createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.list(),
      });
    },
    errorMessage: "Failed to create user",
    ...cacheConfig.queries.default,
  });
}
