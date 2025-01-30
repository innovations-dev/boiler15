import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { OrganizationSwitcher } from "./organization-switcher";

export async function DashboardHeader() {
  const session = await auth.api.getSession({ headers: await headers() });

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
