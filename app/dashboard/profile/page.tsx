import { Suspense } from "react";

import { ProfileForm } from "@/app/dashboard/_components/profile/profile-form";
import { ProfileFormSkeleton } from "@/app/dashboard/_components/profile/profile-form-skeleton";
import { ProfileInfo } from "@/app/dashboard/_components/profile/profile-info";
import { ProfileSessions } from "@/app/dashboard/_components/profile/profile-sessions";
import { ProfileSessionsSkeleton } from "@/app/dashboard/_components/profile/profile-sessions-skeleton";

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
