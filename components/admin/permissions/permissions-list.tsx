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
import { PermissionActions } from "./permission-actions";
import { PermissionsListSkeleton } from "./permissions-list-skeleton";

export function PermissionsList() {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => authClient.admin.listRoles(),
  });

  if (isLoading) {
    return <PermissionsListSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles?.data?.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell>{role.description || "—"}</TableCell>
            <TableCell>{role.userCount || 0}</TableCell>
            <TableCell>
              {new Date(role.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <PermissionActions role={role} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
