"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Key, MoreHorizontal, Shield, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import { UserSelectSchema } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  action: () => Promise<void> | void;
  variant?: "default" | "destructive";
}

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

export function UserActions({ user }: { user: any }) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] =
    useState<ConfirmationDialogProps | null>(null);

  const { mutate: banUser, isPending: isBanning } = useMutation({
    mutationFn: () => authClient.admin.banUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User banned successfully");
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to ban user");
    },
  });

  const { mutate: setRole, isPending: isSettingRole } = useMutation({
    mutationFn: (role: string) =>
      authClient.admin.setRole({
        userId: user.id,
        role,
      }),
    onSuccess: ({ data }) => {
      UserSelectSchema.parse(data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Role updated successfully");
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update role");
    },
  });

  const handleOpenDialog = (dialog: ConfirmationDialogProps) => {
    console.log("Opening dialog:", dialog);
    setActiveDialog(dialog);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log("Closing dialog");
    setActiveDialog(null);
    setDialogOpen(false);
  };

  const handleConfirm = async () => {
    if (!activeDialog) return;

    try {
      await activeDialog.action();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Operation failed");
    }
  };

  const confirmations = {
    roleChange: (role: string) => ({
      title: `Make user ${role}?`,
      description: `Are you sure you want to change ${user.email}'s role to ${role}? This will grant them ${role} privileges.`,
      action: () => setRole(role),
      variant: "default" as const,
    }),
    ban: {
      title: "Ban user?",
      description: `Are you sure you want to ban ${user.email}? They will no longer be able to access the system.`,
      action: () => banUser(),
      variant: "destructive" as const,
    },
    delete: {
      title: "Delete user?",
      description: `Are you sure you want to delete ${user.email}? This action cannot be undone.`,
      action: () => {
        toast.error("Delete user feature coming soon");
        handleCloseDialog();
      },
      variant: "destructive" as const,
    },
  };

  const actions: ActionItem[][] = [
    [
      {
        key: "make-admin",
        label: "Make Admin",
        icon: <Key className="h-4 w-4 text-primary" />,
        onClick: () => handleOpenDialog(confirmations.roleChange("admin")),
      },
      {
        key: "make-member",
        label: "Make Member",
        icon: <Shield className="h-4 w-4 text-primary" />,
        onClick: () => handleOpenDialog(confirmations.roleChange("member")),
      },
    ],
    [
      {
        key: "ban",
        label: "Ban User",
        icon: <Ban className="h-4 w-4" />,
        onClick: () => handleOpenDialog(confirmations.ban),
        variant: "warning",
      },
      {
        key: "delete",
        label: "Delete User",
        icon: <Trash className="h-4 w-4" />,
        onClick: () => handleOpenDialog(confirmations.delete),
        variant: "destructive",
      },
    ],
  ];

  return (
    <>
      <DropdownMenu>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeDialog?.title}</DialogTitle>
            <DialogDescription>{activeDialog?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              variant={activeDialog?.variant ?? "default"}
              onClick={handleConfirm}
              disabled={isBanning || isSettingRole}
              className="min-w-[100px]"
            >
              {isBanning || isSettingRole ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading...
                </span>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
