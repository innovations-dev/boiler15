"use client";

import { format } from "date-fns";

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
import { useApiQuery } from "@/hooks/query/use-api-query";
import { teamMemberSelectSchema } from "@/lib/db/queries/types";
import type { TeamMember } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import type { ApiResponse } from "@/lib/schemas/api-types";
import { createApiResponseSchema } from "@/lib/schemas/api-types";
import { TeamMemberActions } from "./team-member-actions";

interface TeamListClientProps {
  initialMembers: ApiResponse<TeamMember[]>;
}

export function TeamListClient({ initialMembers }: TeamListClientProps) {
  const { data: members } = useApiQuery(
    queryKeys.team.members("current"),
    getTeamMembersAction,
    createApiResponseSchema(teamMemberSelectSchema.array()),
    {
      initialData: initialMembers,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    }
  );

  if (!members?.data?.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h2 className="mt-6 text-xl font-semibold">No team members</h2>
          <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            You haven&apos;t invited any team members yet.
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
        {members.data.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.user.image ?? undefined} />
                  <AvatarFallback>
                    {member.user.name?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium leading-none">{member.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="capitalize">{member.role}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset">
                Active
              </span>
            </TableCell>
            <TableCell>{format(member.createdAt, "MMM d, yyyy")}</TableCell>
            <TableCell className="text-right">
              <TeamMemberActions member={member} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
