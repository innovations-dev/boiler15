/**
 * @fileoverview Hooks for managing organization data fetching and caching using React Query
 * @module hooks/organization/use-organizations
 */

// See @/app/_providers/query-client-provider.tsx for the default options for this query

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getOrganizationsAction } from "@/app/(admin)/_actions/organization";
import { useApiQuery } from "@/hooks/query/use-api-query";
import {
  omittedOrganizationSelectSchema,
  type Organization,
} from "@/lib/db/schema";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import {
  ApiErrorCode,
  ApiResponse,
  createApiResponseSchema,
} from "@/lib/schemas/api-types";

/**
 * Configuration options for organization hooks
 * @interface UseOrganizationsOptions
 * @property {Organization[]} [initialData] - Optional initial data for the organizations query
 */
interface UseOrganizationsOptions {
  initialData?: Organization[];
}

/**
 * Helper function to format the API response
 * @param {Awaited<ReturnType<typeof getOrganizationsAction>>} response - Raw response from the organizations action
 * @returns {ApiResponse<Organization[]>} Formatted API response
 */
const defaultResponse = (
  response: Awaited<ReturnType<typeof getOrganizationsAction>>
): ApiResponse<Organization[]> => ({
  data: response.data ?? [],
  error: response.error
    ? {
        code: (response.error.code as ApiErrorCode) ?? "UNKNOWN_ERROR",
        message: response.error.message,
        status: response.error.status ?? 500,
      }
    : undefined,
});

/**
 * Hook for fetching and caching organizations with error handling included in the response
 *
 * @example
 * ```tsx
 * function OrganizationsList() {
 *   const { data, isLoading, error } = useOrganizations();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data?.map(org => (
 *         <li key={org.id}>{org.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @returns {UseQueryResult} React Query result object containing organizations data, loading state, and error information
 */
export function useOrganizations() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.organizations.list(),
      queryFn: async () => {
        const response = await getOrganizationsAction();
        return defaultResponse(response);
      },
    });
  }, [queryClient]);

  return useApiQuery(
    queryKeys.organizations.list(),
    async () => {
      const response = await getOrganizationsAction();
      return defaultResponse(response);
    },
    createApiResponseSchema(omittedOrganizationSelectSchema.array()),
    {
      ...cacheConfig.queries.organization,
    }
  );
}

/**
 * Alternative hook for fetching organizations that throws errors instead of including them in the response
 * Useful when you want to handle errors at a higher level or with an error boundary
 *
 * @example
 * ```tsx
 * function OrganizationsList() {
 *   const { data, isLoading } = useOrganizationsApi();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <ul>
 *       {data?.map(org => (
 *         <li key={org.id}>{org.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @param {UseOrganizationsOptions} options - Configuration options for the hook
 * @param {Organization[]} [options.initialData] - Optional initial data for the organizations query
 * @throws {Error} Throws an error if the API request fails
 * @returns {UseQueryResult} React Query result object containing organizations data and loading state
 */
export function useOrganizationsApi({}: UseOrganizationsOptions = {}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.organizations.list(),
      queryFn: async () => {
        const response = await getOrganizationsAction();
        if (response.error) throw new Error(response.error.message);
        return { data: response.data ?? [] };
      },
    });
  }, [queryClient]);

  return useApiQuery(
    queryKeys.organizations.list(),
    async () => {
      const response = await getOrganizationsAction();
      console.log("🚀 ~ response:", response);
      if (response.error) throw new Error(response.error.message);
      return { data: response.data ?? [] };
    },
    createApiResponseSchema(omittedOrganizationSelectSchema.array()),
    {
      ...cacheConfig.queries.organization,
    }
  );
}
