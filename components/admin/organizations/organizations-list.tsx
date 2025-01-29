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
import { OrganizationActions } from "./organization-actions";
import { OrganizationsListSkeleton } from "./organizations-list-skeleton";

export function OrganizationsList() {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => authClient.organization.list(),
  });

  if (isLoading) {
    return <OrganizationsListSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations?.data?.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>{org.slug || 0}</TableCell>
            <TableCell>
              {new Date(org.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <OrganizationActions organization={org} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
