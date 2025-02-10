"use client";

import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { useSession } from "@/hooks/auth/use-session";
import { queryKeys } from "@/lib/query/keys";
import { DashboardSkeleton } from "./dashboard-skeleton";

export function AdminDashboard() {
  const { requireAdmin } = useSession();

  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const content = isLoading ? (
    <DashboardSkeleton />
  ) : (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <h3 className="font-semibold">Total Users</h3>
        <p className="text-2xl">{stats?.totalUsers ?? 0}</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">Total Organizations</h3>
        <p className="text-2xl">{stats?.totalOrganizations ?? 0}</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">Active Users</h3>
        <p className="text-2xl">{stats?.activeUsers ?? 0}</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold">System Health</h3>
        <p className="text-2xl">{stats?.systemHealth ?? "Good"}</p>
      </Card>
    </div>
  );

  return content;
}
