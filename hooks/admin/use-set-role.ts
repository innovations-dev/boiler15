/**
 * @module hooks/admin/use-set-role
 */

import { useQueryClient } from "@tanstack/react-query";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { userSelectSchema } from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { invalidateAdminQueries } from "@/lib/query/mutations";

/**
 * Input type for the setRole mutation
 * @interface SetRoleInput
 * @property {string} userId - The unique identifier of the user
 * @property {string} role - The new role to assign to the user
 */
interface SetRoleInput {
  userId: string;
  role: string;
}

/**
 * A hook for managing user role updates in an admin context.
 *
 * @returns {UseMutationResult} A mutation object for updating user roles
 *
 * @example
 * ```tsx
 * function AdminUserRow({ user }) {
 *   const setRole = useSetRole();
 *
 *   const handleRoleChange = (newRole: string) => {
 *     setRole.mutate({
 *       userId: user.id,
 *       role: newRole
 *     });
 *   };
 *
 *   return (
 *     <Select
 *       value={user.role}
 *       onChange={(e) => handleRoleChange(e.target.value)}
 *       disabled={setRole.isPending}
 *     >
 *       <option value="user">User</option>
 *       <option value="admin">Admin</option>
 *     </Select>
 *   );
 * }
 * ```
 *
 * @remarks
 * - This hook uses TanStack Query for mutation management
 * - Automatically invalidates admin-related queries on success
 * - Validates the response data using Zod schema
 * - Includes built-in error handling with a default error message
 *
 * @throws Will throw an error if the response data doesn't match the userSelectSchema
 */
export function useSetRole() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: ({ userId, role }: SetRoleInput) =>
      authClient.admin.setRole({
        userId,
        role,
      }),
    onSuccess: ({ data }) => {
      userSelectSchema.parse(data);
      invalidateAdminQueries(queryClient);
    },
    errorMessage: "Failed to update role",
    ...cacheConfig.queries.user,
  });
}
