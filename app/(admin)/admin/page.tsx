import { Suspense } from "react";

import { AuditLogViewer } from "@/app/(admin)/_components/audit/audit-log-viewer";
import {
  AdminStats,
  AdminStatsSkeleton,
} from "@/app/(admin)/_components/stats/admin-stats";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <Suspense fallback={<AdminStatsSkeleton />}>
        <AdminStats />
      </Suspense>

      <AuditLogViewer />
    </div>
  );
}
