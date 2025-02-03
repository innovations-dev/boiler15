import { OrganizationSwitcherWithSuspense } from "@/components/shared/organization-switcher";
import { OrganizationsListWrapper } from "../../_components/organizations/organizations-list-wrapper";

export const dynamic = "force-dynamic";

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
        <OrganizationSwitcherWithSuspense />
      </div>
      <OrganizationsListWrapper />
    </div>
  );
}
