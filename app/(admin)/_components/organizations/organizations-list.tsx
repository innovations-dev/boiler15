"use client";

import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrganizations } from "@/hooks/organization/use-organizations";
import { OrganizationActions } from "./organization-actions";
import { OrganizationsListSkeleton } from "./organizations-list-skeleton";

export function OrganizationsList() {
  const { data: organizations, isLoading } = useOrganizations();

  if (isLoading) {
    return <OrganizationsListSkeleton />;
  }

  // Create a Map to store unique organizations by ID
  const uniqueOrganizations = new Map();
  organizations?.data?.forEach((org) => {
    if (!uniqueOrganizations.has(org.id)) {
      uniqueOrganizations.set(org.id, org);
    }
  });

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
        {Array.from(uniqueOrganizations.values()).map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>{org.slug || 0}</TableCell>
            <TableCell>
              {format(new Date(org.createdAt), "MMM d, yyyy")}
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
