import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { CustomSession } from "better-auth";

import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { OrganizationDashboard } from "@/components/dashboard/organization-dashboard";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const data = (await auth.api.getSession({
    headers: await headers(),
  })) as CustomSession | null;

  if (!data?.session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 px-8">
        <Suspense fallback={<DashboardSkeleton />}>
          {data?.user?.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <OrganizationDashboard
              organizationId={data?.session.activeOrganizationId ?? undefined}
            />
          )}
        </Suspense>
      </main>
    </div>
  );
}
