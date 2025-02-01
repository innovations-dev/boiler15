"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrganizations } from "@/hooks/organization/use-organizations";
import { FormattedDate } from "./formatted-date";
import { OrganizationActions } from "./organization-actions";
import { OrganizationsListSkeleton } from "./organizations-list-skeleton";

export function OrganizationsList() {
  const { data: organizations, isLoading } = useOrganizations();

  if (isLoading) {
    return <OrganizationsListSkeleton />;
  }

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {!organizations?.length ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No organizations found
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((organization) => (
              <TableRow key={organization.id}>
                <TableCell>{organization.name}</TableCell>
                <TableCell>{organization.slug}</TableCell>
                <TableCell>
                  <FormattedDate date={organization.createdAt} />
                </TableCell>
                <TableCell>
                  <OrganizationActions organization={organization} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
