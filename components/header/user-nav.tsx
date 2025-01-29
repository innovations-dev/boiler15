"use client";

import { Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import { Button, buttonVariants } from "../ui/button";

function UserNavContent() {
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
        onClick={() => authClient.signOut()}
      >
        Sign out
      </Button>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
      >
        Get Started
      </Link>
    </>
  );
}

export function UserNav() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserNavContent />
    </Suspense>
  );
}
