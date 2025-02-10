import { Metadata } from "next";

import { Container } from "@/components/container";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="relative mt-[var(--header-height)] min-h-[calc(100vh-var(--header-height))]">
      <Container>
        <div className="mt-24 flex h-full w-full items-center justify-end">
          <div className="sticky top-[var(--header-height)] z-20 h-6 border-b bg-background">
            <DocsBreadcrumbs />
          </div>
        </div>
        <div className="relative flex gap-6">
          {/* Sidebar */}
          <aside className="sticky top-[calc(var(--header-height)+3.5rem)] hidden h-[calc(100vh-var(--header-height)-3.5rem)] w-60 shrink-0 overflow-y-auto border-r md:block">
            <ScrollArea className="h-full max-h-full">
              <DocsNavigation />
            </ScrollArea>
          </aside>

          {/* Main Content */}
          <main className="flex-1 py-6 lg:py-10">
            <div className="prose prose-invert mx-auto max-w-[880px]">
              {children}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
