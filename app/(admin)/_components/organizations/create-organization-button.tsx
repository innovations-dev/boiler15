"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { CreateOrganizationDialog } from "@/components/shared/create-organization-dialog";
import { Button } from "@/components/ui/button";

export function CreateOrganizationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Organization
      </Button>

      <CreateOrganizationDialog open={open} onOpenChangeAction={setOpen} />
    </>
  );
}
