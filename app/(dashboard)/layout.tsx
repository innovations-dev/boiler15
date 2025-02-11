import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardNav } from "@/components/dashboard/nav";
import { ShellWithSidebar } from "@/components/layout/shell-with-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data } = await authClient.getSession();

  // Only check for active organization
  // if (!data?.session?.activeOrganizationId) {
  //   console.log(
  //     "DashboardLayout: No active organization found, redirecting to create one"
  //   );
  //   redirect("/organizations/new");
  // }

  return (
    <ShellWithSidebar
      header={<DashboardHeader />}
      sidebar={<DashboardNav />}
      children={children}
    />
  );
}
