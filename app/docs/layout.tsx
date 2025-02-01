import { Metadata } from "next";

import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { generateMetadata } from "@/config/meta.config";

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
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="container flex-1 items-start">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-[220px] border-r md:block lg:w-[240px]">
            <DocsSidebar />
          </aside>
          <div className="flex-1 md:pl-[220px] lg:pl-[240px]">
            <main className="relative py-6 lg:gap-10 lg:py-8">
              <div className="mx-auto w-full min-w-0">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
