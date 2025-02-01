import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants/roles";
import { userSelectSchema } from "@/lib/db/schema";
import { ForbiddenError, UnauthorizedError } from "@/lib/query/error";

export async function guardAdminRoute() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const parsedUser = userSelectSchema.safeParse(session?.user);

    if (!parsedUser.success) {
      throw new UnauthorizedError("Invalid session");
    }

    if (parsedUser.data.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenError("Admin access required");
    }

    return parsedUser.data;
  } catch (error) {
    console.error("Admin guard error:", error);
    if (error instanceof ForbiddenError) {
      redirect("/dashboard");
    }
    redirect("/sign-in");
  }
}
