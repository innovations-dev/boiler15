import Link from "next/link";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center antialiased">
      <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6 p-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent you a login link to your email address. Click the
            link to sign in to your account.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/sign-in">
            <Button variant="ghost" className="w-full">
              Back to sign in
            </Button>
          </Link>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Didn&apos;t receive an email?{" "}
            <Link href="/sign-in" className="underline hover:text-primary">
              Try again
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
