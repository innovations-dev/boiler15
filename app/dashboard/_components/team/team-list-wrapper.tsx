// Server Component
import { Suspense } from "react";

import { getTeamMembersAction } from "@/app/dashboard/_actions/team";
import { TeamListClient } from "./team-list-client";
import { TeamListSkeleton } from "./team-list-skeleton";

export async function TeamListWrapper() {
  const members = await getTeamMembersAction();

  return (
    <Suspense fallback={<TeamListSkeleton />}>
      <TeamListClient initialMembers={members} />
    </Suspense>
  );
}
