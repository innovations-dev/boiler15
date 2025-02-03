"use client";

import React, { useState } from "react";
import { UserWithRole } from "better-auth/plugins";
import { Ban, Key, MoreHorizontal, Shield, Trash } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBanUser } from "@/hooks/admin/use-ban-user";
import { useSetRole } from "@/hooks/admin/use-set-role";
import { cn } from "@/lib/utils";

interface ActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "warning" | "destructive";
}

function ActionMenuItem({ item }: { item: ActionItem }) {
  const variants = {
    default: "hover:bg-accent focus:bg-accent text-foreground",
    warning:
      "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 focus:bg-yellow-50 focus:text-yellow-700 dark:hover:bg-yellow-950/50 dark:focus:bg-yellow-950/50",
    destructive:
      "text-destructive hover:bg-destructive/10 focus:bg-destructive/10",
  };

  return (
    <DropdownMenuItem
      onClick={item.onClick}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        variants[item.variant || "default"]
      )}
    >
      {item.icon}
      <span>{item.label}</span>
    </DropdownMenuItem>
  );
}

export function UserActions({ user }: { user: UserWithRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeAction, setActiveAction] = useState<{
    title: string;
    description: string;
    action: () => void;
    variant?: "default" | "destructive";
    confirmText?: string;
    loadingText?: string;
  } | null>(null);

  const { mutate: banUser, isPending: isBanning } = useBanUser();

  const { mutate: setRole, isPending: isSettingRole } = useSetRole();

  const handleAction = (action: typeof activeAction) => {
    setActiveAction(action);
    setShowConfirmDialog(true);
    setIsOpen(false);
  };

  const actions: ActionItem[][] = [
    [
      {
        key: "make-admin",
        label: "Make Admin",
        icon: <Key className="h-4 w-4 text-primary" />,
        onClick: () =>
          handleAction({
            title: "Make user admin?",
            description: `Are you sure you want to change ${user.email}&apos;s role to admin? This will grant them admin privileges.`,
            action: () => setRole({ userId: user.id, role: "admin" }),
            confirmText: "Make Admin",
            loadingText: "Updating...",
          }),
      },
      {
        key: "make-member",
        label: "Make Member",
        icon: <Shield className="h-4 w-4 text-primary" />,
        onClick: () =>
          handleAction({
            title: "Make user member?",
            description: `Are you sure you want to change ${user.email}'s role to member? This will grant them member privileges.`,
            action: () => setRole({ userId: user.id, role: "member" }),
            confirmText: "Make Member",
            loadingText: "Updating...",
          }),
      },
    ],
    [
      {
        key: "ban",
        label: "Ban User",
        icon: <Ban className="h-4 w-4" />,
        onClick: () =>
          handleAction({
            title: "Ban user?",
            description: `Are you sure you want to ban ${user.email}? They will no longer be able to access the system.`,
            action: () => banUser(user.id),
            variant: "destructive",
            confirmText: "Ban User",
            loadingText: "Banning...",
          }),
        variant: "warning",
      },
      {
        key: "delete",
        label: "Delete User",
        icon: <Trash className="h-4 w-4" />,
        onClick: () =>
          handleAction({
            title: "Delete user?",
            description: `Are you sure you want to delete ${user.email}? This action cannot be undone.`,
            action: () => {
              toast.error("Delete user feature coming soon");
              setShowConfirmDialog(false);
            },
            variant: "destructive",
            confirmText: "Delete",
            loadingText: "Deleting...",
          }),
        variant: "destructive",
      },
    ],
  ];

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Open user actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 space-y-1 p-2"
          sideOffset={5}
          alignOffset={0}
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            User Actions
          </DropdownMenuLabel>
          {actions.map((actionGroup, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {groupIndex > 0 && (
                <DropdownMenuSeparator className="-mx-1 my-1" />
              )}
              <div className="space-y-1">
                {actionGroup.map((action) => (
                  <ActionMenuItem key={action.key} item={action} />
                ))}
              </div>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {activeAction && (
        <ConfirmationDialog
          open={showConfirmDialog}
          onOpenChangeAction={setShowConfirmDialog}
          title={activeAction.title}
          description={activeAction.description}
          onConfirmAction={activeAction.action}
          isLoading={isBanning || isSettingRole}
          variant={activeAction.variant}
          confirmText={activeAction.confirmText}
          loadingText={activeAction.loadingText}
        />
      )}
    </>
  );
}
