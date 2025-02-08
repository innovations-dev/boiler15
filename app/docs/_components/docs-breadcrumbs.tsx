"use client";

import { usePathname } from "next/navigation";

import {
  BreadCrumb,
  BreadCrumbItem,
} from "@/components/ui/extension/breadcrumb";
import { cn } from "@/lib/utils";
import { docsConfig, NavItem, NavSection } from "../config";

// Generate breadcrumb items from current path
function getBreadcrumbItems(pathname: string, nav: NavSection[]) {
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
        item.items?.forEach((subItem: NavItem) => {
          if (subItem.href === currentPath) {
            items.push({ title: subItem.title, href: subItem.href });
          }
        });
      });
    });
  });

  return items;
}

export function DocsBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname, docsConfig.sidebarNav);
  return (
    <BreadCrumb>
      {breadcrumbItems.map((item, index) => (
        <BreadCrumbItem
          key={item.href}
          href={item.href}
          className={cn({
            isLast: index === breadcrumbItems.length - 1,
          })}
        >
          {item.title}
        </BreadCrumbItem>
      ))}
    </BreadCrumb>
  );
}
