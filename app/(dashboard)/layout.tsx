import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardNav } from "@/components/dashboard/nav";
import { ShellWithSidebar } from "@/components/layout/shell-with-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShellWithSidebar
      header={<DashboardHeader />}
      sidebar={<DashboardNav />}
      children={children}
    />
  );
}
