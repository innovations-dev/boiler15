import { Metadata } from "next";

import { Container } from "@/components/container";
import { ShellWithSidebar } from "@/components/layout/shell-with-sidebar";
import { generateMetadata } from "@/config/meta.config";
import { SiteHeader } from "../../_components/layout/header";
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
    <ShellWithSidebar
      header={<SiteHeader />}
      sidebar={<DocsNavigation />}
      breadcrumbs={<DocsBreadcrumbs />}
    >
      <Container>
        <div className="mx-auto max-w-[880px] py-6 lg:py-10">{children}</div>
      </Container>
    </ShellWithSidebar>
  );
}
