"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  BreadCrumb,
  BreadCrumbItem,
} from "@/components/ui/extension/breadcrumb";
import { TreeView } from "@/components/ui/extension/tree-view";
import {
  CollapseButton,
  File,
  Folder,
  Tree,
} from "@/components/ui/extension/tree-view-api";
import { cn } from "@/lib/utils";
import { docsConfig, type NavItem as ConfigNavItem } from "../config";

interface DocNavItem {
  title: string;
  href: string;
  items?: DocNavItem[];
}

interface DocNavSection {
  title: string;
  items: DocNavItem[];
}

// Convert our navigation config to TreeView elements
function convertNavToTreeElements(nav: DocNavSection[]) {
  return nav.map((section) => ({
    id: section.title.toLowerCase().replace(/\s+/g, "-"),
    name: section.title,
    children: section.items.map((item) => {
      const node = {
        id: item.href,
        name: item.title,
      };

      if (item.items && item.items.length > 0) {
        return {
          ...node,
          children: item.items.map((subItem) => ({
            id: subItem.href,
            name: subItem.title,
          })),
        };
      }

      return node;
    }),
  }));
}

export function DocsNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const treeElements = convertNavToTreeElements(docsConfig.sidebarNav);

  const handleExpandAll = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div className="flex h-full flex-col">
      {/* Tree navigation */}
      <div className="flex-1 overflow-hidden px-4 py-2">
        <TreeView
          elements={treeElements}
          className="h-[calc(100%-2.5rem)]" // Account for button height
          expandAll={isExpanded}
          indicator={true}
          initialSelectedId={pathname}
        />
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

// Generate breadcrumb items from current path
function getBreadcrumbItems(pathname: string, nav: DocNavSection[]) {
  const parts = pathname.split("/").filter(Boolean);
  const items: { title: string; href: string }[] = [];

  let currentPath = "";
  parts.forEach((part) => {
    currentPath += `/${part}`;
    // Find matching nav item
    nav.forEach((section) => {
      section.items.forEach((item) => {
        if (item.href === currentPath) {
          items.push({ title: item.title, href: item.href });
        }
        item.items?.forEach((subItem) => {
          if (subItem.href === currentPath) {
            items.push({ title: subItem.title, href: subItem.href });
          }
        });
      });
    });
  });

  return items;
}
