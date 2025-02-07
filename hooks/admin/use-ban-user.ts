import { useQueryClient } from "@tanstack/react-query";

import { banUserAction } from "@/app/(admin)/_actions/user";
import type { BanUserInput } from "@/app/(admin)/_actions/user.types";
import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

/**
 * Custom hook for banning users in an admin context.
 *
 * @remarks
 * This hook provides functionality to ban users and automatically invalidates
 * relevant queries to ensure UI consistency after the ban action.
 * Includes audit logging for all ban actions.
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
 *     banUser({ userId, reason: "Violation of terms" }, {
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
 * @see {@link banUserAction} For the server action implementation
 */
export function useBanUser() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: async (input: BanUserInput) => {
      return banUserAction(input);
    },
    onSuccess: () => {
      // Invalidate users list and user details
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.list(),
      });
    },
    errorMessage: "Failed to ban user",
    ...cacheConfig.queries.user,
  });
}
