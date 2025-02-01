"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Shield, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import type { TeamMember } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";

export function TeamMemberActions({ member }: { member: TeamMember }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: removeMember } = useMutation({
    mutationFn: () =>
      authClient.organization.removeMember({
        memberIdOrEmail: member.user.email,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.members("current"),
      });
      toast.success("Member removed successfully");
    },
  });

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
            toast.info("Change role feature coming soon");
          }}
        >
          <Shield className="mr-2 h-4 w-4" />
          Change Role
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => removeMember()}
        >
          <Trash className="mr-2 h-4 w-4" />
          Remove Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
