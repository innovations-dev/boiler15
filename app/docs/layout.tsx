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
    <div className="container relative mx-auto mt-24 flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <DocsSidebar />
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="pb-12 pt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
