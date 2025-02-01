import { Suspense } from "react";

import { CreatePermissionButton } from "@/app/(admin)/_components/permissions/create-permission-button";
import { PermissionsList } from "@/app/(admin)/_components/permissions/permissions-list";
import { PermissionsListSkeleton } from "@/app/(admin)/_components/permissions/permissions-list-skeleton";

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
        <CreatePermissionButton />
      </div>
      <Suspense fallback={<PermissionsListSkeleton />}>
        <PermissionsList />
      </Suspense>
    </div>
  );
}
