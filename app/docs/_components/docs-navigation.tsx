"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { TreeView } from "@/components/ui/extension/tree-view";
import { docsConfig } from "../config";
import { NavItem } from "../config/index";

export function DocsNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandAll = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => ({
      id: item.href,
      name: item.name,
      href: item.href,
      children: item.children?.map((subItem) => ({
        id: subItem.href,
        name: subItem.name,
        href: subItem.href,
      })),
    }));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tree navigation */}
      <div className="flex-1 overflow-hidden px-4 py-2">
        <div className="h-[calc(100%-2.5rem)]">
          {docsConfig.sidebarNav.map((section) => (
            <div key={section.id} className="mb-4">
              <h4 className="mb-1 px-2 text-sm font-semibold">
                {section.name}
              </h4>
              <TreeView
                elements={renderNavItems(section.children)}
                initialSelectedId="1"
                initialExpendedItems={
                  isExpanded
                    ? docsConfig.sidebarNav.map((section) =>
                        section.id.toLowerCase().replace(/\s+/g, "-")
                      )
                    : []
                }
              />
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpandAll}
          className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? "Collapse All" : "Expand All"}
        </Button>
      </div>
    </div>
  );
}
