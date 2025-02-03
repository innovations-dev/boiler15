/**
 * @fileoverview Hook for handling organization switching functionality with React Query
 * @module hooks/organization/use-switch-organization
 */

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useBaseMutation } from "@/hooks/query/use-base-mutation";
import { authClient } from "@/lib/auth/auth-client";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";

/**
 * Custom hook for switching between organizations in a multi-organization setup.
 * Handles the mutation, cache invalidation, and UI feedback when switching organizations.
 *
 * @returns {UseMutationResult} A mutation object for switching organizations
 *
 * @example
 * ```tsx
 * function OrganizationSwitcher() {
 *   const switchOrganization = useSwitchOrganization();
 *
 *   return (
 *     <Button
 *       onClick={() => switchOrganization.mutate("org-123")}
 *       disabled={switchOrganization.isPending}
 *     >
 *       Switch to Organization
 *     </Button>
 *   );
 * }
 * ```
 *
 * @example
 * // With error handling
 * ```tsx
 * function OrganizationList({ organizations }) {
 *   const switchOrganization = useSwitchOrganization();
 *
 *   const handleSwitch = async (orgId: string) => {
 *     try {
 *       await switchOrganization.mutateAsync(orgId);
 *     } catch (error) {
 *       // Handle error specifically
 *       console.error("Failed to switch organization:", error);
 *     }
 *   };
 *
 *   return (
 *     <ul>
 *       {organizations.map((org) => (
 *         <li key={org.id}>
 *           <Button
 *             onClick={() => handleSwitch(org.id)}
 *             disabled={switchOrganization.isPending}
 *           >
 *             Switch to {org.name}
 *           </Button>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @throws {BetterAuthAPIError} When the organization switch fails
 *
 * @see {@link authClient} For the underlying authentication client
 * @see {@link useBaseMutation} For the base mutation hook being used
 */
export function useSwitchOrganization() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: async (organizationId: string) => {
      const result = await authClient.organization.setActive({
        organizationId,
      });
      if (result.error) throw result.error;
      return result;
    },
    onSuccess: async () => {
      // First invalidate all relevant queries
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.organizations.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.current(),
        }),
      ]);

      // Show success message before refresh
      toast.success("Organization switched successfully");

      // Use a slight delay before refresh to ensure toast is visible
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    errorMessage: "Failed to switch organization",
    ...cacheConfig.queries.organization,
  });
}
