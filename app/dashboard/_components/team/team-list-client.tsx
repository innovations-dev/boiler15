"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

import { getTeamMembersAction } from "@/app/dashboard/_actions/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TeamMember } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";
import { TeamMemberActions } from "./team-member-actions";

interface TeamListClientProps {
  initialMembers: TeamMember[];
}

export function TeamListClient({ initialMembers }: TeamListClientProps) {
  const { data: members } = useQuery({
    queryKey: queryKeys.organizations.members("current"),
    queryFn: () => getTeamMembersAction(),
    initialData: initialMembers,
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load team members";
        toast.error(message);
      },
    },
  });

  if (!members?.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h2 className="mt-6 text-xl font-semibold">No team members</h2>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            You haven't invited any team members yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.user.image ?? undefined} />
                  <AvatarFallback>
                    {member.user.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{member.role || "Member"}</TableCell>
            <TableCell>
              <div className="flex w-fit items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Active
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(member.createdAt), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="text-right">
              <TeamMemberActions member={member} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
