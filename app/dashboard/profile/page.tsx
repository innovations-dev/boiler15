import { Suspense } from "react";

import { ProfileForm } from "@/components/dashboard/profile/profile-form";
import { ProfileFormSkeleton } from "@/components/dashboard/profile/profile-form-skeleton";
import { ProfileInfo } from "@/components/dashboard/profile/profile-info";
import { ProfileSessions } from "@/components/dashboard/profile/profile-sessions";
import { ProfileSessionsSkeleton } from "@/components/dashboard/profile/profile-sessions-skeleton";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<ProfileFormSkeleton />}>
          <ProfileForm />
        </Suspense>
        <ProfileInfo />
      </div>

      <Suspense fallback={<ProfileSessionsSkeleton />}>
        <ProfileSessions />
      </Suspense>
    </div>
  );
}
