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

export function OrganizationActions({ organization }: { organization: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteOrganization } = useDeleteOrganization();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            toast.info("View members feature coming soon");
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          View Members
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => deleteOrganization(organization.id)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
