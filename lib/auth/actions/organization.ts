import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { organization } from "@/lib/db/schema";
import type { Organization } from "@/lib/db/schema";

export async function getActiveOrganization(
  userId: string
): Promise<Organization> {
  const org = (await db.query.organization.findFirst({
    where: eq(organization.id, userId),
  })) as Organization;

  return org;
}
