"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

export function OrganizationSwitcher() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => authClient.organization.list(),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? organizations?.data?.find((org) => org.id === value)?.name
            : "Select organization..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandEmpty>No organization found.</CommandEmpty>
          <CommandGroup>
            {organizations?.data?.map((org) => (
              <CommandItem
                key={org.id}
                value={org.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === org.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {org.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
