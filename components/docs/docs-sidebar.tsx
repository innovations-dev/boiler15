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
    <ScrollArea className="h-full py-6 pl-3 pr-6 lg:py-8">
      <div className="flex flex-col gap-4">
        {docsConfig.sidebarNav.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h4 className="font-medium">{section.title}</h4>
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
        ))}
      </div>
    </ScrollArea>
  );
}
