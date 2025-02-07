import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";

interface DashboardMetrics {
  revenue: {
    total: number;
    change: number;
  };
  subscriptions: {
    total: number;
    change: number;
  };
  activeUsers: {
    total: number;
    change: number;
  };
  currentlyActive: {
    total: number;
    change: number;
  };
}

async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await fetch("/api/dashboard/metrics");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard metrics");
  }
  return response.json();
}

/**
 * Hook for fetching dashboard metrics
 *
 * @returns Object containing dashboard metrics and loading state
 *
 * @example
 * ```tsx
 * function DashboardMetrics() {
 *   const { data: metrics, isLoading } = useDashboardMetrics();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <div>Revenue: ${metrics.revenue.total}</div>
 *       <div>Change: {metrics.revenue.change}%</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDashboardMetrics() {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: fetchDashboardMetrics,
  });
}
