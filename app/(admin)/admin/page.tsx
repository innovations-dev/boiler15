"use client";

import { Suspense } from "react";
import { Activity, Building2, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/admin/use-admin-stats";

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  isLoading: boolean;
}) {
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

// Separate the stats display logic for better code splitting
function AdminStats() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Users"
        value={stats?.data?.totalUsers ?? 0}
        icon={Users}
        isLoading={isLoading}
      />
      <StatCard
        title="Organizations"
        value={stats?.data?.totalOrganizations ?? 0}
        icon={Building2}
        isLoading={isLoading}
      />
      <StatCard
        title="Active Sessions"
        value={stats?.data?.activeSessions ?? 0}
        icon={Activity}
        isLoading={isLoading}
      />
    </div>
  );
}

// Main page component becomes simpler
export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-3">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        }
      >
        <AdminStats />
      </Suspense>
    </div>
  );
}

// Separate skeleton component for reuse
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-16" />
      </CardContent>
    </Card>
  );
}
