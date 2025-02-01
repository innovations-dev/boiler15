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

  if (!organizations?.data?.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h2 className="mt-6 text-xl font-semibold">No organizations</h2>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            You haven't created any organizations yet. Create one to get
            started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.data.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>{org.slug}</TableCell>
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
