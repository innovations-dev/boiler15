"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Building2, Settings, Shield, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminRoutes = [
  {
    title: "Overview",
    href: "/admin",
    icon: Activity,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Organizations",
    href: "/admin/organizations",
    icon: Building2,
  },
  {
    title: "Permissions",
    href: "/admin/permissions",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {adminRoutes.map((route) => {
        const Icon = route.icon;
        return (
          <Link key={route.href} href={route.href}>
            <Button
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                pathname === route.href && "bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {route.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
