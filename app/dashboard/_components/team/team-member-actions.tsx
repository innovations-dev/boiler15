"use client";

import { useState } from "react";
import { MoreHorizontal, Shield, Trash } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveMember } from "@/hooks/organization/use-remove-member";
import type { TeamMember } from "@/lib/db/schema";

export function TeamMemberActions({ member }: { member: TeamMember }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isOwner = member.role === "owner";

  const { mutate: removeMember, isPending } = useRemoveMember();

  const handleRemoveMember = () => {
    removeMember(
      { memberIdOrEmail: member.id },
      {
        onSuccess: () => {
          setIsOpen(false);
          setShowConfirmDialog(false);
          toast.success("Member removed successfully");
        },
      }
    );
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
              toast.info("Change role feature coming soon");
              setIsOpen(false);
            }}
          >
            <Shield className="mr-2 h-4 w-4" />
            Change Role
          </DropdownMenuItem>
          {!isOwner && (
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setShowConfirmDialog(true);
                setIsOpen(false);
              }}
              disabled={isPending}
            >
              <Trash className="mr-2 h-4 w-4" />
              Remove Member
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChangeAction={setShowConfirmDialog}
        title="Remove team member?"
        description={`Are you sure you want to remove ${member.user.email} from the organization? This action cannot be undone and they will immediately lose access.`}
        onConfirmAction={handleRemoveMember}
        isLoading={isPending}
        variant="destructive"
        confirmText="Remove"
        loadingText="Removing..."
      />
    </>
  );
}
