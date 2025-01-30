import { Suspense } from "react";

import { SettingsList } from "@/components/dashboard/settings/settings-list";
import { SettingsListSkeleton } from "@/components/dashboard/settings/settings-list-skeleton";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal settings and preferences
        </p>
      </div>
      <Suspense fallback={<SettingsListSkeleton />}>
        <SettingsList />
      </Suspense>
    </div>
  );
}
