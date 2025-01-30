"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { navigationRoutes } from "@/config/routes.config";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import { Button, buttonVariants } from "../ui/button";

function UserNavContent({ items }: { items: typeof navigationRoutes.auth }) {
  const router = useRouter();
  const { isPending, error, data } = authClient.useSession();

  if (isPending) {
    return <Spinner />;
  }

  if (error) {
    console.error(error);
    toast.error(error?.message || "Error");
    return <div>Error</div>;
  }

  if (!error && data?.session && data?.user) {
    return (
      <Button
        className={cn(buttonVariants({ variant: "ghost" }))}
        onClick={() => {
          authClient.signOut();
          router.push("/");
        }}
      >
        Sign out
      </Button>
    );
  }

  return (
    <>
      {items?.length
        ? items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
            >
              {item.name}
            </Link>
          ))
        : null}
    </>
  );
}

export function UserNav({ items }: { items: typeof navigationRoutes.auth }) {
  return (
    <Suspense fallback={<Spinner />}>
      <UserNavContent items={items} />
    </Suspense>
  );
}
