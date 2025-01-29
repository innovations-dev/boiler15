import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminNav } from "@/components/admin/admin-nav";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.role?.includes("admin")) {
    console.log("redirecting: UNAUTHORIZED", session);
    redirect("/");
  }

  return (
    <div className="container mx-auto flex min-h-screen gap-8 px-4 py-8">
      <aside className="w-64 shrink-0">
        <Suspense fallback={<div>Loading...</div>}>
          <AdminNav />
        </Suspense>
      </aside>
      <main className="flex-1">
        <AdminHeader />
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
