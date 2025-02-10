"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizations } from "@/hooks/organizations/use-organizations";
import { authClient } from "@/lib/auth/auth-client";
import { Organization } from "@/lib/db/schema";
import { useSetActiveOrganization } from "@/lib/mutations/use-set-active-organization";
import { queryKeys } from "@/lib/query/keys";

export function OrganizationSwitcher() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { data: session } = authClient.useSession();
  const { data: activeOrg, isPending: isActiveOrgPending } =
    authClient.useActiveOrganization();
  const { data: organizations } = useOrganizations();
  const { mutate: setActiveOrganization } = useSetActiveOrganization();
  const queryClient = useQueryClient();

  // Single loading check
  const isLoading = !session || isActiveOrgPending;

  // Optimistic updates
  const handleOrgChange = async (org: Organization) => {
    const previousOrg = activeOrg;

    // Optimistically update UI
    queryClient.setQueryData(queryKeys.organizations.active(), org);

    try {
      await setActiveOrganization({ organizationId: org.id });
    } catch (error) {
      console.error(
        "OrganizationSwitcher: Failed to set active organization:",
        error
      );
      // Revert on failure
      queryClient.setQueryData(queryKeys.organizations.active(), previousOrg);
    }
  };

  // Show loading state
  if (isLoading) {
    return <Skeleton className="h-9 w-[200px]" />;
  }

  // If not authenticated, show sign in button
  if (!session) {
    return (
      <Button variant="ghost" size="sm" onClick={() => router.push("/sign-in")}>
        Sign In
      </Button>
    );
  }

  // Ensure we have organizations data
  if (!organizations?.length) {
    return (
      <Button
        variant="outline"
        onClick={() => router.push("/organizations/new")}
        className="w-[200px] justify-between"
      >
        Create Organization
        <PlusCircle className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select organization"
          className="w-[200px] justify-between"
        >
          {activeOrg ? (
            <>
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src={activeOrg.logo ?? undefined}
                  alt={activeOrg.name}
                />
                <AvatarFallback>{activeOrg.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {activeOrg.name}
            </>
          ) : (
            "Select organization"
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {organizations?.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={async () => {
                    try {
                      await handleOrgChange(org);
                      setOpen(false);
                    } catch (error) {
                      toast.error("Failed to set active organization");
                      console.error(
                        "Failed to set active organization:",
                        error
                      );
                      setOpen(false);
                    }
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage src={org.logo ?? undefined} alt={org.name} />
                    <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {org.name}
                  {activeOrg?.id === org.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.push("/organizations/new");
                  setOpen(false);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
