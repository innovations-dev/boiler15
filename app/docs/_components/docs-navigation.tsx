"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  CollapseButton,
  File,
  Folder,
  Tree,
} from "@/components/ui/extension/tree-view-api";
import { docsConfig, type NavItem } from "../config";

export function DocsNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      // For nested items (like multi-tenancy under authentication)
      if (item.items && item.items.length > 0) {
        return (
          <Folder
            key={item.href}
            element={item.title}
            value={item.href}
            onClick={(e) => {
              e.stopPropagation();
              router.push(item.href);
            }}
          >
            {/* Render nested items with their full paths */}
            {item.items.map((subItem) => (
              <div
                key={`${item.href}-${subItem.href}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(subItem.href);
                }}
              >
                <File value={subItem.href}>
                  <span>{subItem.title}</span>
                </File>
              </div>
            ))}
          </Folder>
        );
      }

      // For non-nested items
      return (
        <div
          key={`item-${item.href}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(item.href);
          }}
        >
          <File value={item.href}>
            <span>{item.title}</span>
          </File>
        </div>
      );
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden px-4 py-2">
        <Tree
          initialSelectedId={pathname}
          initialExpendedItems={docsConfig.sidebarNav.map((section) =>
            section.title.toLowerCase().replace(/\s+/g, "-")
          )}
        >
          {docsConfig.sidebarNav.map((section) => (
            <Folder
              key={section.title}
              element={section.title}
              value={section.title.toLowerCase().replace(/\s+/g, "-")}
            >
              {renderNavItems(section.items)}
            </Folder>
          ))}
          <CollapseButton elements={[]}>
            <span>Expand All</span>
          </CollapseButton>
        </Tree>
      </div>
    </div>
  );
}
