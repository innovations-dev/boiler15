"use client";

import { useQuery } from "@tanstack/react-query";

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
import { UserSelectSchema } from "@/lib/db/schema";
import { PermissionActions } from "./permission-actions";
import { PermissionsListSkeleton } from "./permissions-list-skeleton";

export function PermissionsList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      authClient.admin.listUsers({
        query: {
          limit: 10,
        },
      }),
  });

  if (isLoading) {
    return <PermissionsListSkeleton />;
  }

  const parsedUsers = UserSelectSchema.safeParse(users?.data?.users);
  if (!parsedUsers.success) {
    console.log(parsedUsers.error.message);
    return <div>Error loading users</div>;
  }

  // Group users by role
  const usersByRole = users?.data?.users?.reduce(
    (acc, user) => {
      const role = user.role || "user";
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(user);
      return acc;
    },
    {} as Record<string, any[]>
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
            <TableCell>{usersByRole?.[role]?.length || 0}</TableCell>
            <TableCell className="text-right">
              <PermissionActions
                role={role as keyof typeof USER_ROLES}
                userCount={usersByRole?.[role]?.length || 0}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
