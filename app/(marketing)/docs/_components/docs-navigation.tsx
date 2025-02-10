"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { docsConfig } from "../config";
import { NavItem } from "./nav-items";

export function DocsNavigation() {
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="flex flex-col gap-4">
          {docsConfig.sidebarNav.map((section) => (
            <NavItem key={section.id} item={section} />
          ))}
        </div>
      </ScrollArea>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAllExpanded(!isAllExpanded)}
        className="mx-4 mt-2 justify-start text-muted-foreground hover:text-foreground"
      >
        {isAllExpanded ? "Collapse All" : "Expand All"}
      </Button>
    </div>
  );
}
