import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getTeamMembersAction } from "@/app/dashboard/_actions/team";
import type { TeamMember } from "@/lib/db/schema";
import { queryKeys } from "@/lib/query/keys";
import { isQueryError } from "@/lib/query/types";

export function useTeam() {
  return useQuery<TeamMember[]>({
    queryKey: queryKeys.organizations.members("current"),
    queryFn: () => getTeamMembersAction(),
    meta: {
      onError: (error: unknown) => {
        const message = isQueryError(error)
          ? error.message
          : "Failed to load team members";
        toast.error(message);
      },
    },
  });
}
