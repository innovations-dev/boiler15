import { InviteMemberButton } from "@/app/dashboard/_components/team/invite-member-button";
import { TeamListWrapper } from "@/app/dashboard/_components/team/team-list-wrapper";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        <InviteMemberButton />
      </div>
      <TeamListWrapper />
    </div>
  );
}
