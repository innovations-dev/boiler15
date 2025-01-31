"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Building, ChevronDown, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { CreateOrganizationDialog } from "@/components/dashboard/create-organization-dialog";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth/auth-client";

interface OrganizationSwitcherProps {
  hideCreate?: boolean;
}

export function OrganizationSwitcher({
  hideCreate = false,
}: OrganizationSwitcherProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Get current session and organizations
  const { data: session } = authClient.useSession();
  const { data: organizations, isLoading: isLoadingOrgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => authClient.organization.list(),
    staleTime: 1000 * 60, // 1 minute
  });

  // Set active organization mutation
  const { mutate: setActiveOrganization, isPending: isSwitching } = useMutation(
    {
      mutationFn: async (organizationId: string) => {
        await authClient.organization.setActive({ organizationId });
        return authClient.getSession();
      },
      onSuccess: async () => {
        setPopoverOpen(false);
        // Refresh the page to ensure all data is in sync
        window.location.reload();
      },
      onError: (error) => {
        console.error("[OrganizationSwitcher] Switch failed:", error);
        toast.error("Failed to switch organization");
      },
    }
  );

  const currentOrganization = organizations?.data?.find(
    (org) => org.id === session?.session?.activeOrganizationId
  );

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
            disabled={isSwitching}
            className="w-[200px] justify-between"
          >
            <div className="flex items-center truncate">
              <Building className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">
                {isSwitching
                  ? "Switching..."
                  : currentOrganization?.name || "Select organization"}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search organization..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup heading="Organizations">
                {organizations?.data?.map((org) => (
                  <CommandItem
                    key={org.id}
                    onSelect={() => setActiveOrganization(org.id)}
                    className="cursor-pointer"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    <span className="truncate">{org.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {!hideCreate && (
                <>
                  <CommandSeparator />
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
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {!hideCreate && (
        <CreateOrganizationDialog
          open={showCreateDialog}
          onOpenChangeAction={setShowCreateDialog}
        />
      )}
    </>
  );
}
