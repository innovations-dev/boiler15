"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "@/hooks/auth/use-users";
import { userSelectSchema } from "@/lib/db/schema";
import { UserActions } from "./user-actions";
import { UsersListSkeleton } from "./users-list-skeleton";

export function UsersList() {
  const { data: users, isLoading } = useUsers();

  const parsedUsers = users?.data?.map((u) => userSelectSchema.parse(u));

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
