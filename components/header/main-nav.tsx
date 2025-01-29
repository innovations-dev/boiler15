"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/app/_components/layout/header";
import type { navigationRoutes } from "@/config/routes.config";
import { cn } from "@/lib/utils";

interface MainNavProps {
  items: (typeof navigationRoutes)["main"];
  className?: string;
}

export function MainNav({ items, className }: MainNavProps) {
  const pathname = usePathname();
  return (
    <nav className={cn("hidden gap-6 md:flex", className)}>
      {items.map((item) => (
        <Header.Link
          key={item.href}
          href={item.href}
          isActive={pathname === item.href}
        >
          {item.name}
        </Header.Link>
      ))}
    </nav>
  );
}
