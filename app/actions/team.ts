"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getTeamMembers } from "@/lib/db/queries/team";

export async function getTeamMembersAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session?.activeOrganizationId) {
    throw new Error("No active organization");
  }

  return getTeamMembers(session.session.activeOrganizationId);
}
