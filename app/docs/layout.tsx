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
        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="fixed left-auto top-[calc(var(--header-height)+2rem)] hidden h-[calc(100vh-var(--header-height))] w-[220px] overflow-hidden border-r md:block">
            <DocsNavigation />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 py-6 pl-[calc(220px+3rem)] lg:py-10">
            <div className="mb-6 flex justify-end">
              <DocsBreadcrumbs />
            </div>
            <div className="mx-auto w-full min-w-0">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
