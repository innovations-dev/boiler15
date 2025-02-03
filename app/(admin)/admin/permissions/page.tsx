import { Suspense } from "react";

import { AssignRoleButton } from "@/app/(admin)/_components/permissions/assign-role-button";
import { PermissionsList } from "@/app/(admin)/_components/permissions/permissions-list";
import { PermissionsListSkeleton } from "@/app/(admin)/_components/permissions/permissions-list-skeleton";

export const dynamic = "force-dynamic";

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Permissions</h1>
          <p className="text-muted-foreground">
            Manage roles and access control
          </p>
        </div>
        <AssignRoleButton />
      </div>
      <Suspense fallback={<PermissionsListSkeleton />}>
        <PermissionsList />
      </Suspense>
    </div>
  );
}
