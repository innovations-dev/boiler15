import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { OrganizationSwitcher } from "@/components/shared/organization-switcher";
import { auth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants/roles";
import { userSelectSchema } from "@/lib/db/schema";

export async function AdminHeader() {
  const session = await auth.api.getSession({ headers: await headers() });

  const parsedUser = userSelectSchema.safeParse(session?.user);
  if (!parsedUser.success) {
    console.log(parsedUser.error.message);
    redirect("/sign-in");
  }

  if (parsedUser.data.role !== USER_ROLES.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h2 className="text-lg font-medium">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Logged in as {session?.user?.name}
        </p>
      </div>
    </div>
  );
}
