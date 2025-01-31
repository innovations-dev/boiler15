import { Suspense } from "react";

import { OrganizationsList } from "@/components/admin/organizations/organizations-list";
import { OrganizationsListSkeleton } from "@/components/admin/organizations/organizations-list-skeleton";
import { OrganizationSwitcher } from "@/components/shared/organization-switcher";

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            Manage organizations and their members
          </p>
        </div>
        <OrganizationSwitcher />
      </div>
      <Suspense fallback={<OrganizationsListSkeleton />}>
        <OrganizationsList />
      </Suspense>
    </div>
  );
}
