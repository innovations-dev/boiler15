import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NotFoundAnimation } from "./_components/not-found-animation";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      {/* Radial gradient background effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <NotFoundAnimation className="h-64 w-64" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold sm:text-5xl">Page not found</h1>
          <p className="text-muted-foreground">
            Oops! Looks like you&apos;ve wandered into the void.
          </p>
        </div>

        <Link href="/">
          <Button variant="default" size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
