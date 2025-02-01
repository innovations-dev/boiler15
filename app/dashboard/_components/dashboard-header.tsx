import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { OrganizationSwitcher } from "@/components/shared/organization-switcher";
import { auth } from "@/lib/auth";
import { UserSelectSchema } from "@/lib/db/schema";

export async function DashboardHeader() {
  const session = await auth.api.getSession({ headers: await headers() });

  const parsedUser = UserSelectSchema.safeParse(session?.user);
  if (!parsedUser.success) {
    console.log(parsedUser.error.message);
    redirect("/sign-in");
  }

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h2 className="text-lg font-medium">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Logged in as {session?.user?.name ?? session?.user?.email}
        </p>
      </div>
      <OrganizationSwitcher />
    </div>
  );
}
