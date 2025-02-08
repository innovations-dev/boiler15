import { Metadata } from "next";

import { generateMetadata } from "@/config/meta.config";
import { DocsBreadcrumbs } from "./_components/docs-breadcrumbs";
import { DocsNavigation } from "./_components/docs-navigation";

export const metadata: Metadata = await generateMetadata({
  title: "Documentation",
  description:
    "Learn how to build modern web applications with our comprehensive guides and tutorials.",
});

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="mt-[var(--header-height)] flex min-h-screen flex-col">
      <div className="container flex-1">
        <div className="grid grid-cols-[220px_1fr] gap-12">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-10">
            <DocsNavigation />
          </aside>
          <main className="relative py-6 lg:gap-10 lg:py-10">
            <div className="flex justify-end">
              <DocsBreadcrumbs />
            </div>
            <div className="mx-auto w-full min-w-0">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
