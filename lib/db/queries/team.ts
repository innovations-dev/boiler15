"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { member, organization, user } from "@/lib/db/schema";

/**
 * Retrieves all members of a specific organization with their user and organization details.
 *
 * @async
 * @param {string} organizationId - The unique identifier of the organization
 * @returns {Promise<Array<{
 *   id: string;
 *   role: string;
 *   createdAt: Date;
 *   updatedAt: Date | null;
 *   user: {
 *     id: string;
 *     name: string | null;
 *     email: string;
 *     image: string | null;
 *   };
 *   organization: {
 *     id: string;
 *     name: string;
 *   };
 * }>>} Array of team members with their associated user and organization information
 *
 * @example
 * // Fetch all members of an organization
 * const members = await getTeamMembers("org_123");
 *
 * // Access member details
 * members.forEach(member => {
 *   console.log(`${member.user.name} (${member.user.email}) - ${member.role}`);
 * });
 *
 * @throws Will throw an error if the database query fails
 *
 * @useCase
 * - Displaying team member lists in organization dashboards
 * - Managing team permissions and roles
 * - Generating team reports or analytics
 * - Implementing team member search functionality
 */
export async function getTeamMembers(organizationId: string) {
  const results = await db
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

  return results.map((result) => ({
    ...result,
    updatedAt: result.updatedAt || null,
  }));
}
