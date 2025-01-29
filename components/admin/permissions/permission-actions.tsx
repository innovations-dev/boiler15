"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Trash, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

interface Role {
  id: string;
  name: string;
  description?: string;
  userCount?: number;
  createdAt: string;
}

export function PermissionActions({ role }: { role: Role }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: deleteRole } = useMutation({
    mutationFn: async () => {
      // First get users with this role
      const users = await authClient.admin.listUsers({
        query: {
          limit: 10,
          searchValue: role.name,
          searchField: "name", // TODO: change to role once we have a role field available
        },
      });

      if (!users.data?.users?.length) {
        return; // No users to update
      }

      // Update each user's role to "user"
      const promises = users.data.users.map((user) =>
        authClient.admin.setRole({
          userId: user.id,
          role: "user",
        })
      );

      // Wait for all role updates to complete
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
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
            toast.info("Edit role feature coming soon");
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Role
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            toast.info("Manage users feature coming soon");
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          Manage Users
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => deleteRole()}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
