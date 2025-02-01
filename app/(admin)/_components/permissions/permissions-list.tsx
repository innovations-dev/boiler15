"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import { USER_ROLE_LABELS, USER_ROLES } from "@/lib/constants/roles";
import { userSelectSchema } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";
import { PermissionActions } from "./permission-actions";
import { PermissionsListSkeleton } from "./permissions-list-skeleton";

export function PermissionsList() {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const response = await authClient.admin.listUsers({
        query: { limit: 100 },
      });
      return {
        data: {
          users:
            response.data?.users.map((u) => userSelectSchema.parse(u)) ?? [],
        },
      };
    },
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load users";
        toast.error(message);
      },
    },
  });

  if (isLoading) {
    return <PermissionsListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h2 className="mt-6 text-xl font-semibold text-destructive">
            Error loading users
          </h2>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const parsedUsers = users?.data?.users ?? [];

  // Group users by role
  const usersByRole = parsedUsers.reduce(
    (acc, user) => {
      const role = (
        user.role || "USER"
      ).toUpperCase() as keyof typeof USER_ROLES; // Ensure uppercase
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(user);
      return acc;
    },
    {} as Record<keyof typeof USER_ROLES, any[]>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Users</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(USER_ROLES).map(([role]) => (
          <TableRow key={role}>
            <TableCell className="font-medium">
              {USER_ROLE_LABELS[role as keyof typeof USER_ROLES]}
            </TableCell>
            <TableCell>
              {role === "ADMIN"
                ? "Full system access and management capabilities"
                : role === "MODERATOR"
                  ? "Content moderation and user management"
                  : "Standard user access"}
            </TableCell>
            <TableCell>
              {usersByRole[role as keyof typeof USER_ROLES]?.length || 0}
            </TableCell>
            <TableCell className="text-right">
              <PermissionActions
                role={role as keyof typeof USER_ROLES}
                userCount={
                  usersByRole[role as keyof typeof USER_ROLES]?.length || 0
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
