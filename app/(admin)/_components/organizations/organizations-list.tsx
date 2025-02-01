"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
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
import { isQueryError } from "@/lib/query/types";
import { OrganizationActions } from "./organization-actions";
import { OrganizationsListSkeleton } from "./organizations-list-skeleton";

type Organization = z.infer<typeof omittedOrganizationSelectSchema>;

interface OrganizationsListClientProps {
  initialOrganizations: Organization[];
}

export function OrganizationsListClient({
  initialOrganizations,
}: OrganizationsListClientProps) {
  const { data: organizations } = useQuery({
    queryKey: queryKeys.organizations.list(),
    queryFn: getOrganizationsAction,
    initialData: initialOrganizations,
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load organizations";
        toast.error(message);
      },
    },
  });

  if (!organizations?.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h2 className="mt-6 text-xl font-semibold">No organizations</h2>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            You haven't created any organizations yet.
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
        {organizations.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>{org.slug}</TableCell>
            <TableCell>
              {org.createdAt
                ? format(new Date(org.createdAt), "MMM d, yyyy")
                : "N/A"}
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

export function OrganizationsList() {
  const {
    data: organizations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.organizations.list(),
    queryFn: getOrganizationsAction,
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load organizations";
        toast.error(message);
      },
    },
  });

  if (isLoading) {
    return <OrganizationsListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h2 className="mt-6 text-xl font-semibold text-destructive">
            Error loading organizations
          </h2>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  if (!organizations?.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h2 className="mt-6 text-xl font-semibold">No organizations</h2>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            You haven't created any organizations yet.
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
        {organizations.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>{org.slug}</TableCell>
            <TableCell>
              {org.createdAt
                ? format(new Date(org.createdAt), "MMM d, yyyy")
                : "N/A"}
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
