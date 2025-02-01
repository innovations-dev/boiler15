"use client";

import { useState } from "react";
import { MoreHorizontal, Users } from "lucide-react";

import { UserRoleList } from "@/app/(admin)/_components/permissions/user-role-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USER_ROLES, type UserRole } from "@/lib/constants/roles";

interface PermissionActionsProps {
  role: UserRole;
  userCount: number;
}

export function PermissionActions({ role, userCount }: PermissionActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowUsers(true)}>
            <Users className="mr-2 h-4 w-4" />
            View Users ({userCount})
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showUsers} onOpenChange={setShowUsers}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Users with {role.toLowerCase()} role</DialogTitle>
          </DialogHeader>
          <UserRoleList role={role} />
        </DialogContent>
      </Dialog>
    </>
  );
}
