/**
 * @module hooks/admin/use-set-role
 */

import { useQueryClient } from "@tanstack/react-query";

import { setUserRoleAction } from "@/app/(admin)/_actions/user";
import type { SetRoleInput } from "@/app/(admin)/_actions/user.types";
import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

/**
 * Input type for the setRole mutation
 * @interface SetRoleInput
 * @property {string} userId - The unique identifier of the user
 * @property {string} role - The new role to assign to the user
 */

/**
 * Custom hook for setting user roles in an admin context.
 *
 * @remarks
 * This hook provides functionality to update user roles and automatically invalidates
 * relevant queries to ensure UI consistency after the role change.
 * Includes audit logging for all role changes.
 *
 * @returns {Object} Mutation object with the following properties:
 * - mutate: Function to trigger the role change
 * - isLoading: Boolean indicating if the role change is in progress
 * - error: Any error that occurred during the role change
 *
 * @example
 * ```tsx
 * function AdminUserList() {
 *   const { mutate: setRole, isLoading } = useSetRole();
 *
 *   const handleRoleChange = (userId: string, role: string) => {
 *     setRole({ userId, role }, {
 *       onSuccess: () => {
 *         toast.success('Role updated successfully');
 *       }
 *     });
 *   };
 *
 *   return (
 *     <Button
 *       onClick={() => handleRoleChange('user-123', 'admin')}
 *       disabled={isLoading}
 *     >
 *       Make Admin
 *     </Button>
 *   );
 * }
 * ```
 *
 * @see {@link useBaseMutation} For the underlying mutation implementation
 * @see {@link setUserRoleAction} For the server action implementation
 */
export function useSetRole() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: async (input: SetRoleInput) => {
      return setUserRoleAction(input);
    },
    onSuccess: () => {
      // Invalidate users list and user details
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.list(),
      });
    },
    ...cacheConfig.queries.user,
  });
}
