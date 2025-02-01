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
import { UserSelectSchema } from "@/lib/db/schema";
import { UserActions } from "./user-actions";
import { UsersListSkeleton } from "./users-list-skeleton";

export function UsersList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      authClient.admin.listUsers({
        query: {
          limit: 10,
        },
      }),
  });

  const parsedUsers = users?.data?.users.map((u) => UserSelectSchema.parse(u));

  if (isLoading) {
    return <UsersListSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parsedUsers?.map((user) => (
          <TableRow key={user.id} className="text-center">
            <TableCell className="font-medium">{user.email}</TableCell>
            <TableCell>{user.role || "user"}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset">
                Active
              </span>
            </TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <UserActions user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
