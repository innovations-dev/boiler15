"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, Users } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteOrganization } from "@/hooks/organization/use-organization-mutation";
import type { omittedOrganizationSelectSchema } from "@/lib/db/schema";

interface OrganizationActionsProps {
  organization: z.infer<typeof omittedOrganizationSelectSchema>;
}

export function OrganizationActions({
  organization,
}: OrganizationActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { mutate: deleteOrganization, isPending } = useDeleteOrganization();

  const handleDelete = () => {
    if (isPending) return;
    deleteOrganization(organization.id, {
      onSuccess: () => {
        setIsOpen(false);
        setShowConfirmDialog(false);
      },
    });
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              toast.info("View members feature coming soon");
              setIsOpen(false);
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            View Members
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              setShowConfirmDialog(true);
              setIsOpen(false);
            }}
            disabled={isPending}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChangeAction={setShowConfirmDialog}
        title="Delete organization?"
        description={`Are you sure you want to delete ${organization.name}? This action cannot be undone. All members will lose access and all data will be permanently deleted.`}
        onConfirmAction={handleDelete}
        isLoading={isPending}
        variant="destructive"
        confirmText="Delete"
        loadingText="Deleting..."
      />
    </>
  );
}
