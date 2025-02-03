import { useQueryClient } from "@tanstack/react-query";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

/**
 * Custom hook for banning users in an admin context.
 *
 * @remarks
 * This hook provides functionality to ban users and automatically invalidates
 * relevant queries to ensure UI consistency after the ban action.
 *
 * @returns {Object} Mutation object with the following properties:
 * - mutate: Function to trigger the ban action
 * - isLoading: Boolean indicating if the ban action is in progress
 * - error: Any error that occurred during the ban action
 *
 * @example
 * ```tsx
 * function AdminUserList() {
 *   const { mutate: banUser, isLoading } = useBanUser();
 *
 *   const handleBanUser = (userId: string) => {
 *     banUser(userId, {
 *       onSuccess: () => {
 *         toast.success('User banned successfully');
 *       }
 *     });
 *   };
 *
 *   return (
 *     <Button
 *       onClick={() => handleBanUser('user-123')}
 *       disabled={isLoading}
 *     >
 *       Ban User
 *     </Button>
 *   );
 * }
 * ```
 *
 * @see {@link useBaseMutation} For the underlying mutation implementation
 * @see {@link authClient.admin.banUser} For the API call implementation
 */
export function useBanUser() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: (userId: string) => authClient.admin.banUser({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.permissions(100), // Default limit
      });
    },
    errorMessage: "Failed to ban user",
    ...cacheConfig.queries.user,
  });
}
