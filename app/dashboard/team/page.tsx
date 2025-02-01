import { Suspense } from "react";

import { InviteMemberButton } from "@/app/dashboard/_components/team/invite-member-button";
import { TeamList } from "@/app/dashboard/_components/team/team-list";
import { TeamListSkeleton } from "@/app/dashboard/_components/team/team-list-skeleton";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <InviteMemberButton />
      </div>
      <Suspense fallback={<TeamListSkeleton />}>
        <TeamList />
      </Suspense>
    </div>
  );
}
