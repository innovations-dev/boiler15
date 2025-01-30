"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { getTeamMembersAction } from "@/app/actions/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { teamMemberSelectSchema } from "@/lib/db/queries/types";
import { TeamListSkeleton } from "./team-list-skeleton";
import { TeamMemberActions } from "./team-member-actions";

export function TeamList() {
  const { data: members, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamMembersAction(),
  });

  const parsedMembers = members?.map((m) => teamMemberSelectSchema.parse(m));

  if (isLoading) {
    return <TeamListSkeleton />;
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
        {parsedMembers?.map((member) => (
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
