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
        {users?.data?.users?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            {/* <TableCell>{user.status}</TableCell> */}
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
