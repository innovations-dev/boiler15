import { Suspense } from "react";

import { OrganizationsList } from "./organizations-list";
import { OrganizationsListSkeleton } from "./organizations-list-skeleton";

export function OrganizationsListWrapper() {
  return (
    <Suspense fallback={<OrganizationsListSkeleton />}>
      <OrganizationsList />
    </Suspense>
  );
}
