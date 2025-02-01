"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
      title: "UI Components",
      items: [
        {
          title: "Kitchen Sink",
          href: "/docs/kitchen-sink",
        },
      ],
    },
  ],
} as const;

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-full pl-8 pt-12">
      <div className="space-y-4 py-6">
        {docsConfig.sidebarNav.map((section) => (
          <div key={section.title} className="px-3 py-2">
            <h4 className="mb-1 text-sm font-semibold">{section.title}</h4>
            <div className="grid grid-flow-row auto-rows-max gap-1">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href && "bg-secondary font-medium"
                    )}
                  >
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
