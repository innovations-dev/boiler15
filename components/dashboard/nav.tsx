"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/hooks/auth/use-session";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const pathname = usePathname();
  const { isAdmin } = useSession();

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
    },
    {
      href: "/dashboard/members",
      label: "Members",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
    },
    // Admin only routes
    ...(isAdmin
      ? [
          {
            href: "/dashboard/admin",
            label: "Admin Panel",
          },
        ]
      : []),
  ];

  return (
    <nav className="grid items-start gap-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === route.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
