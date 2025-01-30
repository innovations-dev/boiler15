"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CreditCard, Settings, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const dashboardRoutes = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Activity,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {dashboardRoutes.map((route) => {
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
