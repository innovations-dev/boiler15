"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  omittedOrganizationSelectSchema,
  organization,
  user,
} from "@/lib/db/schema";

export async function getOrganizationsAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session?.userId) {
    throw new Error("Unauthorized: User not found");
  }

  const _user = await db.query.user.findFirst({
    where: eq(user.id, session.session.userId),
  });

  if (!_user || _user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  const orgs = await db.select().from(organization);

  // Transform metadata to string before parsing
  const transformedOrgs = orgs.map((org) => ({
    ...org,
    metadata: org.metadata ?? "",
  }));

  return transformedOrgs.map((org) =>
    omittedOrganizationSelectSchema.parse(org)
  );
}
