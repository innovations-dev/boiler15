"use client";

import { Suspense, useState } from "react";
import { Building, ChevronDown, PlusCircle } from "lucide-react";

import { CreateOrganizationDialog } from "@/components/shared/create-organization-dialog";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOrganizationsApi } from "@/hooks/organization/use-organizations";
import { useSwitchOrganization } from "@/hooks/organization/use-switch-organization";
import { authClient } from "@/lib/auth/auth-client";
import type { Organization } from "@/lib/db/schema";

function OrganizationSwitcherContent() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: session } = authClient.useSession();
  const { data: organizations, isLoading: isLoadingOrgs } =
    useOrganizationsApi();
  const { mutate: switchOrganization, isPending } = useSwitchOrganization();

  const currentOrganization = organizations?.data?.find(
    (org: Organization) => org.id === session?.session?.activeOrganizationId
  );

  const handleSwitchOrganization = (orgId: string) => {
    setPopoverOpen(false);
    switchOrganization(orgId);
  };

  if (isLoadingOrgs) {
    return <Spinner />;
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            aria-label="Select organization"
            disabled={isPending}
            className="w-[200px] justify-between"
          >
            {isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <Building className="mr-2 h-4 w-4 shrink-0" />
            )}
            <span className="truncate">
              {isPending
                ? "Switching..."
                : currentOrganization?.name || "Select organization"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search organization..." />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup heading="Organizations">
                {organizations?.data?.map((org) => (
                  <CommandItem
                    key={org.id}
                    onSelect={() => handleSwitchOrganization(org.id)}
                    className="cursor-pointer"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    <span className="truncate">{org.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setPopoverOpen(false);
                    setShowCreateDialog(true);
                  }}
                  className="cursor-pointer"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Organization
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateOrganizationDialog
        open={showCreateDialog}
        onOpenChangeAction={setShowCreateDialog}
      />
    </>
  );
}

export function OrganizationSwitcherWithSuspense() {
  return (
    <Suspense fallback={<Spinner className="h-8 w-8" />}>
      <OrganizationSwitcherContent />
    </Suspense>
  );
}
