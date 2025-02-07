import { useQueryClient } from "@tanstack/react-query";

import { createUserAction } from "@/app/(admin)/_actions/user";
import { createUserSchema } from "@/app/(admin)/_actions/user.types";
import type { CreateUserInput } from "@/app/(admin)/_actions/user.types";
import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

export { createUserSchema };
export type { CreateUserInput } from "@/app/(admin)/_actions/user.types";

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
 * - Includes audit logging for all actions
 *
 * @throws Will throw an error if:
 * - User creation fails on the server
 * - Input validation fails
 * - User lacks admin permissions
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: createUserAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.list(),
      });
    },
    errorMessage: "Failed to create user",
    ...cacheConfig.queries.default,
  });
}
