import { Metadata } from "next";

import { Container } from "@/components/container";
import { ShellWithSidebar } from "@/components/layout/shell-with-sidebar";
import { generateMetadata } from "@/config/meta.config";
import { SiteFooter } from "../_components/layout/footer";
import { SiteHeader } from "../_components/layout/header";
import { DocsBreadcrumbs } from "./_components/docs-breadcrumbs";
import { DocsNavigation } from "./_components/docs-navigation";

export const metadata: Metadata = await generateMetadata({
  title: "Nextjs v15 Boilerplate Documentation",
  description:
    "Get started quickly with the Nextjs v15 Boilerplate. A modern, production-ready boilerplate for building web applications with Next.js 15.",
});

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <ShellWithSidebar
      header={<SiteHeader />}
      sidebar={<DocsNavigation />}
      footer={<SiteFooter />}
      breadcrumbs={<DocsBreadcrumbs />}
    >
      <Container>
        <div className="mx-auto max-w-[880px] py-6 lg:py-10">{children}</div>
      </Container>
    </ShellWithSidebar>
  );
}
