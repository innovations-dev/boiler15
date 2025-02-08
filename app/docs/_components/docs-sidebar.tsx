"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const docsConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/getting-started/introduction",
        },
        {
          title: "Installation",
          href: "/docs/getting-started/installation",
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          title: "Authentication",
          href: "/docs/features/authentication",
          items: [
            {
              title: "Multi-Tenancy",
              href: "/docs/features/authentication/multi-tenancy",
            },
          ],
        },
        {
          title: "Database",
          href: "/docs/features/database",
        },
        {
          title: "Email",
          href: "/docs/features/email",
        },
        {
          title: "Error Handling",
          href: "/docs/features/error-handling",
        },
        {
          title: "Query Patterns",
          href: "/docs/features/query-patterns",
        },
        {
          title: "UI Components",
          href: "/docs/features/ui-components",
        },
        {
          title: "Kitchen Sink",
          href: "/docs/kitchen-sink",
        },
      ],
    },
  ] satisfies NavSection[],
} as const;

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href;
  const hasChildren = item.items && item.items.length > 0;

  return (
    <div>
      <Link href={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            isActive && "bg-secondary font-medium"
          )}
        >
          {item.title}
        </Button>
      </Link>
      {hasChildren && (
        <div className="ml-4 mt-1 space-y-1 border-l pl-2">
          {item.items?.map((child) => (
            <NavLink key={child.href} item={child} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-full pl-8 pt-12">
      <div className="space-y-6 py-6">
        {docsConfig.sidebarNav.map((section) => (
          <div key={section.title} className="px-3 py-2">
            <h4 className="mb-2 text-sm font-semibold tracking-tight">
              {section.title}
            </h4>
            <div className="grid grid-flow-row auto-rows-max gap-1">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
