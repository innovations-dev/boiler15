"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getTeamMembers } from "@/lib/db/queries/team";
import { sessionSelectSchema } from "@/lib/db/schema";

export async function getTeamMembersAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const parsedSession = sessionSelectSchema.safeParse(session?.session);
  if (!parsedSession.success) {
    console.error(parsedSession.error);
    throw new Error("Invalid session /team, action");
  }

  if (!parsedSession.data.activeOrganizationId) {
    return []; // TODO: throw error if organization logic updates
  }

  return getTeamMembers(parsedSession.data.activeOrganizationId);
}
