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
import { queryKeys } from "@/lib/query/keys";
import { PermissionActions } from "./permission-actions";
import { PermissionsListSkeleton } from "./permissions-list-skeleton";

export function PermissionsList() {
  const { data: users, isLoading } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const response = await authClient.admin.listUsers({
        query: { limit: 100 },
      });
      console.log("Raw API Response:", response); // Debug log 1
      const parsedData = {
        data: {
          users:
            response.data?.users.map((u) => UserSelectSchema.parse(u)) ?? [],
        },
      };
      console.log("Parsed Data:", parsedData); // Debug log 2
      return parsedData;
    },
  });

  if (isLoading) {
    return <PermissionsListSkeleton />;
  }

  const parsedUsers = users?.data?.users ?? [];
  console.log("Parsed Users:", parsedUsers); // Debug log 3

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

  console.log("Users By Role:", usersByRole); // Debug log 4
  console.log("USER_ROLES:", USER_ROLES); // Debug log 5

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
