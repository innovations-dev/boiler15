"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Key, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

export function UserActions({ user }: { user: any }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: banUser } = useMutation({
    mutationFn: () => authClient.admin.banUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User banned successfully");
    },
  });

  const { mutate: setRole } = useMutation({
    mutationFn: (role: string) =>
      authClient.admin.setRole({
        userId: user.id,
        role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role updated successfully");
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
        <DropdownMenuItem onClick={() => setRole("admin")}>
          <Key className="mr-2 h-4 w-4" />
          Make Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => banUser()}>
          <Ban className="mr-2 h-4 w-4" />
          Ban User
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
