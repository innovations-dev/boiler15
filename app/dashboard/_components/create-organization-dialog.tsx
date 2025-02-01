"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { slugify } from "@/lib/utils";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function CreateOrganizationDialog({
  open,
  onOpenChangeAction,
}: CreateOrganizationDialogProps) {
  const queryClient = useQueryClient();
  const [newOrgName, setNewOrgName] = useState("");

  const { mutate: createOrganization, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      return authClient.organization.create({
        name: newOrgName,
        slug: slugify(newOrgName),
      });
    },
    onSuccess: () => {
      toast.success("Organization created successfully");
      onOpenChangeAction(false);
      setNewOrgName("");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      console.error("[CreateOrganization] Creation failed:", error);
      toast.error("Failed to create organization");
    },
  });

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    createOrganization();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Add a new organization to manage your team and projects.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateOrg}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                id="name"
                placeholder="Organization name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                disabled={isCreating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChangeAction(false)}
              disabled={isCreating}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Organization"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
