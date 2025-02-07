"use client";

import { Activity, Database, Server } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSystemHealth } from "@/hooks/admin/use-system-health";

interface HealthMetricProps {
  title: string;
  status: "healthy" | "warning" | "error" | "unknown";
  metric: string;
  icon: React.ElementType;
  isLoading?: boolean;
}

function HealthMetric({
  title,
  status,
  metric,
  icon: Icon,
  isLoading,
}: HealthMetricProps) {
  const statusColors = {
    healthy: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    unknown: "text-gray-500",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${statusColors[status]}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold">{metric}</div>
            <p className={`text-xs ${statusColors[status]}`}>
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SystemHealth() {
  const { data: health, isLoading } = useSystemHealth();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">System Health</h2>
        <p className="text-sm text-muted-foreground">
          Current system performance and status
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <HealthMetric
          title="API Response Time"
          status={health?.api.status ?? "unknown"}
          metric={`${health?.api.responseTime ?? 0}ms`}
          icon={Activity}
          isLoading={isLoading}
        />
        <HealthMetric
          title="Database Status"
          status={health?.database.status ?? "unknown"}
          metric={`${health?.database.connections ?? 0} conn.`}
          icon={Database}
          isLoading={isLoading}
        />
        <HealthMetric
          title="Server Load"
          status={health?.server.status ?? "unknown"}
          metric={`${health?.server.load ?? 0}%`}
          icon={Server}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export function SystemHealthSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-1 h-4 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16" />
              <Skeleton className="mt-2 h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
