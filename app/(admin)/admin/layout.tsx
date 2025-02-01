import { Suspense } from "react";

import { AdminHeader } from "@/app/(admin)/_components/admin-header";
import { AdminNav } from "@/app/(admin)/_components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto mt-24 flex min-h-screen gap-8 px-4 py-8">
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
