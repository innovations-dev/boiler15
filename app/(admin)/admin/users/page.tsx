import { Suspense } from "react";

import { CreateUserButton } from "@/app/(admin)/_components/users/create-user-button";
import { UsersList } from "@/app/(admin)/_components/users/users-list";
import { UsersListSkeleton } from "@/app/(admin)/_components/users/users-list-skeleton";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <CreateUserButton />
      </div>
      <Suspense fallback={<UsersListSkeleton />}>
        <UsersList />
      </Suspense>
    </div>
  );
}
