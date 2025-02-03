import { useQueryClient } from "@tanstack/react-query";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { handleHttpError } from "@/lib/query/error";
import { queryKeys } from "@/lib/query/keys";

interface RemoveMemberInput {
  memberIdOrEmail: string;
}

/**
 * Custom hook for removing a member from the current organization.
 *
 * @remarks
 * This hook provides mutation functionality to remove organization members using their ID or email.
 * It automatically invalidates the team members query cache upon successful removal.
 *
 * @example
 * ```tsx
 * function MemberList() {
 *   const { mutate: removeMember, isPending } = useRemoveMember();
 *
 *   const handleRemove = (memberIdOrEmail: string) => {
 *     removeMember({ memberIdOrEmail }, {
 *       onSuccess: () => {
 *         toast.success('Member removed successfully');
 *       }
 *     });
 *   };
 *
 *   return (
 *     <button
 *       onClick={() => handleRemove('user@example.com')}
 *       disabled={isPending}
 *     >
 *       Remove Member
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns {UseMutationResult} A mutation result object containing:
 * - `mutate` - Function to trigger the member removal
 * - `isPending` - Boolean indicating if the removal is in progress
 * - `error` - Any error that occurred during the removal
 * - `isSuccess` - Boolean indicating if the removal was successful
 *
 * @throws {HttpError} When the API request fails
 */
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: async ({ memberIdOrEmail }: RemoveMemberInput) => {
      const response = await authClient.organization.removeMember({
        memberIdOrEmail,
      });
      if (response.error) {
        throw handleHttpError(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.team.members("current"),
      });
    },
    errorMessage: "Failed to remove member",
    ...cacheConfig.queries.organization,
  });
}
