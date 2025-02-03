import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/app/dashboard/_components/dashboard-header";
import { DashboardNav } from "@/app/dashboard/_components/dashboard-nav";
import { auth } from "@/lib/auth";
import { sessionSelectSchema } from "@/lib/db/schema";
import { UnauthorizedError } from "@/lib/query/error";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const parsedSession = sessionSelectSchema.safeParse(session?.session);

    if (!parsedSession.success) {
      throw new UnauthorizedError("Invalid session");
    }

    return (
      <div className="container mx-auto mt-24 flex min-h-screen gap-8 px-4 py-8">
        <aside className="w-64 shrink-0">
          <Suspense fallback={<div>Loading navigation...</div>}>
            <DashboardNav />
          </Suspense>
        </aside>
        <main className="flex-1">
          <Suspense fallback={<div>Loading header...</div>}>
            <DashboardHeader />
          </Suspense>
          <div className="mt-8">{children}</div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Dashboard layout error:", error);
    redirect("/sign-in");
  }
}
