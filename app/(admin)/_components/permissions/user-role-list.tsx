"use client";

import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import { UserRole } from "@/lib/constants/roles";
import { UserSelectSchema } from "@/lib/db/schema";

export function UserRoleList({ role }: { role: UserRole }) {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users", role],
    queryFn: () =>
      authClient.admin.listUsers({
        query: {
          limit: 10,
        },
      }),
  });

  const parsedUsers = users?.data?.users.map((u) => UserSelectSchema.parse(u));

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parsedUsers
          ?.filter((user) => user.role === role)
          .map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
