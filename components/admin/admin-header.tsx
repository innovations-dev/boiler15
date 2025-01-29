import { auth } from "@/lib/auth";

export async function AdminHeader() {
  const session = await auth.api.getSession({ headers: new Headers() });

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h2 className="text-lg font-medium">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Logged in as {session?.user?.email}
        </p>
      </div>
    </div>
  );
}
