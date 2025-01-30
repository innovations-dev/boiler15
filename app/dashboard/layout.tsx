import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto flex min-h-screen gap-8 px-4 py-8">
      <aside className="w-64 shrink-0">
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardNav />
        </Suspense>
      </aside>
      <main className="flex-1">
        <DashboardHeader />
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
