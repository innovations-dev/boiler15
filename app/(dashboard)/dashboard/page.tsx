import { Suspense } from "react";
import { Activity, Building2, Settings, Users } from "lucide-react";

import { getActiveOrganization } from "@/app/(dashboard)/_actions/get-active-organization";
import { DashboardCard } from "@/components/dashboard/card";
import { DashboardHeader, DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ENTITY_TYPES } from "@/lib/services/audit-log";
import { auditLogService } from "@/lib/services/audit-log-service";
import { organizationService } from "@/lib/services/organization-service";
import { cn } from "@/lib/utils";

interface OrganizationPreferences {
  theme?: string;
  features?: {
    billing?: boolean;
    analytics?: boolean;
  };
}

async function OrganizationStats() {
  const activeOrg = await getActiveOrganization();
  const [stats, preferences] = await Promise.all([
    organizationService.getOrganizationStats(activeOrg.id),
    organizationService.getOrganizationPreferences(activeOrg.id),
  ]);

  const typedPreferences = preferences as OrganizationPreferences;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>Organization</DashboardCard.Title>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </DashboardCard.Header>
        <DashboardCard.Content>
          <div className="text-2xl font-bold">{activeOrg.name}</div>
          <p className="text-xs text-muted-foreground">{activeOrg.slug}</p>
          {typedPreferences?.theme && (
            <p className="mt-2 text-xs text-muted-foreground">
              Theme: {typedPreferences.theme}
            </p>
          )}
          {typedPreferences?.features && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(typedPreferences.features).map(
                ([key, enabled]) => (
                  <span
                    key={key}
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs",
                      enabled
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {key}
                  </span>
                )
              )}
            </div>
          )}
        </DashboardCard.Content>
      </DashboardCard>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>Members</DashboardCard.Title>
          <Users className="h-4 w-4 text-muted-foreground" />
        </DashboardCard.Header>
        <DashboardCard.Content>
          <div className="text-2xl font-bold">{stats.activeMembers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingInvitations} pending invitations
          </p>
        </DashboardCard.Content>
      </DashboardCard>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title>Settings</DashboardCard.Title>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </DashboardCard.Header>
        <DashboardCard.Content>
          <Button variant="outline" className="w-full" asChild>
            <a href="/organizations/settings">Manage Organization</a>
          </Button>
        </DashboardCard.Content>
      </DashboardCard>
    </div>
  );
}

async function RecentActivity() {
  const activeOrg = await getActiveOrganization();
  const activities = await auditLogService.getRecentActivity({
    entityType: ENTITY_TYPES.ORGANIZATION,
    entityId: activeOrg.id,
    limit: 5,
  });

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>Recent Activity</DashboardCard.Title>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </DashboardCard.Header>
      <DashboardCard.Content>
        <ScrollArea className="h-[200px]">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.actorId}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toISOString().split("T")[0]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DashboardCard.Content>
    </DashboardCard>
  );
}

function OrganizationStatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <DashboardCard key={i}>
          <DashboardCard.Header>
            <Skeleton className="h-4 w-[100px]" />
          </DashboardCard.Header>
          <DashboardCard.Content>
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-4 w-[80px]" />
          </DashboardCard.Content>
        </DashboardCard>
      ))}
    </div>
  );
}

function RecentActivityLoading() {
  return (
    <DashboardCard>
      <DashboardCard.Header>
        <Skeleton className="h-4 w-[100px]" />
      </DashboardCard.Header>
      <DashboardCard.Content>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="h-3 w-[60px]" />
            </div>
          ))}
        </div>
      </DashboardCard.Content>
    </DashboardCard>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your organization"
      />
      <div className="grid gap-6">
        <Suspense fallback={<OrganizationStatsLoading />} key="org-stats">
          <OrganizationStats />
        </Suspense>
        <Suspense fallback={<RecentActivityLoading />} key="recent-activity">
          <RecentActivity />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
