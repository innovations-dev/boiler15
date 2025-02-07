"use client";

import { Activity, Building2, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/admin/use-admin-stats";
import type { AdminStats } from "@/lib/types/admin";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  isLoading: boolean;
}

function StatCard({ title, value, icon: Icon, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminStats() {
  const { data: response, isLoading } = useAdminStats();
  const stats = response?.data;

  // Type guard to ensure stats is of type AdminStats
  const isValidStats = (stats: unknown): stats is AdminStats => {
    if (!stats || typeof stats !== "object") return false;
    const s = stats as AdminStats;
    return (
      typeof s.totalUsers === "number" &&
      typeof s.totalOrganizations === "number" &&
      typeof s.activeSessions === "number"
    );
  };

  const validStats = isValidStats(stats) ? stats : null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Users"
        value={validStats?.totalUsers ?? 0}
        icon={Users}
        isLoading={isLoading}
      />
      <StatCard
        title="Organizations"
        value={validStats?.totalOrganizations ?? 0}
        icon={Building2}
        isLoading={isLoading}
      />
      <StatCard
        title="Active Sessions"
        value={validStats?.activeSessions ?? 0}
        icon={Activity}
        isLoading={isLoading}
      />
    </div>
  );
}

export function AdminStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
