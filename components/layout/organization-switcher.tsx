"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { useActiveOrganization } from "@/hooks/organizations/use-active-organization";
import { useOrganizations } from "@/hooks/organizations/use-organizations";
import { authClient } from "@/lib/auth/auth-client";
import { Organization } from "@/lib/db/schema";
import { useSetActiveOrganization } from "@/lib/mutations/use-set-active-organization";

export function OrganizationSwitcher() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  let [activeOrg, setActiveOrg] = React.useState<Organization | null>(null);
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const { data: organizations, isLoading: isOrgsLoading } = useOrganizations();
  const { data: activeOrganization, isLoading: isActiveOrgLoading } =
    useActiveOrganization();
  const { mutate: setActiveOrganization } = useSetActiveOrganization();
  activeOrg = activeOrganization ?? activeOrg;
  console.log(
    "🚀 ~ OrganizationSwitcher ~ activeOrganization:",
    activeOrganization
  );
  const isLoading = isSessionPending || isOrgsLoading || isActiveOrgLoading;

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
                      await setActiveOrganization({ organizationId: org.id });
                      setActiveOrg(org);
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
                  {activeOrganization?.id === org.id && (
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
