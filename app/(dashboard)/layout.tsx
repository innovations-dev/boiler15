import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardNav } from "@/components/dashboard/nav";
import { ShellWithSidebar } from "@/components/layout/shell-with-sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { SiteFooter } from "../_components/layout/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Authentication is handled by the middleware.
  const { data } = await authClient.getSession();
  // Only check for active organization
  if (!data?.session?.activeOrganizationId) {
    console.log(
      "DashboardLayout: No active organization found, TODO: prompt user to create one"
    );
  }

  return (
    <ShellWithSidebar
      header={<DashboardHeader />}
      sidebar={<DashboardNav />}
      footer={<SiteFooter />}
    >
      {children}
    </ShellWithSidebar>
  );
}
