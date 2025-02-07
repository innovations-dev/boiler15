import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";

interface SystemHealth {
  api: {
    status: "healthy" | "warning" | "error" | "unknown";
    responseTime: number;
  };
  database: {
    status: "healthy" | "warning" | "error" | "unknown";
    connections: number;
  };
  server: {
    status: "healthy" | "warning" | "error" | "unknown";
    load: number;
  };
}

async function fetchSystemHealth(): Promise<SystemHealth> {
  const response = await fetch("/api/admin/system/health");
  if (!response.ok) {
    throw new Error("Failed to fetch system health");
  }
  return response.json();
}

/**
 * Hook for fetching system health metrics
 *
 * @returns Object containing system health data and loading state
 *
 * @example
 * ```tsx
 * function HealthDashboard() {
 *   const { data: health, isLoading } = useSystemHealth();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <div>API Status: {health.api.status}</div>
 *       <div>DB Connections: {health.database.connections}</div>
 *       <div>Server Load: {health.server.load}%</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: queryKeys.admin.health(),
    queryFn: fetchSystemHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
