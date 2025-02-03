import { Suspense } from "react";

import { getTeamMembersAction } from "@/app/dashboard/_actions/team";
import { TeamListClient } from "@/app/dashboard/_components/team/team-list-client";
import { TeamListSkeleton } from "@/app/dashboard/_components/team/team-list-skeleton";
import { InviteMemberButton } from "../_components/team/invite-member-button";

export default async function TeamPage() {
  const initialMembers = await getTeamMembersAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <div>
          <InviteMemberButton />
        </div>
      </div>

      <Suspense fallback={<TeamListSkeleton />}>
        <TeamListClient initialMembers={initialMembers} />
      </Suspense>
    </div>
  );
}
