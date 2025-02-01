import { Metadata } from "next";

import { DocsSidebar } from "@/app/docs/_components/docs-sidebar";
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
      <div className="container flex-1">
        <div className="grid grid-cols-[220px_1fr] gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="fixed top-14 hidden h-[calc(100dvh-theme(spacing.footer)-3.5rem)] md:block">
            <DocsSidebar />
          </aside>
          <article className="relative col-start-2 w-full max-w-3xl py-10">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
