import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getAdminStatsAction } from "@/app/(admin)/_actions/stats";
import { cacheConfig } from "@/lib/query/cache-config";
import { queryKeys } from "@/lib/query/keys";
import { createApiResponseSchema } from "@/lib/schemas/api-types";
import { AdminStatsResponse, adminStatsSchema } from "@/lib/types/admin";
import { useApiQuery } from "../query/use-api-query";

/**
 * Transforms the API response by providing default values for missing data
 * @param {AdminStatsResponse} response - The raw API response
 * @returns {Object} Normalized response with default values
 */
const defaultResponse = (response: AdminStatsResponse) => {
  return {
    data: response.data ?? {
      totalUsers: 0,
      totalOrganizations: 0,
      activeSessions: 0,
    },
  };
};

/**
 * Hook for fetching and managing admin statistics
 *
 * @example
 * ```tsx
 * function AdminDashboard() {
 *   const { data, isLoading, error } = useAdminStats();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error loading stats</div>;
 *
 *   return (
 *     <div>
 *       <p>Total Users: {data.totalUsers}</p>
 *       <p>Total Organizations: {data.totalOrganizations}</p>
 *       <p>Active Sessions: {data.activeSessions}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {Object} Query result object containing:
 * - data: The admin statistics data
 * - isLoading: Boolean indicating if the query is loading
 * - error: Any error that occurred during the query
 * - refetch: Function to manually refetch the data
 *
 * @see {@link getAdminStatsAction} for the underlying API call
 * @see {@link adminStatsSchema} for the data structure
 */
export function useAdminStats() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.admin.stats(),
      queryFn: async () => {
        const response = await getAdminStatsAction();
        return defaultResponse(response);
      },
    });
  }, [queryClient]);

  return useApiQuery(
    queryKeys.admin.stats(),
    async () => {
      const response = await getAdminStatsAction();
      return defaultResponse(response);
    },
    createApiResponseSchema(adminStatsSchema),
    {
      ...cacheConfig.queries.default,
    }
  );
}
