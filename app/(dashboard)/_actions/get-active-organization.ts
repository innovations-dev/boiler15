"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { member } from "@/lib/db/schema";
import type { Organization } from "@/lib/db/schema";

/**
 * Get the active organization for the current user.
 * This should only be called in protected routes where middleware ensures
 * the user is authenticated and has an active organization.
 */
export async function getActiveOrganization(): Promise<Organization> {
  try {
    const data = await auth.api.getSession({ headers: await headers() });

    // Session data is nested in data.session from better-auth
    if (!data?.user?.id) {
      console.log(
        "getActiveOrganization: No user found, redirecting to sign-in"
      );
      redirect("/sign-in");
    }

    // Get first organization the user is a member of
    const memberWithOrg = await db.query.member.findFirst({
      where: eq(member.userId, data.user.id),
      with: {
        organization: true,
      },
    });

    if (!memberWithOrg?.organization) {
      console.log(
        "getActiveOrganization: No organization found, redirecting to create one"
      );
      redirect("/organizations/new");
    }

    return memberWithOrg.organization;
  } catch (error) {
    console.error(
      "getActiveOrganization: Error fetching active organization",
      error
    );
    redirect("/sign-in");
  }
}
