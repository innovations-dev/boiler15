"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { File, Folder, Tree } from "@/components/ui/extension/tree-view-api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { docsConfig, NavItem } from "../config";

function RenderNavItems({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  const router = useRouter();

  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  return (
    <>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
          return (
            <Folder key={item.id} element={item.name} value={item.id}>
              <RenderNavItems items={item.children || []} pathname={pathname} />
            </Folder>
          );
        }

        return (
          <Link href={item.href}>
            <File
              key={item.id}
              value={item.id}
              isSelect={pathname === item.href}
              onClick={() => handleSelect(item.id)}
            >
              <span>{item.name}</span>
            </File>
          </Link>
        );
      })}
    </>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();

  // Get all expanded section IDs based on current pathname
  const getExpandedSections = useCallback((path: string): string[] => {
    const parts = path.split("/").filter(Boolean);
    const expanded: string[] = [];

    docsConfig.sidebarNav.forEach((section) => {
      const matchesSection = section.children.some((item) =>
        parts.some((part) => item.href.includes(part))
      );
      if (matchesSection) {
        expanded.push(section.id);
      }
    });

    return expanded;
  }, []);

  return (
    <ScrollArea className="h-full pl-8 pt-12">
      <div className="space-y-6 py-6">
        {docsConfig.sidebarNav.map((section) => (
          <div key={section.id} className="px-3 py-2">
            <h4 className="mb-2 text-sm font-semibold tracking-tight">
              {section.name}
            </h4>
            <Tree
              initialSelectedId={pathname}
              initialExpendedItems={getExpandedSections(pathname)}
              className="h-full w-full overflow-y-auto"
            >
              <RenderNavItems items={section.children} pathname={pathname} />
            </Tree>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
