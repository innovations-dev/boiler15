"use client";

import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

import { DashboardChart } from "@/app/dashboard/_components/dashboard-chart";
import { RecentActivity } from "@/app/dashboard/_components/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMetrics } from "@/hooks/dashboard/use-dashboard-metrics";

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = "",
  isLoading,
}: {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  prefix?: string;
  isLoading?: boolean;
}) {
  const formattedValue = prefix
    ? `${prefix}${value.toLocaleString()}`
    : value.toLocaleString();
  const isPositiveChange = change > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-7 w-[100px]" />
            <Skeleton className="mt-1 h-4 w-[60px]" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{formattedValue}</div>
            <p className="text-xs text-muted-foreground">
              {isPositiveChange ? "+" : ""}
              {change}% from last month
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={metrics?.revenue.total ?? 0}
          change={metrics?.revenue.change ?? 0}
          icon={DollarSign}
          prefix="$"
          isLoading={isLoading}
        />
        <MetricCard
          title="Subscriptions"
          value={metrics?.subscriptions.total ?? 0}
          change={metrics?.subscriptions.change ?? 0}
          icon={CreditCard}
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Users"
          value={metrics?.activeUsers.total ?? 0}
          change={metrics?.activeUsers.change ?? 0}
          icon={Users}
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Now"
          value={metrics?.currentlyActive.total ?? 0}
          change={metrics?.currentlyActive.change ?? 0}
          icon={Activity}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
