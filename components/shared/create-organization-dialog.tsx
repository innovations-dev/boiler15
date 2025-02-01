"use client";

import { useState } from "react";
import randomName from "@scaleway/random-name";

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
import { useCreateOrganization } from "@/hooks/organization/use-create-organization";
import { OrganizationInsert } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function CreateOrganizationDialog({
  open,
  onOpenChangeAction,
}: CreateOrganizationDialogProps) {
  const [name, setName] = useState(randomName());
  const { mutate: createOrganization, isPending } = useCreateOrganization();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      return;
    }

    createOrganization(
      {
        name,
        slug: slugify(name),
      },
      {
        onSuccess: () => {
          setName(randomName());
          onOpenChangeAction(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Add a new organization to manage teams and projects.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Organization name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex w-full justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setName(randomName());
                  }}
                  type="button"
                >
                  Random
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => onOpenChangeAction(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button variant="default" type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
