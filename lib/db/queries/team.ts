"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { member, organization, user } from "@/lib/db/schema";

export async function getTeamMembers(organizationId: string) {
  return db
    .select({
      id: member.id,
      role: member.role,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
    })
    .from(member)
    .innerJoin(user, eq(member.userId, user.id))
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.organizationId, organizationId))
    .orderBy(desc(member.createdAt));
}
