/**
 * @fileoverview Provides mutation hooks for organization management operations
 * @module hooks/organization/use-organization-mutation
 */

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

/**
 * Hook for deleting an organization.
 *
 * @example
 * ```tsx
 * function DeleteOrgButton({ organizationId }: { organizationId: string }) {
 *   const { mutate: deleteOrg, isPending } = useDeleteOrganization();
 *
 *   return (
 *     <Button
 *       onClick={() => deleteOrg(organizationId)}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Deleting...' : 'Delete Organization'}
 *     </Button>
 *   );
 * }
 * ```
 *
 * @returns {Object} Mutation object with the following properties:
 * - mutate: Function to trigger the delete operation
 * - isPending: Boolean indicating if deletion is in progress
 * - error: Any error that occurred during deletion
 * - reset: Function to reset the mutation state
 *
 * @throws {Error} When the organization deletion fails
 *
 * @see {@link useBaseMutation} For the underlying mutation implementation
 * @see {@link authClient.organization.delete} For the API call details
 */
export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: (organizationId: string) =>
      authClient.organization.delete({ organizationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.list(),
      });
      toast.success("Organization deleted successfully");
    },
    errorMessage: "Failed to delete organization",
    ...cacheConfig.queries.organization,
  });
}
