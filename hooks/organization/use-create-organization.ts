import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

/**
 * @module hooks/organization
 * @description Custom hook for creating a new organization and setting it as active
 */

/**
 * Custom hook for creating a new organization.
 *
 * This hook handles:
 * - Creating a new organization
 * - Setting the created organization as active
 * - Invalidating relevant queries
 * - Showing success/error notifications
 * - Reloading the page to reflect changes
 *
 * @example
 * ```tsx
 * function CreateOrgForm() {
 *   const createOrg = useCreateOrganization();
 *
 *   async function handleSubmit(data: { name: string; slug: string }) {
 *     await createOrg.mutateAsync(data);
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       // ... form fields
 *     </form>
 *   );
 * }
 * ```
 *
 * @returns {UseMutationResult} Returns a mutation object with methods like mutate, mutateAsync, and status indicators
 *
 * @throws Will show an error toast if organization creation fails
 *
 * @see {@link useBaseMutation} For the underlying mutation implementation
 * @see {@link authClient.organization} For the organization-related API methods
 */
export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const result = await authClient.organization.create(data);
      await authClient.organization.setActive({
        organizationId: result.data?.id,
      });
      return result;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.organizations.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.all,
        }),
      ]);
      toast.success("Organization created successfully");
      window.location.reload();
    },
    errorMessage: "Failed to create organization",
    ...cacheConfig.queries.organization,
  });
}
