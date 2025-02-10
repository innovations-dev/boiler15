"use client";

import { usePathname } from "next/navigation";

import {
  BreadCrumb,
  BreadCrumbItem,
} from "@/components/ui/extension/breadcrumb";
import { cn } from "@/lib/utils";
import { docsConfig, NavSection } from "../config";

// Generate breadcrumb items from current path
function getBreadcrumbItems(pathname: string, nav: NavSection[]) {
  if (!pathname) return [];

  const parts = pathname.split("/").filter(Boolean);
  const items: { title: string; href: string }[] = [];

  let currentPath = "";
  for (const part of parts) {
    currentPath += `/${part}`;

    for (const section of nav) {
      for (const item of section.children) {
        if (item.href === currentPath) {
          items.push({ title: item.name, href: item.href });
        }
        if (item.children) {
          for (const subItem of item.children) {
            if (subItem.href === currentPath) {
              items.push({ title: subItem.name, href: subItem.href });
            }
          }
        }
      }
    }
  }

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
