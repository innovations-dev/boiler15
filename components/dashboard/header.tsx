"use client";

import { Header } from "@/app/_components/layout/header";
import { UserNav } from "@/components/header/user-nav";
import { OrganizationSwitcher } from "@/components/layout/organization-switcher";
import { navigationRoutes } from "@/config/routes.config";

export function DashboardHeader() {
  return (
    <Header variant="default" size="default">
      <Header.LeftElement>
        <span className="font-semibold">Dashboard</span>
      </Header.LeftElement>
      <Header.RightElement>
        <OrganizationSwitcher />
        <UserNav items={navigationRoutes.auth} />
      </Header.RightElement>
    </Header>
  );
}
