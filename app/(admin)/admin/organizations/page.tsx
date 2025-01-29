import { Suspense } from "react";

import { CreateOrganizationButton } from "@/components/admin/organizations/create-organization-button";
import { OrganizationsList } from "@/components/admin/organizations/organizations-list";
import { OrganizationsListSkeleton } from "@/components/admin/organizations/organizations-list-skeleton";

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
        <CreateOrganizationButton />
      </div>
      <Suspense fallback={<OrganizationsListSkeleton />}>
        <OrganizationsList />
      </Suspense>
    </div>
  );
}
