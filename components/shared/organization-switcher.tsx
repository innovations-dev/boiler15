"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import {
  Building,
  ChevronDown,
  Crown,
  PlusCircle,
  Shield,
  User,
} from "lucide-react";

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
  CommandSeparator,
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
import { cn } from "@/lib/utils";

type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER";

interface OrganizationWithRole extends Organization {
  role?: OrganizationRole;
  metadata?: string;
}

// Role icons mapping for visual indicators
const roleIcons: Record<
  OrganizationRole,
  typeof Crown | typeof Shield | typeof User
> = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: User,
};

function OrganizationSwitcherContent() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = authClient.useSession();
  const { data: organizations, isLoading: isLoadingOrgs } =
    useOrganizationsApi();
  const { mutate: switchOrganization, isPending } = useSwitchOrganization();

  const organizationsWithRoles = organizations?.data?.map((org) => {
    try {
      const metadata = org.metadata ? JSON.parse(org.metadata) : null;
      return {
        ...org,
        role: metadata?.role as OrganizationRole | undefined,
      };
    } catch {
      return org;
    }
  }) as OrganizationWithRole[] | undefined;

  const currentOrganization = organizationsWithRoles?.find(
    (org) => org.id === session?.session?.activeOrganizationId
  );

  const handleSwitchOrganization = useCallback(
    (orgId: string) => {
      setError(null);
      setPopoverOpen(false);
      switchOrganization(orgId, {
        onError: (err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Failed to switch organization"
          );
          setPopoverOpen(true);
        },
      });
    },
    [switchOrganization]
  );

  // Add keyboard shortcut for opening switcher
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPopoverOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (isLoadingOrgs) {
    return <Spinner />;
  }

  const getRoleIcon = (role?: OrganizationRole) => {
    if (!role) return User;
    return roleIcons[role] || User;
  };

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
            className="w-[250px] justify-between"
          >
            {isPending ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <Building className="mr-2 h-4 w-4 shrink-0" />
            )}
            <span className="flex flex-1 items-center justify-between truncate">
              <span className="truncate">
                {isPending
                  ? "Switching..."
                  : currentOrganization?.name || "Select organization"}
              </span>
              {currentOrganization?.role && (
                <span className="ml-2 flex items-center text-muted-foreground">
                  {(() => {
                    const Icon = getRoleIcon(currentOrganization.role);
                    return <Icon className="h-3 w-3" />;
                  })()}
                </span>
              )}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search organization... (⌘K)" />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              {error && (
                <div className="p-2">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <CommandGroup heading="Organizations">
                {organizationsWithRoles?.map((org) => (
                  <CommandItem
                    key={org.id}
                    onSelect={() => handleSwitchOrganization(org.id)}
                    className={cn(
                      "flex cursor-pointer justify-between",
                      org.id === currentOrganization?.id && "bg-accent"
                    )}
                  >
                    <span className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      <span className="truncate">{org.name}</span>
                    </span>
                    {org.role && (
                      <span className="ml-2 flex items-center text-muted-foreground">
                        {(() => {
                          const Icon = getRoleIcon(org.role);
                          return <Icon className="h-3 w-3" />;
                        })()}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
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
