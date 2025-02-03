import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { handleHttpError } from "@/lib/query/error";
import { queryKeys } from "@/lib/query/keys";

/**
 * Input type for inviting a new member to the organization
 * @interface InviteMemberInput
 */
interface InviteMemberInput {
  email: string;
  role: string;
}

/**
 * Hook for inviting new members to the organization.
 *
 * @description
 * This hook provides functionality to invite new members to the organization,
 * handling the API call, success notifications, and cache invalidation.
 *
 * @example
 * ```tsx
 * function InviteMemberForm() {
 *   const { mutate: inviteMember, isPending } = useInviteMember();
 *
 *   const onSubmit = (data: InviteMemberInput) => {
 *     inviteMember(data);
 *   };
 *
 *   return (
 *     // Form implementation
 *   );
 * }
 * ```
 *
 * @returns {UseMutationResult} A mutation object containing:
 * - mutate: Function to trigger the invitation
 * - isPending: Boolean indicating if the invitation is in progress
 * - error: Any error that occurred during the mutation
 *
 * @throws {HttpError} When the API request fails
 *
 * @usecase
 * - Adding team members to an organization
 * - Sending invitation emails to new collaborators
 * - Managing organization access control
 *
 * @see {@link authClient.organization.inviteMember} for the underlying API call
 * @see {@link queryKeys.team.members} for cache invalidation details
 */
export function useInviteMember() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: async (data: InviteMemberInput) => {
      try {
        return await authClient.organization.inviteMember(data);
      } catch (error) {
        throw handleHttpError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.team.members("current"),
      });
      toast.success(
        "Invitation sent successfully! The member will receive an email shortly.",
        {
          duration: 5000,
        }
      );
    },
    errorMessage: "An unexpected error occurred. Please try again later.",
    ...cacheConfig.queries.organization,
  });
}
