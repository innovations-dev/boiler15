import { Suspense } from "react";

import {
  SystemHealth,
  SystemHealthSkeleton,
} from "../../_components/system/system-health";

export const dynamic = "force-dynamic";

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor system health and performance metrics
        </p>
      </div>

      <Suspense fallback={<SystemHealthSkeleton />}>
        <SystemHealth />
      </Suspense>
    </div>
  );
}
