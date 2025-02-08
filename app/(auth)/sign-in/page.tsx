import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/app/(auth)/_components/auth-form";
import { SocialAuthButtons } from "@/app/(auth)/_components/social-auth-buttons";
import { Spinner } from "@/components/spinner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignInHeading } from "../_components/heading";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <div className="container relative grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 mt-24 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Your App Name
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This platform has transformed how we handle our workflow.
                The authentication system is seamless and secure.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Suspense fallback={<Spinner />}>
              <SignInHeading />
            </Suspense>
            <AuthForm className="grid gap-6" />
            <SocialAuthButtons />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/policies/terms"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "px-0 underline underline-offset-4 hover:text-primary"
                )}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/policies/privacy"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "px-0 underline underline-offset-4 hover:text-primary"
                )}
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
