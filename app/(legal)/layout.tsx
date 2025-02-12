import { SiteFooter } from "../_components/layout/footer";
import { SiteHeader } from "../_components/layout/header";
import MDXLayout from "../_components/layout/mdx-layout";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <MDXLayout>
        <main className="flex-1">{children}</main>
      </MDXLayout>
      <SiteFooter />
    </div>
  );
}
