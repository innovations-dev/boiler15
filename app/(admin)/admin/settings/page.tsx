import { Suspense } from "react";

import { SettingsList } from "@/components/admin/settings/settings-list";
import { SettingsListSkeleton } from "@/components/admin/settings/settings-list-skeleton";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings
        </p>
      </div>
      <Suspense fallback={<SettingsListSkeleton />}>
        <SettingsList />
      </Suspense>
    </div>
  );
}
