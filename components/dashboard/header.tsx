"use client";

import { Header } from "@/app/_components/layout/header";
import { UserNav } from "@/components/header/user-nav";
import { OrganizationSwitcher } from "@/components/layout/organization-switcher";
import { navigationRoutes } from "@/config/routes.config";

export function DashboardHeader() {
  return (
    <Header
      variant="default"
      size="default"
      sticky
      isFullWidth
      className="border-b bg-background"
    >
      <Header.LeftElement>
        <OrganizationSwitcher />
      </Header.LeftElement>
      <Header.Main>
        {/* Intentionally left empty for now - could add dashboard-specific nav items */}
      </Header.Main>
      <Header.RightElement>
        <UserNav items={navigationRoutes.auth} />
      </Header.RightElement>
    </Header>
  );
}
