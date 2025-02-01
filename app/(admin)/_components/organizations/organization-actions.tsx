"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteOrganization } from "@/hooks/organization/use-organization-mutation";
import type { Organization } from "@/lib/db/schema";

interface OrganizationActionsProps {
  organization: Organization;
}

export function OrganizationActions({
  organization,
}: OrganizationActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteOrganization, isPending } = useDeleteOrganization();

  const handleDelete = () => {
    if (isPending) return;

    deleteOrganization(organization.id, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            // TODO: Implement view members
            toast.info("View members feature coming soon");
            setIsOpen(false);
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          View Members
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash className="mr-2 h-4 w-4" />
          {isPending ? "Deleting..." : "Delete Organization"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
