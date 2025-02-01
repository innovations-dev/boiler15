"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { z } from "zod";

import { getOrganizationsAction } from "@/app/(admin)/_actions/organization";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { omittedOrganizationSelectSchema } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import { OrganizationActions } from "./organization-actions";
import { OrganizationsListSkeleton } from "./organizations-list-skeleton";

type Organization = z.infer<typeof omittedOrganizationSelectSchema>;

// Separate the table content into a client component
function OrganizationsTableContent({
  organizations,
}: {
  organizations: Organization[];
}) {
  return (
    <TableBody>
      {organizations?.map((organization) => (
        <TableRow key={organization.id}>
          <TableCell>{organization.name}</TableCell>
          <TableCell>{organization.slug}</TableCell>
          <TableCell>
            {organization.createdAt
              ? format(new Date(organization.createdAt), "MMM d, yyyy")
              : "N/A"}
          </TableCell>
          <TableCell>
            <OrganizationActions organization={organization} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export function OrganizationsList() {
  const { data: organizations, isLoading } = useQuery({
    queryKey: queryKeys.organizations.list(),
    queryFn: getOrganizationsAction,
    staleTime: 1000 * 60,
  });

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
        <Suspense fallback={<OrganizationsListSkeleton />}>
          {organizations && (
            <OrganizationsTableContent organizations={organizations} />
          )}
        </Suspense>
      </Table>
    </div>
  );
}
