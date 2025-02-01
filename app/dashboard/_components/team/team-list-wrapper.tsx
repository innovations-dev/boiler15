// Server Component
import { getTeamMembersAction } from "@/app/dashboard/_actions/team";
import { TeamListClient } from "./team-list-client";

export async function TeamListWrapper() {
  const members = await getTeamMembersAction();

  return <TeamListClient initialMembers={members} />;
}
