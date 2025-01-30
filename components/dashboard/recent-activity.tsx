"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { authClient } from "@/lib/auth/auth-client";
import { Skeleton } from "../ui/skeleton";

export function RecentActivity() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => authClient.listSessions(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sessions?.data?.map((session) => (
        <div key={session.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              Session from {session.userAgent}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(session.createdAt), "PPP")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
